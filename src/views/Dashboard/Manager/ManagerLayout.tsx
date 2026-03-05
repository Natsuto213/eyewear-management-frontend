import { Outlet } from 'react-router';
import { ProtectedLayout } from '@/components/dashboard/ProtectedLayout';
import { managerTabs } from '@/components/dashboard/navigation';

export const ManagerLayout = () => {
  return (
    <ProtectedLayout options={{ tabs: managerTabs, role: 'manager', defaultTab: 'dashboard' }}>
      <Outlet />
    </ProtectedLayout>
  );
};

