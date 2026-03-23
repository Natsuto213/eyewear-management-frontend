import React, { useState, useEffect } from 'react';
import RenderGoodsReceiptRow from "./RenderGoodsReceiptRow";
import FilterGoodsReceipt from "./FilterGoodsReceipt";
import Pagination from '../../SalesStaff/ui/Pagination';
import { api } from '../../../../lib/api'


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

const ManageGoodsReceipts = () => {
    const [receipts, setReceipts] = useState([]);
    const [loading, setLoading] = useState(true);

    const [currentPage, setCurrentPage] = useState(() => {
        const savedPage = sessionStorage.getItem('receiptCurrentPage');
        return savedPage ? Number(savedPage) : 1;
    });
    const itemsPerPage = 12;

    const [filters, setFilters] = useState(() => {
        const saved = sessionStorage.getItem('receiptFilters');
        return saved ? JSON.parse(saved) : {
            search: "",
            status: "",
            orderDate: ""
        };
    });

    const fetchReceipts = () => {
        setLoading(true);
        api.get("/api/inventory-receipts")
            .then((res) => {
                setReceipts(res.data || []);
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi khi lấy danh sách phiếu nhập kho:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchReceipts();
    }, []);

    useEffect(() => {
        sessionStorage.setItem('receiptFilters', JSON.stringify(filters));
        sessionStorage.setItem('receiptCurrentPage', currentPage);
    }, [filters, currentPage]);

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
        setCurrentPage(1);
    };

    const handleResetFilter = () => {
        setFilters({ search: "", status: "", orderDate: "" });
        setCurrentPage(1);
    };

    const statusList = getUniqueList(receipts, "status");

    const filteredData = receipts.filter((req) => {
        const matchSearch = isMatch(req.receiptCode, filters.search) || isMatch(req.supplierName, filters.search);
        const matchStatus = isExactMatch(req.status, filters.status);
        const matchDate = isMatch(req.orderDate?.slice(0, 10), filters.orderDate);

        return matchSearch && matchStatus && matchDate;
    });

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(filteredData.length / itemsPerPage);

    if (loading) {
        return <div className="p-10 text-center text-lg text-gray-400">Đang tải danh sách phiếu nhập kho...</div>;
    }

    return (
        <div className="min-h-screen bg-gray-200 p-6">
            <h2 className="mb-5 text-2xl font-bold text-gray-800">Quản lý Nhập kho</h2>

            <FilterGoodsReceipt
                filters={filters}
                onFilterChange={handleFilterChange}
                onResetFilter={handleResetFilter}
                statusList={statusList}
            />

            <div className="overflow-hidden rounded-xl bg-white shadow">
                <div className="border-b bg-gray-50 px-4 py-3 text-sm text-gray-500">
                    Tổng số phiếu nhập: <span className="font-semibold text-gray-800">{filteredData.length}</span>
                </div>

                <div className="overflow-x-auto">
                    <table className="min-w-full">
                        <thead>
                            <tr className="bg-gray-100 text-xs uppercase tracking-wide text-gray-500">
                                <th className="px-4 py-3 text-center font-semibold">STT</th>
                                <th className="px-4 py-3 text-left font-semibold">Mã Phiếu</th>
                                <th className="px-4 py-3 text-left font-semibold">Nhà cung cấp</th>
                                <th className="px-4 py-3 text-left font-semibold">Thời gian</th>
                                <th className="px-4 py-3 text-right font-semibold">Tổng tiền</th>
                                <th className="px-4 py-3 text-center font-semibold">Trạng thái</th>
                                <th className="px-4 py-3 text-center font-semibold">Thao tác</th>
                            </tr>
                        </thead>
                        <tbody className="text-sm text-gray-600">
                            {currentItems.length > 0 ? (
                                currentItems.map((receipt, index) => (
                                    <RenderGoodsReceiptRow
                                        key={receipt.inventoryReceiptId}
                                        receipt={receipt}
                                        index={indexOfFirstItem + index}
                                    />
                                ))
                            ) : (
                                <tr>
                                    <td colSpan={7} className="py-8 text-center text-gray-400">
                                        Không tìm thấy phiếu nhập nào phù hợp
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

export default ManageGoodsReceipts;