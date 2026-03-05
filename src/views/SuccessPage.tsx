import React from "react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Link } from "react-router-dom";

export default function SuccessPage() {
  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 m-10">
        <div className="bg-white shadow-xl rounded-2xl p-10 text-center max-w-md w-full">
          
          {/* Icon thành công */}
          <div className="flex justify-center mb-6">
            <div className="bg-green-100 p-4 rounded-full">
              <svg
                className="w-12 h-12 text-green-600"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
          </div>

          {/* Tiêu đề */}
          <h1 className="text-2xl md:text-3xl font-bold text-green-600 mb-4">
            Đơn hàng đã đặt thành công 🎉
          </h1>

          {/* Mô tả */}
          <p className="text-gray-600 mb-8">
            Cảm ơn bạn đã mua hàng. Chúng tôi sẽ xử lý đơn hàng của bạn sớm nhất có thể.
          </p>

          {/* Nút */}
          <Link to="/all-product">
            <button className="w-full bg-green-600 hover:bg-green-700 transition duration-300 text-white font-medium py-3 rounded-lg shadow-md hover:shadow-lg">
              Tiếp tục mua hàng
            </button>
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}