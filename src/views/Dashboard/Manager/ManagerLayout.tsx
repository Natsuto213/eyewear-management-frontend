import { Outlet } from 'react-router';
import { ProtectedLayout } from '@/components/dashboard/ProtectedLayout';
import { managerTabs } from '@/components/dashboard/navigation';
import { Navigate } from 'react-router-dom';
export const ManagerLayout = () => {
    const userSaved = localStorage.getItem("user");
    if (!(userSaved)) {
        return <Navigate to="/login" />
    }
    const userData = JSON.parse(userSaved)
    if (userData.role !== "MANAGER") {
        return <Navigate to="/login" />
    }
    return (
        <>
            <ProtectedLayout tabs={managerTabs} role="manager" defaultTab="dashboard" userName={userData.name}>
                <Outlet />
            </ProtectedLayout >
        </>
    );
};