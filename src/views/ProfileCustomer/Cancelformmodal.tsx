import React, { useState } from "react";
import { AlertTriangle, Banknote, Trash2, Upload, X } from "lucide-react";
import { formatCurrency } from "./OrderDetailConfig";

export interface CancelFormData {
  cancelReason: string;
  requestNote: string;
  refundMethod: string;
  refundAccountNumber: string;
  refundAccountName: string;
  customerAccountQrFile: File | null;
}

interface Props {
  requiresRefund: boolean;
  refundableAmount: number;
  onSubmit: (data: CancelFormData) => void;
  onCancel: () => void;
  submitting: boolean;
}

export default function CancelFormModal({
  requiresRefund,
  refundableAmount,
  onSubmit,
  onCancel,
  submitting,
}: Props) {
  const [form, setForm] = useState<CancelFormData>({
    cancelReason: "",
    requestNote: "",
    refundMethod: "",
    refundAccountNumber: "",
    refundAccountName: "",
    customerAccountQrFile: null,
  });
  const [qrPreview, setQrPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleQrChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm(prev => ({ ...prev, customerAccountQrFile: file }));
      const reader = new FileReader();
      reader.onload = () => setQrPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.cancelReason.trim()) errs.cancelReason = "Vui lòng nhập lý do hủy đơn";
    if (requiresRefund) {
      if (!form.refundMethod.trim()) errs.refundMethod = "Vui lòng nhập phương thức nhận hoàn tiền";
      if (!form.refundAccountNumber.trim()) errs.refundAccountNumber = "Vui lòng nhập số tài khoản / số điện thoại";
    }
    return errs;
  };

  const handleSubmit = () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    onSubmit(form);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md max-h-[92vh] overflow-y-auto animate-in fade-in slide-in-from-bottom-4 duration-300">

        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-3xl flex items-center justify-between px-6 pt-6 pb-4 border-b border-zinc-100 z-10">
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center ${requiresRefund ? "bg-orange-100" : "bg-red-100"}`}>
              {requiresRefund
                ? <Banknote className="w-5 h-5 text-orange-600" />
                : <Trash2 className="w-5 h-5 text-red-600" />}
            </div>
            <div>
              <h3 className="font-bold text-zinc-900">
                {requiresRefund ? "Hủy đơn & Hoàn tiền" : "Xác nhận hủy đơn"}
              </h3>
              <p className="text-xs text-zinc-500">
                {requiresRefund ? `Hoàn lại ${formatCurrency(refundableAmount)}` : "Điền lý do để xác nhận"}
              </p>
            </div>
          </div>
          <button onClick={onCancel} className="w-8 h-8 rounded-full bg-zinc-100 flex items-center justify-center hover:bg-zinc-200 transition">
            <X className="w-4 h-4 text-zinc-600" />
          </button>
        </div>

        <div className="p-6 space-y-5">
          {/* Warning */}
          <div className={`rounded-2xl px-4 py-3 flex items-start gap-2 border ${requiresRefund ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200"}`}>
            <AlertTriangle className={`w-4 h-4 mt-0.5 shrink-0 ${requiresRefund ? "text-amber-600" : "text-red-500"}`} />
            <p className={`text-xs ${requiresRefund ? "text-amber-800" : "text-red-700"}`}>
              {requiresRefund
                ? "Đơn hàng đã được thanh toán. Sau khi hủy, nhân viên sẽ hoàn tiền thủ công về tài khoản bạn cung cấp bên dưới."
                : "Hành động này không thể hoàn tác. Đơn hàng sẽ bị hủy ngay lập tức."}
            </p>
          </div>

          {/* Cancel reason */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-800 flex items-center gap-1">
              Lý do hủy đơn <span className="text-red-500">*</span>
            </label>
            <textarea
              rows={2}
              placeholder="Ví dụ: Đổi nhu cầu mua hàng, đặt nhầm sản phẩm..."
              value={form.cancelReason}
              onChange={e => { setForm(p => ({ ...p, cancelReason: e.target.value })); setErrors(p => ({ ...p, cancelReason: "" })); }}
              className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 resize-none ${errors.cancelReason ? "border-red-400 bg-red-50" : "border-zinc-200"}`}
            />
            {errors.cancelReason && <p className="text-xs text-red-500">{errors.cancelReason}</p>}
          </div>

          {/* Request note */}
          <div className="space-y-2">
            <label className="text-sm font-bold text-zinc-800">
              Ghi chú thêm <span className="text-zinc-400 font-normal text-xs">(tùy chọn)</span>
            </label>
            <input
              type="text"
              placeholder="Ví dụ: Nhờ shop xử lý sớm giúp tôi"
              value={form.requestNote}
              onChange={e => setForm(p => ({ ...p, requestNote: e.target.value }))}
              className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
            />
          </div>

          {/* Refund fields */}
          {requiresRefund && (
            <>
              <div className="h-px bg-zinc-100" />
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-wide">Thông tin nhận hoàn tiền</p>

              {/* Refund method — free text */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-800 flex items-center gap-1">
                  Phương thức hoàn tiền <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: Chuyển khoản ngân hàng, MoMo, ZaloPay..."
                  value={form.refundMethod}
                  onChange={e => { setForm(p => ({ ...p, refundMethod: e.target.value })); setErrors(p => ({ ...p, refundMethod: "" })); }}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400
                    ${errors.refundMethod ? "border-red-400 bg-red-50" : "border-zinc-200"}`}
                />
                {errors.refundMethod && <p className="text-xs text-red-500">{errors.refundMethod}</p>}
              </div>

              {/* Account number */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-800 flex items-center gap-1">
                  Số tài khoản / SĐT nhận tiền <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  placeholder="Nhập số tài khoản hoặc số điện thoại"
                  value={form.refundAccountNumber}
                  onChange={e => { setForm(p => ({ ...p, refundAccountNumber: e.target.value })); setErrors(p => ({ ...p, refundAccountNumber: "" })); }}
                  className={`w-full rounded-xl border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400
                    ${errors.refundAccountNumber ? "border-red-400 bg-red-50" : "border-zinc-200"}`}
                />
                {errors.refundAccountNumber && <p className="text-xs text-red-500">{errors.refundAccountNumber}</p>}
              </div>

              {/* Account name */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-800">
                  Tên chủ tài khoản <span className="text-zinc-400 font-normal text-xs">(tùy chọn)</span>
                </label>
                <input
                  type="text"
                  placeholder="VD: NGUYEN VAN A"
                  value={form.refundAccountName}
                  onChange={e => setForm(p => ({ ...p, refundAccountName: e.target.value }))}
                  className="w-full rounded-xl border border-zinc-200 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400"
                />
              </div>

              {/* QR upload */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-zinc-800">
                  Ảnh QR tài khoản <span className="text-zinc-400 font-normal text-xs">(tùy chọn)</span>
                </label>
                {qrPreview ? (
                  <div className="relative w-full">
                    <img src={qrPreview} alt="QR Preview" className="w-full h-40 object-contain rounded-2xl border border-zinc-200 bg-zinc-50" />
                    <button
                      type="button"
                      onClick={() => { setQrPreview(null); setForm(p => ({ ...p, customerAccountQrFile: null })); }}
                      className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white border border-zinc-200 shadow flex items-center justify-center hover:bg-red-50 transition"
                    >
                      <X className="w-3.5 h-3.5 text-zinc-600" />
                    </button>
                  </div>
                ) : (
                  <label className="flex flex-col items-center justify-center gap-2 w-full h-28 border-2 border-dashed border-zinc-200 rounded-2xl cursor-pointer hover:border-teal-400 hover:bg-teal-50/30 transition">
                    <Upload className="w-6 h-6 text-zinc-400" />
                    <span className="text-xs text-zinc-500">Nhấn để tải ảnh QR lên</span>
                    <input type="file" accept="image/*" className="hidden" onChange={handleQrChange} />
                  </label>
                )}
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-white rounded-b-3xl border-t border-zinc-100 px-6 py-4 flex gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 rounded-xl border border-zinc-200 py-2.5 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
          >
            Giữ lại đơn
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={submitting}
            className={`flex-1 rounded-xl py-2.5 text-sm font-bold text-white transition disabled:opacity-50 flex items-center justify-center gap-2
              ${requiresRefund ? "bg-orange-600 hover:bg-orange-700" : "bg-red-600 hover:bg-red-700"}`}
          >
            {submitting
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Trash2 className="w-4 h-4" />}
            {requiresRefund ? "Hủy & Yêu cầu hoàn tiền" : "Xác nhận hủy đơn"}
          </button>
        </div>
      </div>
    </div>
  );
}