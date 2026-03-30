import {
    ClipboardList,
    FileText,
    Package,
    BarChart3,
    ShoppingCart,
    Users,
    ShieldCheck,
    TrendingUp,
    Tag,
    House,
    Truck
} from 'lucide-react';

export type Role = 'sales' | 'operation' | 'manager';

export interface TabItem {
    id: string;
    label: string;
    icon: any;
    path: string;
}

export interface RoleTabs {
    role: Role;
    displayName: string;
    tabs: TabItem[];
}

export const roleTabsConfig: RoleTabs[] = [
    {
        role: 'sales',
        displayName: 'Sales Staff',
        tabs: [
            {
                id: 'home',
                label: 'Về lại trang chủ',
                icon: House,
                path: '/'
            }, {
                id: 'orders',
                label: 'Danh sách đơn hàng',
                icon: ShoppingCart,
                path: '/sales/containers/orders'
            }, {
                id: 'return-orders',
                label: 'Danh sách đơn đổi trả',
                icon: FileText,
                path: '/sales/containers/return-orders'
            }, {
                id: 'cancelled-orders',
                label: 'Danh sách đơn huỷ',
                icon: FileText,
                path: '/sales/containers/cancelled-orders'
            }, {
                id: 'inventoryorder',
                label: 'Quản lý kho',
                icon: ClipboardList,
                path: '/sales/ui/inventoryorder'
            }
        ]
    },
    {
        role: 'operation',
        displayName: 'Operation Staff',
        tabs: [
            {
                id: 'home',
                label: 'Về lại trang chủ',
                icon: House,
                path: '/'
            }, {
                id: 'order-list',
                label: 'Danh sách đơn hàng',
                icon: ClipboardList,
                path: '/operation-staff/orders'
            }, {
                id: 'inventory',
                label: 'Quản lý kho',
                icon: Package,
                path: '/operation-staff/inventory'
            }, {
                id: 'purchase-card',
                label: 'Phiếu nhập kho',
                icon: BarChart3,
                path: '/operation-staff/purchase-card'
            },
            {
                id: 'purchase-list',
                label: 'Quản lí phiếu nhập kho',
                icon: BarChart3,
                path: '/operation-staff/purchase-list'
            }

        ]
    },
    {
        role: 'manager',
        displayName: 'Manager',
        tabs: [
            {
                id: 'home',
                label: 'Về lại trang chủ',
                icon: House,
                path: '/'
            },  {
                id: 'staff',
                label: 'Danh sách nhân sự',
                icon: Users,
                path: '/manager/staff'
            }, {
                id: 'static',
                label: 'Thống kê doanh thu',
                icon: TrendingUp,
                path: '/manager/static'
            },{
                id: 'product',
                label: 'Danh sách sản phẩm',
                icon: Package,
                path: '/manager/product'
            }, {
                id: 'supplier',
                label: 'Danh sách nhà cung cấp',
                icon: Truck,
                path: '/manager/supplier'
            }, {
                id: 'policies',
                label: 'Chỉnh sửa chính sách',
                icon: ShieldCheck,
                path: '/manager/policies'
            }, {
                id: 'sales',
                label: 'Chỉnh sửa giảm giá',
                icon: Tag,
                path: '/manager/sales'
            },
        ]
    }
];

export const getTabsByRole = (role: Role): TabItem[] => {
    const roleConfig = roleTabsConfig.find(r => r.role === role);
    return roleConfig?.tabs || [];
};

export const getRoleDisplayName = (role: Role): string => {
    const roleConfig = roleTabsConfig.find(r => r.role === role);
    return roleConfig?.displayName || role;
};

// Export individual tabs for convenience
export const salesTabs: TabItem[] = roleTabsConfig.find(r => r.role === 'sales')?.tabs || [];
export const operationTabs: TabItem[] = roleTabsConfig.find(r => r.role === 'operation')?.tabs || [];
export const managerTabs: TabItem[] = roleTabsConfig.find(r => r.role === 'manager')?.tabs || [];
