import { useState, useEffect } from "react";
import axios from "axios";

// URL của API
const BASE_URL = "https://api-eyewear.purintech.id.vn";

// Hàm đăng nhập
async function apiLogin(username: string, password: string) {
  const res = await axios.post(`${BASE_URL}/auth/token`, { username, password });

  console.log("LOGIN RESPONSE =", res.status, res.data, res.headers);

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

  localStorage.setItem("access_token", token);
  localStorage.setItem("user", JSON.stringify(res.data.result)); // lưu thông tin người dùng
  return res.data.result;
}

// Hàm lấy thông tin người dùng
async function apiGetMyInfo() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    console.error("Không có token, không thể lấy thông tin người dùng");
    return;
  }

  const res = await axios.get(`${BASE_URL}/users/my-info`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data?.result ?? res.data;
}

// Hàm cập nhật thông tin người dùng
async function apiUpdateMyInfo(payload: { email: string; phone: string; name: string; dob: string; address: string; idNumber: string }) {
  const token = localStorage.getItem("access_token");

  if (!token) {
    console.error("Không có token, không thể cập nhật thông tin người dùng");
    return;
  }

  const res = await axios.put(`${BASE_URL}/users/my-info`, payload, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data;
}

// Hàm đăng xuất
// ... các hàm khác giữ nguyên ...

async function apiLogout() {
  const token = localStorage.getItem("access_token");

  if (!token) {
    // Nếu không có token, vẫn cứ xóa sạch để đảm bảo trạng thái "sạch"
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    return;
  }

  try {
    await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
  } catch (err) {
    console.warn("Lỗi API Logout hoặc Token hết hạn, tiến hành xóa dữ liệu local.");
  } finally {
    // ĐẢM BẢO XÓA SẠCH DÙ CÓ LỖI HAY KHÔNG
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("refresh_token");
    // Nếu bạn muốn xóa cả trạng thái giỏ hàng cũ khi logout:
    // localStorage.removeItem("cart"); 
    
    // Ép trình duyệt reload để xóa sạch state cũ của React (nếu cần)
    window.location.href = "/login";
  }
}

// Hàm đăng ký
async function apiSignup(payload: { username: string; password: string; email: string; phone: string; name: string; dob: string }) {
  const res = await axios.post(`${BASE_URL}/users`, payload);
  return res.data;
}

// Component kiểm tra trạng thái đăng nhập và gọi API logout
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // Kiểm tra token khi ứng dụng khởi động
    const token = localStorage.getItem("access_token");
    setIsLoggedIn(!!token); // Đặt trạng thái đăng nhập dựa trên sự tồn tại của token
  }, []);

  const handleLogout = () => {
    // Gọi API logout và xóa token
    apiLogout().then(() => {
      setIsLoggedIn(false); // Đặt lại trạng thái đăng nhập
    });
  };

  return null; // Component này không cần hiển thị gì
}

export { apiLogin, apiGetMyInfo, apiUpdateMyInfo, apiLogout, apiSignup, App };
