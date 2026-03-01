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
import Cart from './views/CartPage';
import Confirm from './views/ConfirmPage';

import WarrantyPage from './views/Policies/WarrantyPage';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<HomePage />} />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/cart" element={<Cart />} />
      <Route path="/confirm" element={<Confirm />} />

      <Route path="/profile" element={<ProfilePage />}>
        <Route path="account" element={<Account />} />
      </Route>

      <Route path="/all-product" element={<AllProductLayout />}>
        <Route index element={<AllProductFilter />} />
        <Route path="gong" element={<AllProductFilter />} />
        <Route path="trong" element={<AllProductFilter />} />
        <Route path="kinhaptrong" element={<AllProductFilter />} />
      </Route>

      <Route path="/product/:id" element={<ProductDetail />} />

      <Route path='/warranty' element={<WarrantyPage />} />
    </Routes>
  </BrowserRouter>,
);
