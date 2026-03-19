import { Outlet } from 'react-router';
import { ProtectedLayout } from '@/components/dashboard/ProtectedLayout';
import { operationTabs } from '@/components/dashboard/navigation';
import { Navigate } from 'react-router-dom';
export const OperationStaffLayout = () => {
    const userSaved = localStorage.getItem("user");
    if (!(userSaved)) {
        return <Navigate to="/login" />
    }
    const userData = JSON.parse(userSaved)
    if (userData.role !== "OPERATIONS STAFF") {
        return <Navigate to="/login" />
    }
    return (
        <>
            <ProtectedLayout tabs={operationTabs} role="operation-staff" defaultTab="dashboard" userName={userData.name}>
                <Outlet />
            </ProtectedLayout >
        </>
    );
};
