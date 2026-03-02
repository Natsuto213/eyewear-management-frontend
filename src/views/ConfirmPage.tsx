import React, { useMemo, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { apiGetMyInfo } from "../app/userApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import axios from "axios";

type PaymentMethod = "bank" | "cod" | "deposit";

interface LocationItem {
  code: number;
  name: string;
}

const ConfirmPage: React.FC = () => {
  const navigate = useNavigate();
  const [loadingUser, setLoadingUser] = useState(true);

  // --- STATE DỮ LIỆU THỰC TẾ ---
  const [cartItems, setCartItems] = useState<any[]>([]);

  // --- STATE FORM & ĐỊA CHỈ ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [provinces, setProvinces] = useState<LocationItem[]>([]);
  const [districts, setDistricts] = useState<LocationItem[]>([]);
  const [wards, setWards] = useState<LocationItem[]>([]);

  const [tempAddress, setTempAddress] = useState({
    provinceCode: "",
    provinceName: "",
    districtCode: "",
    districtName: "",
    wardCode: "",
    wardName: "",
    detail: "",
  });

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [payment, setPayment] = useState<PaymentMethod>("cod");
  const [isSaveToProfile, setIsSaveToProfile] = useState(false);

  // --- FETCH DATA (USER & SESSION STORAGE) ---
  useEffect(() => {
    const initData = async () => {
      try {
        const res = await apiGetMyInfo();
        const u = res?.result ?? res;
        if (u) {
          setForm((prev) => ({
            ...prev,
            fullName: u.name || "",
            phone: u.phone || "",
            email: u.email || "",
          }));
        }

        const savedCart = sessionStorage.getItem("selected_cart_items");
        if (savedCart) {
          setCartItems(JSON.parse(savedCart));
        }

        // Fetch provinces
        const provinceRes = await axios.get("https://api-eyewear.purintech.id.vn/ghn/provinces");
        const pData = provinceRes.data?.result || provinceRes.data; // Lấy mảng bên trong result

        if (Array.isArray(pData)) {
          setProvinces(pData);
        } else {
          setProvinces([]);
        }
      } catch (err) {
        console.error("Lỗi khởi tạo:", err);
        setProvinces([]); // Handle error gracefully
      } finally {
        setLoadingUser(false);
      }
    };
    initData();
  }, []);

  // --- LOGIC TÍNH TIỀN ---
  const subtotal = useMemo(() => {
    return cartItems.reduce((acc, it) => acc + (it.price * it.quantity), 0);
  }, [cartItems]);

  const shippingFee = (subtotal > 2000000 || subtotal === 0) ? 0 : 30000;
  const total = subtotal + shippingFee;

  // --- XỬ LÝ ĐỊA CHỈ ---
  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value; // Đây chính là ID số
    const pName = e.target.selectedOptions[0].text;
    
    if (!pId) return;

    setTempAddress({ 
      ...tempAddress, 
      provinceCode: pId, 
      provinceName: pName, 
      districtCode: "", 
      wardCode: "" 
    });

    try {
      const res = await axios.get(`https://api-eyewear.purintech.id.vn/ghn/districts?provinceId=${pId}`);
      const dData = res.data?.result || res.data;
      setDistricts(Array.isArray(dData) ? dData : []);
      setWards([]);
    } catch (err) {
      console.error("Lỗi load quận:", err);
    }
  };

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    // 1. Lấy ID trực tiếp từ value (vì Kiên đã để value={dId} ở phần render rồi)
    const dId = e.target.value; 
    if (!dId) return;

    // 2. Lấy tên Quận để hiển thị chuỗi địa chỉ sau này
    const dName = e.target.selectedOptions[0].text;

    // 3. Cập nhật state (Lưu ý: dùng districtCode để khớp với value={tempAddress.districtCode} trong Modal)
    setTempAddress({ 
      ...tempAddress, 
      districtCode: dId, 
      districtName: dName, 
      ward: "" 
    });

    try {
      // 4. Gọi API - Network chắc chắn sẽ nhảy ở đây
      const res = await axios.get(`https://api-eyewear.purintech.id.vn/ghn/wards?districtId=${dId}`);
      
      // 5. Lấy mảng result từ API
      const wData = res.data?.result || res.data;
      setWards(Array.isArray(wData) ? wData : []);
      
      console.log("Đã tải phường xã cho quận:", dName);
    } catch (err) {
      console.error("Lỗi khi gọi API phường xã:", err);
    }
  };

  const confirmNewAddress = () => {
    const { detail, wardName, districtName, provinceName } = tempAddress;
    // Kiểm tra xem các trường này có bị undefined không
    if(!detail || !wardName) {
      alert("Vui lòng nhập đầy đủ thông tin địa chỉ!");
      return;
    }
    const full = `${detail}, ${wardName}, ${districtName}, ${provinceName}`;
    setForm({ ...form, address: full });
    setIsModalOpen(false);
  };

  const handlePay = async () => {
    if (!form.address || form.address.includes("Vui lòng")) {
      alert("Vui lòng cập nhật địa chỉ giao hàng!");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Phiên đăng nhập hết hạn, vui lòng đăng nhập lại!");
        return;
      }

      // Logic đặt đơn hàng thực tế của Kiên ở đây
      console.log("Dữ liệu đơn hàng:", { customer: form, items: cartItems, total });
      
      // Nếu mọi thứ OK thì mới chuyển hướng
      navigate("/success");
    } catch (err: any) {
      console.error("Lỗi cập nhật địa chỉ:", err.response?.data || err.message);
      alert("Không thể cập nhật địa chỉ vào hồ sơ. Vui lòng kiểm tra lại!");
    }
  };

  const inputBase = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100";

  if (loadingUser) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-red-500 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-zinc-50 pb-12">
        <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            {/* THÔNG TIN GIAO HÀNG */}
            <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h1 className="mb-6 text-xl font-bold">Thông tin giao hàng</h1>
              <div className="grid gap-5 sm:grid-cols-2">
                <div>
                  <label className="mb-2 block text-sm font-medium">Họ và tên</label>
                  <input className={inputBase} value={form.fullName} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />
                </div>
                <div>
                  <label className="mb-2 block text-sm font-medium">Số điện thoại</label>
                  <input className={inputBase} value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Email</label>
                  <input className={`${inputBase} bg-zinc-50 cursor-not-allowed`} value={form.email} readOnly />
                </div>
                <div className="sm:col-span-2">
                  <label className="mb-2 block text-sm font-medium">Địa chỉ nhận hàng</label>
                  <div className="flex flex-col gap-3">
                    <textarea
                      className={`${inputBase} bg-zinc-50 min-h-[80px] cursor-default italic text-zinc-500`}
                      value={form.address || "Vui lòng bấm nút bên dưới để cập nhật địa chỉ..."}
                      readOnly
                    />
                    <button
                      type="button"
                      onClick={() => setIsModalOpen(true)}
                      className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition"
                    >
                      + Cập nhật địa chỉ
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* PHẦN THANH TOÁN */}
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-5 text-xl font-bold text-zinc-900 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
                Hình thức thanh toán
              </h2>

              <div className="grid gap-4 sm:grid-cols-3">
                {/* VNPAY */}
                <button
                  type="button"
                  onClick={() => setPayment("bank")}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                    payment === "bank" ? "border-red-500 bg-red-50 shadow-md" : "border-zinc-100 bg-white hover:border-zinc-200"
                  }`}
                >
                  <img src="https://sandbox.vnpayment.vn/paymentv2/Images/brands/logo-vnpay.png" alt="VNPAY" className="h-8 mb-2 object-contain" />
                  <span className={`text-xs font-bold ${payment === "bank" ? "text-red-700" : "text-zinc-500"}`}>VNPAY</span>
                  {payment === "bank" && (
                    <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm italic text-[10px]">
                      ✓
                    </div>
                  )}
                </button>

                {/* MoMo */}
                <button
                  type="button"
                  onClick={() => setPayment("deposit")}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                    payment === "deposit" ? "border-pink-500 bg-pink-50 shadow-md" : "border-zinc-100 bg-white hover:border-zinc-200"
                  }`}
                >
                  <div className="h-8 w-8 rounded-lg bg-[#A50064] flex items-center justify-center text-white font-bold text-lg mb-2 shadow-sm">M</div>
                  <span className={`text-xs font-bold ${payment === "deposit" ? "text-pink-700" : "text-zinc-500"}`}>MoMo</span>
                  {payment === "deposit" && (
                    <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm italic text-[10px]">
                      ✓
                    </div>
                  )}
                </button>

                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPayment("cod")}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                    payment === "cod" ? "border-orange-500 bg-orange-50 shadow-md" : "border-zinc-100 bg-white hover:border-zinc-200"
                  }`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mb-2 ${payment === "cod" ? "text-orange-600" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
                  </svg>
                  <span className={`text-xs font-bold ${payment === "cod" ? "text-orange-700" : "text-zinc-500"}`}>COD</span>
                  {payment === "cod" && (
                    <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm italic text-[10px]">
                      ✓
                    </div>
                  )}
                </button>
              </div>
            </div>
          </div>

          {/* CỘT PHẢI: TỔNG KẾT ĐƠN HÀNG */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sticky top-6">
              <h2 className="mb-4 text-lg font-bold text-zinc-900">Tóm tắt đơn hàng</h2>

              <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2">
                {cartItems.length > 0 ? (
                  cartItems.map((it) => (
                    <div key={it.cartItemId} className="flex gap-3 border-b border-zinc-100 pb-3 text-sm">
                      <img src={it.imgProduct} alt="" className="h-14 w-14 rounded-lg object-cover border" />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-zinc-800 line-clamp-1">{it.nameProduct}</p>
                        <p className="text-xs text-zinc-500">x{it.quantity}</p>
                      </div>
                      <div className="text-right font-bold">{(it.price * it.quantity).toLocaleString()}đ</div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-zinc-400 text-center py-4">Giỏ hàng trống</p>
                )}
              </div>

              <div className="mt-6 space-y-3 border-t pt-4 text-sm">
                <div className="flex justify-between text-zinc-600">
                  <span>Tạm tính</span>
                  <span>{subtotal.toLocaleString()}đ</span>
                </div>
                <div className="flex justify-between text-zinc-600">
                  <span>Phí vận chuyển</span>
                  <span>{shippingFee === 0 ? "Miễn phí" : `${shippingFee.toLocaleString()}đ`}</span>
                </div>
                <div className="flex justify-between items-center pt-3 border-t">
                  <span className="text-base font-bold">Tổng cộng</span>
                  <span className="text-2xl font-black text-red-600">{total.toLocaleString()}đ</span>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={cartItems.length === 0}
                className="mt-6 w-full rounded-2xl bg-red-600 py-4 font-bold text-white shadow-lg hover:bg-red-700 transition disabled:bg-zinc-300"
              >
                XÁC NHẬN ĐẶT HÀNG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL ĐỊA CHỈ */}
{isModalOpen && (
  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
    <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
      <h3 className="mb-6 text-xl font-bold">Địa chỉ giao hàng mới</h3>
      <div className="space-y-4">
        
        {/* CHỌN TỈNH */}
        <select 
          className={inputBase} 
          onChange={handleProvinceChange} 
          // Quan trọng: value phải là ID để đồng bộ với state
          value={tempAddress.provinceCode || ""} 
        >
          <option value="">Chọn Tỉnh/Thành</option>
          {provinces.map((p: any) => {
            // Kiểm tra các trường hợp tên trường ID của GHN
            const pId = p.ProvinceID || p.provinceId || p.code || p.id;
            const pName = p.ProvinceName || p.provinceName || p.name;
            return (
              <option key={pId} value={pId}>
                {pName}
              </option>
            );
          })}
        </select>

        {/* CHỌN QUẬN */}
        <select
          className={inputBase}
          onChange={handleDistrictChange}
          disabled={!districts.length}
          value={tempAddress.districtCode || ""}
        >
          <option value="">Chọn Quận/Huyện</option>
          {districts.map((d: any) => {
            const dId = d.DistrictID || d.districtId || d.code || d.id;
            const dName = d.DistrictName || d.districtName || d.name;
            return (
              <option key={dId} value={dId}>
                {dName}
              </option>
            );
          })}
        </select>

        {/* CHỌN PHƯỜNG */}
        <select
          className={inputBase}
          onChange={(e) => setTempAddress({ 
            ...tempAddress, 
            wardCode: e.target.value, 
            wardName: e.target.selectedOptions[0].text 
          })}
          disabled={!wards.length}
          value={tempAddress.wardCode || ""}
        >
          <option value="">Chọn Phường/Xã</option>
          {wards.map((w: any) => {
            const wId = w.WardCode || w.wardCode || w.code;
            const wName = w.WardName || w.wardName || w.name;
            return (
              <option key={wId} value={wId}>
                {wName}
              </option>
            );
          })}
        </select>

        <input
          className={inputBase}
          placeholder="Số nhà, tên đường..."
          onChange={(e) => setTempAddress({ ...tempAddress, detail: e.target.value })}
        />
      </div>
      <div 
  className="flex items-center gap-3 mt-4 p-2 cursor-pointer hover:bg-zinc-50 rounded-lg transition"
  onClick={() => setIsSaveToProfile(!isSaveToProfile)} // Khi click vào vùng này sẽ đảo filter
>
  <input 
    type="checkbox" 
    checked={isSaveToProfile} 
    readOnly // Vì mình handle click ở thẻ div cha
    className="h-5 w-5 rounded border-zinc-300 text-red-600 focus:ring-red-500"
  />
  <span className="text-sm font-medium text-zinc-600">
    Cập nhật địa chỉ này vào thông tin cá nhân
  </span>
</div>
      
      
      <div className="mt-8 flex gap-3">
        <button onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl bg-zinc-100 py-3 font-semibold">
          Hủy
        </button>
        <button onClick={confirmNewAddress} className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white">
          Xác nhận
        </button>
      </div>
    </div>
  </div>
)}
      
      <Footer />
    </>
  );
};

export default ConfirmPage;
