import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiSignup } from "../lib/ApiService";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import loginImg from "@/assets/login.png";

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
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

  // Lỗi theo từng field — thay vì 1 string error chung
  const [errors, setErrors] = useState<Partial<typeof form>>({});

  const setField =
    (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((p) => ({ ...p, [k]: e.target.value }));
      // Xóa lỗi field đó khi user bắt đầu gõ lại
      if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
    };

  // ─── Validate tập trung ──────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: Partial<typeof form> = {};

    if (!form.username.trim())
      errs.username = "Vui lòng nhập tên tài khoản";
    else if (form.username.length < 3)
      errs.username = "Tên tài khoản tối thiểu 3 ký tự";
    else if (!/^[a-zA-Z0-9_]+$/.test(form.username))
      errs.username = "Chỉ được dùng chữ, số và dấu gạch dưới";

    if (!form.name.trim())
      errs.name = "Vui lòng nhập họ và tên";
    else if (form.name.trim().length < 2)
      errs.name = "Họ tên tối thiểu 2 ký tự";

    if (!form.password)
      errs.password = "Vui lòng nhập mật khẩu";
    else if (form.password.length < 8)
      errs.password = "Mật khẩu tối thiểu 8 ký tự";
    else if (!/[A-Z]/.test(form.password))
      errs.password = "Mật khẩu phải có ít nhất 1 chữ hoa";
    else if (!/[0-9]/.test(form.password))
      errs.password = "Mật khẩu phải có ít nhất 1 chữ số";

    if (!form.confirmPassword)
      errs.confirmPassword = "Vui lòng xác nhận mật khẩu";
    else if (form.password !== form.confirmPassword)
      errs.confirmPassword = "Mật khẩu xác nhận không khớp";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Email không đúng định dạng";

    if (form.phone && !/^(0[3|5|7|8|9])\d{8}$/.test(form.phone))
      errs.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";

    if (form.dob) {
      const dob = new Date(form.dob);
      const today = new Date();
      const age = today.getFullYear() - dob.getFullYear();
      if (isNaN(dob.getTime()))
        errs.dob = "Ngày sinh không hợp lệ";
      else if (age < 10)
        errs.dob = "Bạn phải ít nhất 10 tuổi";
      else if (age > 100)
        errs.dob = "Ngày sinh không hợp lệ";
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSignup = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      await apiSignup({
        username: form.username,
        password: form.password,
        email: form.email || undefined,
        phone: form.phone || undefined,
        name: form.name,
        dob: form.dob || undefined,
      });
      navigate("/login", { replace: true });
    } catch (err: any) {
      // Lỗi từ backend (username đã tồn tại, v.v.)
      const msg = err?.response?.data?.message || err?.message || "Đăng ký thất bại";
      setErrors({ username: msg });
    } finally {
      setLoading(false);
    }
  };

  const inputBase =
    "w-full rounded-xl border bg-white px-4 py-2.5 text-sm " +
    "outline-none transition placeholder:text-zinc-400 " +
    "hover:border-zinc-300 focus:border-teal-500 focus:ring-4 focus:ring-teal-100";

  const inputClass = (field: keyof typeof form) =>
    `${inputBase} ${errors[field] ? "border-red-400 focus:border-red-400 focus:ring-red-100" : "border-zinc-200"}`;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-white px-4 py-10 font-['Times_New_Roman']">
        <div className="mx-auto grid w-full max-w-5xl items-center gap-8 lg:grid-cols-2">
          {/* Left image */}
          <div className="hidden lg:block">
            <div className="flex h-[520px] items-center justify-center rounded-3xl border border-zinc-200 bg-white p-3 shadow-sm">
              <img src={loginImg} alt="Register" className="h-full w-auto rounded-2xl object-contain" />
            </div>
            <div className="mt-4 text-center text-sm text-zinc-500">
              Tạo tài khoản để lưu đơn hàng & nhận ưu đãi 🎁
            </div>
          </div>

          {/* Right card */}
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="mb-6">
              <h2 className="text-center text-2xl font-semibold text-zinc-900">Đăng ký tài khoản</h2>
              <p className="mt-2 text-center text-sm text-zinc-500">Điền thông tin để tạo tài khoản mới</p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Tên tài khoản" required error={errors.username}>
                <input className={inputClass("username")} value={form.username} onChange={setField("username")} placeholder="vd: jennifer123" />
              </Field>

              <Field label="Họ và tên" required error={errors.name}>
                <input className={inputClass("name")} value={form.name} onChange={setField("name")} placeholder="Nguyễn Văn A" />
              </Field>

              <Field label="Mật khẩu" required error={errors.password}>
                <input type="password" className={inputClass("password")} value={form.password} onChange={setField("password")} placeholder="••••••••" />
              </Field>

              <Field label="Xác nhận mật khẩu" required error={errors.confirmPassword}>
                <input type="password" className={inputClass("confirmPassword")} value={form.confirmPassword} onChange={setField("confirmPassword")} placeholder="••••••••" />
              </Field>

              <div className="sm:col-span-2">
                <Field label="Email" error={errors.email}>
                  <input type="email" className={inputClass("email")} value={form.email} onChange={setField("email")} placeholder="email@domain.com" />
                </Field>
              </div>

              <Field label="Số điện thoại" error={errors.phone}>
                <input className={inputClass("phone")} value={form.phone} onChange={setField("phone")} placeholder="09xxxxxxxx" />
              </Field>

              <Field label="Ngày sinh" error={errors.dob}>
                <input type="date" className={inputClass("dob")} value={form.dob} onChange={setField("dob")} />
              </Field>
            </div>

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
              <Link to="/login" className="ml-1 font-semibold text-zinc-900 hover:text-teal-700 hover:underline">
                Đăng nhập tại đây
              </Link>
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

// Sub-component hiển thị label + input + lỗi — tái sử dụng trong form
const Field: React.FC<{
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}> = ({ label, required, error, children }) => (
  <div>
    <label className="mb-2 block text-sm font-medium text-zinc-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default RegisterPage;