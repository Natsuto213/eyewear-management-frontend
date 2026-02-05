import axios from "axios";
import { api } from "./api"; // nếu file api.ts nằm cùng folder, đúng thì giữ

const BASE_URL = "http://localhost:8080";

export async function apiLogin(username: string, password: string) {
  const res = await axios.post(`${BASE_URL}/auth/token`, { username, password });

  // ✅ log nằm ĐÚNG chỗ: trong function
  console.log("LOGIN RESPONSE =", res.status, res.data, res.headers);

  // Backend của bạn trả: { code: 1000, result: {...} }
  // => token thường nằm trong result.accessToken hoặc result.token
  const token =
    res.data?.result?.accessToken ||
    res.data?.result?.access_token ||
    res.data?.result?.token ||
    res.data?.accessToken ||
    res.data?.access_token ||
    res.data?.token;

  if (!token) {
    throw new Error("Không nhận được accessToken từ backend (token nằm trong result?)");
  }

  localStorage.setItem("access_token", token);
  return token as string;
}

// ====== các hàm khác nếu bạn cần ======
export async function apiGetMyInfo() {
  const res = await api.get("/users/my-info");
  return res.data?.result ?? res.data;
}


export async function apiUpdateMyInfo(payload: {
  email: string;
  phone: string;
  name: string;
  dob: string;
  address: string;
  idNumber: string;
}) {
  const res = await api.put("/users/my-info", payload);
  return res.data;
}

export async function apiLogout() {
  const token = localStorage.getItem("access_token");

  try {
    await axios.post(
      `${BASE_URL}/auth/logout`,
      {},
      {
        headers: token ? { Authorization: `Bearer ${token}` } : undefined,
      }
    );
  } catch (err) {
    console.warn("Logout API failed:", err);
  } finally {
    localStorage.removeItem("access_token");
    localStorage.removeItem("refresh_token"); // nếu bạn có dùng
  }
}


export async function apiSignup(payload: {
  username: string;
  password: string;
  email: string;
  phone: string;
  name: string;
  dob: string;
}) {
  const res = await axios.post(`${BASE_URL}/users`, payload);
  return res.data;
}



