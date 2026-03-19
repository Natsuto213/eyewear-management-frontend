import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as ChartTooltip, ResponsiveContainer, Cell, ReferenceLine } from 'recharts';
import { Filter } from 'lucide-react';

const formatVND = (value: number) => {
    if (value >= 1_000_000) return `${(value / 1_000_000).toFixed(1)}M`;
    return value.toLocaleString('vi-VN');
};

export const RevenueChart = ({ 
    chartData, avgRevenue, maxRevenue, 
    startDate, setStartDate, endDate, setEndDate, 
    activePreset, setActivePreset, handleQuickSelect, fetchDashboardData, loading 
}: any) => {
    return (
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
                        type="date" value={startDate}
                        onChange={(e) => { setStartDate(e.target.value); setActivePreset('custom'); }}
                        className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-purple-400 bg-gray-50"
                    />
                    <span className="text-gray-400">-</span>
                    <input 
                        type="date" value={endDate}
                        onChange={(e) => { setEndDate(e.target.value); setActivePreset('custom'); }}
                        className="text-xs border border-gray-200 rounded-md px-2 py-1.5 outline-none focus:border-purple-400 bg-gray-50"
                    />
                    <button 
                        onClick={() => fetchDashboardData()} disabled={loading}
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
                                y={avgRevenue} stroke="#ef4444" strokeDasharray="3 3" 
                                label={{ position: 'insideTopLeft', value: 'Trung bình', fill: '#ef4444', fontSize: 11 }}
                            />
                        )}
                        <Bar dataKey="revenue" radius={[4, 4, 0, 0]} maxBarSize={30} minPointSize={2}>
                            {chartData.map((entry: any, index: number) => (
                                <Cell 
                                    key={`cell-${index}`} 
                                    fill={entry.revenue === maxRevenue && maxRevenue > 0 ? '#f59e0b' : '#d8b4fe'} 
                                />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
    );
};