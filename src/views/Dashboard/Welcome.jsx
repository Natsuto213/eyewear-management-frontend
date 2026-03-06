import React from 'react'
import { useLocation } from 'react-router-dom'

const Welcome = () => {
    const location = useLocation()
    const userData = location.state || {}
    return (
        <div className="flex h-full flex-col items-center justify-center bg-gray-200 p-10">
            <h2 className="mb-2 text-2xl font-bold text-gray-800">
                Xin chào, {userData.name || "Người dùng"}!
            </h2>
            <p className="text-sm text-gray-500">
                Bạn đang đăng nhập với vai trò <span className="font-semibold">{userData.role}</span>
            </p>
            <p className="mt-1 text-xs text-gray-400">
                Chọn một mục bên trái để bắt đầu quản lý
            </p>
        </div>
    )
}

export default Welcome
