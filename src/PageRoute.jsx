import { Routes, Route } from "react-router-dom";
import "./PageRoute.css";
import HomePage from "./views/HomePage";
import LoginPage from "./views/LoginPage";
import RegisterPage from "./views/RegisterPage";
import ProfilePage from "./views/ProfilePage";
import Account from "./views/AccountPage";
import AllProductLayout from "./views/AllProduct/AllProductLayout";
import AllProductFilter from "./views/AllProduct/AllProductFilter";
import ProductDetail from "./views/ProductDetail";
import Cart from "./views/Cart/components/CartPage";
import Confirm from "./views/Confirm/Confirm";
import WarrantyPage from "./views/Policies/WarrantyPage";
import SuccessPage from "./views/SuccessPage";
import CancelPage from "./views/CancelPage";
import OperationStaff from "./views/OperationStaffDB/OperationStaff";

import { ShoppingContextProvider } from "./views/Cart/contexts/ShoppingContext";

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

        <Route path="/operation-staff" element={<OperationStaff />} />

        <Route path="/product/:id" element={<ProductDetail />} />

      </Routes>
    </ShoppingContextProvider>
  );
}