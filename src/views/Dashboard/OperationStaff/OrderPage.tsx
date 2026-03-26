import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router";
import { motion } from "framer-motion";
import { RefreshCcw, AlertCircle, ChevronLeft, ChevronRight } from "lucide-react";
import OrderToolbar from "./OrderToolbar";
import OrderTable from "./OrderTableOps";
import { api } from "@/lib/ApiService";

const PAGE_SIZE = 10;

export default function OrderPage() {
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [statusData, setStatusData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // ✅ Restore currentPage từ sessionStorage
  const [currentPage, setCurrentPage] = useState(() => {
    const saved = sessionStorage.getItem("orderPage");
    return saved ? parseInt(saved) : 0;
  });

  const location = useLocation();

  // ✅ Restore filters từ sessionStorage
  const [filters, setFilters] = useState(() => {
    const saved = sessionStorage.getItem("orderFilters");
    return saved
      ? JSON.parse(saved)
      : {
          searchQuery: "",
          status: "Tất cả",
          orderType: "Tất cả",
          orderDate: "",
        };
  });

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  // Fetch status options 1 lần duy nhất
  useEffect(() => {
    if (!token) return;
    fetch("https://api-eyewear.purintech.id.vn/api/operation-staff/orders/status-options", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.code === 1000) setStatusData(data.result || []);
      })
      .catch(() => {});
  }, [token]);

  // ✅ Batch fetch toàn bộ data
  const loadData = useCallback(async () => {
  try {
    setLoading(true);
    const BATCH_SIZE = 50;
    let page = 0;
    let allData: any[] = [];
    let totalPages = 1;

    do {
      // ✅ Bỏ token + headers thủ công
      const res = await api.post("/api/operation-staff/orders/search", {
        page,
        size: BATCH_SIZE,
        sortBy: "orderDate",
        sortDir: "desc",
      });
      const result = res.data?.result;
      allData = [...allData, ...(result?.content || [])];
      totalPages = result?.totalPages || 1;
      page++;
    } while (page < totalPages);

    setAllOrders(allData);
    setError(null);
  } catch (err: any) {
    setError(err.message || "Không thể tải đơn hàng");
  } finally {
    setLoading(false);
  }
}, []); 

// Thay fetch status-options:
useEffect(() => {
  api.get("/api/operation-staff/orders/status-options")
    .then(res => {
      if (res.data.code === 1000) setStatusData(res.data.result || []);
    })
    .catch(() => {});
}, []);

  // Load lần đầu
  useEffect(() => {
    loadData();
  }, [loadData]);

  // Reload khi quay lại từ OrderDetail
  useEffect(() => {
    if (location.state?.refresh) {
      loadData();
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  // ✅ Lưu filters vào sessionStorage mỗi khi thay đổi
  useEffect(() => {
    sessionStorage.setItem("orderFilters", JSON.stringify(filters));
  }, [filters]);

  // ✅ Lưu page vào sessionStorage mỗi khi thay đổi
  useEffect(() => {
    sessionStorage.setItem("orderPage", String(currentPage));
  }, [currentPage]);

  // ✅ Filter hoàn toàn trên FE
  const filteredOrders = useMemo(() => {
    const q = filters.searchQuery.trim().toLowerCase();
    return allOrders.filter((o) => {
      const matchSearch =
        !q ||
        o.customerName?.toLowerCase().includes(q) ||
        o.orderCode?.toLowerCase().includes(q);
      const matchStatus =
        filters.status === "Tất cả" || o.orderStatus === filters.status;
      const matchType =
        filters.orderType === "Tất cả" || o.orderType === filters.orderType;
      const matchDate =
        !filters.orderDate || o.orderDate?.startsWith(filters.orderDate);
      return matchSearch && matchStatus && matchType && matchDate;
    });
  }, [allOrders, filters]);

  // ✅ Paginate trên FE
  const totalElements = filteredOrders.length;
  const totalPages = Math.max(1, Math.ceil(totalElements / PAGE_SIZE));
  const orders = filteredOrders.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(0);
  };

  const handleResetFilter = () => {
    setFilters({
      searchQuery: "",
      status: "Tất cả",
      orderType: "Tất cả",
      orderDate: "",
    });
    setCurrentPage(0);
    // ✅ Xóa khỏi sessionStorage
    sessionStorage.removeItem("orderFilters");
    sessionStorage.removeItem("orderPage");
  };

  const handlePageChange = (page: number) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };

  const pageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (currentPage > 2) pages.push("...");
      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages - 2, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1);
    }
    return pages;
  };

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
            <p className="text-gray-600">
              Tổng cộng{" "}
              <span className="font-bold text-indigo-600">{totalElements}</span>{" "}
              đơn hàng
            </p>
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => loadData()}
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

        {/* Toolbar + Table */}
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
            total={orders.length}
            original={totalElements}
          />

          <OrderTable orders={orders} loading={loading} />

          {/* Pagination */}
          {!loading && totalPages > 1 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 flex items-center justify-between flex-wrap gap-4"
            >
              {/* Info */}
              <p className="text-sm text-gray-500">
                Trang{" "}
                <span className="font-bold text-indigo-600">
                  {currentPage + 1}
                </span>{" "}
                / {totalPages} · Hiển thị{" "}
                <span className="font-bold">{orders.length}</span> /{" "}
                <span className="font-bold">{totalElements}</span> đơn
              </p>

              {/* Buttons */}
              <div className="flex items-center gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 0}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border-2 border-indigo-100 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" /> Trước
                </motion.button>

                <div className="flex items-center gap-1">
                  {pageNumbers().map((page, idx) =>
                    page === "..." ? (
                      <span
                        key={`ellipsis-${idx}`}
                        className="px-2 text-gray-400 font-bold"
                      >
                        ...
                      </span>
                    ) : (
                      <motion.button
                        key={page}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handlePageChange(page as number)}
                        className={`w-9 h-9 rounded-xl font-bold text-sm transition-all shadow-sm
                          ${
                            currentPage === page
                              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                              : "bg-white border-2 border-indigo-100 text-gray-600 hover:bg-indigo-50"
                          }`}
                      >
                        {(page as number) + 1}
                      </motion.button>
                    )
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage >= totalPages - 1}
                  className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border-2 border-indigo-100 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Tiếp <ChevronRight className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
}