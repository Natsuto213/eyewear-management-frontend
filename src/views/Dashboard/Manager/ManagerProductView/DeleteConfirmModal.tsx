// DeleteConfirmModal.tsx
import { AlertTriangle } from 'lucide-react';

interface Props {
  isOpen: boolean;
  productId: number | null;
  onCancel: () => void;
  onConfirm: () => void;
}

export function DeleteConfirmModal({ isOpen, productId, onCancel, onConfirm }: Props) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
      <div className="bg-white rounded-xl shadow-xl p-6 w-[400px] max-w-[90%] transform transition-all scale-100 opacity-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-gray-900 mb-2">Xác nhận xóa sản phẩm</h3>
          <p className="text-sm text-gray-500 mb-6">
            Bạn có chắc chắn muốn xóa sản phẩm mang mã <span className="font-semibold text-gray-700">{productId}</span> này không? Hành động này không thể hoàn tác.
          </p>

          <div className="flex items-center gap-3 w-full">
            <button
              onClick={onCancel}
              className="flex-1 px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium text-sm"
            >
              Hủy bỏ
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-medium text-sm shadow-sm"
            >
              Có, xóa ngay
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}