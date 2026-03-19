import { Link } from 'react-router-dom';
import { formatCurrency } from './utils/orderMaps'; // Giả sử hàm này bạn đã có
import { mapReturnExchangeStatus } from './utils/orderMaps'; // Hàm này để chuyển đổi trạng thái sang tiếng Việt

const statusStyles = {
    PENDING: 'bg-yellow-100 text-yellow-700',
    APPROVED: 'bg-blue-100 text-blue-700',
    REJECTED: 'bg-red-100 text-red-700',
    COMPLETED: 'bg-green-100 text-green-700'
};

const CancelledRow = ({ request, index }) => {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-500">{index + 1}</td>
            <td className="px-4 py-3">
                <div className="font-bold text-blue-600">{request.returnCode}</div>
                <div className="text-xs text-gray-400">Đơn: {request.orderCode}</div>
            </td>
            <td className="px-4 py-3">
                <div className="font-medium text-gray-800">{request.customerName}</div>
                <div className="text-xs text-gray-500">{request.customerPhone}</div>
            </td>
            <td className="px-4 py-3 text-center font-bold text-red-600">
                {formatCurrency(request.refundAmount)}
            </td>
            <td className="px-4 py-3 text-center">
                <span className="rounded bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600">
                    {request.refundMethod}
                </span>
            </td>
            <td className="px-4 py-3 text-center">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[request.returnExchangeStatus]}`}>
                    {mapReturnExchangeStatus(request.returnExchangeStatus) || request.returnExchangeStatus}
                </span>
            </td>
            <td className="px-4 py-3 text-center">
                <Link
                    to={`/sales/ui/cancelleddetail/${request.returnExchangeId}`}
                    className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600"
                >
                    Chi tiết
                </Link>
            </td>
        </tr>
    );
};

export default CancelledRow;