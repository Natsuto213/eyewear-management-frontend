import type React from "react";
import { Outlet } from 'react-router';
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
const MainLayout = ({
  tabs,
  role,
  userName = 'John Doe',
  userAvatar
}: {
  tabs: TabItem[];
  role: Role;
  userName?: string;
  userAvatar?: string;
  children?: React.ReactNode;
}) => {
  const handleLogout = () => {
    console.log('Logging out...');
    // Handle logout logic here
  };

  return layout(
    <Sidebar
      role={role}
      tabs={tabs}
      userName={userName}
      userAvatar={userAvatar}
      onLogout={handleLogout}
    />
  );
};

export const ProtectedLayout = ({ children, options }: ProtectedLayoutProps) => {
  return (
    <MainLayout
      tabs={options.tabs}
      role={options.role}
    >
      {children || <Outlet />}
    </MainLayout>
  );
};
