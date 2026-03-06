import React from 'react'

const ComplaintsTable = () => {
    return (
        <div className="min-h-screen bg-gray-200 p-6">
            <h2 className="mb-5 text-2xl font-bold text-gray-800">Đơn khiếu nại</h2>

            <div className="rounded-xl bg-white p-10 text-center shadow">
                <p className="text-base text-gray-500">Chưa có đơn khiếu nại nào</p>
                <p className="mt-1 text-xs text-gray-400">
                    Trang này sẽ hiển thị danh sách khiếu nại khi có dữ liệu từ API
                </p>
            </div>
        </div>
    )
}

export default ComplaintsTable
