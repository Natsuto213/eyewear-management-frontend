import React, { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

type PaymentMethod = "bank" | "cod" | "deposit"; // Thêm deposit vào PaymentMethod

export default function ConfirmPage() {
    const navigate = useNavigate();

    // Demo data (bạn có thể thay bằng dữ liệu từ cart/store)
    const items = useMemo(
        () => [
            { id: "1", name: "Tên sản phẩm", price: 129, qty: 1 }, // Sửa "Cọc khăn" thành "Tên sản phẩm"
            { id: "2", name: "Tên sản phẩm", price: 89, qty: 2 },
        ],
        []
    );

    const [payment, setPayment] = useState<PaymentMethod>("cod");
    const [discountCode, setDiscountCode] = useState<string>("");
    const [discountValue, setDiscountValue] = useState<number>(0);

    const [form, setForm] = useState({
        fullName: "",
        phone: "",
        email: "",
        address: "",
        province: "",
        district: "",
        ward: "",
        note: "",
    });

    const subtotal = items.reduce((s, it) => s + it.price * it.qty, 0);
    const shippingFee = subtotal >= 200 ? 0 : 15;
    const total = Math.max(0, subtotal - discountValue) + shippingFee;

    const applyDiscount = () => {
        const code = discountCode.trim().toUpperCase();
        if (code === "SAVE10") setDiscountValue(10);
        else if (code === "SAVE20") setDiscountValue(20);
        else setDiscountValue(0);
    };

    const handlePay = async () => {
        try {
            // 👉 Chuyển khoản PayOS
            if (payment === "bank") {
                const res = await api.post("/payos/create-payment", {
                    amount: Math.round(total * 1000), // PayOS dùng VND
                    description: "Thanh toán đơn hàng",
                });

                navigate("/payment-qr", {
                    state: res.data,
                });
                return;
            }

            // 👉 COD / Deposit
            navigate("/success");
        } catch (err) {
            console.error(err);
            alert("Không thể tạo thanh toán PayOS");
        }
    };

    const inputBase =
        "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition " +
        "placeholder:text-zinc-400 focus:border-red-500 focus:ring-4 focus:ring-red-100 " +
        "hover:border-zinc-300";

    return (
        <div className="min-h-screen bg-zinc-50">
            {/* Header */}
            <div className="sticky top-0 z-10 border-b border-zinc-200 bg-white/80 backdrop-blur">
                <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3">
                    <div className="flex items-center gap-3">
                        <Link
                            to="/"
                            className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                        >
                            ← Về trang chủ
                        </Link>
                        <div className="h-5 w-px bg-zinc-200" />
                        <div className="text-sm text-zinc-500">Xác nhận đơn hàng</div>
                    </div>

                    <Link
                        to="/all-product"
                        className="rounded-lg px-3 py-2 text-sm font-medium text-zinc-700 transition hover:bg-zinc-100 hover:text-zinc-900"
                    >
                        Tiếp tục mua sắm
                    </Link>
                </div>
            </div>

            {/* Content */}
            <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[1.2fr_0.8fr]">
                {/* Left: Shipping + Payment */}
                <div className="space-y-6">
                    {/* Shipping info */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h1 className="text-xl font-semibold text-zinc-900">
                                Thông tin giao hàng
                            </h1>
                            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                                Bước 2/3
                            </span>
                        </div>

                        <div className="grid gap-4 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Họ và tên
                                </label>
                                <input
                                    className={inputBase}
                                    value={form.fullName}
                                    onChange={(e) => setForm({ ...form, fullName: e.target.value })}
                                    placeholder="Nguyễn Văn A"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Số điện thoại
                                </label>
                                <input
                                    className={inputBase}
                                    value={form.phone}
                                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                                    placeholder="090xxxxxxx"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Email
                                </label>
                                <input
                                    className={inputBase}
                                    value={form.email}
                                    onChange={(e) => setForm({ ...form, email: e.target.value })}
                                    placeholder="email@domain.com"
                                />
                            </div>

                            <div className="sm:col-span-2">
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Địa chỉ chi tiết
                                </label>
                                <input
                                    className={inputBase}
                                    value={form.address}
                                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                                    placeholder="Số nhà, tên đường..."
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Tỉnh/Thành phố
                                </label>
                                <input
                                    className={inputBase}
                                    value={form.province}
                                    onChange={(e) => setForm({ ...form, province: e.target.value })}
                                    placeholder="Hồ Chí Minh"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Quận/Huyện
                                </label>
                                <input
                                    className={inputBase}
                                    value={form.district}
                                    onChange={(e) => setForm({ ...form, district: e.target.value })}
                                    placeholder="Quận 1"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Phường/Xã
                                </label>
                                <input
                                    className={inputBase}
                                    value={form.ward}
                                    onChange={(e) => setForm({ ...form, ward: e.target.value })}
                                    placeholder="Phường Bến Nghé"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-zinc-700">
                                    Ghi chú
                                </label>
                                <input
                                    className={inputBase}
                                    value={form.note}
                                    onChange={(e) => setForm({ ...form, note: e.target.value })}
                                    placeholder="Giao giờ hành chính..."
                                />
                            </div>
                        </div>
                    </div>

                    {/* Payment method */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                        <h2 className="mb-4 text-xl font-semibold text-zinc-900">
                            Hình thức thanh toán
                        </h2>

                        <div className="grid gap-3 sm:grid-cols-2">
                            <button
                                type="button"
                                onClick={() => setPayment("bank")}
                                className={[
                                    "group rounded-2xl border p-4 text-left transition",
                                    "hover:-translate-y-0.5 hover:shadow-md",
                                    payment === "bank"
                                        ? "border-red-500 bg-red-50 shadow-sm"
                                        : "border-zinc-200 bg-white hover:border-zinc-300",
                                ].join(" ")}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-semibold text-zinc-900">Chuyển khoản</div>
                                        <div className="mt-1 text-sm text-zinc-600">
                                            Thanh toán qua ngân hàng/QR
                                        </div>
                                    </div>
                                    <div
                                        className={[
                                            "mt-1 h-4 w-4 rounded-full border transition",
                                            payment === "bank"
                                                ? "border-red-500 bg-red-500"
                                                : "border-zinc-300 bg-white group-hover:border-zinc-400",
                                        ].join(" ")}
                                    />
                                </div>
                            </button>

                            <button
                                type="button"
                                onClick={() => setPayment("cod")}
                                className={[
                                    "group rounded-2xl border p-4 text-left transition",
                                    "hover:-translate-y-0.5 hover:shadow-md",
                                    payment === "cod"
                                        ? "border-red-500 bg-red-50 shadow-sm"
                                        : "border-zinc-200 bg-white hover:border-zinc-300",
                                ].join(" ")}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-semibold text-zinc-900">COD</div>
                                        <div className="mt-1 text-sm text-zinc-600">
                                            Thanh toán khi nhận hàng
                                        </div>
                                    </div>
                                    <div
                                        className={[
                                            "mt-1 h-4 w-4 rounded-full border transition",
                                            payment === "cod"
                                                ? "border-red-500 bg-red-500"
                                                : "border-zinc-300 bg-white group-hover:border-zinc-400",
                                        ].join(" ")}
                                    />
                                </div>
                            </button>

                            {/* Nút Đặt cọc */}
                            <button
                                type="button"
                                onClick={() => setPayment("deposit")}
                                className={[
                                    "group rounded-2xl border p-4 text-left transition",
                                    "hover:-translate-y-0.5 hover:shadow-md",
                                    payment === "deposit"
                                        ? "border-blue-500 bg-blue-50 shadow-sm"
                                        : "border-zinc-200 bg-white hover:border-zinc-300",
                                ].join(" ")}
                            >
                                <div className="flex items-start justify-between gap-3">
                                    <div>
                                        <div className="font-semibold text-zinc-900">Đặt cọc</div>
                                        <div className="mt-1 text-sm text-zinc-600">
                                            Đặt cọc để giữ chỗ
                                        </div>
                                    </div>
                                    <div
                                        className={[
                                            "mt-1 h-4 w-4 rounded-full border transition",
                                            payment === "deposit"
                                                ? "border-blue-500 bg-blue-500"
                                                : "border-zinc-300 bg-white group-hover:border-zinc-400",
                                        ].join(" ")}
                                    />
                                </div>
                            </button>
                        </div>

                        {/* Hiển thị thông tin chi tiết cho Chuyển khoản ngân hàng */}
                        {payment === "bank" && (
                            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                                <div className="text-sm font-semibold text-zinc-900">
                                    Thông tin chuyển khoản (demo)
                                </div>
                                <div className="mt-2 text-sm text-zinc-700">
                                    Ngân hàng: <span className="font-medium">ABC Bank</span>
                                    <br />
                                    Số tài khoản: <span className="font-medium">0123 456 789</span>
                                    <br />
                                    Nội dung: <span className="font-medium">CONFIRM-ORDER</span>
                                </div>
                            </div>
                        )}

                        {/* Hiển thị thông tin chi tiết cho COD */}
                        {payment === "cod" && (
                            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                                <div className="text-sm font-semibold text-zinc-900">
                                    Thông tin COD
                                </div>
                                <div className="mt-2 text-sm text-zinc-700">
                                    Bạn sẽ thanh toán khi nhận hàng. Vui lòng chuẩn bị tiền mặt khi giao hàng đến địa chỉ của bạn.
                                </div>
                            </div>
                        )}

                        {/* Hiển thị thông tin đặt cọc khi người dùng chọn Đặt cọc */}
                        {payment === "deposit" && (
                            <div className="mt-4 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                                <div className="text-sm font-semibold text-zinc-900">
                                    Thông tin đặt cọc (demo)
                                </div>
                                <div className="mt-2 text-sm text-zinc-700">
                                    Số tiền đặt cọc: <span className="font-medium">500,000 VND</span>
                                    <br />
                                    Nội dung: <span className="font-medium">DEPOSIT-ORDER</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Right: Order summary */}
                <div className="space-y-6">
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-xl font-semibold text-zinc-900">Giỏ hàng</h2>
                            <span className="rounded-full bg-zinc-100 px-3 py-1 text-xs font-medium text-zinc-600">
                                {items.reduce((s, it) => s + it.qty, 0)} sp
                            </span>
                        </div>

                        <div className="space-y-3">
                            {items.map((it) => (
                                <div
                                    key={it.id}
                                    className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4 transition hover:border-zinc-300 hover:shadow-sm"
                                >
                                    <div className="min-w-0">
                                        <div className="truncate font-semibold text-zinc-900">
                                            {it.name}
                                        </div>
                                        <div className="mt-1 text-sm text-zinc-600">
                                            ${it.price} × {it.qty}
                                        </div>
                                    </div>
                                    <div className="ml-4 text-sm font-semibold text-zinc-900">
                                        ${(it.price * it.qty).toFixed(2)}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Discount */}
                        <div className="mt-5 rounded-2xl border border-zinc-200 bg-zinc-50 p-4">
                            <div className="mb-2 text-sm font-semibold text-zinc-900">
                                Mã giảm giá
                            </div>
                            <div className="flex gap-2">
                                <input
                                    className={[inputBase, "bg-white", "py-2.5"].join(" ")}
                                    value={discountCode}
                                    onChange={(e) => setDiscountCode(e.target.value)}
                                    placeholder="VD: SAVE10"
                                />
                                <button
                                    type="button"
                                    onClick={applyDiscount}
                                    className="rounded-xl bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-zinc-800 active:translate-y-0"
                                >
                                    Áp dụng
                                </button>
                            </div>
                            <div className="mt-2 text-xs text-zinc-500">
                                Demo: <span className="font-medium">SAVE10</span>,{" "}
                                <span className="font-medium">SAVE20</span>
                            </div>
                        </div>

                        {/* Totals */}
                        <div className="mt-5 space-y-2 text-sm">
                            <div className="flex items-center justify-between text-zinc-700">
                                <span>Tạm tính</span>
                                <span className="font-medium">${subtotal.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-700">
                                <span>Giảm giá</span>
                                <span className="font-medium">-${discountValue.toFixed(2)}</span>
                            </div>
                            <div className="flex items-center justify-between text-zinc-700">
                                <span>Phí giao hàng</span>
                                <span className="font-medium">
                                    {shippingFee === 0 ? "Miễn phí" : `$${shippingFee.toFixed(2)}`}
                                </span>
                            </div>

                            <div className="my-3 h-px bg-zinc-200" />

                            <div className="flex items-center justify-between">
                                <span className="text-base font-semibold text-zinc-900">Tổng</span>
                                <span className="text-lg font-extrabold text-zinc-900">
                                    ${total.toFixed(2)}
                                </span>
                            </div>
                        </div>

                        {/* CTA */}
                        <button
                            type="button"
                            onClick={handlePay}
                            className={[
                                "mt-5 w-full rounded-2xl bg-red-600 px-5 py-3.5",
                                "text-sm font-semibold text-white transition",
                                "hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg",
                                "active:translate-y-0 active:shadow-md",
                                "focus:outline-none focus:ring-4 focus:ring-red-200",
                            ].join(" ")}
                        >
                            Thanh toán ngay
                        </button>

                        <div className="mt-3 text-center text-xs text-zinc-500">
                            Bằng việc thanh toán, bạn đồng ý với{" "}
                            <Link
                                to="/"
                                className="font-medium text-zinc-700 underline-offset-2 hover:underline"
                            >
                                điều khoản
                            </Link>
                            .
                        </div>
                    </div>

                    {/* Note card */}
                    <div className="rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm">
                        <div className="text-sm font-semibold text-zinc-900">Gợi ý</div>
                        <div className="mt-2 text-sm text-zinc-600">
                            Mẹo: đơn từ <span className="font-semibold text-zinc-800">$200</span>{" "}
                            được miễn phí ship.
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};