import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, MapPin, Phone, Mail, Package,
  Clock, CheckCircle2, XCircle, Truck, Eye, Trash2, AlertTriangle, ShieldAlert,
} from "lucide-react";
import Navbar from "@/components/Navbar";
import WarrantyFormModal from "@/components/WarrantyFormModal";

import {
  CANCELABLE_STATUSES,
  orderStatusConfig, shippingConfig,
  prescriptionTimeline, normalTimeline,
  getTimelineStatus, formatCurrency, formatDate,
} from "./OrderDetailConfig";
import CancelFormModal, { CancelFormData } from "./CancelFormModal";
import ReturnExchangePanel from "./ReturnExchangePanel";
import WarrantyPanel from "./WarrantyPanel";

import { api } from "@/lib/ApiService";

export default function OrderDetailCustomer() {
  const { orderId } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [canceling, setCanceling] = useState(false);
  const [isWarrantyModalOpen, setIsWarrantyModalOpen] = useState(false);

  // ── Fetch order detail ───────────────────────────────────────────────────
  const fetchDetail = useCallback(async () => {
    try {
      setLoading(true);
      
      const res = await api.get(`/orders/${orderId}/detail`);
      
      if (res.data.code === 1000) { 
          setOrder(res.data.result); 
          setError(null); 
      } else {
          setError(res.data.message || "Không tìm thấy đơn hàng");
      }
    } catch (err: any) { 
        setError(err.response?.data?.message || "Lỗi kết nối server"); 
    } finally { 
        setLoading(false); 
    }
  }, [orderId]);

  useEffect(() => { fetchDetail(); }, [fetchDetail]);

  // ── Cancel handler ───────────────────────────────────────────────────────
  const handleCancelSubmit = async (formData: CancelFormData) => {
    try {
      setCanceling(true);

      // Build request object cho @RequestPart("request")
      const requestData: Record<string, any> = {
        cancelReason: formData.cancelReason,
      };
      if (formData.requestNote.trim()) requestData.requestNote = formData.requestNote.trim();
      if (formData.refundMethod) requestData.refundMethod = formData.refundMethod;
      if (formData.refundAccountNumber.trim()) requestData.refundAccountNumber = formData.refundAccountNumber.trim();
      if (formData.refundAccountName.trim()) requestData.refundAccountName = formData.refundAccountName.trim();

      const form = new FormData();
      form.append(
        "request",
        new Blob([JSON.stringify(requestData)], { type: "application/json" })
      );

      if (formData.customerAccountQrFile) {
        form.append("customerAccountQrFile", formData.customerAccountQrFile);
      }

      // Gọi bằng api (Axios)
      const res = await api.post(`/orders/${orderId}/cancel`, form, {
          headers: {
              'Content-Type': 'multipart/form-data'
          }
      });

      if (res.data.code === 1000) { 
          setShowCancelModal(false); 
          fetchDetail(); 
      } else {
          alert(res.data.message || "Không thể hủy đơn hàng");
      }
    } catch (err: any) { 
        alert(err.response?.data?.message || "Lỗi kết nối khi gửi yêu cầu hủy"); 
    } finally { 
        setCanceling(false); 
    }
  };

  // ── Loading / Error states ───────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center h-[calc(100vh-80px)]">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600" />
      </div>
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <div className="flex items-center justify-center p-10">
        <div className="text-center bg-white rounded-3xl shadow-lg p-10 border border-zinc-100">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <p className="text-red-600 font-semibold mb-4">{error || "Không tìm thấy đơn hàng"}</p>
          <button onClick={() => navigate("/profile")} className="rounded-xl bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700">
            Quay lại trang cá nhân
          </button>
        </div>
      </div>
    </div>
  );

  // ── Derived values ───────────────────────────────────────────────────────
  const orderStatus = orderStatusConfig[order.orderStatus] || { label: order.orderStatus, bg: "bg-zinc-100", text: "text-zinc-800", icon: Package };
  const shippingStatus = shippingConfig[order.shippingStatus] || { label: order.shippingStatus, bg: "bg-zinc-100", text: "text-zinc-800", icon: Truck };
  const OrderStatusIcon = orderStatus.icon;
  const ShippingStatusIcon = shippingStatus.icon;

  const isCanceled = order.orderStatus === "CANCELED" || order.shippingStatus === "CANCELED";
  const isFailed = order.shippingStatus === "FAILED";
  const isReturned = order.shippingStatus === "RETURNED";
  const timeline = order.hasPrescriptionItem ? prescriptionTimeline : normalTimeline;

  // Backend trả về canCancelOrder, requiresRefundInfoOnCancel, refundableAmount trực tiếp
  const requiresRefund: boolean = order.requiresRefundInfoOnCancel === true || (order.refundableAmount ?? 0) > 0;
  const refundableAmount: number = order.refundableAmount ?? 0;
  const canCancel: boolean =
    order.canCancelOrder === true ||
    (CANCELABLE_STATUSES.includes(order.orderStatus) && !order.hasOpenRefundRequest && order.latestReturnExchangeStatus == null);

  // ── Render ───────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white pb-20">
      <Navbar />

      {showCancelModal && (
        <CancelFormModal
          requiresRefund={requiresRefund}
          refundableAmount={refundableAmount}
          onSubmit={handleCancelSubmit}
          onCancel={() => setShowCancelModal(false)}
          submitting={canceling}
        />
      )}

      <div className="mx-auto w-full max-w-3xl space-y-6 px-4 py-8">

        {/* ── Header ── */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">{order.orderCode}</h1>
            <p className="text-xs text-zinc-500">{formatDate(order.orderDate)}</p>
          </div>
        </div>

        {/* ── Status badges ── */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-wrap gap-3 items-center justify-between">
          <div className="flex flex-wrap gap-3 items-center">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${orderStatus.bg}`}>
              <OrderStatusIcon className={`w-4 h-4 ${orderStatus.text}`} />
              <span className={`text-sm font-bold ${orderStatus.text}`}>{orderStatus.label}</span>
            </div>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${shippingStatus.bg}`}>
              <ShippingStatusIcon className={`w-4 h-4 ${shippingStatus.text}`} />
              <span className={`text-sm font-bold ${shippingStatus.text}`}>{shippingStatus.label}</span>
            </div>
            {order.requiresFinalPayment && (
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-100">
                <span className="text-sm font-bold text-orange-800">⚠️ Cần thanh toán thêm</span>
              </div>
            )}
          </div>

          {/* Nút bảo hành — chỉ hiện khi COMPLETED VÀ chưa có ảnh bill hoàn tiền */}
          {order.orderStatus === "COMPLETED" && !order.latestStaffRefundEvidenceUrl && (
            <>
              {/* Kiểm tra nếu đã có phiếu Đổi trả/Bảo hành rồi thì ẩn nút, hiện dòng text */}
              {order.latestReturnExchangeStatus ? (
                <div className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-teal-50 border border-teal-200">
                  <ShieldAlert className="w-4 h-4 text-teal-600" />
                  <span className="text-sm font-bold text-teal-700">Bạn đã gửi yêu cầu Bảo Hành - Đổi Trả cho đơn này</span>
                </div>
              ) : (
                <button
                  onClick={() => setIsWarrantyModalOpen(true)}
                  className="flex items-center gap-2 bg-gradient-to-r from-teal-600 to-emerald-600 hover:from-teal-700 hover:to-emerald-700 text-white font-bold py-2.5 px-5 rounded-xl shadow-md transition-all transform hover:scale-[1.02] active:scale-95"
                >
                  <ShieldAlert className="w-4 h-4" />
                  Bảo hành - Đổi trả
                </button>
              )}
            </>
          )}
        </div>

        {/* ── Order timeline ── */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-zinc-900 mb-5 flex items-center gap-2">
            <Clock className="w-5 h-5 text-teal-600" /> Tiến trình đơn hàng
          </h2>
          {isCanceled || isFailed || isReturned ? (
            <div className={`flex items-center gap-3 border rounded-xl p-4 ${isCanceled ? "bg-red-50 border-red-200" : "bg-orange-50 border-orange-200"}`}>
              <XCircle className={`w-5 h-5 ${isCanceled ? "text-red-500" : "text-orange-500"}`} />
              <p className={`font-semibold ${isCanceled ? "text-red-700" : "text-orange-700"}`}>
                {isCanceled ? "Đơn hàng đã bị hủy" : isFailed ? "Giao hàng thất bại" : "Đơn hàng đã hoàn trả"}
              </p>
            </div>
          ) : (
            <div className="relative flex items-start justify-between gap-2 overflow-x-auto pb-4">
              {timeline.map((step, index) => {
                const status = getTimelineStatus(step, order);
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1 min-w-[80px]">
                    <div className="relative w-full flex items-center justify-center mb-3">
                      {index > 0 && (
                        <div className={`absolute right-1/2 top-4 w-full h-0.5 -z-0 ${status === "done" || status === "active" ? "bg-teal-400" : "bg-zinc-200"}`} />
                      )}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all
                        ${status === "done" ? "bg-teal-500 border-teal-500 text-white"
                          : status === "active" ? "bg-white border-teal-500 shadow-md"
                            : "bg-white border-zinc-200"}`}>
                        {status === "done"
                          ? <CheckCircle2 className="w-4 h-4" />
                          : status === "active"
                            ? <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
                            : <div className="w-2 h-2 rounded-full bg-zinc-300" />}
                      </div>
                    </div>
                    <p className={`text-[10px] font-bold text-center leading-tight uppercase
                      ${status === "done" ? "text-teal-600"
                        : status === "active" ? "text-teal-700"
                          : "text-zinc-400"}`}>
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* ── Return/Exchange status panel ── */}
        {order.latestReturnExchangeStatus && (
          <ReturnExchangePanel order={order} />
        )}

        {order.latestWarrantyStatus && (
          <WarrantyPanel order={order} />
        )}

        {/* ── Shipping info ── */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-4">
          <h2 className="font-bold text-zinc-900 flex items-center gap-2">
            <MapPin className="w-5 h-5 text-teal-600" /> Địa chỉ nhận hàng
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div className="space-y-2">
              <p className="flex items-center gap-2 font-semibold text-zinc-800"><Package className="w-4 h-4 text-zinc-400" /> {order.recipientName}</p>
              <p className="flex items-center gap-2 text-zinc-600"><Phone className="w-4 h-4 text-zinc-400" /> {order.recipientPhone}</p>
              <p className="flex items-center gap-2 text-zinc-600"><Mail className="w-4 h-4 text-zinc-400" /> {order.recipientEmail}</p>
              {order.expectedDeliveryAt && (
                <p className="flex items-center gap-2 text-zinc-600">
                  <Clock className="w-4 h-4 text-zinc-400" />
                  Dự kiến: {formatDate(order.expectedDeliveryAt)}
                  {order.isPastExpectedDeliveryAt && (
                    <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Quá hạn</span>
                  )}
                </p>
              )}
            </div>
            <div className="space-y-2">
              <div className="p-3 bg-zinc-50 rounded-2xl border border-zinc-100 text-zinc-600 italic">
                {order.recipientAddress}
              </div>
              {order.note && (
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-3 py-2 text-xs text-zinc-600">
                  📝 {order.note}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Prescription items ── */}
        {order.prescriptionOrderDetail?.length > 0 && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-zinc-900 flex items-center gap-2">
              <Eye className="w-5 h-5 text-teal-600" /> Chi tiết kính thuốc
            </h2>
            {order.prescriptionOrderDetail.map((item: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-zinc-100 p-4 bg-zinc-50/30">
                <div className="flex flex-wrap gap-6 mb-4">
                  {item.frameName && (
                <div className="flex items-center gap-3">
                  <img src={item.frameImg} alt="" className="w-14 h-14 rounded-xl object-cover border bg-white" />
                  <div>
                    <p className="text-[10px] font-bold text-indigo-600 uppercase">Gọng kính</p>
                    <p className="text-sm font-semibold">{item.frameName}</p>
                  </div>
                </div>
              )}

                  {item.lensName && (
                    <div className="flex items-center gap-3">
                      <img src={item.lensImg} alt="" className="w-14 h-14 rounded-xl object-cover border bg-white" />
                      <div>
                        <p className="text-[10px] font-bold text-purple-600 uppercase">Tròng kính</p>
                        <p className="text-sm font-semibold">{item.lensName}</p>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center gap-3">
                    <img src={item.lensImg} alt="" className="w-14 h-14 rounded-xl object-cover border bg-white" />
                    <div>
                      <p className="text-[10px] font-bold text-purple-600 uppercase">Tròng kính</p>
                      <p className="text-sm font-semibold">{item.lensName}</p>
                    </div>
                  </div>
                </div>
                <div className="bg-white border border-zinc-200 rounded-xl overflow-hidden mb-3">
                  <table className="w-full text-[11px]">
                    <thead className="bg-zinc-100 text-zinc-600">
                      <tr>
                        <th className="py-2 px-2 text-left">Mắt</th>
                        <th className="py-2 text-center">SPH</th>
                        <th className="py-2 text-center">CYL</th>
                        <th className="py-2 text-center">AXIS</th>
                        <th className="py-2 text-center">ADD</th>
                        <th className="py-2 text-center">PD</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr className="border-t border-zinc-100 bg-blue-50/50">
                        <td className="py-2 px-2 font-bold text-zinc-700">👁️ Phải</td>
                        <td className="text-center">{item.rightEyeSph ?? "—"}</td>
                        <td className="text-center">{item.rightEyeCyl ?? "—"}</td>
                        <td className="text-center">{item.rightEyeAxis ?? "—"}</td>
                        <td className="text-center">{item.rightEyeAdd ?? "—"}</td>
                        <td className="text-center">{item.rightPD ?? "—"}</td>
                      </tr>
                      <tr className="border-t border-zinc-100 bg-purple-50/50">
                        <td className="py-2 px-2 font-bold text-zinc-700">👁️ Trái</td>
                        <td className="text-center">{item.leftEyeSph ?? "—"}</td>
                        <td className="text-center">{item.leftEyeCyl ?? "—"}</td>
                        <td className="text-center">{item.leftEyeAxis ?? "—"}</td>
                        <td className="text-center">{item.leftEyeAdd ?? "—"}</td>
                        <td className="text-center">{item.leftPD ?? "—"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <p className="text-right font-bold text-teal-700">{formatCurrency(item.totalPrice)}</p>
              </div>
            ))}
          </div>
        )}

        {/* ── Normal items ── */}
        {order.orderDetail?.length > 0 && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-zinc-900">Sản phẩm khác</h2>
            {order.orderDetail.map((item: any, idx: number) => (
              <div key={idx} className="flex items-center gap-4 rounded-2xl border border-zinc-100 p-3">
                <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded-xl object-cover border" />
                <div className="flex-1">
                  <div className="font-semibold text-zinc-900 text-sm">{item.productName}</div>
                  <div className="text-xs text-zinc-500">Số lượng: {item.quantity}</div>
                </div>
                <div className="text-sm font-bold text-teal-700">{formatCurrency(item.totalPrice)}</div>
              </div>
            ))}
          </div>
        )}

        {/* ── Total price ── */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm space-y-3">
          <div className="flex justify-between text-sm text-zinc-500">
            <span>Tạm tính</span>
            <span>{formatCurrency(order.totalAmount - order.shippingFee)}</span>
          </div>
          <div className="flex justify-between text-sm text-zinc-500">
            <span>Phí vận chuyển</span>
            <span>{formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="h-px bg-zinc-100 my-2" />
          <div className="flex justify-between items-center">
            <span className="font-bold text-zinc-900">Tổng thanh toán</span>
            <span className="text-2xl font-black text-teal-600">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

        {/* ── Cancel button ── */}
        {canCancel && (
          <div className={`rounded-3xl border p-5 shadow-sm space-y-3 ${requiresRefund ? "border-orange-100 bg-orange-50/60" : "border-red-100 bg-red-50/60"}`}>
            <div className="flex items-start gap-3">
              <AlertTriangle className={`w-5 h-5 mt-0.5 shrink-0 ${requiresRefund ? "text-orange-500" : "text-red-500"}`} />
              <div>
                <p className={`text-sm font-bold ${requiresRefund ? "text-orange-800" : "text-red-800"}`}>Hủy đơn hàng</p>
                <p className={`text-xs mt-0.5 ${requiresRefund ? "text-orange-700" : "text-red-600"}`}>
                  {requiresRefund
                    ? `Đơn hàng đã thanh toán ${formatCurrency(refundableAmount)}. Khi hủy, bạn cần cung cấp thông tin tài khoản để nhận hoàn tiền thủ công từ nhân viên.`
                    : "Bạn có thể hủy đơn hàng trước khi nhân viên xác nhận. Hành động này không thể hoàn tác."}
                </p>
              </div>
            </div>
            <button
              onClick={() => setShowCancelModal(true)}
              disabled={canceling}
              className={`w-full flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white transition disabled:opacity-50
                ${requiresRefund ? "bg-orange-600 hover:bg-orange-700" : "bg-red-600 hover:bg-red-700"}`}
            >
              {canceling
                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                : <Trash2 className="w-4 h-4" />}
              {requiresRefund ? "Hủy đơn & Yêu cầu hoàn tiền" : "Hủy đơn hàng"}
            </button>
          </div>
        )}

        {/* ── Notice sau khi đã gửi yêu cầu hủy ── */}
        {order.latestReturnExchangeStatus && CANCELABLE_STATUSES.includes(order.orderStatus) && (
          <div className="rounded-3xl border border-zinc-200 bg-zinc-50 p-5 flex items-center gap-3">
            <Clock className="w-5 h-5 text-zinc-400 shrink-0" />
            <p className="text-sm text-zinc-600">
              Yêu cầu hủy đơn đã được gửi. Vui lòng theo dõi trạng thái hoàn tiền bên trên.
            </p>
          </div>
        )}

      </div>

      {/* ── Warranty Modal ── */}
      <WarrantyFormModal
        isOpen={isWarrantyModalOpen}
        onClose={() => {
          setIsWarrantyModalOpen(false)
          fetchDetail();
        }}
        order={order}
      />

    </div>
  );
}