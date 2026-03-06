import React from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import { useLocation } from 'react-router-dom'

const Dashboard = () => {
    const location = useLocation()
    const userData = location.state || {}
    return (
        <div className="flex h-screen overflow-hidden font-sans">
            {/* Sidebar nhận role từ user đang đăng nhập */}
            <Sidebar role={userData.role} name={userData.name} />

            <main className="flex-1 overflow-y-auto bg-gray-200">
                <Outlet />
            </main>
        </div>

    )
}

export default Dashboard
