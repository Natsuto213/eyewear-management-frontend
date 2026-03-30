// ManagerSupplierView/AddSupplierModal.tsx
import React, { useState } from 'react';
import { Building2, X, Upload, Loader2, Tags, Plus } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    isSubmitting: boolean;
    availableBrands: string[]; 
}

export function AddSupplierModal({ isOpen, onClose, onSave, isSubmitting, availableBrands }: Props) {
    const [name, setName] = useState('');
    const [phone, setPhone] = useState('');
    const [address, setAddress] = useState('');
    
    // Logic mới cho Multi-select
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [customBrand, setCustomBrand] = useState('');

    if (!isOpen) return null;

    const toggleBrand = (brand: string) => {
        setSelectedBrands(prev => 
            prev.includes(brand) ? prev.filter(b => b !== brand) : [...prev, brand]
        );
    };

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
            await onSave({ name, phone, address, brandsList: selectedBrands });
            // Thành công mới xóa
            setName(''); setPhone(''); setAddress(''); setSelectedBrands([]); setCustomBrand('');
        } catch (error) {
            console.error("Lỗi khi submit Modal Thêm Nhà chung cung cấp:", error);
        }
    };

    const allDisplayBrands = Array.from(new Set([...availableBrands, ...selectedBrands]));

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
            <div className="bg-white rounded-xl shadow-xl w-[500px] max-w-full flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <Building2 className="w-5 h-5 text-blue-600" /> Thêm Nhà Cung Cấp Mới
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X className="w-5 h-5" /></button>
                </div>

                <div className="p-6">
                    <form id="add-supplier-form" onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Tên nhà cung cấp <span className="text-red-500">*</span></label>
                            <input type="text" required value={name} onChange={e => setName(e.target.value)} placeholder="VD: Công ty Kính Mắt Á Châu" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại <span className="text-red-500">*</span></label>
                            <input type="text" required value={phone} onChange={e => setPhone(e.target.value)} placeholder="VD: 0987654321" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ <span className="text-red-500">*</span></label>
                            <textarea required rows={2} value={address} onChange={e => setAddress(e.target.value)} placeholder="VD: Quận 1, TP. HCM" className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
                        </div>
                        
                        {/* Khu vực Multi-select */}
                        <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                            <label className="block text-sm font-bold text-blue-800 mb-2 flex items-center gap-1.5"><Tags className="w-4 h-4" /> Thương hiệu phân phối (Tùy chọn)</label>
                            
                            <div className="max-h-32 overflow-y-auto p-2 bg-white border border-gray-200 rounded-lg flex flex-wrap gap-2 mb-3">
                                {allDisplayBrands.length === 0 ? (
                                    <p className="text-xs text-gray-500 w-full text-center py-1">Hệ thống chưa có thương hiệu nào.</p>
                                ) : (
                                    allDisplayBrands.map(brand => {
                                        const isSelected = selectedBrands.includes(brand);
                                        return (
                                            <label 
                                                key={brand} 
                                                className={`flex items-center px-3 py-1 rounded-full border text-xs font-semibold cursor-pointer transition-all select-none
                                                    ${isSelected ? 'bg-blue-100 border-blue-500 text-blue-700 shadow-sm' : 'bg-gray-50 border-gray-200 text-gray-600 hover:bg-gray-100'}`}
                                            >
                                                <input type="checkbox" className="hidden" checked={isSelected} onChange={() => toggleBrand(brand)} />
                                                {brand}
                                            </label>
                                        )
                                    })
                                )}
                            </div>

                            <div className="flex gap-2">
                                <input 
                                    type="text" 
                                    value={customBrand} 
                                    onChange={e => setCustomBrand(e.target.value)} 
                                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), handleAddCustomBrand())}
                                    placeholder="Thêm brand mới..." 
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-xs focus:ring-2 focus:ring-blue-500 outline-none" 
                                />
                                <button type="button" onClick={handleAddCustomBrand} className="px-3 py-2 bg-gray-800 text-white rounded-lg text-xs font-semibold hover:bg-gray-900 transition">Thêm</button>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-100 font-medium text-sm transition-colors">Hủy</button>
                    <button type="submit" form="add-supplier-form" disabled={isSubmitting} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium text-sm transition-colors flex items-center gap-2">
                        {isSubmitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                        Lưu Nhà cung cấp
                    </button>
                </div>
            </div>
        </div>
    );
}