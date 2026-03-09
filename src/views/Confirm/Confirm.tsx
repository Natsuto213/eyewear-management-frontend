import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import { apiGetMyInfo } from "@/lib/userApi";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import ShippingForm from "./ShippingForm";
import PaymentMethods from "./PaymentMethods";
import OrderSummary from "./OrderSummary";
import AddressModal from "./AddressModal";

type PaymentMethodType = "VNPAY" | "PAYOS" | "COD";

const ConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);

  const [cartItems, setCartItems] = useState<any[]>([]);
  const [previewData, setPreviewData] = useState<any>(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [payment, setPayment] = useState<PaymentMethodType>("COD");
  const [orderNote, setOrderNote] = useState(""); 
  const [selectedCodes, setSelectedCodes] = useState<{
    provinceCode?: string, provinceName?: string,
    districtCode?: string, districtName?: string,
    wardCode?: string, wardName?: string, street?: string
  } | null>(null);

  const [form, setForm] = useState({ fullName: "", phone: "", email: "", address: "" });

  // --- LOGIC KIỂM TRA CỌC (PRESCRIPTION HOẶC > 5TR) ---
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
            fullName: u.name || "",
            phone: u.phone || "",
            email: u.email || "",
            address: u.address || "",
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
      } catch (err) { console.error("Lỗi khởi tạo:", err); }
      finally { setLoading(false); }
    };
    initData();
  }, []);

  const fetchPreview = async (itemIds: number[], payMethod: PaymentMethodType, codes: any, promoId: number | null = null) => {
    if (itemIds.length === 0) return;
    try {
      const token = localStorage.getItem("access_token");
      const payload: any = {
        cartItemIds: itemIds,
        promotionId: promoId,
        paymentMethod: payMethod,
      };
      if (codes?.districtCode && codes?.wardCode) {
        payload.address = { districtCode: codes.districtCode, wardCode: codes.wardCode };
      }
      const res = await axios.post("https://api-eyewear.purintech.id.vn/checkout/preview", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.data.result) setPreviewData(res.data.result);
    } catch (err) { console.error("❌ Lỗi API Preview:", err); }
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
    if (isSave) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.put("https://api-eyewear.purintech.id.vn/users/my-address", {
          street: codes.street || addr.split(',')[0].trim(),
          provinceCode: Number(codes.provinceCode), provinceName: codes.provinceName,
          districtCode: Number(codes.districtCode), districtName: codes.districtName,
          wardCode: String(codes.wardCode), wardName: codes.wardName,
        }, { headers: { Authorization: `Bearer ${token}` } });
      } catch (err) { console.error("❌ Lỗi cập nhật địa chỉ:", err); }
    }
    setIsModalOpen(false);
  };

  const handleOrder = async () => {
    if (!form.fullName || !form.phone) return alert("Vui lòng điền đủ thông tin!");
    try {
      const token = localStorage.getItem("access_token");
      const payload: any = {
        cartItemIds: cartItems.map(i => i.cartItemId),
        promotionId: previewData?.appliedPromotionId || null,
        recipientName: form.fullName, recipientPhone: form.phone, recipientEmail: form.email,
        note: orderNote || "Giao hàng từ website",
        paymentMethod: payment,
        address: {
          provinceCode: Number(selectedCodes?.provinceCode), provinceName: selectedCodes?.provinceName,
          districtCode: Number(selectedCodes?.districtCode), districtName: selectedCodes?.districtName,
          wardCode: String(selectedCodes?.wardCode), wardName: selectedCodes?.wardName, street: selectedCodes?.street
        }
      };

      // Tự động gán VNPAY làm phương thức cọc nếu đơn hàng yêu cầu cọc và đang chọn COD
      if (needsDeposit && payment === "COD") {
        payload.depositPaymentMethod = "VNPAY";
      }

      const res = await axios.post("https://api-eyewear.purintech.id.vn/orders", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.code === 1000) {
        const { paymentRedirectRequired, paymentUrl } = res.data.result;
        if (paymentRedirectRequired && paymentUrl) {
          window.location.href = paymentUrl;
        } else {
          sessionStorage.removeItem("selected_cart_items");
          navigate("/success");
        }
      }
    } catch (err: any) { alert(err.response?.data?.message || "Đặt hàng thất bại!"); }
  };

  if (loading) return <div className="flex h-screen items-center justify-center italic text-zinc-400">Đang chuẩn bị...</div>;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-50 pb-12 font-sans">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <ShippingForm form={form} setForm={setForm} onOpenModal={() => setIsModalOpen(true)} />
            <PaymentMethods 
              payment={payment} 
              setPayment={setPayment} 
              total={previewData?.totalAmount || 0} 
              // Thay vì truyền isPrescription, hãy truyền needsDeposit để đồng bộ với OrderSummary
              needsDeposit={needsDeposit} 
            />
          </div>
          <OrderSummary
            cartItems={cartItems} preview={previewData} onPay={handleOrder}
            availablePromotions={previewData?.availablePromotions || []}
            onApplyPromotion={handleApplyPromotion}
            note={orderNote} setNote={setOrderNote}
            needsDeposit={needsDeposit}
          />
        </div>
      </div>
      <AddressModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onConfirm={handleAddressConfirm} />
      <Footer />
    </>
  );
};

export default ConfirmPage;