import React, { useEffect, useState } from "react";
import { ArrowLeft } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "@/lib/api";

import NormalProducts from "./common/NormalProducts";
import PrescriptionProducts from "./common/PrescriptionProducts";
import ShippingInfo from "./common/ShippingInfo";
import HeaderDetail from "./common/HeaderDetail";
import CustomerAndOrderInfo from "./common/CustomerAndOrderInfo";

// Import 6 components mới
import ReturnRequestInfo from "./common/CancelAndReturn/ReturnRequestInfo";
import TotalRefundBanner from "./common/CancelAndReturn/TotalRefundBanner";
import CustomerRefundAccount from "./common/CancelAndReturn/CustomerRefundAccount";
import ActionPendingGroup from "./common/CancelAndReturn/ActionPendingGroup";
import ActionCompleteGroup from "./common/CancelAndReturn/ActionCompleteGroup";
import SidebarStatusCard from "./common/CancelAndReturn/SidebarStatusCard";

import {
    mapOrderStatus,
    mapOrderType,
    formatCurrency,
    formatDateTime,
    mapReturnExchangeStatus,
} from "./utils/orderMaps.js";
import {
    handleApprove,
    handleComplete,
    handleReject,
} from "./utils/apiCancel.js";

function CancelledDetail() {
    const navigate = useNavigate();
    const { returnExchangeId } = useParams();
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [openPrescriptionRows, setOpenPrescriptionRows] = useState({});
    const [rejectReason, setRejectReason] = useState("");
    const [evidenceFile, setEvidenceFile] = useState(null);

    const fetchOrderDetail = async () => {
        try {
            setLoading(true);
            setError("");
            const response = await api.get(
                `api/staff/return-exchange/cancel-refund-requests/${returnExchangeId}`,
            );
            setOrderData(response.data.result);
        } catch (err) {
            console.error(err);
            setError(
                err?.response?.data?.message ||
                    err?.message ||
                    "Không tải được chi tiết đơn hàng",
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (returnExchangeId) fetchOrderDetail();
    }, [returnExchangeId]);

    const togglePrescriptionRow = (key) =>
        setOpenPrescriptionRows((prev) => ({ ...prev, [key]: !prev[key] }));

    if (loading)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-200">
                <p className="text-lg font-semibold">Đang tải chi tiết...</p>
            </div>
        );
    if (error)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-200">
                <p className="text-red-600 font-semibold">{error}</p>
            </div>
        );
    if (!orderData)
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-200">
                <p>Không có dữ liệu</p>
            </div>
        );

    const normalProducts = orderData.orderDetail || [];
    const prescriptionProducts = orderData.prescriptionOrderDetail || [];
    const isApproved = orderData.returnExchangeStatus === "APPROVED";
    const isPending = orderData.returnExchangeStatus === "PENDING";

    return (
        <div className="min-h-screen bg-gray-200">
            <HeaderDetail
                totalAmount={formatCurrency(orderData.totalAmount)}
                orderData={orderData}
            />

            <main className="max-w-7xl mx-auto px-8 py-8">
                <button
                    onClick={() =>
                        navigate("/sales/containers/cancelled-orders")
                    }
                    className="flex items-center gap-2 mb-6 px-4 py-2 bg-white text-gray-700 font-semibold rounded-lg shadow-sm border border-gray-100 hover:bg-gray-50 hover:text-blue-600 transition-all group"
                >
                    <ArrowLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
                    Quay lại danh sách huỷ đơn hàng
                </button>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-8">
                        <CustomerAndOrderInfo
                            orderData={orderData}
                            mapOrderStatus={mapOrderStatus}
                            mapOrderType={mapOrderType}
                            formatDateTime={formatDateTime}
                            formatCurrency={formatCurrency}
                        />

                        <ReturnRequestInfo
                            orderData={orderData}
                            formatDateTime={formatDateTime}
                            mapReturnExchangeStatus={mapReturnExchangeStatus}
                            hasCustomerEvidence={false} // Hủy đơn không có ảnh minh chứng từ khách
                        />

                        {normalProducts.length > 0 && (
                            <NormalProducts
                                normalProducts={normalProducts}
                                formatCurrency={formatCurrency}
                            />
                        )}

                        {prescriptionProducts.length > 0 && (
                            <PrescriptionProducts
                                prescriptionProducts={prescriptionProducts}
                                openPrescriptionRows={openPrescriptionRows}
                                togglePrescriptionRow={togglePrescriptionRow}
                                formatCurrency={formatCurrency}
                            />
                        )}

                        <TotalRefundBanner
                            totalAmount={orderData.totalAmount}
                            formatCurrency={formatCurrency}
                        />

                        <ShippingInfo
                            orderData={orderData}
                            formatDateTime={formatDateTime}
                            formatCurrency={formatCurrency}
                        />
                    </div>

                    <div className="lg:col-span-1">
                        <div className="sticky top-24 space-y-8">
                            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
                                    <h3 className="text-xl font-bold text-white">
                                        Tóm tắt xử lý
                                    </h3>
                                </div>

                                <div className="p-6 space-y-5">
                                    <SidebarStatusCard
                                        orderData={orderData}
                                        mapOrderStatus={mapOrderStatus}
                                        mapReturnExchangeStatus={
                                            mapReturnExchangeStatus
                                        }
                                        formatDateTime={formatDateTime}
                                        isApproved={isApproved}
                                        isPending={isPending}
                                        showRemainingTime={false}
                                    />

                                    {isApproved && (
                                        <CustomerRefundAccount
                                            orderData={orderData}
                                        />
                                    )}

                                    {isPending && (
                                        <ActionPendingGroup
                                            rejectReason={rejectReason}
                                            setRejectReason={setRejectReason}
                                            onApprove={() =>
                                                handleApprove(
                                                    orderData.returnExchangeId,
                                                    fetchOrderDetail,
                                                )
                                            }
                                            onReject={() =>
                                                handleReject(
                                                    orderData.returnExchangeId,
                                                    rejectReason,
                                                    fetchOrderDetail,
                                                )
                                            }
                                        />
                                    )}

                                    {isApproved && (
                                        <ActionCompleteGroup
                                            evidenceFile={evidenceFile}
                                            setEvidenceFile={setEvidenceFile}
                                            onComplete={() =>
                                                handleComplete(
                                                    orderData.returnExchangeId,
                                                    orderData.refundAmount,
                                                    evidenceFile,
                                                    fetchOrderDetail,
                                                )
                                            }
                                        />
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

export default CancelledDetail;
