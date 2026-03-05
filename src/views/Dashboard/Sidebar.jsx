import React from 'react'
import { NavLink } from 'react-router-dom'
import { apiLogout } from '../../lib/userApi'
import { useNavigate } from 'react-router-dom'

const Sidebar = ({ role, name }) => {
    const navigate = useNavigate()

    const linkClass = ({ isActive }) =>
        `block px-6 py-3 !no-underline [text-decoration:none] transition-colors ${isActive
            ? "bg-gray-200 text-gray-900 font-bold"
            : "text-gray-600 hover:bg-gray-100"
        }`

    return (
        <div className="flex h-screen w-64 flex-col border-r border-gray-200 bg-white">
            {/* Tên app + thông tin user */}
            <div className="border-b border-gray-200 p-5">
                <div className="text-lg font-bold text-gray-800">EYEWEAR ADMIN</div>
                <div className="mt-1 text-xs text-gray-400">{name} ({role})</div>
            </div>

            {/* Menu */}
            <nav className="mt-2 flex-1">

                {/* Manager thấy */}
                {role === "MANAGER" && (
                    <>
                        <NavLink to="/dashboard/orders" className={linkClass}>
                            Danh sách Order
                        </NavLink>
                        <NavLink to="/dashboard/complaints" className={linkClass}>
                            Đơn khiếu nại
                        </NavLink>
                    </>
                )}

                {/* Saler thấy */}
                {role === "SALES STAFF" && (
                    <>
                        <NavLink to="/sales" className={linkClass}>
                            Báo cáo doanh thu
                        </NavLink>
                        <NavLink to="/customers" className={linkClass}>
                            Danh sách khách hàng
                        </NavLink>
                    </>
                )}
            </nav>

            {/* Nút đăng xuất */}
            <div className="border-t border-gray-200 p-4">
                <button
                    onClick={async () => {
                        await apiLogout();
                        navigate("/")
                    }}
                    className="w-full rounded-lg bg-red-50 px-4 py-2 text-sm font-medium text-red-600
                               hover:bg-red-100"
                >
                    Đăng xuất
                </button>
            </div>
        </div>
    )
}

export default Sidebar
