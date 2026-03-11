import { Package, ShoppingCart, DollarSign, Clock, CheckCircle } from 'lucide-react';

interface SummaryCardsProps {
    totalRevenue: number;
    pendingOrders: number;
    completedOrders: number;
}

export const SummaryCards = ({ totalRevenue, pendingOrders, completedOrders }: SummaryCardsProps) => {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="flex justify-between items-start mb-2">
                    <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl z-10">
                        <DollarSign className="h-6 w-6" />
                    </div>
                    <span className="text-xs font-medium text-purple-600 bg-purple-50 px-2.5 py-1 rounded-md z-10">
                        Theo bộ lọc
                    </span>
                </div>
                <div className="z-10">
                    <p className="text-sm text-gray-500 font-medium mb-1">Tổng doanh thu</p>
                    <h3 className="text-2xl text-gray-800 font-bold">
                        {(totalRevenue || 0).toLocaleString('vi-VN')} ₫
                    </h3>
                </div>
                <div className="absolute -bottom-4 -right-4 text-purple-50 opacity-50 pointer-events-none">
                    <DollarSign className="h-32 w-32" />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="p-2.5 bg-orange-100 text-orange-600 rounded-xl w-fit mb-2 z-10">
                    <Clock className="h-6 w-6" />
                </div>
                <div className="z-10">
                    <p className="text-sm text-gray-500 font-medium mb-1">Đơn đang cần xử lý</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-2xl text-gray-800 font-bold">{pendingOrders || 0}</h3>
                        <span className="text-sm text-orange-600 font-medium mb-0.5">đơn</span>
                    </div>
                </div>
                <div className="absolute -bottom-4 -right-4 text-orange-50 opacity-50 pointer-events-none">
                    <Package className="h-32 w-32" />
                </div>
            </div>

            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden">
                <div className="p-2.5 bg-emerald-100 text-emerald-600 rounded-xl w-fit mb-2 z-10">
                    <CheckCircle className="h-6 w-6" />
                </div>
                <div className="z-10">
                    <p className="text-sm text-gray-500 font-medium mb-1">Đơn hoàn thành</p>
                    <div className="flex items-end gap-2">
                        <h3 className="text-2xl text-gray-800 font-bold">{completedOrders || 0}</h3>
                        <span className="text-sm text-emerald-600 font-medium mb-0.5">đơn</span>
                    </div>
                </div>
                <div className="absolute -bottom-4 -right-4 text-emerald-50 opacity-50 pointer-events-none">
                    <ShoppingCart className="h-32 w-32" />
                </div>
            </div>
        </div>
    );
};