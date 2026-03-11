import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useLocation } from "react-router";
import { motion } from "framer-motion";
import { RefreshCcw, AlertCircle } from "lucide-react";
import OrderToolbar from "./OrderToolbar";
import OrderTable from "./OrderTableOps";

export default function OrderPage() {

  const [orders, setOrders] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const location = useLocation();
  const didRefresh = useRef(false); // ← tránh double reload

  const [filters, setFilters] = useState({
    searchQuery: "",
    status: "Tất cả",
    orderType: "Tất cả",
    orderDate: "",
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

      // load status options — chỉ load 1 lần
      const statusRes = await fetch(
        "https://api-eyewear.purintech.id.vn/api/operation-staff/orders/status-options",
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const statusJson = await statusRes.json();
      if (statusJson.code === 1000) {
        setStatusData(statusJson.result || []);
      }

      // lấy toàn bộ đơn hàng
      const res = await fetch(
        "https://api-eyewear.purintech.id.vn/api/operation-staff/orders/search",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            page: 0,
            size: 100,
            sortBy: "orderDate",
            sortDir: "desc",
          }),
        }
      );

      const data = await res.json();

      const list = Array.isArray(data.result)
        ? data.result
        : data?.result?.content
        || data?.content
        || [];

      setOrders(list);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Không thể tải đơn hàng");
    } finally {
      setLoading(false);
    }
  }, [token]); // ← bỏ statusData.length khỏi dependency

  // Load lần đầu
  useEffect(() => {
    loadData();
  }, [loadData]);

  // ← Reload khi quay lại từ OrderDetail
  useEffect(() => {
    if (location.state?.refresh && !didRefresh.current) {
      didRefresh.current = true;
      loadData();
      // Xóa state để không reload lại lần sau
      window.history.replaceState({}, "");
    } else if (!location.state?.refresh) {
      didRefresh.current = false; // reset cho lần navigate tiếp
    }
  }, [location.state, loadData]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleResetFilter = () => {
    setFilters({
      searchQuery: "",
      status: "Tất cả",
      orderType: "Tất cả",
      orderDate: "",
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
        (o.orderDate && o.orderDate.startsWith(filters.orderDate));

      return matchSearch && matchStatus && matchType && matchDate;
    });
  }, [orders, filters]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap justify-between items-center gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Quản lý đơn hàng
            </h1>
            <p className="text-gray-600">Danh sách tất cả đơn hàng trong hệ thống</p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={loadData}
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCcw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
            Làm mới
          </motion.button>
        </motion.div>

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-300 rounded-2xl p-5 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <p className="text-red-700 font-bold text-lg">Lỗi tải dữ liệu</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
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
        </motion.div>

      </div>
    </div>
  );
}