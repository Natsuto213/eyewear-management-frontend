import React from "react";
import { Search, CalendarDays, RefreshCcw } from "lucide-react";

export default function OrderToolbar({ filters, onFilterChange, onResetFilter, statusData, total, original }: any) {
  
  const statuses = statusData?.[0]?.statuses || [];
  const orderTypes = statusData?.[0]?.orderTypes || [];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-6 items-end">
      {/* Tìm kiếm */}
      <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Tìm kiếm</label>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            name="searchQuery"
            type="text"
            placeholder="Mã đơn, khách hàng..."
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.searchQuery}
            onChange={onFilterChange}
          />
        </div>
      </div>

      {/* Dropdown Trạng thái */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Trạng thái</label>
        <select
          name="status"
          value={filters.status}
          onChange={onFilterChange}
          className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm outline-none focus:bg-white"
        >
          <option value="Tất cả">Tất cả trạng thái</option>
          {statuses.map((s: any) => (
            <option key={s.code} value={s.code}>{s.displayName}</option>
          ))}
        </select>
      </div>

      {/* Dropdown Loại đơn */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Loại đơn</label>
        <select
          name="orderType"
          value={filters.orderType}
          onChange={onFilterChange}
          className="w-full px-3 py-2 border rounded-lg bg-gray-50 text-sm outline-none focus:bg-white"
        >
          <option value="Tất cả">Tất cả loại đơn</option>
          {orderTypes.map((type: string) => (
            <option key={type} value={type}>{type.replace('_', ' ')}</option>
          ))}
        </select>
      </div>

      {/* Ô chọn ngày */}
      <div>
        <label className="text-xs font-semibold text-gray-500 uppercase mb-1 block">Ngày đặt</label>
        <div className="relative">
          <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
          <input
            name="orderDate"
            type="date"
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-blue-500"
            value={filters.orderDate}
            onChange={onFilterChange}
          />
        </div>
      </div>

      {/* Nút Reset & Thống kê */}
      <div className="flex items-center justify-between gap-2">
        <button 
          onClick={onResetFilter}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600 transition font-medium"
        >
          <RefreshCcw className="w-4 h-4" /> Xóa lọc
        </button>
        <div className="text-xs font-bold bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-100">
          {total}/{original} đơn
        </div>
      </div>
    </div>
  );
}