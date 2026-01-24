import React from "react";
import logo from "../assets/Sora_logo.png";
import { Link, NavLink } from "react-router-dom";


export default function Navbar() {
  const tabs = [
    { name: "Trang chủ", path: "/" },
    { name: "Gọng kính", path: "/all-product/frame" },
    { name: "Tròng kính", path: "/all-product/lens" },
    { name: "Kính áp tròng", path: "/all-product/contact-lens" },
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
          {tabs.map((tab) => (
            <li key={tab.path}>
              <NavLink
                to={tab.path}
                className={({ isActive }) =>
                  `relative pb-1 transition-all ${isActive
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
          to="/login"
          className="text-sm font-medium text-gray-600 hover:text-black transition"
        >
          Login
        </Link>

        <Link
          to="/profile"
          className="text-sm font-medium text-gray-600 hover:text-black transition"
        >
          Profile
        </Link>
      </div>
    </header>
  );
}
