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
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [sortBy, setSortBy] = useState('newest');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // STATE PHÂN TRANG
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // MODAL THÊM / SỬA
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // MODAL XÓA
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [productToDelete, setProductToDelete] = useState<number | null>(null);

  // LOGIC LỌC
  const filtered = products.filter(p => {
    // 1. Lọc theo chữ
    const matchSearch = p.name?.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase());

    // 2. Lọc theo loại (Gọng kính, Tròng kính...)
    const matchType = selectedTypes.length === 0 || selectedTypes.includes(p.Product_Type);

    // 3. SỬA: Lọc theo trạng thái
    const matchStatus =
      selectedStatus === 'all' ||
      (selectedStatus === 'active' && p.isActive === true) ||
      (selectedStatus === 'inactive' && p.isActive === false);

    return matchSearch && matchType && matchStatus;
  });

  // LOGIC SẮP XẾP (Chạy trên mảng đã lọc)
  const sortedAndFiltered = [...filtered].sort((a, b) => {
    if (sortBy === 'price_asc') return a.price - b.price;
    if (sortBy === 'price_desc') return b.price - a.price;
    if (sortBy === 'name_asc') return a.name.localeCompare(b.name);
    return 0; // 'newest'
  });

  // LOGIC PHÂN TRANG
  const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;

  // Dùng sortedAndFiltered thay vì filtered
  const currentItems = sortedAndFiltered.slice(startIndex, endIndex);

  // XỬ LÝ XEM SẢN PHẨM
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await api.get("api/products/admin/search");
        setProducts(response.data);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu API:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // RESET TRANG MỖI LẦN SEARCH, FILTER, SORT
  useEffect(() => {
    setCurrentPage(1);
  }, [search, selectedTypes, sortBy]);

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
      // (Nhánh Sửa PUT - Tạm thời giữ nguyên code cũ của bạn)
      // ...
    } else {
      // 🚀 NHÁNH THÊM MỚI (POST)
      try {
        const uploadData = new FormData();
        
        // 1. APPEND THÔNG TIN CHUNG
        uploadData.append('sku', formData.sku);
        uploadData.append('name', formData.name);
        uploadData.append('price', String(formData.price));
        // Nếu costPrice trống hoặc bằng 0, mặc định lấy price
        uploadData.append('costPrice', String(formData.costPrice || formData.price));
        uploadData.append('description', formData.description || '');
        uploadData.append('brandName', formData.brandName);
        uploadData.append('typeName', formData.typeName);
        uploadData.append('allowPreorder', String(formData.allowPreorder));
        uploadData.append('isActive', String(formData.isActive));
        
        // 2. APPEND ẢNH (NẾU CÓ)
        if (formData.imageFiles && formData.imageFiles.length > 0) {
            formData.imageFiles.forEach((file: File) => {
                uploadData.append('imageFiles', file);
            });
        }

        // 3. APPEND THÔNG SỐ KỸ THUẬT (Tùy theo loại sản phẩm)
        if (formData.typeName === 'Gọng kính') {
            uploadData.append('frameColor', formData.frameColor);
            uploadData.append('frameTempleLength', String(formData.frameTempleLength));
            uploadData.append('frameLensWidth', String(formData.frameLensWidth));
            uploadData.append('frameBridgeWidth', String(formData.frameBridgeWidth));
            uploadData.append('frameShapeName', formData.frameShapeName);
            uploadData.append('frameMaterialName', formData.frameMaterialName);
            uploadData.append('frameDescription', formData.frameDescription || '');

        } else if (formData.typeName === 'Tròng kính') {
            uploadData.append('lensTypeName', formData.lensTypeName);
            uploadData.append('lensIndexValue', String(formData.lensIndexValue));
            uploadData.append('lensDiameter', String(formData.lensDiameter));
            uploadData.append('lensAvailablePowerRange', formData.lensAvailablePowerRange);
            uploadData.append('lensIsBlueLightBlock', String(formData.lensIsBlueLightBlock));
            uploadData.append('lensIsPhotochromic', String(formData.lensIsPhotochromic));
            uploadData.append('lensDescription', formData.lensDescription || '');

        } else if (formData.typeName === 'Kính áp tròng') {
            uploadData.append('contactLensUsageType', formData.contactLensUsageType);
            uploadData.append('contactLensBaseCurve', String(formData.contactLensBaseCurve));
            uploadData.append('contactLensDiameter', String(formData.contactLensDiameter));
            uploadData.append('contactLensWaterContent', String(formData.contactLensWaterContent));
            uploadData.append('contactLensAvailablePowerRange', formData.contactLensAvailablePowerRange);
            uploadData.append('contactLensQuantityPerBox', String(formData.contactLensQuantityPerBox));
            uploadData.append('contactLensMaterial', formData.contactLensMaterial);
            uploadData.append('contactLensReplacementSchedule', formData.contactLensReplacementSchedule);
            uploadData.append('contactLensColor', formData.contactLensColor);
        }

        // BẮN API ĐI
        await api.post('api/products', uploadData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });

        alert("Thêm sản phẩm mới thành công!");
        
        // Tải lại list
        const response = await api.get("api/products/admin/search");
        setProducts(response.data);
        setIsFormModalOpen(false);

      } catch (error: any) {
        console.error("Lỗi khi thêm sản phẩm:", error);
        const errMsg = error.response?.data?.message || error.response?.data?.result || "Có lỗi xảy ra khi gọi API Add!";
        alert(`LỖI: ${errMsg}`);
      }
    }
  };

  // XỬ LÝ MỞ MODAL XÓA
  const handleDeleteClick = (id: number) => {
    setProductToDelete(id);
    setIsDeleteModalOpen(true);
  };

  // GỌI API KHI BẤM XÓA TỪ MODAL
  const handleConfirmDelete = async () => {
    if (productToDelete === null) return;
    try {
      // 1. Gọi API Xóa (sửa isActive của sản phẩm thành False)
      await api.delete(`api/products/${productToDelete}`);

      // 2. Cập nhật lại UI thành trạng thái đã ẩn (isActive: false) thay vì vứt nó ra khỏi mảng
      setProducts(prev =>
        prev.map(p =>
          p.id === productToDelete ? { ...p, isActive: false } : p
        )
      );

      setIsDeleteModalOpen(false);
      setProductToDelete(null);
    } catch (error) {
      console.error("Lỗi khi xóa sản phẩm:", error);
      alert("Lỗi 401: Vui lòng kiểm tra lại token đăng nhập hoặc quyền của bạn!");
      setIsDeleteModalOpen(false);
    }
  };

  // XỬ LÍ KHI BẤM RESTORE PRODUCT (Sửa isActive thành true)
  const handleRestoreProduct = async (product: Product) => {
    const isConfirm = window.confirm(`Bạn có chắc chắn muốn mở bán lại sản phẩm "${product.name}"?`);
    if (!isConfirm) return;

    try {
      const payload = {
        id: product.id,
        sku: product.sku,
        name: product.name,
        price: product.price,
        description: product.description,
        isActive: true,
        brandName: product.Brand,
        typeName: product.Product_Type
      };

      // Gọi API PUT
      await api.put('api/products', payload);

      // Cập nhật lại list sản phẩm trên giao diện mà không cần load lại trang
      setProducts(prev => prev.map(p => p.id === product.id ? { ...p, isActive: true } : p));
      alert("Mở bán sản phẩm thành công!");

    } catch (error) {
      console.error("Lỗi khi khôi phục sản phẩm:", error);
      alert("Có lỗi xảy ra khi khôi phục sản phẩm!");
    }
  };

  return (
    <div className="p-6 h-full relative">
      <ProductHeader
        search={search}
        setSearch={setSearch}
        selectedTypes={selectedTypes}
        setSelectedTypes={setSelectedTypes}
        selectedStatus={selectedStatus}
        setSelectedStatus={setSelectedStatus}
        sortBy={sortBy}
        setSortBy={setSortBy}
        onAddClick={handleAddClick}
      />

      <ProductTable
        loading={loading}
        currentItems={currentItems}
        filteredLength={sortedAndFiltered.length}
        startIndex={startIndex}
        endIndex={endIndex}
        currentPage={currentPage}
        totalPages={totalPages}
        setCurrentPage={setCurrentPage}
        onDeleteClick={handleDeleteClick}
        onEditClick={handleEditClick}
        onRestoreClick={handleRestoreProduct}
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