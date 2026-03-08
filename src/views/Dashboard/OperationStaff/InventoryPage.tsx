import React, { useState, useEffect } from "react";
import { Search, Filter } from "lucide-react";

// API để lấy tất cả các sản phẩm
async function fetchProducts(token: string) {
  const res = await fetch("https://69a8008637caab4b8c606a09.mockapi.io/api/test", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error("Không thể tải sản phẩm");
  }

  const data = await res.json();
  return data;
}

export default function InventoryPage() {
  const [products, setProducts] = useState<any[]>([]); // State để lưu danh sách sản phẩm
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]); // State để lưu sản phẩm đã lọc
  const [selectedType, setSelectedType] = useState<string>(""); // State để chọn loại sản phẩm
  const [search, setSearch] = useState(""); // State để tìm kiếm theo tên, SKU, thương hiệu
  const [loading, setLoading] = useState<boolean>(false); // State để hiển thị loading
  const [error, setError] = useState<string | null>(null); // State để hiển thị lỗi

  const token = localStorage.getItem("access_token"); // Lấy token từ localStorage

  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ, vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }

    const fetchAllProducts = async () => {
      setLoading(true);
      try {
        const fetchedProducts = await fetchProducts(token); // Lấy tất cả sản phẩm
        setProducts(fetchedProducts);
        setFilteredProducts(fetchedProducts); // Mặc định hiển thị tất cả sản phẩm
      } catch (error) {
        setError("Không thể tải sản phẩm.");
      } finally {
        setLoading(false);
      }
    };

    fetchAllProducts();
  }, [token]);

  useEffect(() => {
    const filtered = products.filter((product) => {
      const matchType = selectedType ? product.Type_Name === selectedType : true;

      const matchSearch =
        (product.Product_Name?.toLowerCase().includes(search.toLowerCase()) || "") ||
        (product.SKU?.toLowerCase().includes(search.toLowerCase()) || "") ||
        (product.Brand_Name?.toLowerCase().includes(search.toLowerCase()) || "");

      return matchType && matchSearch;
    });

    setFilteredProducts(filtered); // Cập nhật sản phẩm đã lọc
  }, [selectedType, search, products]);

  return (
    <div className="min-h-screen flex bg-gray-50">
      <div className="flex-1 p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">Hàng trong kho</h1>

        {loading && (
          <div className="flex justify-center items-center space-x-2">
            <div className="animate-spin rounded-full border-4 border-t-4 border-gray-200 w-16 h-16"></div>
            <span className="text-gray-500">Đang tải sản phẩm...</span>
          </div>
        )}
        {error && <p className="text-red-500">{error}</p>}

        {/* Tìm kiếm và lọc sản phẩm */}
        <div className="flex items-center gap-6 mb-8">
          <div className="relative flex items-center">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Tìm kiếm theo tên, SKU, hoặc thương hiệu"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9 pr-4 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white w-72"
            />
          </div>

          <div className="relative flex items-center">
            <Filter className="absolute left-3 h-5 w-5 text-gray-500" />
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="pl-9 pr-8 py-3 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 bg-white cursor-pointer"
            >
              <option value="">Tất cả phân loại</option>
              <option value="Gọng kính">Gọng kính</option>
              <option value="Tròng kính">Tròng kính</option>
              <option value="Kính áp tròng">Kính áp tròng</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto bg-white shadow-md rounded-xl">
          <table className="w-full text-sm text-left text-gray-500">
            <thead className="bg-purple-50 text-gray-600">
              <tr>
                <th className="p-4">Tên sản phẩm</th>
                <th className="p-4">Mã hàng</th>
                <th className="p-4">Thương hiệu</th>
                <th className="p-4">Loại</th>
                <th className="p-4">Số lượng</th>
              </tr>
            </thead>
            <tbody>
              {filteredProducts.length > 0 ? (
                filteredProducts.map((product, index) => (
                  <tr
                    key={product.Product_ID || `${product.SKU}-${index}`}
                    className={`border-b hover:bg-purple-100 transition-all ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                  >
                    <td className="px-4 py-3 text-gray-700">{product.Product_Name}</td>
                    <td className="px-4 py-3 text-purple-600 font-semibold">{product.SKU}</td>
                    <td className="px-4 py-3 text-gray-800">{product.Brand_Name}</td>
                    <td className="px-4 py-3 text-gray-600">{product.Type_Name}</td>
                    <td className="px-4 py-3 text-right text-green-700">{product.Quantity}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-12 text-gray-400">Không có sản phẩm nào</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
