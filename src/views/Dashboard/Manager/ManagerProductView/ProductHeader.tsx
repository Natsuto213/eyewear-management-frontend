// ProductHeader.tsx
import { Search, Plus, Filter } from 'lucide-react';

interface Props {
  search: string;
  setSearch: (val: string) => void;
  selectedType: string;
  setSelectedType: (val: string) => void;
}

export function ProductHeader({ search, setSearch, selectedType, setSelectedType }: Props) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h1 className="text-xl text-gray-800 uppercase tracking-wide" style={{ fontWeight: 700 }}>
        Danh sách sản phẩm
      </h1>

      <div className="flex items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white w-56"
          />
        </div>

        <div className="relative flex items-center">
          <Filter className="absolute left-3 h-4 w-4 text-gray-500" />
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white cursor-pointer appearance-none"
          >
            <option value="">Tất cả phân loại</option>
            <option value="Gọng kính">Gọng kính</option>
            <option value="Tròng kính">Tròng kính</option>
            <option value="Kính áp tròng">Kính áp tròng</option>
          </select>
        </div>

        <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </button>
      </div>
    </div>
  );
}