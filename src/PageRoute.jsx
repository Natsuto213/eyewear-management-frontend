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

import { ShoppingContextProvider } from "./views/Cart/contexts/ShoppingContext";
import { UserProvider } from "./lib/UserContext";  // Import UserProvider từ lib/UserContext

import OrderPage from "./views/OperationStaffDB/OrderPage";  // Import OrderPage
import InventoryPage from "./views/OperationStaffDB/InventoryPage";  // Import InventoryPage

export default function PageRoute() {
  return (
    <ShoppingContextProvider>
      <UserProvider> {/* Bao bọc toàn bộ Routes với UserProvider */}
        <Routes>
          <Route index element={<HomePage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/confirm" element={<Confirm />} />
          <Route path="/warranty" element={<WarrantyPage />} />
          <Route path="/success" element={<SuccessPage />} />
          <Route path="/cancel" element={<CancelPage />} />
          
          {/* Các route cho OperationStaff */}
          <Route path="/operation-staff/orders" element={<OrderPage />} /> {/* Trang đơn hàng */}
          <Route path="/operation-staff/inventory" element={<InventoryPage />} /> {/* Trang kho */}
          
          <Route path="/product/:id" element={<ProductDetail />} />
        </Routes>
      </UserProvider> {/* Kết thúc UserProvider */}
    </ShoppingContextProvider>
  );
}
