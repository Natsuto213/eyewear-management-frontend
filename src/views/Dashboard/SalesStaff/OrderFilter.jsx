import React from 'react'

const OrderFilter = ({ filters, onFilterChange, onResetFilter, statusList, orderTypeList }) => {
    return (
        <div className="mb-5 rounded-xl bg-white p-5 shadow">
            <h3 className="mb-4 text-base font-semibold text-gray-700">Bộ lọc đơn hàng</h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-5">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Mã đơn hàng</label>
                    <input
                        type="text"
                        name="orderId"
                        value={filters.orderId}
                        onChange={onFilterChange}
                        placeholder="VD: ORD-001"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Ngày đặt hàng</label>
                    <input
                        type="text"
                        name="orderDate"
                        value={filters.orderDate}
                        onChange={onFilterChange}
                        placeholder="VD: 2026-03-04"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm
                                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    />
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Loại đơn</label>
                    <select
                        name="orderType"
                        value={filters.orderType}
                        onChange={onFilterChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    >
                        <option value="">-- Tất cả --</option>
                        {orderTypeList.map((type) => (
                            <option key={type} value={type}>{type}</option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Trạng thái</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={onFilterChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm
                                   focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                    >
                        <option value="">-- Tất cả --</option>
                        {statusList.map((s) => (
                            <option key={s} value={s}>{s}</option>
                        ))}
                    </select>
                </div>

                <div className="flex items-end">
                    <button
                        type="button"
                        onClick={onResetFilter}
                        className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold
                                   text-white hover:bg-red-600"
                    >
                        Xóa lọc
                    </button>
                </div>
            </div>
        </div>
    )
}

export default OrderFilter
