import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { apiSignup } from "@/app/userApi";
import loginImg from "@/assets/login.png";

const Register: React.FC = () => {
    const navigate = useNavigate();
    const [error, setError] = useState("");

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
        if (form.password !== form.confirmPassword) {
            setError("Mật khẩu xác nhận không khớp");
            return;
        }

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
        }
    };

    return (
        <div className="flex items-center justify-center gap-[60px] my-[60px] font-['Times_New_Roman']">
            <div>
                <img src={loginImg} alt="Login" className="w-[580px] rounded" />
            </div>

            <div className="w-[420px]">
                <h2 className="text-center mb-2 text-xl font-semibold">
                    Đăng ký tài khoản
                </h2>

                <label className="block text-sm mt-3">Tên tài khoản</label>
                <input
                    className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    value={form.username}
                    onChange={setField("username")}
                />

                <label className="block text-sm mt-3">Họ và tên</label>
                <input
                    className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    value={form.name}
                    onChange={setField("name")}
                />

                <label className="block text-sm mt-3">Mật khẩu</label>
                <input
                    type="password"
                    className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    value={form.password}
                    onChange={setField("password")}
                />

                <label className="block text-sm mt-3">Xác nhận mật khẩu</label>
                <input
                    type="password"
                    className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    value={form.confirmPassword}
                    onChange={setField("confirmPassword")}
                />

                <label className="block text-sm mt-3">Email</label>
                <input
                    type="email"
                    className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    value={form.email}
                    onChange={setField("email")}
                />

                <label className="block text-sm mt-3">Số điện thoại</label>
                <input
                    className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    value={form.phone}
                    onChange={setField("phone")}
                />

                <label className="block text-sm mt-3">Ngày sinh</label>
                <input
                    type="date"
                    className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    value={form.dob}
                    onChange={setField("dob")}
                />

                {/* span error theo yêu cầu */}
                {error && (
                    <span className="block mt-2 text-sm text-red-600">{error}</span>
                )}

                <button
                    type="button"
                    onClick={handleSignup}
                    className="w-full h-9 bg-gray-300 my-2 hover:bg-teal-500 hover:text-white"
                >
                    Đăng ký ngay
                </button>

                <p className="text-center text-[13px] mt-2">
                    Bạn đã có tài khoản?
                    <Link to="/login" className="ml-1 font-bold">
                        Đăng nhập tại đây
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;