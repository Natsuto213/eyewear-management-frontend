import {
  Clock, CheckCircle2, XCircle, Truck, Package,
  CreditCard, Ban, CheckCheck, RotateCcw,
} from "lucide-react";

export const BASE_URL = "https://api-eyewear.purintech.id.vn";

export const CANCELABLE_STATUSES = ["PENDING", "PARTIALLY_PAID", "PAID"];

export const REFUND_METHODS = [
  
];

export const orderStatusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  PENDING:        { label: "Chờ xác nhận",      bg: "bg-yellow-100",  text: "text-yellow-800",  icon: Clock },
  PARTIALLY_PAID: { label: "Thanh toán 1 phần", bg: "bg-orange-100",  text: "text-orange-800",  icon: CreditCard },
  PAID:           { label: "Đã thanh toán",     bg: "bg-emerald-100", text: "text-emerald-800", icon: CheckCircle2 },
  CONFIRMED:      { label: "Đã xác nhận",       bg: "bg-blue-100",    text: "text-blue-800",    icon: CheckCircle2 },
  PROCESSING:     { label: "Đang gia công",     bg: "bg-amber-100",   text: "text-amber-800",   icon: Package },
  READY:          { label: "Chờ vận chuyển",    bg: "bg-purple-100",  text: "text-purple-800",  icon: Package },
  COMPLETED:      { label: "Hoàn thành đơn",        bg: "bg-green-100",   text: "text-green-800",   icon: CheckCircle2 },
  CANCELED:       { label: "Đã hủy đơn",            bg: "bg-red-100",     text: "text-red-800",     icon: XCircle },
};

export const shippingConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  PENDING:   { label: "Chờ xử lý",      bg: "bg-zinc-100",   text: "text-zinc-700",   icon: Clock },
  PACKING:   { label: "Đang đóng gói",  bg: "bg-blue-100",   text: "text-blue-800",   icon: Package },
  SHIPPING:  { label: "Đang giao hàng", bg: "bg-indigo-100", text: "text-indigo-800", icon: Truck },
  DELIVERED: { label: "Giao thành công",        bg: "bg-green-100",  text: "text-green-800",  icon: CheckCircle2 },
  FAILED:    { label: "Giao thất bại",  bg: "bg-red-100",    text: "text-red-800",    icon: XCircle },
  RETURNED:  { label: "Hoàn hàng giao hàng",      bg: "bg-orange-100", text: "text-orange-800", icon: XCircle },
  CANCELED:  { label: "Đã hủy giao hàng",         bg: "bg-red-100",    text: "text-red-800",    icon: XCircle },
};

export const refundStatusConfig: Record<string, {
  label: string; bg: string; text: string; border: string; icon: any; desc: string
}> = {
  PENDING:   {
    label: "Đang chờ xử lý",
    bg: "bg-yellow-50", text: "text-yellow-800", border: "border-yellow-200",
    icon: Clock,
    desc: "Yêu cầu hủy đơn của bạn đang chờ nhân viên xem xét.",
  },
  APPROVED:  {
    label: "Đã chấp thuận",
    bg: "bg-blue-50", text: "text-blue-800", border: "border-blue-200",
    icon: CheckCircle2,
    desc: "Yêu cầu đã được duyệt. Chúng tôi đang tiến hành hoàn tiền cho bạn.",
  },
  COMPLETED: {
    label: "Hoàn tiền thành công",
    bg: "bg-green-50", text: "text-green-800", border: "border-green-200",
    icon: CheckCheck,
    desc: "Tiền đã được hoàn trả về tài khoản của bạn.",
  },
  REJECTED:  {
    label: "Bị từ chối",
    bg: "bg-red-50", text: "text-red-800", border: "border-red-200",
    icon: Ban,
    desc: "Yêu cầu hủy đơn của bạn đã bị từ chối.",
  },
};

export const prescriptionTimeline = [
  { key: "CONFIRMED",  label: "Đã xác nhận",      orderStatus: "CONFIRMED" },
  { key: "PROCESSING", label: "Đang gia công",     orderStatus: "PROCESSING" },
  { key: "PACKING",    label: "Đóng gói",          shippingStatus: "PACKING" },
  { key: "SHIPPING",   label: "Đang vận chuyển",   shippingStatus: "SHIPPING" },
  { key: "DELIVERED",  label: "Đã giao",           shippingStatus: "DELIVERED" },
  { key: "COMPLETED",  label: "Hoàn thành",        orderStatus: "COMPLETED" },
];

export const normalTimeline = [
  { key: "CONFIRMED",  label: "Đã xác nhận",      orderStatus: "CONFIRMED" },
  { key: "PACKING",    label: "Đóng gói",          shippingStatus: "PACKING" },
  { key: "SHIPPING",   label: "Đang vận chuyển",   shippingStatus: "SHIPPING" },
  { key: "DELIVERED",  label: "Đã giao",           shippingStatus: "DELIVERED" },
  { key: "COMPLETED",  label: "Hoàn thành",        orderStatus: "COMPLETED" },
];

export const formatCurrency = (v: number) =>
  v?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

export const formatDate = (str: string) => {
  if (!str) return "";
  return new Date(str).toLocaleString("vi-VN");
};

export function getTimelineStatus(
  step: { orderStatus?: string; shippingStatus?: string },
  order: any
): "done" | "active" | "pending" {
  const orderStatusOrder    = ["CONFIRMED", "PROCESSING", "READY", "COMPLETED"];
  const shippingStatusOrder = ["PENDING", "PACKING", "SHIPPING", "DELIVERED"];
  const currentOrderIdx     = orderStatusOrder.indexOf(order.orderStatus);
  const currentShippingIdx  = shippingStatusOrder.indexOf(order.shippingStatus);

  // Nếu đơn đã COMPLETED → tất cả các bước đều done
  if (order.orderStatus === "COMPLETED") return "done";

  if (step.orderStatus) {
    const stepIdx = orderStatusOrder.indexOf(step.orderStatus);
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