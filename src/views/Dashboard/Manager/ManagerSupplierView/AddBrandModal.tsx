// ManagerSupplierView/AddBrandModal.tsx
import React, { useState } from 'react';
import { Tags, X, Loader2, Upload, Plus } from 'lucide-react';
import { Supplier } from './SupplierConfig';

interface Props {
    isOpen: boolean;
    supplier: Supplier | null;
    onClose: () => void;
    onSave: (brandsList: string[]) => Promise<void>;
    isSubmitting: boolean;
    availableBrands: string[]; 
}

export function AddBrandModal({ isOpen, supplier, onClose, onSave, isSubmitting, availableBrands }: Props) {
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [customBrand, setCustomBrand] = useState('');

    if (!isOpen || !supplier) return null;

    // Hàm thêm/bớt tag khi click
    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

    // Hàm thêm custom brand (trường hợp brand mới hoàn toàn)
    const handleAddCustomBrand = () => {
        const trimmed = customBrand.trim();
        if (trimmed && !selectedBrands.includes(trimmed)) {
            setSelectedBrands(prev => [...prev, trimmed]);
            setCustomBrand('');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await onSave(selectedBrands);
            setSelectedBrands([]); // Xóa form khi success
        } catch (error) {
            console.error("Lỗi khi submit Modal Thêm Brand:", error);
        }
    };

    // Nối các brand có sẵn và brand tự tạo lại để hiển thị cho đẹp
    const allDisplayBrands = Array.from(new Set([...availableBrands, ...selectedBrands]));

    return (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-[450px] max-w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 bg-emerald-50 border-b border-emerald-100">
                    <h3 className="text-lg font-bold text-emerald-800 flex items-center gap-2">
                        <Tags className="w-5 h-5 text-emerald-600" /> Thêm Thương Hiệu
                    </h3>
                    <button onClick={onClose} className="text-emerald-600 hover:text-red-500 transition-colors p-1"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6 space-y-5">
                    <div className="bg-gray-50 p-3 rounded-lg border border-gray-100 text-sm">
                        <span className="text-gray-500">Đang thêm cho: </span>
                        <strong className="text-gray-800">{supplier.name}</strong>
                    </div>

                    <form id="add-brand-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Chọn thương hiệu <span className="text-red-500">*</span></label>
                            
                            {/* Khu vực Multi-select dạng Pills */}
                            <div className="max-h-48 overflow-y-auto p-3 bg-gray-50 border border-gray-200 rounded-xl flex flex-wrap gap-2">
                                {allDisplayBrands.length === 0 ? (
                                    <p className="text-xs text-gray-500 w-full text-center py-2">Hệ thống chưa có thương hiệu nào.</p>
                                ) : (
                                    allDisplayBrands.map(brand => {
                                        const isSelected = selectedBrands.includes(brand);
                                        return (
                                            <label 
                                                key={brand} 
                                                className={`flex items-center px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-all select-none
                                                    ${isSelected ? 'bg-emerald-100 border-emerald-500 text-emerald-700 shadow-sm' : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                            >
                                                <input 
                                                    type="checkbox" 
                                                    className="hidden" 
                                                    checked={isSelected} 
                                                    onChange={() => toggleBrand(brand)} 
                                                />
                                                {brand}
                                            </label>
                                        )
                                    })
                                )}
                            </div>
                        </div>

                        {/* Thêm nhanh Brand mới */}
                        <div>
                            <label className="block text-xs font-semibold text-gray-600 mb-1">Hoặc thêm thương hiệu mới</label>
                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={customBrand} 
                                    onChange={e => setCustomBrand(e.target.value)} 
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomBrand())}
                                    placeholder="Nhập tên thương hiệu..." 
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 outline-none" 
                                />
                                <button 
                                    type="button" 
                                    onClick={handleAddCustomBrand}
                                    className="px-3 py-2 bg-gray-800 text-white rounded-lg text-sm font-semibold hover:bg-gray-900 transition flex items-center gap-1"
                                >
                                    <Plus className="w-4 h-4" /> Thêm
                                </button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors">Hủy</button>
                    <button type="submit" form="add-brand-form" disabled={isSubmitting || selectedBrands.length === 0} className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Lưu ({selectedBrands.length}) Thương Hiệu
                    </button>
                </div>
            </div>
        </div>
    );
}