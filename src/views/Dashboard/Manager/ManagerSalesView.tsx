import { useState } from 'react';
import { Search, Plus, Pencil, Trash2, Eye } from 'lucide-react';

interface Promotion {
    id: number;
    name: string;
    type: string;
    minValue: string;
    period: string;
    quantity: string | number;
    status: string;
}

const mockPromotions: Promotion[] = [
    {
        id: 1,
        name: 'Lễ tết 2026',
        type: 'Giảm 20% tất cả sản phẩm',
        minValue: 'xx',
        period: '1/1/2026-1/3/2026',
        quantity: 'xx',
        status: 'Đang diễn ra',
    },
    {
        id: 2,
        name: 'Mua 3 tặng 1',
        type: 'Mua 3 tặng 1 trên 300K',
        minValue: 'Giảm tổng giỏ hàng 300k',
        period: '1/1/2026-1/3/2026',
        quantity: 300,
        status: 'Đang diễn ra',
    },
    {
        id: 3,
        name: 'Mua 3 tặng 1',
        type: 'Mua 3 tặng 1 dưới 500K',
        minValue: 'Giảm tổng giỏ hàng 500K',
        period: '1/1/2026-1/3/2026',
        quantity: 300,
        status: 'Đang diễn ra',
    },
    {
        id: 4,
        name: 'Combo Gọng & Tròng',
        type: 'Chọn gọng và chọn tròng ở 2 loại khác nhau',
        minValue: 'Giảm 20% tổng bill',
        period: '1/1/2026-1/3/2026',
        quantity: 0,
        status: 'Đang diễn ra',
    },
    {
        id: 5,
        name: 'Freeship Hè 2026',
        type: 'Miễn phí giao hàng toàn quốc',
        minValue: 'Đơn hàng trên 500K',
        period: '1/6/2026-1/9/2026',
        quantity: 'xx',
        status: 'Sắp diễn ra',
    },
    {
        id: 6,
        name: 'Flash Sale Cuối Tuần',
        type: 'Giảm 30% sản phẩm chọn lọc',
        minValue: 'Không tối thiểu',
        period: '7/3/2026-8/3/2026',
        quantity: 50,
        status: 'Kết thúc',
    },
];

const statusConfig: Record<string, { className: string }> = {
    'Đang diễn ra': { className: 'bg-green-100 text-green-700' },
    'Sắp diễn ra': { className: 'bg-blue-100 text-blue-700' },
    'Kết thúc': { className: 'bg-gray-100 text-gray-500' },
    'Tạm dừng': { className: 'bg-yellow-100 text-yellow-700' },
};

export default function ManagerSalesView() {
    const [search, setSearch] = useState('');
    const [promotions, setPromotions] = useState<Promotion[]>(mockPromotions);

    const filtered = promotions.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.type.toLowerCase().includes(search.toLowerCase())
    );

    const handleDelete = (id: number) => {
        setPromotions(prev => prev.filter(p => p.id !== id));
    };

    return (
        <div className="p-6 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl text-gray-800 uppercase tracking-wide" style={{ fontWeight: 700 }}>
                    Danh sách chương trình khuyến mãi
                </h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white w-56"
                        />
                    </div>
                    <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                        <Plus className="h-4 w-4" />
                        Thêm khuyến mãi
                    </button>
                </div>
            </div>

            {/* Stats Row */}
            <div className="grid grid-cols-3 gap-4 mb-6">
                {[
                    { label: 'Đang diễn ra', count: promotions.filter(p => p.status === 'Đang diễn ra').length, color: 'bg-green-50 border-green-200 text-green-700' },
                    { label: 'Sắp diễn ra', count: promotions.filter(p => p.status === 'Sắp diễn ra').length, color: 'bg-blue-50 border-blue-200 text-blue-700' },
                    { label: 'Đã kết thúc', count: promotions.filter(p => p.status === 'Kết thúc').length, color: 'bg-gray-50 border-gray-200 text-gray-600' },
                ].map((stat, i) => (
                    <div key={i} className={`rounded-xl border p-4 ${stat.color}`}>
                        <p className="text-xs mb-1">{stat.label}</p>
                        <p className="text-2xl" style={{ fontWeight: 700 }}>{stat.count}</p>
                    </div>
                ))}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Tên chương trình</th>
                                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Loại khuyến mãi - Điều kiện</th>
                                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Thời gian</th>
                                <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Số lượng</th>
                                <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Trạng thái</th>
                                <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((promo, idx) => {
                                const status = statusConfig[promo.status] || statusConfig['Kết thúc'];
                                return (
                                    <tr
                                        key={promo.id}
                                        className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                                    >
                                        <td className="px-4 py-3 text-gray-800" style={{ fontWeight: 600 }}>{promo.name}</td>
                                        <td className="px-4 py-3">
                                            <div className="text-gray-700">{promo.type}</div>
                                            <div className="text-xs text-gray-400 mt-0.5">{promo.minValue}</div>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600 text-xs whitespace-nowrap">{promo.period}</td>
                                        <td className="px-4 py-3 text-center text-gray-600">{promo.quantity}</td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${status.className}`}>
                                                {promo.status}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button className="text-gray-400 hover:text-blue-500 transition-colors p-1 rounded hover:bg-blue-50">
                                                    <Eye className="h-4 w-4" />
                                                </button>
                                                <button className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(promo.id)}
                                                    className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })}
                            {filtered.length === 0 && (
                                <tr>
                                    <td colSpan={6} className="text-center py-12 text-gray-400">
                                        Không tìm thấy chương trình khuyến mãi nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500">Hiển thị {filtered.length} / {promotions.length} chương trình</p>
                    <div className="flex gap-1">
                        <button className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Trước</button>
                        <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded">1</button>
                        <button className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Sau</button>
                    </div>
                </div>
            </div>
        </div>
    );
}
