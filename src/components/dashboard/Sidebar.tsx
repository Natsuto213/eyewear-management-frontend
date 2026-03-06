import { useState } from 'react';
import { Link, useLocation } from 'react-router';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { Separator } from '../ui/separator';
import { cn } from '../ui/utils';
import { type Role, type TabItem, getTabsByRole, getRoleDisplayName } from './navigation';
import { ChevronLeft, ChevronRight, LogOut } from 'lucide-react';
import { apiLogout } from "../../lib/userApi";

interface SidebarProps {
  role: Role;
  tabs?: TabItem[];
  userName?: string;
}

export function Sidebar({
  role,
  tabs: customTabs,
  userName = 'User',
}: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const tabs = customTabs || getTabsByRole(role);
  const roleDisplayName = getRoleDisplayName(role);

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const getRoleBadgeColor = (currentRole: Role) => {
    switch (currentRole) {
      case 'sales':
        return 'bg-blue-500';
      case 'operation':
        return 'bg-green-500';
      case 'manager':
        return 'bg-purple-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      className={cn(
        "relative h-screen bg-gray-900 text-white transition-all duration-300 flex flex-col",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Header - User Info */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center gap-3">

          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="font-medium truncate">{userName}</p>
              <Badge
                variant="secondary"
                className={cn("text-xs mt-1", getRoleBadgeColor(role))}
              >
                {roleDisplayName}
              </Badge>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Menu */}
      <ScrollArea className="flex-1">
        <nav className="p-2 space-y-1">
          {tabs.map((tab: TabItem) => {
            const Icon = tab.icon;
            const active = isActive(tab.path);

            return (
              <Link
                key={tab.id}
                to={tab.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
                  "hover:bg-gray-800",
                  active && "bg-gray-800 text-white border-l-4 border-blue-500",
                  !active && "text-gray-400",
                  collapsed && "justify-center"
                )}
                title={collapsed ? tab.label : undefined}
              >
                <Icon className="h-5 w-5 shrink-0" />
                {!collapsed && (
                  <span className="truncate">{tab.label}</span>
                )}
              </Link>
            );
          })}
        </nav>
      </ScrollArea>

      <Separator className="bg-gray-800" />

      {/* Footer - Logout */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={async () => {
            await apiLogout();
            window.location.href = "/";
          }}
          // CẬP NHẬT: Thêm flex, items-center, gap-3 và chỉnh lại màu sắc
          className={cn(
            "flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-colors",
            "text-gray-400 hover:bg-gray-800 hover:text-white",
            collapsed && "justify-center"
          )}
          title={collapsed ? "Logout" : undefined}
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Logout</span>}
        </button>
      </div>

      {/* Collapse Toggle Button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 bg-gray-900 border border-gray-700 rounded-full p-1 hover:bg-gray-800 transition-colors"
      >
        {collapsed ? (
          <ChevronRight className="h-4 w-4" />
        ) : (
          <ChevronLeft className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}
