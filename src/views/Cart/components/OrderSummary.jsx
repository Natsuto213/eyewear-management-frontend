/**
 * OrderSummary.jsx
 * ─────────────────
 * Component hiển thị SIDEBAR TÓM TẮT ĐƠN HÀNG (bên phải).
 *
 * ⚡ CHỈ hiển thị những sản phẩm ĐƯỢC TICK (selectedItems)
 * ⚡ Tổng tiền chỉ tính cho sản phẩm được tick (selectedTotal)
 *
 * Gồm:
 *   - Tiêu đề "Tóm tắt đơn hàng"
 *   - Danh sách tên + thành tiền (chỉ sản phẩm được tick)
 *   - Tổng cộng (chỉ sản phẩm được tick)
 *   - Nút "Tiến hành đặt hàng" (disable nếu chưa tick gì)
 *   - Link "Tiếp tục mua sắm"
 *
 * Props:
 *   - selectedItems: mảng sản phẩm ĐÃ ĐƯỢC TICK
 *   - selectedTotal: tổng tiền của sản phẩm được tick
 *   - formatCurrency: hàm format tiền VND
 *   - onCheckout: hàm gọi khi nhấn "Tiến hành đặt hàng"
 */

import { Link } from "react-router-dom";

export default function OrderSummary({ selectedItems, selectedTotal, formatCurrency, onCheckout }) {
    // Kiểm tra: có sản phẩm nào được tick không?
    const hasSelection = selectedItems.length > 0;

    return (
        // Container: sticky để luôn dính khi cuộn trang
        <div className="lg:w-72 w-full shrink-0">
            <div className="bg-white rounded-2xl shadow-sm p-6 space-y-4 sticky top-6">

                {/* ── Tiêu đề ── */}
                <h2 className="font-bold text-gray-800 text-base">
                    Tóm tắt đơn hàng
                    {/* Hiện số lượng sản phẩm được chọn */}
                    {hasSelection && (
                        <span className="ml-1 text-sm font-normal text-gray-400">
                            ({selectedItems.length} được chọn)
                        </span>
                    )}
                </h2>

                <hr className="border-gray-100" />

                {/* ── Danh sách sản phẩm được tick ── */}
                {hasSelection ? (
                    <ul className="space-y-2 max-h-60 overflow-y-auto">
                        {selectedItems.map((item) => {
                            // Tính thành tiền — dùng item.price từ server
                            const lineTotal = item.price * item.quantity;

                            return (
                                <li
                                    key={`sum-${item.cartItemId}`}
                                    className="flex justify-between items-start text-sm gap-2"
                                >
                                    {/* Tên sản phẩm + số lượng */}
                                    <span className="text-gray-600 line-clamp-1 flex-1">
                                        {item.nameProduct}
                                        {item.quantity > 1 && (
                                            <span className="text-gray-400 ml-1">x{item.quantity}</span>
                                        )}
                                    </span>

                                    {/* Thành tiền */}
                                    <span className="font-medium text-gray-800 whitespace-nowrap shrink-0">
                                        {formatCurrency(lineTotal)}
                                    </span>
                                </li>
                            );
                        })}
                    </ul>
                ) : (
                    // Chưa tick gì → hiện thông báo
                    <p className="text-sm text-gray-400 text-center py-4">
                        Vui lòng chọn sản phẩm để đặt hàng
                    </p>
                )}

                <hr className="border-gray-100" />

                {/* ── Tổng cộng ── */}
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">Tổng cộng</span>
                    <span className="text-xl font-bold text-red-500">
                        {formatCurrency(selectedTotal)}
                    </span>
                </div>

                {/* ── Nút đặt hàng — disable nếu chưa chọn gì ── */}
                <button
                    onClick={onCheckout}
                    disabled={!hasSelection}
                    className={`w-full py-3 font-semibold rounded-xl transition-all ${hasSelection
                        ? "bg-teal-600 hover:bg-teal-700 active:scale-95 text-white"
                        : "bg-gray-200 text-gray-400 cursor-not-allowed"
                        }`}
                >
                    {hasSelection
                        ? "Tiến hành đặt hàng →"
                        : "Chọn sản phẩm để đặt hàng"
                    }
                </button>

                {/* ── Link quay lại ── */}
                <Link
                    to="/all-product"
                    className="block text-center text-sm text-gray-400 hover:text-teal-600 transition-colors"
                >
                    ← Tiếp tục mua sắm
                </Link>
            </div>
        </div>
    );
}
