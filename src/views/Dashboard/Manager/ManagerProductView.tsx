import { useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Filter } from 'lucide-react'; 

interface Product {
  id: number;
  name: string;
  Product_Type: string;
  Brand: string;
  price: number;
  Description: string;
  SKU: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

const productTypeConfig: Record<string, string> = {
  'Gọng kính': 'bg-blue-100 text-blue-700',        // Xanh dương
  'Tròng kính': 'bg-emerald-100 text-emerald-700', // Xanh ngọc / Xanh lá
  'Kính áp tròng': 'bg-pink-100 text-pink-700',    // Hồng
};

export default function ManagerProductView() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // STATE CHO PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10; // Cố định 10 sản phẩm 1 trang

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://api-eyewear.purintech.id.vn/api/products/search");
        if (!response.ok) {
          throw new Error("Không tìm thấy api");
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // RESET VỀ TRANG 1 NẾU TÌM KIẾM HOẶC LỌC THAY ĐỔI
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedType]);

  // LOGIC LỌC (Vừa tìm chữ, vừa khớp loại)
  const filtered = products.filter(p => {
    const matchSearch =
      p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.SKU?.toLowerCase().includes(search.toLowerCase());

    const matchType = selectedType === '' || p.Product_Type === selectedType;

    return matchSearch && matchType;
  });

  // TOÁN HỌC PHÂN TRANG
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Cắt ra 10 sản phẩm tương ứng với trang hiện tại
  const currentItems = filtered.slice(startIndex, endIndex);

  const handleDelete = (id: number) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  return (
    <div className="p-6 h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-xl text-gray-800 uppercase tracking-wide" style={{ fontWeight: 700 }}>
          Danh sách sản phẩm
        </h1>

        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white w-56"
            />
          </div>

          <div className="relative flex items-center">
            <Filter className="absolute left-3 h-4 w-4 text-gray-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white cursor-pointer appearance-none"
            >
              <option value="">Tất cả phân loại</option>
              <option value="Gọng kính">Gọng kính</option>
              <option value="Tròng kính">Tròng kính</option>
              <option value="Kính áp tròng">Kính áp tròng</option>
            </select>
          </div>

          <button className="flex items-center gap-2 bg-purple-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-purple-700 transition-colors">
            <Plus className="h-4 w-4" />
            Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">

         {/* THANH ĐIỀU HƯỚNG PHÂN TRANG */}
        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">
            Hiển thị {filtered.length === 0 ? 0 : startIndex + 1}-{Math.min(endIndex, filtered.length)} / {filtered.length} sản phẩm
          </p>
          <div className="flex gap-1">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1 || totalPages === 0}
              className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Trước
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`px-3 py-1 text-xs rounded transition-colors ${currentPage === page
                    ? 'bg-purple-600 text-white font-medium'
                    : 'border border-gray-200 text-gray-600 hover:bg-gray-50'
                  }`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages || totalPages === 0}
              className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Sau
            </button>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 ">
                <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Mã SP</th>
                <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>SKU</th>
                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Tên sản phẩm</th>
                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Loại</th>
                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Thương hiệu</th>
                <th className="text-right px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Giá</th>
                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Mô tả</th>
                <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {/* Map qua currentItems thay vì filtered */}
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-blue-500 font-medium">
                    Đang tải dữ liệu từ API...
                  </td>
                </tr>
              ) : currentItems.length > 0 ? (
                currentItems.map((product, idx) => (
                  <tr
                    key={product.id || idx}
                    className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                  >
                    <td className="px-4 py-3 text-gray-500 text-center">{product.id}</td>
                    <td className="px-4 py-3 text-purple-700 text-center" style={{ fontWeight: 600 }}>{product.SKU}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-[200px]">
                      <div className="truncate" title={product.name}>{product.name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${productTypeConfig[product.Product_Type] || 'bg-gray-100 text-gray-700'}`}>
                        {product.Product_Type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{product.Brand}</td>
                    <td className="px-4 py-3 text-right text-green-700" style={{ fontWeight: 600 }}>
                      {formatPrice(product.price || 0)}
                    </td>
                    <td className="px-4 py-3 text-gray-500 max-w-[180px]">
                      <div className="truncate text-xs" title={product.Description}>{product.Description}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button className="text-blue-500 hover:text-blue-700 transition-colors p-1 rounded hover:bg-blue-50">
                          <Pencil className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(product.id)}
                          className="text-red-400 hover:text-red-600 transition-colors p-1 rounded hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-gray-400">
                    Không tìm thấy sản phẩm nào
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}