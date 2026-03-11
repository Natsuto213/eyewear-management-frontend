// ManagerProductView/ProductModal.tsx
import { useState, useEffect } from 'react';
import { Product } from './productConfig';
import { X, Upload } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialData: Product | null;
    showPopup: (message: string, type: 'success' | 'error') => void; // 👈 Nhận hàm từ Cha truyền xuống
}

export function ProductModal({ isOpen, onClose, onSave, initialData, showPopup }: Props) {
    const [formData, setFormData] = useState({
        id: 0,
        sku: '',
        name: '',
        price: 0,
        costPrice: 0,
        description: '',
        brandName: '',
        typeName: 'Gọng kính',
        allowPreorder: false,
        isActive: true,

        // Gọng kính
        frameColor: '', frameTempleLength: 0, frameLensWidth: 0, frameBridgeWidth: 0, frameShapeName: '', frameMaterialName: '', frameDescription: '',
        // Tròng kính
        lensTypeName: 'Đơn tròng', lensIndexValue: 0, lensDiameter: 0, lensAvailablePowerRange: '', lensIsBlueLightBlock: false, lensIsPhotochromic: false, lensDescription: '',
        // Kính áp tròng
        contactLensUsageType: '', contactLensBaseCurve: 0, contactLensDiameter: 0, contactLensWaterContent: 0, contactLensAvailablePowerRange: '', contactLensQuantityPerBox: 0, contactLensMaterial: '', contactLensReplacementSchedule: '', contactLensColor: ''
    });

    const [imageFiles, setImageFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        if (initialData && isOpen) {
            const p = initialData as any;
            const firstImageUrl = p.images?.find((img: any) => img.isAvatar)?.imageUrl 
                                  || p.images?.[0]?.imageUrl 
                                  || p.Image_URL;

            setFormData(prev => ({
                ...prev, 
                id: p.productID || p.id || 0,
                sku: p.sku || '',
                name: p.productName || p.name || '',
                price: p.price || 0,
                costPrice: p.costPrice || p.price || 0,
                description: p.description || p.Description || '',
                
                brandName: p.brand?.brandName || p.brandName || p.Brand || '',
                typeName: p.productType?.typeName || p.typeName || p.Product_Type || 'Gọng kính',
                
                allowPreorder: p.allowPreorder ?? false,
                isActive: p.isActive ?? true,
            }));

            setImagePreviews(firstImageUrl ? [firstImageUrl] : []);
            setImageFiles([]);

        } else if (!initialData && isOpen) {
            setFormData({
                id: 0, sku: '', name: '', price: 0, costPrice: 0, description: '', brandName: '', typeName: 'Gọng kính', allowPreorder: false, isActive: true,
                frameColor: '', frameTempleLength: 0, frameLensWidth: 0, frameBridgeWidth: 0, frameShapeName: '', frameMaterialName: '', frameDescription: '',
                lensTypeName: 'Đơn tròng', lensIndexValue: 0, lensDiameter: 0, lensAvailablePowerRange: '', lensIsBlueLightBlock: false, lensIsPhotochromic: false, lensDescription: '',
                contactLensUsageType: '', contactLensBaseCurve: 0, contactLensDiameter: 0, contactLensWaterContent: 0, contactLensAvailablePowerRange: '', contactLensQuantityPerBox: 0, contactLensMaterial: '', contactLensReplacementSchedule: '', contactLensColor: ''
            });
            setImagePreviews([]);
            setImageFiles([]);
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }

        const numberFields = ['price', 'costPrice', 'frameTempleLength', 'frameLensWidth', 'frameBridgeWidth', 'lensIndexValue', 'lensDiameter', 'contactLensBaseCurve', 'contactLensDiameter', 'contactLensWaterContent', 'contactLensQuantityPerBox'];

        setFormData(prev => ({
            ...prev,
            [name]: numberFields.includes(name) ? Number(value) : value
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files) {
            const filesArray = Array.from(e.target.files);
            setImageFiles(prev => [...prev, ...filesArray]);
            const newPreviews = filesArray.map(file => URL.createObjectURL(file));
            setImagePreviews(prev => [...prev, ...newPreviews]);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
        setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!initialData && imageFiles.length === 0) {
            showPopup("Vui lòng chọn ít nhất 1 hình ảnh cho sản phẩm mới!", "error");
            return; 
        }

        setIsSubmitting(true);
        await onSave({ ...formData, imageFiles });
        setIsSubmitting(false);
    };

    const isEditMode = !!initialData;
    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
            <div className="bg-white rounded-xl shadow-xl w-[800px] max-w-full max-h-[95vh] flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 bg-gray-50 rounded-t-xl">
                    <h3 className="text-lg font-bold text-gray-800">
                        {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
                    </h3>
                    <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-6 overflow-y-auto">
                    <form id="product-form" onSubmit={handleSubmit} className="space-y-6">

                        {/* THÔNG TIN CHUNG */}
                        <div className="space-y-4">
                            <h4 className="font-semibold text-purple-700 border-b pb-2">1. Thông tin chung</h4>

                            {/* Khu vực up ảnh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Hình ảnh sản phẩm {!isEditMode && '*'}</label>
                                <div className="flex flex-wrap gap-3">
                                    <label className="w-20 h-20 shrink-0 border-2 border-dashed border-purple-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 hover:border-purple-500 transition-colors text-purple-600">
                                        <Upload className="h-5 w-5 mb-1" />
                                        <span className="text-[10px] font-medium">Tải lên</span>
                                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                    {imagePreviews.map((preview, idx) => (
                                        <div key={idx} className="w-20 h-20 relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 group">
                                            <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                                    <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className={inputClass} />
                                </div>
                                <div className="col-span-2">
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-3 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu *</label>
                                    <input required type="text" name="brandName" value={formData.brandName} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá bán (VNĐ) *</label>
                                    <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Giá nhập (VNĐ)</label>
                                    <input type="number" min="0" name="costPrice" value={formData.costPrice} onChange={handleChange} className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại sản phẩm *</label>
                                    <select name="typeName" value={formData.typeName} onChange={handleChange} disabled={isEditMode} className={`${inputClass} ${isEditMode ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}>
                                        <option value="Gọng kính">Gọng kính</option>
                                        <option value="Tròng kính">Tròng kính</option>
                                        <option value="Kính áp tròng">Kính áp tròng</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2 mt-5">
                                    <input type="checkbox" id="allowPreorder" name="allowPreorder" checked={formData.allowPreorder} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded cursor-pointer" />
                                    <label htmlFor="allowPreorder" className="text-sm font-medium text-gray-700 cursor-pointer">Cho phép đặt trước (Pre-order)</label>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả chung</label>
                                <textarea rows={2} name="description" value={formData.description} onChange={handleChange} className={`${inputClass} resize-none`} />
                            </div>
                        </div>

                        {/* CHỈ HIỂN THỊ THÔNG SỐ KỸ THUẬT KHI ĐANG ADD MỚI */}
                        {!isEditMode && (
                            <div className="space-y-4 bg-purple-50/50 p-4 rounded-xl border border-purple-100 mt-6">
                                <h4 className="font-semibold text-purple-700">2. Thông số kỹ thuật ({formData.typeName})</h4>

                                {/* GỌNG KÍNH */}
                                {formData.typeName === 'Gọng kính' && (
                                    <>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div><label className="block text-xs text-gray-600 mb-1">Màu sắc *</label><input required type="text" name="frameColor" value={formData.frameColor} onChange={handleChange} className={inputClass} /></div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Kiểu dáng *</label><input required type="text" name="frameShapeName" value={formData.frameShapeName} onChange={handleChange} className={inputClass} /></div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Chất liệu *</label><input required type="text" name="frameMaterialName" value={formData.frameMaterialName} onChange={handleChange} className={inputClass} /></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div><label className="block text-xs text-gray-600 mb-1">Độ dài càng kính (mm) *</label><input required type="number" name="frameTempleLength" value={formData.frameTempleLength} onChange={handleChange} className={inputClass} /></div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Độ rộng tròng (mm) *</label><input required type="number" name="frameLensWidth" value={formData.frameLensWidth} onChange={handleChange} className={inputClass} /></div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Cầu kính (mm) *</label><input required type="number" name="frameBridgeWidth" value={formData.frameBridgeWidth} onChange={handleChange} className={inputClass} /></div>
                                        </div>
                                        <div><label className="block text-xs text-gray-600 mb-1">Mô tả gọng kính</label><textarea rows={2} name="frameDescription" value={formData.frameDescription} onChange={handleChange} className={`${inputClass} resize-none`} /></div>
                                    </>
                                )}

                                {/* TRÒNG KÍNH */}
                                {formData.typeName === 'Tròng kính' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label className="block text-xs text-gray-600 mb-1">Loại tròng *</label>
                                                <select required name="lensTypeName" value={formData.lensTypeName} onChange={handleChange} className={inputClass}>
                                                    <option value="Đơn tròng">Đơn tròng</option>
                                                    <option value="Đa tròng">Đa tròng</option>
                                                    <option value="Đổi màu">Đổi màu</option>
                                                </select>
                                            </div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Dải độ sẵn có (VD: -0.5 to -6.0) *</label><input required type="text" name="lensAvailablePowerRange" value={formData.lensAvailablePowerRange} onChange={handleChange} className={inputClass} /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div><label className="block text-xs text-gray-600 mb-1">Chiết suất *</label><input required type="number" step="0.01" name="lensIndexValue" value={formData.lensIndexValue} onChange={handleChange} className={inputClass} /></div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Đường kính (mm) *</label><input required type="number" name="lensDiameter" value={formData.lensDiameter} onChange={handleChange} className={inputClass} /></div>
                                        </div>
                                        <div className="flex gap-6 mt-2">
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="lensIsBlueLightBlock" checked={formData.lensIsBlueLightBlock} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded" /><span className="text-sm">Chống ánh sáng xanh</span></label>
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="lensIsPhotochromic" checked={formData.lensIsPhotochromic} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded" /><span className="text-sm">Có đổi màu</span></label>
                                        </div>
                                        <div><label className="block text-xs text-gray-600 mb-1 mt-2">Mô tả tròng kính</label><textarea rows={2} name="lensDescription" value={formData.lensDescription} onChange={handleChange} className={`${inputClass} resize-none`} /></div>
                                    </>
                                )}

                                {/* KÍNH ÁP TRÒNG */}
                                {formData.typeName === 'Kính áp tròng' && (
                                    <>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div><label className="block text-xs text-gray-600 mb-1">Loại sử dụng *</label><input required type="text" name="contactLensUsageType" value={formData.contactLensUsageType} onChange={handleChange} className={inputClass} /></div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Màu sắc *</label><input required type="text" name="contactLensColor" value={formData.contactLensColor} onChange={handleChange} className={inputClass} /></div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Chất liệu *</label><input required type="text" name="contactLensMaterial" value={formData.contactLensMaterial} onChange={handleChange} className={inputClass} /></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div><label className="block text-xs text-gray-600 mb-1">Bán kính cong (BC) *</label><input required type="number" step="0.1" name="contactLensBaseCurve" value={formData.contactLensBaseCurve} onChange={handleChange} className={inputClass} /></div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Đường kính (DIA) *</label><input required type="number" step="0.1" name="contactLensDiameter" value={formData.contactLensDiameter} onChange={handleChange} className={inputClass} /></div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Độ ngậm nước (%) *</label><input required type="number" name="contactLensWaterContent" value={formData.contactLensWaterContent} onChange={handleChange} className={inputClass} /></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-4">
                                            <div><label className="block text-xs text-gray-600 mb-1">Dải độ *</label><input required type="text" name="contactLensAvailablePowerRange" value={formData.contactLensAvailablePowerRange} onChange={handleChange} className={inputClass} /></div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Số lượng / Hộp *</label><input required type="number" name="contactLensQuantityPerBox" value={formData.contactLensQuantityPerBox} onChange={handleChange} className={inputClass} /></div>
                                            <div><label className="block text-xs text-gray-600 mb-1">Lịch thay thế *</label><input required type="text" name="contactLensReplacementSchedule" value={formData.contactLensReplacementSchedule} onChange={handleChange} className={inputClass} /></div>
                                        </div>
                                    </>
                                )}
                            </div>
                        )}

                    </form>
                </div>

                {/* Footer */}
                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-xl">
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
                        Hủy bỏ
                    </button>
                    <button type="submit" form="product-form" disabled={isSubmitting} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50">
                        {isSubmitting ? 'Đang xử lý...' : 'Lưu sản phẩm'}
                    </button>
                </div>
            </div>
        </div>
    );
}