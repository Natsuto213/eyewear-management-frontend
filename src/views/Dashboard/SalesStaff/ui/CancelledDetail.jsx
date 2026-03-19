import React from 'react'
import { useEffect, useState } from "react";
import {
    CheckCircle,
    RotateCcw,
    Image as ImageIcon,
    ClipboardList,
    XCircle,
    ArrowLeft
} from "lucide-react";
import NormalProducts from "./common/NormalProducts";
import PrescriptionProducts from "./common/PrescriptionProducts";
import ShippingInfo from "./common/ShippingInfo";
import HeaderDetail from "./common/HeaderDetail";
import CustomerAndOrderInfo from "./common/CustomerAndOrderInfo";
import { mapOrderStatus, mapOrderType, formatCurrency, formatDateTime, mapReturnExchangeStatus, mapActionLabel } from "./utils/orderMaps.js";
import { useParams } from "react-router-dom";
import { api } from "@/lib/api";
import { handleApprove, handleComplete, handleReject } from "./utils/apiCancel.js";
import { useNavigate } from "react-router-dom";
import ImageCustom from "./common/ImageCustom.jsx";

function CancelledDetail() {
    const navigate = useNavigate();
    const { returnExchangeId } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openPrescriptionRows, setOpenPrescriptionRows] = useState({});
    const [rejectReason, setRejectReason] = useState("");
    // Thêm 1 state để lưu trữ file ảnh nhận được từ ImageCustom
    const [evidenceFile, setEvidenceFile] = useState(null);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await api.get(`api/staff/return-exchange/cancel-refund-requests/${returnExchangeId}`);
            console.log("đơn huỷ:", response.data.result.returnExchangeId);
            console.log("anhr minh chung:", response.data.result.customerAccountQr);
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
        if (returnExchangeId) {
            fetchOrderDetail();
        }
    }, [returnExchangeId]);

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

    const isApproved = orderData.returnExchangeStatus === "APPROVED";
    const isPending = orderData.returnExchangeStatus === "PENDING";
    return (
        <div className="min-h-screen bg-gray-200">
            <HeaderDetail totalAmount={formatCurrency(orderData.totalAmount)} orderData={orderData} />

            <main className="max-w-7xl mx-auto px-8 py-8">
                {/* --- NÚT QUAY LẠI MỚI THÊM --- */}
                <button
                    onClick={() => navigate("/sales/containers/cancelled-orders")}
                    className="flex items-center gap-2 mb-6 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 hover:text-blue-600 transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Quay lại danh sách huỷ đơn hàng
                </button>
                {/* ---------------------------- */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <CustomerAndOrderInfo orderData={orderData} mapOrderStatus={mapOrderStatus} mapOrderType={mapOrderType} formatDateTime={formatDateTime} formatCurrency={formatCurrency} />

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
                                                Ngày yêu cầu:
                                            </span>
                                            <span className="text-sm text-gray-800 font-medium">
                                                {formatDateTime(orderData.requestDate)}
                                            </span>
                                        </div>

                                        <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-red-50 to-orange-50 rounded-xl border border-red-200">
                                            <span className="text-sm font-semibold text-gray-500 w-40">
                                                Trạng thái trả hàng:
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
                                                Ngày khách nhận hàng:
                                            </span>
                                            <span className="text-sm font-bold text-gray-500">
                                                {formatDateTime(orderData.deliveredAt)}
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

                                    </div>
                                </div>
                            </div>
                        </div>

                        {normalProducts.length > 0 && (
                            <NormalProducts normalProducts={normalProducts} formatCurrency={formatCurrency} />
                        )}

                        {prescriptionProducts.length > 0 && (
                            <PrescriptionProducts
                                prescriptionProducts={prescriptionProducts}
                                openPrescriptionRows={openPrescriptionRows}
                                togglePrescriptionRow={togglePrescriptionRow}
                                formatCurrency={formatCurrency}
                            />
                        )}

                        <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                            <div className="flex items-center justify-between text-white">
                                <span className="text-xl font-bold">TỔNG TIỀN CẦN HOÀN TRẢ</span>
                                <span className="text-3xl font-bold">
                                    {formatCurrency(orderData.totalAmount)}
                                </span>
                            </div>
                        </div>

                        <ShippingInfo orderData={orderData} formatDateTime={formatDateTime} formatCurrency={formatCurrency} />
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
                                        <p className="text-sm font-bold text-gray-800">
                                            {mapReturnExchangeStatus(orderData.returnExchangeStatus)}
                                        </p>
                                    </div>

                                    {isApproved && (
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Ngày duyệt yêu cầu:</p>
                                            <p className="text-sm font-bold text-gray-800">
                                                {orderData.approvedDate ? formatDateTime(orderData.approvedDate) : "null"}
                                            </p>
                                        </div>
                                    )}

                                    {isApproved && (
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Tên nhân viên đã duyệt:</p>
                                            <p className="text-sm font-bold text-gray-800">
                                                {orderData.approvedDate ? orderData.approvedByName : "null"}
                                            </p>
                                        </div>
                                    )}


                                    {isApproved && (
                                        <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                            <p className="text-xs text-gray-500 mb-1">Thông tin tài khoảng khách hàng:</p>
                                            <p className="text-sm font-bold text-gray-800">
                                                {(orderData.refundAccountNumber && orderData.refundAccountName) ? (
                                                    <>
                                                        Phương thức thanh toán: {orderData.refundMethod}
                                                        <br />
                                                        Số tài khoản: {orderData.refundAccountNumber}
                                                        <br />
                                                        Tên tài khoản: {orderData.refundAccountName}
                                                    </>
                                                ) : "null"}
                                            </p>
                                        </div>
                                    )}


                                    {isApproved && (
                                        <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                            <div className="flex items-start gap-3">
                                                <ImageIcon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div className="w-full">
                                                    <p className="text-xs text-gray-500 mb-3 font-semibold">
                                                        Ảnh QR
                                                    </p>

                                                    {orderData.customerAccountQr ? (
                                                        <img
                                                            src={orderData.customerAccountQr}
                                                            alt="Ảnh QR"
                                                            className="w-full h-64 object-contain rounded-xl border border-gray-200 shadow-sm"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-40 rounded-xl border border-dashed border-gray-300 bg-white flex items-center justify-center text-sm text-gray-400">
                                                            Không có ảnh minh chứng
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        </div>
                                    )}
                                    {orderData.returnExchangeStatus === "PENDING" && (
                                        <div className="flex flex-col gap-3">
                                            <p className="text-sm font-bold text-gray-800">Xử lý yêu cầu</p>
                                            <button
                                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-3 px-4 rounded-xl transition-all font-bold shadow"
                                                type="button"

                                                onClick={() => handleApprove(orderData.returnExchangeId, fetchOrderDetail)}
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                CHẤP NHẬN
                                            </button>
                                            <button
                                                className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-3 px-4 rounded-xl transition-all font-bold shadow"
                                                type="button"
                                                disabled={!rejectReason.trim()}
                                                onClick={() => handleReject(orderData.returnExchangeId, rejectReason, fetchOrderDetail)}
                                            >
                                                <XCircle className="w-5 h-5" />
                                                TỪ CHỐI
                                            </button>
                                            <div className="space-y-2">
                                                <label className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                                                    Lý do xử lý (Bắt buộc khi từ chối)
                                                </label>
                                                <textarea
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                    placeholder="Nhập lý do tại đây..."
                                                    className="w-full p-3 text-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none transition-all resize-none bg-gray-50"
                                                    rows="3"
                                                />
                                            </div>
                                        </div>
                                    )}

                                    {/* TRƯỜNG HỢP: APPROVED - Hiển thị nút Hoàn thành */}
                                    {isApproved && (
                                        <div className="flex flex-col gap-4">
                                            <p className="text-sm font-bold text-gray-800">Tiến trình xử lý (Hoàn tiền & Nhập kho)</p>

                                            {/* Component Upload Ảnh Minh Chứng */}
                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <p className="text-xs font-semibold text-gray-700 mb-3">
                                                    Ảnh minh chứng hoàn trả (*)
                                                </p>
                                                <ImageCustom
                                                    onFileSelect={(file) => setEvidenceFile(file)} // Lưu file vào state khi chọn
                                                    onRemove={() => setEvidenceFile(null)}         // Xóa file khỏi state
                                                />
                                            </div>

                                            {/* Nút Hoàn Thành */}
                                            <button
                                                className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl transition-all font-bold shadow ${evidenceFile
                                                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                                                    : "bg-gray-300 text-gray-500 cursor-not-allowed" // Đổi màu xám nếu chưa có ảnh
                                                    }`}
                                                type="button"
                                                disabled={!evidenceFile} // Vô hiệu hóa nút nếu chưa có evidenceFile
                                                onClick={() => handleComplete(
                                                    orderData.returnExchangeId,
                                                    orderData.refundAmount, // Chỉ truyền tổng tiền xuống
                                                    evidenceFile,          // Truyền file vật lý
                                                    fetchOrderDetail
                                                )}
                                            >
                                                <CheckCircle className="w-5 h-5" />
                                                XÁC NHẬN HOÀN THÀNH
                                            </button>
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

export default CancelledDetail
