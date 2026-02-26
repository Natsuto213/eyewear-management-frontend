/**
 * ErrorState.jsx
 * Chức năng:
 * - Hiển thị UI lỗi + link quay lại trang sản phẩm
 */

import React from "react";
import { Link } from "react-router-dom";

function ErrorState({ message }) {
  return (
    <div className="text-center py-40">
      <h2 className="text-2xl font-bold text-red-600">
        {message || "Sản phẩm không tồn tại!"}
      </h2>
      <Link to="/all-product" className="mt-4 text-teal-600 underline">
        Quay lại cửa hàng
      </Link>
    </div>
  );
}

export default ErrorState;
