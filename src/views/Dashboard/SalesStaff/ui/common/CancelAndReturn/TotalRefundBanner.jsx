import React from "react";

export default function TotalRefundBanner({ totalAmount, formatCurrency }) {
    return (
        <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
            <div className="flex items-center justify-between text-white">
                <span className="text-xl font-bold">
                    TỔNG TIỀN CẦN HOÀN TRẢ
                </span>
                <span className="text-3xl font-bold">
                    {formatCurrency(totalAmount)}
                </span>
            </div>
        </div>
    );
}
