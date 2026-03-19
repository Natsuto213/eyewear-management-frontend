// ManagerStaffView/StaffConfig.ts

export interface Staff {
    id?: number; 
    userId?: number;
    username: string;
    email: string;
    phone: string;
    name: string;
    dob: string | null;
    address: string | null;
    idNumber: string | null;
    role: {
        name: string;
    };
    status: boolean;
    provinceCode: number | null;
    provinceName: string | null;
    districtCode: number | null;
    districtName: string | null;
    wardCode: string | null;
    wardName: string | null;
}


export const statusConfig: Record<string, { label: string; className: string }> = {
    'true': { label: 'Đang hoạt động', className: 'bg-green-100 text-green-700' },
    'false': { label: 'Đã khóa', className: 'bg-red-100 text-red-600' },
};

export const roleConfig: Record<string, { label: string; className: string }> = {
    'ADMIN': { label: 'Admin', className: 'bg-red-100 text-red-700' },
    'MANAGER': { label: 'Quản lí', className: 'bg-orange-100 text-orange-700' },
    'OPERATIONS STAFF': { label: 'Nhân viên kho', className: 'bg-blue-100 text-blue-700' },
    'SALES STAFF': { label: 'Nhân viên bán hàng', className: 'bg-purple-100 text-purple-700' },
    'CUSTOMER': { label: 'Khách hàng', className: 'bg-cyan-100 text-cyan-700' },
};