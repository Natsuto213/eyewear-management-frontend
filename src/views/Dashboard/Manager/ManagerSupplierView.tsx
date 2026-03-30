// ManagerSupplierView/ManagerSupplierView.tsx
import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/ApiService';
import { Popup } from '@/components/Popup';
import { Supplier } from './ManagerSupplierView/SupplierConfig';
import { SupplierHeader } from './ManagerSupplierView/SupplierHeader';
import { SupplierTable } from './ManagerSupplierView/SupplierTable';
import { AddSupplierModal } from './ManagerSupplierView/AddSupplierModal';
import { AddBrandModal } from './ManagerSupplierView/AddBrandModal';

export default function ManagerSupplierView() {
    // --- STATES ---
    const [suppliers, setSuppliers] = useState<Supplier[]>([]);
    const [availableBrands, setAvailableBrands] = useState<string[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const [isAddSupplierOpen, setIsAddSupplierOpen] = useState(false);
    const [isAddBrandOpen, setIsAddBrandOpen] = useState(false);
    const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null);

    const [popup, setPopup] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });

    const showPopup = (message: string, type: 'success' | 'error') => {
        setPopup({ isOpen: true, message, type });
    };

    // --- FETCH DATA ---
    const fetchSuppliers = async () => {
        setLoading(true);
        try {
            const res = await api.get('/api/suppliers');
            setSuppliers(res.data);
        } catch (error) {
            console.error("Lỗi lấy danh sách NCC:", error);
            showPopup("Không thể tải danh sách nhà cung cấp!", "error");
        } finally {
            setLoading(false);
        }
    };

    const fetchAvailableBrands = async () => {
        try {
            const res = await api.get('/api/products/admin/search');
            // Lọc ra các brand unique từ danh sách product
            const brands = res.data.map((p: any) => p.brand?.brandName || p.brandName || p.Brand).filter(Boolean);
            setAvailableBrands(Array.from(new Set(brands)) as string[]);
        } catch (error) {
            console.error("Lỗi lấy danh sách Brands:", error);
        }
    };

    useEffect(() => {
        fetchSuppliers();
        fetchAvailableBrands(); // Gọi hàm lấy brand lúc vào trang
    }, []);

    const filteredSuppliers = useMemo(() => {
        return suppliers.filter(s =>
            s.name.toLowerCase().includes(search.toLowerCase()) ||
            s.phone.includes(search)
        );
    }, [suppliers, search]);

    // LOGIC LƯU SUPPLIER (Cái này api xài multipart/form-data nên giữ nguyên)
    const handleSaveSupplier = async (data: { name: string, phone: string, address: string, brandsList: string[] }) => {
        if (!data.name || !data.phone || !data.address) {
            showPopup("Vui lòng nhập đủ Tên, SĐT và Địa chỉ!", "error");
            throw new Error("Thiếu thông tin"); 
        }

        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('supplierName', data.name);
            formData.append('supplierPhone', data.phone);
            formData.append('supplierAddress', data.address);

            // PHÂN LOẠI BRAND
            const brandArray = data.brandsList.map(b => {
                if (availableBrands.includes(b)) {
                    return { brandName: b }; 
                } else {
                    return { brandName: b, description: "", status: true };
                }
            });

            if (brandArray.length > 0) {
                formData.append('brands', new Blob([JSON.stringify(brandArray)], { type: 'application/json' }));
            }

            await api.post('/api/suppliers/with-brands', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            setIsAddSupplierOpen(false);
            showPopup("Thêm nhà cung cấp thành công!", "success");
            fetchSuppliers();
            fetchAvailableBrands(); // Refresh lại list brand
        } catch (error: any) {
            console.error("Lỗi khi tạo nhà cung cấp:", error);
            showPopup(error.response?.data?.message || "Lỗi khi tạo nhà cung cấp!", "error");
            throw error; 
        } finally {
            setIsSubmitting(false);
        }
    };

    // LOGIC LƯU THƯƠNG HIỆU (Đổi sang gửi JSON array thẳng vào body)
    const handleSaveBrand = async (brandsList: string[]) => {
        if (!selectedSupplier) return;
        if (brandsList.length === 0) {
            showPopup("Vui lòng chọn ít nhất 1 thương hiệu!", "error");
            throw new Error("Thiếu thông tin"); 
        }

        setIsSubmitting(true);
        try {
            // PHÂN LOẠI BRAND: Cũ truyền 1 trường, Mới truyền 3 trường
            const brandArray = brandsList.map(b => {
                if (availableBrands.includes(b)) {
                    return { brandName: b }; 
                } else {
                    return { brandName: b, description: null, status: true }; 
                }
            });

            await api.post(`/api/suppliers/${selectedSupplier.id}/brands`, brandArray, {
                headers: { 'Content-Type': 'application/json' }
            });

            setIsAddBrandOpen(false);
            setSelectedSupplier(null);
            showPopup(`Đã thêm thương hiệu cho ${selectedSupplier.name}!`, "success");
            fetchAvailableBrands(); // Refresh lại list brand
        } catch (error: any) {
            console.error("Lỗi khi thêm thương hiệu:", error);
            showPopup(error.response?.data?.message || "Lỗi khi thêm thương hiệu!", "error");
            throw error; 
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 lg:p-8 h-full overflow-y-auto w-full bg-gray-50 min-h-screen">
            <SupplierHeader search={search} setSearch={setSearch} onAddClick={() => setIsAddSupplierOpen(true)} />
            <SupplierTable loading={loading} suppliers={filteredSuppliers} onAddBrandClick={(supplier) => { setSelectedSupplier(supplier); setIsAddBrandOpen(true); }} />

            <AddSupplierModal isOpen={isAddSupplierOpen} onClose={() => setIsAddSupplierOpen(false)} onSave={handleSaveSupplier} isSubmitting={isSubmitting} availableBrands={availableBrands} />
            <AddBrandModal isOpen={isAddBrandOpen} supplier={selectedSupplier} onClose={() => { setIsAddBrandOpen(false); setSelectedSupplier(null); }} onSave={handleSaveBrand} isSubmitting={isSubmitting} availableBrands={availableBrands} />

            <Popup isOpen={popup.isOpen} message={popup.message} type={popup.type} onClose={() => setPopup({ ...popup, isOpen: false })} />
        </div>
    );
}