import { useEffect, useState } from "react";
import {
    Phone,
    Mail,
    MapPin,
    Clock,
    User,
    Package,
    CheckCircle,
    Truck,
    RotateCcw,
    Image as ImageIcon,
    ClipboardList,
    CreditCard,
    BadgeInfo,
} from "lucide-react";

export default function ReturnOrderDetail() {
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openPrescriptionRows, setOpenPrescriptionRows] = useState({});

    useEffect(() => {
        const controller = new AbortController();

        const fetchReturnOrderDetail = async () => {
            try {
                setLoading(true);
                setError("");

                const response = await fetch(
                    "https://69a3030cbe843d692bd2bd7d.mockapi.io/data-orders/1",
                    {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        signal: controller.signal,
                    }
                );

                if (!response.ok) {
                    throw new Error("Không tải được chi tiết đơn trả hàng");
                }

                const data = await response.json();
                console.log("Return Order Detail:", data);
                setOrderData(data);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError(err?.message || "Không tải được chi tiết đơn trả hàng");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchReturnOrderDetail();

        return () => controller.abort();
    }, []);

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
            case "CONFIRMED":
                return "Đã xác nhận";
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

    const mapShippingStatus = (status) => {
        switch (status) {
            case "PENDING":
                return "Chờ giao";
            case "PROCESSING":
                return "Đang xử lý giao hàng";
            case "SHIPPING":
                return "Đang giao";
            case "DELIVERED":
                return "Đã giao hàng";
            case "FAILED":
                return "Giao thất bại";
            case "RETURNED":
                return "Đã hoàn hàng";
            case "CANCELED":
                return "Đã hủy giao hàng";
            default:
                return status || "";
        }
    };

    const mapReturnExchangeStatus = (status) => {
        switch (status) {
            case "RETURN":
                return "Yêu cầu trả hàng";
            case "EXCHANGE":
                return "Yêu cầu đổi hàng";
            case "PENDING":
                return "Chờ xử lý";
            case "APPROVED":
                return "Đã duyệt";
            case "REJECTED":
                return "Từ chối";
            case "COMPLETED":
                return "Hoàn tất";
            default:
                return status || "";
        }
    };

    const mapActionLabel = (action) => {
        switch (action) {
            case "APPROVE_RETURN":
                return "Duyệt trả hàng";
            case "REJECT_RETURN":
                return "Từ chối trả hàng";
            case "APPROVE_EXCHANGE":
                return "Duyệt đổi hàng";
            case "REJECT_EXCHANGE":
                return "Từ chối đổi hàng";
            case "CONFIRM_RECEIVED_RETURN":
                return "Xác nhận đã nhận hàng hoàn";
            case "CONFIRM_REFUND":
                return "Xác nhận hoàn tiền";
            case "CONFIRM_EXCHANGE_SHIPMENT":
                return "Xác nhận gửi hàng đổi";
            default:
                return action?.replaceAll("_", " ") || "";
        }
    };

    const togglePrescriptionRow = (key) => {
        setOpenPrescriptionRows((prev) => ({
            ...prev,
            [key]: !prev[key],
        }));
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-200">
                <p className="text-lg font-semibold">Đang tải chi tiết yêu cầu trả hàng...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-200">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        );
    }

    if (!orderData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-200">
                <p>Không có dữ liệu đơn trả hàng</p>
            </div>
        );
    }

    const normalProducts = orderData.orderDetail || [];
    const prescriptionProducts = orderData.prescriptionOrderDetail || [];
    const availableActions = orderData.availableActions || [];

    return (
        <div className="min-h-screen bg-gray-200">
            <header className="bg-white shadow sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Chi tiết trả hàng / đổi hàng
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Quản lý và xử lý yêu cầu hậu mãi
                            </p>
                        </div>

                        <div className="text-right">
                            <p className="text-sm text-gray-500">Tổng giá trị đơn hàng</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {formatCurrency(orderData.totalAmount)}
                            </p>
                        </div>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                                <div className="flex items-center justify-between flex-wrap gap-4">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">
                                            {orderData.orderCode}
                                        </h2>
                                        <div className="flex flex-wrap gap-3">
                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                                                <Clock className="w-4 h-4 mr-2" />
                                                {mapOrderStatus(orderData.orderStatus)}
                                            </span>

                                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                                                <Truck className="w-4 h-4 mr-2" />
                                                {mapShippingStatus(orderData.shippingStatus)}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="text-right text-white">
                                        <p className="text-sm opacity-90">Mã trả hàng</p>
                                        <p className="text-xl font-bold">{orderData.returnCode}</p>
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

                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-sm font-semibold text-gray-500 w-32">
                                                    Trạng thái GH:
                                                </span>
                                                <span className="text-sm text-gray-800 font-medium">
                                                    {mapShippingStatus(orderData.shippingStatus)}
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

                        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                    <RotateCcw className="w-6 h-6 text-gray-400" />
                                    Thông tin yêu cầu trả hàng / đổi hàng
                                </h3>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="text-sm font-semibold text-gray-500 w-40">
                                                Mã yêu cầu:
                                            </span>
                                            <span className="text-sm text-gray-800 font-medium">
                                                {orderData.returnCode}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="text-sm font-semibold text-gray-500 w-40">
                                                ReturnExchange ID:
                                            </span>
                                            <span className="text-sm text-gray-800 font-medium">
                                                {orderData.returnExchangeId}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="text-sm font-semibold text-gray-500 w-40">
                                                Ngày yêu cầu:
                                            </span>
                                            <span className="text-sm text-gray-800 font-medium">
                                                {formatDateTime(orderData.requestDate)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                                            <span className="text-sm font-semibold text-gray-500 w-40">
                                                Trạng thái yêu cầu:
                                            </span>
                                            <span className="text-sm font-bold text-red-600">
                                                {mapReturnExchangeStatus(orderData.returnExchangeStatus)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="text-sm font-semibold text-gray-500 w-40">
                                                Có đơn kính:
                                            </span>
                                            <span
                                                className={`text-sm font-semibold ${orderData.hasPrescriptionItem
                                                    ? "text-teal-600"
                                                    : "text-gray-600"
                                                    }`}
                                            >
                                                {orderData.hasPrescriptionItem ? "Có" : "Không"}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                            <span className="text-sm font-semibold text-gray-500 w-40">
                                                Cần thanh toán thêm:
                                            </span>
                                            <span
                                                className={`text-sm font-semibold ${orderData.requiresFinalPayment
                                                    ? "text-amber-600"
                                                    : "text-green-600"
                                                    }`}
                                            >
                                                {orderData.requiresFinalPayment ? "Có" : "Không"}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <ClipboardList className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-2 font-semibold">
                                                        Lý do trả hàng / đổi hàng
                                                    </p>
                                                    <p className="text-sm text-gray-800 leading-relaxed">
                                                        {orderData.returnReason || "Không có lý do"}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <ImageIcon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div className="w-full">
                                                    <p className="text-xs text-gray-500 mb-3 font-semibold">
                                                        Ảnh minh chứng
                                                    </p>

                                                    {orderData.returnImgUrl ? (
                                                        <img
                                                            src={orderData.returnImgUrl}
                                                            alt="Ảnh minh chứng trả hàng"
                                                            className="w-full h-64 object-cover rounded-xl border border-gray-200 shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-40 rounded-xl border border-dashed border-gray-300 bg-white flex items-center justify-center text-sm text-gray-400">
                                                            Không có ảnh minh chứng
                                                        </div>
                                                    )}
                                                </div>
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
                                <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                                        <Package className="w-5 h-5 text-gray-400" />
                                        Danh sách đơn kính
                                    </h3>
                                </div>

                                <div className="p-4">
                                    <table className="w-full table-fixed">
                                        <thead>
                                            <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                                                <th className="py-2 pr-2 w-20">Hình ảnh</th>
                                                <th className="py-2 px-2">Sản phẩm</th>
                                                <th className="py-2 px-2 w-28 text-right">Đơn giá</th>
                                                <th className="py-2 px-2 w-20 text-center">SL</th>
                                                <th className="py-2 pl-2 w-28 text-right">Thành tiền</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {prescriptionProducts.map((item, index) => {
                                                const rowKey = `${item.frameId || "frame"}-${index}`;
                                                const isOpen = !!openPrescriptionRows[rowKey];

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
                                                        className="border-b border-gray-100 align-top"
                                                    >
                                                        <td className="py-3 pr-2">
                                                            <div className="flex flex-col items-center gap-1">
                                                                {mainImageObj.src ? (
                                                                    <img
                                                                        src={mainImageObj.src}
                                                                        alt={mainImageObj.alt}
                                                                        className="w-14 h-14 object-cover rounded-lg bg-gray-100 shadow-sm"
                                                                    />
                                                                ) : (
                                                                    <div className="w-14 h-14 rounded-lg bg-gray-100 shadow-sm flex items-center justify-center text-[10px] text-gray-400">
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
                                                                                className={`w-10 h-10 object-cover rounded-md bg-gray-100 border ${borderColor}`}
                                                                            />
                                                                            <span
                                                                                className={`absolute -top-1 -right-1 ${badgeColor} text-white text-[8px] font-bold px-1 rounded-full`}
                                                                            >
                                                                                {badgeText}
                                                                            </span>
                                                                        </div>
                                                                    );
                                                                })}
                                                            </div>
                                                        </td>

                                                        <td className="py-3 px-2">
                                                            <p className="font-semibold text-gray-800 text-sm leading-snug break-words">
                                                                {mainName}
                                                            </p>

                                                            {hasPaired && pairedNameText && (
                                                                <p className="text-[11px] text-teal-600 mt-0.5 leading-snug break-words">
                                                                    <span className="text-gray-400">Kèm: </span>
                                                                    {pairedNameText}
                                                                </p>
                                                            )}

                                                            {showPrescription && (
                                                                <div className="mt-1.5">
                                                                    <button
                                                                        type="button"
                                                                        onClick={() => togglePrescriptionRow(rowKey)}
                                                                        className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5 transition-colors"
                                                                    >
                                                                        📋 Đơn thuốc {isOpen ? "▲" : "▼"}
                                                                    </button>

                                                                    {isOpen && (
                                                                        <div className="mt-1.5 p-2 bg-amber-50 border border-amber-100 rounded-lg text-[11px] text-gray-700">
                                                                            <table className="w-full">
                                                                                <thead>
                                                                                    <tr className="text-amber-700 font-semibold text-center">
                                                                                        <th className="text-left pb-1 pr-2">TS</th>
                                                                                        <th className="pb-1 pr-1">Trái</th>
                                                                                        <th className="pb-1">Phải</th>
                                                                                    </tr>
                                                                                </thead>
                                                                                <tbody>
                                                                                    {prescriptionRows.map(({ label, l, r }) => (
                                                                                        <tr
                                                                                            key={label}
                                                                                            className="border-t border-amber-100"
                                                                                        >
                                                                                            <td className="py-0.5 pr-2 text-gray-500">
                                                                                                {label}
                                                                                            </td>
                                                                                            <td className="py-0.5 pr-1 text-center font-medium">
                                                                                                {l ?? "—"}
                                                                                            </td>
                                                                                            <td className="py-0.5 text-center font-medium">
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

                                                        <td className="py-3 px-2 align-middle text-right whitespace-nowrap">
                                                            <p className="text-sm text-gray-700 font-medium">
                                                                {formatCurrency(mainPrice)}
                                                            </p>

                                                            {hasPaired && pairedPrice > 0 && (
                                                                <p className="text-[11px] text-teal-600 mt-0.5">
                                                                    + {formatCurrency(pairedPrice)}
                                                                </p>
                                                            )}
                                                        </td>

                                                        <td className="py-3 px-2 align-middle text-center whitespace-nowrap">
                                                            <span className="inline-flex items-center justify-center min-w-8 px-2 py-0.5 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200">
                                                                {item.quantity}
                                                            </span>
                                                        </td>

                                                        <td className="py-3 pl-2 align-middle text-right whitespace-nowrap">
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
                                <span className="text-xl font-bold">TỔNG CỘNG</span>
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
                                                    <p className="text-xs text-gray-500 mb-1">Tên người nhận</p>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {orderData.recipientName}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                                                    <p className="text-sm font-semibold text-gray-800">
                                                        {orderData.recipientPhone}
                                                    </p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Email</p>
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
                                                    <Truck className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-2 font-semibold">
                                                            Trạng thái giao hàng
                                                        </p>
                                                        <p className="text-sm font-semibold text-gray-800">
                                                            {mapShippingStatus(orderData.shippingStatus)}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="flex items-start gap-3">
                                                    <BadgeInfo className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-2 font-semibold">
                                                            Ghi chú
                                                        </p>
                                                        <p className="text-sm text-gray-800 leading-relaxed italic">
                                                            Không có ghi chú
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
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
                                    <h3 className="text-xl font-bold text-white">Tóm tắt xử lý</h3>
                                </div>

                                <div className="p-6 space-y-5">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Trạng thái đơn hàng</p>
                                        <p className="text-sm font-bold text-gray-800">
                                            {mapOrderStatus(orderData.orderStatus)}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Trạng thái trả hàng</p>
                                        <p className="text-sm font-bold text-red-600">
                                            {mapReturnExchangeStatus(orderData.returnExchangeStatus)}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <p className="text-xs text-gray-500 mb-1">Có đơn kính</p>
                                        <p className="text-sm font-bold text-gray-800">
                                            {orderData.hasPrescriptionItem ? "Có" : "Không"}
                                        </p>
                                    </div>

                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <div className="flex items-start gap-3">
                                            <CreditCard className="w-5 h-5 text-gray-400 mt-0.5 flex-shrink-0" />
                                            <div>
                                                <p className="text-xs text-gray-500 mb-1">
                                                    Thanh toán cuối cùng
                                                </p>
                                                <p
                                                    className={`text-sm font-bold ${orderData.requiresFinalPayment
                                                        ? "text-amber-600"
                                                        : "text-green-600"
                                                        }`}
                                                >
                                                    {orderData.requiresFinalPayment
                                                        ? "Cần thanh toán thêm"
                                                        : "Không cần thanh toán thêm"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>

                                    {availableActions.length > 0 ? (
                                        <div className="space-y-3">
                                            <p className="text-sm font-bold text-gray-800">
                                                Các thao tác khả dụng
                                            </p>

                                            {availableActions.map((action, index) => (
                                                <button
                                                    key={`${action}-${index}`}
                                                    className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl transition-all font-bold shadow"
                                                    type="button"
                                                >
                                                    <CheckCircle className="w-5 h-5" />
                                                    {mapActionLabel(action)}
                                                </button>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <p className="text-sm text-gray-800 font-medium">
                                                Hiện tại chưa có thao tác xử lý khả dụng
                                            </p>
                                        </div>
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