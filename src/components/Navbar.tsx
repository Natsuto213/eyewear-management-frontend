import React from "react";
import { Link, NavLink } from "react-router-dom";

export default function Navbar() {
  const tabs = [
    { name: "Trang chủ", path: "/" },
    { name: "Gọng kính", path: "/frame" },
    { name: "Tròng kính", path: "/lens" },
    { name: "Kính áp tròng", path: "/contact-lens" },
    { name: "Về chúng tôi", path: "/about-us" },
  ];

  return (
    <header className="w-full border-b bg-white">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-9 h-9 rounded-full border-2 border-gray-800 flex items-center justify-center font-bold text-sm">
            Logo
          </div>
        </Link>

        {/* Tabs */}
        <ul className="flex gap-8 text-sm font-medium">
          {tabs.map((tab) => (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `relative pb-1 transition-all ${
                    isActive
                      ? "text-black after:absolute after:left-0 after:-bottom-1 after:w-full after:h-[2px] after:bg-black"
                      : "text-gray-500 hover:text-black"
                  }`
                }
              >
                {tab.name}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Login */}
        <Link
          to="/dang-nhap"
          className="text-sm font-medium text-gray-600 hover:text-black transition"
        >
          Đăng nhập
        </Link>
      </div>
    </header>
  );
}
