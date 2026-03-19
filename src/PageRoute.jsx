import { Routes, Route } from "react-router-dom";
import "./PageRoute.css";
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";

import ProfilePage from "./views/ProfileCustomer/ProfilePage";
import Account from "./views/ProfileCustomer/AccountPage";
import OrderDetailCustomer from "./views/ProfileCustomer/OrderDetailCustomer";


import AllProductLayout from "./views/AllProduct/AllProductLayout";
import AllProductFilter from "./views/AllProduct/AllProductFilter";

import ProductDetail from "./views/ProductDetail";
import Cart from "./views/Cart/components/CartPage";
import Confirm from "./views/Confirm/Confirm";
import WarrantyPage from "./views/Policies/WarrantyPage";
import AboutPage from "./views/Policies/AUs";
import SuccessPage from "./views/SuccessPage";
import CancelPage from "./views/CancelPage";
import { ShoppingContextProvider } from "./views/Cart/contexts/ShoppingContext";

import { SalesStaffLayout } from './views/Dashboard/SalesStaff/SalesStaffLayout';
import OrderTable from './views/Dashboard/SalesStaff/containers/OrderTable';
import OrderDetail from './views/Dashboard/SalesStaff/ui/OrderDetail';
import ReturnOrderTable from './views/Dashboard/SalesStaff/containers/ReturnOrderTable';
import ReturnOrderDetail from './views/Dashboard/SalesStaff/ui/ReturnOrderDetail';

import { OperationStaffLayout } from "./views/Dashboard/OperationStaff/OperationStaffLayout";
import OrderPage from "./views/Dashboard/OperationStaff/OrderPage";
import InventoryPage from "./views/Dashboard/OperationStaff/InventoryPage";
import OrderDetailOps from "./views/Dashboard/OperationStaff/OrderDetailOps";

import { ManagerLayout } from './views/Dashboard/Manager/ManagerLayout';
import ManagerProductView from './views/Dashboard/Manager/ManagerProductView';
import ManagerStaffView from './views/Dashboard/Manager/ManagerStaffView';
import ManagerStatisticView from './views/Dashboard/Manager/ManagerStatisticView';
import ManagerSalesView from './views/Dashboard/Manager/ManagerSalesView';
import ManagerPoliciesView from './views/Dashboard/Manager/ManagerPoliciesView';
import PurchaseCard from "./views/Dashboard/OperationStaff/Inventory/PurchaseCard";

export default function PageRoute() {
  return (
    <ShoppingContextProvider>

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
        <Route path="/about-us" element={<AboutPage />} />

        <Route path="/profile" element={<ProfilePage />}>
          <Route path="account" element={<Account />} />
        </Route>

        <Route path="/profile/orders/:orderId" element={<OrderDetailCustomer />} />

        <Route path="/sales" element={<SalesStaffLayout />}>
          <Route index element={<OrderTable />} />
          <Route path="containers/orders" element={<OrderTable />} />
          <Route path="containers/return-orders" element={<ReturnOrderTable />} />
          <Route path="ui/orderdetail/:orderId" element={<OrderDetail />} />
          <Route path="ui/returnorderdetail/:returnExchangeId" element={<ReturnOrderDetail />} />
        </Route>

        <Route path="/operation-staff" element={<OperationStaffLayout />} >
          <Route index element={<OrderPage />} />
          <Route path="orders" element={<OrderPage />} />
          <Route path="orders/:orderId" element={<OrderDetailOps />} />
          <Route path="inventory" element={<InventoryPage />} />

          <Route path="purchase-card" element={<PurchaseCard />} />
        </Route>

        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerProductView />} />
          <Route path="product" element={<ManagerProductView />} />
          <Route path="staff" element={<ManagerStaffView />} />
          <Route path="policies" element={<ManagerPoliciesView />} />
          <Route path="sales" element={<ManagerSalesView />} />
          <Route path="static" element={<ManagerStatisticView />} />
        </Route>

      </Routes>

    </ShoppingContextProvider>
  );
}
