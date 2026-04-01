// src/lib/ApiService.ts
import axios from "axios";

// ─── Config ─────────────────────────────────────────────────────────────────

const BASE_URL = "https://api-eyewear.sora.io.vn";

// Axios instance dùng chung cho toàn bộ app
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Request Interceptor — tự động gắn Bearer token ─────────────────────────

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Response Interceptor — xử lý token hết hạn (401) ──────────────────────

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Nếu backend trả 401 → token hết hạn hoặc không hợp lệ → logout luôn
    if (error.response?.status === 401) {
      sessionStorage.clear();
      localStorage.removeItem("access_token");
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// ─── Session helper ──────────────────────────────────────────────────────────

// sessionStorage.session_active tự xóa khi đóng tab/browser
// → đảm bảo token trong localStorage không còn hiệu lực khi mở lại
export function getToken(): string | null {
  if (!sessionStorage.getItem("session_active")) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    return null;
  }
  return localStorage.getItem("access_token");
}

// ─── Auth ────────────────────────────────────────────────────────────────────

export async function apiLogin(username: string, password: string) {
  const res = await api.post("/auth/token", { username, password });

  // Fallback nhiều key vì backend có thể trả về tên field khác nhau
  const token =
    res.data?.result?.accessToken ??
    res.data?.result?.access_token ??
    res.data?.result?.token ??
    res.data?.accessToken ??
    res.data?.access_token ??
    res.data?.token;

  if (!token) throw new Error("Không nhận được accessToken từ backend");

  localStorage.setItem("access_token", token);
  localStorage.setItem("user", JSON.stringify(res.data.result));
  sessionStorage.setItem("session_active", "true");

  return res.data.result;
}

export async function apiLogout() {
  try {
    await api.post("/auth/logout");
  } catch {
    // Token có thể đã hết hạn, bỏ qua lỗi — vẫn dọn local storage
    console.warn("Lỗi API Logout hoặc Token hết hạn.");
  } finally {
    sessionStorage.clear();
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  }
}

export async function apiSignup(payload: Record<string, unknown>) {
  const res = await api.post("/users", payload);
  return res.data;
}

// ─── User ────────────────────────────────────────────────────────────────────

export async function apiGetMyInfo() {
  const res = await api.get("/users/my-info");
  return res.data?.result ?? res.data;
}

export async function apiUpdateMyInfo(payload: Record<string, unknown>) {
  const res = await api.put("/users/my-info", payload);
  return res.data;
}