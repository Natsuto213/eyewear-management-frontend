import React, { useEffect, useState, useCallback, useMemo } from "react";
import { fetchOrders } from "../../../lib/orders";
import OrderToolbar from "./OrderToolbar";
import OrderTable from "./OrderTable";

async function fetchOrderStatuses(token: string) {
  const res = await fetch("https://api-eyewear.purintech.id.vn/api/operation-staff/orders/status-options", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Không thể lấy danh sách trạng thái");
  const data = await res.json();
  return data?.result || []; 
}

export default function OrderPage() {
  const [orders, setOrders] = useState([]);
  const [orderStatuses, setOrderStatuses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // --- THÊM CÁC STATE LỌC VÀO ĐÂY ---
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("Tất cả");
  const [dateFilter, setDateFilter] = useState("");

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const loadData = useCallback(async () => {
    if (!token) {
      setError("Token không hợp lệ, vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      
      // 1. Lấy trạng thái (giữ nguyên)
      if (orderStatuses.length === 0) {
        const statuses = await fetchOrderStatuses(token);
        setOrderStatuses(statuses);
      }

      // 2. Lấy đơn hàng (Bỏ searchParams cứng để lấy hết)
      const params = {
        page: 0,
        size: 100, // Lấy nhiều đơn hơn để lọc tại client
        sortBy: "orderDate",
        sortDir: "desc"
      };

      const res = await fetchOrders(token, params);
      
      // QUAN TRỌNG: API của bạn trả về { result: { content: [...] } }
      // Phải chọc đúng vào result.content thì orders mới có dữ liệu
      const dataList = res?.result?.content || res?.content || (Array.isArray(res) ? res : []);
      setOrders(dataList);
      
      setError(null);
    } catch (err: any) {
      setError("Lỗi khi tải dữ liệu: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [token, orderStatuses.length]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  // --- LOGIC LỌC DỮ LIỆU TẠI CLIENT ---
  const filteredOrders = useMemo(() => {
    return orders.filter((o: any) => {
      const needle = searchQuery.toLowerCase().trim();
      const matchQ = !needle || 
        o.orderCode?.toLowerCase().includes(needle) || 
        o.customerName?.toLowerCase().includes(needle);

      const matchStatus = statusFilter === "Tất cả" || o.orderStatus === statusFilter;
      const matchDate = !dateFilter || (o.orderDate && o.orderDate.startsWith(dateFilter));

      return matchQ && matchStatus && matchDate;
    });
  }, [orders, searchQuery, statusFilter, dateFilter]);

  if (loading && orders.length === 0) return <div className="p-10 text-center">Đang tải dữ liệu...</div>;

  return (
    <div className="min-h-screen p-6 md:p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Danh sách đơn hàng</h1>
          <button 
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
          >
            Làm mới
          </button>
        </header>

        {error && <div className="mb-4 p-4 bg-red-100 text-red-700 rounded-lg">{error}</div>}

        <div className="bg-white rounded-lg shadow">
          {/* Truyền các state lọc xuống Toolbar */}
          <OrderToolbar 
            orders={orders} 
            orderStatuses={orderStatuses}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            statusFilter={statusFilter}
            setStatusFilter={setStatusFilter}
            dateFilter={dateFilter}
            setDateFilter={setDateFilter}
            totalFiltered={filteredOrders.length}
          />

          {/* Truyền mảng ĐÃ LỌC xuống Table */}
          <OrderTable orders={filteredOrders} />
        </div>
      </div>
    </div>
  );
}