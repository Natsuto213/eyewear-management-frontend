import React, { useEffect } from "react";
import { NavLink, Outlet, useMatch, useNavigate } from "react-router-dom";
import { apiLogout } from "../lib/userApi";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

type OrderStatus = "shipping" | "waiting" | "delivered";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  description: string;
  date: string;
  items: OrderItem[];
}

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  shipping: { label: "Đang vận chuyển", color: "bg-blue-50 text-blue-600" },
  waiting: { label: "Đang chờ lấy hàng", color: "bg-yellow-50 text-yellow-700" },
  delivered: { label: "Đã giao", color: "bg-green-50 text-green-700" },
};

// Demo orders (sau này bạn thay bằng API)
const orders: Order[] = [
  {
    id: "ORDER-001",
    status: "shipping",
    description: "Đang đợi đơn vị vận chuyển đến lấy hàng",
    date: "2026-02-05",
    items: [
      {
        id: "1",
        name: "Tên sản phẩm",
        price: 120000,
        image: "https://placehold.co/100x100",
      },
      {
        id: "2",
        name: "Tên sản phẩm",
        price: 150000,
        image: "https://placehold.co/101x100",
      },
    ],
  },
  {
    id: "ORDER-002",
    status: "delivered",
    description: "Đơn hàng đã được giao thành công",
    date: "2026-02-03",
    items: [
      {
        id: "3",
        name: "Tên sản phẩm",
        price: 99000,
        image: "https://placehold.co/101x100",
      },
    ],
  },
];

