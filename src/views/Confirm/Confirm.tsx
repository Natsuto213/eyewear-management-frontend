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
  const [selectedCodes, setSelectedCodes] = useState<{ provinceCode?: string; provinceName?: string; districtCode: string; districtName: string; wardCode: string, wardName: string } | null>(null);
  const [form, setForm] = useState({ fullName: "", phone: "", email: "", address: "" });

  // --- 1. USEEFFECT KHỞI TẠO DỮ LIỆU ---
  useEffect(() => {
    const initData = async () => {
      try {
        // Lấy thông tin User
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
              provinceCode: u.provinceCode,
              provinceName: u.provinceName,
              districtCode: u.districtCode,
              districtName: u.districtName,
              wardCode: u.wardCode,
              wardName: u.wardName,
            });
          }
        }

        // Lấy giỏ hàng từ Session
        const saved = sessionStorage.getItem("selected_cart_items");
        if (saved) {
          const items = JSON.parse(saved);
          setCartItems(items);
        }
      } catch (err) {
        console.error("Lỗi khởi tạo:", err);
      } finally {
        setLoading(false);
      }
    };
    initData();
  }, []);

  // --- 2. HÀM GỌI API PREVIEW (SỬA LỖI 401 VÀ KEY TOKEN) ---
  const fetchPreview = async (itemIds: number[], payMethod: PaymentMethodType, codes: any) => {
    if (itemIds.length === 0) return;
    try {
      // FIX: Dùng đúng key 'access_token' từ ảnh Application của Kiên
      const token = localStorage.getItem("access_token");

      const payload: any = {
        cartItemIds: itemIds,
        promotionId: null,
        paymentMethod: payMethod,
      };

      if (codes?.districtCode && codes?.wardCode) {
        payload.address = {
          districtCode: codes.districtCode,
          wardCode: codes.wardCode
        };
      }

      const res = await axios.post("https://api-eyewear.purintech.id.vn/checkout/preview", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.data.result) {
        setPreviewData(res.data.result);
        console.log("✅ Preview Update:", res.data.result);
      }
    } catch (err) {
      console.error("❌ Lỗi API Preview (401?):", err);
    }
  };

  // --- 3. THEO DÕI THAY ĐỔI ĐỂ TỰ ĐỘNG CẬP NHẬT TIỀN ---
  useEffect(() => {
    if (cartItems.length > 0) {
      const ids = cartItems.map((i: any) => i.cartItemId);
      fetchPreview(ids, payment, selectedCodes);
    }
  }, [cartItems, payment, selectedCodes]);

  // --- 4. HÀM XỬ LÝ KHI XÁC NHẬN ĐỊA CHỈ TỪ MODAL ---
  const handleAddressConfirm = async (addr: string, isSave: boolean, codes: any) => {
    setForm(prev => ({ ...prev, address: addr }));
    setSelectedCodes(codes);

    if (isSave) {
      try {
        const token = localStorage.getItem("access_token");

        // FIX: Lấy dữ liệu trực tiếp từ tempAddress mà Modal truyền qua codes
        // Điều này đảm bảo không có trường nào bị "" hoặc undefined
        const bodyUpdate = {
          street: codes.street || addr.split(',')[0].trim(),
          provinceCode: Number(codes.provinceCode),
          provinceName: codes.provinceName,
          districtCode: Number(codes.districtCode),
          districtName: codes.districtName,
          wardCode: String(codes.wardCode),
          wardName: codes.wardName
        };

        console.log("🚀 Payload chuẩn bị gửi lên:", bodyUpdate);

        const res = await axios.put("https://api-eyewear.purintech.id.vn/users/my-address",
          bodyUpdate,
          {
            headers: {
              Authorization: `Bearer ${token}`
            }
          }
        );

        if (res.data.code === 1000) {
          console.log("✅ API my-address thành công!");
        }
      } catch (err: any) {
        console.error("❌ Chi tiết lỗi từ Server:", err.response?.data);
        // Nếu vẫn lỗi 1001, hãy nhìn vào console xem trường nào đang bị undefined/null
      }
    }
    setIsModalOpen(false);
  };

  // --- 5. HÀM ĐẶT HÀNG ---
  const handleOrder = async () => {
    if (!form.fullName || !form.phone) {
      return alert("Vui lòng điền đầy đủ tên và số điện thoại người nhận!");
    }

    if (!selectedCodes || !selectedCodes.provinceCode || !selectedCodes.districtCode || !selectedCodes.wardCode) {
      return alert("Hệ thống thiếu thông tin mã vùng (Tỉnh/Huyện/Xã). Vui lòng nhấn nút 'Thay đổi' để chọn lại địa chỉ giao hàng cho chính xác nhé!");
    }

    try {
      const token = localStorage.getItem("access_token");
      const payload: any = {
        cartItemIds: cartItems.map(i => i.cartItemId),
        promotionId: null,
        recipientName: form.fullName,
        recipientPhone: form.phone,
        recipientEmail: form.email,
        note: "Giao hàng từ web",
        paymentMethod: payment,

        address: {
          provinceCode: Number(selectedCodes.provinceCode),
          provinceName: selectedCodes.provinceName,
          districtCode: Number(selectedCodes.districtCode),
          districtName: selectedCodes.districtName,
          wardCode: String(selectedCodes.wardCode),
          wardName: selectedCodes.wardName,
        }
      };

      // Xử lý cọc nếu cần
      if (previewData?.depositRequired && payment === "COD") {
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
    } catch (err: any) {
      alert(err.response?.data?.message || "Đặt hàng thất bại!");
    }
  };

  if (loading) return (
    <div className="flex h-screen items-center justify-center italic text-zinc-400">Đang chuẩn bị đơn hàng...</div>
  );

  return (
    <>
      {console.log(payment)}
      <Navbar />
      <div className="min-h-screen bg-zinc-50 pb-12">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <ShippingForm
              form={form}
              setForm={setForm}
              onOpenModal={() => setIsModalOpen(true)}
            />
            <PaymentMethods
              payment={payment}
              setPayment={setPayment}
              total={previewData?.totalAmount || 0}
            />
          </div>
          <OrderSummary
            cartItems={cartItems}
            preview={previewData}
            onPay={handleOrder}
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