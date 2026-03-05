import React from 'react'
import { Outlet, Navigate, useNavigate } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useAuth } from '../../context/AuthContext'

const Dashboard = () => {
    const { user, logout } = useAuth()
    const navigate = useNavigate()

    // Chưa đăng nhập → chuyển về trang login
    if (!user) {
        return <Navigate to="/login" />
    }

    const handleLogout = () => {
        logout()
        navigate("/login")
    }

    return (
        <div className="flex h-screen overflow-hidden font-sans">
            {/* Sidebar nhận role từ user đang đăng nhập */}
            <Sidebar userRole={user.role} userName={user.name} onLogout={handleLogout} />

            <main className="flex-1 overflow-y-auto bg-gray-200">
                <Outlet />
            </main>
        </div>
    )
}

export default Dashboard
