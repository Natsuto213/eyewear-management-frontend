// ManagerStaffView.tsx
import { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '@/lib/api';
import { Staff } from './ManagerStaffView/StaffConfig';
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
            // Gọi API Delete (Backend xử lý khóa)
            await api.delete(`users/${staffToDelete}`);
            
            // Thay vì filter, dùng map để cập nhật status thành false
            setStaff(prev => prev.map(s => 
                (s.id || s.userId || s.username) === staffToDelete 
                    ? { ...s, status: false } 
                    : s
            ));
            
            alert("Đã khóa nhân viên thành công!");
            setIsDeleteModalOpen(false);
            setStaffToDelete(null);
        } catch (error) {
            alert("Lỗi khi khóa nhân viên!");
            setIsDeleteModalOpen(false);
        }
    };

    const handleAddClick = () => {
        setEditingStaff(null);
        // Khởi tạo các trường bắt buộc là chuỗi rỗng, không bắt buộc để rỗng
        setFormData({
            username: '', password: '', email: '', phone: '', name: '', dob: '',
            address: '', idNumber: '', roleName: 'CUSTOMER', status: true
        });
        setIsFormModalOpen(true);
    };

    const handleEditClick = (staffObj: Staff) => {
        setEditingStaff(staffObj);

        // Chỉ lấy chuỗi address từ staffObj, bỏ qua mấy cái province/district lằng nhằng
        setFormData({
            username: staffObj.username || '',
            password: '', // Password không đổ về khi edit
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
                    email: formData.email,
                    phone: formData.phone,
                    name: formData.name,
                    dob: formData.dob || null,
                    address: formData.address || null,
                    idNumber: formData.idNumber || null
                };
                await api.put('users/admin/update', putPayload);
                alert("Cập nhật thông tin thành công!");
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
                    roleName: formData.roleName.replace(" ", "_"), // Đảm bảo role chuẩn format (VD: SALES_STAFF)

                    // Gắn cứng các trường quận huyện thành null vì không dùng tới
                    provinceCode: null,
                    provinceName: null,
                    districtCode: null,
                    districtName: null,
                    wardCode: null,
                    wardName: null
                };

                await api.post('users/admin/create', postPayload);
                alert("Thêm nhân viên mới thành công!");
            }

            // Gọi lại API để load lại danh sách mới
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