/**
 * LoadingState.jsx
 * Chức năng:
 * - Hiển thị UI loading cho ProductDetail
 */

import React from "react";

function LoadingState() {
  return (
    <div className="w-full h-screen flex items-center justify-center">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
      <p className="ml-4 font-bold text-teal-800 uppercase tracking-widest">
        Đang lấy dữ liệu...
      </p>
    </div>
  );
}

export default LoadingState;
