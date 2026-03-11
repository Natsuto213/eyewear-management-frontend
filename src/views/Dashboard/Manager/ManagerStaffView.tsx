// ManagerStaffView.tsx
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { Staff } from './ManagerStaffView/StaffConfig';
import { StaffHeader } from './ManagerStaffView/StaffHeader';
import { StaffTable } from './ManagerStaffView/StaffTable';
import { DeleteConfirmModal } from './ManagerStaffView/DeleteConfirmModal';
import { StaffModal } from './ManagerStaffView/StaffModal';
import { Popup } from '@/components/Popup'; // Nhớ trỏ đúng đường dẫn tới file Popup vừa tạo

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

    // STATE CHO POPUP THÔNG BÁO
    const [popup, setPopup] = useState({ isOpen: false, message: '', type: 'success' as 'success' | 'error' });

    const [formData, setFormData] = useState({
        username: '',
        password: '',
        email: '',
        phone: '',
        name: '',
        dob: '',
        address: '',
        idNumber: '',
        roleName: 'CUSTOMER',
        status: true
    });
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Hàm gọi nhanh Popup
    const showPopup = (message: string, type: 'success' | 'error') => {
        setPopup({ isOpen: true, message, type });
    };

    // XEM USER
    useEffect(() => {
        const fetchStaff = async () => {
            try {
                const response = await api.get("users");
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

    // LỌC DỮ LIỆU
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
            setStaff(prev => prev.map(s =>
                (s.id || s.userId || s.username) === staffToDelete
                    ? { ...s, status: false }
                    : s
            ));
            showPopup("Đã khóa nhân viên thành công!", "success");
            setIsDeleteModalOpen(false);
            setStaffToDelete(null);
        } catch (error) {
            showPopup("Lỗi khi khóa nhân viên!", "error");
            setIsDeleteModalOpen(false);
        }
    };

    const handleRestoreStaff = async (staffObj: Staff) => {
        const isConfirm = window.confirm(`Bạn có chắc chắn muốn mở khóa tài khoản cho "${staffObj.name}"?`);
        if (!isConfirm) return;

        try {
            const putPayload = {
                username: staffObj.username,
                name: staffObj.name || "",
                phone: staffObj.phone || "",
                address: staffObj.address || null,
                status: true,
                roleName: staffObj.role?.name || 'CUSTOMER' 
            };

            await api.put('users/admin/update', putPayload);

            setStaff(prev => prev.map(s =>
                (s.username === staffObj.username)
                    ? { ...s, status: true }
                    : s
            ));
            showPopup("Mở khóa tài khoản thành công!", "success");

        } catch (error: any) {
            console.error("Chi tiết lỗi:", error.response?.data);
            const backendErrorMsg = error.response?.data?.message || error.response?.data?.result || "Lỗi không xác định từ Server!";
            showPopup(backendErrorMsg, "error");
        }
    };

    const handleAddClick = () => {
        setEditingStaff(null);
        setFormData({
            username: '', password: '', email: '', phone: '', name: '', dob: '',
            address: '', idNumber: '', roleName: 'CUSTOMER', status: true
        });
        setIsFormModalOpen(true);
    };

    const handleEditClick = (staffObj: Staff) => {
        setEditingStaff(staffObj);
        setFormData({
            username: staffObj.username || '',
            password: '', 
            email: staffObj.email || '',
            phone: staffObj.phone || '',
            name: staffObj.name || '',
            dob: staffObj.dob || '',
            address: staffObj.address || '',
            idNumber: staffObj.idNumber || '',
            roleName: staffObj.role?.name || 'CUSTOMER',
            status: staffObj.status
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
                const putPayload = {
                    username: formData.username, 
                    name: formData.name,
                    phone: formData.phone,
                    address: formData.address || null,
                    status: formData.status,
                    roleName: formData.roleName
                };

                await api.put('users/admin/update', putPayload);
                showPopup("Cập nhật thông tin thành công!", "success");

                setStaff(prev => prev.map(s =>
                    (s.username === formData.username)
                        ? { ...s, name: formData.name, phone: formData.phone, address: formData.address, status: formData.status, role: { name: formData.roleName } }
                        : s
                ));
            } else {
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
                    roleName: formData.roleName,
                    provinceCode: null, provinceName: null,
                    districtCode: null, districtName: null,
                    wardCode: null, wardName: null
                };

                await api.post('users/admin/create', postPayload);
                showPopup("Thêm nhân viên mới thành công!", "success");
            }

            const response = await api.get("users");
            setStaff(response.data?.result || []);

            setIsFormModalOpen(false);
        } catch (error: any) {
            console.error("Lỗi Server trả về:", error.response?.data);
            const backendErrorMsg = error.response?.data?.message || error.response?.data?.result || "Dữ liệu nhập vào chưa đúng định dạng!";
            showPopup(backendErrorMsg, "error");
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
                setCurrentPage={setCurrentPage}
                onDeleteClick={handleDeleteClick}
                onEditClick={handleEditClick}
                onRestoreClick={handleRestoreStaff}
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

            {/* GỌI COMPONENT POPUP Ở ĐÂY */}
            <Popup 
                isOpen={popup.isOpen} 
                message={popup.message} 
                type={popup.type} 
                onClose={() => setPopup({ ...popup, isOpen: false })} 
            />
        </div>
    );
}