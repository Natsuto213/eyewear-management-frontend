import {
    ClipboardList,
    FileText,
    Package,
    BarChart3,
    ShoppingCart,
    Users,
    ShieldCheck,
    TrendingUp,
    Tag
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
        displayName: 'Staff',
        tabs: [
            {
                id: 'order-status',
                label: 'Order Status',
                icon: ShoppingCart,
                path: '/sales/order-status'
            }, {
                id: 'order-detail',
                label: 'Order Detail',
                icon: FileText,
                path: '/sales/order-detail'
            }, {
                id: 'form-list',
                label: 'Form List',
                icon: ClipboardList,
                path: '/sales/form-list'
            }, {
                id: 'form-detail',
                label: 'Form Detail',
                icon: FileText,
                path: '/sales/form-detail'
            }
        ]
    },
    {
        role: 'operation',
        displayName: 'Operation Staff',
        tabs: [
            {
                id: 'inventory',
                label: 'Inventory Management',
                icon: Package,
                path: '/operation/inventory'
            }, {
                id: 'order-management',
                label: 'Order Management',
                icon: ClipboardList,
                path: '/operation/order-management'
            }, {
                id: 'stock-report',
                label: 'Stock Report',
                icon: BarChart3,
                path: '/operation/stock-report'
            }
        ]
    },
    {
        role: 'manager',
        displayName: 'Manager',
        tabs: [
            {
                id: 'product',
                label: 'Danh sách sản phẩm',
                icon: Package,
                path: '/manager/product'
            }, {
                id: 'staff',
                label: 'Danh sách nhân sự',
                icon: Users,
                path: '/manager/staff'
            }, {
                id: 'static',
                label: 'Thống kê doanh thu',
                icon: TrendingUp,
                path: '/manager/static'
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
