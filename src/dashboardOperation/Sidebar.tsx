import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Package, Warehouse, LogOut } from "lucide-react";
import { apiGetMyInfo, apiLogout } from "../lib/userApi";  // Import API để lấy thông tin và đăng xuất
import { useNavigate } from "react-router-dom";
import { Badge } from "../components/ui/badge";
import { ScrollArea } from "../components/ui/scroll-area";
import { Separator } from "../components/ui/separator";
import { cn } from "../components/ui/utils";
import { useLocation } from "react-router-dom";

export default function Sidebar() {
  const [userInfo, setUserInfo] = useState<{ name: string, role: string }>({ name: "", role: "" });
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const location = useLocation(); // Dùng để xác định đường dẫn hiện tại

  // Lấy thông tin người dùng từ API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await apiGetMyInfo();
        if (res && res.name) {
          setUserInfo({
            name: res.name || "Trần Văn B", // Mặc định nếu không có name
            role: res.role?.name || "Nhân viên vận hành", // Mặc định nếu không có role
          });
        }
      } catch (err) {
        console.error("Error fetching user info:", err);
        setUserInfo({ name: "Không có thông tin", role: "Không xác định" });
      }
    };

    fetchUserInfo();
  }, []);

  // Hàm đăng xuất
  const handleLogout = async () => {
    const confirmed = window.confirm("Bạn có chắc chắn muốn đăng xuất?");
    if (confirmed) {
      try {
        await apiLogout();
        localStorage.removeItem("access_token"); // Xóa token
        navigate("/login", { replace: true }); // Chuyển hướng về trang đăng nhập
      } catch (error) {
        console.error("Logout failed:", error);
      }
    }
  };

  // Kiểm tra xem menu item nào đang được chọn
  const isActive = (path: string) => location.pathname === path;

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
          {/* Avatar and Name */}
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
            AVT
          </div>
          <div className="min-w-0 flex-1">
            {!collapsed && (
              <p className="font-medium truncate">{userInfo.name}</p>
            )}
            <Badge variant="secondary" className={cn("text-xs mt-1 bg-green-500")}>
              {!collapsed && userInfo.role}
            </Badge>
          </div>
        </div>
      </div>

      {/* Navigation Menu with ScrollArea */}
      <ScrollArea className="flex-1 overflow-y-auto">
        <nav className="p-2 space-y-1">
          <Link
            to="/operation-staff/orders"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              isActive("/operation-staff/orders") && "bg-gray-800 text-white border-l-4 border-blue-500",
              !isActive("/operation-staff/orders") && "text-gray-400 hover:text-white",
              collapsed && "justify-center"
            )}
          >
            <Package className="h-5 w-5 shrink-0" />
            {!collapsed && "Danh sách đơn hàng"}
          </Link>
          <Link
            to="/operation-staff/inventory"
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors",
              isActive("/operation-staff/inventory") && "bg-gray-800 text-white border-l-4 border-blue-500",
              !isActive("/operation-staff/inventory") && "text-gray-400 hover:text-white",
              collapsed && "justify-center"
            )}
          >
            <Warehouse className="h-5 w-5 shrink-0" />
            {!collapsed && "Hàng trong kho"}
          </Link>
        </nav>
      </ScrollArea>

      <Separator className="bg-gray-800" />

      {/* Footer - Logout */}
      <div className="p-3 border-t border-gray-800">
        <button
          onClick={handleLogout}
          className="text-sm font-medium text-gray-600 hover:text-black transition flex items-center gap-2"
        >
          <LogOut className="h-5 w-5 shrink-0" />
          {!collapsed && <span>Đăng xuất</span>}
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
