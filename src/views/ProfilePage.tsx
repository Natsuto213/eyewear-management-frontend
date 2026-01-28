import { NavLink, Outlet, useMatch } from "react-router-dom";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function Profilepage() {

    function Profile() {
        const isAccountPage = useMatch("/profile/account");

        return (
            <div className="w-full min-h-screen bg-neutral-200/50 flex justify-center items-center">
                <div className="flex gap-6 max-w-[1200px] w-full px-6">

                    {/* SIDEBAR */}
                    <aside className="w-64 h-[460px] bg-white rounded-xl p-4 space-y-4">
                        <div className="w-16 h-16 rounded-full bg-zinc-300 mx-auto" />
                        <hr />

                        <ul className="space-y-3 text-xs">
                            <li>
                                <NavLink
                                    to="/profile"
                                    end
                                    className={({ isActive }) =>
                                        isActive ? "text-cyan-400" : "text-black/60"
                                    }
                                >
                                    Danh sách sản phẩm
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/profile/account"
                                    className={({ isActive }) =>
                                        isActive ? "text-cyan-400" : "text-black/60"
                                    }
                                >
                                    Thông tin tài khoản
                                </NavLink>
                            </li>

                            <li>
                                <NavLink
                                    to="/login"
                                    className="flex items-center gap-2 text-black/60 hover:text-cyan-400"
                                >

                                    Đăng xuất
                                </NavLink>
                            </li>
                        </ul>
                    </aside>

                    {/* CONTENT */}
                    <main className="flex-1 h-[460px] bg-white rounded-2xl p-6 overflow-auto">

                        {/* MẶC ĐỊNH: ORDER LIST */}
                        {!isAccountPage && (
                            <>
                                <div className="bg-zinc-300/60 rounded-2xl p-4 mb-6">
                                    <div className="bg-white rounded-2xl px-4 py-2 flex gap-2">
                                        <span>Sản phẩm đã mua</span>
                                        <span className="font-semibold">0</span>
                                    </div>
                                </div>

                                <div className="flex justify-between text-sm font-medium">
                                    <span>Mã đơn hàng</span>
                                    <span>Số lượng</span>
                                </div>

                                <hr className="my-4" />

                                <div className="text-sm text-black/50 text-center pt-10">
                                    Chưa có đơn hàng nào
                                </div>
                            </>
                        )}

                        {/* CHỈ HIỆN KHI /profile/account */}
                        <Outlet />

                    </main>
                </div>
            </div>
        );
    }

    return (
        <>
            <Navbar />
            <Profile />
            <Footer />
        </>
    )
}