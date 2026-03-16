import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  ArrowLeft, MapPin, Phone, Mail, Package,
  Clock, CheckCircle2, XCircle, Truck, Eye,
} from "lucide-react";
import Navbar from "@/components/Navbar";

const BASE_URL = "https://api-eyewear.purintech.id.vn";

const formatCurrency = (v: number) =>
  v?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const formatDate = (str: string) => {
  if (!str) return "";
  return new Date(str).toLocaleString("vi-VN");
};

// ─── Timeline definitions ────────────────────────────────────────────────────

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

function getTimelineStatus(
  step: { orderStatus?: string; shippingStatus?: string },
  order: any
): "done" | "active" | "pending" {
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
    if (step.shippingStatus === order.shippingStatus) return "active";
    if (stepIdx < currentShippingIdx) return "done";
    return "pending";
  }

  return "pending";
}

// ─── Status configs ──────────────────────────────────────────────────────────

const orderStatusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  PENDING: { label: "Chờ xác nhận", bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
  CONFIRMED: { label: "Đã xác nhận", bg: "bg-blue-100", text: "text-blue-800", icon: CheckCircle2 },
  PROCESSING: { label: "Đang gia công", bg: "bg-amber-100", text: "text-amber-800", icon: Package },
  READY: { label: "Chờ vận chuyển", bg: "bg-purple-100", text: "text-purple-800", icon: Package },
  COMPLETED: { label: "Hoàn thành", bg: "bg-green-100", text: "text-green-800", icon: CheckCircle2 },
  CANCELED: { label: "Đã hủy", bg: "bg-red-100", text: "text-red-800", icon: XCircle },
};

const shippingConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  PENDING: { label: "Chờ xử lý", bg: "bg-zinc-100", text: "text-zinc-700", icon: Clock },
  PACKING: { label: "Đang đóng gói", bg: "bg-blue-100", text: "text-blue-800", icon: Package },
  SHIPPING: { label: "Đang giao hàng", bg: "bg-indigo-100", text: "text-indigo-800", icon: Truck },
  DELIVERED: { label: "Đã giao", bg: "bg-green-100", text: "text-green-800", icon: CheckCircle2 },
  FAILED: { label: "Giao thất bại", bg: "bg-red-100", text: "text-red-800", icon: XCircle },
  RETURNED: { label: "Hoàn hàng", bg: "bg-orange-100", text: "text-orange-800", icon: XCircle },
  CANCELED: { label: "Đã hủy", bg: "bg-red-100", text: "text-red-800", icon: XCircle },
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function OrderDetailCustomer() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { navigate("/login", { replace: true }); return; }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/orders/${orderId}/detail`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.code === 1000) setOrder(data.result);
        else setError("Không tìm thấy đơn hàng");
      } catch {
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [orderId, navigate]);

  // ── Loading ────────────────────────────────────────────────────────────────
  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-white">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600" />
    </div>
  );

  // ── Error ──────────────────────────────────────────────────────────────────
  if (error || !order) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-white">
      <div className="text-center bg-white rounded-3xl shadow-lg p-10">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 font-semibold mb-4">{error || "Không tìm thấy đơn hàng"}</p>
        <button
          onClick={() => navigate("/profile")}
          className="rounded-xl bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700"
        >
          Quay lại
        </button>
      </div>
    </div>
  );

  // ── Derived state ──────────────────────────────────────────────────────────
  const orderStatus = orderStatusConfig[order.orderStatus] || { label: order.orderStatus, bg: "bg-zinc-100", text: "text-zinc-800", icon: Package };
  const shippingStatus = shippingConfig[order.shippingStatus] || { label: order.shippingStatus, bg: "bg-zinc-100", text: "text-zinc-800", icon: Truck };
  const OrderStatusIcon = orderStatus.icon;
  const ShippingStatusIcon = shippingStatus.icon;

  const isCanceled = order.orderStatus === "CANCELED" || order.shippingStatus === "CANCELED";
  const isFailed = order.shippingStatus === "FAILED";
  const isReturned = order.shippingStatus === "RETURNED";

  const timeline = order.hasPrescriptionItem ? prescriptionTimeline : normalTimeline;

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white px-4 py-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">{order.orderCode}</h1>
            <p className="text-xs text-zinc-500">{formatDate(order.orderDate)}</p>
          </div>
        </div>

        {/* Trạng thái badges */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-wrap gap-3 items-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${orderStatus.bg}`}>
            <OrderStatusIcon className={`w-4 h-4 ${orderStatus.text}`} />
            <span className={`text-sm font-bold ${orderStatus.text}`}>{orderStatus.label}</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${shippingStatus.bg}`}>
            <ShippingStatusIcon className={`w-4 h-4 ${shippingStatus.text}`} />
            <span className={`text-sm font-bold ${shippingStatus.text}`}>🚚 {shippingStatus.label}</span>
          </div>
          {order.requiresFinalPayment && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-100">
              <span className="text-sm font-bold text-orange-800">⚠️ Cần thanh toán thêm</span>
            </div>
          )}
        </div>

        {/* ── Timeline ── */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
          <h2 className="font-bold text-zinc-900 mb-5 flex items-center gap-2">
            <div className="w-7 h-7 bg-teal-600 rounded-lg flex items-center justify-center">
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
                  <div key={step.key} className="flex flex-col items-center flex-1 min-w-[72px]">
                    {/* Connector + dot row */}
                    <div className="relative w-full flex items-center justify-center mb-3">
                      {index > 0 && (
                        <div
                          className={`absolute right-1/2 top-4 w-full h-0.5 -z-0 ${status === "done" || status === "active"
                              ? "bg-teal-400"
                              : "bg-zinc-200"
                            }`}
                        />
                      )}
                      <div
                        className={`relative z-10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${status === "done"
                            ? "bg-teal-500 border-teal-500 text-white"
                            : status === "active"
                              ? "bg-white border-teal-500 shadow-lg shadow-teal-100"
                              : "bg-white border-zinc-200"
                          }`}
                      >
                        {status === "done" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : status === "active" ? (
                          <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
                        ) : (
                          <div className="w-2 h-2 rounded-full bg-zinc-300" />
                        )}
                      </div>
                    </div>

                    {/* Label */}
                    <p
                      className={`text-xs font-semibold text-center leading-tight ${status === "done"
                          ? "text-teal-600"
                          : status === "active"
                            ? "text-teal-700"
                            : "text-zinc-400"
                        }`}
                    >
                      {step.label}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Thông tin giao hàng */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="font-bold text-zinc-900">Thông tin giao hàng</h2>
          <div className="space-y-2 text-sm text-zinc-700">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-zinc-400" />
              <span className="font-semibold">{order.recipientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-400" />
              <span>{order.recipientPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>{order.recipientEmail}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-zinc-400 mt-0.5" />
              <span>{order.recipientAddress}</span>
            </div>
            {order.expectedDeliveryAt && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span>Dự kiến giao: {formatDate(order.expectedDeliveryAt)}</span>
                {order.isPastExpectedDeliveryAt && (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">
                    Quá hạn
                  </span>
                )}
              </div>
            )}
            {order.note && (
              <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-3 py-2 text-xs text-zinc-600">
                📝 {order.note}
              </div>
            )}
          </div>
        </div>

        {/* Sản phẩm thường */}
        {order.orderDetail?.length > 0 && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-zinc-900">Sản phẩm</h2>
            <div className="space-y-3">
              {order.orderDetail.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 rounded-2xl border border-zinc-100 p-3 hover:bg-zinc-50 transition">
                  <img
                    src={item.imageUrl}
                    alt={item.productName}
                    className="w-16 h-16 rounded-xl object-cover border border-zinc-200"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-zinc-900 truncate">{item.productName}</div>
                    <div className="text-xs text-zinc-500 mt-1">Số lượng: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-bold text-zinc-900 whitespace-nowrap">
                    {formatCurrency(item.totalPrice)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kính thuốc */}
        {order.prescriptionOrderDetail?.length > 0 && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-zinc-900 flex items-center gap-2">
              <Eye className="w-4 h-4 text-teal-600" /> Kính thuốc
            </h2>
            {order.prescriptionOrderDetail.map((item: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-zinc-100 p-4 space-y-3">
                {/* Gọng */}
                <div className="flex items-center gap-3">
                  <img
                    src={item.frameImg}
                    alt={item.frameName}
                    className="w-14 h-14 rounded-xl object-cover border border-zinc-200"
                  />
                  <div className="flex-1">
                    <div className="text-xs text-indigo-600 font-bold uppercase mb-0.5">Gọng kính</div>
                    <div className="font-semibold text-zinc-900 text-sm">{item.frameName}</div>
                    <div className="text-xs text-zinc-500">{formatCurrency(item.framePrice)}</div>
                  </div>
                </div>

                {/* Tròng */}
                {item.lensId && (
                  <div className="flex items-center gap-3">
                    <img
                      src={item.lensImg}
                      alt={item.lensName}
                      className="w-14 h-14 rounded-xl object-cover border border-zinc-200"
                    />
                    <div className="flex-1">
                      <div className="text-xs text-purple-600 font-bold uppercase mb-0.5">Tròng kính</div>
                      <div className="font-semibold text-zinc-900 text-sm">{item.lensName}</div>
                      <div className="text-xs text-zinc-500">{formatCurrency(item.lensPrice)}</div>
                    </div>
                  </div>
                )}

                {/* Thông số mắt */}
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                  <div className="text-xs font-bold text-zinc-700 mb-2">Thông số mắt</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="border-b border-zinc-200">
                          <th className="py-2 px-2 text-left font-bold text-zinc-600">Mắt</th>
                          <th className="py-2 px-2 text-center font-bold text-teal-600">SPH</th>
                          <th className="py-2 px-2 text-center font-bold text-teal-600">CYL</th>
                          <th className="py-2 px-2 text-center font-bold text-teal-600">AXIS</th>
                          <th className="py-2 px-2 text-center font-bold text-teal-600">ADD</th>
                          <th className="py-2 px-2 text-center font-bold text-teal-600">PD</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr className="border-b border-zinc-100 bg-blue-50/50">
                          <td className="py-2 px-2 font-bold text-zinc-700">👁️ Phải</td>
                          <td className="py-2 px-2 text-center">{item.rightEyeSph ?? "—"}</td>
                          <td className="py-2 px-2 text-center">{item.rightEyeCyl ?? "—"}</td>
                          <td className="py-2 px-2 text-center">{item.rightEyeAxis ?? "—"}</td>
                          <td className="py-2 px-2 text-center">{item.rightEyeAdd ?? "—"}</td>
                          <td className="py-2 px-2 text-center">{item.rightPD ?? "—"}</td>
                        </tr>
                        <tr className="bg-purple-50/50">
                          <td className="py-2 px-2 font-bold text-zinc-700">👁️ Trái</td>
                          <td className="py-2 px-2 text-center">{item.leftEyeSph ?? "—"}</td>
                          <td className="py-2 px-2 text-center">{item.leftEyeCyl ?? "—"}</td>
                          <td className="py-2 px-2 text-center">{item.leftEyeAxis ?? "—"}</td>
                          <td className="py-2 px-2 text-center">{item.leftEyeAdd ?? "—"}</td>
                          <td className="py-2 px-2 text-center">{item.leftPD ?? "—"}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="text-right text-sm font-bold text-zinc-900">
                  Tổng: {formatCurrency(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tổng tiền */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex justify-between text-sm text-zinc-600">
            <span>Phí vận chuyển</span>
            <span>{formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="h-px bg-zinc-100" />
          <div className="flex justify-between font-bold text-zinc-900">
            <span>Tổng cộng</span>
            <span className="text-teal-700 text-lg">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}