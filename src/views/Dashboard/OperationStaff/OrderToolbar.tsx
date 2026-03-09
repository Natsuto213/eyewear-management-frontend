import React from "react";
import { Search, Filter, CalendarDays, ChevronDown } from "lucide-react";

export default function OrderToolbar({ 
  totalOriginal,
  totalFiltered,
  orderStatuses,
  searchQuery,
  setSearchQuery,
  statusFilter,
  setStatusFilter,
  dateFilter,
  setDateFilter 
}: any) {
  
  const statuses = orderStatuses?.[0]?.statuses || [];

  return (
    <div className="flex gap-4 items-center flex-col md:flex-row mb-6">
      {/* Tìm kiếm */}
      <div className="relative flex-1 w-full">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Tìm mã đơn hoặc khách hàng..."
          className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm w-full focus:ring-2 focus:ring-blue-500 outline-none"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* Lọc Trạng thái */}
      <div className="relative w-full md:w-64">
        <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full appearance-none rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-10 py-2 text-sm outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
        >
          <option value="Tất cả">Tất cả trạng thái</option>
          {statuses.map((opt: any) => (
            <option key={opt.code} value={opt.code}>{opt.displayName}</option>
          ))}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
      </div>

      {/* Lọc Ngày */}
      <div className="relative w-full md:w-48">
        <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="date"
          value={dateFilter}
          onChange={(e) => setDateFilter(e.target.value)}
          className="w-full rounded-lg border border-gray-200 bg-gray-50 pl-10 pr-4 py-2 text-sm outline-none"
        />
      </div>

      <div className="md:ml-auto text-sm text-gray-500 font-medium whitespace-nowrap">
        Kết quả: <span className="text-blue-600">{totalFiltered}</span>/{totalOriginal} đơn
      </div>
    </div>
  );
}