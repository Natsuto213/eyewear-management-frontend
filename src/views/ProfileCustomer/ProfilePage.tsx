import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useMatch, useNavigate } from "react-router-dom";
import { apiLogout } from "../../lib/userApi";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ChevronLeft, ChevronRight } from "lucide-react";

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
  PENDING:        { label: "Chờ xác nhận",   color: "bg-yellow-50 text-yellow-700" },
  PARTIALLY_PAID: { label: "Đã đặt cọc",     color: "bg-emerald-50 text-emerald-700" },
  PAID:           { label: "Đã thanh toán",  color: "bg-emerald-50 text-emerald-700" }, 
  CONFIRMED:      { label: "Đã xác nhận",    color: "bg-blue-50 text-blue-700" },
  PROCESSING:     { label: "Đang gia công",  color: "bg-amber-50 text-amber-700" },
  READY:          { label: "Chờ vận chuyển", color: "bg-purple-50 text-purple-700" },
  COMPLETED:      { label: "Hoàn thành",     color: "bg-green-50 text-green-700" },
  CANCELED:       { label: "Đã hủy",         color: "bg-red-50 text-red-700" },
};

const shippingOverride: Record<string, { label: string; color: string }> = {
  PACKING:   { label: "Đang đóng gói",  color: "bg-blue-50 text-blue-700" },
  SHIPPING:  { label: "Đang giao hàng", color: "bg-indigo-50 text-indigo-700" },
  DELIVERED: { label: "Đã giao",        color: "bg-green-50 text-green-700" },
  FAILED:    { label: "Giao thất bại",  color: "bg-red-50 text-red-700" },
  RETURNED:  { label: "Hoàn hàng",      color: "bg-orange-50 text-orange-700" },
};

const formatDate = (str: string) => {
  if (!str) return "";
  return new Date(str).toLocaleDateString("vi-VN");
};

const formatCurrency = (v: number) =>
  v?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const Profilepage: React.FC = () => {
  const isAccountPage = useMatch("/profile/account");
  const navigate = useNavigate();

  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const ordersPerPage = 10;

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { navigate("/login", { replace: true }); return; }

    const fetchOrders = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/orders/history`, {
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

  const indexOfLastOrder  = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders     = orders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages        = Math.ceil(orders.length / ordersPerPage);

  const paginate = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const navBase     = "group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition";
  const navInactive = "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900";
  const navActive   = "bg-teal-50 text-teal-700 ring-1 ring-teal-100";

  const totalOrders     = orders.length;
  const shippingOrders  = orders.filter(o => o.shippingStatus === "SHIPPING" || o.shippingStatus === "PACKING").length;
  const deliveredOrders = orders.filter(o => o.orderStatus === "COMPLETED").length;

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
                <div className="h-14 w-14 rounded-2xl bg-teal-100 flex items-center justify-center text-teal-600 font-bold">K</div>
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-900">Xin chào, Kiên 👋</div>
                  <div className="truncate text-xs text-zinc-500">Thành viên FPT University</div>
                </div>
              </div>

              <div className="my-5 h-px bg-zinc-200" />

              <nav className="space-y-2">
                <NavLink to="/profile" end className={({ isActive }) => [navBase, isActive ? navActive : navInactive].join(" ")}>
                  <span>Đơn hàng của tôi</span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 transition group-hover:bg-zinc-200">
                    {totalOrders}
                  </span>
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
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-900">Đơn hàng của tôi</h2>
                      <p className="mt-1 text-sm text-zinc-500">Trang {currentPage} trên {totalPages || 1}</p>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate("/all-product")} className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 transition">
                        Mua thêm
                      </button>
                    </div>
                  </div>

                  {/* Summary cards */}
                  <div className="grid gap-3 grid-cols-3 mb-6">
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

                  {/* Orders list */}
                  <div className="space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-200 border-t-teal-600" />
                      </div>
                    ) : error ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">{error}</div>
                    ) : orders.length === 0 ? (
                      <div className="text-center py-10 text-zinc-500">Chưa có đơn hàng nào.</div>
                    ) : (
                      <>
                        {currentOrders.map((order) => {
                          const display = shippingOverride[order.shippingStatus]
                            || orderStatusConfig[order.orderStatus]
                            || { label: order.orderStatus, color: "bg-zinc-100 text-zinc-700" };
                          return (
                            <div
                              key={order.orderId}
                              onClick={() => navigate(`/profile/orders/${order.orderId}`)}
                              className="rounded-2xl border border-zinc-200 p-4 hover:border-teal-300 transition cursor-pointer hover:shadow-sm"
                            >
                              <div className="flex justify-between items-center">
                                <div>
                                  <div className="font-bold text-zinc-900">{order.orderCode}</div>
                                  <div className="text-xs text-zinc-500">
                                    {formatDate(order.orderDate)} · {formatCurrency(order.totalAmount)}
                                  </div>
                                </div>
                                <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase ${display.color}`}>
                                  {display.label}
                                </span>
                              </div>
                            </div>
                          );
                        })}

                        {/* Pagination */}
                        {totalPages > 1 && (
                          <div className="mt-8 flex items-center justify-center gap-2">
                            <button
                              onClick={() => paginate(currentPage - 1)}
                              disabled={currentPage === 1}
                              className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 transition"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>

                            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
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

                            <button
                              onClick={() => paginate(currentPage + 1)}
                              disabled={currentPage === totalPages}
                              className="p-2 rounded-lg border border-zinc-200 hover:bg-zinc-50 disabled:opacity-30 transition"
                            >
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