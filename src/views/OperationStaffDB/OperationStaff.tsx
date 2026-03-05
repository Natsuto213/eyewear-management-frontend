import React, { useMemo, useState } from "react";
import {
  Search,
  Filter,
  CalendarDays,
  Package,
  ClipboardList,
  Warehouse,
  LogOut,
} from "lucide-react";

type TabType = "gong" | "trong" | "contact";
type PageType = "order" | "inventory";

type OrderStatus =
  | "Đang chờ"
  | "Đang gia công"
  | "Đang đóng gói"
  | "Đang giao hàng"
  | "Hoàn thành";

const STATUS_STYLES: Record<OrderStatus, string> = {
  "Đang chờ": "bg-orange-50 text-orange-700 ring-orange-200",
  "Đang gia công": "bg-amber-50 text-amber-800 ring-amber-200",
  "Đang đóng gói": "bg-cyan-50 text-cyan-800 ring-cyan-200",
  "Đang giao hàng": "bg-violet-50 text-violet-800 ring-violet-200",
  "Hoàn thành": "bg-green-50 text-green-800 ring-green-200",
};

function cx(...classes: Array<string | false | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function OperationStaffPage() {
  const [page, setPage] = useState<PageType>("order");
  const [tab, setTab] = useState<TabType>("gong");

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <aside className="w-[280px] bg-white border-r border-gray-100 min-h-screen sticky top-0">
          <div className="p-5">
            {/* Profile */}
            <div className="flex items-center gap-3 rounded-2xl border border-gray-100 p-3 shadow-sm">
              <div className="w-11 h-11 rounded-full bg-gradient-to-br from-gray-200 to-gray-100 flex items-center justify-center text-xs font-semibold text-gray-600">
                AVT
              </div>
              <div className="min-w-0">
                <div className="font-semibold text-gray-900 leading-tight">
                  Trần Văn B
                </div>
                <div className="text-xs text-gray-500 truncate">
                  Nhân viên vận hành
                </div>
              </div>
            </div>

            {/* Menu */}
            <nav className="mt-6 space-y-2">
              <SidebarButton
                active={page === "order"}
                onClick={() => setPage("order")}
                icon={<ClipboardList className="w-5 h-5" />}
                label="Danh sách order"
              />
              <SidebarButton
                active={page === "inventory"}
                onClick={() => setPage("inventory")}
                icon={<Warehouse className="w-5 h-5" />}
                label="Hàng trong kho"
              />
              <SidebarButton
                active={false}
                onClick={() => {}}
                icon={<Package className="w-5 h-5" />}
                label="Phiếu nhập kho"
                disabled
              />
              <SidebarButton
                active={false}
                onClick={() => {}}
                icon={<Package className="w-5 h-5" />}
                label="Phiếu đặt hàng"
                disabled
              />
              <SidebarButton
                active={false}
                onClick={() => {}}
                icon={<Package className="w-5 h-5" />}
                label="Thống kê"
                disabled
              />
            </nav>
          </div>

          <div className="p-5 border-t border-gray-100">
            <button className="w-full rounded-2xl px-4 py-3 text-red-600 hover:bg-red-50 flex items-center justify-center gap-2 font-semibold">
              <LogOut className="w-5 h-5" />
              Đăng xuất
            </button>
          </div>
        </aside>

        {/* Main */}
        <main className="flex-1">
          <div className="p-6 md:p-8">
            {/* Top header */}
            <div className="mb-6">
              <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
                {page === "order" ? "Danh sách đơn hàng" : "Hàng trong kho"}
              </h1>
              <p className="text-gray-500 mt-1">
                Theo dõi trạng thái xử lý & tồn kho theo danh mục.
              </p>
            </div>

            {page === "order" ? <OrderList /> : <Inventory tab={tab} setTab={setTab} />}
          </div>
        </main>
      </div>
    </div>
  );
}

function SidebarButton({
  active,
  onClick,
  icon,
  label,
  disabled,
}: {
  active: boolean;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={cx(
        "w-full flex items-center gap-3 rounded-2xl px-4 py-3 text-left transition",
        disabled
          ? "text-gray-300 cursor-not-allowed"
          : "text-gray-700 hover:bg-gray-50",
        active && "bg-gray-900 text-white hover:bg-gray-900"
      )}
    >
      <span className={cx("shrink-0", active ? "text-white" : "text-gray-500")}>
        {icon}
      </span>
      <span className="font-semibold">{label}</span>
    </button>
  );
}

/* =========================
   ORDERS
========================= */

type OrderRow = {
  code: string;
  date: string;
  status: OrderStatus;
  type: "Pre-order" | "In-stock";
  total: string;
  customer: string;
};

