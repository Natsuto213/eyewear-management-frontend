import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import { apiLogout } from "@/lib/userApi";
import logo from "@/assets/logo.png";
import { useShoppingContext } from "../views/Cart/contexts/ShoppingContext";
import CartItem from "../views/Cart/components/CartItem";
import { formatCurrency } from "../views/Cart/helpers/common";

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
  // FIX 1: Khai báo đầy đủ state để dùng được setIsLoggedIn
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem("access_token"));
  
  const location = useLocation();
  const navigate = useNavigate();
  const { cartItems, cartQty, totalPrice } = useShoppingContext();

  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"));
  }, [location.pathname]);

  const isActiveTab = (path: string): boolean => {
    return location.pathname === path;
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
      localStorage.removeItem("access_token"); // Đảm bảo xóa token
      setIsLoggedIn(false);
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <header className="w-full bg-white shadow-sm sticky top-0 z-50">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Sora logo" className="h-12 w-auto object-contain" />
        </Link>

        {/* Navigation Tabs */}
        <ul className="flex gap-8 text-sm font-medium">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <Link
                to={tab.path}
                className={`relative pb-1 transition-all ${
                  isActiveTab(tab.path)
                    ? "text-black after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-black"
                    : "text-gray-500 hover:text-black"
                }`}
              >
                {tab.name}
              </Link>
            </li>
          ))}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* Search Box */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className={`rounded-lg border border-gray-300 px-3 py-1 text-sm outline-none transition-all duration-300 ${
                showSearch ? "mr-2 w-48 opacity-100" : "pointer-events-none w-0 opacity-0"
              }`}
            />
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 rounded-lg transition"
            >
              <Search className="size-5 text-gray-600 hover:text-black" />
            </button>
          </div>

          {/* Cart Dropdown */}
          <div className="relative group">
            <div className="p-2 hover:bg-gray-100 rounded-lg transition cursor-pointer relative">
              <ShoppingCart className="size-5 text-gray-600 group-hover:text-black" />
              {cartQty > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] px-1.5 rounded-full">
                  {cartQty}
                </span>
              )}
            </div>

            {/* Dropdown Menu */}
            <div className="absolute right-0 mt-0 w-80 bg-white border border-gray-200 rounded-lg shadow-xl hidden group-hover:block z-50 overflow-hidden">
              <div className="h-2 w-full bg-transparent"></div>
              <div className="p-4 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Giỏ hàng của bạn</h3>
              </div>
              
              <div className="max-h-64 overflow-y-auto p-2">
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

              <div className="p-4 flex items-center justify-between bg-gray-50 border-t border-gray-100">
                <div>
                  <p className="text-xs text-gray-400">Tổng cộng</p>
                  <p className="font-bold text-red-500">{formatCurrency(totalPrice)}</p>
                </div>
                <Link
                  to="/cart"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium rounded-lg transition"
                >
                  Xem giỏ hàng →
                </Link>
              </div>
            </div>
          </div>

          {/* User Actions */}
          {!isLoggedIn ? (
            <Link to="/login" className="text-sm font-medium text-gray-600 hover:text-black transition">
              Đăng nhập
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Link to="/profile" className="p-2 hover:bg-gray-100 rounded-lg transition">
                <User className="size-5 text-gray-600 hover:text-black" />
              </Link>
              <button
                onClick={handleLogout}
                className="text-sm font-medium text-gray-600 hover:text-black transition"
              >
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Test Button (Optional - moved inside header or outside as needed) */}
      <Link
        to="/operation-staff"
        className="fixed bottom-6 right-6 bg-black text-white px-4 py-2 rounded-xl text-xs opacity-50 hover:opacity-100 transition"
      >
        Test Dashboard
      </Link>
    </header>
  );
}