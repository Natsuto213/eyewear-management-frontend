import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Filter, ChevronDown, Check, ArrowUpDown, Activity } from 'lucide-react';
import { productTypeConfig } from './productConfig';

interface Props {
  search: string;
  setSearch: (val: string) => void;
  selectedTypes: string[];
  setSelectedTypes: (val: string[]) => void;
  selectedStatus: string;
  setSelectedStatus: (val: string) => void;
  sortBy: string;
  setSortBy: (val: string) => void;
  onAddClick: () => void;
}

export function ProductHeader({ search, setSearch, selectedTypes, setSelectedTypes, selectedStatus, setSelectedStatus, sortBy, setSortBy, onAddClick }: Props) {
  // Quản lý trạng thái mở/đóng của popup lọc loại
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const filterRef = useRef<HTMLDivElement>(null);

  const availableTypes = Object.keys(productTypeConfig);

  // Click ra ngoài thì đóng popup
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
        setIsFilterOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  return (
    <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
      <h1 className="text-xl text-gray-800 uppercase tracking-wide" style={{ fontWeight: 700 }}>
        Danh sách sản phẩm
      </h1>

      <div className="flex items-center gap-3">
        {/* THANH TÌM KIẾM */}
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

        {/* MULTI-SELECT LỌC LOẠI */}
        <div className="relative" ref={filterRef}>
          <button
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center gap-2 pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
          >
            <Filter className="h-4 w-4 text-gray-500" />
            <span className="text-gray-700">
              {selectedTypes.length === 0 ? 'Tất cả loại' : `Đã chọn (${selectedTypes.length})`}
            </span>
            <ChevronDown className="h-4 w-4 text-gray-400" />
          </button>

          {isFilterOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
              {availableTypes.map(type => (
                <div
                  key={type}
                  onClick={() => toggleType(type)}
                  className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                >
                  <span>{type}</span>
                  {selectedTypes.includes(type) && <Check className="h-4 w-4 text-purple-600" />}
                </div>
              ))}
              {selectedTypes.length > 0 && (
                <div className="border-t border-gray-100 mt-1">
                  <button
                    onClick={() => setSelectedTypes([])}
                    className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                  >
                    Bỏ chọn tất cả
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* LỌC TRẠNG THÁI */}
        <div className="relative flex items-center">
          <Activity className="absolute left-3 h-4 w-4 text-gray-500" />
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white cursor-pointer appearance-none"
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang bán</option>
            <option value="inactive">Đã ẩn</option>
          </select>
        </div>

        {/* MỚI THÊM: SELECT SẮP XẾP */}
        <div className="relative flex items-center">
          <ArrowUpDown className="absolute left-3 h-4 w-4 text-gray-500" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white cursor-pointer appearance-none"
          >
            <option value="newest">Mới nhất</option>
            <option value="price_asc">Giá: Thấp đến Cao</option>
            <option value="price_desc">Giá: Cao xuống Thấp</option>
            <option value="name_asc">Tên: A-Z</option>
          </select>
        </div>

        {/* NÚT THÊM */}
        <button onClick={onAddClick} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
          <Plus className="h-4 w-4" />
          Thêm sản phẩm
        </button>
      </div>
    </div>
  );
}