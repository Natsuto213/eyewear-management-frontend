/**
 * usePrescription.js
 * ===================
 * Custom Hook: Quản lý toàn bộ state và logic của form đơn thuốc mắt.
 *
 * Bao gồm:
 *  - Dữ liệu đơn thuốc (5 thông số x 2 mắt = 10 fields)
 *  - Lỗi validate từng field (hiện ngay khi người dùng rời khỏi ô input - onBlur)
 *  - Hàm reset khi đổi sản phẩm
 *
 * Lý do tách ra hook riêng:
 *  - Giữ index.jsx gọn, dễ đọc
 *  - Logic validate không lẫn vào UI
 *
 * Ghi chú về hiệu năng:
 *  - Không dùng useCallback vì các component con (PrescriptionForm...)
 *    không bọc React.memo → useCallback không có tác dụng gì ở đây.
 *  - Nếu sau này cần tối ưu: thêm React.memo vào component con TRƯỚC,
 *    rồi mới thêm useCallback vào đây.
 */

import { useEffect, useState } from "react";
import { DEFAULT_PRESCRIPTION, PRESCRIPTION_FIELDS } from "../utils/constants";
import { validateField } from "../utils/validate";

export function usePrescription() {
    // ─── State: dữ liệu đơn thuốc ────────────────────────────────────────────
    // Object chứa 10 field: leftSPH, leftCYL, ... rightPD
    const [data, setData] = useState(() => {
        const jsonPrescriptionData = sessionStorage.getItem("prescription_data")
        return jsonPrescriptionData ? JSON.parse(jsonPrescriptionData) : DEFAULT_PRESCRIPTION;
    });

    useEffect(() => {
        sessionStorage.setItem("prescription_data", JSON.stringify(data));
    }, [data]);

    // ─── State: lỗi validate từng field ──────────────────────────────────────
    // Ví dụ: { leftSPH: "Từ -20.00 đến +10.00", rightCYL: "" }
    const [errors, setErrors] = useState({});

    /**
     * updateField - Cập nhật giá trị 1 field trong đơn thuốc
     * Gọi khi người dùng đang gõ (onChange)
     *
     * @param {string} fieldName - Tên field, ví dụ "leftSPH"
     * @param {string} value     - Giá trị mới người dùng vừa gõ
     */
    function updateField(fieldName, value) {
        setData((prev) => ({ ...prev, [fieldName]: value }));

        // Xóa lỗi ngay khi người dùng bắt đầu sửa ô đó
        setErrors((prev) => ({ ...prev, [fieldName]: "" }));
    }

    /**
     * validateOnBlur - Validate 1 field khi người dùng rời khỏi ô input (onBlur)
     * Hiện thông báo lỗi ngay bên dưới ô đó nếu sai.
     *
     * @param {string} fieldName - Tên field đầy đủ, ví dụ "leftCYL"
     * @param {string} fieldKey  - Loại field: "SPH" | "CYL" | "AXIS" | "ADD" | "PD"
     * @param {string} side      - "left" | "right" (để lấy giá trị CYL tương ứng khi validate AXIS)
     */
    function validateOnBlur(fieldName, fieldKey, side) {
        const value = data[fieldName];
        // Khi validate AXIS, cần biết CYL của cùng bên có ≠ 0 không
        const cylValue = data[`${side}CYL`];

        const result = validateField(fieldKey, value, cylValue);

        setErrors((prev) => ({ ...prev, [fieldName]: result.message }));
    }

    /**
     * validateAll - Validate toàn bộ form trước khi submit
     * Trả về true nếu tất cả hợp lệ, false nếu có bất kỳ lỗi nào.
     * Đồng thời cập nhật state errors để hiển thị tất cả lỗi cùng lúc.
     */
    function validateAll() {
        const sides = ["left", "right"];
        const newErrors = {};
        let isAllValid = true;

        sides.forEach((side) => {
            PRESCRIPTION_FIELDS.forEach(({ key }) => {
                const fieldName = `${side}${key}`;
                const cylValue = data[`${side}CYL`];
                const result = validateField(key, data[fieldName], cylValue);

                if (!result.isValid) {
                    newErrors[fieldName] = result.message;
                    isAllValid = false;
                }
            });
        });

        setErrors(newErrors);
        return isAllValid;
    }

    /**
     * resetPrescription - Đặt lại form về giá trị mặc định (0 hết)
     * Gọi khi người dùng chuyển sang xem sản phẩm khác (id thay đổi).
     * Đồng thời xóa luôn localStorage để lần vào sản phẩm mới không bị
     * giữ lại đơn thuốc cũ từ sản phẩm trước.
     */
    function resetPrescription() {
        sessionStorage.removeItem("prescription_data"); // Xóa trước để useEffect không ghi lại giá trị cũ
        setData(DEFAULT_PRESCRIPTION);
        setErrors({});
    }

    return {
        data,             // Dữ liệu đơn thuốc hiện tại
        errors,           // Lỗi validate từng field
        updateField,      // Hàm cập nhật 1 field
        validateOnBlur,   // Hàm validate khi blur
        validateAll,      // Hàm validate toàn bộ
        resetPrescription, // Hàm reset form
    };
}
