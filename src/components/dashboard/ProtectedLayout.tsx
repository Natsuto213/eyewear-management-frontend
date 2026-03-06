import type React from "react";
import { Outlet, useLocation } from 'react-router';
import { Sidebar } from './Sidebar';
import { type Role, type TabItem } from './navigation';

interface ProtectedLayoutOptions {
  tabs: TabItem[];
  defaultTab?: string;
  role: Role;
}

interface ProtectedLayoutProps {
  children?: React.ReactNode;
  options: ProtectedLayoutOptions;
}

const layout = (sidebar: React.ReactNode) => {
  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      {sidebar}

      {/* Main Content Area */}
      <main className="flex-1 overflow-auto">
        <div className="h-full">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

// THÊM API XÁC ĐỊNH USER VÀO ĐÂY
const MainLayout = ({ tabs, role, userName = 'Không lấy được username' }:
  { tabs: TabItem[]; role: Role; userName?: string; children?: React.ReactNode; }) => {


  return layout(
    <Sidebar
      role={role}
      tabs={tabs}
      userName={userName}
    />
  );
};

export const ProtectedLayout = ({ children, options }: ProtectedLayoutProps) => {
  const location = useLocation();
  const userData = location.state || {};

  return (
    <MainLayout
      tabs={options.tabs}
      role={options.role}
      userName={userData.name}
    >
      {children || <Outlet />}
    </MainLayout>
  );
};
