import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './App.css'

import HomePage from '@/views/Homepage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import ProfilePage from './views/ProfilePage';
import Account from './components/Account';

import AllProductLayout from './views/AllProduct/AllProductLayout'
import AllProductFilter from './views/AllProduct/AllProductFilter';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<HomePage />} />

      <Route path="/all-product" element={<AllProductLayout />} >
        <Route index element={<AllProductFilter />} />
        <Route path="gong" element={<AllProductFilter />} />
        <Route path="trong" element={<AllProductFilter />} />
        <Route path="kinh-ap-trong" element={<AllProductFilter />} />
      </Route>

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      <Route path="/profile" element={<ProfilePage />}>
        <Route path="account" element={<Account />} />
      </Route>

    </Routes>
  </BrowserRouter>
)
