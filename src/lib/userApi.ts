import { useState, useEffect } from "react";
import axios from "axios";

const BASE_URL = "https://api-eyewear.purintech.id.vn";

// 1. Hàm đăng nhập
async function apiLogin(username: string, password: string) {
  const res = await axios.post(`${BASE_URL}/auth/token`, { username, password });

  const token =
    res.data?.result?.accessToken ||
    res.data?.result?.access_token ||
    res.data?.result?.token ||
    res.data?.accessToken ||
    res.data?.access_token ||
    res.data?.token;

  if (!token) {
    throw new Error("Không nhận được accessToken từ backend");
  }

  // Dùng localStorage để tự động logout khi đóng trình duyệt/tab
  localStorage.setItem("access_token", token);
  localStorage.setItem("user", JSON.stringify(res.data.result));

  sessionStorage.setItem("session_active", "true");
  
  return res.data.result;
}

// 2. Hàm lấy thông tin
async function apiGetMyInfo() {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  const res = await axios.get(`${BASE_URL}/users/my-info`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data?.result ?? res.data;
}

// 3. Hàm cập nhật thông tin
async function apiUpdateMyInfo(payload: any) {
  const token = localStorage.getItem("access_token");
  if (!token) return;

  const res = await axios.put(`${BASE_URL}/users/my-info`, payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return res.data;
}

// 4. Hàm đăng xuất (Đã tối ưu để xóa sạch dấu vết)
async function apiLogout() {
  const token = localStorage.getItem("access_token");

  try {
    if (token) {
      await axios.post(`${BASE_URL}/auth/logout`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch (err) {
    console.warn("Lỗi API Logout hoặc Token hết hạn.");
  } finally {
    // Xóa sạch cả Session và Local (để dọn dẹp triệt để dữ liệu cũ)
    sessionStorage.clear();
    localStorage.removeItem("access_token"); // Xóa nốt cái cũ kẹt ở đây
    localStorage.removeItem("user");
    
    // Quay về trang login và tải lại toàn bộ trang để reset React State
    window.location.href = "/login";
  }
}

// 5. Hàm đăng ký
async function apiSignup(payload: any) {
  const res = await axios.post(`${BASE_URL}/users`, payload);
  return res.data;
}

function getToken() {
  // Nếu không có session flag → tắt máy/npm run dev lại → xóa token
  const sessionActive = sessionStorage.getItem("session_active");
  
  if (!sessionActive) {
    // Session mới, chưa đăng nhập lại → xóa token cũ
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    return null;
  }
  
  return localStorage.getItem("access_token");
}

export { apiLogin, apiGetMyInfo, apiUpdateMyInfo, apiLogout, apiSignup, getToken };