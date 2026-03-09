import { useState, useEffect } from 'react';
import { Product } from './productConfig';
import { X } from 'lucide-react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
  initialData: Product | null; // Nếu có data -> Sửa, Nếu null -> Thêm
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
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Load dữ liệu khi mở modal (Nạp data cũ nếu là Edit)
  useEffect(() => {
    if (initialData && isOpen) {
      setFormData({
        id: initialData.id,
        sku: initialData.sku || '',
        name: initialData.name || '',
        price: initialData.price || 0,
        description: initialData.description || '',
        brandName: initialData.Brand || '', // Map lại theo API của bạn
        typeName: initialData.Product_Type || 'Gọng kính', // Map lại theo API của bạn
      });
    } else if (!initialData && isOpen) {
      // Reset form nếu là Add mới
      setFormData({ id: 0, sku: '', name: '', price: 0, description: '', brandName: '', typeName: 'Gọng kính' });
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await onSave(formData);
    setIsSubmitting(false);
  };

  const isEditMode = !!initialData;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-xl w-[500px] max-w-[90%] max-h-[90vh] flex flex-col">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-bold text-gray-800">
            {isEditMode ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm mới'}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1">
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto">
          <form id="product-form" onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">SKU *</label>
                <input required type="text" name="sku" value={formData.sku} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Tên sản phẩm *</label>
                <input required type="text" name="name" value={formData.name} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Thương hiệu</label>
                <input type="text" name="brandName" value={formData.brandName} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Loại sản phẩm</label>
                <select name="typeName" value={formData.typeName} onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white">
                  <option value="Gọng kính">Gọng kính</option>
                  <option value="Tròng kính">Tròng kính</option>
                  <option value="Kính áp tròng">Kính áp tròng</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Giá (VNĐ) *</label>
              <input required type="number" min="0" name="price" value={formData.price} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400" />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả</label>
              <textarea rows={3} name="description" value={formData.description} onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none" />
            </div>
          </form>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-xl">
          <button type="button" onClick={onClose} disabled={isSubmitting}
            className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">
            Hủy bỏ
          </button>
          <button type="submit" form="product-form" disabled={isSubmitting}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50">
            {isSubmitting ? 'Đang lưu...' : 'Lưu sản phẩm'}
          </button>
        </div>
      </div>
    </div>
  );
}