const Profilepage: React.FC = () => {
  const isAccountPage = useMatch("/profile/account");
  const navigate = useNavigate();

  // Guard: chưa có token thì đá về /login
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    apiLogout(); // xóa token
    navigate("/login", { replace: true });
  };

  const navBase =
    "group flex items-center justify-between rounded-xl px-3 py-2 text-sm font-medium transition";
  const navInactive = "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900";
  const navActive = "bg-teal-50 text-teal-700 ring-1 ring-teal-100";

  const totalOrders = orders.length;
  const shippingOrders = orders.filter((o) => o.status === "shipping").length;
  const deliveredOrders = orders.filter((o) => o.status === "delivered").length;

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white px-4 py-8">
        <div className="mx-auto w-full max-w-6xl">
          {/* Top bar */}
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-zinc-900">Tài khoản</h1>
              <p className="mt-1 text-sm text-zinc-500">
                Quản lý đơn hàng và thông tin cá nhân của bạn
              </p>
            </div>

            <button
              onClick={() => navigate("/", { replace: false })}
              className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm active:translate-y-0"
            >
              ← Về trang chủ
            </button>
          </div>

          <div className="grid gap-6 lg:grid-cols-[320px_1fr]">
            {/* SIDEBAR */}
            <aside className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
              {/* Avatar + info */}
              <div className="flex items-center gap-4">
                <div className="h-14 w-14 rounded-2xl bg-zinc-200" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-semibold text-zinc-900">
                    Xin chào 👋
                  </div>
                  <div className="truncate text-xs text-zinc-500">
                    Quản lý tài khoản của bạn
                  </div>
                </div>
              </div>

              <div className="my-5 h-px bg-zinc-200" />

              <nav className="space-y-2">
                <NavLink
                  to="/profile"
                  end
                  className={({ isActive }) =>
                    [navBase, isActive ? navActive : navInactive].join(" ")
                  }
                >
                  <span>Đơn hàng của tôi</span>
                  <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 transition group-hover:bg-zinc-200">
                    {totalOrders}
                  </span>
                </NavLink>

                <NavLink
                  to="/profile/account"
                  className={({ isActive }) =>
                    [navBase, isActive ? navActive : navInactive].join(" ")
                  }
                >
                  <span>Thông tin tài khoản</span>
                  <span className="text-zinc-400 group-hover:text-zinc-500">›</span>
                </NavLink>

                <a
                  onClick={async () => {
                    await apiLogout();
                    window.location.href = "/";
                  }}
                  className={[navBase, "text-zinc-600 hover:bg-red-50 hover:text-red-700"].join(" ")}
                >
                  <span>Đăng xuất</span>
                  <span className="text-zinc-400 group-hover:text-red-500">⎋</span>
                </a>
              </nav>

              {/* Tip box */}
              <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="text-sm font-semibold text-zinc-900">Gợi ý</div>
                <div className="mt-1 text-xs text-zinc-600">
                  Cập nhật thông tin tài khoản để nhận ưu đãi nhanh hơn.
                </div>
              </div>
            </aside>

            {/* CONTENT */}
            <main className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
              {/* 👉 MẶC ĐỊNH: ORDER LIST (đã gộp OrderTracking) */}
              {!isAccountPage && (
                <>
                  <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <h2 className="text-xl font-semibold text-zinc-900">
                        Đơn hàng của tôi
                      </h2>
                      <p className="mt-1 text-sm text-zinc-500">
                        Theo dõi đơn hàng và trạng thái giao hàng
                      </p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        className="rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 transition hover:-translate-y-0.5 hover:border-zinc-300 hover:bg-zinc-50 hover:shadow-sm active:translate-y-0"
                        onClick={() => navigate("/all-product")}
                      >
                        Mua thêm
                      </button>
                      <button
                        className="rounded-xl bg-teal-600 px-4 py-2 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-teal-700 hover:shadow-lg active:translate-y-0 focus:outline-none focus:ring-4 focus:ring-teal-200"
                        onClick={() => navigate("/")}
                      >
                        Khám phá ưu đãi
                      </button>
                    </div>
                  </div>

                  {/* Summary cards */}
                  <div className="grid gap-3 sm:grid-cols-3">
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-white hover:shadow-sm">
                      <div className="text-xs text-zinc-500">Tổng đơn</div>
                      <div className="mt-1 text-lg font-bold text-zinc-900">
                        {totalOrders}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-white hover:shadow-sm">
                      <div className="text-xs text-zinc-500">Đang giao</div>
                      <div className="mt-1 text-lg font-bold text-zinc-900">
                        {shippingOrders}
                      </div>
                    </div>
                    <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-white hover:shadow-sm">
                      <div className="text-xs text-zinc-500">Hoàn thành</div>
                      <div className="mt-1 text-lg font-bold text-zinc-900">
                        {deliveredOrders}
                      </div>
                    </div>
                  </div>

                  {/* Orders list */}
                  <div className="mt-6 space-y-4">
                    {orders.length === 0 ? (
                      <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-10 text-center">
                        <div className="text-sm font-semibold text-zinc-900">
                          Chưa có đơn hàng nào
                        </div>
                        <div className="text-sm text-zinc-500">
                          Khi bạn mua hàng, đơn sẽ hiển thị ở đây.
                        </div>
                        <button
                          onClick={() => navigate("/all-product")}
                          className="mt-2 rounded-2xl bg-zinc-900 px-5 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 hover:shadow-lg active:translate-y-0"
                        >
                          Xem sản phẩm
                        </button>
                      </div>
                    ) : (
                      orders.map((order) => (
                        <div
                          key={order.id}
                          className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                        >
                          {/* Header order */}
                          <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                              <div className="text-sm font-semibold text-zinc-900">
                                Mã đơn hàng: {order.id}
                              </div>
                              <div className="mt-1 text-xs text-zinc-500">
                                {order.description} • {order.date}
                              </div>
                            </div>

                            <span
                              className={[
                                "w-fit rounded-full px-3 py-1 text-xs font-semibold",
                                statusConfig[order.status].color,
                              ].join(" ")}
                            >
                              {statusConfig[order.status].label}
                            </span>
                          </div>

                          {/* Items */}
                          <div className="space-y-3">
                            {order.items.map((item) => (
                              <div
                                key={item.id}
                                className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4 transition hover:border-zinc-300 hover:bg-zinc-50"
                              >
                                <div className="flex items-center gap-4">
                                  <img
                                    src={item.image}
                                    alt={item.name}
                                    className="h-20 w-20 rounded-xl object-cover"
                                  />
                                  <div className="min-w-0">
                                    <div className="truncate font-medium text-zinc-900">
                                      {item.name}
                                    </div>
                                    <div className="mt-1 text-sm text-zinc-600">
                                      Giá:{" "}
                                      <span className="font-semibold">
                                        {item.price.toLocaleString()}₫
                                      </span>
                                    </div>
                                  </div>
                                </div>

                                <div className="text-sm font-semibold text-zinc-900">
                                  {item.price.toLocaleString()}₫
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </>
              )}

              {/* 👉 CHỈ HIỆN KHI /profile/account */}
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