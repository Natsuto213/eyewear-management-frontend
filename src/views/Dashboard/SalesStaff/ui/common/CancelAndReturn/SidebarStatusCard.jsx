import React from "react";

export default function SidebarStatusCard({
    orderData,
    mapOrderStatus,
    mapReturnExchangeStatus,
    formatDateTime,
    isApproved,
    isPending,
    showRemainingTime = false,
    isRejected
}) {
    return (
        <>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">
                    Trạng thái đơn hàng
                </p>
                <p className="text-sm font-bold text-gray-800">
                    {mapOrderStatus(orderData.orderStatus)}
                </p>
            </div>

            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">
                    Trạng thái trả hàng
                </p>
                <p className="text-sm font-bold text-gray-800">
                    {mapReturnExchangeStatus(orderData.returnExchangeStatus)}
                    {isRejected && (
                        <p className=" text-red-600 bg-red-50 rounded">
                            Lý do: {orderData.rejectReason || "Lý do từ chối không rõ"}
                        </p>
                    )}
                </p>
            </div>

            {isApproved && (
                <>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">
                            Ngày duyệt yêu cầu:
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                            {orderData.approvedDate
                                ? formatDateTime(orderData.approvedDate)
                                : "null"}
                        </p>
                    </div>
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">
                            Tên nhân viên đã duyệt:
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                            {orderData.approvedDate
                                ? orderData.approvedByName
                                : "null"}
                        </p>
                    </div>
                </>
            )}

            {isPending &&
                orderData.remainingTimeValid !== undefined &&
                showRemainingTime && (
                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <p className="text-xs text-gray-500 mb-1">
                            Thời gian còn hiệu lực đổi trả:
                        </p>
                        <p className="text-sm font-bold text-gray-800">
                            {orderData.remainingTimeValid
                                ? orderData.remainingTimeValid
                                : "null"}{" "}
                            ngày
                        </p>
                    </div>
                )}
        </>
    );
}
