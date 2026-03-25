import React from "react";
import { useNavigate } from "react-router";
import { motion } from "framer-motion";
import { Clock, CheckCircle2, XCircle, Package, TrendingUp, Truck } from "lucide-react";

interface OrderRow {
  orderId: number;
  orderCode: string;
  customerName: string;
  orderType: string;
  orderStatus: string;
  orderDate: string;
  totalAmount: number;
  shippingStatus?: string;
  returnExchangeId?: number | null;
  returnType?: string | null;
  returnExchangeStatus?: string | null;
}

interface OrderTableProps {
  orders: OrderRow[];
  loading?: boolean;
}

export default function OrderTable({ orders, loading }: OrderTableProps) {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "---" : date.toLocaleDateString("vi-VN");
  };

  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return "0 ₫";
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  // Order status — fallback khi shipping không override
  const orderStatusConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    CONFIRMED: {
      bg: "bg-gradient-to-r from-blue-100 to-cyan-100",
      text: "text-blue-800", icon: CheckCircle2, label: "Đã xác nhận",
    },
    PROCESSING: {
      bg: "bg-gradient-to-r from-amber-100 to-yellow-100",
      text: "text-amber-800", icon: Clock, label: "Đang gia công",
    },
    READY: {
      bg: "bg-gradient-to-r from-violet-100 to-purple-100",
      text: "text-violet-800", icon: CheckCircle2, label: "Chờ vận chuyển",
    },
    COMPLETED: {
      bg: "bg-gradient-to-r from-emerald-100 to-green-100",
      text: "text-emerald-800", icon: CheckCircle2, label: "Hoàn thành",
    },
    CANCELED: {
      bg: "bg-gradient-to-r from-red-100 to-rose-100",
      text: "text-red-800", icon: XCircle, label: "Đã hủy",
    },
  };

  // Shipping status — ưu tiên hiển thị hơn order status khi có nghĩa
  const shippingOverride: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    PACKING:   { bg: "bg-gradient-to-r from-blue-100 to-cyan-100",    text: "text-blue-800",    icon: Package,      label: "Đang đóng gói" },
    SHIPPING:  { bg: "bg-gradient-to-r from-indigo-100 to-blue-100",  text: "text-indigo-800",  icon: Truck,        label: "Đang giao hàng" },
    DELIVERED: { bg: "bg-gradient-to-r from-emerald-100 to-green-100",text: "text-emerald-800", icon: CheckCircle2, label: "Đã giao" },
    FAILED:    { bg: "bg-gradient-to-r from-red-100 to-rose-100",     text: "text-red-800",     icon: XCircle,      label: "Giao thất bại" },
    RETURNED:  { bg: "bg-gradient-to-r from-orange-100 to-amber-100", text: "text-orange-800",  icon: XCircle,      label: "Hoàn hàng" },
  };

  const orderTypeConfig: Record<string, { bg: string; text: string; label: string }> = {
    PRESCRIPTION_ORDER: {
      bg: "bg-gradient-to-r from-indigo-100 to-blue-100",
      text: "text-indigo-800", label: "Kính thuốc",
    },
    MIX_ORDER: {
      bg: "bg-gradient-to-r from-purple-100 to-pink-100",
      text: "text-purple-800", label: "Đơn hỗn hợp",
    },
    DIRECT_ORDER: {
      bg: "bg-gradient-to-r from-red-100 to-white-100",
      text: "text-purple-800", label: "Đơn trực tiếp",
    },
    PRE_ORDER: {
      bg: "bg-gradient-to-r from-purple-100 to-tear-100",
      text: "text-blue-800", label: "Đơn đặt trước",
    },
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full p-12 text-center bg-white border-2 border-indigo-100 rounded-2xl shadow-xl"
      >
        <div className="relative inline-block mb-4">
          <div className="absolute inset-0 animate-spin rounded-full h-12 w-12 border-4 border-indigo-200"></div>
          <div className="animate-spin rounded-full h-12 w-12 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent"></div>
        </div>
        <p className="text-gray-600 font-medium">Đang tải dữ liệu đơn hàng...</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full overflow-hidden shadow-xl border-2 border-indigo-100 rounded-2xl bg-white"
    >
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
            <tr>
              <th className="p-4 text-left font-bold text-sm uppercase tracking-wide">Mã đơn</th>
              <th className="p-4 text-left font-bold text-sm uppercase tracking-wide">Ngày đặt</th>
              <th className="p-4 text-left font-bold text-sm uppercase tracking-wide">Khách hàng</th>
              <th className="p-4 text-left font-bold text-sm uppercase tracking-wide">Trạng thái</th>
              <th className="p-4 text-left font-bold text-sm uppercase tracking-wide">Loại đơn</th>
              <th className="p-4 text-right font-bold text-sm uppercase tracking-wide">Tổng tiền</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {orders && orders.length > 0 ? (
              orders.map((order, index) => {
                // Ưu tiên shipping override, fallback về order status
                const display =
                  (order.shippingStatus && shippingOverride[order.shippingStatus])
                    ? shippingOverride[order.shippingStatus]
                    : (orderStatusConfig[order.orderStatus] || {
                        bg: "bg-gray-100", text: "text-gray-800",
                        icon: Package, label: order.orderStatus,
                      });

                const DisplayIcon = display.icon;

                const typeInfo = orderTypeConfig[order.orderType] || {
                  bg: "bg-gray-100", text: "text-gray-800",
                  label: order.orderType.replace(/_/g, " "),
                };

                return (
                  <motion.tr
                    key={order.orderId}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => navigate(`/operation-staff/orders/${order.orderId}`)}
                    className="hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all cursor-pointer group"
                  >
                    {/* Mã đơn */}
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Package className="w-4 h-4 text-white" />
                        </div>
                        <span className="font-bold text-indigo-600 group-hover:text-indigo-700">
                          {order.orderCode}
                        </span>
                      </div>
                    </td>

                    {/* Ngày đặt */}
                    <td className="p-4">
                      <div className="flex items-center gap-2 text-gray-600">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span>{formatDate(order.orderDate)}</span>
                      </div>
                    </td>

                    {/* Khách hàng */}
                    <td className="p-4">
                      <div className="font-semibold text-gray-800">
                        {order.customerName || "Khách lẻ"}
                      </div>
                    </td>

                    {/* Trạng thái — 1 badge thông minh */}
                    <td className="p-4">
                      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl ${display.bg} shadow-sm`}>
                        <DisplayIcon className={`w-4 h-4 ${display.text}`} />
                        <span className={`text-xs font-bold ${display.text}`}>
                          {display.label}
                        </span>
                      </div>
                    </td>

                    {/* Loại đơn */}
                    <td className="p-4">
                      <div className={`inline-flex items-center px-3 py-1.5 rounded-xl ${typeInfo.bg} shadow-sm`}>
                        <span className={`text-xs font-bold ${typeInfo.text}`}>
                          {typeInfo.label}
                        </span>
                      </div>
                    </td>

                    {/* Tổng tiền */}
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <TrendingUp className="w-4 h-4 text-green-600 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <span className="font-bold text-gray-900 text-lg">
                          {formatCurrency(order.totalAmount)}
                        </span>
                      </div>
                    </td>
                  </motion.tr>
                );
              })
            ) : (
              <tr>
                <td colSpan={6} className="p-12 text-center">
                  <div className="flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 rounded-full flex items-center justify-center">
                      <Package className="w-8 h-8 text-gray-400" />
                    </div>
                    <p className="text-gray-400 font-medium italic">Không có dữ liệu đơn hàng.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </motion.div>
  );
}