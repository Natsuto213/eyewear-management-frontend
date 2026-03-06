import { Outlet } from 'react-router';
import { ProtectedLayout } from '@/components/dashboard/ProtectedLayout';
import { salesTabs } from '@/components/dashboard/navigation';
import { Navigate } from 'react-router-dom';
export const SalesStaffLayout = () => {
    const userSaved = localStorage.getItem("user");
    if (!(userSaved)) {
        return <Navigate to="/login" />
    }
    const userData = JSON.parse(userSaved)
    if (userData.role !== "SALES STAFF") {
        return <Navigate to="/login" />
    }
    return (
        <>
            <ProtectedLayout tabs={salesTabs} role="sales" defaultTab="dashboard" userName={userData.name}>
                <Outlet />
            </ProtectedLayout >
        </>
    );
};