import { useState, useEffect, useMemo } from 'react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer,
    PieChart, Pie, Cell, Legend, ReferenceLine
} from 'recharts';
import { Package, ShoppingCart, DollarSign, Clock, CheckCircle, Filter } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';
import { api } from '@/lib/api'; 

const formatVND = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    return value.toLocaleString('vi-VN');
};

const PIE_COLORS = ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function ManagerStaticView() {
    const [revenueFilter, setRevenueFilter] = useState<'day' | 'week' | 'month'>('month');

    // Hàm hỗ trợ lùi ngày tính từ ngày hiện tại
    const todayDate = new Date();
    const getDaysAgo = (days: number) => {
        const d = new Date(todayDate);
        d.setDate(d.getDate() - days);
        return getFormattedDate(d);
    };

    // Mặc định lúc mới load trang sẽ chọn sẵn 30 ngày qua
    const [startDate, setStartDate] = useState(getDaysAgo(29));
    const [endDate, setEndDate] = useState(getFormattedDate(todayDate));
    
    // STATE LƯU TRỮ DỮ LIỆU TỪ API THẬT
    const [data, setData] = useState<any>(null); 
    const [loading, setLoading] = useState(true);
    const [activePreset, setActivePreset] = useState('30days');

    const chartData = data?.revenueChart || [];
    
    // Tìm mức doanh thu cao nhất để tô màu nổi bật
    const maxRevenue = useMemo(() => {
        if (!chartData.length) return 0;
        return Math.max(...chartData.map((d: any) => d.revenue));
    }, [chartData]);

    // Tính doanh thu trung bình
    const avgRevenue = useMemo(() => {
        if (!chartData.length) return 0;
        const total = chartData.reduce((sum: number, item: any) => sum + item.revenue, 0);
        return total / chartData.length;
    }, [chartData]);

    const displayRevenue = 
        revenueFilter === 'day' ? data?.summary?.revenueDay :
        revenueFilter === 'week' ? data?.summary?.revenueWeek :
        data?.summary?.revenueMonth;

    const handleQuickSelect = (days: number, presetName: string) => {
        const newStart = getDaysAgo(days - 1);
        const newEnd = getFormattedDate(todayDate);
        setStartDate(newStart); 
        setEndDate(newEnd);
        setActivePreset(presetName);
        fetchDashboardData(newStart, newEnd);
    };

    // HÀM GỌI API LẤY TOÀN BỘ DATA DASHBOARD
    const fetchDashboardData = async (start = startDate, end = endDate) => {
        if (start > end) return alert("Ngày bắt đầu không được lớn hơn ngày kết thúc!");
        
        setLoading(true);
        if (start !== startDate || end !== endDate) {
            setActivePreset('custom');
        }

        try {
            // GỌI API THẬT ĐÚNG VỚI HÌNH BẠN GỬI
            const response = await api.get(`/api/v1/dashboard?startDate=${start}&endDate=${end}`);
            
            // Log ra xem đúng không nha
            console.log("Data từ API:", response.data);
            
            // Nạp data vào state để vẽ giao diện
            setData(response.data);

        } catch (error) {
            console.error("Lỗi lấy dữ liệu Thống Kê:", error);
            alert("Không thể tải dữ liệu thống kê lúc này!");
        } finally {
            setLoading(false);
        }
    };

    // Tự động load API lần đầu khi vào trang
    useEffect(() => {
        fetchDashboardData(); 
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Nếu chưa có data thì hiện màn hình Loading
    if (loading && !data) return (
        <div className="flex items-center justify-center h-full w-full">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Đang tải dữ liệu thống kê...</p>
            </div>
        </div>
    );

    // Xử lý lỗi nếu data API trả về rỗng hoặc sai cấu trúc
    if (!data || !data.summary) return <div className="p-8 text-center text-red-500">Lỗi: API không trả về đúng định dạng dữ liệu.</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto relative w-full max-w-[100vw] bg-gray-50/50">
            
            <div className="mb-6">
                <h1 className="text-2xl text-gray-800 uppercase tracking-wide mb-1" style={{ fontWeight: 700 }}>
                    Thống kê doanh thu
                </h1>
                <p className="text-sm text-gray-500">Cập nhật dữ liệu kinh doanh của hệ thống</p>
            </div>

            {/* 1. THẺ TỔNG QUAN */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col justify-between relative overflow-hidden">
                    <div className="flex justify-between items-start mb-2">
                        <div className="p-2.5 bg-purple-100 text-purple-600 rounded-xl z-10">
                            <DollarSign className="h-6 w-6" />
                        </div>
                        <select 
                            value={revenueFilter}
                            onChange={(e) => setRevenueFilter(e.target.value as any)}
                            className="text-xs border border-gray-200 rounded-md px-2 py-1 outline-none focus:border-purple-400 bg-white z-10 relative cursor-pointer"
                        >
                            <option value="day">Hôm nay</option>
                            <option value="week">Tuần này</option>
                            <option value="month">Tháng này</option>
                        </select>
                    </div>
                    <div className="z-10">
                        <p className="text-sm text-gray-500 font-medium mb-1">Tổng doanh thu</p>
                        <h3 className="text-2xl text-gray-800 font-bold">{displayRevenue?.toLocaleString('vi-VN')} ₫</h3>
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
                            <h3 className="text-2xl text-gray-800 font-bold">{data.summary.pendingOrders}</h3>
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
                            <h3 className="text-2xl text-gray-800 font-bold">{data.summary.completedOrders}</h3>
                            <span className="text-sm text-emerald-600 font-medium mb-0.5">đơn</span>
                        </div>
                    </div>
                    <div className="absolute -bottom-4 -right-4 text-emerald-50 opacity-50 pointer-events-none">
                        <ShoppingCart className="h-32 w-32" />
                    </div>
                </div>
            </div>

            {/* 2. KHU VỰC BIỂU ĐỒ */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                
                {/* BIỂU ĐỒ DOANH THU LỌC THEO NGÀY */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 lg:col-span-2 flex flex-col">
                    <div className="flex flex-col xl:flex-row xl:items-center justify-between mb-6 gap-4 border-b border-gray-100 pb-4">
                        <div>
                            <h2 className="text-base text-gray-800 font-bold">Biểu đồ doanh thu</h2>
                            <p className="text-xs text-gray-500">
                                Trung bình: <strong className="text-purple-600">{avgRevenue.toLocaleString('vi-VN')} ₫/ngày</strong>
                            </p>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-2">
                            <div className="flex bg-gray-100 p-1 rounded-lg">
                                <button 
                                    onClick={() => handleQuickSelect(7, '7days')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activePreset === '7days' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    7 ngày qua
                                </button>
                                <button 
                                    onClick={() => handleQuickSelect(30, '30days')}
                                    className={`px-3 py-1.5 text-xs font-medium rounded-md transition-colors ${activePreset === '30days' ? 'bg-white shadow-sm text-purple-600' : 'text-gray-500 hover:text-gray-700'}`}
                                >
                                    30 ngày qua
                                </button>
                            </div>

                            <span className="text-gray-300 mx-1">|</span>

                            <input 
                                type="date" 
                                value={startDate}
                                onChange={(e) => {
                                    setStartDate(e.target.value);
                                    setActivePreset('custom');
                                }}
                                className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-purple-400 bg-gray-50"
                            />
                            <span className="text-gray-400">-</span>
                            <input 
                                type="date" 
                                value={endDate}
                                onChange={(e) => {
                                    setEndDate(e.target.value);
                                    setActivePreset('custom');
                                }}
                                className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-purple-400 bg-gray-50"
                            />
                            <button 
                                onClick={() => fetchDashboardData()}
                                disabled={loading}
                                className="flex items-center justify-center px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white text-xs font-medium rounded-md transition-colors disabled:opacity-50"
                            >
                                {loading ? '...' : 'Lọc'}
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 min-h-[280px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={chartData} margin={{ top: 20, right: 10, left: 0, bottom: 0 }}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                                <XAxis dataKey="label" tick={{ fontSize: 10, fill: '#6b7280' }} axisLine={false} tickLine={false} interval="preserveStartEnd" minTickGap={20} />
                                <YAxis tickFormatter={formatVND} tick={{ fontSize: 12, fill: '#6b7280' }} axisLine={false} tickLine={false} width={60} />
                                <ChartTooltip
                                    formatter={(val: any) => [`${Number(val).toLocaleString('vi-VN')} ₫`, 'Doanh thu']}
                                    cursor={{ fill: '#f3f4f6' }}
                                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                                />
                                {chartData.length > 0 && (
                                    <ReferenceLine 
                                        y={avgRevenue} 
                                        stroke="#ef4444" 
                                        strokeDasharray="3 3" 
                                        label={{ position: 'insideTopLeft', value: 'Trung bình', fill: '#ef4444', fontSize: 11 }}
                                    />
                                )}
                                <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={30} minPointSize={2}>
                                    {chartData.map((entry: any, index: number) => (
                                        <Cell 
                                            key={`cell-${index}`} 
                                            fill={entry.revenue === maxRevenue ? '#f59e0b' : '#d8b4fe'} 
                                        />
                                    ))}
                                </Bar>
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>

                {/* BIỂU ĐỒ TRÒN TRẠNG THÁI ĐƠN HÀNG */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
                    <div className="mb-2">
                        <h2 className="text-base text-gray-800 font-bold">Trạng thái đơn hàng</h2>
                        <p className="text-xs text-gray-500">Tỉ lệ phân bổ các trạng thái</p>
                    </div>
                    <div className="flex-1 min-h-[240px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                                <Pie
                                    data={data.orderStatusChart}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={90}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {data.orderStatusChart.map((entry: any, index: number) => (
                                        <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <ChartTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                                <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* 3. TOP MẶT HÀNG BÁN CHẠY */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                    <h2 className="text-base text-gray-800 font-bold">Top mặt hàng bán chạy nhất</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-gray-500 bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 font-semibold rounded-tl-xl">Xếp hạng</th>
                                <th className="px-6 py-3 font-semibold">Sản phẩm</th>
                                <th className="px-6 py-3 font-semibold text-right">Đơn giá</th>
                                <th className="px-6 py-3 font-semibold text-right rounded-tr-xl">Đã bán</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.topProducts && data.topProducts.map((product: any, index: number) => (
                                <tr key={product.id} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                                            index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                            index === 1 ? 'bg-gray-200 text-gray-600' :
                                            index === 2 ? 'bg-amber-100 text-amber-700' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                            #{index + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-white shrink-0">
                                            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-semibold text-gray-800">{product.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-600">
                                        {product.price.toLocaleString('vi-VN')} ₫
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center gap-1 font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                                            {product.sold} <Package className="w-3 h-3" />
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

        </div>
    );
}