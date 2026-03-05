import React, { useState, useEffect } from 'react'
import axios from 'axios'
import OrderFilter from './OrderFilter'
import OrderRow from './OrderRow'

// Hàm kiểm tra: giá trị có chứa từ khóa không
// Nếu keyword rỗng "" → includes("") = true → tự bỏ qua tiêu chí đó
const isMatch = (value, keyword) => {
    const text = String(value || "").toLowerCase()
    const search = keyword.trim().toLowerCase()
    return text.includes(search)
}

// Hàm lấy danh sách không trùng từ 1 cột (dùng cho dropdown)
const getUniqueList = (orders, field) => {
    const result = []
    orders.forEach((order) => {
        const value = order[field]
        // Chỉ thêm nếu có giá trị và chưa có trong result
        if (value && !result.includes(value)) {
            result.push(value)
        }
    })
    return result
}

const OrderTable = () => {

    // Mảng chứa toàn bộ đơn hàng từ API
    const [orders, setOrders] = useState([])

    // Đang tải dữ liệu?
    const [loading, setLoading] = useState(true)

    // Giá trị 4 ô lọc (rỗng = chưa lọc)
    const [filters, setFilters] = useState({
        orderId: "",
        orderDate: "",
        status: "",
        orderType: "",
    })

    // Gọi API lấy danh sách đơn hàng
    const fetchOrders = () => {
        axios.get("https://69a3030cbe843d692bd2bd7d.mockapi.io/data-orders")
            .then((res) => {
                setOrders(res.data || [])
                setLoading(false)
            })
            .catch((err) => {
                console.error("Lỗi khi gọi API:", err)
                setLoading(false)
            })
    }

    // Chạy 1 lần khi mở trang
    useEffect(() => {
        fetchOrders()
    }, [])

    // Khi user thay đổi 1 ô lọc bất kỳ
    const handleFilterChange = (e) => {
        console.log("e la gi: ", e)
        const { name, value } = e.target
        setFilters((prev) => ({ ...prev, [name]: value }))
    }

    // Khi user bấm "Xóa lọc" → đặt lại tất cả về rỗng
    const handleResetFilter = () => {
        setFilters({ orderId: "", orderDate: "", status: "", orderType: "" })
    }

    // Tạo danh sách không trùng cho 2 dropdown
    const statusList = getUniqueList(orders, "status")
    const orderTypeList = getUniqueList(orders, "orderType")

    // Lọc đơn hàng: kiểm tra từng đơn có khớp 4 tiêu chí không
    const filteredOrders = orders.filter((order) => {
        const matchId = isMatch(order.orderId, filters.orderId)
        const matchDate = isMatch(order.orderDate, filters.orderDate)
        const matchStatus = isMatch(order.status, filters.status)
        const matchType = isMatch(order.orderType, filters.orderType)
        // Phải khớp tất cả (ô nào rỗng thì tự bỏ qua)
        return matchId && matchDate && matchStatus && matchType
    })

    if (loading) {
        return <div className="p-10 text-center text-lg text-gray-400">Đang tải dữ liệu...</div>
    }

    return (
        <div className="min-h-screen bg-gray-200 p-6">
            <h2 className="mb-5 text-2xl font-bold text-gray-800">Quản lý Đơn hàng</h2>

            <OrderFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilter={handleResetFilter}
                statusList={statusList}
                orderTypeList={orderTypeList}
            />

            <div className="overflow-hidden rounded-xl bg-white shadow">
                <div className="border-b bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    Số đơn hiển thị: <span className="font-semibold text-gray-800">{filteredOrders.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100 text-xs uppercase tracking-wide text-gray-500">
                                <th className="px-4 py-3 text-left font-semibold">STT</th>
                                <th className="px-4 py-3 text-left font-semibold">Mã đơn</th>
                                <th className="px-4 py-3 text-left font-semibold">Ngày đặt</th>
                                <th className="px-4 py-3 text-center font-semibold">Loại đơn</th>
                                <th className="px-4 py-3 text-center font-semibold">Tổng tiền</th>
                                <th className="px-4 py-3 text-center font-semibold">Trạng thái</th>
                                <th className="px-4 py-3 text-center font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-600">
                            {filteredOrders.length > 0 ? (
                                filteredOrders.map((order, index) => (
                                    <OrderRow key={order.id} order={order} index={index} />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-400">
                                        Không có đơn hàng nào phù hợp bộ lọc
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default OrderTable
