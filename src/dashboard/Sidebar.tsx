import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Package, Warehouse, LogOut, User } from "lucide-react";
import { apiGetMyInfo, apiLogout } from "../lib/userApi"; // Import API để lấy thông tin và đăng xuất
import { useNavigate } from "react-router-dom";

export default function Sidebar() {
  const [userInfo, setUserInfo] = useState<{ name: string, role: string }>({ name: "", role: "" });
  const navigate = useNavigate();

  // Lấy thông tin người dùng từ API
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const res = await apiGetMyInfo();
        setUserInfo({
          name: res?.result?.name || "Trần Văn B",  // Set default if no info
          role: res?.result?.role?.name || "Nhân viên vận hành",
        });
      } catch (err) {
        console.error("Error fetching user info:", err);
      }
    };
    fetchUserInfo();
  }, []);

  // Hàm đăng xuất
  const handleLogout = async () => {
    try {
      await apiLogout();
      localStorage.removeItem("access_token"); // Xóa token
      navigate("/login", { replace: true });  // Chuyển hướng về trang đăng nhập
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <aside className="w-[280px] bg-white border-r border-gray-100 min-h-screen sticky top-0">
      <div className="p-5">
        {/* Profile */}
        <div className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3 shadow-sm">
          <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
            AVT
          </div>
          <div className="min-w-0">
            <div className="font-semibold text-gray-900 leading-tight">{userInfo.name}</div>
            <div className="text-xs text-gray-500 truncate">{userInfo.role}</div>
          </div>
        </div>

        {/* Menu điều hướng */}
        <nav className="mt-6 space-y-2">
          <Link
            to="/operation-staff/orders"
            className="text-lg text-gray-900 hover:text-blue-600 px-6 py-2 flex items-center gap-2"
          >
            <Package className="w-5 h-5" /> Danh sách đơn hàng
          </Link>
          <Link
            to="/operation-staff/inventory"
            className="text-lg text-gray-900 hover:text-blue-600 px-6 py-2 flex items-center gap-2"
          >
            <Warehouse className="w-5 h-5" /> Hàng trong kho
          </Link>
        </nav>
      </div>

      <div className="p-5 border-t border-gray-100">
        <button
          onClick={handleLogout}
          className="w-full rounded-2xl px-4 py-3 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 font-semibold"
        >
          <LogOut className="w-5 h-5" />
          Đăng xuất
        </button>
      </div>
    </aside>
  );
}
