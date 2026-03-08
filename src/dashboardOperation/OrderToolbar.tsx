import React, { useMemo, useState, useEffect } from "react";
import { OrderRow, OrderStatus } from "../lib/orders";
import { Search, Filter, CalendarDays, ChevronDown } from "lucide-react";  // Import các icon cần sử dụng

export default function OrderToolbar({
  orders,
  orderStatuses,
}: {
  orders: OrderRow[];
  orderStatuses: any[];
}) {
  const [q, setQ] = useState(""); // Tìm kiếm
  const [status, setStatus] = useState<"Tất cả" | OrderStatus>("Tất cả");
  const [date, setDate] = useState("");  // State để lưu ngày chọn
  const [showSearch, setShowSearch] = useState(false); // Hiển thị input tìm kiếm

  // Đặt giá trị ngày mặc định là ngày hôm nay
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];  // Lấy ngày hiện tại ở định dạng YYYY-MM-DD
    setDate(today);  // Cập nhật state với ngày hôm nay
  }, []);  // Chỉ thực hiện 1 lần khi component mount

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

  // Lấy trạng thái đơn hàng từ `orderStatuses` (cập nhật theo cấu trúc mới)
  const statuses = orderStatuses?.[0]?.statuses || [];

  return (
    <div className="bg-white shadow-md px-6 py-4 rounded-xl mb-4 flex flex-col md:flex-row gap-4 items-center">
      {/* Tìm kiếm */}
      <div className="relative flex-1">
        <input
          type="text"
          placeholder="Nhập mã đơn hàng,..."
          className={`rounded-lg border border-gray-300 px-3 py-1 text-sm outline-none transition-all duration-300 ${
            showSearch ? "mr-2 w-48 opacity-100" : "pointer-events-none w-0 opacity-0"
          }`}
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          onClick={() => setShowSearch(!showSearch)}
          className="p-2 hover:bg-gray-100 rounded-lg transition"
        >
          <Search className="size-5 text-gray-600 hover:text-black" />
        </button>
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
          className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-10 py-3 outline-none focus:bg-white focus:ring-4 focus:ring-gray-100 text-gray-800"
        >
          <option value="Tất cả">Lọc trạng thái</option>
          {statuses.map((statusOption) => (
            <option key={`${statusOption.code}-${statusOption.displayName}`} value={statusOption.code}>
              {statusOption.displayName}
            </option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" />
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
