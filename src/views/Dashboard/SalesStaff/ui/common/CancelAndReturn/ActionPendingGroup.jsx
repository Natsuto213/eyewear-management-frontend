import React from "react";
import { CheckCircle, XCircle } from "lucide-react";

export default function ActionPendingGroup({
    rejectReason,
    setRejectReason,
    onApprove,
    onReject,
    disableApprove = false,
}) {
    return (
        <div className="flex flex-col gap-3">
            <p className="text-sm font-bold text-gray-800">Xử lý yêu cầu</p>
            <button
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl transition-all font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={disableApprove}
                onClick={onApprove}
            >
                <CheckCircle className="w-5 h-5" />
                CHẤP NHẬN
            </button>
            <button
                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-3 px-4 rounded-xl transition-all font-bold shadow disabled:opacity-50 disabled:cursor-not-allowed"
                type="button"
                disabled={!rejectReason.trim()}
                onClick={onReject}
            >
                <XCircle className="w-5 h-5" />
                TỪ CHỐI
            </button>
            <div className="space-y-2">
                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                    Lý do xử lý (Bắt buộc khi từ chối)
                </label>
                <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do tại đây..."
                    className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50"
                    rows="3"
                />
            </div>
        </div>
    );
}
