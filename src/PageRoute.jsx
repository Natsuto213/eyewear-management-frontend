import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './PageRoute.css'

import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import ProfilePage from './views/ProfilePage';
import Account from './views/AccountPage';

import AllProductLayout from './views/AllProduct/AllProductLayout'
import AllProductFilter from './views/AllProduct/AllProductFilter';
import ProductDetail from "./views/ProductDetail";
import Cart from './views/Cart/components/CartPage';
import Confirm from './views/Confirm/Confirm';

import WarrantyPage from './views/Policies/WarrantyPage';

import SuccessPage from './views/SuccessPage';
import CancelPage from './views/CancelPage';

import { ManagerLayout } from './views/Dashboard/Manager/ManagerLayout';
import ManagerProductView from './views/Dashboard/Manager/ManagerProductView';
import ManagerStaffView from './views/Dashboard/Manager/ManagerStaffView';
import ManagerStaticView from './views/Dashboard/Manager/ManagerStaticView';
import ManagerSalesView from './views/Dashboard/Manager/ManagerSalesView';
import ManagerPoliciesView from './views/Dashboard/Manager/ManagerPoliciesView';

import { ShoppingContextProvider } from './views/Cart/contexts/ShoppingContext';

import OrderTable from './views/Dashboard/SalesStaff/containers/OrderTable';
import { SalesStaffLayout } from './views/Dashboard/SalesStaff/SalesStaffLayout';
import OrderDetail from './views/Dashboard/SalesStaff/ui/OrderDetail';

ReactDOM.createRoot(document.getElementById("root")).render(
    <ShoppingContextProvider>
        <BrowserRouter>
            <Routes>
                <Route index element={<HomePage />} />

                <Route path="/all-product" element={<AllProductLayout />}>
                    <Route index element={<AllProductFilter />} />
                    <Route path="gong" element={<AllProductFilter />} />
                    <Route path="trong" element={<AllProductFilter />} />
                    <Route path="kinhaptrong" element={<AllProductFilter />} />
                </Route>

                <Route path="/product/:id" element={<ProductDetail />} />

                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />
                <Route path="/cart" element={<Cart />} />
                <Route path="/confirm" element={<Confirm />} />

                <Route path="/warranty" element={<WarrantyPage />} />

                <Route path="/success" element={<SuccessPage />} />
                <Route path="/cancel" element={<CancelPage />} />

                <Route path="/profile" element={<ProfilePage />}>
                    <Route path="account" element={<Account />} />
                </Route>

                <Route path="/manager" element={<ManagerLayout />}>
                    <Route index element={<ManagerProductView />} />
                    <Route path="product" element={<ManagerProductView />} />
                    <Route path="staff" element={<ManagerStaffView />} />
                    <Route path="policies" element={<ManagerPoliciesView />} />
                    <Route path="sales" element={<ManagerSalesView />} />
                    <Route path="static" element={<ManagerStaticView />} />
                </Route>

                <Route path="/sales" element={<SalesStaffLayout />}>
                    <Route index element={<OrderTable />} />
                    <Route path="containers/orders" element={<OrderTable />} />
                    <Route path="ui/orderdetail" element={<OrderDetail />} />
                </Route>

            </Routes>
        </BrowserRouter>
    </ShoppingContextProvider >
);
