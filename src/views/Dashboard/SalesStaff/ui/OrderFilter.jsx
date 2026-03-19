import React from 'react'

const orderTypeVN = {
    MIX_ORDER: 'Đơn hàng kết hợp',
    DIRECT_ORDER: 'Đơn hàng mua trực tiếp',
    PRE_ORDER: 'Đơn hàng đặt trước',
    PRESCRIPTION_ORDER: 'Đơn hàng theo đơn kính',
};

const orderStatusVN = {
    PENDING: 'Chờ xử lý',
    PARTIALLY_PAID: 'Đã thanh toán một phần',
    PAID: 'Hoàn tất thanh toán',
    CANCELED: 'Đã hủy',
    COMPLETED: 'Hoàn thành',
    CONFIRMED: 'Đã xác nhận',
    READY: "Sẵn sàng giao",
    PROCESSING: "Đang xử lý",
};

const returnExchangeStatusVN = {
    RETURN: 'Yêu cầu trả hàng',
    EXCHANGE: 'Yêu cầu đổi hàng',
    PENDING: 'Chờ xử lý',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
    COMPLETED: 'Hoàn tất',
};

const OrderFilter = ({ filters, onFilterChange, onResetFilter, statusList, orderTypeList, returnExchangeStatusList }) => {
    return (
        <div className="mb-5 rounded-xl bg-white p-5 shadow">
            <h3 className="mb-4 text-base font-semibold text-gray-700">Bộ lọc đơn hàng</h3>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
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

                {!returnExchangeStatusList && (
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
                                <option key={type} value={type}>{orderTypeVN[type] || type}</option>
                            ))}
                        </select>
                    </div>
                )}

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
                            <option key={s} value={s}>{orderStatusVN[s] || s}</option>
                        ))}
                    </select>
                </div>

                {returnExchangeStatusList && (
                    <div>
                        <label className="mb-1 block text-sm font-medium text-gray-600">Trạng thái đổi/trả</label>
                        <select
                            name="returnExchangeStatus"
                            value={filters.returnExchangeStatus}
                            onChange={onFilterChange}
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 focus:outline-none"
                        >
                            <option value="">-- Tất cả --</option>
                            {returnExchangeStatusList.map((s) => (
                                <option key={s} value={s}>{returnExchangeStatusVN[s] || s}</option>
                            ))}
                        </select>
                    </div>
                )}

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
