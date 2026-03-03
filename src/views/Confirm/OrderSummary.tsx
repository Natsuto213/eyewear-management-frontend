import React from "react";

interface OrderSummaryProps {
  cartItems: any[];
  preview: {
    subTotal: number;
    discountAmount: number;
    shippingFee: number;
    totalAmount: number;
    depositAmount: number;
    depositRequired: boolean;
    expectedDeliveryAt: string;
    remainingAmount: number;
  } | null;
  onPay: () => void;
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ cartItems, preview, onPay }) => {
  // Logic: Chỉ coi là có đặt cọc nếu tổng tiền > 5 triệu và Backend yêu cầu
  const shouldShowDeposit = preview && preview.totalAmount > 5000000 && preview.depositRequired;

  const formatDate = (dateStr: string) => {
    if (!dateStr) return "";
    const date = new Date(dateStr);
    return date.toLocaleDateString("vi-VN");
  };

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sticky top-6">
      <h2 className="mb-4 text-lg font-bold text-zinc-900">Tóm tắt đơn hàng</h2>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="space-y-4 max-h-[350px] overflow-y-auto pr-2 mb-6 custom-scrollbar">
        {cartItems.length > 0 ? (
          cartItems.map((it) => (
            <div key={it.cartItemId} className="flex gap-3 border-b border-zinc-50 pb-3 text-sm">
              <img 
                src={it.imgProduct} 
                alt={it.nameProduct} 
                className="h-16 w-16 rounded-xl object-cover border border-zinc-100" 
              />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-zinc-800 line-clamp-2">{it.nameProduct}</p>
                <p className="text-xs text-zinc-500 mt-1">Số lượng: {it.quantity}</p>
              </div>
              <div className="text-right font-bold text-zinc-900">
                {(it.price * it.quantity).toLocaleString()}đ
              </div>
            </div>
          ))
        ) : (
          <p className="text-sm text-zinc-400 text-center py-4">Giỏ hàng đang trống</p>
        )}
      </div>

      <div className="space-y-3 border-t pt-4 text-sm">
        <div className="flex justify-between text-zinc-600">
          <span>Tạm tính</span>
          <span>{preview?.subTotal?.toLocaleString() || 0}đ</span>
        </div>

        <div className="flex justify-between text-green-600 font-medium">
          <span>Giảm giá (Promotion)</span>
          <span>-{preview?.discountAmount?.toLocaleString() || 0}đ</span>
        </div>

        <div className="flex justify-between text-zinc-600">
          <span>Phí vận chuyển</span>
          <span>
            {preview?.shippingFee === 0 ? (
              <span className="text-green-600 font-bold">Miễn phí</span>
            ) : (
              `${preview?.shippingFee?.toLocaleString() || 0}đ`
            )}
          </span>
        </div>

        {preview?.expectedDeliveryAt && (
          <div className="flex justify-between text-zinc-500 italic text-xs">
            <span>Dự kiến giao:</span>
            <span>{formatDate(preview.expectedDeliveryAt)}</span>
          </div>
        )}

        {/* PHẦN TIỀN CỌC - Chỉ hiện khi trên 5 triệu */}
        {shouldShowDeposit && (
          <div className="mt-4 rounded-xl bg-orange-50 p-4 border border-orange-100 animate-in fade-in duration-300">
            <div className="flex justify-between text-orange-800 font-bold text-base">
              <span>Số tiền cần cọc:</span>
              <span>{preview.depositAmount.toLocaleString()}đ</span>
            </div>
            <div className="flex justify-between text-orange-700 text-xs mt-2">
              <span>Còn lại sau cọc:</span>
              <span>{preview.remainingAmount.toLocaleString()}đ</span>
            </div>
          </div>
        )}

        <div className="flex justify-between items-center pt-4 border-t-2 border-dashed">
          <span className="text-base font-bold text-zinc-900">Tổng thanh toán</span>
          <div className="text-right">
            <span className="text-2xl font-black text-red-600">
              {preview?.totalAmount?.toLocaleString() || 0}đ
            </span>
            <p className="text-[10px] text-zinc-400 font-normal mt-1">(Đã bao gồm VAT)</p>
          </div>
        </div>
      </div>

      {/* NÚT THANH TOÁN - Tự động đổi chữ theo điều kiện 5 triệu */}
      <button
        onClick={onPay}
        disabled={cartItems.length === 0}
        className={`mt-8 w-full rounded-2xl py-4 font-black text-white shadow-lg transition-all active:scale-95 ${
          shouldShowDeposit 
          ? "bg-orange-600 hover:bg-orange-700 shadow-orange-200" 
          : "bg-red-600 hover:bg-red-700 shadow-red-200"
        } disabled:bg-zinc-300 disabled:shadow-none disabled:cursor-not-allowed`}
      >
        {shouldShowDeposit ? "THANH TOÁN TIỀN CỌC NGAY" : "THANH TOÁN NGAY"}
      </button>

      <p className="text-center text-[11px] text-zinc-400 mt-4 flex items-center justify-center gap-1">
        🔒 Thông tin thanh toán được bảo mật 100%
      </p>
    </div>
  );
};

export default OrderSummary;