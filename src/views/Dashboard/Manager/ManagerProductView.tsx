// ManagerProductView.tsx
import { useEffect, useState } from 'react';
import { api } from '@/lib/ApiService';
import { Product } from './ManagerProductView/ProductConfig';
import { ProductHeader } from './ManagerProductView/ProductHeader';
import { ProductTable } from './ManagerProductView/ProductTable';
import { DeleteConfirmModal } from './ManagerProductView/DeleteConfirmModal';
import { ProductModal } from './ManagerProductView/ProductModal';
import { Popup } from '@/components/Popup'; // Import Popup
import { ConfirmDialog } from '@/components/ConfirmDialog'; // Import ConfirmDialog

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

    // MODAL XÓA NGỪNG BÁN
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [productToDelete, setProductToDelete] = useState<number | null>(null);

    // === STATE CHO POPUP VÀ CONFIRM MỞ BÁN LẠI ===
    const [popup, setPopup] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });
    const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);
    const [productToRestore, setProductToRestore] = useState<any>(null);

    // Hàm gọi nhanh Popup
    const showPopup = (message: string, type: 'success' | 'error') => {
        setPopup({ isOpen: true, message, type });
    };

    // LOGIC LỌC
    const filtered = products.filter(p => {
        const currentName = p.productName || p.name || '';
        const matchSearch = currentName.toLowerCase().includes(search.toLowerCase()) ||
            p.sku?.toLowerCase().includes(search.toLowerCase());

        const currentType = p.productType?.typeName || p.typeName || p.Product_Type || '';
        const matchType = selectedTypes.length === 0 || selectedTypes.includes(currentType);

        const matchStatus =
            selectedStatus === 'all' ||
            (selectedStatus === 'active' && p.isActive === true) ||
            (selectedStatus === 'inactive' && p.isActive === false);

        return matchSearch && matchType && matchStatus;
    });

    // LOGIC SẮP XẾP 
    const sortedAndFiltered = [...filtered].sort((a, b) => {
        const nameA = a.productName || a.name || '';
        const nameB = b.productName || b.name || '';

        // Lấy ID ra để so sánh (hỗ trợ cả 2 kiểu tên field)
        const idA = a.productID || a.id || 0;
        const idB = b.productID || b.id || 0;

        // Xử lý Mới nhất (ID lớn hơn nằm trên)
        if (sortBy === 'newest') return idB - idA;

        // Các sort khác
        if (sortBy === 'price_asc') return a.price - b.price;
        if (sortBy === 'price_desc') return b.price - a.price;
        if (sortBy === 'name_asc') return nameA.localeCompare(nameB);

        return 0;
    });
    // LOGIC PHÂN TRANG
    const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sortedAndFiltered.slice(startIndex, endIndex);

    // XỬ LÝ LẤY SẢN PHẨM
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

    useEffect(() => {
        fetchProducts();
    }, []);

    // RESET TRANG MỖI LẦN SEARCH, FILTER, SORT
    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedTypes, sortBy]);

    // XỬ LÝ MỞ MODAL THÊM
    const handleAddClick = () => {
        setEditingProduct(null);
        setIsFormModalOpen(true);
    };

    // XỬ LÝ MỞ MODAL SỬA 
    const handleEditClick = (product: any) => {
        setEditingProduct(product);
        setIsFormModalOpen(true);
    };

    // GỌI API KHI BẤM LƯU TỪ MODAL
    const handleSaveProduct = async (formData: any) => {
        if (editingProduct) {
            // 🚀 NHÁNH SỬA (PUT)
            try {
                const currentId = editingProduct.id || editingProduct.productID;
                const putPayload = {
                    id: currentId,
                    sku: formData.sku,
                    name: formData.name,
                    price: formData.price,
                    description: formData.description || '',
                    isActive: formData.isActive,
                    brandName: formData.brandName,
                    typeName: formData.typeName
                };

                await api.put('api/products', putPayload);

                showPopup("Cập nhật thông tin chung thành công!", "success"); // Đã thay bằng Popup

                fetchProducts();
                setIsFormModalOpen(false);

            } catch (error: any) {
                console.error("Lỗi khi cập nhật sản phẩm:", error);
                showPopup("Có lỗi xảy ra khi cập nhật sản phẩm!", "error"); // Đã thay bằng Popup
            }

        } else {
            // 🚀 NHÁNH THÊM MỚI (POST) 
            try {
                const uploadData = new FormData();

                // 1. Thông tin chung
                uploadData.append('sku', formData.sku);
                uploadData.append('name', formData.name);
                uploadData.append('price', String(formData.price));
                uploadData.append('costPrice', String(formData.costPrice || formData.price));
                uploadData.append('description', formData.description || '');
                uploadData.append('brandName', formData.brandName);
                uploadData.append('typeName', formData.typeName);
                uploadData.append('allowPreorder', String(formData.allowPreorder));
                uploadData.append('isActive', String(formData.isActive));

                // 2. Ảnh
                if (formData.imageFiles && formData.imageFiles.length > 0) {
                    formData.imageFiles.forEach((file: File) => {
                        uploadData.append('imageFiles', file);
                    });
                }

                // 3. Thông số kỹ thuật
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

                await api.post('api/products', uploadData, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                });

                showPopup("Thêm sản phẩm mới thành công!", "success"); // Đã thay bằng Popup
                fetchProducts();
                setIsFormModalOpen(false);

            } catch (error: any) {
                console.error("Lỗi khi thêm sản phẩm:", error);
                const errMsg = error.response?.data?.message || error.response?.data?.result || "Có lỗi xảy ra khi gọi API Add!";
                showPopup(`LỖI: ${errMsg}`, "error"); // Đã thay bằng Popup
            }
        }
    };

    // MỞ MODAL XÓA (Ngừng bán)
    const handleDeleteClick = (id: number) => {
        setProductToDelete(id);
        setIsDeleteModalOpen(true);
    };

    // XÓA MỀM (Status = false)
    const handleConfirmDelete = async () => {
        if (productToDelete === null) return;
        try {
            await api.delete(`api/products/${productToDelete}`);
            setProducts(prev =>
                prev.map(p =>
                    (p.id === productToDelete || p.productID === productToDelete) ? { ...p, isActive: false } : p
                )
            );
            showPopup("Đã ngừng bán sản phẩm!", "success"); // Thêm thông báo nhẹ cho vui
            setIsDeleteModalOpen(false);
            setProductToDelete(null);
        } catch (error) {
            console.error("Lỗi khi xóa sản phẩm:", error);
            showPopup("Lỗi 401: Vui lòng kiểm tra lại token đăng nhập hoặc quyền của bạn!", "error"); // Đã thay bằng Popup
            setIsDeleteModalOpen(false);
        }
    };

    // ==========================================
    // LOGIC MỚI: MỞ MODAL HỎI XÁC NHẬN MỞ BÁN LẠI
    // ==========================================
    const handleRestoreClick = (product: any) => {
        setProductToRestore(product);
        setIsRestoreModalOpen(true);
    };

    // ==========================================
    // LOGIC MỚI: GỌI API KHI XÁC NHẬN TRÊN MODAL MỞ BÁN
    // ==========================================
    const confirmRestoreProduct = async () => {
        if (!productToRestore) return;

        const currentName = productToRestore.productName || productToRestore.name;
        const currentId = productToRestore.productID || productToRestore.id;
        const currentBrand = productToRestore.brand?.brandName || productToRestore.brandName || productToRestore.Brand;
        const currentType = productToRestore.productType?.typeName || productToRestore.typeName || productToRestore.Product_Type;

        try {
            const payload = {
                id: currentId,
                sku: productToRestore.sku,
                name: currentName,
                price: productToRestore.price,
                description: productToRestore.description,
                isActive: true,
                brandName: currentBrand,
                typeName: currentType
            };

            await api.put('api/products', payload);
            setProducts(prev => prev.map(p => (p.id === currentId || p.productID === currentId) ? { ...p, isActive: true } : p));

            showPopup("Mở bán sản phẩm thành công!", "success"); // Đã thay bằng Popup
        } catch (error) {
            console.error("Lỗi khi khôi phục sản phẩm:", error);
            showPopup("Có lỗi xảy ra khi khôi phục sản phẩm!", "error"); // Đã thay bằng Popup
        } finally {
            setIsRestoreModalOpen(false);
            setProductToRestore(null);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto relative w-full max-w-[100vw]">
            <ProductHeader
                search={search} setSearch={setSearch}
                selectedTypes={selectedTypes} setSelectedTypes={setSelectedTypes}
                selectedStatus={selectedStatus} setSelectedStatus={setSelectedStatus}
                sortBy={sortBy} setSortBy={setSortBy}
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
                onRestoreClick={handleRestoreClick} // Trỏ hàm mở modal vào đây
            />

            {/* Modal xác nhận Ngừng Bán (Có sẵn của bạn) */}
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
                showPopup={showPopup}
            />

            {/* MODAL MỚI CHO VIỆC XÁC NHẬN MỞ BÁN LẠI SẢN PHẨM */}
            <ConfirmDialog
                isOpen={isRestoreModalOpen}
                title="Xác nhận mở bán"
                message={`Bạn có chắc chắn muốn kinh doanh lại sản phẩm "${productToRestore?.productName || productToRestore?.name}" không?`}
                confirmText="Mở bán ngay"
                cancelText="Hủy bỏ"
                type="success" // Màu xanh lá cây đẹp mắt
                onConfirm={confirmRestoreProduct}
                onCancel={() => {
                    setIsRestoreModalOpen(false);
                    setProductToRestore(null);
                }}
            />

            {/* POPUP THÔNG BÁO Ở GÓC MÀN HÌNH */}
            <Popup
                isOpen={popup.isOpen}
                message={popup.message}
                type={popup.type}
                onClose={() => setPopup({ ...popup, isOpen: false })}
            />
        </div>
    );
}