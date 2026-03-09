import { useEffect, useState } from "react";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    User,
    CheckCircle,
    Package,
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

export default function OrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openPrescriptionRows, setOpenPrescriptionRows] = useState({});

    useEffect(() => {
        const fetchOrderDetail = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await api.get(`api/staff/orders/${orderId}`);
                console.log("API response:", response.data);

                setOrderData(response.data.result);
            } catch (err) {
                console.error(err);
                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Không tải được chi tiết đơn hàng"
                );
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    const formatCurrency = (amount) => {
        if (amount == null) return "0 đ";
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
        }).format(amount);
    };

    const formatDateTime = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleString("vi-VN");
    };

    const mapOrderStatus = (status) => {
        switch (status) {
            case "PENDING":
                return "Chờ xử lý";
            case "PARTIALLY_PAID":
                return "Đã thanh toán một phần";
            case "PAID":
                return "Hoàn tất thanh toán";
            case "CANCELED":
                return "Đã hủy";
            case "COMPLETED":
                return "Hoàn thành";
            default:
                return status || "";
        }
    };

    const mapOrderType = (type) => {
        switch (type) {
            case "MIX_ORDER":
                return "Đơn hàng kết hợp";
            case "DIRECT_ORDER":
                return "Đơn hàng mua trực tiếp";
            case "PRE_ORDER":
                return "Đơn hàng đặt trước";
            case "PRESCRIPTION_ORDER":
                return "Đơn hàng theo đơn kính";
            default:
                return type || "";
        }
    };

    const handleConfirmOrder = () => {
        alert("Chức năng xác nhận đơn hàng chưa được triển khai.");
        console.log("Xác nhận đơn hàng:", orderId);
        navigate("/sales/containers/orders");
    }

    const togglePrescriptionRow = (key) => {
        setOpenPrescriptionRows((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    const canConfirmOrder = ["PENDING", "PARTIALLY_PAID", "PAID"].includes(
        orderData?.orderStatus
    );

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-lg font-semibold">Đang tải chi tiết đơn hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <p>Không có dữ liệu đơn hàng</p>
            </div>
        );
    }

    const normalProducts = orderData.orderDetail || [];
    const prescriptionProducts = orderData.prescriptionOrderDetail || [];

    return (
        <div className="min-h-screen bg-gray-200">
            <header className="bg-white shadow sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Chi tiết đơn hàng
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Quản lý và xử lý đơn hàng
                            </p>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Tổng giá trị</p>
                                <p className="text-2xl font-bold text-gray-800">
                                    {formatCurrency(orderData.totalAmount)}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            {orderData.orderCode}
                                        </h2>
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {mapOrderStatus(orderData.orderStatus)}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-5">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                            Thông tin đơn hàng
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-sm font-semibold text-gray-500 w-32">
                                                    Loại đơn:
                                                </span>
                                                <span className="text-sm text-gray-800 font-medium">
                                                    {mapOrderType(orderData.orderType)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-sm font-semibold text-gray-500 w-32">
                                                    Ngày đặt:
                                                </span>
                                                <span className="text-sm text-gray-800 font-medium">
                                                    {formatDateTime(orderData.orderDate)}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                                <span className="text-sm font-semibold text-gray-500 w-32">
                                                    Tổng tiền:
                                                </span>
                                                <span className="text-lg font-bold text-gray-800">
                                                    {formatCurrency(orderData.totalAmount)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                            Khách hàng
                                        </h3>

                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                            <div>
                                                <h4 className="font-bold text-gray-800 text-lg">
                                                    {orderData.customerName}
                                                </h4>
                                                <span className="text-sm text-gray-500 font-medium">
                                                    ID đơn: #{orderData.orderId}
                                                </span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <Phone className="w-5 h-5 text-gray-400" />
                                                <span className="text-sm text-gray-800">
                                                    {orderData.customerPhone}
                                                </span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                                <span className="text-sm text-gray-800">
                                                    {orderData.customerEmail}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {normalProducts.length > 0 && (
                            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-b border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                        <Package className="w-6 h-6 text-gray-400" />
                                        Danh sách sản phẩm thường
                                    </h3>
                                </div>

                                <div className="p-6">
                                    <div className="space-y-4">
                                        {normalProducts.map((product) => (
                                            <div
                                                key={product.productId}
                                                className="flex items-center gap-6 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100"
                                            >
                                                <div className="w-24 h-24 rounded-xl overflow-hidden shadow flex-shrink-0">
                                                    <img
                                                        src={product.imageUrl}
                                                        alt={product.productName}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>

                                                <div className="flex-1">
                                                    <h4 className="font-bold text-gray-800 text-lg mb-2">
                                                        {product.productName}
                                                    </h4>
                                                    <div className="flex items-center gap-4">
                                                        <span className="inline-flex items-center px-3 py-1 rounded-xl bg-gray-100 text-gray-800 text-sm font-semibold border border-gray-200">
                                                            Số lượng: {product.quantity}
                                                        </span>
                                                        <span className="text-sm text-gray-500">
                                                            Đơn giá:{" "}
                                                            <span className="font-semibold text-gray-800">
                                                                {formatCurrency(product.unitPrice)}
                                                            </span>
                                                        </span>
                                                    </div>
                                                </div>

                                                <div className="text-right flex-shrink-0">
                                                    <p className="text-sm text-gray-500 mb-1">Tổng</p>
                                                    <p className="text-2xl font-bold text-gray-800">
                                                        {formatCurrency(product.totalPrice)}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}

                        {prescriptionProducts.length > 0 && (
                            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-b border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                        <Package className="w-6 h-6 text-gray-400" />
                                        Danh sách đơn kính
                                    </h3>
                                </div>

                                <div className="p-6 overflow-x-auto">
                                    <table className="w-full min-w-[900px]">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-left text-sm text-gray-500">
                                                <th className="py-3 pl-2 pr-3 w-28">Hình ảnh</th>
                                                <th className="py-3 px-3">Sản phẩm</th>
                                                <th className="py-3 px-3 text-right">Đơn giá</th>
                                                <th className="py-3 px-3 text-center">Số lượng</th>
                                                <th className="py-3 px-3 text-right">Thành tiền</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {prescriptionProducts.map((item, index) => {
                                                const rowKey = `${item.frameId || "frame"}-${index}`;
                                                const isOpen = !!openPrescriptionRows[rowKey];

                                                const hasFrame = item.frameId != null;
                                                const hasLens = item.lensId != null;
                                                const hasContactLens = item.contactLensId != null;
                                                const hasPaired = hasLens || hasContactLens;

                                                const hasFrameImage = !!item.frameImg;
                                                const hasLensImage = !!item.lensImg;
                                                const hasContactLensImage = !!item.contactLensImg;

                                                const availableImages = [
                                                    hasFrameImage
                                                        ? {
                                                            src: item.frameImg,
                                                            alt: item.frameName || "Frame",
                                                            type: "frame",
                                                        }
                                                        : null,
                                                    hasLensImage
                                                        ? {
                                                            src: item.lensImg,
                                                            alt: item.lensName || "Lens",
                                                            type: "lens",
                                                        }
                                                        : null,
                                                    hasContactLensImage
                                                        ? {
                                                            src: item.contactLensImg,
                                                            alt: item.contactLensName || "Contact Lens",
                                                            type: "contactLens",
                                                        }
                                                        : null,
                                                ].filter(Boolean);

                                                const imageCount = availableImages.length;

                                                // Nếu chỉ có 1 ảnh duy nhất thì dùng ảnh đó làm ảnh chính và không hiện ảnh phụ
                                                const mainImageObj =
                                                    imageCount === 1
                                                        ? availableImages[0]
                                                        : availableImages.find((img) => img.type === "frame") ||
                                                        availableImages[0] || {
                                                            src: "",
                                                            alt: "Sản phẩm",
                                                            type: "default",
                                                        };

                                                const subImages =
                                                    imageCount > 1
                                                        ? availableImages.filter(
                                                            (img) => img.src !== mainImageObj.src
                                                        )
                                                        : [];

                                                const mainName =
                                                    item.frameName ||
                                                    item.lensName ||
                                                    item.contactLensName ||
                                                    "Sản phẩm đơn kính";

                                                const mainPrice = item.framePrice ?? 0;

                                                const pairedNames = [
                                                    item.lensName,
                                                    item.contactLensName,
                                                ].filter(Boolean);

                                                const pairedNameText = pairedNames.join(" + ");

                                                const pairedPrice =
                                                    (item.lensPrice ?? 0) + (item.contactLensPrice ?? 0);

                                                const lineTotal = item.totalPrice ?? 0;

                                                // Chỉ cần field tồn tại là hiện đơn thuốc, kể cả giá trị = "0"
                                                const showPrescription =
                                                    item.leftEyeSph !== undefined ||
                                                    item.leftEyeCyl !== undefined ||
                                                    item.leftEyeAxis !== undefined ||
                                                    item.leftPD !== undefined ||
                                                    item.rightEyeSph !== undefined ||
                                                    item.rightEyeCyl !== undefined ||
                                                    item.rightEyeAxis !== undefined ||
                                                    item.rightPD !== undefined;

                                                const prescriptionRows = [
                                                    {
                                                        label: "SPH",
                                                        l: item.leftEyeSph,
                                                        r: item.rightEyeSph,
                                                    },
                                                    {
                                                        label: "CYL",
                                                        l: item.leftEyeCyl,
                                                        r: item.rightEyeCyl,
                                                    },
                                                    {
                                                        label: "AXIS",
                                                        l: item.leftEyeAxis,
                                                        r: item.rightEyeAxis,
                                                    },
                                                    {
                                                        label: "PD",
                                                        l: item.leftPD,
                                                        r: item.rightPD,
                                                    },
                                                ];

                                                return (
                                                    <tr
                                                        key={rowKey}
                                                        className="hover:bg-gray-50 transition-colors border-b border-gray-100"
                                                    >
                                                        <td className="py-4 pl-2 pr-3 align-top w-28">
                                                            <div className="flex flex-col items-center gap-1.5">
                                                                {mainImageObj.src ? (
                                                                    <img
                                                                        src={mainImageObj.src}
                                                                        alt={mainImageObj.alt}
                                                                        className="w-20 h-20 object-cover rounded-xl bg-gray-100 shadow-sm"
                                                                    />
                                                                ) : (
                                                                    <div className="w-20 h-20 rounded-xl bg-gray-100 shadow-sm flex items-center justify-center text-xs text-gray-400">
                                                                        No image
                                                                    </div>
                                                                )}

                                                                {subImages.map((img, subIndex) => {
                                                                    const badgeText =
                                                                        img.type === "lens"
                                                                            ? "Kèm"
                                                                            : img.type === "contactLens"
                                                                                ? "Lens"
                                                                                : "Kèm";

                                                                    const borderColor =
                                                                        img.type === "contactLens"
                                                                            ? "border-purple-200"
                                                                            : "border-teal-200";

                                                                    const badgeColor =
                                                                        img.type === "contactLens"
                                                                            ? "bg-purple-500"
                                                                            : "bg-teal-500";

                                                                    return (
                                                                        <div
                                                                            key={`${rowKey}-sub-${subIndex}`}
                                                                            className="relative"
                                                                        >
                                                                            <img
                                                                                src={img.src}
                                                                                alt={img.alt}
                                                                                className={`w-14 h-14 object-cover rounded-lg bg-gray-100 border-2 ${borderColor}`}
                                                                            />
                                                                            <span
                                                                                className={`absolute -top-1 -right-1 ${badgeColor} text-white text-[9px] font-bold px-1 rounded-full`}
                                                                            >
                                                                                {badgeText}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>

                                                        <td className="py-4 px-3 align-top">
                                                            <p className="font-semibold text-gray-800 text-sm">
                                                                {mainName}
                                                            </p>

                                                            {hasPaired && pairedNameText && (
                                                                <p className="text-xs text-teal-600 mt-0.5">
                                                                    <span className="text-gray-400">Kèm: </span>
                                                                    {pairedNameText}
                                                                </p>
                                                            )}

                                                            {showPrescription && (
                                                                <div className="mt-2">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => togglePrescriptionRow(rowKey)}
                                                                        className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full px-2.5 py-1 transition-colors"
                                                                    >
                                                                        📋 Đơn thuốc {isOpen ? "▲" : "▼"}
                                                                    </button>

                                                                    {isOpen && (
                                                                        <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-gray-700">
                                                                            <table className="w-full">
                                                                                <thead>
                                                                                    <tr className="text-amber-700 font-semibold text-center">
                                                                                        <th className="text-left pb-1 pr-3">
                                                                                            Thông số
                                                                                        </th>
                                                                                        <th className="pb-1 pr-2">
                                                                                            Mắt trái (L)
                                                                                        </th>
                                                                                        <th className="pb-1">
                                                                                            Mắt phải (R)
                                                                                        </th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {prescriptionRows.map(({ label, l, r }) => (
                                                                                        <tr
                                                                                            key={label}
                                                                                            className="border-t border-amber-100"
                                                                                        >
                                                                                            <td className="py-1 pr-3 text-gray-500">
                                                                                                {label}
                                                                                            </td>
                                                                                            <td className="py-1 pr-2 text-center font-medium">
                                                                                                {l ?? "—"}
                                                                                            </td>
                                                                                            <td className="py-1 text-center font-medium">
                                                                                                {r ?? "—"}
                                                                                            </td>
                                                                                        </tr>
                                                                                    ))}
                                                                                </tbody>
                                                                            </table>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            )}
                                                        </td>

                                                        <td className="py-4 px-3 align-middle text-right whitespace-nowrap">
                                                            <p className="text-sm text-gray-700 font-medium">
                                                                {formatCurrency(mainPrice)}
                                                            </p>

                                                            {hasPaired && pairedPrice > 0 && (
                                                                <p className="text-xs text-teal-600 mt-0.5">
                                                                    + {formatCurrency(pairedPrice)}
                                                                </p>
                                                            )}
                                                        </td>

                                                        <td className="py-4 px-3 align-middle text-center whitespace-nowrap">
                                                            <span className="inline-flex items-center px-3 py-1 rounded-xl bg-gray-100 text-gray-800 text-sm font-semibold border border-gray-200">
                                                                {item.quantity}
                                                            </span>
                                                        </td>

                                                        <td className="py-4 px-3 align-middle text-right whitespace-nowrap">
                                                            <span className="font-bold text-red-500 text-sm">
                                                                {formatCurrency(lineTotal)}
                                                            </span>
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        )}
                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                            <div className="flex items-center justify-between text-white">
                                <span className="text-xl font-bold">
                                    TỔNG CỘNG
                                </span>
                                <span className="text-3xl font-bold">
                                    {formatCurrency(orderData.totalAmount)}
                                </span>
                            </div>
                        </div>

                        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-gray-400" />
                                    Thông tin giao hàng
                                </h3>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-5">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                            Người nhận
                                        </h4>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <User className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Tên người nhận
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {orderData.recipientName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Số điện thoại
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {orderData.recipientPhone}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">
                                                        Email
                                                    </p>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {orderData.recipientEmail}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-5">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                            Chi tiết giao hàng
                                        </h4>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-2 font-semibold">
                                                            Địa chỉ giao hàng
                                                        </p>
                                                        <p className="text-sm text-gray-800 leading-relaxed">
                                                            {orderData.recipientAddress}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="flex items-start gap-3">
                                                    <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-2 font-semibold">
                                                            Ghi chú
                                                        </p>
                                                        <p className="text-sm text-gray-800 leading-relaxed italic">
                                                            {orderData.note || "Không có ghi chú"}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
                                    <h3 className="text-xl font-bold text-white">
                                        Thao tác xử lý
                                    </h3>
                                </div>

                                <div className="p-6 space-y-5">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <p className="text-sm text-gray-800 font-medium">
                                            Vui lòng kiểm tra thông tin đơn hàng trước khi xác nhận
                                        </p>
                                    </div>

                                    {canConfirmOrder && (
                                        <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl transition-all font-bold text-lg shadow"
                                            onClick={handleConfirmOrder}>
                                            <CheckCircle className="w-6 h-6"
                                            />
                                            Xác nhận đơn hàng
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}