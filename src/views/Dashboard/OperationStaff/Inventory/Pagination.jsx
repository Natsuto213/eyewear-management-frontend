import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;
    return (
        <div className="flex justify-center items-center gap-4 p-4 border-t bg-slate-50">
            <button
                onClick={() => onPageChange(p => Math.max(p - 1, 1))}
                disabled={currentPage === 1}
                className="p-1 disabled:opacity-30 border rounded bg-white hover:bg-slate-100"
            >
                <ChevronLeft size={16} />
            </button>
            <span className="text-xs font-bold text-slate-600">Trang {currentPage} / {totalPages}</span>
            <button
                onClick={() => onPageChange(p => Math.min(p + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-1 disabled:opacity-30 border rounded bg-white hover:bg-slate-100"
            >
                <ChevronRight size={16} />
            </button>
        </div>
    );
};

export default Pagination;