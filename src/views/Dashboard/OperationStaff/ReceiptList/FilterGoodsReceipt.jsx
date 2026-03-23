import React from 'react';

const statusVN = {
    ORDERED: 'Đang giao / Đã đặt',
    RECEIVED: 'Đã nhận',
    CANCELLED: 'Đã hủy'
};

const FilterGoodsReceipt = ({ filters, onFilterChange, onResetFilter, statusList }) => {
    return (
        <div className="mb-5 rounded-xl bg-white p-5 shadow">
            <h3 className="mb-4 text-base font-semibold text-gray-700">Bộ lọc phiếu nhập kho</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-4">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Tìm kiếm</label>
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={onFilterChange}
                        placeholder="Mã phiếu / Tên nhà cung cấp"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Ngày đặt hàng</label>
                    <input
                        type="date"
                        name="orderDate"
                        value={filters.orderDate}
                        onChange={onFilterChange}
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Trạng thái</label>
                    <select
                        name="status"
                        value={filters.status}
                        onChange={onFilterChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">-- Tất cả --</option>
                        {statusList.map(s => <option key={s} value={s}>{statusVN[s] || s}</option>)}
                    </select>
                </div>
                <div className="flex items-end">
                    <button
                        onClick={onResetFilter}
                        className="w-full rounded-lg bg-red-500 px-4 py-2 text-sm font-semibold text-white hover:bg-red-600"
                    >
                        Xóa lọc
                    </button>
                </div>
            </div>
        </div>
    );
};

export default FilterGoodsReceipt;