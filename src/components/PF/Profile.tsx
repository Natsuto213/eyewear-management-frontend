import React, { useEffect } from "react";
import { NavLink, Outlet, useMatch, useNavigate } from "react-router-dom";
import { apiLogout } from "../../app/userApi";

const Profile: React.FC = () => {
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
  const navInactive =
    "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900";
  const navActive =
    "bg-teal-50 text-teal-700 ring-1 ring-teal-100";

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white px-4 py-8">
      <div className="mx-auto w-full max-w-6xl">
        {/* Top bar */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-zinc-900">
              Tài khoản
            </h1>
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
                  [
                    navBase,
                    isActive ? navActive : navInactive,
                  ].join(" ")
                }
              >
                <span>Đơn hàng của tôi</span>
                <span className="rounded-full bg-zinc-100 px-2 py-0.5 text-xs text-zinc-600 transition group-hover:bg-zinc-200">
                  0
                </span>
              </NavLink>

              <NavLink
                to="/profile/account"
                className={({ isActive }) =>
                  [
                    navBase,
                    isActive ? navActive : navInactive,
                  ].join(" ")
                }
              >
                <span>Thông tin tài khoản</span>
                <span className="text-zinc-400 group-hover:text-zinc-500">›</span>
              </NavLink>

              <a
                href="/login"
                onClick={handleLogout}
                className={[
                  navBase,
                  "text-zinc-600 hover:bg-red-50 hover:text-red-700",
                ].join(" ")}
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
            {/* 👉 MẶC ĐỊNH: ORDER LIST */}
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
                    <div className="mt-1 text-lg font-bold text-zinc-900">0</div>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-white hover:shadow-sm">
                    <div className="text-xs text-zinc-500">Đang giao</div>
                    <div className="mt-1 text-lg font-bold text-zinc-900">0</div>
                  </div>
                  <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-4 transition hover:border-zinc-300 hover:bg-white hover:shadow-sm">
                    <div className="text-xs text-zinc-500">Hoàn thành</div>
                    <div className="mt-1 text-lg font-bold text-zinc-900">0</div>
                  </div>
                </div>

                {/* Table header */}
                <div className="mt-6 overflow-hidden rounded-2xl border border-zinc-200">
                  <div className="grid grid-cols-12 bg-zinc-50 px-4 py-3 text-xs font-semibold text-zinc-700">
                    <div className="col-span-5">Mã đơn hàng</div>
                    <div className="col-span-3">Ngày</div>
                    <div className="col-span-2 text-center">Số lượng</div>
                    <div className="col-span-2 text-right">Trạng thái</div>
                  </div>

                  {/* Empty state */}
                  <div className="flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
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
                </div>
              </>
            )}

            {/* 👉 CHỈ HIỆN KHI /profile/account */}
            {isAccountPage && <Outlet />}
          </main>
        </div>
      </div>
    </div>
  );
};

export default Profile;
