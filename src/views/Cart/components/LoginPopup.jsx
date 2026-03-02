/**
 * LoginPopup.jsx
 * ───────────────
 * Popup hiển thị khi người dùng CHƯA ĐĂNG NHẬP mà cố thao tác giỏ hàng.
 *
 * Giao diện:
 *   - Overlay mờ phủ toàn màn hình
 *   - Hộp thoại ở giữa:
 *       🔒 Icon khóa
 *       "Chưa đăng nhập"
 *       "Hãy đăng nhập để mua hàng"
 *       [Đăng nhập ngay]  ← chuyển đến trang /login
 *       [Để sau]           ← đóng popup
 *
 * Props:
 *   - onClose: hàm gọi khi nhấn "Để sau" hoặc click vào overlay
 */

import { Link } from "react-router-dom";

export default function LoginPopup({ onClose }) {
    return (
        // ── Overlay: phủ toàn màn hình, nền mờ đen ──
        // Khi click vào vùng overlay (ngoài hộp thoại) → đóng popup
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
            onClick={onClose}
        >
            {/* ── Hộp thoại chính ── */}
            {/* stopPropagation: click bên trong hộp thoại KHÔNG đóng popup */}
            <div
                className="bg-white rounded-2xl shadow-xl p-8 max-w-sm w-full mx-4 text-center"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Icon khóa */}
                <div className="text-5xl mb-4">🔒</div>

                {/* Tiêu đề */}
                <h2 className="text-xl font-bold text-gray-800 mb-2">
                    Chưa đăng nhập
                </h2>

                {/* Mô tả */}
                <p className="text-gray-500 text-sm mb-6">
                    Hãy đăng nhập để mua hàng và quản lý giỏ hàng của bạn.
                </p>

                {/* Nút đăng nhập — chuyển đến trang /login */}
                {/* onClick={onClose}: TẮT popup trước khi chuyển trang
                    Nếu không tắt → login xong quay lại vẫn thấy popup */}
                <Link
                    to="/login"
                    onClick={onClose}
                    className="block w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors mb-3"
                >
                    Đăng nhập ngay
                </Link>

                {/* Nút đóng popup */}
                <button
                    onClick={onClose}
                    className="w-full py-3 text-gray-400 hover:text-gray-600 text-sm font-medium transition-colors"
                >
                    Để sau
                </button>
            </div>
        </div>
    );
}
