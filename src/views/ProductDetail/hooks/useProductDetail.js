/**
 * useProductDetail.js
 * ====================
 * Custom Hook: Fetch thông tin chi tiết 1 sản phẩm từ API theo id.
 *
 * Cách hoạt động:
 *  1. Khi id thay đổi → tự động gọi lại API
 *  2. Dùng biến `ignore` để tránh setState sau khi component đã unmount
 *     (tránh lỗi memory leak và cảnh báo của React)
 *  3. Dùng axios (từ @/lib/api) đã cấu hình sẵn baseURL và token
 *
 * Trả về:
 *  - product: dữ liệu sản phẩm (object) hoặc null
 *  - loading: true khi đang fetch
 *  - error:   chuỗi lỗi hoặc null
 */

import { useState, useEffect } from "react";
import { api } from "@/lib/api"; // axios instance đã cấu hình sẵn baseURL

export function useProductDetail(id) {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState(null);

  useEffect(() => {
    // Nếu không có id → không fetch
    if (!id) return;

    // Biến cờ: khi component unmount hoặc id đổi, React sẽ chạy cleanup
    // → ignore = true → không setState nữa, tránh memory leak
    let ignore = false;

    async function fetchProduct() {
      try {
        setLoading(true);
        setError(null);
        setProduct(null);

        // Gọi API: GET /api/products/:id
        const response = await api.get(`/api/products/${id}`);

        // Chỉ cập nhật state nếu vẫn đang xem sản phẩm này
        if (!ignore) {
          setProduct(response.data);
        }
      } catch (err) {
        if (!ignore) {
          // Lấy message lỗi từ response API nếu có, không thì dùng message mặc định
          const message = err?.response?.data?.message || "Không thể tải sản phẩm";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    fetchProduct();

    // Cleanup function: chạy khi id đổi hoặc component unmount
    return () => {
      ignore = true;
    };
  }, [id]); // Chỉ chạy lại khi id thay đổi

  return { product, loading, error };
}
