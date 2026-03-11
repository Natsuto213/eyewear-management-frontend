import React from 'react'
import { Clock, Mail, Phone, Truck } from 'lucide-react'

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

const CustomerAndOrderInfo = ({ orderData, mapOrderStatus, mapOrderType, formatCurrency, formatDateTime }) => {
    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-bold text-white mb-2">
                            {orderData.orderCode}
                        </h2>
                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30 mr-3">
                            <Clock className="w-4 h-4 mr-2" />
                            {mapOrderStatus(orderData.orderStatus)}
                        </span>

                        {orderData.returnExchangeId && (
                            <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                                <Truck className="w-4 h-4 mr-2" />
                                {mapShippingStatus(orderData.shippingStatus)}
                            </span>
                        )}
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
    )
}

export default CustomerAndOrderInfo
