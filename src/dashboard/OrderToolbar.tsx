// src/components/OrderToolbar.tsx
import React, { useMemo, useState } from "react";
import { OrderRow, OrderStatus } from "../lib/orders";
import { Search, Filter, CalendarDays } from "lucide-react";  // Import các icon cần sử dụng

export default function OrderToolbar({ orders, orderStatuses }: { orders: OrderRow[], orderStatuses: any[] }) {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"Tất cả" | OrderStatus>("Tất cả");
  const [date, setDate] = useState("");

  // Lọc các đơn hàng theo tiêu chí tìm kiếm
  const filtered = useMemo(() => {
    const needle = q.toLowerCase().trim();
    return orders.filter((o) => {
      const matchQ =
        !needle ||
        o.code.toLowerCase().includes(needle) ||
        o.customer.toLowerCase().includes(needle);
      const matchStatus = status === "Tất cả" || o.status === status;
      const matchDate = !date || o.date.startsWith(date);
      return matchQ && matchStatus && matchDate;
    });
  }, [q, status, date, orders]);

  return (
    <div className="bg-white shadow px-6 py-4 rounded-xl mb-4 flex flex-col md:flex-row gap-4 items-center">
      {/* Tìm kiếm */}
      <div className="relative flex-1">
        <input
          className="flex-1 border px-4 py-2 rounded-xl"
          placeholder="Nhập mã đơn hàng, sđt hoặc email"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        {/* Icon Search */}
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
          <Search className="w-5 h-5" />
        </div>
      </div>

      {/* Dropdown Lọc trạng thái */}
      <div className="relative md:w-[240px]">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {/* Icon Filter */}
          <Filter className="w-5 h-5" />
        </div>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as any)}
          className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-10 py-3 outline-none focus:bg-white focus:ring-4 focus:ring-gray-100"
        >
          <option value="Tất cả">Lọc trạng thái</option>
          {orderStatuses.map((statusOption) => (
            // Kiểm tra `statusOption.code` có phải là duy nhất không
            <option key={`${statusOption.code}-${statusOption.displayName}`} value={statusOption.code}>
              {statusOption.displayName}
            </option>
          ))}
        </select>
      </div>

      {/* Chọn ngày */}
      <div className="relative md:w-[170px]">
        <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          {/* Icon Calendar */}
          <CalendarDays className="w-5 h-5" />
        </div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:bg-white focus:ring-4 focus:ring-gray-100"
        />
      </div>

      {/* Hiển thị kết quả tìm kiếm */}
      <div className="ml-auto text-gray-500">
        {filtered.length}/{orders.length} đơn
      </div>
    </div>
  );
}
