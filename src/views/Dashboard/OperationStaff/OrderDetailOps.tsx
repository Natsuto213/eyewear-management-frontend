import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Phone, Mail, MapPin, User, Package, CheckCircle2, Clock, XCircle, Truck, Eye, AlertCircle, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "@/lib/ApiService";

const actionLabels: Record<string, string> = {
  START_PROCESSING: "Bắt đầu gia công",
  START_PACKING: "Bắt đầu đóng gói",
  MOVE_TO_PACKING: "Chuyển đóng gói",
  HANDOVER_TO_GHN: "Bàn giao GHN",
  MARK_DELIVERED: "Xác nhận đã giao",
  COMPLETE_ORDER: "Hoàn tất đơn",
};

const actionColors: Record<string, string> = {
  START_PROCESSING: "from-amber-500 to-yellow-500 hover:from-amber-600 hover:to-yellow-600",
  START_PACKING: "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
  MOVE_TO_PACKING: "from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600",
  HANDOVER_TO_GHN: "from-indigo-500 to-violet-500 hover:from-indigo-600 hover:to-violet-600",
  MARK_DELIVERED: "from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600",
  COMPLETE_ORDER: "from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700",
};

const DANGEROUS_ACTIONS = ["COMPLETE_ORDER"];

const dangerousActionMessages: Record<string, string> = {
  COMPLETE_ORDER: "Bạn xác nhận hoàn tất đơn hàng? Hệ thống sẽ chốt thanh toán và kết thúc đơn.",
};

const prescriptionTimeline = [
  { key: "CONFIRMED", label: "Đã xác nhận", orderStatus: "CONFIRMED" },
  { key: "PROCESSING", label: "Đang gia công", orderStatus: "PROCESSING" },
  { key: "PACKING", label: "Đóng gói", shippingStatus: "PACKING" },
  { key: "SHIPPING", label: "Đang vận chuyển", shippingStatus: "SHIPPING" },
  { key: "DELIVERED", label: "Đã giao", shippingStatus: "DELIVERED" },
  { key: "COMPLETED", label: "Hoàn thành", orderStatus: "COMPLETED" },
];

const normalTimeline = [
  { key: "CONFIRMED", label: "Đã xác nhận", orderStatus: "CONFIRMED" },
  { key: "PACKING", label: "Đóng gói", shippingStatus: "PACKING" },
  { key: "SHIPPING", label: "Đang vận chuyển", shippingStatus: "SHIPPING" },
  { key: "DELIVERED", label: "Đã giao", shippingStatus: "DELIVERED" },
  { key: "COMPLETED", label: "Hoàn thành", orderStatus: "COMPLETED" },
];

function getTimelineStatus(step: any, order: any): "done" | "active" | "pending" {
  const orderStatusOrder = ["CONFIRMED", "PROCESSING", "READY", "COMPLETED"];
  const shippingStatusOrder = ["PENDING", "PACKING", "SHIPPING", "DELIVERED"];

  const currentOrderIdx = orderStatusOrder.indexOf(order.orderStatus);
  const currentShippingIdx = shippingStatusOrder.indexOf(order.shippingStatus);

  if (step.orderStatus) {
    const stepIdx = orderStatusOrder.indexOf(step.orderStatus);
    if (step.orderStatus === "COMPLETED" && order.orderStatus === "COMPLETED") return "done";
    if (step.orderStatus === order.orderStatus) return "active";
    if (stepIdx < currentOrderIdx) return "done";
    return "pending";
  }

  if (step.shippingStatus) {
    const stepIdx = shippingStatusOrder.indexOf(step.shippingStatus);
    // ✅ Fix: nếu step này < current → done; bằng current → active; > current → pending
    // Thêm: nếu order đã COMPLETED thì tất cả shipping step đều "done"
    if (order.orderStatus === "COMPLETED") return "done";
    if (stepIdx < currentShippingIdx) return "done";
    if (stepIdx === currentShippingIdx) return "active";
    return "pending";
  }

  return "pending";
}

