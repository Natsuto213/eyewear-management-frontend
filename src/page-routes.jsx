import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from "react-router";
import './page-routes.css'

import HomePage from './views/HomePage';
import LoginPage from './views/LoginPage';
import AllProduct from './views/AllProduct';

ReactDOM.createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <Routes>
      <Route index element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/all-product" element={<AllProduct />}>
      </Route>
    </Routes>
  </BrowserRouter>
)
