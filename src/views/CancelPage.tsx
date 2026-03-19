import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function CancelPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 m-10">
        <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full">
          
          {/* Icon huỷ */}
          <div className="flex justify-center mb-6">
            <div className="bg-red-100 p-4 rounded-full">
              <svg
                className="w-12 h-12 text-red-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </div>
          </div>

          {/* Tiêu đề */}
          <h1 className="text-2xl md:text-3xl font-bold text-red-600 mb-4">
            Thanh toán đã bị huỷ ❌
          </h1>

          {/* Mô tả */}
          <p className="text-gray-600 mb-8">
            Đơn hàng của bạn chưa được hoàn tất. Nếu có sự cố trong quá trình thanh toán,
            vui lòng thử lại hoặc liên hệ hỗ trợ.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-4">
            <Link to="/cart">
              <button className="w-full bg-red-600 hover:bg-red-700 transition duration-300 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg">
                Quay lại giỏ hàng
              </button>
            </Link>

            <Link to="/">
              <button className="w-full border border-gray-300 hover:bg-gray-100 transition duration-300 text-gray-700 font-medium py-3 rounded-lg">
                Về trang chủ
              </button>
            </Link>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}