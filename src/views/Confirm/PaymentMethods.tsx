import React from "react";
import vietqr_logo from "@/assets/VietQR_logo.png";
import vnpay_logo from "@/assets/VnPay_logo.png";
import { CreditCard, Truck, Wallet, Check } from "lucide-react";

type PaymentMethodType = "VNPAY" | "PAYOS" | "COD";

interface PaymentMethodsProps {
  payment: PaymentMethodType;
  setPayment: (method: PaymentMethodType) => void;
  total: number;
  depositAmount: number; 
  needsDeposit: boolean;
  isDepositOnly: boolean;
  setIsDepositOnly: (val: boolean) => void;
}

const PaymentMethods: React.FC<PaymentMethodsProps> = ({
  payment,
  setPayment,
  total,
  depositAmount,
  needsDeposit,
  isDepositOnly,
  setIsDepositOnly,
}) => {
  
  const handleSelectFullPayment = () => {
    setIsDepositOnly(false);
    if (payment === "COD") {
      setPayment("VNPAY");
    }
  };

  const handleSelectDepositPayment = () => {
    setIsDepositOnly(true);
    if (payment !== "VNPAY" && payment !== "PAYOS") {
      setPayment("VNPAY");
    }
  };

  // ✅ Đồng bộ với OrderSummary — dùng cùng nguồn số liệu
  const amountToShow = isDepositOnly ? (depositAmount ?? 0) : (total ?? 0);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="mb-6 text-xl font-bold text-zinc-900 flex items-center gap-2">
        <CreditCard className="h-6 w-6 text-teal-600" />
        Hình thức thanh toán
      </h2>

      {needsDeposit && (
        <div className="mb-8 flex p-1 bg-zinc-100 rounded-2xl w-full">
          <button
            type="button"
            onClick={handleSelectFullPayment}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              !isDepositOnly 
              ? "bg-white text-teal-600 shadow-sm ring-1 ring-zinc-200" 
              : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <Wallet className="w-4 h-4" /> Thanh toán 100%
          </button>
          <button
            type="button"
            onClick={handleSelectDepositPayment}
            className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-bold text-sm transition-all ${
              isDepositOnly 
              ? "bg-white text-orange-600 shadow-sm ring-1 ring-zinc-200" 
              : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            <Truck className="w-4 h-4" /> Thanh toán cọc
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-3">
        {/* VNPAY */}
        <button
          type="button"
          onClick={() => setPayment("VNPAY")}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
            payment === "VNPAY" ? "border-teal-500 bg-teal-50/30" : "border-zinc-100 bg-white"
          }`}
        >
          <img src={vnpay_logo} alt="VNPAY" className="h-7 mb-2 object-contain" />
          <span className={`text-[10px] font-bold ${payment === "VNPAY" ? "text-teal-700" : "text-zinc-500"}`}>VNPAY</span>
          {payment === "VNPAY" && <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-teal-500 text-white flex items-center justify-center"><Check className="w-3 h-3"/></div>}
        </button>

        {/* VietQR */}
        <button
          type="button"
          onClick={() => setPayment("PAYOS")}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
            payment === "PAYOS" ? "border-teal-500 bg-teal-50/30" : "border-zinc-100 bg-white"
          }`}
        >
          <img src={vietqr_logo} alt="VietQR" className="h-7 mb-2 object-contain" />
          <span className={`text-[10px] font-bold ${payment === "PAYOS" ? "text-teal-700" : "text-zinc-500"}`}>VIETQR</span>
          {payment === "PAYOS" && <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-teal-500 text-white flex items-center justify-center"><Check className="w-3 h-3"/></div>}
        </button>

        {/* COD */}
        <button
          type="button"
          onClick={() => {
            setPayment("COD");
            if (needsDeposit && !isDepositOnly) {
              setIsDepositOnly(true);
            }
          }}
          className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 p-4 transition-all ${
            payment === "COD" ? "border-orange-500 bg-orange-50" : "border-zinc-100 bg-white"
          }`}
        >
          <div className="mb-2 text-2xl">🚚</div>
          <span className={`text-xs font-bold ${payment === "COD" ? "text-orange-700" : "text-zinc-500"}`}>COD</span>
          {payment === "COD" && <div className="absolute -right-2 -top-2 h-5 w-5 rounded-full bg-orange-500 text-white flex items-center justify-center"><Check className="w-3 h-3"/></div>}
        </button>
      </div>

      {/* BOX GIẢI THÍCH */}
      <div className="mt-6 p-4 rounded-2xl bg-zinc-50 border border-zinc-100 animate-in fade-in duration-500">
        {isDepositOnly ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-orange-700 font-bold text-sm">
              <Truck className="w-4 h-4" /> Chế độ thanh toán đặt cọc
            </div>
            <p className="text-[11px] text-zinc-600 italic">
              * Vui lòng chọn <b>VNPAY</b> hoặc <b>VIETQR</b> ở trên để thực hiện <b>đặt cọc 20%</b>. 
              Phần tiền còn lại bạn sẽ trả trực tiếp cho shipper khi nhận hàng.
            </p>
            {payment === "COD" && (
              <div className="p-3 bg-orange-100/50 rounded-xl text-[10px] text-orange-800 font-medium">
                Hệ thống đang chờ bạn chọn cổng thanh toán (VNPAY/VietQR) để thực hiện giao dịch tiền cọc.
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-teal-700 font-bold text-sm">
              <Wallet className="w-4 h-4" /> Chế độ thanh toán 100%
            </div>
            <p className="text-[11px] text-zinc-600">
              Bạn đang lựa chọn thanh toán toàn bộ đơn hàng. Vui lòng sử dụng cổng thanh toán trực tuyến để hoàn tất.
            </p>
          </div>
        )}
      </div>

      
    </div>
  );
};

export default PaymentMethods;