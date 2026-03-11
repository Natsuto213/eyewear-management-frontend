import React from 'react'
import { Link } from 'react-router-dom'

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
};

const OrderRow = ({ order, index }) => {
    const formatted = order.orderDate.slice(0, 10).split('-').join('-');
    const typeVN = orderTypeVN[order.orderType] || order.orderType;
    const statusVN = orderStatusVN[order.orderStatus] || order.orderStatus;
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3">{index + 1}</td>

            <td className="px-4 py-3 font-semibold text-blue-600">
                {order.orderCode}
            </td>

            <td className="px-4 py-3">{formatted}</td>

            <td className="px-4 py-3 text-center">
                <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
                    {typeVN}
                </span>
            </td>

            <td className="px-4 py-3 text-center font-bold">
                ${order.totalAmount}
            </td>

            <td className="px-4 py-3 text-center">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold
                    ${statusVN === "Hoàn thành"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {statusVN}
                </span>
            </td>

            <td className="px-4 py-3 text-center">
                {order?.returnExchangeId ? (
                    <Link
                        key={`return-${order.returnExchangeId}`}
                        to={`/sales/ui/returnorderdetail/${order.returnExchangeId}`}
                        className="ml-2 rounded-lg bg-red-500 px-3 py-1 text-xs font-semibold text-white hover:bg-red-600 inline-block"
                    >
                        Xem chi tiết trả hàng
                    </Link>
                ) : (
                    <Link
                        key={`order-${order.orderId}`}
                        to={`/sales/ui/orderdetail/${order.orderId}`}
                        className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600 inline-block"
                    >
                        Xem chi tiết
                    </Link>
                )}

            </td>
        </tr>
    )
}

export default OrderRow
