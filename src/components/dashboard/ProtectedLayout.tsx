import type React from "react";
import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import { type Role, type TabItem } from './navigation';

interface ProtectedLayoutProps {
  children?: React.ReactNode;
  tabs: TabItem[];
  role: Role;
  defaultTab?: string;
}

export const ProtectedLayout = ({ children, tabs, role, defaultTab }: ProtectedLayoutProps) => {
  const location = useLocation();
  const userData = location.state || {};

  // THÊM API XÁC ĐỊNH USER VÀO ĐÂY (hoặc gọi custom hook fetch data ở đây)
  const userName = userData.name || 'Không lấy được username';

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