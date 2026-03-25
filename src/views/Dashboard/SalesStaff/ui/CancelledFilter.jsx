const statusVN = {
    PENDING: 'Chờ xử lý',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
    COMPLETED: 'Hoàn tất'
};

const returnTypeVN = {
    WARRANTY: 'Bảo hành',
    REFUND: 'Trả hàng hoàn tiền theo đơn',
    RETURN: 'Trả hàng hoàn tiền theo sản phẩm',
    CANCEL_ORDER: 'Đơn huỷ không cần hoàn tiền',
};
const CancelledFilter = ({ filters, onFilterChange, onResetFilter, statusList, methodList, returnTypeList }) => {
    return (
        <div className="mb-5 rounded-xl bg-white p-5 shadow">
            <h3 className="mb-4 text-base font-semibold text-gray-700">Bộ lọc yêu cầu</h3>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-6">
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Tìm kiếm</label>
                    <input
                        type="text"
                        name="search"
                        value={filters.search}
                        onChange={onFilterChange}
                        placeholder="Mã đơn / Mã RF / SĐT"
                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    />
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Ngày yêu cầu</label>
                    <input
                        type="date"
                        name="requestDate"
                        value={filters.requestDate}
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
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Phương thức</label>
                    <select
                        name="method"
                        value={filters.method}
                        onChange={onFilterChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">-- Tất cả --</option>
                        {methodList.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                </div>
                <div>
                    <label className="mb-1 block text-sm font-medium text-gray-600">Loại hoàn tiền</label>
                    <select
                        name="returnType"
                        value={filters.returnType}
                        onChange={onFilterChange}
                        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
                    >
                        <option value="">-- Tất cả --</option>
                        {returnTypeList.map(m => <option key={m} value={m}>{returnTypeVN[m] || m}</option>)}
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

export default CancelledFilter;