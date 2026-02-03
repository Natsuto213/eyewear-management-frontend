import loginImg from "../assets/login.png";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { apiSignup } from "../app/userApi";

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    username: "",
    name: "",
    password: "",
    confirmPassword: "",
    email: "",
    phone: "",
    dob: "",
  });

  const setField =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  const handleSignup = async () => {
    setError("");

    if (!form.username || !form.name || !form.password || !form.confirmPassword) {
      setError("Vui lòng nhập đầy đủ thông tin bắt buộc.");
      return;
    }

    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp");
      return;
    }

    setLoading(true);
    try {
      await apiSignup({
        username: form.username,
        password: form.password,
        email: form.email,
        phone: form.phone,
        name: form.name,
        dob: form.dob,
      });
      navigate("/login", { replace: true });
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Sign up failed");
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-sm " +
    "outline-none transition placeholder:text-zinc-400 " +
    "hover:border-zinc-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100";

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white px-4 py-10 font-['Times_New_Roman']">
      <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">
        {/* Left image */}
        <div className="hidden lg:block">
          <div className="flex h-[520px] items-center justify-center rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm">
            <img
              src={loginImg}
              alt="Register"
              className="h-full w-auto rounded-2xl object-contain"
            />
          </div>
          <div className="mt-4 text-center text-sm text-zinc-500">
            Tạo tài khoản để lưu đơn hàng & nhận ưu đãi 🎁
          </div>
        </div>

        {/* Right card */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-center text-2xl font-semibold text-zinc-900">
              Đăng ký tài khoản
            </h2>
            <p className="mt-2 text-center text-sm text-zinc-500">
              Điền thông tin để tạo tài khoản mới
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          {/* Form */}
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Tên tài khoản <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                value={form.username}
                onChange={setField("username")}
                placeholder="vd: jennifer123"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Họ và tên <span className="text-red-500">*</span>
              </label>
              <input
                className={inputBase}
                value={form.name}
                onChange={setField("name")}
                placeholder="Nguyễn Văn A"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className={inputBase}
                value={form.password}
                onChange={setField("password")}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Xác nhận mật khẩu <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                className={inputBase}
                value={form.confirmPassword}
                onChange={setField("confirmPassword")}
                placeholder="••••••••"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Email
              </label>
              <input
                type="email"
                className={inputBase}
                value={form.email}
                onChange={setField("email")}
                placeholder="email@domain.com"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Số điện thoại
              </label>
              <input
                className={inputBase}
                value={form.phone}
                onChange={setField("phone")}
                placeholder="090xxxxxxx"
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-zinc-700">
                Ngày sinh
              </label>
              <input
                type="date"
                className={inputBase}
                value={form.dob}
                onChange={setField("dob")}
              />
            </div>
          </div>

          {/* Submit */}
          <button
            type="button"
            onClick={handleSignup}
            disabled={loading}
            className={[
              "mt-6 w-full rounded-2xl px-4 py-3 text-sm font-semibold text-white transition",
              "bg-teal-600 hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg",
              "active:translate-y-0 active:shadow-md",
              "focus:outline-none focus:ring-4 focus:ring-teal-200",
              "disabled:cursor-not-allowed disabled:opacity-60",
            ].join(" ")}
          >
            {loading ? "Đang tạo tài khoản..." : "Đăng ký ngay"}
          </button>

          <p className="mt-5 text-center text-sm text-zinc-600">
            Bạn đã có tài khoản?
            <Link
              to="/login"
              className="ml-1 font-semibold text-zinc-900 hover:text-teal-700 hover:underline"
            >
              Đăng nhập tại đây
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
