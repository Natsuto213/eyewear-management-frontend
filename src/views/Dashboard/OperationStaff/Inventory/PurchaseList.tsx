import React, { useState, useEffect, useMemo } from 'react';
import { RefreshCw, Calendar, FileText, Loader2 } from 'lucide-react';
import { api } from '@/lib/ApiService'; // Import api từ config của bạn
import { useNavigate } from 'react-router-dom';
// HÀM RENDER NHÃN TRẠNG THÁI (BADGE) DỰA THEO DATA BACKEND
const getStatusBadge = (status: string) => {
    switch (status) {
        case 'Fully Entered':
            return <span className="px-3 py-1 bg-green-500 text-white text-xs font-bold rounded-md">Đã nhập</span>;
        case 'Partially Entered':
            return <span className="px-3 py-1 bg-cyan-500 text-white text-xs font-bold rounded-md">Đã nhập một phần</span>;
        case 'REJECTED':
            return <span className="px-3 py-1 bg-red-600 text-white text-xs font-bold rounded-md">Từ chối/Hủy</span>;
        case 'Pending Verification':
            return <span className="px-3 py-1 bg-yellow-400 text-white text-xs font-bold rounded-md shadow-sm">Chờ xác thực</span>;
        default:
            return <span className="px-3 py-1 bg-gray-300 text-gray-700 text-xs font-bold rounded-md">{status || 'Không rõ'}</span>;
    }
};

// HÀM FORMAT NGÀY THÁNG (Từ 2026-03-15T... -> 15/03/2026)
const formatDate = (dateString: string | null) => {
    if (!dateString) return <span className="italic text-gray-400">Chưa nhận</span>;
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
};

export default function PurchaseList() {
    // --- STATE LƯU DỮ LIỆU API ---
    const [receipts, setReceipts] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // --- STATE CHO BỘ LỌC TÌM KIẾM ---
    const [filterCode, setFilterCode] = useState("");
    const [filterStatus, setFilterStatus] = useState("");
    const [filterSupplier, setFilterSupplier] = useState("");
    const [dateOrder, setDateOrder] = useState("");
    const [dateReceive, setDateReceive] = useState("");

    const navigation = useNavigate();

    // GỌI API LẤY DANH SÁCH PHIẾU NHẬP
    const fetchReceipts = async () => {
        setLoading(true);
        try {
            const response = await api.get('/api/inventory-receipts');
            setReceipts(response.data);
        } catch (error) {
            console.error("Lỗi khi tải danh sách phiếu nhập:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    // LỌC DỮ LIỆU TẠI FRONTEND (Client-side filtering)
    const filteredReceipts = useMemo(() => {
        return receipts.filter((receipt) => {
            // Lọc theo mã phiếu
            const matchCode = filterCode ? receipt.receiptCode?.toLowerCase().includes(filterCode.toLowerCase()) : true;
            // Lọc theo trạng thái
            const matchStatus = filterStatus ? receipt.status === filterStatus : true;
            // Lọc theo Nguồn nhập (Supplier ID)
            const matchSupplier = filterSupplier ? receipt.supplierId?.toString() === filterSupplier : true;

            // Lọc theo ngày đặt (So sánh phần YYYY-MM-DD)
            const matchOrderDate = dateOrder ? receipt.orderDate?.startsWith(dateOrder) : true;
            const matchReceiveDate = dateReceive ? receipt.receivedDate?.startsWith(dateReceive) : true;

            return matchCode && matchStatus && matchSupplier && matchOrderDate && matchReceiveDate;
        });
    }, [receipts, filterCode, filterStatus, filterSupplier, dateOrder, dateReceive]);

    // HÀM XỬ LÝ TÌM KIẾM (Hiện tại lọc tự động bằng useMemo, nút này để refresh data nếu cần)
    const handleSearch = () => {
        fetchReceipts(); // Load lại data mới nhất từ BE
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
                                className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-1.5 px-3 border bg-white"
                                value={filterCode}
                                onChange={(e) => setFilterCode(e.target.value)}
                                placeholder="VD: IR2026..."
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
                                <option value="ORDERED">Chờ xác thực (Đã đặt)</option>
                                <option value="RECEIVED">Đã nhập kho</option>
                                <option value="CANCELLED">Đã hủy</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap w-20">Ngày đặt</label>
                            <div className="relative w-full">
                                <Calendar className="w-4 h-4 text-gray-500 absolute left-2.5 top-2" />
                                <input
                                    type="date"
                                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    value={dateOrder}
                                    onChange={(e) => setDateOrder(e.target.value)}
                                />
                            </div>
                        </div>

                        {/* Nút Làm mới Data */}
                        <button
                            onClick={handleSearch}
                            className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 font-bold py-1.5 px-4 rounded-md shadow-sm flex items-center gap-2 text-sm transition-colors"
                        >
                            Làm mới <RefreshCw className="w-4 h-4" />
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
                                <option value="1">Công ty TNHH Kính Mắt Việt</option>
                                <option value="2">Công ty Phân Phối Quang Học</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 flex-1 min-w-[200px]">
                            <label className="text-sm font-semibold text-gray-700 whitespace-nowrap w-20">Ngày nhận</label>
                            <div className="relative w-full">
                                <Calendar className="w-4 h-4 text-gray-500 absolute left-2.5 top-2" />
                                <input
                                    type="date"
                                    className="w-full pl-8 pr-3 py-1.5 border border-gray-300 rounded-md shadow-sm text-sm focus:ring-blue-500 focus:border-blue-500 bg-white"
                                    value={dateReceive}
                                    onChange={(e) => setDateReceive(e.target.value)}
                                />
                            </div>
                        </div>

                        <div className="w-[110px] hidden md:block"></div>
                    </div>
                </div>

                {/* BẢNG DỮ LIỆU (TABLE) */}
                <div className="overflow-x-auto min-h-[300px]">
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
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-gray-500">
                                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                        Đang tải dữ liệu...
                                    </td>
                                </tr>
                            ) : filteredReceipts.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="p-10 text-center text-gray-500 italic">
                                        Không tìm thấy phiếu nhập nào phù hợp.
                                    </td>
                                </tr>
                            ) : (
                                filteredReceipts.map((receipt) => (
                                    <tr key={receipt.inventoryReceiptId} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-4 font-mono text-sm text-blue-600 font-bold">
                                            {receipt.receiptCode}
                                        </td>
                                        <td className="p-4 text-sm text-gray-700 font-medium">
                                            {receipt.supplierName}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {formatDate(receipt.orderDate)}
                                        </td>
                                        <td className="p-4 text-sm text-gray-600">
                                            {formatDate(receipt.receivedDate)}
                                        </td>
                                        <td className="p-4 text-center">
                                            {getStatusBadge(receipt.status)}
                                        </td>
                                        <td className="p-4 text-center">
                                            <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1.5 px-4 rounded-md text-sm shadow-sm transition-colors"
                                                onClick={() => navigation(`/operation-staff/purchase-detail/${receipt.inventoryReceiptId}`)}
                                            >
                                                Chi tiết
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* PAGINATION GIẢ LẬP (TÙY CHỌN) */}
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                    <span className="text-sm text-gray-500">
                        Hiển thị {filteredReceipts.length} phiếu
                    </span>
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