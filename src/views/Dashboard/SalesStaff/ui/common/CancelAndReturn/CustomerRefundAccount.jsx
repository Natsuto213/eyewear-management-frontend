import React from "react";
import { Image as ImageIcon } from "lucide-react";

export default function CustomerRefundAccount({ orderData }) {
    return (
        <>
            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                <p className="text-xs text-gray-500 mb-1">
                    Thông tin tài khoản khách hàng:
                </p>
                <p className="text-sm font-bold text-gray-800">
                    {orderData.refundAccountNumber &&
                    orderData.refundAccountName ? (
                        <>
                            Phương thức thanh toán: {orderData.refundMethod}
                            <br />
                            Số tài khoản: {orderData.refundAccountNumber}
                            <br />
                            Tên tài khoản: {orderData.refundAccountName}
                        </>
                    ) : (
                        "null"
                    )}
                </p>
            </div>

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
        </>
    );
}
