import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";
import { apiLogout } from "../app/userApi";
import logo from "../assets/logo.png";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();
  const token = localStorage.getItem("access_token");
  const isLoggedIn = !!token;
  const navigate = useNavigate();

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

  return (
    <header className="w-full bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
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

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex items-center">
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className={`rounded-lg border border-gray-300 px-3 py-1 text-sm outline-none transition-all duration-300
                ${
                  showSearch
                    ? "mr-2 w-48 opacity-100"
                    : "pointer-events-none mr-0 w-0 opacity-0"
                }`}
            />
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="group rounded-lg p-2 transition hover:bg-gray-100"
            >
              <Search className="size-5 text-gray-600 transition group-hover:text-black" />
            </button>
          </div>

          {/* Cart */}
          <Link
            to="/cart"
            className="group relative rounded-lg p-2 transition hover:bg-gray-100"
          >
            <ShoppingCart className="size-5 text-gray-600 transition group-hover:text-black" />
          </Link>

          {!isLoggedIn ? (
            <Link
              to="/login"
              className="text-sm font-medium text-gray-600 transition hover:text-black"
            >
              Đăng nhập
            </Link>
          ) : (
            <>
              <Link
                to="/profile"
                className="rounded-lg p-2 transition hover:bg-gray-100"
              >
                <User className="size-5 text-gray-600 transition hover:text-black" />
              </Link>

              <button
                onClick={() => {
                  apiLogout();
                  navigate("/", { replace: true });
                }}
                className="text-sm font-medium text-gray-600 transition hover:text-black"
              >
                Đăng xuất
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
