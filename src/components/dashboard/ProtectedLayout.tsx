import type React from "react";
import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import { type Role, type TabItem } from './navigation';
import { Navigate } from 'react-router-dom';
interface ProtectedLayoutProps {
    children?: React.ReactNode;
    tabs: TabItem[];
    role: Role;
    defaultTab?: string;
    userName?: string;
}

export const ProtectedLayout = ({ children, tabs, role, defaultTab, userName }: ProtectedLayoutProps) => {

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50">
            {/* Sidebar */}
            <Sidebar
                role={role}
                tabs={tabs}
                userName={userName}
            />

            {/* Main Content Area */}
            <main className="flex-1 overflow-auto">
                <div className="h-full">
                    {/* Render children nếu có truyền vào, ngược lại sẽ dùng Outlet của react-router */}
                    {children || <Outlet />}
                </div>
            </main>
        </div>
    );
};