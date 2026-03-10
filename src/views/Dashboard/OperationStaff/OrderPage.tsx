import React, { useState, useEffect, useCallback, useMemo } from "react";
import { fetchOrders } from "../../../lib/orders";
import OrderToolbar from "./OrderToolbar";
import OrderTable from "./OrderTableOps";

export default function OrderPage() {

  const [orders, setOrders] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [filters, setFilters] = useState({
    searchQuery: "",
    status: "Tất cả",
    orderType: "Tất cả",
    orderDate: "", // ← bỏ today, không lọc ngày mặc định
  });

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  const loadData = useCallback(async () => {
    if (!token) {
      setError("Phiên đăng nhập hết hạn.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);

      // load status options
      if (statusData.length === 0) {
        const res = await fetch(
          "https://api-eyewear.purintech.id.vn/api/operation-staff/orders/status-options",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = await res.json();

        if (data.code === 1000) {
          setStatusData(data.result || []);
        }
      }

      // lấy toàn bộ đơn hàng
      const params = {
        orderCode: null,
        orderDate: null,
        orderType: null,
        orderStatus: null,
        page: 0,
        size: 100,
        sortBy: "orderDate",
        sortDir: "desc"
      };

      const res = await fetchOrders(token, params);

      const list = Array.isArray(res)
        ? res
        : res?.result?.content  // ← fix parse đúng structure API
        || res?.content
        || [];

      setOrders(list);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [token, statusData.length]);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetFilter = () => {
    setFilters({
      searchQuery: "",
      status: "Tất cả",
      orderType: "Tất cả",
      orderDate: "", // ← reset cũng để rỗng
    });
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((o: any) => {

      const needle = filters.searchQuery.toLowerCase().trim();

      const matchSearch =
        !needle ||
        o.orderCode?.toLowerCase().includes(needle) ||
        o.customerName?.toLowerCase().includes(needle);

      const matchStatus =
        filters.status === "Tất cả" ||
        o.orderStatus === filters.status;

      const matchType =
        filters.orderType === "Tất cả" ||
        o.orderType === filters.orderType;

      const matchDate =
        !filters.orderDate ||
        (o.orderDate &&
          o.orderDate.startsWith(filters.orderDate));

      return matchSearch && matchStatus && matchType && matchDate;
    });
  }, [orders, filters]);

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">

        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Quản lý đơn hàng
          </h1>

          <button
            onClick={loadData}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Làm mới
          </button>
        </div>

        {error && (
          <div className="mb-4 text-red-500 font-medium">
            ⚠️ {error}
          </div>
        )}

        <div className="bg-white rounded-xl shadow-sm p-5 border border-gray-200">

          <OrderToolbar
            filters={filters}
            onFilterChange={handleFilterChange}
            onResetFilter={handleResetFilter}
            statusData={statusData}
            total={filteredOrders.length}
            original={orders.length}
          />

          <OrderTable
            orders={filteredOrders}
            loading={loading}
          />

        </div>
      </div>
    </div>
  );
}