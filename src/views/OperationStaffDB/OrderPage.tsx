// src/pages/OperationStaff/OrderPage.tsx
import React, { useEffect, useState } from "react";
import { fetchOrders } from "../../lib/orders";  // Đảm bảo import đúng
import OrderToolbar from "../../dashboard/OrderToolbar";  // Thanh công cụ tìm kiếm
import OrderTable from "../OperationStaffDB/OrderTable";  // Bảng hiển thị đơn hàng
import Sidebar from "../../dashboard/Sidebar";  // Sidebar điều hướng

// API để lấy danh sách các trạng thái đơn hàng
async function fetchOrderStatuses(token: string) {
  const res = await fetch("https://api-eyewear.purintech.id.vn/api/operation-staff/orders/status-options", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Failed to fetch order statuses");
  }

  const data = await res.json();
  return data.result; // Trả về danh sách trạng thái
}

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderStatuses, setOrderStatuses] = useState<any[]>([]); // State để lưu trạng thái đơn hàng

  const token = localStorage.getItem("access_token");  // Lấy token từ localStorage

  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ, vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    // Lấy danh sách trạng thái đơn hàng từ API
    fetchOrderStatuses(token)
      .then((data) => {
        setOrderStatuses(data);  // Lưu trạng thái vào state
      })
      .catch((error) => {
        setError("Không thể lấy danh sách trạng thái đơn hàng: " + error.message);
      });

    // Dữ liệu tìm kiếm cho API
    const searchParams = {
      orderCode: "ORD-2026-03-02-E2833C70",  // Mã đơn hàng
      orderDate: "2026-03-02",                // Ngày đặt hàng
      orderType: "PRESCRIPTION_ORDER",        // Loại đơn hàng
      orderStatus: "PROCESSING",              // Trạng thái đơn hàng
      page: 0,                                // Số trang
      size: 10,                               // Kích thước trang
      sortBy: "orderDate",                    // Sắp xếp theo ngày đặt
      sortDir: "desc"                         // Sắp xếp giảm dần
    };

    fetchOrders(token, searchParams)
      .then((data) => {
        setOrders(data);  // Lưu dữ liệu vào state
      })
      .catch((error) => {
        setError(`Đã có lỗi khi lấy đơn hàng: ${error.message}`);
      })
      .finally(() => {
        setLoading(false);  // Kết thúc tải dữ liệu
      });
  }, [token]);

  if (loading) return <div>Đang tải đơn hàng...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Danh sách đơn hàng</h1>
        <OrderToolbar orders={orders} orderStatuses={orderStatuses} /> {/* Truyền thêm orderStatuses vào OrderToolbar */}
        <OrderTable orders={orders} />
      </div>
    </div>
  );
}
