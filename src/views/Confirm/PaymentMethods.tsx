import React from "react";
import vietqr_logo from "@/assets/VietQR_logo.png";
import vnpay_logo from "@/assets/VnPay_logo.png";

type PaymentMethodType = "VNPAY" | "PAYOS" | "COD";

interface PaymentMethodsProps {
  payment: PaymentMethodType;
  setPayment: (method: PaymentMethodType) => void;
  total: number;
  needsDeposit: boolean; // Nhận biến này từ ConfirmPage
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({ payment, setPayment, total, needsDeposit }) => {
  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-5 text-xl font-bold text-zinc-900 flex items-center gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
        </svg>
        Hình thức thanh toán
      </h2>

      <div className="grid gap-4 sm:grid-cols-3">
        {/* Nút VNPAY */}
        <button
          type="button"
          onClick={() => setPayment("VNPAY")}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${payment === "VNPAY" ? "border-red-500 bg-red-50 shadow-md" : "border-zinc-100 bg-white"}`}
        >
          <img src={vnpay_logo} alt="VNPAY" className="h-8 mb-2 object-contain" />
          <span className={`text-xs font-bold ${payment === "VNPAY" ? "text-red-700" : "text-zinc-500"}`}>VNPAY</span>
          {payment === "VNPAY" && <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white text-[10px]">✓</div>}
        </button>

        {/* Nút VietQR */}
        <button
          type="button"
          onClick={() => setPayment("PAYOS")}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${payment === "PAYOS" ? "border-pink-500 bg-pink-50 shadow-md" : "border-zinc-100 bg-white"}`}
        >
          <img src={vietqr_logo} alt="VietQR" className="h-8 mb-2 object-contain" />
          <span className={`text-xs font-bold ${payment === "PAYOS" ? "text-pink-700" : "text-zinc-500"}`}>VietQR</span>
          {payment === "PAYOS" && <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-pink-500 text-white text-[10px]">✓</div>}
        </button>

        {/* Nút COD */}
        <button
          type="button"
          onClick={() => setPayment("COD")}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${payment === "COD" ? "border-orange-500 bg-orange-50 shadow-md" : "border-zinc-100 bg-white"}`}
        >
          <div className="mb-2 text-2xl">🚚</div>
          <span className={`text-xs font-bold ${payment === "COD" ? "text-orange-700" : "text-zinc-500"}`}>COD</span>
          {payment === "COD" && <div className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-orange-500 text-white text-[10px]">✓</div>}
        </button>
      </div>

      {/* HIỂN THỊ CHỌN CỌC NẾU CHỌN COD NHƯNG CẦN CỌC (ĐƠN > 5TR HOẶC ĐƠN THUỐC) */}
      {payment === "COD" && needsDeposit && (
        <div className="mt-6 p-5 border-2 border-dashed border-orange-200 rounded-2xl bg-orange-50/50 animate-in fade-in slide-in-from-top-2 duration-300">
          <p className="text-sm font-bold text-orange-800 mb-2 flex items-center gap-2">
            ⚠️ Đơn hàng cần đặt cọc trước
          </p>
          <p className="text-xs text-orange-700 mb-4 italic">
            Vui lòng chọn hình thức thanh toán tiền cọc để xác nhận đơn hàng:
          </p>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => setPayment("VNPAY")}
              className="flex-1 flex flex-col items-center justify-center gap-2 py-3 bg-white border border-zinc-200 rounded-xl hover:border-red-500 hover:text-red-600 transition-all shadow-sm"
            >
              <img src={vnpay_logo} alt="VNPAY" className="h-4 object-contain" />
              <span className="text-[10px] font-bold">Cọc qua VNPAY</span>
            </button>
            <button
              type="button"
              onClick={() => setPayment("PAYOS")}
              className="flex-1 flex flex-col items-center justify-center gap-2 py-3 bg-white border border-zinc-200 rounded-xl hover:border-pink-500 hover:text-pink-600 transition-all shadow-sm"
            >
              <img src={vietqr_logo} alt="VietQR" className="h-4 object-contain" />
              <span className="text-[10px] font-bold">Cọc qua VietQR</span>
            </button>
          </div>
        </div>
      )}

      <div className="mt-6">
        <p className="text-[11px] text-zinc-400 italic">
          * Tổng đơn: <span className="font-bold text-zinc-700">{total.toLocaleString()}đ</span>
        </p>
      </div>
    </div>
  );
};

export default PaymentMethods;