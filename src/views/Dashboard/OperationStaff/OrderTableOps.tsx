import React from "react";
import { useNavigate } from "react-router-dom";

interface OrderRow {
  orderId: number;
  orderCode: string;
  customerName: string;
  orderType: string;
  orderStatus: string;
  orderDate: string;
  totalAmount: number;
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

  const statusColors: Record<string, string> = {
    PROCESSING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELED: "bg-red-100 text-red-800",
    READY: "bg-indigo-100 text-indigo-800",
  };

  if (loading) {
    return (
      <div className="w-full p-10 text-center bg-white border rounded-xl shadow-sm">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-blue-500 border-t-transparent mb-2"></div>
        <p className="text-gray-400 italic">Đang tải dữ liệu đơn hàng...</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-x-auto shadow-sm border border-gray-200 rounded-xl">
      <table className="w-full bg-white border-collapse">
        <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
          <tr>
            <th className="p-4 text-left font-semibold">Mã đơn</th>
            <th className="p-4 text-left font-semibold">Ngày đặt</th>
            <th className="p-4 text-left font-semibold">Khách hàng</th>
            <th className="p-4 text-left font-semibold">Trạng thái</th>
            <th className="p-4 text-left font-semibold">Loại đơn</th>
            <th className="p-4 text-left font-semibold">Tổng tiền</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {orders && orders.length > 0 ? (
            orders.map((order) => (
              <tr
                key={order.orderId}
                onClick={() => navigate(`/operation-staff/orders/${order.orderId}`)}
                className="hover:bg-blue-50 transition-colors cursor-pointer"
              >
                <td className="p-4 font-medium text-blue-600">{order.orderCode}</td>
                <td className="p-4 text-gray-600">{formatDate(order.orderDate)}</td>
                <td className="p-4 text-gray-700">{order.customerName || "Khách lẻ"}</td>
                <td className="p-4">
                  <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-800"}`}>
                    {order.orderStatus}
                  </span>
                </td>
                <td className="p-4 text-xs text-gray-500 font-mono">{order.orderType}</td>
                <td className="p-4 font-bold text-gray-900">{formatCurrency(order.totalAmount)}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={6} className="p-10 text-center text-gray-400 italic">
                Không có dữ liệu đơn hàng.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}