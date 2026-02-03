import React from "react";
import { Link } from "react-router-dom";

const Cart: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-6xl">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h1 className="text-2xl font-semibold text-zinc-900">Giỏ hàng</h1>
          <p className="mt-2 text-sm text-zinc-500">
            Kiểm tra các sản phẩm bạn đã chọn trước khi thanh toán.
          </p>

          {/* Giỏ hàng (hiện tại là tạm thời chỉ có một nút link confirm) */}
          <div className="mt-6 flex justify-center">
            <Link
              to="/confirm"
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              Confirm
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
