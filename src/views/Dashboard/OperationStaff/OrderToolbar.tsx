import React from "react";
import { Search, CalendarDays, RefreshCcw, Filter, BarChart3, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";

const ORDER_TYPE_LABELS: Record<string, string> = {
  DIRECT_ORDER:       " Đơn trực tiếp",
  PRE_ORDER:          " Đơn đặt trước",
  PRESCRIPTION_ORDER: " Kính thuốc",
  MIX_ORDER:          " Đơn hỗn hợp",
};

export default function OrderToolbar({ filters, onFilterChange, onResetFilter, statusData, total, original }: any) {
  
  const statuses = statusData?.[0]?.statuses || [];
  const orderTypes = statusData?.[0]?.orderTypes || [];

  return (
    <div className="space-y-6 mb-8">
      {/* Statistics Bar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
      >
        <div className="bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-blue-100 text-sm font-semibold uppercase mb-1">Tổng đơn hàng</p>
              <p className="text-4xl font-bold">{original}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <BarChart3 className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-purple-100 text-sm font-semibold uppercase mb-1">Đang hiển thị</p>
              <p className="text-4xl font-bold">{total}</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <Filter className="w-7 h-7" />
            </div>
          </div>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-green-500 rounded-2xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-emerald-100 text-sm font-semibold uppercase mb-1">Tỷ lệ lọc</p>
              <p className="text-4xl font-bold">
                {original > 0 ? Math.round((total / original) * 100) : 0}%
              </p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-7 h-7" />
            </div>
          </div>
        </div>
      </motion.div>

      {/* Filter Section */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-2xl shadow-lg border-2 border-indigo-100 p-6"
      >
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Filter className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Bộ lọc tìm kiếm
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Tìm kiếm */}
          <div className="relative col-span-1 md:col-span-2 lg:col-span-1">
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block flex items-center gap-2">
              <Search className="w-3 h-3 text-indigo-500" />
              Tìm kiếm
            </label>
            <div className="relative group">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 group-focus-within:text-indigo-500 transition-colors" />
              <input
                name="searchQuery"
                type="text"
                placeholder="Mã đơn, khách hàng..."
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all bg-gray-50 focus:bg-white"
                value={filters.searchQuery}
                onChange={onFilterChange}
              />
            </div>
          </div>

          {/* Dropdown Trạng thái */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Trạng thái</label>
            <div className="relative">
              <select
                name="status"
                value={filters.status}
                onChange={onFilterChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm outline-none focus:border-purple-500 focus:ring-4 focus:ring-purple-100 focus:bg-white transition-all appearance-none cursor-pointer font-medium"
              >
                <option value="Tất cả">Tất cả trạng thái</option>
                {statuses.map((s: any) => (
                  <option key={s.code} value={s.code}>{s.displayName}</option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Dropdown Loại đơn */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">Loại đơn</label>
            <div className="relative">
              <select
                name="orderType"
                value={filters.orderType}
                onChange={onFilterChange}
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl bg-gray-50 text-sm outline-none focus:border-pink-500 focus:ring-4 focus:ring-pink-100 focus:bg-white transition-all appearance-none cursor-pointer font-medium"
              >
                <option value="Tất cả">Tất cả loại đơn</option>
                {orderTypes.map((type: string) => (
                  <option key={type} value={type}>
                    {ORDER_TYPE_LABELS[type] ?? type.replace(/_/g, " ")}
                  </option>
                ))}
              </select>
              <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Ô chọn ngày */}
          <div>
            <label className="text-xs font-bold text-gray-600 uppercase mb-2 block flex items-center gap-2">
              <CalendarDays className="w-3 h-3 text-blue-500" />
              Ngày đặt
            </label>
            <div className="relative group">
              <CalendarDays className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none group-focus-within:text-blue-500 transition-colors" />
              <input
                name="orderDate"
                type="date"
                className="w-full pl-10 pr-4 py-2.5 border-2 border-gray-200 rounded-xl text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 transition-all bg-gray-50 focus:bg-white"
                value={filters.orderDate}
                onChange={onFilterChange}
              />
            </div>
          </div>

          {/* Nút Reset */}
          <div className="flex items-end">
            <button 
              onClick={onResetFilter}
              className="w-full px-4 py-2.5 bg-gradient-to-r from-red-500 to-rose-500 hover:from-red-600 hover:to-rose-600 text-white rounded-xl font-bold text-sm flex items-center justify-center gap-2 shadow-lg hover:shadow-xl transition-all transform hover:scale-105"
            >
              <RefreshCcw className="w-4 h-4" /> Xóa lọc
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}