function ConfirmModal({ action, onConfirm, onCancel }: { action: string; onConfirm: () => void; onCancel: () => void }) {
  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onCancel}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          className="bg-white rounded-2xl shadow-2xl p-6 max-w-md w-full"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
              <AlertTriangle className="w-6 h-6 text-orange-600" />
            </div>
            <div>
              <h3 className="font-bold text-gray-900 text-lg">Xác nhận hành động</h3>
              <p className="text-sm text-gray-500">{actionLabels[action]}</p>
            </div>
          </div>
          <p className="text-gray-700 mb-6 leading-relaxed bg-orange-50 rounded-xl p-4 border border-orange-200">
            {dangerousActionMessages[action]}
          </p>
          <div className="flex gap-3">
            <button onClick={onCancel} className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-all">
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              className={`flex-1 px-4 py-3 text-white font-semibold rounded-xl transition-all shadow-lg bg-gradient-to-r ${actionColors[action] || "from-gray-500 to-gray-600"}`}
            >
              Xác nhận
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState<string | null>(null);
  const [updateSuccess, setUpdateSuccess] = useState<string | null>(null);
  const [confirmAction, setConfirmAction] = useState<string | null>(null);

  

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/api/operation-staff/orders/${orderId}`);
        if (res.data.code === 1000) setOrder(res.data.result);
        else setError("Không tìm thấy đơn hàng.");
      } catch (err: any) {
        setError(err.message || "Không thể tải chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  const executeAction = async (action: string) => {
    try {
    setUpdating(true);
    setUpdateError(null);
    setUpdateSuccess(null);
    setConfirmAction(null);
    const res = await api.put(
      `/api/operation-staff/orders/${orderId}/status`,
      { action },
      { validateStatus: () => true }
    );
    if (res.data.code === 1000) {
      setOrder(res.data.result);
      setUpdateSuccess(`✅ ${actionLabels[action]} thành công!`);
      setTimeout(() => setUpdateSuccess(null), 3000);
    } else if (res.data.code === 1032) {
      const expectedDate = order?.expectedDeliveryAt
        ? `Ngày dự kiến giao: ${new Date(order.expectedDeliveryAt).toLocaleString("vi-VN")}.`
        : "";
      setUpdateError(`Chưa thể cập nhật trạng thái giao hàng vì chưa đến ngày dự kiến. ${expectedDate} Vui lòng thử lại sau khi đến hoặc qua ngày dự kiến giao.`);
    } else if (res.data.code === 1003) {
      setUpdateError("❌ Thao tác không hợp lệ với trạng thái hiện tại.");
    } else {
      setUpdateError(res.data.message || "Cập nhật thất bại.");
    }
  } catch (err: any) {
    const resData = err?.response?.data;
    if (resData?.code === 1032) {
      const expectedDate = order?.expectedDeliveryAt
        ? `Ngày dự kiến giao: ${new Date(order.expectedDeliveryAt).toLocaleString("vi-VN")}.`
        : "";
      setUpdateError(`Chưa thể cập nhật trạng thái giao hàng vì chưa đến ngày dự kiến. ${expectedDate} Vui lòng thử lại sau khi đến hoặc qua ngày dự kiến giao.`);
    } else if (resData?.code === 1003) {
      setUpdateError("❌ Thao tác không hợp lệ với trạng thái hiện tại.");
    } else if (resData?.message) {
      setUpdateError(resData.message);
    } else {
      setUpdateError(err.message || "Lỗi kết nối.");
    }
  } finally {
    setUpdating(false);
  }
  };

  const handleActionClick = (action: string) => {
    if (DANGEROUS_ACTIONS.includes(action)) setConfirmAction(action);
    else executeAction(action);
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "---" : date.toLocaleString("vi-VN");
  };

  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return "0 ₫";
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    PROCESSING:     { bg: "bg-gradient-to-r from-amber-100 to-yellow-100",   text: "text-amber-800",   icon: Clock,        label: "Đang gia công" },
    CONFIRMED:      { bg: "bg-gradient-to-r from-blue-100 to-cyan-100",      text: "text-blue-800",    icon: CheckCircle2, label: "Đã xác nhận" },
    COMPLETED:      { bg: "bg-gradient-to-r from-emerald-100 to-green-100",  text: "text-emerald-800", icon: CheckCircle2, label: "Hoàn thành" },
    CANCELED:       { bg: "bg-gradient-to-r from-red-100 to-rose-100",       text: "text-red-800",     icon: XCircle,      label: "Đã hủy" },
    READY:          { bg: "bg-gradient-to-r from-violet-100 to-purple-100",  text: "text-violet-800",  icon: CheckCircle2, label: "Đã bàn giao GHN" },
    PARTIALLY_PAID: { bg: "bg-gradient-to-r from-orange-100 to-amber-100",   text: "text-orange-800",  icon: Clock,        label: "Thanh toán 1 phần" },
    PAID:           { bg: "bg-gradient-to-r from-teal-100 to-cyan-100",      text: "text-teal-800",    icon: CheckCircle2, label: "Đã thanh toán" },
    DELIVERED:      { bg: "bg-gradient-to-r from-green-100 to-emerald-100",  text: "text-green-800",   icon: CheckCircle2, label: "Đã giao" },
    FAILED:         { bg: "bg-gradient-to-r from-red-100 to-rose-100",       text: "text-red-800",     icon: XCircle,      label: "Giao thất bại" },
    RETURNED:       { bg: "bg-gradient-to-r from-orange-100 to-amber-100",   text: "text-orange-800",  icon: XCircle,      label: "Hoàn hàng" },
};

  // ── Shipping config đầy đủ với bg + text + icon để render badge màu ──
  const shippingConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    PENDING:   { bg: "bg-gradient-to-r from-gray-100 to-slate-100",      text: "text-gray-700",    icon: Clock,        label: "Chờ xử lý" },
    PACKING:   { bg: "bg-gradient-to-r from-blue-100 to-cyan-100",       text: "text-blue-800",    icon: Package,      label: "Đang đóng gói" },
    SHIPPING:  { bg: "bg-gradient-to-r from-indigo-100 to-violet-100",   text: "text-indigo-800",  icon: Truck,        label: "Đang vận chuyển" },
    DELIVERED: { bg: "bg-gradient-to-r from-green-100 to-emerald-100",   text: "text-green-800",   icon: CheckCircle2, label: "Đã giao" },
    FAILED:    { bg: "bg-gradient-to-r from-red-100 to-rose-100",        text: "text-red-800",     icon: XCircle,      label: "Giao thất bại" },
    RETURNED:  { bg: "bg-gradient-to-r from-orange-100 to-amber-100",    text: "text-orange-800",  icon: XCircle,      label: "Hoàn hàng" },
    CANCELED:  { bg: "bg-gradient-to-r from-red-100 to-rose-100",        text: "text-red-800",     icon: XCircle,      label: "Đã hủy" },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center">
          <div className="relative w-16 h-16 mx-auto mb-4">
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 animate-spin rounded-full border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent"></div>
          </div>
          <p className="text-gray-600 font-medium">Đang tải chi tiết đơn hàng...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold text-lg mb-6">{error || "Không tìm thấy đơn hàng"}</p>
          <button
            onClick={() => navigate("/operation-staff/orders", { state: { refresh: true } })}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 bg-white rounded-xl shadow-sm hover:shadow-md transition-all font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Quay lại
          </button>
        </motion.div>
      </div>
    );
  }

  const hasOrderDetail = order.orderDetail && order.orderDetail.length > 0;
  const hasPrescription = order.prescriptionOrderDetail && order.prescriptionOrderDetail.length > 0;
  const hasActions = order.availableActions?.length > 0;
  const showInventoryWarning =
    order.inventoryReadyForOperationUpdate === false &&
    order.orderStatus === "CONFIRMED";
  const showUpdateSection = hasActions || showInventoryWarning;

  const isCanceled = order.orderStatus === "CANCELED" || order.shippingStatus === "CANCELED";
  const isFailed = order.shippingStatus === "FAILED";
  const isReturned = order.shippingStatus === "RETURNED";

  const statusInfo   = statusConfig[order.orderStatus]     || { bg: "bg-gray-100", text: "text-gray-800", icon: Package,      label: order.orderStatus };
const shippingInfo = shippingConfig[order.shippingStatus] || { bg: "bg-gray-100", text: "text-gray-800", icon: Truck,        label: order.shippingStatus };
  const StatusIcon   = statusInfo.icon;
  const ShippingIcon = shippingInfo.icon;
  const timeline = order.hasPrescriptionItem ? prescriptionTimeline : normalTimeline;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {confirmAction && (
          <ConfirmModal
            action={confirmAction}
            onConfirm={() => executeAction(confirmAction)}
            onCancel={() => setConfirmAction(null)}
          />
        )}

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center gap-4 mb-8">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 bg-white rounded-xl shadow-sm hover:shadow-md transition-all font-medium">
            <ArrowLeft className="w-5 h-5" /> Quay lại
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Chi tiết đơn hàng
          </h1>
        </motion.div>

        {/* Thông tin chung */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <p className="text-indigo-100 text-xs uppercase font-semibold mb-2">Mã đơn hàng</p>
                <p className="text-3xl font-bold text-white mb-1">{order.orderCode}</p>
                <div className="flex items-center gap-2 text-indigo-100">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm">{formatDate(order.orderDate)}</p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap items-start">
                {order.requiresFinalPayment && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-orange-400 to-red-400 text-white text-sm font-bold shadow-md flex items-center gap-2 animate-pulse"
                  >
                    <AlertTriangle className="w-4 h-4" /> Cần thu thêm tiền
                  </motion.div>
                )}
                {/* Order status badge */}
                <div className={`px-4 py-2 rounded-xl ${statusInfo.bg} shadow-md flex items-center gap-2`}>
                  <StatusIcon className={`w-4 h-4 ${statusInfo.text}`} />
                  <span className={`text-sm font-bold ${statusInfo.text}`}>{statusInfo.label}</span>
                </div>
                {/* Shipping status badge — đầy đủ màu */}
                <div className={`px-4 py-2 rounded-xl ${shippingInfo.bg} shadow-md flex items-center gap-2`}>
                  <ShippingIcon className={`w-4 h-4 ${shippingInfo.text}`} />
                  <span className={`text-sm font-bold ${shippingInfo.text}`}>{shippingInfo.label}</span>
                </div>
                {(() => {
                  const orderTypeConfig: Record<string, { bg: string; text: string; label: string; icon: string }> = {
                    DIRECT_ORDER:       { bg: "bg-gradient-to-r from-pink-100 to-rose-100",     text: "text-pink-800",   label: "Đơn trực tiếp",  icon: "🛍️" },
                    PRE_ORDER:          { bg: "bg-gradient-to-r from-violet-100 to-purple-100", text: "text-violet-800", label: "Đơn đặt trước",  icon: "🕐" },
                    PRESCRIPTION_ORDER: { bg: "bg-gradient-to-r from-indigo-100 to-blue-100",  text: "text-indigo-800", label: "Kính thuốc",      icon: "👓" },
                    MIX_ORDER:          { bg: "bg-gradient-to-r from-purple-100 to-pink-100",  text: "text-purple-800", label: "Đơn hỗn hợp",    icon: "📦" },
                  };
                  const t = orderTypeConfig[order.orderType] ?? { bg: "bg-gray-100", text: "text-gray-700", label: order.orderType, icon: "📋" };
                  return (
                    <div className={`px-4 py-2 rounded-xl ${t.bg} ${t.text} text-sm font-bold shadow-md flex items-center gap-1.5`}>
                      <span>{t.icon}</span>{t.label}
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          <div className="p-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-6 flex-wrap">
                {order.expectedDeliveryAt && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Dự kiến giao</p>
                    <p className="font-semibold text-indigo-600 flex items-center gap-1">
                      {formatDate(order.expectedDeliveryAt)}
                      {order.isPastExpectedDeliveryAt && (
                        <span className="text-xs text-red-500 font-bold bg-red-50 px-2 py-0.5 rounded-full">⚠ Quá hạn</span>
                      )}
                    </p>
                  </div>
                )}
                {order.shippingFee !== undefined && order.shippingFee !== null && (
                  <div>
                    <p className="text-xs text-gray-500 uppercase font-semibold">Phí ship</p>
                    <p className="font-semibold text-gray-700">{formatCurrency(order.shippingFee)}</p>
                  </div>
                )}
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Tổng tiền</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Timeline */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl shadow-lg border border-gray-100 p-6 mb-6"
        >
          <h2 className="font-bold text-gray-700 text-base mb-6 flex items-center gap-2">
            <div className="w-7 h-7 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
              <Clock className="w-4 h-4 text-white" />
            </div>
            Tiến trình đơn hàng
          </h2>

          {isCanceled ? (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-700 font-semibold">Đơn hàng đã bị hủy</p>
            </div>
          ) : isFailed ? (
            <div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl p-4">
              <XCircle className="w-5 h-5 text-red-500 shrink-0" />
              <p className="text-red-700 font-semibold">Đơn hàng giao thất bại</p>
            </div>
          ) : isReturned ? (
            <div className="flex items-center gap-3 bg-orange-50 border border-orange-200 rounded-xl p-4">
              <XCircle className="w-5 h-5 text-orange-500 shrink-0" />
              <p className="text-orange-700 font-semibold">Đơn hàng đã hoàn hàng</p>
            </div>
          ) : (
            <div className="relative flex items-start justify-between gap-2 overflow-x-auto pb-2">
              {timeline.map((step, index) => {
                const status = getTimelineStatus(step, order);
                return (
                  <div key={step.key} className="flex flex-col items-center flex-1 min-w-[80px]">
                    <div className="relative w-full flex items-center justify-center mb-3">
                      {index > 0 && (
                        <div className={`absolute right-1/2 top-4 w-full h-0.5 -z-0
                          ${status === "done" || status === "active" ? "bg-indigo-400" : "bg-gray-200"}`}
                        />
                      )}
                      <div className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all
                        ${status === "done" ? "bg-indigo-500 border-indigo-500 text-white" :
                          status === "active" ? "bg-white border-indigo-500 shadow-lg shadow-indigo-200" :
                          "bg-white border-gray-200"}`}
                      >
                        {status === "done" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : status === "active" ? (
                          <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }}
                            className="w-3 h-3 rounded-full bg-indigo-500"
                          />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-gray-300" />
                        )}
                      </div>
                    </div>
                    <p className={`text-xs font-semibold text-center leading-tight
                      ${status === "done" ? "text-indigo-600" :
                        status === "active" ? "text-indigo-700" : "text-gray-400"}`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </motion.div>

        {/* Cập nhật trạng thái */}
        {showUpdateSection && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border-2 border-indigo-200 overflow-hidden mb-6"
          >
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 px-6 py-4 border-b border-indigo-100">
              <h2 className="font-bold text-indigo-800 text-lg flex items-center gap-2">
                <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
                Cập nhật trạng thái đơn hàng
              </h2>
            </div>
            <div className="p-6">
              {updateSuccess && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-center gap-3 bg-green-50 border border-green-200 text-green-700 rounded-xl px-4 py-3"
                >
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{updateSuccess}</span>
                </motion.div>
              )}
              {updateError && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-center gap-3 bg-yellow-50 border border-yellow-200 text-yellow-700 rounded-xl px-4 py-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0" />
                  <span className="font-medium">{updateError}</span>
                </motion.div>
              )}
              {showInventoryWarning && (
                <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                  className="mb-4 flex items-start gap-3 bg-violet-50 border border-violet-200 text-violet-700 rounded-xl px-4 py-3"
                >
                  <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium mb-1">Chưa đủ hàng trong kho</p>
                    <p className="text-sm leading-relaxed">
                      Đơn hàng này hiện chưa đủ tồn kho để tiếp tục xử lý. Vui lòng nhập đủ hàng cho các sản phẩm trong đơn trước khi tiếp tục xử lý.
                    </p>
                  </div>
                </motion.div>
              )}
              {hasActions && (
                <div className="flex flex-wrap gap-3">
                  {order.availableActions.map((action: string) => (
                    <motion.button key={action} whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                      onClick={() => handleActionClick(action)}
                      disabled={updating}
                      className={`px-6 py-3 rounded-xl text-white font-semibold text-sm transition-all shadow-lg hover:shadow-xl
                        bg-gradient-to-r ${actionColors[action] || "from-gray-500 to-gray-600"}
                        disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2`}
                    >
                      {updating ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          {DANGEROUS_ACTIONS.includes(action) && <AlertTriangle className="w-4 h-4" />}
                          {actionLabels[action] || action}
                        </>
                      )}
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Thông tin khách hàng */}
          <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg">Thông tin khách hàng</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Họ tên</p>
                <p className="font-bold text-gray-900 text-lg">{order.customerName}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <span className="break-all">{order.customerEmail}</span>
              </div>
            </div>
          </motion.div>

          {/* Thông tin giao hàng */}
          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.25 }}
            className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg">Thông tin giao hàng</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Người nhận</p>
                <p className="font-bold text-gray-900 text-lg">{order.recipientName}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-purple-600" />
                </div>
                <span>{order.recipientPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <span className="break-all">{order.recipientEmail}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <span className="leading-relaxed">{order.recipientAddress}</span>
              </div>
              {order.note && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Ghi chú</p>
                  <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg border border-amber-200">📝 {order.note}</p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sản phẩm thường */}
        {hasOrderDetail && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden mb-6 hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg">Sản phẩm</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {order.orderDetail.map((item: any, index: number) => (
                <motion.div key={index} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all"
                >
                  {item.imageUrl && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md shrink-0">
                      <img src={item.imageUrl} alt={item.productName} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg mb-1">{item.productName}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">SL: {item.quantity}</span>
                      <span className="text-xs text-gray-500">{formatCurrency(item.unitPrice)} / cái</span>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-green-600 shrink-0">{formatCurrency(item.totalPrice)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Đơn kính thuốc */}
        {hasPrescription && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden hover:shadow-xl transition-shadow mb-6"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg">Đơn kính thuốc</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {order.prescriptionOrderDetail.map((item: any, index: number) => (
                <motion.div key={index} initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.1 * index }}
                  className="border-2 border-indigo-100 rounded-2xl p-6 bg-gradient-to-br from-indigo-50 to-purple-50 hover:border-indigo-300 transition-all"
                >
                  <div className={`grid grid-cols-1 ${item.frameId && item.lensId ? "md:grid-cols-2" : ""} gap-6 mb-6`}>
                    {/* Gọng — chỉ hiện nếu có data */}
                    {item.frameId && (
                    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <div className="text-xs text-indigo-600 uppercase font-bold mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center">👓</div>
                        Gọng kính
                      </div>
                      <div className="flex gap-4 items-start">
                        {item.frameImg && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md shrink-0">
                            <img src={item.frameImg} alt={item.frameName} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-2">{item.frameName}</p>
                          <p className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {formatCurrency(item.framePrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                    )}

                    {/* Tròng — chỉ hiện nếu có data */}
                    {item.lensId && (
                      <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                        <div className="text-xs text-purple-600 uppercase font-bold mb-3 flex items-center gap-2">
                          <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">🔍</div>
                          Tròng kính
                        </div>
                        <div className="flex gap-4 items-start">
                          {item.lensImg && (
                            <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md shrink-0">
                              <img src={item.lensImg} alt={item.lensName} className="w-full h-full object-cover hover:scale-110 transition-transform" />
                            </div>
                          )}
                          <div className="flex-1">
                            <p className="font-bold text-gray-900 mb-2">{item.lensName}</p>
                            <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                              {formatCurrency(item.lensPrice)}
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Thông số mắt */}
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <div className="text-sm text-gray-700 uppercase font-bold">Thông số mắt</div>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-indigo-200">
                            <th className="py-3 px-2 text-left font-bold text-gray-700">Mắt</th>
                            <th className="py-3 px-2 text-center font-bold text-indigo-600">SPH</th>
                            <th className="py-3 px-2 text-center font-bold text-indigo-600">CYL</th>
                            <th className="py-3 px-2 text-center font-bold text-indigo-600">AXIS</th>
                            <th className="py-3 px-2 text-center font-bold text-indigo-600">ADD</th>
                            <th className="py-3 px-2 text-center font-bold text-indigo-600">PD</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-indigo-100 bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
                            <td className="py-3 px-2 font-bold text-gray-900">👁️ Phải (R)</td>
                            <td className="py-3 px-2 text-center font-semibold">{item.rightEyeSph ?? "---"}</td>
                            <td className="py-3 px-2 text-center font-semibold">{item.rightEyeCyl ?? "---"}</td>
                            <td className="py-3 px-2 text-center font-semibold">{item.rightEyeAxis ?? "---"}</td>
                            <td className="py-3 px-2 text-center font-semibold">{item.rightEyeAdd ?? "---"}</td>
                            <td className="py-3 px-2 text-center font-semibold">{item.rightPD ?? "---"}</td>
                          </tr>
                          <tr className="bg-purple-50/50 hover:bg-purple-100/50 transition-colors">
                            <td className="py-3 px-2 font-bold text-gray-900">👁️ Trái (L)</td>
                            <td className="py-3 px-2 text-center font-semibold">{item.leftEyeSph ?? "---"}</td>
                            <td className="py-3 px-2 text-center font-semibold">{item.leftEyeCyl ?? "---"}</td>
                            <td className="py-3 px-2 text-center font-semibold">{item.leftEyeAxis ?? "---"}</td>
                            <td className="py-3 px-2 text-center font-semibold">{item.leftEyeAdd ?? "---"}</td>
                            <td className="py-3 px-2 text-center font-semibold">{item.leftPD ?? "---"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="mt-6 flex justify-between items-center bg-white rounded-xl p-4 shadow-sm">
                    <span className="text-sm bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full font-semibold">
                      Số lượng: {item.quantity}
                    </span>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Thành tiền</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
