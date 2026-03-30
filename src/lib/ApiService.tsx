// src/api/index.ts
import axios from "axios";

// ─── Config ────────────────────────────────────────────────────────────────

const BASE_URL = "https://api-eyewear.sora.io.vn";

// Axios instance dùng chung, tự động gắn Bearer token
export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Token helpers ──────────────────────────────────────────────────────────

export function getToken(): string | null {
  if (!sessionStorage.getItem("session_active")) {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    return null;
  }
  return localStorage.getItem("access_token");
}

// ─── Auth ───────────────────────────────────────────────────────────────────

export async function apiLogin(username: string, password: string) {
  const res = await api.post("/auth/token", { username, password });

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
  const token = localStorage.getItem("access_token");
  try {
    if (token) await api.post("/auth/logout");
  } catch {
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

// ─── User ───────────────────────────────────────────────────────────────────

export async function apiGetMyInfo() {
  if (!getToken()) return null;
  const res = await api.get("/users/my-info");
  return res.data?.result ?? res.data;
}

export async function apiUpdateMyInfo(payload: Record<string, unknown>) {
  if (!getToken()) return null;
  const res = await api.put("/users/my-info", payload);
  return res.data;
}

// ─── Orders ─────────────────────────────────────────────────────────────────

export type OrderStatus =
  | "Đang chờ"
  | "Đang gia công"
  | "Đang đóng gói"
  | "Đang giao hàng"
  | "Hoàn thành";

export type OrderRow = {
  id: string;
  code: string;
  date: string;
  status: OrderStatus;
  type: "Pre-order" | "In-stock";
  total: string;
  customer: string;
};

export async function fetchOrders(
  token: string,
  searchParams: Record<string, unknown>
): Promise<OrderRow[]> {
  const res = await fetch(`${BASE_URL}/api/operation-staff/orders/search`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(searchParams),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("API Error:", data);
    throw new Error(data.message || "Không thể lấy danh sách đơn hàng");
  }

  if (data?.result?.content) return data.result.content;
  if (Array.isArray(data?.result)) return data.result;
  return [];
}

// ─── Default export (gộp tất cả vào 1 object) ──────────────────────────────

const apiService = {
  // instance
  api,

  // helpers
  getToken,

  // auth
  login: apiLogin,
  logout: apiLogout,
  signup: apiSignup,

  // user
  getMyInfo: apiGetMyInfo,
  updateMyInfo: apiUpdateMyInfo,

  // orders
  fetchOrders,
};

export default apiService;