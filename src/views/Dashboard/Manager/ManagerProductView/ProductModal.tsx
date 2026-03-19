// ManagerProductView/ProductModal.tsx
import { useState, useEffect } from 'react';
import { Product } from './productConfig';
import { X, Upload, AlertCircle } from 'lucide-react';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (data: any) => Promise<void>;
    initialData: Product | null;
    showPopup: (message: string, type: 'success' | 'error') => void;
}

// ─── ĐƯA INPUT FIELD RA NGOÀI ĐỂ KHÔNG BỊ RENDER LẠI GÂY MẤT FOCUS ───
const InputField = ({ label, name, type = "text", placeholder = "", required = false, step = "", min = "", value, onChange, error }: any) => {
    const hasError = !!error;
    const displayValue = (value === 0 && type === 'number') ? '' : value;

    return (
        <div className="flex flex-col relative">
            <label className={`block text-xs font-medium mb-1 ${hasError ? 'text-red-600' : 'text-gray-700'}`}>
                {label} {required && '*'}
            </label>
            <div className="relative">
                <input 
                    type={type} 
                    name={name} 
                    placeholder={placeholder} 
                    value={displayValue} 
                    onChange={onChange} 
                    step={step}
                    min={min}
                    className={`w-full px-3 py-2 border rounded-lg text-sm focus:outline-none focus:ring-2 transition-colors bg-white
                        ${hasError 
                            ? 'border-red-400 focus:ring-red-200 bg-red-50 text-red-900 placeholder-red-300' 
                            : 'border-gray-300 focus:ring-purple-400'}`} 
                />
                {hasError && <AlertCircle className="absolute right-2 top-2.5 w-4 h-4 text-red-500" />}
            </div>
            {hasError && <span className="text-[10px] text-red-600 mt-1 font-medium absolute -bottom-4 left-0">{error}</span>}
        </div>
    );
};

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
    
    // STATE LƯU TRỮ LỖI CỦA TỪNG TRƯỜNG DỮ LIỆU
    const [errors, setErrors] = useState<Record<string, string>>({});

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
            setErrors({}); // Xóa lỗi khi mở modal

        } else if (!initialData && isOpen) {
            setFormData({
                id: 0, sku: '', name: '', price: 0, costPrice: 0, description: '', brandName: '', typeName: 'Gọng kính', allowPreorder: false, isActive: true,
                frameColor: '', frameTempleLength: 0, frameLensWidth: 0, frameBridgeWidth: 0, frameShapeName: '', frameMaterialName: '', frameDescription: '',
                lensTypeName: 'Đơn tròng', lensIndexValue: 0, lensDiameter: 0, lensAvailablePowerRange: '', lensIsBlueLightBlock: false, lensIsPhotochromic: false, lensDescription: '',
                contactLensUsageType: '', contactLensBaseCurve: 0, contactLensDiameter: 0, contactLensWaterContent: 0, contactLensAvailablePowerRange: '', contactLensQuantityPerBox: 0, contactLensMaterial: '', contactLensReplacementSchedule: '', contactLensColor: ''
            });
            setImagePreviews([]);
            setImageFiles([]);
            setErrors({}); // Xóa lỗi khi mở modal
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    // HÀM KIỂM TRA LỖI TỪNG TRƯỜNG (REAL-TIME VALIDATION)
    const validateField = (name: string, value: any, currentTypeName: string) => {
        let errorMsg = '';

        // Validate chung
        if (['sku', 'name', 'brandName'].includes(name) && !value.toString().trim()) {
            errorMsg = 'Bắt buộc nhập';
        }
        if (['price', 'costPrice'].includes(name) && Number(value) < 0) {
            errorMsg = 'Giá không được âm';
        }

        // Validate Tròng kính
        if (currentTypeName === 'Tròng kính') {
            if (name === 'lensIndexValue') {
                const val = Number(value);
                if (val < 1.5 || val > 1.74) errorMsg = 'Chiết suất (1.5 - 1.74)';
            }
            if (name === 'lensDiameter' && Number(value) <= 0) {
                errorMsg = 'Đường kính phải > 0';
            }
            if (name === 'lensAvailablePowerRange' && !value.toString().trim()) {
                errorMsg = 'Bắt buộc nhập';
            }
        }

        // Validate Kính áp tròng
        if (currentTypeName === 'Kính áp tròng') {
            if (name === 'contactLensWaterContent') {
                const val = Number(value);
                if (val < 0 || val > 100) errorMsg = 'Độ ngậm nước (0 - 100%)';
            }
            if (name === 'contactLensBaseCurve') {
                const val = Number(value);
                if (val < 8.0 || val > 9.0) errorMsg = 'Bán kính (8.0 - 9.0)';
            }
            if (name === 'contactLensDiameter' && Number(value) <= 0) {
                errorMsg = 'Đường kính phải > 0';
            }
            if (name === 'contactLensQuantityPerBox' && Number(value) <= 0) {
                errorMsg = 'Số lượng phải > 0';
            }
            if (['contactLensUsageType', 'contactLensColor', 'contactLensMaterial', 'contactLensAvailablePowerRange', 'contactLensReplacementSchedule'].includes(name) && !value.toString().trim()) {
                errorMsg = 'Bắt buộc nhập';
            }
        }

        // Validate Gọng kính
        if (currentTypeName === 'Gọng kính') {
             if (['frameColor', 'frameShapeName', 'frameMaterialName'].includes(name) && !value.toString().trim()) {
                errorMsg = 'Bắt buộc nhập';
            }
            if (['frameTempleLength', 'frameLensWidth', 'frameBridgeWidth'].includes(name) && Number(value) <= 0) {
                errorMsg = 'Phải > 0';
            }
        }

        return errorMsg;
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, type, value } = e.target;

        if (type === 'checkbox') {
            const checked = (e.target as HTMLInputElement).checked;
            setFormData(prev => ({ ...prev, [name]: checked }));
            return;
        }

        const numberFields = ['price', 'costPrice', 'frameTempleLength', 'frameLensWidth', 'frameBridgeWidth', 'lensIndexValue', 'lensDiameter', 'contactLensBaseCurve', 'contactLensDiameter', 'contactLensWaterContent', 'contactLensQuantityPerBox'];
        
        const finalValue = numberFields.includes(name) ? Number(value) : value;

        setFormData(prev => ({
            ...prev,
            [name]: finalValue
        }));

        // Gọi hàm kiểm tra lỗi ngay lập tức
        const errorMsg = validateField(name, finalValue, formData.typeName);
        setErrors(prev => ({
            ...prev,
            [name]: errorMsg
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

    const isImageEmpty = imagePreviews.length === 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (isImageEmpty) {
            showPopup("Vui lòng thêm ít nhất 1 hình ảnh cho sản phẩm!", "error");
            return; 
        }

        // KIỂM TRA LỖI TOÀN BỘ FORM TRƯỚC KHI SUBMIT
        let hasError = false;
        const newErrors: Record<string, string> = {};

        Object.keys(formData).forEach(key => {
            const errorMsg = validateField(key, (formData as any)[key], formData.typeName);
            if (errorMsg) {
                newErrors[key] = errorMsg;
                hasError = true;
            }
        });

        setErrors(newErrors);

        if (hasError) {
            showPopup("Vui lòng kiểm tra lại các trường dữ liệu bị báo đỏ!", "error");
            return;
        }

        setIsSubmitting(true);
        await onSave({ ...formData, imageFiles });
        setIsSubmitting(false);
    };

    const isEditMode = !!initialData;

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
                    <form id="product-form" onSubmit={handleSubmit} className="space-y-7">

                        {/* THÔNG TIN CHUNG */}
                        <div className="space-y-5">
                            <h4 className="font-semibold text-purple-700 border-b pb-2">1. Thông tin chung</h4>

                            {/* Khu vực up ảnh */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hình ảnh sản phẩm <span className="text-red-500">*</span>
                                </label>
                                <div className="flex flex-wrap gap-3 items-start">
                                    <label className={`w-20 h-20 shrink-0 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors
                                        ${isImageEmpty 
                                            ? 'border-red-400 bg-red-50 text-red-500 hover:border-red-500 hover:bg-red-100' 
                                            : 'border-purple-300 text-purple-600 hover:bg-purple-50 hover:border-purple-500'
                                        }`}
                                    >
                                        <Upload className="h-5 w-5 mb-1" />
                                        <span className="text-[10px] font-medium">Tải lên</span>
                                        <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                                    </label>
                                    
                                    {imagePreviews.map((preview, idx) => (
                                        <div key={idx} className="w-20 h-20 relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 group shadow-sm">
                                            <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                                            <button type="button" onClick={() => removeImage(idx)} className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity shadow">
                                                <X className="h-3 w-3" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                {isImageEmpty && (
                                    <p className="text-xs text-red-500 mt-2 font-medium">Vui lòng thêm ít nhất 1 hình ảnh sản phẩm.</p>
                                )}
                            </div>

                            <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                                <div><InputField label="SKU" name="sku" value={formData.sku} onChange={handleChange} error={errors.sku} placeholder="RB1024" required /></div>
                                <div className="col-span-2"><InputField label="Tên sản phẩm" name="name" value={formData.name} onChange={handleChange} error={errors.name} placeholder="Gọng Kính Aviator Classic" required /></div>
                            </div>

                            <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                                <div><InputField label="Thương hiệu" name="brandName" value={formData.brandName} onChange={handleChange} error={errors.brandName} placeholder="Ray-Ban, Gucci" required /></div>
                                <div><InputField label="Giá bán (VNĐ)" name="price" type="number" min="0" value={formData.price} onChange={handleChange} error={errors.price} placeholder="1500000" required /></div>
                                <div><InputField label="Giá nhập (VNĐ)" name="costPrice" type="number" min="0" value={formData.costPrice} onChange={handleChange} error={errors.costPrice} placeholder="800000" /></div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 items-center">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loại sản phẩm *</label>
                                    <select name="typeName" value={formData.typeName} onChange={handleChange} disabled={isEditMode} className={`w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white ${isEditMode ? 'bg-gray-100 cursor-not-allowed text-gray-500' : ''}`}>
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
                                <textarea rows={2} name="description" placeholder="Nhập mô tả nổi bật của sản phẩm..." value={formData.description} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white resize-none" />
                            </div>
                        </div>

                        {/* CHỈ HIỂN THỊ THÔNG SỐ KỸ THUẬT KHI ĐANG ADD MỚI */}
                        {!isEditMode && (
                            <div className="space-y-6 bg-purple-50/30 p-5 rounded-xl border border-purple-100 mt-6">
                                <h4 className="font-semibold text-purple-700 mb-2">2. Thông số kỹ thuật ({formData.typeName})</h4>

                                {/* GỌNG KÍNH */}
                                {formData.typeName === 'Gọng kính' && (
                                    <>
                                        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                                            <div><InputField label="Màu sắc" name="frameColor" value={formData.frameColor} onChange={handleChange} error={errors.frameColor} placeholder="Đen nhám" required /></div>
                                            <div><InputField label="Kiểu dáng" name="frameShapeName" value={formData.frameShapeName} onChange={handleChange} error={errors.frameShapeName} placeholder="Tròn, Vuông" required /></div>
                                            <div><InputField label="Chất liệu" name="frameMaterialName" value={formData.frameMaterialName} onChange={handleChange} error={errors.frameMaterialName} placeholder="Nhựa TR90" required /></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                                            <div><InputField label="Độ dài càng kính (mm)" name="frameTempleLength" type="number" value={formData.frameTempleLength} onChange={handleChange} error={errors.frameTempleLength} placeholder="VD: 145" required /></div>
                                            <div><InputField label="Độ rộng tròng (mm)" name="frameLensWidth" type="number" value={formData.frameLensWidth} onChange={handleChange} error={errors.frameLensWidth} placeholder="VD: 52" required /></div>
                                            <div><InputField label="Cầu kính (mm)" name="frameBridgeWidth" type="number" value={formData.frameBridgeWidth} onChange={handleChange} error={errors.frameBridgeWidth} placeholder="VD: 18" required /></div>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1">Mô tả gọng kính</label>
                                            <textarea rows={2} name="frameDescription" placeholder="Càng kính bọc đệm silicon..." value={formData.frameDescription} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white resize-none" />
                                        </div>
                                    </>
                                )}

                                {/* TRÒNG KÍNH */}
                                {formData.typeName === 'Tròng kính' && (
                                    <>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                            <div>
                                                <label className="block text-xs font-medium text-gray-700 mb-1">Loại tròng *</label>
                                                <select required name="lensTypeName" value={formData.lensTypeName} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white">
                                                    <option value="Đơn tròng">Đơn tròng</option>
                                                    <option value="Đa tròng">Đa tròng</option>
                                                    <option value="Đổi màu">Đổi màu</option>
                                                </select>
                                            </div>
                                            <div><InputField label="Dải độ sẵn có" name="lensAvailablePowerRange" value={formData.lensAvailablePowerRange} onChange={handleChange} error={errors.lensAvailablePowerRange} placeholder="VD: -0.00 đến -6.00" required /></div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-x-4 gap-y-6">
                                            <div><InputField label="Chiết suất" name="lensIndexValue" type="number" step="0.01" value={formData.lensIndexValue} onChange={handleChange} error={errors.lensIndexValue} placeholder="VD: 1.56 (Từ 1.5 đến 1.74)" required /></div>
                                            <div><InputField label="Đường kính (mm)" name="lensDiameter" type="number" value={formData.lensDiameter} onChange={handleChange} error={errors.lensDiameter} placeholder="VD: 70" required /></div>
                                        </div>
                                        <div className="flex gap-6 mt-2">
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="lensIsBlueLightBlock" checked={formData.lensIsBlueLightBlock} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded" /><span className="text-sm font-medium">Chống ánh sáng xanh</span></label>
                                            <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" name="lensIsPhotochromic" checked={formData.lensIsPhotochromic} onChange={handleChange} className="w-4 h-4 text-purple-600 rounded" /><span className="text-sm font-medium">Có đổi màu</span></label>
                                        </div>
                                        <div>
                                            <label className="block text-xs font-medium text-gray-700 mb-1 mt-2">Mô tả tròng kính</label>
                                            <textarea rows={2} name="lensDescription" placeholder="Phủ lớp chống chói..." value={formData.lensDescription} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white resize-none" />
                                        </div>
                                    </>
                                )}

                                {/* KÍNH ÁP TRÒNG */}
                                {formData.typeName === 'Kính áp tròng' && (
                                    <>
                                        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                                            <div><InputField label="Loại sử dụng" name="contactLensUsageType" value={formData.contactLensUsageType} onChange={handleChange} error={errors.contactLensUsageType} placeholder="Trong suốt" required /></div>
                                            <div><InputField label="Màu sắc" name="contactLensColor" value={formData.contactLensColor} onChange={handleChange} error={errors.contactLensColor} placeholder="Xanh Blue" required /></div>
                                            <div><InputField label="Chất liệu" name="contactLensMaterial" value={formData.contactLensMaterial} onChange={handleChange} error={errors.contactLensMaterial} placeholder="Silicone Hydrogel" required /></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                                            <div><InputField label="Bán kính cong (BC)" name="contactLensBaseCurve" type="number" step="0.1" value={formData.contactLensBaseCurve} onChange={handleChange} error={errors.contactLensBaseCurve} placeholder="VD: 8.6 (Từ 8.0 đến 9.0)" required /></div>
                                            <div><InputField label="Đường kính (DIA)" name="contactLensDiameter" type="number" step="0.1" value={formData.contactLensDiameter} onChange={handleChange} error={errors.contactLensDiameter} placeholder="VD: 14.2" required /></div>
                                            <div><InputField label="Độ ngậm nước (%)" name="contactLensWaterContent" type="number" value={formData.contactLensWaterContent} onChange={handleChange} error={errors.contactLensWaterContent} placeholder="VD: 38 (Từ 0 đến 100)" required /></div>
                                        </div>
                                        <div className="grid grid-cols-3 gap-x-4 gap-y-6">
                                            <div><InputField label="Dải độ" name="contactLensAvailablePowerRange" value={formData.contactLensAvailablePowerRange} onChange={handleChange} error={errors.contactLensAvailablePowerRange} placeholder="VD: 0.00 đến -8.00" required /></div>
                                            <div><InputField label="Số lượng / Hộp" name="contactLensQuantityPerBox" type="number" value={formData.contactLensQuantityPerBox} onChange={handleChange} error={errors.contactLensQuantityPerBox} placeholder="VD: 30" required /></div>
                                            <div><InputField label="Lịch thay thế" name="contactLensReplacementSchedule" value={formData.contactLensReplacementSchedule} onChange={handleChange} error={errors.contactLensReplacementSchedule} placeholder="VD: 1 ngày" required /></div>
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
                    <button type="submit" form="product-form" disabled={isSubmitting || isImageEmpty} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                        {isSubmitting ? 'Đang xử lý...' : 'Lưu sản phẩm'}
                    </button>
                </div>
            </div>
        </div>
    );
}