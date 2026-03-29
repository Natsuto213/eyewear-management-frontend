/**
 * CartPage.jsx
 * ─────────────
 * TRANG CHÍNH của giỏ hàng.
 *
 * Chức năng chính:
 *   1. Lấy dữ liệu từ ShoppingContext (giỏ hàng, hàm xử lý)
 *   2. Quản lý state "selectedKeys" — danh sách sản phẩm được tick ✅
 *   3. Chỉ những sản phẩm được tick mới hiện bên OrderSummary & tính tổng tiền
 *   4. Khi đặt hàng → gửi danh sách cartItemId qua trang ConfirmPage
 *
 */

import { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useShoppingContext } from "../contexts/ShoppingContext";
import { formatCurrency } from "../helpers/common";
import { ArrowLeft } from "lucide-react";
// Import các component con
import EmptyCart from "./EmptyCart";
import CartTable from "./CartTable";
import OrderSummary from "./OrderSummary";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Hàm tạo key DUY NHẤT cho mỗi item trong giỏ ──
// Dùng cartItemId từ server (mỗi item có ID duy nhất)
function getItemKey(item) {
    return `cart-${item.cartItemId}`;
}

export default function CartPage() {
    const {
        cartItems,
        clearCart,
        increaseQty,
        decreaseQty,
        removeCartItem,
        loading,
    } = useShoppingContext();

    const navigate = useNavigate();

    //  State quản lý checkbox — lưu danh sách key được tick
    // selectedKeys là MẢNG chứa key dạng "cart-7", "cart-8", ...
    const [selectedKeys, setSelectedKeys] = useState(() => {
        const saved = sessionStorage.getItem("selected_keys");
        return saved ? JSON.parse(saved) : [];
    });

    // ── Hàm tick/bỏ tick 1 sản phẩm ──
    const handleToggle = (itemKey) => {
        setSelectedKeys((prev) => {
            const alreadySelected = prev.includes(itemKey);
            if (alreadySelected) {
                return prev.filter((key) => key !== itemKey);
            } else {
                return [...prev, itemKey];
            }
        });
    };

    // ── Hàm tick tất cả / bỏ tick tất cả ──
    const handleToggleAll = () => {
        if (selectedKeys.length === cartItems.length) {
            setSelectedKeys([]);
        } else {
            const allKeys = cartItems.map((item) => getItemKey(item));
            setSelectedKeys(allKeys);
        }
    };

    // Lọc ra những sản phẩm ĐƯỢC TICK
    const selectedItems = useMemo(() => {
        return cartItems.filter((item) => selectedKeys.includes(getItemKey(item)));
    }, [cartItems, selectedKeys]);

    // Tính tổng tiền CHỈ cho sản phẩm được tick
    const selectedTotal = useMemo(() => {
        return selectedItems.reduce((total, item) => {
            return total + item.price * item.quantity;
        }, 0);
    }, [selectedItems]);

    // Kiểm tra: tất cả sản phẩm đều được tick hay chưa?
    const isAllSelected = cartItems.length > 0 && selectedKeys.length === cartItems.length;

    useEffect(() => {
        sessionStorage.setItem("selected_keys", JSON.stringify(selectedKeys));
        sessionStorage.setItem("selected_cart_items", JSON.stringify(selectedItems));
    }, [selectedKeys, selectedItems]);

    const handleCheckout = () => {
        // Lấy danh sách cartItemId của những sản phẩm được tick
        const selectedCartItemIds = selectedItems.map((item) => item.cartItemId);
        console.log(" Đặt hàng với cartItemIds:", selectedCartItemIds);

        // Chuyển sang trang ConfirmPage, gửi cartItemIds qua state của navigate
        navigate("/confirm", {
            state: { cartItemIds: selectedCartItemIds },
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="w-10 h-10 border-4 border-teal-200 border-t-teal-600 rounded-full animate-spin mx-auto mb-4" />
                    <p className="text-gray-400 text-sm">Đang tải giỏ hàng...</p>
                </div>
            </div>
        );
    }

    // ═══════════════════════════════════════════════════════════
    //  Nếu giỏ hàng trống → hiện component EmptyCart
    // ═══════════════════════════════════════════════════════════
    if (cartItems.length === 0) {
        return (
            <>
                <EmptyCart />
            </>
        );
    }

    // ═══════════════════════════════════════════════════════════
    // Giỏ hàng có sản phẩm → ghép các component con
    // ═══════════════════════════════════════════════════════════
    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-gray-600 hover:text-gray-800 font-semibold transition-colors px-4 py-2 ml-71  mt-4">
                <ArrowLeft size={20} /> Quay lại
            </button>

            <div className="max-w-6xl mx-auto px-4 py-10">

                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Giỏ hàng
                        <span className="ml-2 text-base font-normal text-gray-400">
                            ({cartItems.length} sản phẩm)
                        </span>
                    </h1>
                    <button
                        onClick={clearCart}
                        className="text-sm text-gray-400 hover:text-red-500 transition-colors"
                    >
                        Xoá tất cả
                    </button>
                </div>

                {/* ── Layout 2 cột: Bảng sản phẩm | Sidebar tóm tắt ── */}
                <div className="flex flex-col lg:flex-row gap-6 items-start">

                    {/* CỘT TRÁI: Bảng danh sách sản phẩm */}
                    <CartTable
                        cartItems={cartItems}
                        selectedKeys={selectedKeys}
                        isAllSelected={isAllSelected}
                        onToggle={handleToggle}
                        onToggleAll={handleToggleAll}
                        getItemKey={getItemKey}
                        onIncrease={increaseQty}
                        onDecrease={decreaseQty}
                        onRemove={removeCartItem}
                        formatCurrency={formatCurrency}
                    />

                    {/* CỘT PHẢI: Sidebar — chỉ hiện sản phẩm được tick */}
                    <OrderSummary
                        selectedItems={selectedItems}
                        selectedTotal={selectedTotal}
                        formatCurrency={formatCurrency}
                        onCheckout={handleCheckout}
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}
