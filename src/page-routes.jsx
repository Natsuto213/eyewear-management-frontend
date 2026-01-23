import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './page-routes.css'

import HomePage from './views/Homepage';
import LoginPage from './views/LoginPage';
import RegisterPage from './views/RegisterPage';
import AllProduct from './views/AllProduct';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/all-product" element={<AllProduct />} />
      <Route path="/login" element={<Loginpage />} />
      <Route path="/register" element={<Registerpage />} />
    </Routes>
  </BrowserRouter>
)
