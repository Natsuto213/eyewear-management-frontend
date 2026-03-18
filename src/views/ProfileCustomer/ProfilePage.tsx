import React, { useEffect, useState, useMemo } from "react";
import { NavLink, Outlet, useMatch, useNavigate } from "react-router-dom";
import { apiLogout } from "../../lib/userApi";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ChevronLeft, ChevronRight, Search, SlidersHorizontal, X } from "lucide-react";

const BASE_URL = "https://api-eyewear.purintech.id.vn";

interface OrderRow {
  orderId: number;
  orderCode: string;
  orderType: string;
  orderStatus: string;
  orderDate: string;
  totalAmount: number;
  shippingStatus: string;
}

const orderStatusConfig: Record<string, { label: string; color: string }> = {
  PENDING:        { label: "Chờ xác nhận",   color: "bg-yellow-50 text-yellow-700 border-yellow-200" },
  PARTIALLY_PAID: { label: "Đã đặt cọc",     color: "bg-amber-50 text-amber-700 border-amber-200" },
  PAID:           { label: "Đã thanh toán",  color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  CONFIRMED:      { label: "Đã xác nhận",    color: "bg-blue-50 text-blue-700 border-blue-200" },
  PROCESSING:     { label: "Đang gia công",  color: "bg-amber-50 text-amber-700 border-amber-200" },
  READY:          { label: "Chờ vận chuyển", color: "bg-purple-50 text-purple-700 border-purple-200" },
  COMPLETED:      { label: "Hoàn thành",     color: "bg-green-50 text-green-700 border-green-200" },
  CANCELED:       { label: "Đã hủy",         color: "bg-red-50 text-red-700 border-red-200" },
};

const shippingOverride: Record<string, { label: string; color: string }> = {
  PACKING:   { label: "Đang đóng gói",  color: "bg-blue-50 text-blue-700 border-blue-200" },
  SHIPPING:  { label: "Đang giao hàng", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  DELIVERED: { label: "Đã giao",        color: "bg-green-50 text-green-700 border-green-200" },
  FAILED:    { label: "Giao thất bại",  color: "bg-red-50 text-red-700 border-red-200" },
  RETURNED:  { label: "Hoàn hàng",      color: "bg-orange-50 text-orange-700 border-orange-200" },
};

const STATUS_TABS = [
  { key: "ALL",            label: "Tất cả" },
  { key: "PENDING",        label: "Chờ xác nhận" },
  { key: "PARTIALLY_PAID", label: "Đã đặt cọc" },
  { key: "PAID",           label: "Đã thanh toán" },
  { key: "CONFIRMED",      label: "Đã xác nhận" },
  { key: "PROCESSING",     label: "Đang gia công" },
  { key: "SHIPPING",       label: "Đang giao" },
  { key: "COMPLETED",      label: "Hoàn thành" },
  { key: "CANCELED",       label: "Đã hủy" },
];

const SORT_OPTIONS = [
  { key: "DATE_DESC",    label: "Mới nhất" },
  { key: "DATE_ASC",     label: "Cũ nhất" },
  { key: "AMOUNT_DESC",  label: "Giá cao → thấp" },
  { key: "AMOUNT_ASC",   label: "Giá thấp → cao" },
];

const formatDate = (str: string) => {
  if (!str) return "";
  return new Date(str).toLocaleDateString("vi-VN");
};

const formatCurrency = (v: number) =>
  v?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const Profilepage: React.FC = () => {
  const isAccountPage = useMatch("/profile/account");
  const navigate = useNavigate();

  const [orders, setOrders]   = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  // Filter / Search / Sort
  const [activeTab, setActiveTab]     = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortKey, setSortKey]         = useState("DATE_DESC");
  const [showSort, setShowSort]       = useState(false);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { navigate("/login", { replace: true }); return; }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res  = await fetch(`${BASE_URL}/orders/history`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.code === 1000) setOrders(data.result || []);
        else setError("Không thể tải đơn hàng");
      } catch {
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  // Filtered + sorted
  const filteredOrders = useMemo(() => {
    let result = [...orders];

    // 1. Tab filter
    if (activeTab !== "ALL") {
      result = result.filter(o => {
        if (activeTab === "SHIPPING") return o.shippingStatus === "SHIPPING" || o.shippingStatus === "PACKING";
        return o.orderStatus === activeTab;
      });
    }

    // 2. Search by order code
    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      result = result.filter(o => o.orderCode.toLowerCase().includes(q));
    }

    // 3. Sort
    result.sort((a, b) => {
      switch (sortKey) {
        case "DATE_ASC":    return new Date(a.orderDate).getTime() - new Date(b.orderDate).getTime();
        case "DATE_DESC":   return new Date(b.orderDate).getTime() - new Date(a.orderDate).getTime();
        case "AMOUNT_ASC":  return a.totalAmount - b.totalAmount;
        case "AMOUNT_DESC": return b.totalAmount - a.totalAmount;
        default:            return 0;
      }
    });

    return result;
  }, [orders, activeTab, searchQuery, sortKey]);

  const handleTabChange = (key: string) => { setActiveTab(key); setCurrentPage(1); };
  const handleSearch    = (q: string)   => { setSearchQuery(q); setCurrentPage(1); };
  const handleSort      = (key: string) => { setSortKey(key); setShowSort(false); setCurrentPage(1); };
  const clearFilters    = ()            => { setActiveTab("ALL"); setSearchQuery(""); setCurrentPage(1); };

  const indexOfLastOrder  = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders     = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages        = Math.ceil(filteredOrders.length / ordersPerPage);
  const paginate          = (n: number) => { setCurrentPage(n); window.scrollTo({ top: 0, behavior: "smooth" }); };

  const navBase     = "group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition";
  const navInactive = "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900";
  const navActive   = "bg-teal-50 text-teal-700 ring-1 ring-teal-100";

  const totalOrders     = orders.length;
  const shippingOrders  = orders.filter(o => o.shippingStatus === "SHIPPING" || o.shippingStatus === "PACKING").length;
  const deliveredOrders = orders.filter(o => o.orderStatus === "COMPLETED").length;
  const isFiltering     = activeTab !== "ALL" || searchQuery.trim() !== "";

  const countForTab = (key: string) => {
    if (key === "ALL") return orders.length;
    if (key === "SHIPPING") return orders.filter(o => o.shippingStatus === "SHIPPING" || o.shippingStatus === "PACKING").length;
    return orders.filter(o => o.orderStatus === key).length;
  };

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white px-4 py-8">
        <div className="mx-auto w-full max-w-6xl">

          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900">Tài khoản</h1>
              <p className="mt-1 text-sm text-zinc-500">Quản lý đơn hàng và thông tin cá nhân của bạn</p>
            </div>
            <button
              onClick={() => navigate("/")}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm active:translate-y-0"
            >
              ← Về trang chủ
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            {/* SIDEBAR */}
            <aside className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm h-fit">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 font-bold text-xl">K</div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-900">Xin chào, Kiên 👋</div>
                  <div className="truncate text-xs text-zinc-500">Thành viên FPT University</div>
                </div>
              </div>
              <div className="my-5 h-px bg-zinc-200" />
              <nav className="space-y-2">
                <NavLink to="/profile" end className={({ isActive }) => [navBase, isActive ? navActive : navInactive].join(" ")}>
                  <span>Đơn hàng của tôi</span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 transition group-hover:bg-zinc-200">{totalOrders}</span>
                </NavLink>
                <NavLink to="/profile/account" className={({ isActive }) => [navBase, isActive ? navActive : navInactive].join(" ")}>
                  <span>Thông tin tài khoản</span>
                  <span className="text-zinc-400 group-hover:text-zinc-500">›</span>
                </NavLink>
                <a
                  onClick={async () => { await apiLogout(); window.location.href = "/"; }}
                  className={[navBase, "cursor-pointer text-zinc-600 hover:bg-red-50 hover:text-red-700"].join(" ")}
                >
                  <span>Đăng xuất</span>
                  <span className="text-zinc-400 group-hover:text-red-500">⎋</span>
                </a>
              </nav>
            </aside>

            {/* CONTENT */}
            <main className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              {!isAccountPage && (
                <>
                  {/* Header */}
                  <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-900">Đơn hàng của tôi</h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        {isFiltering
                          ? `${filteredOrders.length} kết quả (tổng ${totalOrders} đơn)`
                          : `${totalOrders} đơn hàng`}
                      </p>
                    </div>
                    <button
                      onClick={() => navigate("/all-product")}
                      className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition"
                    >
                      Mua thêm
                    </button>
                  </div>

                  {/* Summary cards */}
                  <div className="grid gap-3 grid-cols-3 mb-5">
                    {[
                      { label: "Tổng đơn",   value: totalOrders },
                      { label: "Đang giao",  value: shippingOrders },
                      { label: "Hoàn thành", value: deliveredOrders },
                    ].map(card => (
                      <div key={card.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                        <div className="text-xs text-zinc-500">{card.label}</div>
                        <div className="mt-1 text-lg font-bold text-zinc-900">{card.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* ── Search + Sort ── */}
                  <div className="flex gap-2 mb-3">
                    <div className="relative flex-1">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400" />
                      <input
                        type="text"
                        placeholder="Tìm mã đơn hàng..."
                        value={searchQuery}
                        onChange={e => handleSearch(e.target.value)}
                        className="w-full pl-9 pr-8 py-2.5 rounded-xl border border-zinc-200 text-sm focus:outline-none focus:ring-2 focus:ring-teal-400 focus:border-transparent bg-zinc-50"
                      />
                      {searchQuery && (
                        <button onClick={() => handleSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    {/* Sort */}
                    <div className="relative">
                      <button
                        onClick={() => setShowSort(p => !p)}
                        className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-zinc-200 bg-zinc-50 text-sm font-semibold text-zinc-700 hover:bg-zinc-100 transition whitespace-nowrap"
                      >
                        <SlidersHorizontal className="w-4 h-4" />
                        <span className="hidden sm:inline">{SORT_OPTIONS.find(s => s.key === sortKey)?.label}</span>
                      </button>
                      {showSort && (
                        <>
                          <div className="fixed inset-0 z-10" onClick={() => setShowSort(false)} />
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-2xl border border-zinc-200 shadow-xl z-20 overflow-hidden py-1">
                            {SORT_OPTIONS.map(opt => (
                              <button
                                key={opt.key}
                                onClick={() => handleSort(opt.key)}
                                className={`w-full text-left px-4 py-2.5 text-sm transition hover:bg-zinc-50 flex items-center gap-2 ${sortKey === opt.key ? "font-bold text-teal-600" : "text-zinc-700"}`}
                              >
                                {sortKey === opt.key && <span className="text-teal-500">✓</span>}
                                {opt.label}
                              </button>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* ── Status filter tabs ── */}
                  <div className="flex gap-1.5 overflow-x-auto pb-2 mb-5 scrollbar-hide">
                    {STATUS_TABS.map(tab => {
                      const count  = countForTab(tab.key);
                      const active = activeTab === tab.key;
                      // Ẩn tab nếu không có đơn (trừ ALL)
                      if (tab.key !== "ALL" && count === 0) return null;
                      return (
                        <button
                          key={tab.key}
                          onClick={() => handleTabChange(tab.key)}
                          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap border transition shrink-0
                            ${active
                              ? "bg-teal-600 border-teal-600 text-white shadow-sm"
                              : "bg-white border-zinc-200 text-zinc-600 hover:border-teal-300 hover:text-teal-600"}`}
                        >
                          {tab.label}
                          <span className={`rounded-full px-1.5 py-0.5 text-[10px] font-bold leading-none min-w-[16px] text-center
                            ${active ? "bg-white/25 text-white" : "bg-zinc-100 text-zinc-500"}`}>
                            {count}
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* ── Orders list ── */}
                  <div className="space-y-3">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-200 border-t-teal-600" />
                      </div>
                    ) : error ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">{error}</div>
                    ) : filteredOrders.length === 0 ? (
                      <div className="text-center py-12 space-y-2">
                        <p className="text-3xl">🔍</p>
                        <p className="text-zinc-600 font-semibold">Không tìm thấy đơn hàng nào</p>
                        <p className="text-zinc-400 text-sm">Thử thay đổi bộ lọc hoặc từ khoá tìm kiếm</p>
                        {isFiltering && (
                          <button onClick={clearFilters} className="mt-2 text-teal-600 text-sm font-semibold hover:underline">
                            Xóa tất cả bộ lọc
                          </button>
                        )}
                      </div>
                    ) : (
                      <>
                        {currentOrders.map(order => {
                          const display = shippingOverride[order.shippingStatus]
                            || orderStatusConfig[order.orderStatus]
                            || { label: order.orderStatus, color: "bg-zinc-100 text-zinc-700 border-zinc-200" };
                          return (
                            <div
                              key={order.orderId}
                              onClick={() => navigate(`/profile/orders/${order.orderId}`)}
                              className="rounded-2xl border border-zinc-200 p-4 hover:border-teal-300 hover:shadow-sm transition cursor-pointer group"
                            >
                              <div className="flex justify-between items-center gap-3">
                                <div className="min-w-0">
                                  <div className="font-bold text-zinc-900 group-hover:text-teal-700 transition truncate">
                                    {order.orderCode}
                                  </div>
                                  <div className="text-xs text-zinc-500 mt-0.5">
                                    {formatDate(order.orderDate)} · {formatCurrency(order.totalAmount)}
                                  </div>
                                </div>
                                <span className={`shrink-0 rounded-full border px-3 py-1 text-[10px] font-bold uppercase ${display.color}`}>
                                  {display.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="mt-6 flex items-center justify-center gap-2 pt-2">
                            <button onClick={() => paginate(currentPage - 1)} disabled={currentPage === 1} className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 transition">
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => i + 1).map(num => (
                              <button
                                key={num}
                                onClick={() => paginate(num)}
                                className={`w-10 h-10 rounded-lg border text-sm font-semibold transition ${
                                  currentPage === num
                                    ? "bg-teal-600 border-teal-600 text-white shadow-md shadow-teal-100"
                                    : "border-zinc-200 text-zinc-600 hover:bg-zinc-50"
                                }`}
                              >
                                {num}
                              </button>
                            ))}
                            <button onClick={() => paginate(currentPage + 1)} disabled={currentPage === totalPages} className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 transition">
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </>
              )}
              {isAccountPage && <Outlet />}
            </main>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Profilepage;