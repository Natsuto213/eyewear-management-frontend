import React from 'react'
import { Clock, Mail, MapPin, Phone, User } from 'lucide-react'
const ShippingInfo = ({ orderData }) => {
    return (
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
    )
}

export default ShippingInfo
