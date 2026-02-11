import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiLogin } from "@/lib/userApi";
import loginImg from "@/../public/login.png";

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setError("");
    try {
      await apiLogin(username, password);
      navigate("/", { replace: true }); // Homepage
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    }
  };

  return (
    <div className="flex items-center justify-center gap-[60px] my-[60px] font-['Times_New_Roman']">
      <div>
        <img src={loginImg} alt="Login" className="w-[520px] rounded" />
      </div>

      <div className="w-[420px]">
        <h2 className="text-center mb-2 text-xl font-semibold">Đăng nhập</h2>

        <p className="text-center text-[12px] text-gray-600 mb-5">
          Hãy đăng nhập để được hưởng đặc quyền riêng của chúng tôi dành cho bạn
        </p>

        <label className="block text-sm mt-3">Tài khoản/Email</label>
        <input
          type="text"
          placeholder="Nhập tài khoản"
          className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label className="block text-sm mt-3">Mật khẩu</label>
        <input
          type="password"
          placeholder="Nhập mật khẩu"
          className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        {/* span error theo yêu cầu */}
        {error && (
          <span className="block mt-2 text-sm text-red-600">{error}</span>
        )}

        <div className="flex items-center gap-1 my-1">
          <input type="checkbox" className="w-[10px]" />
          <span className="text-[13px] mr-[70px]">Lưu tài khoản</span>
        </div>

        <button
          type="button"
          onClick={handleLogin}
          className="w-full h-9 bg-gray-300 transition-all duration-200 hover:bg-teal-500 hover:text-white"
        >
          Đăng nhập
        </button>

        <a
          href="#"
          className="inline-block text-[12px] my-2 relative text-gray-800"
        >
          Quên mật khẩu?
        </a>

        <button type="button" className="w-full h-9 bg-gray-200 mt-1">
          Đăng nhập bằng Google
        </button>

        <p className="text-center text-[13px] mt-2">
          Bạn chưa có tài khoản?
          <Link to="/register" className="ml-1 font-bold">
            Đăng ký ngay
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;