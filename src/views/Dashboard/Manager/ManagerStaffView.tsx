import { useState, useEffect } from 'react';
import { Search, Plus, Pencil, Trash2, Eye, Filter } from 'lucide-react';
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';

interface Staff {
    User_ID: string;
    Name: string;
    Email: string;
    Phone: string;
    Address: string;
    Role: string;
    Status: 'Active' | 'Inactive' | 'Suspended';
}

const performanceData = [
    { name: 'Kiên PT', orders: 42, revenue: 148 },
    { name: 'Lan NT', orders: 38, revenue: 132 },
    { name: 'Hùng TV', orders: 25, revenue: 87 },
    { name: 'Mai LT', orders: 51, revenue: 179 },
    { name: 'Nam HV', orders: 33, revenue: 115 },
    { name: 'Hoa VT', orders: 18, revenue: 63 },
    { name: 'Tuấn DM', orders: 44, revenue: 154 },
];

const statusConfig: Record<string, { label: string; className: string }> = {
    Active: { label: 'Đang làm', className: 'bg-green-100 text-green-700' },
    Inactive: { label: 'Nghỉ phép', className: 'bg-yellow-100 text-yellow-700' },
    Suspended: { label: 'Tạm nghỉ', className: 'bg-red-100 text-red-600' },
};

const roleConfig: Record<string, string> = {
    'OPERATIONS STAFF': 'bg-blue-100 text-blue-700',
    'SALES STAFF': 'bg-purple-100 text-purple-700',
    'MANAGER': 'bg-orange-100 text-orange-700',
    'ADMIN': 'bg-red-100 text-red-700',
    'CUSTOMER': 'bg-gray-100 text-gray-700',
};

