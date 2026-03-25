import React from "react";

const colorMap = {
    green: {
        bgIcon: "bg-green-100",
        textIcon: "text-green-600",
        border: "border-green-500",
    },
    red: {
        bgIcon: "bg-red-100",
        textIcon: "text-red-600",
        border: "border-red-500",
    },
};

export default function TopCenterPopup({ show, onClose, message, title = "Thông báo", color = "green" }) {
    if (!show) return null;

    const theme = colorMap[color] || colorMap.green;

    return (
        /* 1. Lớp nền xám nhẹ toàn màn hình:
           - bg-black/10: Màu xám rất nhạt (10% đen), vẫn đọc rõ nội dung bên dưới.
           - inset-0: Tràn toàn bộ màn hình.
        */
        <div
            className="fixed inset-0 z-[9998] bg-black/15 animate-in fade-in duration-300"
            onClick={onClose} // Click ra vùng xám để đóng
        >
            {/* 2. Container của Popup:
               - e.stopPropagation(): Ngăn việc click vào popup bị tính là click ra ngoài.
            */}
            <div
                className="fixed top-0 left-1/2 -translate-x-1/2 z-[9999] p-2 w-full max-w-sm animate-in slide-in-from-top duration-300"
                onClick={(e) => e.stopPropagation()}
            >
                <div className={`bg-white border-t-4 ${theme.border} rounded-b-lg shadow-2xl p-3 flex items-center gap-3 border-x border-b border-gray-100`}>

                    {/* Icon */}
                    <div className={`${theme.bgIcon} p-1.5 rounded-full shrink-0 shadow-inner`}>
                        <svg className={`w-5 h-5 ${theme.textIcon}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            {color === "green" ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            )}
                        </svg>
                    </div>

                    {/* Nội dung */}
                    <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-bold text-gray-900 leading-tight truncate">
                            {title}
                        </h4>
                        <p className="text-xs text-gray-600 mt-0.5 leading-relaxed line-clamp-2">
                            {message}
                        </p>
                    </div>

                    {/* Nút đóng */}
                    <button
                        className="p-1 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 transition-all shrink-0 active:scale-95"
                        onClick={onClose}
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
}