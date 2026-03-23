import React, { useState } from 'react';
import { Search, Calendar, FileText } from 'lucide-react';

// 1. DỮ LIỆU GIẢ LẬP (MOCK DATA)
const mockPurchaseOrders = [
    {
        id: "PO-2026-001",
        supplierName: "Công ty TNHH Eyewear Miền Nam",
        orderDate: "01/01/2026",
        receiveDate: "04/01/2026",
        status: "COMPLETED"
    },
    {
        id: "PO-2026-002",
        supplierName: "Tổng đại lý Ray-Ban VN",
        orderDate: "01/01/2026",
        receiveDate: "04/01/2026",
        status: "REJECTED"
    },
    {
        id: "PO-2026-003",
        supplierName: "Nhà phân phối Tròng kính Essilor",
        orderDate: "01/01/2026",
        receiveDate: null,
        status: "PENDING"
    },
    {
        id: "PO-2026-004",
        supplierName: "Công ty TNHH Kính Mắt Sài Gòn",
        orderDate: "15/02/2026",
        receiveDate: null,
        status: "PENDING"
    }
];

// 2. HÀM RENDER NHÃN TRẠNG THÁI (BADGE)
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'COMPLETED':
            return <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-md">Đã nhập</span>;
        case 'REJECTED':
            return <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-md">Từ chối</span>;
        case 'PENDING':
            return <span className="px-3 py-1 bg-yellow-400 text-white text-xs font-bold rounded-md shadow-sm">Chờ xác thực</span>;
        default:
            return <span className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-bold rounded-md">Không rõ</span>;
    }
};

export default function PurchaseList() {
    // STATE CHO BỘ LỌC TÌM KIẾM
    const [filterCode, setFilterCode] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterSupplier, setFilterSupplier] = useState("");
    const [dateOrder, setDateOrder] = useState("");
    const [dateReceive, setDateReceive] = useState("");

    // HÀM XỬ LÝ TÌM KIẾM (Tạm thời chỉ in ra console, sau này nối API vào đây)
    const handleSearch = () => {
        console.log("Đang tìm kiếm với:", { filterCode, filterStatus, filterSupplier, dateOrder, dateReceive });
        // Ở đây bạn có thể gọi API: api.get(`/api/purchases?code=${filterCode}...`)
    };

    return (
        <main className="max-w-6xl mx-auto py-6 px-4 font-sans min-h-screen">
            {/* TIÊU ĐỀ */}
            <h1 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2">
                <FileText className="w-6 h-6 text-gray-600" /> 
                QUẢN LÝ PHIẾU NHẬP KHO
            </h1>

            {/* KHU VỰC BACKGROUND TRẮNG */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                
                {/* BỘ LỌC (FILTERS) */}
                <div className="bg-gray-50 p-4 rounded-lg border border-gray-100 space-y-4">
                    {/* Dòng 1 */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap w-24">Mã phiếu</label>
                            <input 
                                type="text" 
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-1.5 px-3 border"
                                value={filterCode}
                                onChange={(e) => setFilterCode(e.target.value)}
                            />
                        </div>

                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap w-24">Tình trạng</label>
                            <select 
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-1.5 px-3 border bg-white"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="">Tất cả</option>
                                <option value="PENDING">Chờ xác thực</option>
                                <option value="COMPLETED">Đã nhập</option>
                                <option value="REJECTED">Từ chối</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap w-20">Ngày đặt</label>
                            <div className="relative w-full">
                                <Calendar className="w-4 h-4 text-gray-500 absolute left-2.5 top-2" />
                                <input 
                                    type="date" 
                                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={dateOrder}
                                    onChange={(e) => setDateOrder(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Nút Tìm kiếm nằm cuối dòng 1 */}
                        <button 
                            onClick={handleSearch}
                            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold py-1.5 px-4 rounded-md shadow-sm flex items-center gap-2 text-sm transition-colors"
                        >
                            Tìm kiếm <Search className="w-4 h-4" />
                        </button>
                    </div>

                    {/* Dòng 2 */}
                    <div className="flex flex-wrap items-center gap-4">
                        <div className="flex items-center gap-2 flex-[2] min-w-[300px]">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap w-24">Nguồn nhập</label>
                            <select 
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-1.5 px-3 border bg-white"
                                value={filterSupplier}
                                onChange={(e) => setFilterSupplier(e.target.value)}
                            >
                                <option value="">-- Tất cả nhà cung cấp --</option>
                                <option value="SUP001">Công ty TNHH Eyewear Miền Nam</option>
                                <option value="SUP002">Tổng đại lý Ray-Ban VN</option>
                                <option value="SUP003">Nhà phân phối Tròng kính Essilor</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap w-20">Ngày nhận</label>
                            <div className="relative w-full">
                                <Calendar className="w-4 h-4 text-gray-500 absolute left-2.5 top-2" />
                                <input 
                                    type="date" 
                                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500"
                                    value={dateReceive}
                                    onChange={(e) => setDateReceive(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Để giữ layout cân bằng với Nút Tìm kiếm ở trên */}
                        <div className="w-[110px] hidden md:block"></div> 
                    </div>
                </div>

                {/* BẢNG DỮ LIỆU (TABLE) */}
                <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="border-b-2 border-gray-200">
                                <th className="p-4 font-bold text-gray-800 text-sm">Mã phiếu</th>
                                <th className="p-4 font-bold text-gray-800 text-sm">Nguồn nhập</th>
                                <th className="p-4 font-bold text-gray-800 text-sm">Ngày đặt</th>
                                <th className="p-4 font-bold text-gray-800 text-sm">Ngày nhận</th>
                                <th className="p-4 font-bold text-gray-800 text-sm text-center">Tình trạng</th>
                                <th className="p-4 font-bold text-gray-800 text-sm text-center">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {mockPurchaseOrders.map((order, index) => (
                                <tr key={index} className="hover:bg-gray-50 transition-colors">
                                    <td className="p-4 font-mono text-sm text-gray-700 font-medium">
                                        {order.id}
                                    </td>
                                    <td className="p-4 text-sm text-gray-700">
                                        {order.supplierName}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {order.orderDate}
                                    </td>
                                    <td className="p-4 text-sm text-gray-600">
                                        {order.receiveDate ? order.receiveDate : 'null'}
                                    </td>
                                    <td className="p-4 text-center">
                                        {getStatusBadge(order.status)}
                                    </td>
                                    <td className="p-4 text-center">
                                        <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-md text-sm shadow-sm transition-colors">
                                            Chi tiết
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION GIẢ LẬP (TÙY CHỌN) */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">Hiển thị 1 - 4 trên tổng số 4 phiếu</span>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 bg-gray-50 cursor-not-allowed">Trang trước</button>
                        <button className="px-3 py-1 border border-blue-500 bg-blue-50 rounded text-sm text-blue-600 font-bold">1</button>
                        <button className="px-3 py-1 border border-gray-300 rounded text-sm text-gray-500 bg-gray-50 cursor-not-allowed">Trang sau</button>
                    </div>
                </div>

            </div>
        </main>
    );
}