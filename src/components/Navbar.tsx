import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User, X } from "lucide-react";

import { apiLogout } from "@/lib/userApi";
import logo from "@/assets/logo.png";
import { useShoppingContext } from "../views/Cart/contexts/ShoppingContext";
import { formatCurrency } from "../views/Cart/helpers/common";
import { ImageWithFallback } from "@/components/ImageWithFallback";

// Kiểu dữ liệu cho 1 item trong giỏ hàng
interface CartItemType {
    cartItemId: number;
    productId: number;
    pairedProductId: number | null;
    nameProduct: string;
    imgProduct: string | string[];
    priceProduct: number;
    quantity: number;
    price: number;
    prescription: Record<string, string> | null;
    namePairedProduct: string | null;
    imgPairedProduct: string | null;
    pricePairedProduct: number | null;
}

export default function Navbar() {
    const [showSearch, setShowSearch] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));
    const location = useLocation();
    const navigate = useNavigate();
    
    // Lấy context của giỏ hàng
    const { cartItems, cartQty, totalPrice, increaseQty, decreaseQty, removeFromCart } = useShoppingContext();

    // LẤY THÔNG TIN USER TỪ LOCAL STORAGE
    const userSaved = localStorage.getItem("user");
    const userData = userSaved ? JSON.parse(userSaved) : null;
    const userRole = userData?.role || "CUSTOMER";

    // HÀM MAP ROLE RA ĐƯỜNG DẪN DASHBOARD
    const getDashboardPath = (role: string) => {
        switch (role) {
            case "MANAGER":
            case "ADMIN":
                return "/manager/product";
            case "SALES STAFF":
                return "/sales/containers/orders";
            case "OPERATIONS STAFF":
                return "/operation/inventory";
            default:
                return "/";
        }
    };

    const isStaff = userRole !== "CUSTOMER";
    const dashboardPath = getDashboardPath(userRole);

    const isActiveTab = (path: string) => {
        return location.pathname + location.search === path;
    };

    const tabs = [
        { name: "Trang chủ", path: "/" },
        { name: "Gọng kính", path: "/all-product/gong" },
        { name: "Tròng kính", path: "/all-product/trong" },
        { name: "Kính áp tròng", path: "/all-product/kinhaptrong" },
        { name: "Về chúng tôi", path: "/about-us" },
    ];

    const handleLogout = async () => {
        try {
            await apiLogout();
            localStorage.removeItem("access_token");
            localStorage.removeItem("user");
            setIsLoggedIn(false);
            navigate("/", { replace: true });
        } catch (error) {
            console.error("Logout failed:", error);
        }
    };

    return (
        <header className="w-full bg-white shadow-sm relative z-50">
            <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                    <img src={logo} alt="Sora logo" className="size-15 object-contain" />
                </Link>

                {/* Tabs */}
                <ul className="flex gap-8 text-sm font-medium">
                    {tabs.map((tab) => {
                        const active = isActiveTab(tab.path);
                        return (
                            <li key={tab.path}>
                                <Link
                                    to={tab.path}
                                    className={`relative pb-1 transition-all ${active
                                        ? "text-black after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-black"
                                        : "text-gray-500 hover:text-black"
                                        }`}
                                >
                                    {tab.name}
                                </Link>
                            </li>
                        );
                    })}
                </ul>

                {/* Chức năng bên phải */}
                <div className="flex items-center gap-4">

                    {/* Search Icon */}
                    <div className="flex items-center relative">
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            className={`transition-all duration-300 ease-in-out border border-gray-300 rounded-lg px-3 py-1 text-sm outline-none
                                ${showSearch ? "w-48 opacity-100 mr-2" : "w-0 opacity-0 mr-0 pointer-events-none"}
                            `}
                        />
                        <button
                            onClick={() => setShowSearch(!showSearch)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition group"
                        >
                            <Search className="size-5 text-gray-600 group-hover:text-black transition" />
                        </button>
                    </div>

                    {/* ==============================================
                        KHU VỰC GIỎ HÀNG ĐƯỢC LÀM LẠI HOÀN TOÀN
                    ============================================== */}
                    <div className="relative group">
                        <div className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center relative cursor-pointer">
                            <ShoppingCart className="size-5 text-gray-600 group-hover:text-black transition" />
                            {cartQty > 0 && (
                                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 rounded-full">
                                    {cartQty}
                                </span>
                            )}
                        </div>

                        {/* Cart Dropdown Menu */}
                        <div className="absolute right-0 top-full pt-1 w-[380px] hidden group-hover:block z-50">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden">
                                {/* Dropdown Header */}
                                <div className="p-4 bg-gray-50 border-b border-gray-100 flex justify-between items-center">
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Giỏ hàng của bạn</h3>
                                    <span className="text-xs text-gray-500 font-medium">{cartQty} sản phẩm</span>
                                </div>
                                
                                {/* Dropdown Body - Danh sách sản phẩm */}
                                <div className="max-h-[320px] overflow-y-auto overflow-x-hidden p-3 space-y-3 custom-scrollbar">
                                    {cartItems.length === 0 ? (
                                        <div className="py-8 text-center flex flex-col items-center justify-center text-gray-400">
                                            <ShoppingCart className="size-8 mb-2 opacity-50" />
                                            <p className="text-sm">Giỏ hàng trống</p>
                                        </div>
                                    ) : (
                                        (cartItems as CartItemType[]).map((item) => {
                                            // Xử lý hình ảnh hiển thị
                                            const itemImage = Array.isArray(item.imgProduct) 
                                                ? item.imgProduct[0] 
                                                : item.imgProduct || "https://via.placeholder.com/150";

                                            return (
                                                <div key={item.cartItemId} className="flex items-start gap-3 p-2 hover:bg-gray-50 rounded-lg border border-transparent hover:border-gray-100 transition-colors group/item">
                                                    {/* Ảnh sản phẩm */}
                                                    <div className="w-16 h-16 shrink-0 bg-white border border-gray-200 rounded-md overflow-hidden flex items-center justify-center">
                                                        <ImageWithFallback src={itemImage} alt={item.nameProduct} className="w-full h-full object-cover" />
                                                    </div>

                                                    {/* Thông tin sản phẩm */}
                                                    <div className="flex-1 min-w-0">
                                                        <h4 className="text-sm font-semibold text-gray-800 truncate mb-1" title={item.nameProduct}>
                                                            {item.nameProduct}
                                                        </h4>
                                                        <div className="text-xs text-red-600 font-bold mb-2">
                                                            {formatCurrency(item.price)}
                                                        </div>

                                                        {/* Box tăng giảm số lượng mini */}
                                                        <div className="flex items-center gap-1 bg-white border border-gray-200 rounded w-fit">
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    if (item.quantity > 1) decreaseQty(item.cartItemId);
                                                                    else removeFromCart(item.cartItemId);
                                                                }}
                                                                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                                                            >
                                                                -
                                                            </button>
                                                            <span className="w-6 text-center text-xs font-semibold text-gray-800">
                                                                {item.quantity}
                                                            </span>
                                                            <button 
                                                                onClick={(e) => {
                                                                    e.preventDefault();
                                                                    increaseQty(item.cartItemId);
                                                                }}
                                                                className="w-6 h-6 flex items-center justify-center text-gray-500 hover:text-black hover:bg-gray-100 transition-colors"
                                                            >
                                                                +
                                                            </button>
                                                        </div>
                                                    </div>

                                                    {/* Nút xóa */}
                                                    <button 
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            removeFromCart(item.cartItemId);
                                                        }}
                                                        className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors opacity-0 group-hover/item:opacity-100"
                                                        title="Xóa khỏi giỏ"
                                                    >
                                                        <X className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            );
                                        })
                                    )}
                                </div>

                                {/* Dropdown Footer */}
                                {cartItems.length > 0 && (
                                    <div className="p-4 border-t border-gray-100 bg-white">
                                        <div className="flex items-center justify-between mb-4">
                                            <p className="text-sm text-gray-500 font-medium">Tổng thanh toán:</p>
                                            <p className="font-bold text-red-600 text-lg">{formatCurrency(totalPrice)}</p>
                                        </div>
                                        <Link
                                            to="/cart"
                                            className="flex items-center justify-center w-full py-2.5 bg-teal-600 hover:bg-teal-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                                        >
                                            ĐI ĐẾN GIỎ HÀNG
                                        </Link>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                    {/* ==============================================
                        KẾT THÚC KHU VỰC GIỎ HÀNG
                    ============================================== */}

                    {/* Logic User Login / Avatar Dropdown */}
                    {!isLoggedIn ? (
                        <Link
                            to="/login"
                            className="text-sm font-medium text-gray-600 hover:text-black transition ml-2"
                        >
                            Đăng nhập
                        </Link>
                    ) : (
                        <div className="relative group ml-1">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center">
                                <User className="size-5 text-gray-600 group-hover:text-black transition" />
                            </button>

                            <div className="absolute right-0 top-full pt-1 w-48 hidden group-hover:block z-50">
                                <div className="bg-white border border-gray-200 rounded-xl shadow-xl py-2 overflow-hidden">
                                    <Link
                                        to="/profile"
                                        className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition font-medium"
                                    >
                                        Hồ sơ cá nhân
                                    </Link>

                                    {isStaff && (
                                        <Link
                                            to={dashboardPath}
                                            className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition font-medium"
                                        >
                                            Chuyển đến Dashboard
                                        </Link>
                                    )}

                                    <hr className="my-1 border-gray-100" />

                                    <button
                                        onClick={handleLogout}
                                        className="block w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition"
                                    >
                                        Đăng xuất
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}
