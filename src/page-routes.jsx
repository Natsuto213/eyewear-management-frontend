import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './page-routes.css'

import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import AllProduct from './views/AllProduct';
import AllProductFrame from './views/AllProductFrame';
import AllProductLens from './views/AllProductLens.tsx';
import AllProductContactLens from './views/AllProductContactLens';


ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/all-product" element={<AllProduct />}>
        <Route path="frame" element={<AllProductFrame />} />
        <Route path="lens" element={<AllProductLens />} />
        <Route path="contact-lens" element={<AllProductContactLens />} />
      </Route>
    </Routes>
  </BrowserRouter>
)
