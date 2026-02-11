// src/api/auth.js
import axios from "axios";

const BASE_URL = "http://localhost:8080"; // đổi theo backend bạn

export async function login(username, password) {
  const res = await axios.post(`${BASE_URL}/auth/token`, {
    username,
    password,
  });

  // backend có thể trả token theo nhiều tên khác nhau:
  const token =
    res.data?.access_token ||
    res.data?.accessToken ||
    res.data?.token;

  if (!token) {
    throw new Error("Không nhận được token từ backend");
  }

  localStorage.setItem("access_token", token);
  return token;
}