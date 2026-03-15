import React, { useEffect, useState } from "react";
import { NavLink, Outlet, useMatch, useNavigate } from "react-router-dom";
import { apiLogout } from "../../lib/userApi";
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

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
  PENDING:    { label: "Chờ xác nhận",    color: "bg-yellow-50 text-yellow-700" },
  CONFIRMED:  { label: "Đã xác nhận",     color: "bg-blue-50 text-blue-700" },
  PROCESSING: { label: "Đang gia công",   color: "bg-amber-50 text-amber-700" },
  READY:      { label: "Chờ vận chuyển",  color: "bg-purple-50 text-purple-700" },
  COMPLETED:  { label: "Hoàn thành",      color: "bg-green-50 text-green-700" },
  CANCELED:   { label: "Đã hủy",          color: "bg-red-50 text-red-700" },
};

const shippingOverride: Record<string, { label: string; color: string }> = {
  PACKING:   { label: "Đang đóng gói",   color: "bg-blue-50 text-blue-700" },
  SHIPPING:  { label: "Đang giao hàng",  color: "bg-indigo-50 text-indigo-700" },
  DELIVERED: { label: "Đã giao",         color: "bg-green-50 text-green-700" },
  FAILED:    { label: "Giao thất bại",   color: "bg-red-50 text-red-700" },
  RETURNED:  { label: "Hoàn hàng",       color: "bg-orange-50 text-orange-700" },
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
        if (data.code === 1000) {
          setOrders(data.result || []);
        } else {
          setError("Không thể tải đơn hàng");
        }
      } catch {
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [navigate]);

  const navBase = "group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition";
  const navInactive = "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900";
  const navActive = "bg-teal-50 text-teal-700 ring-1 ring-teal-100";

  const totalOrders = orders.length;
  const shippingOrders = orders.filter(o =>
    o.shippingStatus === "SHIPPING" || o.shippingStatus === "PACKING"
  ).length;
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
            <aside className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-zinc-200" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-900">Xin chào 👋</div>
                  <div className="truncate text-xs text-zinc-500">Quản lý tài khoản của bạn</div>
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

              <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold text-zinc-900">Gợi ý</div>
                <div className="mt-1 text-xs text-zinc-600">Cập nhật thông tin tài khoản để nhận ưu đãi nhanh hơn.</div>
              </div>
            </aside>

            {/* CONTENT */}
            <main className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              {!isAccountPage && (
                <>
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-900">Đơn hàng của tôi</h2>
                      <p className="mt-1 text-sm text-zinc-500">Theo dõi đơn hàng và trạng thái giao hàng</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => navigate("/all-product")}
                        className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm active:translate-y-0"
                      >
                        Mua thêm
                      </button>
                      <button
                        onClick={() => navigate("/")}
                        className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg active:translate-y-0"
                      >
                        Khám phá ưu đãi
                      </button>
                    </div>
                  </div>

                  {/* Summary cards */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      { label: "Tổng đơn", value: totalOrders },
                      { label: "Đang giao", value: shippingOrders },
                      { label: "Hoàn thành", value: deliveredOrders },
                    ].map(card => (
                      <div key={card.label} className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-white hover:shadow-sm">
                        <div className="text-xs text-zinc-500">{card.label}</div>
                        <div className="mt-1 text-lg font-bold text-zinc-900">{card.value}</div>
                      </div>
                    ))}
                  </div>

                  {/* Orders list */}
                  <div className="mt-6 space-y-4">
                    {loading ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-10 w-10 border-4 border-teal-200 border-t-teal-600" />
                      </div>
                    ) : error ? (
                      <div className="rounded-2xl border border-red-200 bg-red-50 p-6 text-center text-sm text-red-600">{error}</div>
                    ) : orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-10 text-center">
                        <div className="text-sm font-semibold text-zinc-900">Chưa có đơn hàng nào</div>
                        <div className="text-sm text-zinc-500">Khi bạn mua hàng, đơn sẽ hiển thị ở đây.</div>
                        <button
                          onClick={() => navigate("/all-product")}
                          className="mt-2 rounded-2xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg active:translate-y-0"
                        >
                          Xem sản phẩm
                        </button>
                      </div>
                    ) : (
                      orders.map((order) => {
                        const display =
                          shippingOverride[order.shippingStatus] ||
                          orderStatusConfig[order.orderStatus] ||
                          { label: order.orderStatus, color: "bg-zinc-100 text-zinc-700" };

                        return (
                          <div
                            key={order.orderId}
                            onClick={() => navigate(`/profile/orders/${order.orderId}`)}
                            className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md hover:border-teal-200 cursor-pointer"
                          >
                            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                              <div>
                                <div className="text-sm font-semibold text-zinc-900">
                                  {order.orderCode}
                                </div>
                                <div className="mt-1 text-xs text-zinc-500">
                                  {formatDate(order.orderDate)} · {formatCurrency(order.totalAmount)}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <span className={`w-fit rounded-full px-3 py-1 text-xs font-semibold ${display.color}`}>
                                  {display.label}
                                </span>
                                <span className="text-xs text-zinc-400">›</span>
                              </div>
                            </div>
                          </div>
                        );
                      })
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