// ManagerStaffView.tsx
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';
import { Staff, performanceData } from './ManagerStaffView/StaffConfig';
import { StaffHeader } from './ManagerStaffView/StaffHeader';
import { StaffTable } from './ManagerStaffView/StaffTable';
import { DeleteConfirmModal } from './ManagerStaffView/DeleteConfirmModal';
import { StaffModal } from './ManagerStaffView/StaffModal';

export default function ManagerStaffView() {
    const [search, setSearch] = useState('');
    const [selectedRoles, setSelectedRoles] = useState<string[]>([]);
    const [sortBy, setSortBy] = useState('newest');

    const [staff, setStaff] = useState<Staff[]>([]);
    const [loading, setLoading] = useState<boolean>(true);

    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [staffToDelete, setStaffToDelete] = useState<number | string | null>(null);

    const [isFormModalOpen, setIsFormModalOpen] = useState(false);
    const [editingStaff, setEditingStaff] = useState<Staff | null>(null);

    const [formData, setFormData] = useState({
        username: '', password: '', email: '', phone: '', name: '', dob: '',
        address: '', idNumber: '', roleName: 'CUSTOMER', status: true,
        provinceCode: 0, provinceName: '', districtCode: 0, districtName: '', wardCode: '', wardName: ''
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // XEM USER
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await api.get("users");
                // CẬP NHẬT: Lấy mảng từ response.data.result theo đúng API trả về
                setStaff(response.data?.result || []);
            } catch (error) {
                console.error("Lỗi:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStaff();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [search, selectedRoles, sortBy]);

    // CẬP NHẬT LOGIC LỌC
    const filtered = staff.filter(s => {
        const staffName = s.name || '';
        const staffEmail = s.email || '';
        const staffRole = s.role?.name || 'CUSTOMER';

        const matchesSearch = staffName.toLowerCase().includes(search.toLowerCase()) ||
            staffEmail.toLowerCase().includes(search.toLowerCase()) ||
            staffRole.toLowerCase().includes(search.toLowerCase());

        const matchesRole = selectedRoles.length === 0 || selectedRoles.includes(staffRole);
        return matchesSearch && matchesRole;
    });

    const sortedAndFiltered = [...filtered].sort((a, b) => {
        const nameA = a.name || '';
        const nameB = b.name || '';
        if (sortBy === 'name_asc') return nameA.localeCompare(nameB);
        if (sortBy === 'name_desc') return nameB.localeCompare(nameA);
        return 0;
    });

    const totalPages = Math.ceil(sortedAndFiltered.length / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const currentItems = sortedAndFiltered.slice(startIndex, endIndex);

    const handleDeleteClick = (id: number | string) => {
        setStaffToDelete(id);
        setIsDeleteModalOpen(true);
    };

    const handleConfirmDelete = async () => {
        if (!staffToDelete) return;
        try {
            await api.delete(`users/${staffToDelete}`);
            // Xóa xong thì update lại state UI
            setStaff(prev => prev.filter(s => (s.id || s.userId || s.username) !== staffToDelete));
            alert("Xóa nhân viên thành công!");
            setIsDeleteModalOpen(false);
            setStaffToDelete(null);
        } catch (error) {
            alert("Lỗi khi xóa!");
            setIsDeleteModalOpen(false);
        }
    };

    const handleAddClick = () => {
        setEditingStaff(null);
        setFormData({
            username: '', password: '', email: '', phone: '', name: '', dob: '',
            address: '', idNumber: '', roleName: 'CUSTOMER', status: true,
            provinceCode: 0, provinceName: '', districtCode: 0, districtName: '', wardCode: '', wardName: ''
        });
        setIsFormModalOpen(true);
    };

    const handleEditClick = (staffObj: Staff) => {
        setEditingStaff(staffObj);

        // Tách lấy địa chỉ đường (Bỏ qua Tỉnh/Huyện/Xã nếu chuỗi có chứa dấu phẩy)
        let streetAddress = staffObj.address || '';
        if (staffObj.wardName && streetAddress.includes(staffObj.wardName)) {
            streetAddress = streetAddress.split(',')[0].trim();
        }

        setFormData({
            username: staffObj.username || '',
            password: '',
            email: staffObj.email || '',
            phone: staffObj.phone || '',
            name: staffObj.name || '',
            dob: staffObj.dob || '',
            address: streetAddress, // Gán địa chỉ đã cắt gọt vào ô input Số nhà
            idNumber: staffObj.idNumber || '',
            roleName: staffObj.role?.name || 'CUSTOMER',
            status: staffObj.status,
            provinceCode: staffObj.provinceCode || 0,
            provinceName: staffObj.provinceName || '',
            districtCode: staffObj.districtCode || 0,
            districtName: staffObj.districtName || '',
            wardCode: staffObj.wardCode || '',
            wardName: staffObj.wardName || ''
        });
        setIsFormModalOpen(true);
    };

    const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSaveStaff = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            if (editingStaff) {
                // SỬA: Nối chuỗi full địa chỉ
                const fullAddressForPut = formData.provinceName ?
                    `${formData.address}, ${formData.wardName}, ${formData.districtName}, ${formData.provinceName}`
                    : formData.address;

                const putPayload = {
                    email: formData.email,
                    phone: formData.phone,
                    name: formData.name,
                    dob: formData.dob || null,
                    address: fullAddressForPut,
                    idNumber: formData.idNumber
                };
                await api.put('users/my-info', putPayload);
                alert("Cập nhật thông tin thành công!");
            } else {
                // THÊM: Gửi cục form chuẩn dữ liệu Backend yêu cầu
                const postPayload = {
                    username: formData.username,
                    password: formData.password,
                    email: formData.email,
                    phone: formData.phone,
                    name: formData.name,
                    dob: formData.dob || null,
                    address: formData.address || null,
                    idNumber: formData.idNumber || null,
                    status: formData.status,
                    // Backend bắt buộc có gạch dưới (VD: SALES_STAFF thay vì SALES STAFF)
                    roleName: formData.roleName.replace(" ", "_"),
                    // Ép kiểu đúng theo Swagger
                    provinceCode: Number(formData.provinceCode) || 0, // Số
                    provinceName: formData.provinceName || "",
                    districtCode: Number(formData.districtCode) || 0, // Số
                    districtName: formData.districtName || "",
                    wardCode: String(formData.wardCode || ""),        // Chuỗi
                    wardName: formData.wardName || ""
                };

                await api.post('users/admin/create', postPayload);
                alert("Thêm nhân viên mới thành công!");
            }

            // GỌI LẠI API GET ĐỂ LOAD DATA MỚI NHẤT
            const response = await api.get("users");
            setStaff(response.data?.result || []);

            setIsFormModalOpen(false);
        } catch (error: any) {
            console.error("Lỗi Server trả về:", error.response?.data);

            const backendErrorMsg = error.response?.data?.message || error.response?.data?.result || "Dữ liệu nhập vào chưa đúng định dạng!";
            alert(`LỖI: ${backendErrorMsg}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="p-6 h-full overflow-auto relative">
            <StaffHeader
                search={search} setSearch={setSearch}
                selectedRoles={selectedRoles} setSelectedRoles={setSelectedRoles}
                sortBy={sortBy} setSortBy={setSortBy}
                onAddClick={handleAddClick}
            />

            <StaffTable
                loading={loading} currentItems={currentItems} filteredLength={filtered.length}
                startIndex={startIndex} endIndex={endIndex} currentPage={currentPage} totalPages={totalPages}
                setCurrentPage={setCurrentPage} onDeleteClick={handleDeleteClick} onEditClick={handleEditClick}
            />

            <DeleteConfirmModal
                isOpen={isDeleteModalOpen} staffId={staffToDelete}
                onCancel={() => setIsDeleteModalOpen(false)} onConfirm={handleConfirmDelete}
            />

            <StaffModal
                isOpen={isFormModalOpen} onClose={() => setIsFormModalOpen(false)} onSave={handleSaveStaff}
                formData={formData}
                setFormData={setFormData}
                handleFormChange={handleFormChange}
                isEditing={!!editingStaff} isSubmitting={isSubmitting}
            />
        </div>
    );
}