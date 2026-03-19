// ManagerProductView/ProductTable.tsx
import { Pencil, Trash2, RotateCcw } from 'lucide-react';
<<<<<<< HEAD
import { Product, productTypeConfig } from './ProductConfig';
=======
import { Product } from './ProductConfig';
>>>>>>> 1e27a5f5de481f8636f149811b315ffa09a38586

interface Props {
  loading: boolean;
  currentItems: Product[];
  filteredLength: number;
  startIndex: number;
  endIndex: number;
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  onDeleteClick: (id: number) => void;
  onEditClick: (product: Product) => void;
  onRestoreClick: (product: Product) => void;
}

export function ProductTable({
  loading, currentItems, filteredLength, startIndex, endIndex,
  currentPage, totalPages, setCurrentPage, onDeleteClick, onEditClick, onRestoreClick
}: Props) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mb-6">

      {/* THANH CHUYỂN TRANG */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-500">Hiển thị {filteredLength === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredLength)} / {filteredLength} sản phẩm</p>
        <div className="flex gap-1">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || totalPages === 0} className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Trước</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 text-xs rounded transition-colors ${currentPage === page ? 'bg-purple-600 text-white font-medium' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Sau</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>ID</th>
              <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Ảnh</th>
              <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Tên sản phẩm</th>
              <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>SKU</th>
              <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Thương hiệu</th>
              <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Loại</th>
              <th className="text-right px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Giá</th>
              <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Trạng thái</th>
              <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={9} className="text-center py-12 text-purple-600 font-medium">Đang tải danh sách sản phẩm...</td></tr>
            ) : currentItems.length > 0 ? (
              currentItems.map((p, idx) => {
                const isInactive = p.isActive === false;

                // Lấy class màu từ config, nếu loại nào chưa có trong config thì cho màu xám mặc định
                const typeColorClass = productTypeConfig[p.Product_Type] || 'bg-gray-100 text-gray-700';

                return (
                  <tr
                    key={p.id || idx}
                    className={`border-b border-gray-100 transition-colors ${isInactive ? 'bg-gray-100/60 opacity-75' : 'hover:bg-purple-50 bg-white'}`}
                  >
                    <td className="px-4 py-3 text-gray-500 text-center font-medium">#{p.id}</td>
                    <td className="px-4 py-3 text-center">
                      <img src={p.Image_URL} alt={p.name} className={`w-10 h-10 object-cover rounded mx-auto ${isInactive ? 'grayscale' : ''}`} />
                    </td>
                    <td className="px-4 py-3 text-gray-800" style={{ fontWeight: 600 }}>
                      {p.name}
                    </td>
                    <td className="px-4 py-3 text-gray-600">{p.sku}</td>
                    <td className="px-4 py-3 text-gray-600">{p.Brand}</td>

                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${typeColorClass}`}>
                        {p.Product_Type}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-gray-800 text-right font-medium">
                      {p.price?.toLocaleString()}đ
                    </td>

                    <td className="px-4 py-3 text-center">
                      {isInactive ? (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-600">Đã ẩn</span>
                      ) : (
                        <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">Đang bán</span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-1">
                        <button onClick={() => onEditClick(p)} className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50" title="Sửa">
                          <Pencil className="h-4 w-4" />
                        </button>

                        {isInactive ? (
                          <button onClick={() => onRestoreClick(p)} className="text-green-500 hover:text-green-700 transition-colors p-1 rounded hover:bg-green-50" title="Mở bán lại">
                            <RotateCcw className="h-4 w-4" />
                          </button>
                        ) : (
                          <button onClick={() => onDeleteClick(p.id)} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50" title="Ẩn/Xóa sản phẩm">
                            <Trash2 className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr><td colSpan={9} className="text-center py-12 text-gray-400">Không tìm thấy sản phẩm nào</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* THANH CHUYỂN TRANG */}
      <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
        <p className="text-xs text-gray-500">Hiển thị {filteredLength === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filteredLength)} / {filteredLength} sản phẩm</p>
        <div className="flex gap-1">
          <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1 || totalPages === 0} className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Trước</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
            <button key={page} onClick={() => setCurrentPage(page)} className={`px-3 py-1 text-xs rounded transition-colors ${currentPage === page ? 'bg-purple-600 text-white font-medium' : 'border border-gray-200 text-gray-600 hover:bg-gray-50'}`}>{page}</button>
          ))}
          <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages || totalPages === 0} className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">Sau</button>
        </div>
      </div>

    </div>
  );
}