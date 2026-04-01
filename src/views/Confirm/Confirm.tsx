import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { api, apiGetMyInfo } from "@/lib/ApiService";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ShippingForm from "./ShippingForm";
import PaymentMethods from "./PaymentMethods";
import OrderSummary from "./OrderSummary";
import AddressModal from "./AddressModal";

type PaymentMethodType = "VNPAY" | "PAYOS" | "COD";

type ShippingFormErrors = {
  fullName?: string;
  phone?: string;
  email?: string;
  address?: string;
};

const ConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payment, setPayment] = useState<PaymentMethodType>("VNPAY");
  const [orderNote, setOrderNote] = useState("");
  const [formErrors, setFormErrors] = useState<ShippingFormErrors>({});
  const [selectedCodes, setSelectedCodes] = useState<{
    provinceCode?: string; provinceName?: string;
    districtCode?: string; districtName?: string;
    wardCode?: string; wardName?: string; street?: string;
  } | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", address: "" });
  const [isDepositOnly, setIsDepositOnly] = useState(false);

  const isPrescriptionOrder = cartItems.some(item => item.isPrescription === true);
  const needsDeposit = previewData?.depositRequired || isPrescriptionOrder;

  useEffect(() => {
    const initData = async () => {
      try {
        const res = await apiGetMyInfo();
        const u = res?.result ?? res;
        if (u) {
          setForm(prev => ({
            ...prev,
            fullName: u.name  || "",
            phone:    u.phone || "",
            email:    u.email || "",
            address:  u.address || "",
          }));
          if (u.provinceCode && u.districtCode && u.wardCode) {
            setSelectedCodes({
              provinceCode: u.provinceCode, provinceName: u.provinceName,
              districtCode: u.districtCode, districtName: u.districtName,
              wardCode: u.wardCode, wardName: u.wardName,
            });
          }
        }
        const saved = sessionStorage.getItem("selected_cart_items");
        if (saved) setCartItems(JSON.parse(saved));
      } catch (err) {
        console.error("Lỗi khởi tạo:", err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  const fetchPreview = async (
    itemIds: number[],
    payMethod: PaymentMethodType,
    codes: any,
    promoId: number | null = null
  ) => {
    if (itemIds.length === 0) return;
    try {
      const payload: any = {
        cartItemIds: itemIds,
        promotionId: promoId,
        paymentMethod: payMethod,
      };
      if (codes?.districtCode && codes?.wardCode) {
        payload.address = { districtCode: codes.districtCode, wardCode: codes.wardCode };
      }
      const res = await api.post("/checkout/preview", payload);
      if (res.data.result) setPreviewData(res.data.result);
    } catch (err) {
      console.error("❌ Lỗi API Preview:", err);
    }
  };

  const handleApplyPromotion = (promoId: number | null) => {
    const ids = cartItems.map((i: any) => i.cartItemId);
    fetchPreview(ids, payment, selectedCodes, promoId);
  };

  useEffect(() => {
    if (cartItems.length > 0) {
      const ids = cartItems.map((i: any) => i.cartItemId);
      fetchPreview(ids, payment, selectedCodes, previewData?.appliedPromotionId || null);
    }
  }, [cartItems, payment, selectedCodes]);

  const handleAddressConfirm = async (addr: string, isSave: boolean, codes: any) => {
    setForm(prev => ({ ...prev, address: addr }));
    setSelectedCodes(codes);
    // Xóa lỗi address khi user đã chọn địa chỉ
    setFormErrors(prev => ({ ...prev, address: "" }));
    if (isSave) {
      try {
        await api.put("/users/my-address", {
          street:       codes.street || addr.split(",")[0].trim(),
          provinceCode: Number(codes.provinceCode), provinceName: codes.provinceName,
          districtCode: Number(codes.districtCode), districtName: codes.districtName,
          wardCode:     String(codes.wardCode),     wardName:     codes.wardName,
        });
      } catch (err) {
        console.error("❌ Lỗi cập nhật địa chỉ:", err);
      }
    }
    setIsModalOpen(false);
  };

  // ─── Validate trước khi đặt hàng ─────────────────────────────────────────
  const validate = (): boolean => {
    const errs: ShippingFormErrors = {};

    if (!form.fullName.trim())
      errs.fullName = "Vui lòng nhập họ và tên";

    if (!form.phone.trim())
      errs.phone = "Vui lòng nhập số điện thoại";
    else if (!/^(0[3|5|7|8|9])\d{8}$/.test(form.phone))
      errs.phone = "Số điện thoại không hợp lệ";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Email không đúng định dạng";

    if (!form.address.trim())
      errs.address = "Vui lòng chọn địa chỉ giao hàng";

    setFormErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleOrder = async () => {
    if (!validate()) return; // dừng lại, hiện lỗi inline

    try {
      const payload: any = {
        cartItemIds:    cartItems.map(i => i.cartItemId),
        promotionId:    previewData?.appliedPromotionId || null,
        recipientName:  form.fullName,
        recipientPhone: form.phone,
        recipientEmail: form.email,
        note:           orderNote || "Giao hàng từ website",
        paymentMethod:  payment,
        address: {
          provinceCode: Number(selectedCodes?.provinceCode), provinceName: selectedCodes?.provinceName,
          districtCode: Number(selectedCodes?.districtCode), districtName: selectedCodes?.districtName,
          wardCode:     String(selectedCodes?.wardCode),     wardName:     selectedCodes?.wardName,
          street:       selectedCodes?.street,
        },
      };

      if (needsDeposit) {
        payload.payStrategy = isDepositOnly ? "DEPOSIT" : "FULL";
        if (isDepositOnly) {
          payload.depositPaymentMethod = payment === "COD" ? "VNPAY" : payment;
        }
      }

      const res = await api.post("/orders", payload);
      if (res.data.code === 1000) {
        const { paymentRedirectRequired, paymentUrl } = res.data.result;
        if (paymentRedirectRequired && paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          sessionStorage.removeItem("selected_cart_items");
          navigate("/success");
        }
      }
    } catch (err: any) {
      alert(err.response?.data?.message || "Đặt hàng thất bại!");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center italic text-zinc-400">
      Đang chuẩn bị...
    </div>
  );

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-50 pb-12 font-sans">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {/* Truyền thêm errors và setFormErrors xuống ShippingForm */}
            <ShippingForm
              form={form}
              setForm={setForm}
              onOpenModal={() => setIsModalOpen(true)}
              errors={formErrors}
              setErrors={setFormErrors}
            />
            <PaymentMethods
              payment={payment}
              setPayment={setPayment}
              total={previewData?.totalAmount || 0}
              depositAmount={previewData?.depositAmount || 0}
              needsDeposit={needsDeposit}
              isDepositOnly={isDepositOnly}
              setIsDepositOnly={setIsDepositOnly}
            />
          </div>
          <OrderSummary
            cartItems={cartItems}
            preview={previewData}
            onPay={handleOrder}
            availablePromotions={previewData?.availablePromotions || []}
            onApplyPromotion={handleApplyPromotion}
            note={orderNote}
            setNote={setOrderNote}
            needsDeposit={needsDeposit}
            isDepositOnly={isDepositOnly}
          />
        </div>
      </div>
      <AddressModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onConfirm={handleAddressConfirm}
      />
      <Footer />
    </>
  );
};

export default ConfirmPage;