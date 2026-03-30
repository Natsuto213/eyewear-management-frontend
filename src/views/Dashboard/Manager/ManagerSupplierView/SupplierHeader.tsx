// ManagerSupplierView/SupplierHeader.tsx
import { PlusCircle, Search } from 'lucide-react';

interface Props {
    search: string;
    setSearch: (val: string) => void;
    onAddClick: () => void;
}

export function SupplierHeader({ search, setSearch, onAddClick }: Props) {
    return (
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
            <h1 className="text-xl text-gray-800 uppercase tracking-wide font-bold">
                Danh sách nhà cung cấp
            </h1>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                {/* Ô Search được canh chỉnh lại cho mượt */}
                <div className="relative w-full sm:w-80">
                    <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                        type="text"
                        placeholder="Tìm kiếm theo tên hoặc SĐT..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all shadow-sm"
                    />
                </div>

                <button
                    onClick={onAddClick}
                    className="w-full sm:w-auto bg-purple-600 hover:bg-purple-700 text-white px-5 py-2.5 rounded-lg text-sm font-semibold flex items-center justify-center gap-2 shadow-sm hover:shadow transition-all whitespace-nowrap"
                >
                    <PlusCircle className="w-5 h-5" />
                    Thêm nhà cung cấp
                </button>
            </div>
        </div>
    );
}