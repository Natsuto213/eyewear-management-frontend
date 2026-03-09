// ManagerStaffView/StaffTable.tsx
import { Pencil, Trash2 } from 'lucide-react';
import { Staff, roleConfig, statusConfig } from './StaffConfig';

interface Props {
    loading: boolean;
    currentItems: Staff[];
    filteredLength: number;
    startIndex: number;
    endIndex: number;
    currentPage: number;
    totalPages: number;
    setCurrentPage: (page: number | ((prev: number) => number)) => void;
    onDeleteClick: (id: number | string) => void;
    onEditClick: (staff: Staff) => void;
}

export function StaffTable({
    loading, currentItems, filteredLength, startIndex, endIndex,
    currentPage, totalPages, setCurrentPage, onDeleteClick, onEditClick
}: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">
            {/* Phân trang */}
            <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
                <p className="text-xs text-gray-500">Hiển thị {filteredLength === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredLength)} / {filteredLength} nhân viên</p>
                <div className="flex gap-1">
                    <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || totalPages === 0} className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Trước</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                        <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 text-xs rounded transition-colors ${currentPage === page ? 'bg-purple-600 text-white font-medium' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{page}</button>
                    ))}
                    <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Sau</button>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-gray-50 border-b border-gray-200">
                            <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Username</th>
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
                        {loading ? (
                            <tr><td colSpan={8} className="text-center py-12 text-purple-600 font-medium">Đang tải danh sách nhân viên...</td></tr>
                        ) : currentItems.length > 0 ? (
                            currentItems.map((s, idx) => {
                                // CẬP NHẬT LẤY DỮ LIỆU Ở ĐÂY
                                const status = statusConfig[String(s.status)] || statusConfig['false'];
                                const roleStr = s.role?.name || 'CUSTOMER';
                                const role = roleConfig[roleStr] || { label: roleStr, className: 'bg-gray-100 text-gray-600' };
                                const displayId = s.id || s.userId || s.username;

                                return (
                                    <tr key={displayId || idx} className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}>
                                        <td className="px-4 py-3 text-gray-500 text-center font-medium">{displayId}</td>
                                        <td className="px-4 py-3 text-gray-800" style={{ fontWeight: 600 }}>{s.name}</td>
                                        <td className="px-4 py-3">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${role.className}`}>{role.label}</span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-600">{s.phone}</td>
                                        <td className="px-4 py-3 text-gray-600">{s.email}</td>
                                        <td className="px-4 py-3 text-gray-500 text-xs max-w-[150px] truncate" title={s.address || ''}>
                                            {s.address || 'Chưa cập nhật'}
                                        </td>
                                        <td className="px-4 py-3 text-center">
                                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${status.className}`}>{status.label}</span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <div className="flex items-center justify-center gap-1">
                                                <button onClick={() => onEditClick(s)} className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50">
                                                    <Pencil className="h-4 w-4" />
                                                </button>
                                                <button onClick={() => onDeleteClick(displayId)} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50">
                                                    <Trash2 className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr><td colSpan={8} className="text-center py-12 text-gray-400">Không tìm thấy nhân viên nào</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}