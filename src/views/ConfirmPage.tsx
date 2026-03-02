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
    province: "",
    district: "",
    ward: "",
    detail: "",
  });

  const [form, setForm] = useState({
    fullName: "",
    phone: "",
    email: "",
    address: "",
  });

  const [payment, setPayment] = useState<PaymentMethod>("cod");

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

        const provinceRes = await axios.get("https://provinces.open-api.vn/api/p/");
        setProvinces(provinceRes.data);
      } catch (err) {
        console.error("Lỗi khởi tạo:", err);
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
    const selected = e.target.selectedOptions[0];
    const code = selected.getAttribute("data-code");
    const name = e.target.value;
    setTempAddress({ ...tempAddress, province: name, district: "", ward: "" });
    setWards([]);
    if (code) {
      const res = await axios.get(`https://provinces.open-api.vn/api/p/${code}?depth=2`);
      setDistricts(res.data.districts);
    }
  };

  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.selectedOptions[0];
    const code = selected.getAttribute("data-code");
    const name = e.target.value;
    setTempAddress({ ...tempAddress, district: name, ward: "" });
    if (code) {
      const res = await axios.get(`https://provinces.open-api.vn/api/d/${code}?depth=2`);
      setWards(res.data.wards);
    }
  };

  const confirmNewAddress = () => {
    const full = `${tempAddress.detail}, ${tempAddress.ward}, ${tempAddress.district}, ${tempAddress.province}`;
    setForm({ ...form, address: full });
    setIsModalOpen(false);
  };

  const handlePay = () => {
    if (!form.address || form.address.includes("Vui lòng")) {
      alert("Vui lòng cập nhật địa chỉ giao hàng!");
      return;
    }
    console.log("Dữ liệu đơn hàng:", { customer: form, items: cartItems, total });
    navigate("/success");
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
                <button
                  type="button"
                  onClick={() => setPayment("bank")}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                    payment === "bank" ? "border-red-500 bg-red-50 shadow-md" : "border-zinc-100 bg-white hover:border-zinc-200"
                  }`}
                >
                  <img src="https://sandbox.vnpayment.vn/paymentv2/Images/brands/logo-vnpay.png" alt="VNPAY" className="h-8 mb-2 object-contain" />
                  <span className={`text-xs font-bold ${payment === "bank" ? "text-red-700" : "text-zinc-500"}`}>VNPAY</span>
                  {payment === "bank" && <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm italic text-[10px]">✓</div>}
                </button>

                <button
                  type="button"
                  onClick={() => setPayment("deposit")}
                  className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
                    payment === "deposit" ? "border-pink-500 bg-pink-50 shadow-md" : "border-zinc-100 bg-white hover:border-zinc-200"
                  }`}
                >
                  <div className="h-8 w-8 rounded-lg bg-[#A50064] flex items-center justify-center text-white font-bold text-lg mb-2 shadow-sm">M</div>
                  <span className={`text-xs font-bold ${payment === "deposit" ? "text-pink-700" : "text-zinc-500"}`}>MoMo</span>
                  {payment === "deposit" && <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm italic text-[10px]">✓</div>}
                </button>

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
                  {payment === "cod" && <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm italic text-[10px]">✓</div>}
                </button>
              </div>

              <div className="mt-6">
                {payment === "bank" && (
                  <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl bg-zinc-50 p-5 border border-dashed border-zinc-300">
                    <p className="text-sm font-bold text-zinc-900 mb-3">Thanh toán qua VNPAY:</p>
                    <ul className="text-xs text-zinc-600 space-y-2 list-disc pl-4">
                      <li>Hỗ trợ thẻ nội địa và quốc tế.</li>
                      <li>Thanh toán nhanh qua QR code.</li>
                    </ul>
                  </div>
                )}
                {payment === "deposit" && (
                  <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl bg-zinc-50 p-5 border border-dashed border-zinc-300 text-xs">
                    <p className="font-bold mb-2">Chuyển qua ví MOMO:</p>
                    <p>Số điện thoại: <b>09x xxx xxxx</b></p>
                    <p>Chủ TK: <b>NGUYEN VAN KIEN</b></p>
                  </div>
                )}
                {payment === "cod" && (
                  <div className="animate-in fade-in slide-in-from-top-2 rounded-2xl bg-zinc-50 p-5 border border-dashed border-zinc-300">
                    {total > 5000000 ? (
                      <div className="space-y-3">
                        <p className="font-bold text-red-600 text-sm">Cần đặt cọc 20%: {(total * 0.2).toLocaleString()}đ</p>
                        <div className="flex gap-2">
                          <button className="flex-1 rounded-lg bg-white border py-2 text-[10px] font-bold">CỌC VNPAY</button>
                          <button className="flex-1 rounded-lg bg-white border py-2 text-[10px] font-bold">CỌC MOMO</button>
                        </div>
                      </div>
                    ) : (
                      <p className="text-sm text-zinc-600 italic">Thanh toán tiền mặt khi nhận hàng.</p>
                    )}
                  </div>
                )}
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
                      <div className="text-right font-bold">
                        {(it.price * it.quantity).toLocaleString()}đ
                      </div>
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
              <select className={inputBase} onChange={handleProvinceChange} value={tempAddress.province}>
                <option value="">Chọn Tỉnh/Thành</option>
                {provinces.map(p => <option key={p.code} data-code={p.code} value={p.name}>{p.name}</option>)}
              </select>
              <select className={inputBase} onChange={handleDistrictChange} disabled={!tempAddress.province} value={tempAddress.district}>
                <option value="">Chọn Quận/Huyện</option>
                {districts.map(d => <option key={d.code} data-code={d.code} value={d.name}>{d.name}</option>)}
              </select>
              <select className={inputBase} onChange={(e) => setTempAddress({...tempAddress, ward: e.target.value})} disabled={!tempAddress.district} value={tempAddress.ward}>
                <option value="">Chọn Phường/Xã</option>
                {wards.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
              </select>
              <input className={inputBase} placeholder="Số nhà, tên đường..." onChange={(e) => setTempAddress({...tempAddress, detail: e.target.value})} />
            </div>
            <div className="mt-8 flex gap-3">
              <button onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl bg-zinc-100 py-3 font-semibold">Hủy</button>
              <button onClick={confirmNewAddress} className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white">Xác nhận</button>
            </div>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
};

export default ConfirmPage;