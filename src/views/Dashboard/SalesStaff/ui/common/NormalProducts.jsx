import React from 'react'
import { Package } from 'lucide-react'
const NormalProducts = ({ normalProducts, formatCurrency }) => {
    return (
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
    )
}

export default NormalProducts
