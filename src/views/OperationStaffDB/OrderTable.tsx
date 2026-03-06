// src/components/OrderTable.tsx
import React from "react";
import { OrderRow } from "../../lib/orders";

export default function OrderTable({ orders }: { orders: OrderRow[] }) {
  return (
    <table className="w-full bg-white rounded-xl overflow-hidden">
      <thead className="bg-gray-50 text-gray-600">
        <tr>
          <th className="p-3">Mã đơn</th>
          <th className="p-3">Ngày</th>
          <th className="p-3">Khách hàng</th>
          <th className="p-3">Trạng thái</th>
          <th className="p-3">Loại đơn</th>
          <th className="p-3">Tổng tiền</th>
        </tr>
      </thead>
      <tbody>
        {orders.map((order) => (
          <tr key={order.id} className="border-b hover:bg-gray-50">
            <td className="p-3">{order.code}</td>
            <td className="p-3">{new Date(order.date).toLocaleString()}</td>
            <td className="p-3">{order.customer}</td>
            <td className="p-3">{order.status}</td>
            <td className="p-3">{order.type}</td>
            <td className="p-3">{order.total}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
