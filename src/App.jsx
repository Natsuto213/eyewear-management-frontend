import React from 'react'
import { Routes, Route } from "react-router"; // Dùng react-router
import '@/App.css'

import HomePage from './views/Homepage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import ProfilePage from './views/ProfilePage';
import Account from './components/Account';

import AllProductLayout from './views/AllProduct/AllProductLayout'
import AllProductFilter from './views/AllProduct/AllProductFilter';
import ProductDetail from "./views/ProductDetail";
import CSMHpage from './views/CSMHpage';
import CSDTpage from './views/CSDTpage';
import CSBHpage from './views/CSBHpage';
import Cart from './views/CartPage';
import Confirm from './views/ConfirmPage';

function App() {
  return (
    <Routes>
      <Route index element={<HomePage />} />

      <Route path="/all-product" element={<AllProductLayout />} >
        <Route index element={<AllProductFilter />} />
        <Route path="gong" element={<AllProductFilter />} />
        <Route path="trong" element={<AllProductFilter />} />
        <Route path="kinhaptrong" element={<AllProductFilter />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/chinh-sach-mua-hang" element={<CSMHpage />} />
      <Route path="/chinh-sach-doi-tra" element={<CSDTpage />} />
      <Route path="/bao-hanh" element={<CSBHpage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/confirm" element={<Confirm />} />

      <Route path="/profile" element={<ProfilePage />}>
        <Route path="account" element={<Account />} />
      </Route>

      <Route path="/product/:id" element={<ProductDetail />} />
    </Routes>
  );
}

export default App; 