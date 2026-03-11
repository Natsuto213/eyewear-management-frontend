import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { Search, ShoppingCart, User } from "lucide-react";
import { apiLogout } from "@/lib/userApi";
import logo from "@/assets/Sora_logo.png";
import { useShoppingContext } from "../views/Cart/contexts/ShoppingContext";
import CartItem from "../views/Cart/components/CartItem";
import { formatCurrency } from "../views/Cart/helpers/common";

// Kiểu dữ liệu cho 1 item trong giỏ hàng — khớp với format từ API
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
    const location = useLocation();
    const token = localStorage.getItem("access_token");
    const isLoggedIn = !!token;
    const navigate = useNavigate();
    const { cartItems, cartQty, totalPrice, fetchCart } = useShoppingContext();

    // LẤY THÔNG TIN USER TỪ LOCAL STORAGE
    const userSaved = localStorage.getItem("user");
    const userData = userSaved ? JSON.parse(userSaved) : null;
    const userRole = userData?.role || "CUSTOMER";

    // HÀM MAP ROLE RA ĐƯỜNG DẪN DASHBOARD (Dựa theo navigation.ts)
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

                {/* Chức năng bên phải (Search, Cart, User) */}
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

                    {/* Cart Icon with Badge */}
                    <div className="relative group">
                        <div className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center relative cursor-pointer">
                            <ShoppingCart className="size-5 text-gray-600 group-hover:text-black transition" />
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                                {cartQty}
                            </span>
                        </div>

                        {/* Cart Dropdown Menu */}
                        <div className="absolute right-0 mt-0 w-160 bg-white border border-gray-200 rounded-lg shadow-xl hidden group-hover:block z-50 transition-all duration-300">
                            <div className="h-2 w-full bg-transparent"></div>
                            <div className="bg-white rounded-lg overflow-hidden border border-gray-100">
                                <div className="p-4">
                                    <h3 className="text-lg font-semibold text-gray-800">Giỏ hàng của bạn</h3>
                                </div>
                                <hr className="border-gray-100" />
                                <div className="max-h-64 overflow-y-auto p-2 space-y-2">
                                    {cartItems.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-4">Giỏ hàng trống</p>
                                    ) : (
                                        <table className="w-full">
                                            <tbody>
                                                {(cartItems as CartItemType[]).map((item) => (
                                                    <CartItem key={item.cartItemId} {...item} />
                                                ))}
                                            </tbody>
                                        </table>
                                    )}
                                </div>
                                <hr className="border-gray-100" />
                                <div className="p-4 flex items-center justify-between bg-gray-50">
                                    <div>
                                        <p className="text-xs text-gray-400">Tổng cộng</p>
                                        <p className="font-bold text-red-500 text-base">{formatCurrency(totalPrice)}</p>
                                    </div>
                                    <Link
                                        to="/cart"
                                        className="inline-block px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors"
                                    >
                                        Xem giỏ hàng →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

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
                            {/* Nút Avatar */}
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center">
                                <User className="size-5 text-gray-600 group-hover:text-black transition" />
                            </button>

                            {/* Menu Dropdown của User */}
                            <div className="absolute right-0 mt-0 w-48 bg-white border border-gray-200 rounded-lg shadow-xl hidden group-hover:block z-50">
                                {/* Đệm trong suốt để không bị mất hover */}
                                <div className="h-2 w-full bg-transparent"></div>
                                
                                <div className="bg-white rounded-lg overflow-hidden border border-gray-100 py-2">
                                    <Link
                                        to="/profile"
                                        className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition"
                                    >
                                        Hồ sơ cá nhân
                                    </Link>
                                    
                                    {/* NẾU LÀ NHÂN VIÊN/QUẢN LÝ SẼ HIỂN THỊ NÚT DASHBOARD */}
                                    {isStaff && (
                                        <Link
                                            to={dashboardPath}
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition"
                                        >
                                            Chuyển đến Dashboard
                                        </Link>
                                    )}

                                    <hr className="my-1 border-gray-100" />
                                    
                                    <button
                                        onClick={async () => {
                                            await apiLogout();
                                            window.location.href = "/";
                                        }}
                                        className="block w-full text-left px-4 py-2 text-sm font-medium text-red-600 hover:bg-red-50 transition"
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