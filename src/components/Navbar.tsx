import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

import { Search, ShoppingCart, User } from "lucide-react";
import { apiLogout } from "@/lib/ApiService";
import logo from "@/assets/logo.png";
import { useShoppingContext } from "../views/Cart/contexts/ShoppingContext";
import CartItem from "../views/Cart/components/CartItem";
import { formatCurrency } from "../views/Cart/helpers/common";

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
    const { cartItems, cartQty, totalPrice } = useShoppingContext();

    const userSaved = localStorage.getItem("user");
    const userData = userSaved ? JSON.parse(userSaved) : null;
    const userRole = userData?.role || "CUSTOMER";

    const getDashboardPath = (role: string) => {
        switch (role) {
            case "MANAGER":
            case "ADMIN":
                return "/manager/product";
            case "SALES STAFF":
                return "/sales/containers/orders";
            case "OPERATIONS STAFF":
                return "/operation-staff/orders";
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

                <div className="flex items-center gap-4">
                    {/* Cart Dropdown */}
                    <div className="relative group">
                        <div className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center relative cursor-pointer">
                            <ShoppingCart className="size-5 text-gray-600 group-hover:text-black transition" />
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                                {cartQty}
                            </span>
                        </div>

                        {/* FIX: Đổi từ table sang div-based layout để tránh lỗi lồng thẻ <div> trong <tbody> */}
                        <div className="absolute right-0 top-full pt-1 w-[500px] hidden group-hover:block z-50">
                            <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden">
                                <div className="p-4 bg-gray-50 border-b border-gray-100">
                                    <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Giỏ hàng của bạn</h3>
                                </div>

                                <div className="max-h-80 overflow-y-auto p-3">
                                    {cartItems.length === 0 ? (
                                        <p className="text-sm text-gray-400 text-center py-6">Giỏ hàng trống</p>
                                    ) : (
                                        <div className="flex flex-col gap-1">
                                            {(cartItems as CartItemType[]).map((item) => (
                                                <div key={item.cartItemId} className="w-full">
                                                    <CartItem {...item} />
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>

                                <div className="p-4 flex items-center justify-between border-t border-gray-100 bg-gray-50">
                                    <div>
                                        <p className="text-xs text-gray-500 font-medium mb-0.5">Tổng cộng</p>
                                        <p className="font-bold text-red-600 text-base">{formatCurrency(totalPrice)}</p>
                                    </div>
                                    <Link to="/cart" className="inline-block px-5 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition-colors">
                                        Xem giỏ hàng →
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* User Dropdown */}
                    {!isLoggedIn ? (
                        <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black transition ml-2">Đăng nhập</Link>
                    ) : (
                        <div className="relative group ml-1">
                            <button className="p-2 hover:bg-gray-100 rounded-lg transition flex items-center">
                                <User className="size-5 text-gray-600 group-hover:text-black transition" />
                            </button>
                            <div className="absolute right-0 top-full pt-1 w-48 hidden group-hover:block z-50">
                                <div className="bg-white border border-gray-200 rounded-xl shadow-xl py-2 overflow-hidden">
                                    <Link to="/profile" className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-teal-600 transition font-medium">Hồ sơ cá nhân</Link>
                                    {isStaff && (
                                        <Link to={dashboardPath} className="block w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 hover:text-purple-600 transition font-medium">Dashboard</Link>
                                    )}
                                    <hr className="my-1 border-gray-100" />
                                    <button onClick={handleLogout} className="block w-full text-left px-4 py-2.5 text-sm font-bold text-red-600 hover:bg-red-50 transition">Đăng xuất</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </header>
    );
}