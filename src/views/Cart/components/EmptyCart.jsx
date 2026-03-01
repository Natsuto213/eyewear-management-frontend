/**
 * EmptyCart.jsx
 * ─────────────
 * Component hiển thị khi giỏ hàng TRỐNG (không có sản phẩm nào).
 *
 * Gồm:
 *  - Icon giỏ hàng lớn 🛒
 *  - Dòng chữ thông báo
 *  - Nút "Tiếp tục mua sắm" → link đến trang sản phẩm
 *
 * Không nhận props nào — chỉ hiển thị giao diện tĩnh.
 */

import { Link } from "react-router-dom";

export default function EmptyCart() {
    return (
        // Container: chiếm full màn hình, canh giữa mọi thứ
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center gap-5">
            {/* Icon lớn */}
            <p className="text-6xl">🛒</p>

            {/* Thông báo */}
            <p className="text-xl font-semibold text-gray-400">
                Giỏ hàng của bạn đang trống
            </p>

            {/* Nút link đến trang sản phẩm */}
            <Link
                to="/all-product"
                className="px-6 py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl transition-colors"
            >
                Tiếp tục mua sắm
            </Link>
        </div>
    );
}
