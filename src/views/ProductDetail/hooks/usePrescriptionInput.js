/**
 * usePrescriptionInput.js
 * Chức năng:
 * - Gom toàn bộ state & handler phần "đơn thuốc":
 *   + method (manual/upload)
 *   + previewUrl (blob URL)
 *   + prescriptionData (8 field + file)
 *   + errors (validate onBlur)
 * - Cleanup blob URL để tránh memory leak
 */

import { useEffect, useState } from "react";
import { useRef } from "react";
import { DEFAULT_PRESCRIPTION_DATA } from "../utils/constants";

/**
 * usePrescriptionInput
 * @param {(value: string, type: string) => {isValid: boolean, message: string}} validateEyeDegree
 * @returns object API cho PrescriptionForm dùng
 */
export function usePrescriptionInput(productId, validateEyeDegree) {
  const STORAGE_KEY = "eyewear_prescription_draft_v1";

  const [method, setMethod] = useState(() => {
    try {
      if (!productId) return "manual";
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return "manual";
      const parsed = JSON.parse(raw);
      if (parsed?.productId === productId && parsed?.data) return parsed.data.method || "manual";
    } catch {
      /* ignore */
    }
    return "manual";
  });

  const [previewUrl, setPreviewUrl] = useState(() => {
    try {
      if (!productId) return null;
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      const parsed = JSON.parse(raw);
      if (parsed?.productId === productId && parsed?.data) return parsed.data.previewUrl || null;
    } catch {
      /* ignore */
    }
    return null;
  });

  const [prescriptionData, setPrescriptionData] = useState(() => {
    try {
      if (!productId) return DEFAULT_PRESCRIPTION_DATA;
      const raw = sessionStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT_PRESCRIPTION_DATA;
      const parsed = JSON.parse(raw);
      if (parsed?.productId === productId && parsed?.data) return { ...DEFAULT_PRESCRIPTION_DATA, ...(parsed.data.prescriptionData || {}) };
    } catch {
      /* ignore */
    }
    return DEFAULT_PRESCRIPTION_DATA;
  });
  const [errors, setErrors] = useState({});
  const prevBlobRef = useRef(null);

  /**
   * resetPrescription
   * - Reset toàn bộ dữ liệu đơn thuốc về mặc định (khi đổi id hoặc cần reset)
   */
  function resetPrescription() {
    setMethod("manual");
    setPreviewUrl(null);
    setPrescriptionData(DEFAULT_PRESCRIPTION_DATA);
    setErrors({});
    try {
      // Clear draft for current tab when resetting
      sessionStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore storage errors
    }
  }

  /**
   * updateField
   * - Cập nhật 1 field trong prescriptionData
   */
  function updateField(field, value) {
    setPrescriptionData((prev) => ({ ...prev, [field]: value }));
  }

  /**
   * handleFileChange
   * - Khi user chọn ảnh đơn thuốc:
   *   + tạo blob URL để preview
   *   + lưu file vào prescriptionData
   *   + chuyển method sang upload
   */
  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    // Revoke previous blob URL (if any) to avoid memory leak
    if (prevBlobRef.current) {
      try {
        URL.revokeObjectURL(prevBlobRef.current);
      } catch {
        /* ignore */
      }
      prevBlobRef.current = null;
    }

    // Create a blob URL for fast preview (will be revoked when replaced/unmounted)
    const blobUrl = URL.createObjectURL(file);
    setPreviewUrl(blobUrl);
    prevBlobRef.current = blobUrl;

    // Read file as data URL so we can persist across refresh (sessionStorage)
    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      // store data URL (not the File object) so it survives refresh
      updateField("fileDataUrl", dataUrl);
      updateField("fileName", file.name);
      setMethod("upload");
    };
    reader.readAsDataURL(file);
  }

  /**
   * handleBlurAction
   * - Validate khi user rời ô input (onBlur)
   * - Nếu hợp lệ => xóa lỗi (""), sai => set message
   */
  function handleBlurAction(field, value, type) {
    const result = validateEyeDegree(value, type);
    setErrors((prev) => ({
      ...prev,
      [field]: result.isValid ? "" : result.message,
    }));
  }

  // (Loading from sessionStorage handled during initial state setup)

  // Persist draft to sessionStorage whenever relevant state changes
  useEffect(() => {
    if (!productId) return;
    try {
      const toSave = {
        productId,
        data: {
          method,
          prescriptionData: {
            // avoid storing File objects
            ...prescriptionData,
            file: undefined,
          },
          previewUrl,
        },
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
    } catch {
      // ignore quota errors
    }
  }, [productId, method, prescriptionData, previewUrl]);

  // Cleanup blob URL on unmount to avoid memory leak
  useEffect(() => {
    return () => {
      if (prevBlobRef.current) {
        try {
          URL.revokeObjectURL(prevBlobRef.current);
        } catch {
          /* ignore */
        }
        prevBlobRef.current = null;
      }
    };
  }, []);

  return {
    method,
    setMethod,
    previewUrl,
    prescriptionData,
    errors,
    updateField,
    handleFileChange,
    handleBlurAction,
    resetPrescription,
  };
}
