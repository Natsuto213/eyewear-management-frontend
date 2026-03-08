import React from "react";
import { OrderRow } from "../../../lib/orders";

export default function OrderTable({ orders }: { orders: OrderRow[] }) {
  // Hàm format ngày để hiển thị theo định dạng dd/mm/yyyy
  const formatDate = (date: string) => {
    const newDate = new Date(date);
    return newDate.toLocaleDateString('vi-VN');
  };

  // Hàm format tiền tệ (thêm dấu phân cách nghìn)
  const formatCurrency = (value: string) => {
    return parseFloat(value).toLocaleString("vi-VN", {
      style: "currency",
      currency: "VND"
    });
  };

  return (
    <table className="w-full bg-white rounded-xl overflow-hidden shadow-md">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="p-4 text-left">Mã đơn</th>
          <th className="p-4 text-left">Ngày</th>
          <th className="p-4 text-left">Khách hàng</th>
          <th className="p-4 text-left">Trạng thái</th>
          <th className="p-4 text-left">Loại đơn</th>
          <th className="p-4 text-left">Tổng tiền</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => {
          const statusColor = {
            "PROCESSING": "bg-yellow-100 text-yellow-800",
            "COMPLETED": "bg-green-100 text-green-800",
            "CANCELED": "bg-red-100 text-red-800",
            "READY": "bg-blue-100 text-blue-800"
          };

          return (
            <tr key={order.id} className="border-b hover:bg-gray-50 transition-colors">
              <td className="p-4">{order.code}</td>
              <td className="p-4">{formatDate(order.date)}</td>
              <td className="p-4">{order.customer}</td>
              <td className={`p-4 rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-800'}`}>
                {order.status}
              </td>
              <td className="p-4">{order.type}</td>
              <td className="p-4 font-bold">{formatCurrency(order.total)}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
