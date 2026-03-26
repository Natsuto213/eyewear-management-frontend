import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/ApiService';
import { SummaryCards } from './ManagerStatisticView/SummaryCards';
import { RevenueChart } from './ManagerStatisticView/RevenueChart';
import { OrderStatusChart } from './ManagerStatisticView/OrderStatusChart';
import { TopProductsTable } from './ManagerStatisticView/TopProductsTable';
import { Popup } from '@/components/Popup';

const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function ManagerStatisticView() {
    const todayDate = new Date();
    const getDaysAgo = (days: number) => {
        const d = new Date(todayDate);
        d.setDate(d.getDate() - days);
        return getFormattedDate(d);
    };

    const [startDate, setStartDate] = useState(getDaysAgo(29));
    const [endDate, setEndDate] = useState(getFormattedDate(todayDate));
    const [data, setData] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [activePreset, setActivePreset] = useState('30days');

    // STATE CHO POPUP THÔNG BÁO
    const [popup, setPopup] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'error' });

    // HÀM HIỂN THỊ POPUP
    const showPopup = (message: string, type: 'success' | 'error', title: string = '') => {
        setPopup({ isOpen: true, title, message, type });
    };

    const chartData = data?.revenueChart || [];

    const maxRevenue = useMemo(() => {
        if (!chartData.length) return 0;
        return Math.max(...chartData.map((d: any) => d.revenue));
    }, [chartData]);

    const avgRevenue = useMemo(() => {
        if (!chartData.length) return 0;
        const total = chartData.reduce((sum: number, item: any) => sum + item.revenue, 0);
        return total / chartData.length;
    }, [chartData]);

    const handleQuickSelect = (days: number, presetName: string) => {
        const newStart = getDaysAgo(days - 1);
        const newEnd = getFormattedDate(todayDate);
        setStartDate(newStart);
        setEndDate(newEnd);
        setActivePreset(presetName);
        fetchDashboardData(newStart, newEnd);
    };

    const fetchDashboardData = async (start = startDate, end = endDate) => {
        // THAY THẾ ALERT 1
        if (start > end) {
            showPopup("Ngày bắt đầu không được lớn hơn ngày kết thúc!", "error", "Lỗi chọn ngày");
            return; 
        }

        setLoading(true);
        if (start !== startDate || end !== endDate) {
            setActivePreset('custom');
        }

        try {
            const response = await api.get(`/api/v1/dashboard?startDate=${start}&endDate=${end}`);
            setData(response.data);
        } catch (error) {
            console.error("Lỗi lấy dữ liệu Thống Kê:", error);
            // THAY THẾ ALERT 2
            showPopup("Không thể kết nối đến máy chủ. Vui lòng thử lại!", "error", "Lỗi tải dữ liệu");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (loading && !data) return (
        <div className="flex items-center justify-center h-full w-full">
            <div className="text-center">
                <div className="w-10 h-10 border-4 border-purple-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-500 font-medium animate-pulse">Đang tải dữ liệu thống kê...</p>
            </div>
        </div>
    );

    if (!data || !data.summary) return <div className="p-8 text-center text-red-500">Lỗi: API không trả về đúng định dạng dữ liệu.</div>;

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto relative w-full max-w-[100vw] bg-gray-50/50">

            <div className="mb-6">
                <h1 className="text-2xl text-gray-800 uppercase tracking-wide mb-1" style={{ fontWeight: 700 }}>
                    Thống kê doanh thu
                </h1>
                <p className="text-sm text-gray-500">Cập nhật dữ liệu kinh doanh của hệ thống</p>
            </div>

            <SummaryCards
                totalRevenue={data.summary.totalRevenue}
                pendingOrders={data.summary.pendingOrders}
                completedOrders={data.summary.completedOrders}
            />

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                <RevenueChart
                    chartData={chartData}
                    avgRevenue={avgRevenue} maxRevenue={maxRevenue}
                    startDate={startDate} setStartDate={setStartDate}
                    endDate={endDate} setEndDate={setEndDate}
                    activePreset={activePreset} setActivePreset={setActivePreset}
                    handleQuickSelect={handleQuickSelect}
                    fetchDashboardData={fetchDashboardData}
                    loading={loading}
                />

                <OrderStatusChart orderStatusChart={data.orderStatusChart} />
            </div>

            <TopProductsTable topProducts={data.topProducts} />

            {/* NHÚNG COMPONENT POPUP VÀO ĐÂY */}
            <Popup 
                isOpen={popup.isOpen} 
                title={popup.title}
                message={popup.message} 
                type={popup.type} 
                onClose={() => setPopup({ ...popup, isOpen: false })} 
            />

        </div>
    );
}