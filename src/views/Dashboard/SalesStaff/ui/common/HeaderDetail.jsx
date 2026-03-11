import React from 'react'

const HeaderDetail = ({ totalAmount, orderData }) => {
    return (
        <header className="bg-white shadow sticky top-0 z-50 border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-8 py-6">
                <div className="flex items-center justify-between mb-6">
                    {orderData.returnExchangeId ? (
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Chi tiết trả hàng / đổi hàng
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Quản lý và xử lý yêu cầu hậu mãi
                            </p>
                        </div>
                    ) : (
                        <div>
                            <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                Chi tiết đơn hàng
                            </h1>
                            <p className="text-sm text-gray-500 mt-1">
                                Quản lý và xử lý đơn hàng
                            </p>
                        </div>
                    )}
                    <div className="flex items-center gap-4">
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Tổng giá trị</p>
                            <p className="text-2xl font-bold text-gray-800">
                                {totalAmount}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    )
}

export default HeaderDetail
