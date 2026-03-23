import React from "react";
import { RotateCcw, ClipboardList, Image as ImageIcon } from "lucide-react";

export default function ReturnRequestInfo({
    orderData,
    formatDateTime,
    mapReturnExchangeStatus,
    hasCustomerEvidence = false,
}) {
    // SỬA: itemEvidenceURL (URL viết hoa)
    const evidenceItems =
        orderData.returnExchangeItems?.filter((item) => item.itemEvidenceURL) ||
        [];

    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-b border-gray-200">
                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                    <RotateCcw className="w-6 h-6 text-gray-400" />
                    Thông tin yêu cầu trả hàng / đổi hàng
                </h3>
            </div>

            <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {/* ... (Phần cột trái giữ nguyên) ... */}
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
                                {mapReturnExchangeStatus(
                                    orderData.returnExchangeStatus,
                                )}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-sm font-semibold text-gray-500 w-40">
                                Có đơn kính:
                            </span>
                            <span
                                className={`text-sm font-semibold ${orderData.hasPrescriptionItem ? "text-teal-600" : "text-gray-600"}`}
                            >
                                {orderData.hasPrescriptionItem ? "Có" : "Không"}
                            </span>
                        </div>
                        <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                            <span className="text-sm font-semibold text-gray-500 w-40">
                                Ngày khách nhận hàng:
                            </span>
                            <span className="text-sm font-bold text-gray-500">
                                {orderData.deliveredAt
                                    ? formatDateTime(orderData.deliveredAt)
                                    : "Chưa cập nhật"}
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
                                        {orderData.returnReason ||
                                            "Không có lý do"}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {hasCustomerEvidence && (
                            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                <div className="flex items-start gap-3">
                                    <ImageIcon className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                    <div className="w-full overflow-hidden">
                                        <p className="text-xs text-gray-500 mb-3 font-semibold">
                                            Ảnh minh chứng
                                        </p>

                                        {evidenceItems.length > 0 ? (
                                            <div className="flex gap-4 overflow-x-auto pb-2 snap-x">
                                                {evidenceItems.map(
                                                    (item, index) => (
                                                        <img
                                                            key={index}
                                                            // SỬA: itemEvidenceURL (URL viết hoa)
                                                            src={
                                                                item.itemEvidenceURL
                                                            }
                                                            alt={`Ảnh minh chứng ${index + 1}`}
                                                            className="w-48 h-48 md:w-64 md:h-64 object-cover rounded-xl border border-gray-200 shadow-sm flex-shrink-0 snap-center"
                                                        />
                                                    ),
                                                )}
                                            </div>
                                        ) : (
                                            <div className="w-full h-40 rounded-xl border border-dashed border-gray-300 bg-white flex items-center justify-center text-sm text-gray-400">
                                                Không có ảnh minh chứng
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
