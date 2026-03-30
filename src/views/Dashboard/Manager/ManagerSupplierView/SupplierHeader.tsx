// ManagerSupplierView/SupplierHeader.tsx
import { Building2, PlusCircle, Search } from 'lucide-react';

interface Props {
    search: string;
    setSearch: (val: string) => void;
    onAddClick: () => void;
}

export function SupplierHeader({ search, setSearch, onAddClick }: Props) {
    return (
        <div className="bg-white border border-gray-200 rounded-xl shadow-sm mb-6 overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-center gap-4 bg-gray-50">
                <h1 className="text-xl font-bold text-gray-800 flex items-center gap-2 uppercase tracking-wide">
                    <Building2 className="w-6 h-6 text-blue-600" />
                    Quản lý Nhà Cung Cấp
                </h1>
                <button
                    onClick={onAddClick}
                    className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg text-sm font-semibold flex items-center gap-2 shadow-sm transition-all"
                >
                    <PlusCircle className="w-5 h-5" />
                    Thêm nhà cung cấp
                </button>
            </div>

            <div className="p-4 bg-white">
                <div className="relative max-w-md">
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc SĐT..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    />
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-2.5" />
                </div>
            </div>
        </div>
    );
}