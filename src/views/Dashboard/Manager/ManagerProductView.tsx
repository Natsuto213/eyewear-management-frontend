// ManagerProductView.tsx
import { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import { Product } from './ManagerProductView/productConfig';
import { ProductHeader } from './ManagerProductView/ProductHeader';
import { ProductTable } from './ManagerProductView/ProductTable';
import { DeleteConfirmModal } from './ManagerProductView/DeleteConfirmModal';
import { ProductModal } from './ManagerProductView/ProductModal';

export default function ManagerProductView() {
  // STATE DATA & LỌC
  const [search, setSearch] = useState('');
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // MODAL XÓA
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // MODAL THÊM / SỬA
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

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
  }, [search, selectedTypes, sortBy]);

  // LOGIC LỌC
  const filtered = products.filter(p => {
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());

    // Nếu mảng rỗng thì coi như khớp hết, nếu có chọn thì loại của product phải nằm trong mảng
    const matchType = selectedTypes.length === 0 || selectedTypes.includes(p.Product_Type);

    return matchSearch && matchType;
  });

  // LOGIC SẮP XẾP (Chạy trên mảng đã lọc)
  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
    return 0; // 'newest' - Giữ nguyên thứ tự gốc (hoặc xếp theo ID giảm dần tùy bạn)
  });

  // LOGIC PHÂN TRANG
  const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  // Dùng sortedAndFiltered thay vì filtered
  const currentItems = sortedAndFiltered.slice(startIndex, endIndex);

  // XỬ LÝ XÓA
  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // GỌI API KHI BẤM ĐỒNG Ý XÓA TỪ MODAL
  const handleConfirmDelete = async () => {
    if (productToDelete === null) return;
    try {
      await api.delete(`api/products/${productToDelete}`);
      setProducts(prev => prev.filter(p => p.id !== productToDelete));
      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Lỗi 401: Vui lòng kiểm tra lại token đăng nhập hoặc quyền của bạn!");
      setIsDeleteModalOpen(false);
    }
  };

  // XỬ LÝ MỞ MODAL THÊM/SỬA
  const handleAddClick = () => {
    setEditingProduct(null);
    setIsFormModalOpen(true);
  };

  const handleEditClick = (product: Product) => {
    setEditingProduct(product);
    setIsFormModalOpen(true);
  };

  // GỌI API KHI BẤM LƯU TỪ MODAL
  const handleSaveProduct = async (formData: any) => {
    if (editingProduct) {
      // Gọi API SỬA (PUT) theo tài liệu của bạn
      try {
        await api.put('api/products', formData);

        // Cập nhật lại UI không cần reload trang
        setProducts(prev => prev.map(p => p.id === formData.id ? {
          ...p,
          sku: formData.sku,
          name: formData.name,
          price: formData.price,
          description: formData.description,
          Brand: formData.brandName, // Ánh xạ ngược lại interface
          Product_Type: formData.typeName
        } : p));

        setIsFormModalOpen(false);
      } catch (error) {
        console.error("Lỗi khi sửa sản phẩm:", error);
        alert("Có lỗi xảy ra khi cập nhật!");
      }
    } else {
      // (Mock log ra console)
      console.log("Dữ liệu thêm mới nè:", formData);
      alert("Giao diện Thêm mới ok! Đang chờ bạn nối API Add.");
      setIsFormModalOpen(false);
    }
  };

  return (
    <div className="p-6 h-full relative">
      <ProductHeader
        search={search}
        setSearch={setSearch}
        // Truyền props mới vào
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAddClick={handleAddClick}
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
        onEditClick={handleEditClick}
      />

      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        productId={productToDelete}
        onCancel={() => {
          setIsDeleteModalOpen(false);
          setProductToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
      />

      <ProductModal
        isOpen={isFormModalOpen}
        initialData={editingProduct}
        onClose={() => setIsFormModalOpen(false)}
        onSave={handleSaveProduct}
      />
    </div>
  );
}