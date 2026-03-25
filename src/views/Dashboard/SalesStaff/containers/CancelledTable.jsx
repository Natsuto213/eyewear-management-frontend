import React, { useState, useEffect } from 'react';
import CancelledRow from '../ui/CancelledRow';
import CancelledFilter from '../ui/CancelledFilter';
import Pagination from '../ui/Pagination';
import { api } from '../../../../lib/api'

// Các hàm tiện ích logic
const isMatch = (value, keyword) => {
    const text = String(value || "").toLowerCase();
    const search = keyword.trim().toLowerCase();
    return text.includes(search);
};

const isExactMatch = (value, keyword) => {
    if (!keyword) return true;
    return String(value || "") === String(keyword);
};

const getUniqueList = (data, field) => {
    const result = [];
    data.forEach((item) => {
        const value = item[field];
        if (value && !result.includes(value)) {
            result.push(value);
        }
    });
    return result;
};

const CancelledTable = () => {
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Phân trang
    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = sessionStorage.getItem('cancelCurrentPage');
        return savedPage ? Number(savedPage) : 1;
    });
    const itemsPerPage = 12;

    // Bộ lọc
    const [filters, setFilters] = useState(() => {
        const saved = sessionStorage.getItem('cancelFilters');
        return saved ? JSON.parse(saved) : {
            search: "",      // Tìm theo mã RF, mã đơn, hoặc SĐT
            status: "",      // PENDING, APPROVED, REJECTED, COMPLETED
            method: "",      // MOMO, VCB...
            requestDate: "", // Lọc theo ngày
            returnType: ""
        };
    });

    const fetchRequests = () => {
        setLoading(true);
        api.get("api/staff/return-exchange/cancel-refund-requests")
            .then((res) => {
                // Dữ liệu mẫu bạn gửi nằm trong mảng, giả sử API trả về res.data hoặc res.data.result
                setRequests(res.data.result || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy danh sách hủy đơn:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchRequests();
    }, []);

    useEffect(() => {
        sessionStorage.setItem('cancelFilters', JSON.stringify(filters));
        sessionStorage.setItem('cancelCurrentPage', currentPage);
    }, [filters, currentPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setFilters({ search: "", status: "", method: "", requestDate: "", returnType: "" });
        setCurrentPage(1);
    };

    // Chuẩn bị dữ liệu cho Dropdown
    const statusList = getUniqueList(requests, "returnExchangeStatus");
    const methodList = getUniqueList(requests, "refundMethod");
    const returnTypeList = getUniqueList(requests, "returnType")

    // Logic lọc dữ liệu
    const filteredData = requests.filter((req) => {
        const matchSearch = isMatch(req.returnCode, filters.search) ||
            isMatch(req.orderCode, filters.search) ||
            isMatch(req.customerPhone, filters.search);
        const matchStatus = isExactMatch(req.returnExchangeStatus, filters.status);
        const matchMethod = isExactMatch(req.refundMethod, filters.method);
        const matchDate = isMatch(req.requestDate?.slice(0, 10), filters.requestDate);
        const matchReturnType = isExactMatch(req.returnType, filters.returnType);
        return matchSearch && matchStatus && matchMethod && matchDate && matchReturnType;
    });

    // Tính toán phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (loading) {
        return <div className="p-10 text-center text-lg text-gray-400">Đang tải danh sách hoàn tiền...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-200 p-6">
            <h2 className="mb-5 text-2xl font-bold text-gray-800">Quản lý đơn HUỶ</h2>

            <CancelledFilter
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilter={handleResetFilter}
                statusList={statusList}
                methodList={methodList}
                returnTypeList={returnTypeList}
            />

            <div className="overflow-hidden rounded-xl bg-white shadow">
                <div className="border-b bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    Số yêu cầu: <span className="font-semibold text-gray-800">{filteredData.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100 text-xs uppercase tracking-wide text-gray-500">
                                <th className="px-4 py-3 text-left font-semibold">STT</th>
                                <th className="px-4 py-3 text-left font-semibold">Mã Hoàn Tiền</th>
                                <th className="px-4 py-3 text-left font-semibold">Thông tin khách</th>
                                <th className="px-4 py-3 text-center font-semibold">Tiền hoàn</th>
                                <th className="px-4 py-3 text-center font-semibold">Phương thức</th>
                                <th className="px-4 py-3 text-center font-semibold">Trạng thái</th>
                                <th className="px-4 py-3 text-center font-semibold">Trạng thái RETURN</th>
                                <th className="px-4 py-3 text-center font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-600">
                            {currentItems.length > 0 ? (
                                currentItems.map((req, index) => (
                                    <CancelledRow
                                        key={req.returnExchangeId}
                                        request={req}
                                        index={indexOfFirstItem + index}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-400">
                                        Không tìm thấy yêu cầu nào phù hợp
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
                totalItems={filteredData.length}
                itemsPerPage={itemsPerPage}
                startIndex={indexOfFirstItem}
            />
        </div>
    );
};

export default CancelledTable;