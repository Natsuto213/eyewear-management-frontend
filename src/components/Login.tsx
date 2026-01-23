import loginImg from "../assets/login.png";

import { Link } from "react-router-dom";
import React from "react";

const LoginPage: React.FC = () => {
  return (
    <div className="flex items-center justify-center gap-[60px] my-[60px] font-['Times_New_Roman']">
      
      {/* LEFT IMAGE */}
      <div>
        <img
          src={loginImg}
          alt="Login"
          className="w-[520px] rounded"
        />
      </div>

      {/* RIGHT FORM */}
      <div className="w-[420px]">
        <h2 className="text-center mb-2 text-xl font-semibold">
          Đăng nhập
        </h2>

        <p className="text-center text-[12px] text-gray-600 mb-5">
          Hãy đăng nhập để được hưởng đặc quyền riêng của chúng tôi dành cho bạn
        </p>

        {/* ACCOUNT */}
        <label className="block text-sm mt-3">
          Tài khoản/Email
        </label>
        <input
          type="text"
          placeholder="Nhập tài khoản"
          className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
        />

        {/* PASSWORD */}
        <label className="block text-sm mt-3">
          Mật khẩu
        </label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
        />

        {/* REMEMBER */}
        <div className="flex items-center gap-1 my-1">
          <input type="checkbox" className="w-[10px]" />
          <span className="text-[13px] mr-[70px]">
            Lưu tài khoản
          </span>
        </div>

        {/* LOGIN BUTTON */}
        <button
          type="button"
          className="w-full h-9 bg-gray-300 transition-all duration-200 hover:bg-teal-500 hover:text-white"
        >
          Đăng nhập
        </button>

        {/* FORGOT */}
        <a
          href="#"
          className="inline-block text-[12px] my-2 relative text-gray-800
                     after:absolute after:left-0 after:-bottom-[2px]
                     after:h-[1.5px] after:w-0 after:bg-teal-500
                     after:transition-all after:duration-200
                     hover:text-teal-500 hover:after:w-full"
        >
          Quên mật khẩu?
        </a>

        {/* GOOGLE */}
        <button
          type="button"
          className="w-full h-9 bg-gray-200 mt-1"
        >
          Đăng nhập bằng Google
        </button>

        {/* REGISTER */}
        <p className="text-center text-[13px] mt-2">
          Bạn chưa có tài khoản?
          <Link
            to="/register"
            className="ml-1 font-bold relative text-gray-800
                       after:absolute after:left-0 after:-bottom-[2px]
                       after:h-[1.5px] after:w-0 after:bg-teal-500
                       after:transition-all after:duration-200
                       hover:text-teal-500 hover:after:w-full"
          >
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
