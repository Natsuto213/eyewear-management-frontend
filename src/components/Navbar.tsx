import React, { useState } from "react";
import logo from "../assets/Sora_logo.png";
import { Link, NavLink, useLocation } from "react-router-dom";
import { Search, ShoppingCart, User } from "lucide-react";

export default function Navbar() {
  const [showSearch, setShowSearch] = useState(false);
  const location = useLocation();

  const isActiveTab = (path) => {
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

        {/* Login */}
        <div className="flex items-center gap-4">
          {/* Search Icon */}
          <div className="flex items-center relative">
            {/* Input Search */}
            <input
              type="text"
              placeholder="Tìm kiếm..."
              className={`transition-all duration-300 ease-in-out border border-gray-300 rounded-lg px-3 py-1 text-sm outline-none
                ${showSearch ? "w-48 opacity-100 mr-2" : "w-0 opacity-0 mr-0 pointer-events-none"}
              `}
            />

            {/* Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className="p-2 hover:bg-gray-100 rounded-lg transition group"
            >
              <Search className="size-5 text-gray-600 group-hover:text-black transition" />
            </button>
          </div>

          {/* Cart Icon with Badge */}
          <Link
            to="/cart"
            className="p-2 hover:bg-gray-100 rounded-lg transition group relative"
          >
            <ShoppingCart className="size-5 text-gray-600 group-hover:text-black transition" />
          </Link>

          {/* Profile Link */}
          <Link
            to="/profile"
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            <User className="size-5 text-gray-600 group-hover:text-black transition" />
          </Link>

          {/* Login Link */}
          <Link
            to="/login"
            className="text-sm font-medium text-gray-600 hover:text-black transition"
          >
            Đăng nhập
          </Link>
        </div>
      </div>
    </header>
  );
}
