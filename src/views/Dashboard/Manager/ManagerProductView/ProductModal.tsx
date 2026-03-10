// ManagerProductView/ProductModal.tsx
import { useState, useEffect } from 'react';
import { Product } from './productConfig';
import { X, Upload, Image as ImageIcon } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData: Product | null; 
}

export function ProductModal({ isOpen, onClose, onSave, initialData }: Props) {
  const [formData, setFormData] = useState({
    id: 0,
    sku: '',
    name: '',
    price: 0,
    description: '',
    brandName: '',
    typeName: 'Gọng kính',
  });
  
  // STATE QUẢN LÝ NHIỀU ẢNH (Dùng mảng Array)
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        id: initialData.id,
        sku: initialData.sku || '',
        name: initialData.name || '',
        price: initialData.price || 0,
        description: initialData.description || '',
        brandName: initialData.Brand || '', 
        typeName: initialData.Product_Type || 'Gọng kính', 
      });
      // Hiện ảnh cũ nếu đang Edit (InitialData hiện tại chỉ có 1 link ảnh)
      setImagePreviews(initialData.Image_URL ? [initialData.Image_URL] : []);
      setImageFiles([]);
    } else if (!initialData && isOpen) {
      setFormData({ id: 0, sku: '', name: '', price: 0, description: '', brandName: '', typeName: 'Gọng kính' });
      // Xóa sạch list ảnh nếu Add mới
      setImagePreviews([]);
      setImageFiles([]);
    }
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' ? Number(value) : value
    }));
  };

  // XỬ LÝ KHI CHỌN NHIỀU ẢNH CÙNG LÚC
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      
      // Thêm file mới vào mảng file hiện tại
      setImageFiles(prev => [...prev, ...filesArray]);
      
      // Tạo link preview cho các file mới và gộp vào mảng preview
      const newPreviews = filesArray.map(file => URL.createObjectURL(file));
      setImagePreviews(prev => [...prev, ...newPreviews]);
    }
  };

  // HÀM XÓA ẢNH ĐÃ CHỌN
  const removeImage = (indexToRemove: number) => {
    setImageFiles(prev => prev.filter((_, index) => index !== indexToRemove));
    setImagePreviews(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Bắt buộc phải có ít nhất 1 ảnh khi thêm mới
    if (!initialData && imageFiles.length === 0) {
        return alert("Vui lòng chọn ít nhất 1 hình ảnh cho sản phẩm mới!");
    }

    setIsSubmitting(true);
    // Truyền mảng imageFiles ra ngoài
    await onSave({ ...formData, imageFiles });
    setIsSubmitting(false);
  };

  const isEditMode = !!initialData;
  const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity p-4">
      <div className="bg-white rounded-xl shadow-xl w-[600px] max-w-full max-h-[95vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-5">
            
            {/* KHU VỰC UPLOAD NHIỀU ẢNH */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Hình ảnh sản phẩm {!isEditMode && '*'} <span className="text-gray-400 font-normal">(Có thể chọn nhiều ảnh)</span>
              </label>
              
              <div className="flex flex-wrap gap-3">
                {/* Nút bấm Chọn Ảnh */}
                <label className="w-20 h-20 shrink-0 border-2 border-dashed border-purple-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-purple-50 hover:border-purple-500 transition-colors text-purple-600">
                    <Upload className="h-5 w-5 mb-1" />
                    <span className="text-[10px] font-medium">Tải lên</span>
                    {/* THUỘC TÍNH multiple CHO PHÉP CHỌN NHIỀU */}
                    <input type="file" multiple accept="image/*" onChange={handleImageChange} className="hidden" />
                </label>

                {/* Danh sách ảnh Preview */}
                {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="w-20 h-20 relative rounded-xl border border-gray-200 overflow-hidden bg-gray-50 group">
                        <img src={preview} alt={`Preview ${idx}`} className="w-full h-full object-cover" />
                        {/* Nút Xóa (chỉ hiện khi hover hoặc trên mảng up mới) */}
                        <button 
                            type="button" 
                            onClick={() => removeImage(idx)}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity"
                            title="Xóa ảnh này"
                        >
                            <X className="h-3 w-3" />
                        </button>
                    </div>
                ))}
              </div>
            </div>

            {/* CÁC TRƯỜNG NHẬP LIỆU KHÁC (Giữ nguyên) */}
            <div className="grid grid-cols-2 gap-4 pt-2 border-t border-gray-100">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input required type="text" name="sku" value={formData.sku} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                <input type="text" name="brandName" value={formData.brandName} onChange={handleChange} className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại sản phẩm</label>
                <select name="typeName" value={formData.typeName} onChange={handleChange} className={inputClass}>
                  <option value="Gọng kính">Gọng kính</option>
                  <option value="Tròng kính">Tròng kính</option>
                  <option value="Kính áp tròng">Kính áp tròng</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) *</label>
              <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange} className={inputClass} />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea rows={3} name="description" value={formData.description} onChange={handleChange} className={`${inputClass} resize-none`} />
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Hủy bỏ
          </button>
          <button type="submit" form="product-form" disabled={isSubmitting} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50">
            {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
}