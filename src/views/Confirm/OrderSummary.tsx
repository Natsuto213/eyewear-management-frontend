import React from "react";

interface OrderSummaryProps {
  cartItems: any[];
  preview: any;
  onPay: () => void;
  availablePromotions: any[];
  onApplyPromotion: (promoId: number | null) => void;
  note: string;
  setNote: (val: string) => void;
  needsDeposit: boolean;
  isDepositOnly: boolean; // ✅ THÊM
}

const OrderSummary: React.FC<OrderSummaryProps> = ({ 
  cartItems, preview, onPay, availablePromotions, onApplyPromotion, note, setNote, needsDeposit, isDepositOnly
}) => {

  // Số tiền cần trả ngay: nếu đang ở tab cọc thì lấy depositAmount, ngược lại lấy totalAmount
  const amountToPay = isDepositOnly
    ? (preview?.depositAmount ?? 0)
    : (preview?.totalAmount ?? 0);

  return (
    <div className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm sticky top-6">
      <h2 className="mb-4 text-lg font-bold text-zinc-900">Tóm tắt đơn hàng</h2>

      {/* DANH SÁCH SẢN PHẨM */}
      <div className="space-y-4 max-h-[300px] overflow-y-auto mb-6 custom-scrollbar pr-1">
        {cartItems.map((it) => (
          <div key={it.cartItemId} className="flex gap-3 border-b border-zinc-50 pb-3 text-sm">
            <img src={it.imgProduct} alt={it.nameProduct} className="h-14 w-14 rounded-lg object-cover border border-zinc-100" />
            <div className="flex-1">
              <p className="font-medium line-clamp-1 text-zinc-800">{it.nameProduct}</p>
              {it.isPrescription && (
                <span className="text-[9px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full font-bold uppercase tracking-wider">Kính thuốc (Bắt buộc cọc)</span>
              )}
              <p className="text-xs text-zinc-400">Số lượng: {it.quantity}</p>
            </div>
            <div className="font-bold text-zinc-900">{(it.price * it.quantity).toLocaleString()}đ</div>
          </div>
        ))}
      </div>

      {/* CHI TIẾT THANH TOÁN */}
      <div className="space-y-3 border-t pt-4 text-sm">
        <div className="flex justify-between text-zinc-500 font-medium">
          <span>Tạm tính</span>
          <span>{preview?.subTotal?.toLocaleString() || 0}đ</span>
        </div>
        <div className="flex justify-between text-teal-600 font-medium">
          <span>Giảm giá</span>
          <span>-{preview?.discountAmount?.toLocaleString() || 0}đ</span>
        </div>
        <div className="flex justify-between text-zinc-500 font-medium">
          <span>Phí vận chuyển</span>
          <span>{preview?.shippingFee === 0
            ? <span className="text-teal-600 font-bold uppercase text-[10px]">Miễn phí</span>
            : `${preview?.shippingFee?.toLocaleString() || 0}đ`}
          </span>
        </div>

        {/* HIỂN THỊ DÒNG CỌC KHI needsDeposit */}
        {needsDeposit && (
          <div className={`mt-4 rounded-xl p-4 border shadow-inner transition-all ${
            isDepositOnly
              ? "bg-amber-50 border-amber-200"
              : "bg-zinc-50 border-zinc-200"
          }`}>
            <div className={`flex justify-between font-black text-base ${isDepositOnly ? "text-amber-900" : "text-zinc-500"}`}>
              <span>Tiền cọc (20%):</span>
              <span>{preview?.depositAmount?.toLocaleString() || 0}đ</span>
            </div>
            {isDepositOnly ? (
              <p className="text-[10px] text-amber-700 mt-2 italic leading-relaxed font-medium">
                * Bạn chỉ cần thanh toán <b>20% tiền cọc</b> ngay bây giờ. Phần còn lại trả khi nhận hàng.
              </p>
            ) : (
              <p className="text-[10px] text-zinc-400 mt-2 italic leading-relaxed">
                * Đơn hàng này có yêu cầu cọc, nhưng bạn đang chọn thanh toán toàn bộ 100%.
              </p>
            )}
          </div>
        )}

        {/* TỔNG CỘNG */}
        <div className="flex justify-between items-center pt-4 border-t-2 border-dashed">
          <span className="font-bold text-zinc-900 text-base">
            {isDepositOnly ? "Cần trả ngay (cọc)" : "Tổng cộng"}
          </span>
          <div className="text-right">
            {/* Nếu đang ở tab cọc: hiện depositAmount nổi bật */}
            {isDepositOnly ? (
              <>
                <span className="block text-xs text-zinc-400 line-through">{preview?.totalAmount?.toLocaleString()}đ</span>
                <span className="text-2xl font-black text-orange-600 tracking-tight">{amountToPay.toLocaleString()}đ</span>
              </>
            ) : (
              // Tab 100%: luôn dùng totalAmount (đã tính giảm giá, không trừ cọc)
              preview?.appliedPromotionId ? (
                <>
                  <span className="block text-xs text-zinc-400 line-through">{preview?.subTotal?.toLocaleString()}đ</span>
                  <span className="text-2xl font-black text-red-600 tracking-tight">{preview?.totalAmount?.toLocaleString() || 0}đ</span>
                </>
              ) : (
                <span className="text-2xl font-black text-red-600 tracking-tight">{preview?.totalAmount?.toLocaleString() || 0}đ</span>
              )
            )}
          </div>
        </div>
      </div>

      {/* GHI CHÚ */}
      <div className="mt-6">
        <label className="block text-zinc-500 font-bold text-[11px] mb-2 uppercase tracking-widest">Ghi chú cho cửa hàng</label>
        <textarea
          className="w-full p-3 border border-zinc-200 rounded-xl text-sm bg-zinc-50 focus:ring-2 focus:ring-red-500 outline-none transition-all resize-none"
          placeholder="Yêu cầu về giao hàng, đóng gói..."
          rows={2}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </div>

      {/* CHỌN MÃ GIẢM GIÁ */}
      <div className="mt-4">
        <label className="block text-zinc-500 font-bold text-[11px] mb-2 uppercase tracking-widest">Mã giảm giá</label>
        <select
          className="p-3 border border-zinc-200 rounded-xl w-full text-sm bg-white font-medium outline-none focus:border-red-400"
          value={preview?.appliedPromotionId || ""}
          onChange={(e) => onApplyPromotion(e.target.value ? Number(e.target.value) : null)}
        >
          <option value="">Không sử dụng mã</option>
          {availablePromotions.map((p) => (
            <option key={p.promotionId} value={p.promotionId}>{p.name} (-{p.discountValue}%)</option>
          ))}
        </select>
      </div>

      {/* NÚT THANH TOÁN — thay đổi theo tab */}
      <button
        onClick={onPay}
        disabled={cartItems.length === 0}
        className={`mt-6 w-full rounded-2xl py-4 font-black text-white shadow-lg transition-all active:scale-95 text-base
          ${isDepositOnly
            ? "bg-gradient-to-r from-orange-500 to-red-600 shadow-orange-100 hover:brightness-110"
            : "bg-zinc-900 hover:bg-black shadow-zinc-200"}
          disabled:bg-zinc-300 disabled:shadow-none`}
      >
        {isDepositOnly ? `ĐẶT CỌC ${amountToPay.toLocaleString()}đ` : `XÁC NHẬN & THANH TOÁN ${amountToPay.toLocaleString()}đ`}
      </button>
    </div>
  );
};

export default OrderSummary;