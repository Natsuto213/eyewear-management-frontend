import React from 'react'
import { Link } from 'react-router-dom'

const OrderRow = ({ order, index }) => {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3">{index + 1}</td>

            <td className="px-4 py-3 font-semibold text-blue-600">
                {order.orderId}
            </td>

            <td className="px-4 py-3">{order.orderDate}</td>

            <td className="px-4 py-3 text-center">
                <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
                    {order.orderType}
                </span>
            </td>

            <td className="px-4 py-3 text-center font-bold">
                ${order.totalPrice}
            </td>

            <td className="px-4 py-3 text-center">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold
                    ${order.status === "Hoàn thành"
                        ? "bg-green-100 text-green-700"
                        : "bg-yellow-100 text-yellow-700"
                    }`}
                >
                    {order.status}
                </span>
            </td>

            <td className="px-4 py-3 text-center">
                <Link
                    to={`/sales/ui/orderdetail`} // Giả sử có route chi tiết đơn hàng
                    className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold 
               text-white hover:bg-blue-600 inline-block"
                >
                    Xem chi tiết
                </Link>
            </td>
        </tr>
    )
}

export default OrderRow
