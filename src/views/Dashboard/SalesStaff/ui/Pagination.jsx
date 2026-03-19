import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({
    currentPage,
    totalPages,
    onPageChange,
    totalItems,
    itemsPerPage,
    startIndex
}) => {
    // Nếu không có dữ liệu hoặc chỉ có 1 trang thì không hiện thanh phân trang
    if (totalPages <= 1) return null;

    // Tạo mảng số trang để hiển thị (ví dụ: [1, 2, 3])
    const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className="flex flex-col md:flex-row items-center justify-between border-t bg-gray-50 px-6 py-4 gap-4">
            {/* Thông tin hiển thị: Hiển thị 1-10 trên 50 đơn */}
            <div className="text-sm text-gray-500">
                Hiển thị <span className="font-semibold text-gray-800">{startIndex + 1}</span> - {Math.min(startIndex + itemsPerPage, totalItems)} trên <span className="font-semibold text-gray-800">{totalItems}</span> kết quả
            </div>

            {/* Cụm nút bấm chuyển trang */}
            <div className="flex items-center gap-1">
                <button
                    disabled={currentPage === 1}
                    onClick={() => onPageChange(currentPage - 1)}
                    className="p-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronLeft className="w-5 h-5 text-gray-600" />
                </button>

                <div className="flex gap-1 mx-2">
                    {pageNumbers.map((number) => (
                        <button
                            key={number}
                            onClick={() => onPageChange(number)}
                            className={`min-w-[36px] h-9 rounded-lg text-sm font-bold transition-all ${currentPage === number
                                ? "bg-blue-600 text-white shadow-md shadow-blue-200"
                                : "bg-white border border-gray-200 text-gray-600 hover:border-blue-400 hover:text-blue-600"
                                }`}
                        >
                            {number}
                        </button>
                    ))}
                </div>

                <button
                    disabled={currentPage === totalPages}
                    onClick={() => onPageChange(currentPage + 1)}
                    className="p-2 rounded-lg border bg-white hover:bg-gray-100 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                >
                    <ChevronRight className="w-5 h-5 text-gray-600" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;