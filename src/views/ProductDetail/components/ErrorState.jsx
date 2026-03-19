/**
 * ErrorState.jsx
 * ===============
 * Hiển thị màn hình lỗi khi không tìm thấy sản phẩm hoặc API lỗi.
 * Có nút "Quay lại" để người dùng điều hướng về trang sản phẩm.
 */

import { Link } from "react-router-dom";

/**
 * @param {string} message - Thông báo lỗi cụ thể từ API hoặc hook
 */
export default function ErrorState({ message }) {
    return (
        <div className="w-full min-h-screen flex flex-col items-center justify-center gap-4 text-center px-4">
            <h2 className="text-2xl font-bold text-red-600">
                {message || "Sản phẩm không tồn tại!"}
            </h2>

            <p className="text-gray-500 text-sm">
                Sản phẩm bạn tìm kiếm có thể đã bị xóa hoặc không tồn tại.
            </p>

            {/* Nút quay lại */}
            <Link
                to="/all-product"
                className="mt-2 px-6 py-2 bg-teal-500 text-white rounded-lg hover:bg-teal-600 transition font-semibold"
            >
                Quay lại cửa hàng
            </Link>
        </div>
    );
}
