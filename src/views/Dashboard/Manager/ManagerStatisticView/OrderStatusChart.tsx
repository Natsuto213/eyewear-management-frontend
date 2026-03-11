import { PieChart, Pie, Cell, Legend, Tooltip as ChartTooltip, ResponsiveContainer } from 'recharts';

const PIE_COLORS = ['#f59e0b', '#10b981', '#ef4444', '#3b82f6', '#8b5cf6', '#ec4899', '#14b8a6'];

export const OrderStatusChart = ({ orderStatusChart }: any) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col">
            <div className="mb-2">
                <h2 className="text-base text-gray-800 font-bold">Trạng thái đơn hàng</h2>
                <p className="text-xs text-gray-500">Tỉ lệ phân bổ các trạng thái</p>
            </div>
            <div className="flex-1 min-h-[240px]">
                {orderStatusChart && orderStatusChart.length > 0 ? (
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={orderStatusChart} cx="50%" cy="50%"
                                innerRadius={60} outerRadius={90} paddingAngle={5} dataKey="value"
                            >
                                {orderStatusChart.map((entry: any, index: number) => (
                                    <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                ))}
                            </Pie>
                            <ChartTooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                            <Legend verticalAlign="bottom" height={36} iconType="circle" wrapperStyle={{ fontSize: '12px' }} />
                        </PieChart>
                    </ResponsiveContainer>
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400 text-sm">
                        Chưa có đơn hàng nào
                    </div>
                )}
            </div>
        </div>
    );
};