export default function ManagerStaffView() {
    const [search, setSearch] = useState('');
    const [filterRole, setFilterRole] = useState('');
    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    // STATE CHO PHÂN TRANG
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10; // Cố định 10 người/trang

    // GỌI API LẤY DỮ LIỆU USER
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await fetch("https://69a8008637caab4b8c606a09.mockapi.io/api/User");
                if (!response.ok) {
                    throw new Error("Không tìm thấy API User");
                }
                const data = await response.json();
                setStaff(data);
            } catch (error) {
                console.error("Lỗi khi tải dữ liệu nhân viên:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    // RESET VỀ TRANG 1 NẾU NGƯỜI DÙNG GÕ TÌM KIẾM
    useEffect(() => {
        setCurrentPage(1);
    }, [search]);

    // LỌC DỮ LIỆU TÌM KIẾM
    const filtered = staff.filter(s => {
        const matchesSearch = s.Name?.toLowerCase().includes(search.toLowerCase()) ||
            s.Email?.toLowerCase().includes(search.toLowerCase()) ||
            s.Role?.toLowerCase().includes(search.toLowerCase());
        const matchesRole = filterRole === "" || s.Role === filterRole

        return matchesSearch && matchesRole;
    });

    // TOÁN HỌC PHÂN TRANG
    const totalPages = Math.ceil(filtered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    // Cắt ra 10 người tương ứng với trang hiện tại
    const currentItems = filtered.slice(startIndex, endIndex);

    const handleDelete = (id: string) => {
        setStaff(prev => prev.filter(s => s.User_ID !== id));
    };

    return (
        <div className="p-6 h-full overflow-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
                <h1 className="text-xl text-gray-800 uppercase tracking-wide" style={{ fontWeight: 700 }}>
                    Danh sách nhân sự
                </h1>
                <div className="flex items-center gap-3">
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Tìm kiếm nhân viên..."
                            value={search}
                            onChange={e => setSearch(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white w-56"
                        />
                    </div>
                    <div className="relative flex items-center">
                        <Filter className="absolute left-3 h-4 w-4 text-gray-400" />
                        <select
                            value={filterRole}
                            onChange={(e) => setFilterRole(e.target.value)}
                            className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white appearance-none cursor-pointer"
                        >
                            <option value="">Tất cả vai trò</option>
                            <option value="ADMIN">Admin</option>
                            <option value="MANAGER">Quản lí</option>
                            <option value="CUSTOMER">Khách hàng</option>
                            <option value="SALES STAFF">Nhân viên bán hàng</option>
                            <option value="OPERATIONS STAFF">Nhân viên kho</option>
                        </select>
                    </div>


                    <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
                        <Plus className="h-4 w-4" />
                        Thêm nhân viên
                    </button>
                </div>
            </div>

            {/* Performance Chart */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
                <h2 className="text-base text-gray-700 mb-4" style={{ fontWeight: 600 }}>Hiệu suất làm việc</h2>
                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={performanceData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                        <XAxis dataKey="name" tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                        <Tooltip
                            contentStyle={{ borderRadius: 8, border: '1px solid #e5e7eb', fontSize: 12 }}
                            formatter={(value, name) => [value, name === 'orders' ? 'Đơn hàng' : 'Doanh thu (triệu)']}
                        />
                        <Bar dataKey="orders" fill="#8b5cf6" radius={[4, 4, 0, 0]} name="orders" />
                        <Bar dataKey="revenue" fill="#a78bfa" radius={[4, 4, 0, 0]} name="revenue" />
                    </BarChart>
                </ResponsiveContainer>
                <div className="flex gap-4 mt-2 justify-center">
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block w-3 h-3 rounded-sm bg-[#8b5cf6]" />
                        <span className="text-xs text-gray-500">Đơn hàng xử lý</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <span className="inline-block w-3 h-3 rounded-sm bg-[#a78bfa]" />
                        <span className="text-xs text-gray-500">Doanh thu (triệu đồng)</span>
                    </div>
                </div>
            </div>

            {/* Staff Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
                {/* THANH ĐIỀU HƯỚNG PHÂN TRANG */}
                <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                    <p className="text-xs text-gray-500">
                        Hiển thị {filtered.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filtered.length)} / {filtered.length} nhân viên
                    </p>
                    <div className="flex gap-1">
                        <button
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1 || totalPages === 0}
                            className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Trước
                        </button>

                        {/* Tự động sinh ra các nút số trang */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                            <button
                                key={page}
                                onClick={() => setCurrentPage(page)}
                                className={`px-3 py-1 text-xs rounded transition-colors ${currentPage === page
                                    ? 'bg-purple-600 text-white font-medium'
                                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                {page}
                            </button>
                        ))}

                        <button
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages || totalPages === 0}
                            className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Sau
                        </button>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Mã NV</th>
                                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Họ tên</th>
                                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Vai trò</th>
                                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>SĐT</th>
                                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Email</th>
                                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Địa chỉ</th>
                                <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Trạng thái</th>
                                <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Action</th>
                            </tr>
                        </thead>
                        <tbody>
                            {/* MAP QUA CURRENTITEMS THAY VÌ FILTERED */}
                            {loading ? (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-purple-600 font-medium">
                                        Đang tải danh sách nhân viên...
                                    </td>
                                </tr>
                            ) : currentItems.length > 0 ? (
                                currentItems.map((s, idx) => {
                                    const status = statusConfig[s.Status] || statusConfig.Active;
                                    return (
                                        <tr
                                            key={s.User_ID || idx}
                                            className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                                        >
                                            <td className="px-4 py-3 text-gray-500">#{s.User_ID}</td>
                                            <td className="px-4 py-3 text-gray-800" style={{ fontWeight: 600 }}>{s.Name}</td>
                                            <td className="px-4 py-3">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${roleConfig[s.Role] || 'bg-gray-100 text-gray-600'}`}>
                                                    {s.Role}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3 text-gray-600">{s.Phone}</td>
                                            <td className="px-4 py-3 text-gray-600">{s.Email}</td>
                                            <td className="px-4 py-3 text-gray-500 text-xs max-w-[150px] truncate" title={s.Address}>
                                                {s.Address || 'Chưa cập nhật'}
                                            </td>
                                            <td className="px-4 py-3 text-center">
                                                <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${status.className}`}>
                                                    {status.label}
                                                </span>
                                            </td>
                                            <td className="px-4 py-3">
                                                <div className="flex items-center justify-center gap-1">
                                                    <button className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50">
                                                        <Pencil className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(s.User_ID)}
                                                        className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })
                            ) : (
                                <tr>
                                    <td colSpan={8} className="text-center py-12 text-gray-400">
                                        Không tìm thấy nhân viên nào
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>


            </div>
        </div>
    );
}