function OrderList() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<"Tất cả" | OrderStatus>("Tất cả");
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10)); // YYYY-MM-DD

  const orders: OrderRow[] = [
    {
      code: "#000001",
      date: "2025-10-01 12:00",
      status: "Đang chờ",
      type: "Pre-order",
      total: "120,000 vnđ",
      customer: "nguyen@gmail.com",
    },
    {
      code: "#000002",
      date: "2025-10-01 13:10",
      status: "Đang gia công",
      type: "In-stock",
      total: "240,000 vnđ",
      customer: "0901xxxxxx",
    },
    {
      code: "#000003",
      date: "2025-10-02 09:20",
      status: "Đang đóng gói",
      type: "Pre-order",
      total: "180,000 vnđ",
      customer: "tran@gmail.com",
    },
    {
      code: "#000004",
      date: "2025-10-02 15:45",
      status: "Đang giao hàng",
      type: "In-stock",
      total: "320,000 vnđ",
      customer: "0987xxxxxx",
    },
    {
      code: "#000005",
      date: "2025-10-03 08:05",
      status: "Hoàn thành",
      type: "In-stock",
      total: "90,000 vnđ",
      customer: "le@gmail.com",
    },
  ];

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase();
    return orders.filter((o) => {
      const matchQ =
        !needle ||
        o.code.toLowerCase().includes(needle) ||
        o.customer.toLowerCase().includes(needle);
      const matchStatus = status === "Tất cả" ? true : o.status === status;
      // demo: nếu chọn "Hôm nay" thì lọc theo ngày (YYYY-MM-DD)
      const matchDate = !date ? true : o.date.startsWith(date);
      return matchQ && matchStatus && matchDate;
    });
  }, [q, status, date]);

  return (
    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      {/* Toolbar giống hình */}
      <div className="p-4 md:p-5 border-b border-gray-100">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div className="flex-1 flex flex-col md:flex-row gap-3">
            {/* Search */}
            <div className="relative flex-1">
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Nhập mã đơn hàng, sđt hoặc email"
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-3 pr-11 outline-none focus:bg-white focus:ring-4 focus:ring-gray-100"
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-5 h-5" />
              </div>
            </div>

            {/* Filter */}
            <div className="relative md:w-[240px]">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Filter className="w-5 h-5" />
              </div>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full appearance-none rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-10 py-3 outline-none focus:bg-white focus:ring-4 focus:ring-gray-100"
              >
                <option value="Tất cả">Lọc bằng trạng thái</option>
                <option value="Đang chờ">Đang chờ</option>
                <option value="Đang gia công">Đang gia công</option>
                <option value="Đang đóng gói">Đang đóng gói</option>
                <option value="Đang giao hàng">Đang giao hàng</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
              <div className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-gray-400">
                ▾
              </div>
            </div>

            {/* Date */}
            <div className="relative md:w-[170px]">
              <div className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <CalendarDays className="w-5 h-5" />
              </div>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-gray-200 bg-gray-50 pl-11 pr-4 py-3 outline-none focus:bg-white focus:ring-4 focus:ring-gray-100"
              />
            </div>
          </div>

          <div className="flex items-center justify-between md:justify-end gap-3">
            <div className="text-sm text-gray-500">
              {filtered.length} đơn / {orders.length}
            </div>
            <button className="rounded-2xl bg-gray-900 text-white px-4 py-3 font-semibold hover:bg-black">
              Tạo đơn
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead className="text-xs uppercase text-gray-500 bg-gray-50">
            <tr>
              <th className="px-5 py-4">Mã đơn</th>
              <th className="px-5 py-4">Ngày đặt</th>
              <th className="px-5 py-4">Khách</th>
              <th className="px-5 py-4">Trạng thái</th>
              <th className="px-5 py-4">Loại</th>
              <th className="px-5 py-4">Tổng tiền</th>
              <th className="px-5 py-4 text-right">Action</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {filtered.map((o) => (
              <tr key={o.code} className="hover:bg-gray-50/60">
                <td className="px-5 py-4 font-semibold text-gray-900">{o.code}</td>
                <td className="px-5 py-4 text-gray-600">{formatDateTime(o.date)}</td>
                <td className="px-5 py-4 text-gray-700">{o.customer}</td>
                <td className="px-5 py-4">
                  <span
                    className={cx(
                      "inline-flex items-center rounded-full px-3 py-1 text-sm font-semibold ring-1",
                      STATUS_STYLES[o.status]
                    )}
                  >
                    {o.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <span className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-sm font-semibold text-gray-700">
                    {o.type}
                  </span>
                </td>
                <td className="px-5 py-4 font-semibold text-gray-900">{o.total}</td>
                <td className="px-5 py-4">
                  <div className="flex justify-end gap-2">
                    <button className="rounded-2xl bg-sky-600 text-white px-4 py-2 font-semibold hover:bg-sky-700">
                      Gia công
                    </button>
                    <button className="rounded-2xl border border-gray-200 bg-white px-4 py-2 font-semibold text-gray-700 hover:bg-gray-50">
                      Chi tiết
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td className="px-5 py-10 text-center text-gray-500" colSpan={7}>
                  Không có đơn phù hợp bộ lọc.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  );
}

function formatDateTime(s: string) {
  // input demo: "2025-10-01 12:00"
  const [d, t] = s.split(" ");
  const [yyyy, mm, dd] = d.split("-");
  return `${dd}/${mm}/${yyyy} ${t}`;
}

/* =========================
   INVENTORY
========================= */

function Inventory({
  tab,
  setTab,
}: {
  tab: TabType;
  setTab: (t: TabType) => void;
}) {
  return (
    <section className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="p-4 md:p-5 border-b border-gray-100 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex gap-2 md:gap-3">
          <TabButton active={tab === "gong"} onClick={() => setTab("gong")} label="Gọng kính" />
          <TabButton active={tab === "trong"} onClick={() => setTab("trong")} label="Tròng kính" />
          <TabButton
            active={tab === "contact"}
            onClick={() => setTab("contact")}
            label="Kính áp tròng"
          />
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-2xl border border-gray-200 bg-white px-4 py-3 font-semibold text-gray-700 hover:bg-gray-50">
            Nhập kho
          </button>
          <button className="rounded-2xl bg-gray-900 text-white px-4 py-3 font-semibold hover:bg-black">
            Thêm sản phẩm
          </button>
        </div>
      </div>

      <div className="p-4 md:p-5 overflow-x-auto">
        {tab === "gong" && <FrameTable />}
        {tab === "trong" && <LensTable />}
        {tab === "contact" && <ContactLensTable />}
      </div>
    </section>
  );
}

function TabButton({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      onClick={onClick}
      className={cx(
        "px-4 md:px-6 py-2.5 rounded-2xl font-semibold transition",
        active ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
      )}
    >
      {label}
    </button>
  );
}

function TableShell({
  columns,
  children,
}: {
  columns: string[];
  children: React.ReactNode;
}) {
  return (
    <table className="w-full text-left">
      <thead className="text-xs uppercase text-gray-500 bg-gray-50">
        <tr>
          {columns.map((c) => (
            <th key={c} className="px-4 py-4">
              {c}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-100">{children}</tbody>
    </table>
  );
}

function FrameTable() {
  return (
    <TableShell
      columns={[
        "Tên sản phẩm",
        "Mã hàng",
        "Thương hiệu",
        "Chất liệu",
        "Kiểu dáng",
        "Màu sắc",
        "Số lượng",
      ]}
    >
      <tr className="hover:bg-gray-50/60">
        <td className="px-4 py-4 font-semibold text-gray-900">Gọng A</td>
        <td className="px-4 py-4 text-gray-700">GK001</td>
        <td className="px-4 py-4 text-gray-700">Rayban</td>
        <td className="px-4 py-4 text-gray-700">Nhựa</td>
        <td className="px-4 py-4 text-gray-700">Vuông</td>
        <td className="px-4 py-4 text-gray-700">Đen</td>
        <td className="px-4 py-4">
          <span className="inline-flex rounded-full bg-gray-900 text-white px-3 py-1 text-sm font-semibold">
            10
          </span>
        </td>
      </tr>
    </TableShell>
  );
}

function LensTable() {
  return (
    <TableShell
      columns={[
        "Tên sản phẩm",
        "Mã hàng",
        "Thương hiệu",
        "Tính năng",
        "Chiết suất",
        "Loại",
        "Số lượng",
      ]}
    >
      <tr className="hover:bg-gray-50/60">
        <td className="px-4 py-4 font-semibold text-gray-900">Tròng A</td>
        <td className="px-4 py-4 text-gray-700">TK001</td>
        <td className="px-4 py-4 text-gray-700">Essilor</td>
        <td className="px-4 py-4 text-gray-700">Chống UV</td>
        <td className="px-4 py-4 text-gray-700">1.56</td>
        <td className="px-4 py-4 text-gray-700">Cận</td>
        <td className="px-4 py-4">
          <span className="inline-flex rounded-full bg-gray-900 text-white px-3 py-1 text-sm font-semibold">
            20
          </span>
        </td>
      </tr>
    </TableShell>
  );
}

function ContactLensTable() {
  return (
    <TableShell
      columns={[
        "Tên sản phẩm",
        "Mã hàng",
        "Thương hiệu",
        "Độ ẩm",
        "Độ cong",
        "Chất liệu",
        "Hạn sử dụng",
        "Số lượng",
      ]}
    >
      <tr className="hover:bg-gray-50/60">
        <td className="px-4 py-4 font-semibold text-gray-900">Lens A</td>
        <td className="px-4 py-4 text-gray-700">CL001</td>
        <td className="px-4 py-4 text-gray-700">Acuvue</td>
        <td className="px-4 py-4 text-gray-700">58%</td>
        <td className="px-4 py-4 text-gray-700">8.6</td>
        <td className="px-4 py-4 text-gray-700">Silicone</td>
        <td className="px-4 py-4 text-gray-700">12/2026</td>
        <td className="px-4 py-4">
          <span className="inline-flex rounded-full bg-gray-900 text-white px-3 py-1 text-sm font-semibold">
            15
          </span>
        </td>
      </tr>
    </TableShell>
  );
}
