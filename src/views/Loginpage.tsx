import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiLogin } from "../lib/userApi";
import loginImg from "@/assets/login.png";

const Loginpage: React.FC = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await apiLogin(username, password);
      if (remember) localStorage.setItem("remember_username", username);
      else localStorage.removeItem("remember_username");

      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm " +
    "outline-none transition placeholder:text-zinc-400 " +
    "hover:border-zinc-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100";

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white px-4 py-10 font-['Times_New_Roman']">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">
          {/* Left image */}
          <div className="hidden lg:block">
            <div className="flex items-center justify-center rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm h-[520px]">
              <img
                src={loginImg}
                alt="Login"
                className="h-full w-auto rounded-2xl object-contain"
              />
            </div>
            <div className="mt-4 text-center text-sm text-zinc-500">
              Đăng nhập để trải nghiệm mua sắm nhanh hơn ✨
            </div>
          </div>

          {/* Right card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-center text-2xl font-semibold text-zinc-900">
                Đăng nhập
              </h2>
              <p className="mt-2 text-center text-sm text-zinc-500">
                Hãy đăng nhập để được hưởng đặc quyền riêng của chúng tôi dành cho bạn
              </p>
            </div>

            {/* Error */}
            {error && (
              <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Username */}
            <label className="mb-2 block text-sm font-medium text-zinc-700">
              Tài khoản / Email
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập tài khoản"
                className={inputBase}
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            {/* Password */}
            <label className="mb-2 mt-4 block text-sm font-medium text-zinc-700">
              Mật khẩu
            </label>
            <input
              type="password"
              placeholder="Nhập mật khẩu"
              className={inputBase}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            {/* Remember + forgot */}
            <div className="mt-4 flex items-center justify-between">
              <label className="flex items-center gap-2 text-sm text-zinc-600">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-zinc-300 text-teal-600 focus:ring-teal-200"
                />
                Lưu tài khoản
              </label>

              <Link
                to="/forgot-password"
                className="text-sm font-medium text-teal-700 transition hover:text-teal-800 hover:underline"
              >
                Quên mật khẩu?
              </Link>
            </div>

            {/* Login button */}
            <button
              type="button"
              onClick={handleLogin}
              disabled={loading}
              className={[
                "mt-5 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition",
                "bg-teal-600 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg",
                "active:translate-y-0 active:shadow-md",
                "focus:outline-none focus:ring-4 focus:ring-teal-200",
                "disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:hover:shadow-none",
              ].join(" ")}
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>

            {/* Divider */}
            <div className="my-6 flex items-center gap-3">
              <div className="h-px flex-1 bg-zinc-200" />
              <span className="text-xs text-zinc-500">hoặc</span>
              <div className="h-px flex-1 bg-zinc-200" />
            </div>

            {/* Google button */}
            <button
              type="button"
              className="w-full rounded-2xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold text-zinc-800 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-md active:translate-y-0"
            >
              Đăng nhập bằng Google
            </button>

            {/* Register */}
            <p className="mt-6 text-center text-sm text-zinc-600">
              Bạn chưa có tài khoản?
              <Link
                to="/register"
                className="ml-1 font-semibold text-zinc-900 underline-offset-2 transition hover:text-teal-700 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>

            {/* Small note */}
            <p className="mt-3 text-center text-xs text-zinc-400">
              Bằng việc đăng nhập, bạn đồng ý với điều khoản sử dụng.
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Loginpage;