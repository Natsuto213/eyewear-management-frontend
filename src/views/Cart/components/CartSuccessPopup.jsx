import React from "react";

export default function CartSuccessPopup({ show, onClose }) {
    if (!show) return null;
    return (
        <div className="fixed top-6 right-6 z-[9999] animate-in slide-in-from-right duration-300">
            <div className="bg-white border-l-4 border-green-500 rounded-xl shadow-2xl p-4 flex items-center gap-4 min-w-[300px]">
                {/* Icon với vòng tròn nền */}
                <div className="bg-green-100 p-2 rounded-full">
                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                </div>
                {/* Nội dung */}
                <div>
                    <p className="font-bold text-gray-800">Thành công!</p>
                    <p className="text-sm text-gray-500">Sản phẩm đã được thêm vào giỏ hàng.</p>
                </div>
                {/* Nút đóng nhanh (X) */}
                <button className="ml-auto text-gray-400 hover:text-gray-600" onClick={onClose}>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
