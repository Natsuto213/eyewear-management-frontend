import { useEffect, useState } from "react";
import {
    CheckCircle,
    ArrowLeft
} from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";
import HeaderDetail from "./common/HeaderDetail";
import CustomerAndOrderInfo from "./common/CustomerAndOrderInfo";
import NormalProducts from "./common/NormalProducts";
import PrescriptionProducts from "./common/PrescriptionProducts";
import ShippingInfo from "./common/ShippingInfo";
import { mapOrderStatus, mapOrderType, formatCurrency, formatDateTime } from "./utils/orderMaps.js";


export default function OrderDetail() {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openPrescriptionRows, setOpenPrescriptionRows] = useState({});

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

    useEffect(() => {
        if (orderId) {
            fetchOrderDetail();
        }
    }, [orderId]);

    const handleConfirmOrder = async () => {
        try {
            const res = await api.put(`api/staff/orders/${orderId}/confirm`);

            console.log("API response:", res.data);
            alert("Xác nhận đơn hàng thành công!");
            fetchOrderDetail(); // Gọi lại API để cập nhật thông tin đơn hàng mới nhất sau khi xác nhận
        } catch (err) {
            console.error("Lỗi khi gọi API:", err);
            alert(
                err?.response?.data?.message ||
                err?.message ||
                "Xác nhận đơn hàng thất bại"
            );
        }
    };

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
            <HeaderDetail totalAmount={formatCurrency(orderData.totalAmount)} orderData={orderData} />

            <main className="max-w-7xl mx-auto px-8 py-8">
                {/* --- NÚT QUAY LẠI MỚI THÊM --- */}
                <button
                    onClick={() => navigate("/sales/containers/orders")}
                    className="flex items-center gap-2 mb-6 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 hover:text-blue-600 transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Quay lại danh sách đơn hàng
                </button>
                {/* ---------------------------- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <CustomerAndOrderInfo orderData={orderData} mapOrderStatus={mapOrderStatus} mapOrderType={mapOrderType} formatDateTime={formatDateTime} formatCurrency={formatCurrency} />

                        {normalProducts.length > 0 && (
                            <NormalProducts normalProducts={normalProducts} formatCurrency={formatCurrency} />
                        )}

                        {prescriptionProducts.length > 0 && (
                            <PrescriptionProducts
                                prescriptionProducts={prescriptionProducts}
                                formatCurrency={formatCurrency}
                                togglePrescriptionRow={togglePrescriptionRow}
                                openPrescriptionRows={openPrescriptionRows}
                            />
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
                        <ShippingInfo orderData={orderData} formatDateTime={formatDateTime} formatCurrency={formatCurrency} />


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