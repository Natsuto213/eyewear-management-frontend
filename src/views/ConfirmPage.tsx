import React, { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
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

  // --- STATE ---
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
  const [discountValue, setDiscountValue] = useState<number>(0);

  // --- FETCH DATA ---
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

  // --- LOGIC ADDRESS ---
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

  // --- BILL CALCULATION ---
  const items = useMemo(() => [
    { id: "1", name: "Sản phẩm A", price: 129, qty: 1 },
    { id: "2", name: "Sản phẩm B", price: 89, qty: 2 },
  ], []);

  const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
  const shippingFee = subtotal >= 200 ? 0 : 15;
  const total = Math.max(0, subtotal - discountValue) + shippingFee;

  const handlePay = () => {
    if (!form.address || form.address.includes("Chưa có")) {
      alert("Vui lòng cập nhật địa chỉ giao hàng!");
      return;
    }
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
          
          {/* CỘT TRÁI */}
          <div className="space-y-6">
            {/* PHẦN THÔNG TIN GIAO HÀNG */}
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
            <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
              <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                Hình thức thanh toán
              </h2>

              <div className="grid gap-3 sm:grid-cols-2">
                {/* VNPAY */}
                <button
                  type="button"
                  onClick={() => setPayment("bank")}
                  className={[
                    "group rounded-2xl border p-4 text-left transition",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    payment === "bank"
                      ? "border-red-500 bg-red-50 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-zinc-900">VNPAY</div>
                      <div className="mt-1 text-sm text-zinc-600">
                        Thanh toán qua ngân hàng/QR
                      </div>
                    </div>
                    <div
                      className={[
                        "mt-1 h-4 w-4 rounded-full border transition",
                        payment === "bank"
                          ? "border-red-500 bg-red-500"
                          : "border-zinc-300 bg-white group-hover:border-zinc-400",
                      ].join(" ")}
                    />
                  </div>
                </button>

                {/* COD */}
                <button
                  type="button"
                  onClick={() => setPayment("cod")}
                  className={[
                    "group rounded-2xl border p-4 text-left transition",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    payment === "cod"
                      ? "border-red-500 bg-red-50 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-zinc-900">COD</div>
                      <div className="mt-1 text-sm text-zinc-600">
                        Thanh toán khi nhận hàng
                      </div>
                    </div>
                    <div
                      className={[
                        "mt-1 h-4 w-4 rounded-full border transition",
                        payment === "cod"
                          ? "border-red-500 bg-red-500"
                          : "border-zinc-300 bg-white group-hover:border-zinc-400",
                      ].join(" ")}
                    />
                  </div>
                </button>

                {/* MOMO (Hiển thị kiểu Deposit) */}
                <button
                  type="button"
                  onClick={() => setPayment("deposit")}
                  className={[
                    "group rounded-2xl border p-4 text-left transition",
                    "hover:-translate-y-0.5 hover:shadow-md",
                    payment === "deposit"
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-zinc-200 bg-white hover:border-zinc-300",
                  ].join(" ")}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="font-semibold text-zinc-900">MOMO</div>
                      <div className="mt-1 text-sm text-zinc-600">
                        Chuyển qua ví điện tử
                      </div>
                    </div>
                    <div
                      className={[
                        "mt-1 h-4 w-4 rounded-full border transition",
                        payment === "deposit"
                          ? "border-blue-500 bg-blue-500"
                          : "border-zinc-300 bg-white group-hover:border-zinc-400",
                      ].join(" ")}
                    />
                  </div>
                </button>
              </div>

              {/* BANK INFO */}
              {payment === "bank" && (
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    Thông tin chuyển khoản (demo)
                  </div>
                  <div className="mt-2 text-sm text-zinc-700">
                    Ngân hàng: <span className="font-medium">ABC Bank</span>
                    <br />
                    Số tài khoản: <span className="font-medium">0123 456 789</span>
                    <br />
                    Nội dung: <span className="font-medium">CONFIRM-ORDER</span>
                  </div>
                </div>
              )}

              {/* COD INFO */}
{payment === "cod" && (
  <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
    <div className="text-sm font-semibold text-zinc-900 flex items-center gap-2">
      <span className="h-2 w-2 rounded-full bg-orange-500"></span>
      Thông tin COD
    </div>
    
    <div className="mt-2 text-sm text-zinc-700">
      {/* Logic kiểm tra đơn hàng > 5 triệu (Giả sử đơn vị của total là VND) */}
      {total > 5000000 ? (
        <div className="space-y-4">
          <p className="text-red-600 font-medium">
            ⚠️ Đơn hàng của bạn trên 5.000.000đ. Vui lòng đặt cọc trước 20% (
            <b>{(total * 0.2).toLocaleString()}đ</b>) để xác nhận đơn hàng.
          </p>
          
          <div className="flex flex-wrap gap-3">
            <button 
              type="button"
              className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold hover:bg-zinc-100 transition shadow-sm"
              onClick={() => console.log("Thanh toán cọc qua VNPAY")}
            >
              <img src="https://vnpay.vn/wp-content/uploads/2020/07/Icon-VNPAY-QR.png" alt="vnpay" className="h-4 w-4" />
              Cọc qua VNPAY
            </button>
            
            <button 
              type="button"
              className="flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3 py-2 text-xs font-semibold hover:bg-zinc-100 transition shadow-sm"
              onClick={() => console.log("Thanh toán cọc qua Momo")}
            >
              <div className="h-4 w-4 rounded bg-[#A50064] flex items-center justify-center text-[8px] text-white">M</div>
              Cọc qua Momo
            </button>
          </div>
          
          <p className="text-xs text-zinc-500 italic">
            * Sau khi cọc, số tiền còn lại sẽ được thanh toán khi nhận hàng.
          </p>
        </div>
      ) : (
        <p>
          Bạn sẽ thanh toán khi nhận hàng. Vui lòng chuẩn bị tiền mặt khi giao hàng đến địa chỉ của bạn.
        </p>
      )}
    </div>
  </div>
)}

              {/* DEPOSIT INFO */}
              {payment === "deposit" && (
                <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                  <div className="text-sm font-semibold text-zinc-900">
                    Ví điện tử MOMO (demo)
                  </div>
                  <div className="mt-2 text-sm text-zinc-700">
                    
                    
                    Nội dung: <span className="font-medium">......</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* CỘT PHẢI: TỔNG KẾT */}
          <div className="space-y-6">
            <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-lg font-bold">Tóm tắt đơn hàng (đợi api )</h2>
              <div className="space-y-3">
                {items.map((it) => (
                  <div key={it.id} className="flex justify-between border-b border-zinc-100 pb-3">
                    <div>
                      <p className="font-medium">{it.name}</p>
                      <p className="text-xs text-zinc-500">3.000.000</p>
                    </div>
                    <span className="font-bold">3.000.000</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 space-y-3 border-t pt-4">
                <div className="flex justify-between text-sm"><span>Tạm tính</span><span>6,000,000</span></div>
                <div className="flex justify-between text-sm text-green-600"><span>Giảm giá(đợi api)</span><span>0</span></div>
                <div className="flex justify-between text-sm font-bold pt-2 border-t">
                  <span className="text-base">Tổng cộng</span>
                  <span className="text-xl text-red-600">6.000.000</span>
                </div>
              </div>

              <button onClick={handlePay} className="mt-6 w-full rounded-2xl bg-red-600 py-4 font-bold text-white shadow-lg hover:bg-red-700 transition">
                XÁC NHẬN ĐẶT HÀNG
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* --- MODAL CHỌN ĐỊA CHỈ --- */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
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
              <button onClick={() => setIsModalOpen(false)} className="flex-1 rounded-xl bg-zinc-100 py-3 font-semibold text-zinc-600 hover:bg-zinc-200">Hủy</button>
              <button onClick={confirmNewAddress} className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white hover:bg-red-700">Xác nhận</button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </>
  );
};

export default ConfirmPage;