import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './PageRoute.css'

import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import ProfilePage from './views/ProfilePage';
import Account from './components/Account';

import AllProductLayout from './views/AllProduct/AllProductLayout'
import AllProductFilter from './views/AllProduct/AllProductFilter';
import ProductDetail from "./views/ProductDetail";
import ConfirmPage from './components/Confirm';

ReactDOM.createRoot(document.getElementById("root")).render(
  <BrowserRouter>
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

      <Route path="/profile" element={<ProfilePage />}>
        <Route path="account" element={<Account />} />
      </Route>


      <Route path="/product/:id" element={<ProductDetail />} />
      <Route path="/confirm" element={<ConfirmPage />} />
      
    </Routes>
  </BrowserRouter>,
);
