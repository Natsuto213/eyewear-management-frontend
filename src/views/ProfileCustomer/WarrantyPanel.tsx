import { CheckCircle2, ShieldAlert, RotateCcw } from "lucide-react";
import { warrantyStatusConfig } from "./OrderDetailConfig";

interface Props {
  order: {
    latestWarrantyId?: number | null;
    latestWarrantyCode?: string | null;
    latestWarrantyStatus?: string | null;
    latestWarrantyNote?: string | null;
    latestWarrantyEvidenceUrl?: string | null;
    latestRejectReason?: string | null;
  };
}

const WARRANTY_STEPS = ["PENDING", "APPROVED", "PROCESSING", "COMPLETED"];

export default function WarrantyPanel({ order }: Props) {
  const status = order.latestWarrantyStatus;
  if (!status) return null;

  const cfg = warrantyStatusConfig[status] || {
    label: status,
    bg: "bg-zinc-50", text: "text-zinc-800", border: "border-zinc-200",
    icon: ShieldAlert, desc: "",
  };
  const StatusIcon = cfg.icon;
  const isRejected = status === "REJECTED";

  return (
    <div className={`rounded-3xl border ${cfg.border} ${cfg.bg} p-5 shadow-sm space-y-4`}>

      {/* Title */}
      <h2 className="font-bold text-zinc-900 flex items-center gap-2">
        <ShieldAlert className="w-5 h-5 text-teal-600" /> Trạng thái bảo hành
        {order.latestWarrantyCode && (
          <span className="ml-auto text-xs font-mono text-zinc-400">{order.latestWarrantyCode}</span>
        )}
      </h2>

      {/* Status badge */}
      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl border ${cfg.border} bg-white`}>
        <StatusIcon className={`w-4 h-4 ${cfg.text}`} />
        <span className={`text-sm font-bold ${cfg.text}`}>{cfg.label}</span>
      </div>

      <p className="text-sm text-zinc-600">{cfg.desc}</p>

      {/* Timeline — ẩn khi bị rejected */}
      {!isRejected && (
        <div className="relative flex items-start justify-between gap-2 pt-2">
          {WARRANTY_STEPS.map((step, index) => {
            const currentIdx = WARRANTY_STEPS.indexOf(status);
            const isDone   = index < currentIdx || status === "COMPLETED";
            const isActive = status === step;
            return (
              <div key={step} className="flex flex-col items-center flex-1 min-w-[72px]">
                <div className="relative w-full flex items-center justify-center mb-3">
                  {index > 0 && (
                    <div className={`absolute right-1/2 top-4 w-full h-0.5 -z-0 
                      ${isDone || isActive ? "bg-teal-400" : "bg-zinc-200"}`} />
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
                <p className={`text-[10px] font-bold text-center uppercase leading-tight
                  ${isDone   ? "text-teal-600"
                  : isActive ? "text-teal-700"
                  :            "text-zinc-400"}`}>
                  {step === "PENDING"    ? "Chờ duyệt"
                  : step === "APPROVED"  ? "Đã duyệt"
                  : step === "PROCESSING"? "Đang xử lý"
                  :                        "Hoàn tất"}
                </p>
              </div>
            );
          })}
        </div>
      )}

      {/* Staff note / evidence */}
      {order.latestWarrantyNote && (
        <div className="bg-white rounded-2xl border border-zinc-100 p-4 text-sm text-zinc-700">
          📝 {order.latestWarrantyNote}
        </div>
      )}

      {status === "COMPLETED" && order.latestWarrantyEvidenceUrl && (
        <div className="space-y-2">
          <p className="text-xs font-bold text-zinc-600 uppercase tracking-wide">Bằng chứng bảo hành</p>
          <img
            src={order.latestWarrantyEvidenceUrl}
            alt="Warranty Evidence"
            className="w-full rounded-2xl border border-zinc-200 object-contain max-h-56"
          />
        </div>
      )}

      {/* Reject reason */}
      {isRejected && order.latestRejectReason && (
        <div className="bg-red-50 border border-red-200 rounded-2xl p-4 space-y-1">
          <p className="text-xs font-bold text-red-700 uppercase tracking-wide">Lý do từ chối</p>
          <p className="text-sm text-red-800">{order.latestRejectReason}</p>
        </div>
      )}
    </div>
  );
}