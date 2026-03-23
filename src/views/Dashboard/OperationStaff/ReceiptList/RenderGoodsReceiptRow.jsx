import React from 'react';
import { Link } from 'react-router-dom';

const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount || 0);
};

const formatDate = (dateString) => {
    if (!dateString) return "Chưa cập nhật";
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN') + ' ' + date.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
};

const statusStyles = {
    ORDERED: 'bg-yellow-100 text-yellow-700',
    RECEIVED: 'bg-green-100 text-green-700',
    CANCELLED: 'bg-red-100 text-red-700'
};

const mapStatusVN = {
    ORDERED: 'Đang giao',
    RECEIVED: 'Đã nhận',
    CANCELLED: 'Đã hủy'
};

const RenderGoodsReceiptRow = ({ receipt, index }) => {
    return (
        <tr className="border-b border-gray-100 hover:bg-gray-50">
            <td className="px-4 py-3 text-gray-500 text-center">{index + 1}</td>
            <td className="px-4 py-3">
                <div className="font-bold text-blue-600">{receipt.receiptCode}</div>
                <div className="text-xs text-gray-500 italic truncate max-w-xs">{receipt.note || 'Không có ghi chú'}</div>
            </td>
            <td className="px-4 py-3">
                <div className="font-medium text-gray-800">{receipt.supplierName}</div>
                <div className="text-xs text-gray-500">Người tạo: {receipt.createdByName}</div>
            </td>
            <td className="px-4 py-3">
                <div className="text-sm text-gray-800">Đặt: {formatDate(receipt.orderDate)}</div>
                <div className="text-xs text-gray-500">Nhận: {formatDate(receipt.receivedDate)}</div>
            </td>
            <td className="px-4 py-3 text-right font-bold text-red-600">
                {formatCurrency(receipt.totalAmount)}
            </td>
            <td className="px-4 py-3 text-center">
                <span className={`rounded-full px-3 py-1 text-xs font-semibold ${statusStyles[receipt.status] || 'bg-gray-100 text-gray-600'}`}>
                    {mapStatusVN[receipt.status] || receipt.status}
                </span>
            </td>
            <td className="px-4 py-3 text-center">
                <Link
                    to={`/operation/goods-receipt/detail/${receipt.inventoryReceiptId}`}
                    className="rounded-lg bg-blue-500 px-3 py-1 text-xs font-semibold text-white hover:bg-blue-600 transition"
                >
                    Kiểm hàng
                </Link>
            </td>
        </tr>
    );
};

export default RenderGoodsReceiptRow;