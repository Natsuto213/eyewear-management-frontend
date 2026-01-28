import { Link } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import loginImg from "@/assets/login.png";

export default function Registerpage() {

    function Register() {
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
                        Đăng ký tài khoản
                    </h2>

                    <p className="text-center text-[12px] text-gray-600 mb-5">
                        Hãy đăng ký để được hưởng đặc quyền riêng của bạn
                    </p>

                    <label className="block text-sm mt-3">
                        Tên tài khoản
                    </label>
                    <input
                        type="text"
                        placeholder="Nhập tên tài khoản"
                        className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    />

                    <label className="block text-sm mt-3">
                        Mật khẩu
                    </label>
                    <input
                        type="password"
                        placeholder="Nhập mật khẩu"
                        className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    />

                    <label className="block text-sm mt-3">
                        Xác nhận mật khẩu
                    </label>
                    <input
                        type="password"
                        placeholder="Xác nhận mật khẩu"
                        className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    />

                    <label className="block text-sm mt-3">
                        Email
                    </label>
                    <input
                        type="email"
                        placeholder="Nhập email"
                        className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    />

                    <label className="block text-sm mt-3">
                        Số điện thoại
                    </label>
                    <input
                        type="text"
                        placeholder="Nhập số điện thoại"
                        className="w-full h-9 mt-1 bg-gray-200 px-2 outline-none"
                    />

                    {/* REGISTER BUTTON */}
                    <button
                        type="button"
                        className="w-full h-9 bg-gray-300 my-2 transition-all duration-200 hover:bg-teal-500 hover:text-white"
                    >
                        Đăng ký ngay
                    </button>

                    {/* GOOGLE */}
                    <button
                        type="button"
                        className="w-full h-9 bg-gray-200"
                    >
                        Đăng nhập bằng Google
                    </button>

                    {/* LOGIN LINK */}
                    <p className="text-center text-[13px] mt-2">
                        Bạn đã có tài khoản?
                        <Link
                            to="/login"
                            className="ml-1 font-bold relative text-gray-800
                       after:absolute after:left-0 after:-bottom-[2px]
                       after:h-[1.5px] after:w-0 after:bg-teal-500
                       after:transition-all after:duration-200
                       hover:text-teal-500 hover:after:w-full"
                        >
                            Đăng nhập tại đây
                        </Link>
                    </p>
                </div>
            </div>
        )
    }

    return (
        <>
            <Navbar />
            <Register />
            <Footer />
        </>
    )
}