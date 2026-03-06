import { useEffect, useState } from 'react';
import { Search, Plus, Pencil, Trash2, Filter } from 'lucide-react'; // Thêm icon Filter cho đẹp

interface Product {
  Product_ID: number;
  SKU: string;
  Product_Name: string;
  Type_Name: string;
  Brand_Name: string;
  Price: number;
  Description: string;
}

const formatPrice = (price: number) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);

export default function ManagerProductView() {
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("https://69a8008637caab4b8c606a09.mockapi.io/api/test");
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

  // LOGIC LỌC (Vừa tìm chữ, vừa khớp loại)
  const filtered = products.filter(p => {
    // Điều kiện 1: Khớp chữ tìm kiếm
    const matchSearch =
      p.Product_Name?.toLowerCase().includes(search.toLowerCase()) ||
      p.SKU?.toLowerCase().includes(search.toLowerCase()) ||
      p.Brand_Name?.toLowerCase().includes(search.toLowerCase());

    // Điều kiện 2: Khớp loại sản phẩm (Nếu selectedType rỗng thì coi như khớp hết)
    const matchType = selectedType === '' || p.Type_Name === selectedType;

    // Trả về sản phẩm thỏa mãn CẢ 2 điều kiện
    return matchSearch && matchType;
  });

  const handleDelete = (id: number) => {
    setProducts(prev => prev.filter(p => p.Product_ID !== id));
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
              className="pl-9 pr-8 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white cursor-pointer"
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
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Mã SP</th>
                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>SKU</th>
                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Tên sản phẩm</th>
                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Loại</th>
                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Thương hiệu</th>
                <th className="text-right px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Giá</th>
                <th className="text-left px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Mô tả</th>
                <th className="text-center px-4 py-3 text-gray-600" style={{ fontWeight: 600 }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-blue-500 font-medium">
                    Đang tải dữ liệu từ API...
                  </td>
                </tr>
              ) : filtered.length > 0 ? (
                filtered.map((product, idx) => (
                  <tr
                    key={product.Product_ID || idx}
                    className={`border-b border-gray-100 hover:bg-purple-50 transition-colors ${idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}`}
                  >
                    <td className="px-4 py-3 text-gray-500">#{product.Product_ID}</td>
                    <td className="px-4 py-3 text-purple-700" style={{ fontWeight: 600 }}>{product.SKU}</td>
                    <td className="px-4 py-3 text-gray-800 max-w-[200px]">
                      <div className="truncate" title={product.Product_Name}>{product.Product_Name}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="inline-block px-2 py-0.5 rounded-full text-xs bg-blue-100 text-blue-700">
                        {product.Type_Name}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-gray-700">{product.Brand_Name}</td>
                    <td className="px-4 py-3 text-right text-green-700" style={{ fontWeight: 600 }}>
                      {formatPrice(product.Price || 0)}
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
                          onClick={() => handleDelete(product.Product_ID)}
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

        <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between">
          <p className="text-xs text-gray-500">Hiển thị {filtered.length} / {products.length} sản phẩm</p>
          <div className="flex gap-1">
            <button className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Trước</button>
            <button className="px-3 py-1 text-xs bg-purple-600 text-white rounded">1</button>
            <button className="px-3 py-1 text-xs border border-gray-200 rounded hover:bg-gray-50">Sau</button>
          </div>
        </div>
      </div>
    </div>
  );
}