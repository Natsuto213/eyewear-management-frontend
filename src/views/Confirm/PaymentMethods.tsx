import React from "react";
import vietqr_logo from "@/assets/VietQR_logo.png";
import vnpay_logo from "@/assets/VnPay_logo.png";


type PaymentMethodType = "VNPAY" | "PAYOS" | "COD";

interface PaymentMethodsProps {
  payment: PaymentMethodType;
  setPayment: (method: PaymentMethodType) => void;
  total: number;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ payment, setPayment, total }) => {
  // Kiểm tra điều kiện trên 5 triệu
  const isHighValue = total > 5000000;

  return (
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
          onClick={() => setPayment("VNPAY")}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${payment === "VNPAY" ? "border-red-500 bg-red-50 shadow-md" : "border-zinc-100 bg-white hover:border-zinc-200"
            }`}
        >
          <img src={vnpay_logo} alt="VNPAY" className="h-8 mb-2 object-contain" />
          <span className={`text-xs font-bold ${payment === "VNPAY" ? "text-red-700" : "text-zinc-500"}`}>VNPAY</span>
          {payment === "VNPAY" && <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-sm italic text-[10px]">✓</div>}
        </button>

        {/* MOMO */}
        <button
          type="button"
          onClick={() => setPayment("PAYOS")}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${payment === "PAYOS" ? "border-pink-500 bg-pink-50 shadow-md" : "border-zinc-100 bg-white hover:border-zinc-200"
            }`}
        >
          <img src={vietqr_logo} alt="PAYOS" className="h-8 mb-2 object-contain" />
          <span className={`text-xs font-bold ${payment === "PAYOS" ? "text-pink-700" : "text-zinc-500"}`}>VietQR</span>
          {payment === "PAYOS" && <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white shadow-sm italic text-[10px]">✓</div>}
        </button>

        {/* COD */}
        <button
          type="button"
          onClick={() => setPayment("COD")}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${payment === "COD" ? "border-orange-500 bg-orange-50 shadow-md" : "border-zinc-100 bg-white hover:border-zinc-200"
            }`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" className={`h-8 w-8 mb-2 ${payment === "COD" ? "text-orange-600" : "text-zinc-400"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path d="M9 17a2 2 0 11-4 0 2 2 0 014 0zM19 17a2 2 0 11-4 0 2 2 0 014 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16V6a1 1 0 00-1-1H4a1 1 0 00-1 1v10a1 1 0 001 1h1m8-1a1 1 0 01-1 1H9m4-1V8a1 1 0 011-1h2.586a1 1 0 01.707.293l3.414 3.414a1 1 0 01.293.707V16a1 1 0 01-1 1h-1m-6-1a1 1 0 001 1h1M5 17a2 2 0 104 0m-4 0a2 2 0 114 0m6 0a2 2 0 104 0m-4 0a2 2 0 114 0" />
          </svg>
          <span className={`text-xs font-bold ${payment === "COD" ? "text-orange-700" : "text-zinc-500"}`}>COD (Thanh toán khi nhận)</span>
          {payment === "COD" && <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white shadow-sm italic text-[10px]">✓</div>}
        </button>
      </div>

      {/* HIỂN THỊ CHỌN CỌC NẾU LÀ COD VÀ TRÊN 5 TRIỆU */}
      {payment === "COD" && isHighValue && (
        <div className="mt-6 p-4 border-2 border-dashed border-orange-200 rounded-2xl bg-orange-50/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm font-bold text-orange-800 mb-3 flex items-center gap-2">
            ⚠️ Đơn hàng trên 5 triệu cần đặt cọc trước
          </p>
          <p className="text-xs text-orange-700 mb-4 italic">
            Vui lòng chọn phương thức thanh toán tiền cọc (số tiền còn lại sẽ thanh toán khi nhận hàng):
          </p>

          <div className="flex gap-3">
            <button
              onClick={() => setPayment("VNPAY")}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-zinc-200 rounded-xl hover:border-red-500 hover:text-red-600 transition-all shadow-sm"
            >

              <span className="text-xs font-bold">Cọc qua VNPAY</span>
            </button>
            <button
              onClick={() => setPayment("PAYOS")}
              className="flex-1 flex items-center justify-center gap-2 py-2 px-4 bg-white border border-zinc-200 rounded-xl hover:border-pink-500 hover:text-pink-600 transition-all shadow-sm"
            >
              <span className="text-xs font-bold">Cọc qua VietQR</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-[11px] text-zinc-400 italic">
          * Tổng cộng cần thanh toán: <span className="font-bold text-zinc-700">{total.toLocaleString()}đ</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;