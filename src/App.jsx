import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import HomePage from "./views/Homepage";
import LoginPage from "./views/Loginpage";
import RegisterPage from "./views/Registerpage";
import AllProduct from "./views/AllProduct";
import Profilepage from "./views/Profilepage";

import Account from "./components/PF/Account";

import CSBH from "./views/CSBHpage";
import CSMH from "./views/CSMHpage";
import CSDT from "./views/CSDTpage";

import ProductDetail from "./views/ProductDetail";
import CartPage from "./views/CartPage";
import ConfirmPage from "./views/ConfirmPage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/all-product" element={<AllProduct />} />
        <Route path="/product/:id" element={<ProductDetail />} />

        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Policy pages */}
        <Route path="/bao-hanh" element={<CSBH />} />
        <Route path="/chinh-sach-mua-hang" element={<CSMH />} />
        <Route path="/chinh-sach-doi-tra" element={<CSDT />} />

        {/* Cart & Confirm */}
        <Route path="/cart" element={<CartPage />} />
        <Route path="/confirm" element={<ConfirmPage />} />

        {/* Profile layout */}
        <Route path="/profile" element={<Profilepage />}>
          <Route path="account" element={<Account />} />
        </Route>

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
