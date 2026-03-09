// ManagerStaffView/StaffHeader.tsx
import { useState, useRef, useEffect } from 'react';
import { Search, Plus, Filter, ChevronDown, Check, ArrowUpDown } from 'lucide-react';
import { roleConfig } from './StaffConfig';

interface Props {
    search: string;
    setSearch: (val: string) => void;
    selectedRoles: string[];
    setSelectedRoles: (val: string[]) => void;
    sortBy: string;
    setSortBy: (val: string) => void;
    onAddClick: () => void;
}

export function StaffHeader({ search, setSearch, selectedRoles, setSelectedRoles, sortBy, setSortBy, onAddClick }: Props) {
    const [isFilterOpen, setIsFilterOpen] = useState(false);
    const filterRef = useRef<HTMLDivElement>(null);

    const availableRoles = Object.keys(roleConfig);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (filterRef.current && !filterRef.current.contains(event.target as Node)) {
                setIsFilterOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleRole = (role: string) => {
        if (selectedRoles.includes(role)) {
            setSelectedRoles(selectedRoles.filter(r => r !== role));
        } else {
            setSelectedRoles([...selectedRoles, role]);
        }
    };

    return (
        <div className="flex flex-wrap items-center justify-between mb-6 gap-4">
            <h1 className="text-xl text-gray-800 uppercase tracking-wide" style={{ fontWeight: 700 }}>
                Danh sách nhân sự
            </h1>
            <div className="flex items-center gap-3">
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input type="text" placeholder="Tìm kiếm nhân viên..." value={search} onChange={e => setSearch(e.target.value)} className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white w-56" />
                </div>

                {/* MULTI-SELECT LỌC VAI TRÒ */}
                <div className="relative" ref={filterRef}>
                    <button 
                        onClick={() => setIsFilterOpen(!isFilterOpen)}
                        className="flex items-center gap-2 pl-3 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white"
                    >
                        <Filter className="h-4 w-4 text-gray-500" />
                        <span className="text-gray-700">
                            {selectedRoles.length === 0 ? 'Tất cả vai trò' : `Đã chọn (${selectedRoles.length})`}
                        </span>
                        <ChevronDown className="h-4 w-4 text-gray-400" />
                    </button>

                    {isFilterOpen && (
                        <div className="absolute right-0 mt-2 w-56 bg-white border border-gray-200 rounded-lg shadow-lg z-10 py-1">
                            {availableRoles.map(roleKey => (
                                <div 
                                    key={roleKey} 
                                    onClick={() => toggleRole(roleKey)}
                                    className="flex items-center justify-between px-4 py-2 hover:bg-gray-50 cursor-pointer text-sm text-gray-700"
                                >
                                    <span>{roleConfig[roleKey].label}</span>
                                    {selectedRoles.includes(roleKey) && <Check className="h-4 w-4 text-purple-600" />}
                                </div>
                            ))}
                            {selectedRoles.length > 0 && (
                                <div className="border-t border-gray-100 mt-1">
                                    <button 
                                        onClick={() => setSelectedRoles([])}
                                        className="w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                                    >
                                        Bỏ chọn tất cả
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>

                {/* SELECT SẮP XẾP */}
                <div className="relative flex items-center">
                    <ArrowUpDown className="absolute left-3 h-4 w-4 text-gray-500" />
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white cursor-pointer appearance-none"
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="name_asc">Tên: A-Z</option>
                        <option value="name_desc">Tên: Z-A</option>
                    </select>
                </div>

                <button onClick={onAddClick} className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors whitespace-nowrap">
                    <Plus className="h-4 w-4" />
                    Thêm nhân viên
                </button>
            </div>
        </div>
    );
}