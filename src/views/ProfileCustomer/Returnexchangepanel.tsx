import { CheckCircle2, ImageIcon, RotateCcw } from "lucide-react";
import { REFUND_METHODS, refundStatusConfig, formatCurrency } from "./OrderDetailConfig";

interface Props {
  order: {
    latestReturnExchangeId: number | null;
    latestReturnExchangeCode: string | null;
    latestReturnExchangeStatus: string | null;
    latestReturnExchangeRefundAmount: number | null;
    latestStaffRefundEvidenceUrl: string | null;
    latestRejectReason: string | null;
    refundMethod?: string | null;
    refundAccountNumber?: string | null;
    refundAccountName?: string | null;
  };
}

const REFUND_STEPS = ["PENDING", "APPROVED", "COMPLETED"];

export default function ReturnExchangePanel({ order }: Props) {
  const status = order.latestReturnExchangeStatus;
  if (!status) return null;

  const cfg = refundStatusConfig[status] || {
    label: status,
    bg: "bg-zinc-50", text: "text-zinc-800", border: "border-zinc-200",
    icon: RotateCcw, desc: "",
  };
  const StatusIcon = cfg.icon;
  const isRejected  = status === "REJECTED";
  const hasRefund   = order.latestReturnExchangeRefundAmount != null;

  return (
    <div className={`rounded-3xl border ${cfg.border} ${cfg.bg} p-5 shadow-sm space-y-4`}>

      {/* Title */}
      <h2 className="font-bold text-zinc-900 flex items-center gap-2">
        <RotateCcw className="w-5 h-5 text-teal-600" /> Trạng thái hoàn tiền
        {order.latestReturnExchangeCode && (
          <span className="ml-auto text-xs font-mono text-zinc-400">{order.latestReturnExchangeCode}</span>
        )}
      </h2>

      {/* Status badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${cfg.border} bg-white`}>
        <StatusIcon className={`w-4 h-4 ${cfg.text}`} />
        <span className={`text-sm font-bold ${cfg.text}`}>{cfg.label}</span>
      </div>

      <p className="text-sm text-zinc-600">{cfg.desc}</p>

      {/* Timeline — chỉ hiện khi có refund và không bị rejected */}
      {hasRefund && !isRejected && (
        <div className="relative flex items-start justify-between gap-2 pt-2">
          {REFUND_STEPS.map((step, index) => {
            const currentIdx = REFUND_STEPS.indexOf(status);
            const isDone   = index < currentIdx || status === "COMPLETED";
            const isActive = status === step;
            return (
              <div key={step} className="flex flex-col items-center flex-1 min-w-[80px]">
                <div className="relative w-full flex items-center justify-center mb-3">
                  {index > 0 && (
                    <div className={`absolute right-1/2 top-4 w-full h-0.5 -z-0 ${isDone || isActive ? "bg-teal-400" : "bg-zinc-200"}`} />
                  )}
                  <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2
                    ${isDone   ? "bg-teal-500 border-teal-500 text-white"
                    : isActive ? "bg-white border-teal-500 shadow-md"
                    :            "bg-white border-zinc-200"}`}>
                    {isDone
                      ? <CheckCircle2 className="w-4 h-4" />
                      : isActive
                        ? <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
                        : <div className="w-2 h-2 rounded-full bg-zinc-300" />}
                  </div>
                </div>
                <p className={`text-[10px] font-bold text-center uppercase
                  ${isDone   ? "text-teal-600"
                  : isActive ? "text-teal-700"
                  :            "text-zinc-400"}`}>
                  {step === "PENDING" ? "Chờ duyệt" : step === "APPROVED" ? "Đã duyệt" : "Hoàn tiền"}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Refund amount */}
      {order.latestReturnExchangeRefundAmount != null && (
        <div className="bg-white rounded-2xl border border-zinc-100 p-4 flex items-center justify-between">
          <span className="text-sm text-zinc-500">Số tiền hoàn</span>
          <span className="font-bold text-teal-700">{formatCurrency(order.latestReturnExchangeRefundAmount)}</span>
        </div>
      )}

      {/* Refund account info */}
      {order.refundMethod && (
        <div className="grid grid-cols-2 gap-3 bg-white rounded-2xl border border-zinc-100 p-4 text-sm">
          <div>
            <p className="text-xs text-zinc-500 mb-0.5">Phương thức</p>
            <p className="font-semibold text-zinc-800">
              {REFUND_METHODS.find(m => m.value === order.refundMethod)?.label || order.refundMethod}
            </p>
          </div>
          {order.refundAccountNumber && (
            <div>
              <p className="text-xs text-zinc-500 mb-0.5">Số tài khoản</p>
              <p className="font-semibold font-mono text-zinc-800">{order.refundAccountNumber}</p>
            </div>
          )}
          {order.refundAccountName && (
            <div className="col-span-2">
              <p className="text-xs text-zinc-500 mb-0.5">Tên chủ TK</p>
              <p className="font-semibold text-zinc-800">{order.refundAccountName}</p>
            </div>
          )}
        </div>
      )}

      {/* Reject reason */}
      {isRejected && order.latestRejectReason && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-1">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Lý do từ chối</p>
          <p className="text-sm text-red-800">{order.latestRejectReason}</p>
        </div>
      )}

      {/* Staff refund evidence */}
      {status === "COMPLETED" && order.latestStaffRefundEvidenceUrl && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-wide flex items-center gap-1">
            <ImageIcon className="w-3.5 h-3.5" /> Bằng chứng chuyển khoản
          </p>
          <img
            src={order.latestStaffRefundEvidenceUrl}
            alt="Refund Evidence"
            className="w-full rounded-2xl border border-zinc-200 object-contain max-h-56"
          />
        </div>
      )}
    </div>
  );
}