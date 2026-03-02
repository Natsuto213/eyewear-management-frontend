import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import { apiLogout } from "@/app/userApi";
import logo from "@/assets/logo.png";
import { useShoppingContext } from "../views/Cart/contexts/ShoppingContext";
import CartItem from "../views/Cart/components/CartItem";
import { formatCurrency } from "../views/Cart/helpers/common";

// Định nghĩa kiểu dữ liệu cho Item giỏ hàng
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

  // Cập nhật trạng thái đăng nhập khi đổi route
  useEffect(() => {
    setIsLoggedIn(!!localStorage.getItem("access_token"));
  }, [location.pathname]);

  const isActiveTab = (path: string): boolean => {
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
      await apiLogout(); // Gọi API xoá token
      setIsLoggedIn(false); // Cập nhật UI ngay lập tức
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
          <img src={logo} alt="Sora logo" className="size-15 object-contain" />
        </Link>

        {/* Navigation Tabs */}
        <ul className="flex gap-8 text-sm font-medium">
          {tabs.map((tab) => {
            const active = isActiveTab(tab.path);
            return (
              <li key={tab.path}>
                <Link
                  to={tab.path}
                  className={`relative pb-1 transition-all ${
                    active
                      ? "text-black after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-full after:bg-black"
                      : "text-gray-500 hover:text-black"
                  }`}
                >
                  {tab.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Right Actions */}
        <div className="flex items-center gap-4">
          
          {/* Search Box */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className={`rounded-lg border border-gray-300 px-3 py-1 text-sm outline-none transition-all duration-300 ${
                showSearch ? "mr-2 w-48 opacity-100" : "pointer-events-none mr-0 w-0 opacity-0"
              }`}
            />
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="group rounded-lg p-2 transition hover:bg-gray-100"
            >
              <Search className="size-5 text-gray-600 transition group-hover:text-black" />
            </button>
          </div>

          {/* Cart Icon with Dropdown */}
          <div className="relative group">
            <Link
              to="/cart"
              className="relative flex items-center rounded-lg p-2 transition hover:bg-gray-100"
            >
              <ShoppingCart className="size-5 text-gray-600 group-hover:text-black transition" />
              {cartQty > 0 && (
                <span className="absolute top-0 right-0 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] text-white">
                  {cartQty}
                </span>
              )}
            </Link>

            {/* Cart Dropdown Preview */}
            <div className="invisible absolute right-0 mt-0 w-80 translate-y-2 opacity-0 transition-all duration-300 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100 z-50">
              <div className="h-2 w-full bg-transparent"></div> {/* Buffer zone */}
              <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-xl">
                <div className="p-4 bg-white">
                  <h3 className="text-lg font-semibold text-gray-800">Giỏ hàng của bạn</h3>
                </div>
                <hr className="border-gray-100" />
                <div className="max-h-64 overflow-y-auto p-2">
                  {cartItems.length === 0 ? (
                    <p className="py-4 text-center text-sm text-gray-400">Giỏ hàng trống</p>
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
                <div className="bg-gray-50 p-4 flex items-center justify-between">
                  <div>
                    <p className="text-xs text-gray-400">Tổng cộng</p>
                    <p className="text-base font-bold text-red-500">{formatCurrency(totalPrice)}</p>
                  </div>
                  <Link
                    to="/cart"
                    className="rounded-lg bg-teal-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-teal-700"
                  >
                    Xem giỏ hàng →
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* User Section */}
          {!isLoggedIn ? (
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 hover:text-black transition"
            >
              Đăng nhập
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="rounded-lg p-2 transition hover:bg-gray-100"
              >
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
    </header>
  );
}