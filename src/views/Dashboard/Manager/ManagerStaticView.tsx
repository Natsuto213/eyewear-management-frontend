import { useState } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell,
} from 'recharts';
import { TrendingUp, TrendingDown, Package, ShoppingCart, Users, DollarSign } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';

const weeklyData = [
    { day: 'Thứ 2', revenue: 12500000 },
    { day: 'Thứ 3', revenue: 18200000 },
    { day: 'Thứ 4', revenue: 15800000 },
    { day: 'Thứ 5', revenue: 22400000 },
    { day: 'Thứ 6', revenue: 19600000 },
    { day: 'Thứ 7', revenue: 28900000 },
    { day: 'Chủ nhật', revenue: 24100000 },
];

const topProducts = [
    { id: 1, name: 'Product 1', price: 4200000, sold: 48, image: 'https://res.cloudinary.com/dbgkfgkrl/image/upload/v1772382822/Frame_01_ox1yjd.jpg' },
    { id: 2, name: 'Product 2', price: 2800000, sold: 42, image: 'https://res.cloudinary.com/dbgkfgkrl/image/upload/v1772382822/Frame_02_r2ytlh.jpg' },
    { id: 3, name: 'Product 3', price: 6200000, sold: 35, image: 'https://res.cloudinary.com/dbgkfgkrl/image/upload/v1772383014/Lens_01_i3cmlm.jpg' },
    { id: 4, name: 'Product 4', price: 8500000, sold: 29, image: 'https://res.cloudinary.com/dbgkfgkrl/image/upload/v1772383015/Contact_Lens_01_yecoec.jpg' },
];

const formatVND = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    return value.toLocaleString('vi-VN');
};

const COLORS = ['#f59e0b', '#10b981', '#3b82f6', '#f97316', '#ef4444', '#8b5cf6', '#06b6d4'];

export default function ManagerStaticView() {
    const totalRevenue = weeklyData.reduce((s, d) => s + d.revenue, 0);
    const prevWeekTotal = 98700000;
    const growth = ((totalRevenue - prevWeekTotal) / prevWeekTotal * 100).toFixed(1);

    return (
        <div className="p-6 overflow-auto h-full">
            <h1 className="text-xl text-gray-800 uppercase tracking-wide mb-1" style={{ fontWeight: 700 }}>
                Thống kê doanh thu
            </h1>
            <p className="text-sm text-gray-500 mb-6">Tổng quan doanh thu tuần trước</p>

            {/* Summary Cards */}
            <div className="grid grid-cols-4 gap-4 mb-6">
                {[
                    { label: 'Tổng doanh thu', value: `${(totalRevenue / 1_000_000_000).toFixed(2)} tỷ`, icon: DollarSign, color: 'bg-purple-50 text-purple-600', trend: `+${growth}%` },
                    { label: 'Đơn hàng hoàn thành', value: '5.000', icon: ShoppingCart, color: 'bg-blue-50 text-blue-600', trend: '45%' },
                    { label: 'Đang xử lý', value: '2.000', icon: Package, color: 'bg-orange-50 text-orange-600', trend: '40%' },
                    { label: 'Đã chuyển kho', value: '1.000', icon: TrendingUp, color: 'bg-green-50 text-green-600', trend: '15%' },
                ].map((card, i) => (
                    <div key={i} className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-start gap-3">
                        <div className={`p-2 rounded-lg ${card.color}`}>
                            <card.icon className="h-5 w-5" />
                        </div>
                        <div>
                            <p className="text-xs text-gray-500 mb-0.5">{card.label}</p>
                            <p className="text-base text-gray-800" style={{ fontWeight: 700 }}>{card.value}</p>
                            <p className="text-xs text-green-600 mt-0.5">{card.trend}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Bar Chart */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 mb-6">
                <div className="flex items-center justify-between mb-4">
                    <div>
                        <h2 className="text-sm text-gray-700" style={{ fontWeight: 600 }}>Doanh thu theo ngày</h2>
                        <p className="text-xs text-gray-400">Tuần từ 01/03 – 07/03/2026</p>
                    </div>
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        +{growth}% so với tuần trước
                    </span>
                </div>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={weeklyData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                        <XAxis dataKey="day" tick={{ fontSize: 12 }} axisLine={false} tickLine={false} />
                        <YAxis tickFormatter={formatVND} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} width={50} />
                        <Tooltip
                            formatter={(val: number) => [`${val.toLocaleString('vi-VN')} ₫`, 'Doanh thu']}
                            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                        />
                        {/* CẬP NHẬT: Dùng <Cell> thay cho <rect> */}
                        <Bar dataKey="revenue" radius={[4, 4, 0, 0]}>
                            {weeklyData.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>

            {/* Top Products */}
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6">
                <h2 className="text-sm text-gray-700 mb-4" style={{ fontWeight: 600 }}>Các sản phẩm bán chạy nhất</h2>
                <div className="grid grid-cols-4 gap-4">
                    {topProducts.map((product) => (
                        <div key={product.id} className="flex flex-col items-center border border-gray-100 rounded-xl p-4 hover:shadow-md transition-shadow">
                            <div className="w-28 h-28 bg-gray-100 rounded-lg mb-3 flex items-center justify-center overflow-hidden">
                                <ImageWithFallback
                                    src={product.image}
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    fallbackClassName="w-8 h-8 text-gray-300"
                                />
                            </div>
                            <p className="text-sm text-gray-700 text-center mb-1" style={{ fontWeight: 600 }}>{product.name}</p>
                            <p className="text-sm text-purple-600" style={{ fontWeight: 600 }}>{product.price.toLocaleString('vi-VN')} ₫</p>
                            <p className="text-sm text-gray-400 mt-1">Đã bán: {product.sold}</p>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
