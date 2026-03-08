// ManagerProductView.tsx
import { useEffect, useState } from 'react';
import { api } from '@/lib/api'; 
import { Product } from './ManagerProductView/productConfig';
import { ProductHeader } from './ManagerProductView/ProductHeader';
import { ProductTable } from './ManagerProductView/ProductTable';
import { DeleteConfirmModal } from './ManagerProductView/DeleteConfirmModal';

export default function ManagerProductView() {
  // STATE DATA & LỌC
  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // STATE MODAL
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("api/products/search");
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedType]);

  // LOGIC LỌC
  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) || 
                        p.sku?.toLowerCase().includes(search.toLowerCase());
    const matchType = selectedType === '' || p.Product_Type === selectedType;
    return matchSearch && matchType;
  });

  // LOGIC PHÂN TRANG
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filtered.slice(startIndex, endIndex);

  // XỬ LÝ XÓA
  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (productToDelete === null) return;
    try {
      await api.delete(`api/products/${productToDelete}`);
      setProducts(prev => prev.filter(p => p.id !== productToDelete));
      setIsModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Lỗi 401: Vui lòng kiểm tra lại token đăng nhập hoặc quyền của bạn!");
      setIsModalOpen(false);
    }
  };

  return (
    <div className="p-6 h-full relative">
      <ProductHeader 
        search={search} 
        setSearch={setSearch} 
        selectedType={selectedType} 
        setSelectedType={setSelectedType} 
      />

      <ProductTable 
        loading={loading}
        currentItems={currentItems}
        filteredLength={filtered.length}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onDeleteClick={handleDeleteClick}
      />

      <DeleteConfirmModal 
        isOpen={isModalOpen}
        productId={productToDelete}
        onCancel={() => {
          setIsModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}