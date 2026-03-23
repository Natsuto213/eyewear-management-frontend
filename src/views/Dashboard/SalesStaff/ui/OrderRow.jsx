import React from 'react'
import { Link } from 'react-router-dom'
import { formatCurrency } from './utils/orderMaps';

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
    READY: 'Sẵn sàng giao',
    PROCESSING: 'Đang xử lý',
};

const returnExchangeStatusVN = {
    RETURN: 'Yêu cầu trả hàng',
    EXCHANGE: 'Yêu cầu đổi hàng',
    PENDING: 'Chờ xử lý',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối',
    COMPLETED: 'Hoàn tất',
};

const OrderRow = ({ order, index }) => {
    const formattedDate = order.orderDate ? order.orderDate.slice(0, 10).split('-').join('-') : '';
    const typeVN = order.orderType ? orderTypeVN[order.orderType] || order.orderType || '' : null;
    const statusVN = orderStatusVN[order.orderStatus] || order.orderStatus || '';
    const returnStatusVN = order.returnExchangeStatus ? (returnExchangeStatusVN[order.returnExchangeStatus] || order.returnExchangeStatus) : null;
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3">{index + 1}</td>

            <td className="px-4 py-3 font-semibold text-blue-600">
                {order.orderCode}
            </td>

            <td className="px-4 py-3">{formattedDate}</td>
            {!order.returnExchangeId && (
                <>
                    <td className="px-4 py-3 text-center">
                        <span className="rounded-full bg-gray-200 px-3 py-1 text-xs text-gray-700">
                            {typeVN}
                        </span>
                    </td>

                    <td className="px-4 py-3 text-center font-bold">
                        {formatCurrency(order.totalAmount)}
                    </td>
                </>
            )}


            <td className="px-4 py-3 text-center">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold mr-1
                    ${statusVN === 'Hoàn thành' ? 'bg-green-100 text-green-700' :
                        statusVN === 'Đã hủy' ? 'bg-red-100 text-red-700' :
                            statusVN === 'Đã xác nhận' ? 'bg-blue-100 text-blue-700' :
                                'bg-yellow-100 text-yellow-700'}
                `}
                >
                    {statusVN}
                </span>
            </td>

            {/* Thêm cột trạng thái đổi/trả riêng biệt */}

            {returnStatusVN && <td className="px-4 py-3 text-center">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold
                        ${returnStatusVN === 'Yêu cầu trả hàng' ? 'bg-purple-100 text-purple-700' :
                        returnStatusVN === 'Yêu cầu đổi hàng' ? 'bg-pink-100 text-pink-700' :
                            returnStatusVN === 'Đã duyệt' ? 'bg-green-100 text-green-700' :
                                returnStatusVN === 'Từ chối' ? 'bg-red-100 text-red-700' :
                                    returnStatusVN === 'Hoàn tất' ? 'bg-blue-100 text-blue-700' :
                                        'bg-gray-100 text-gray-700'}
                    `}
                >
                    {returnStatusVN}
                </span>
            </td>}


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
