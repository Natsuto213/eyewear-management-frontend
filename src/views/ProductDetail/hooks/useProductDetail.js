/**
 * useProductDetail.js
 * Chức năng:
 * - Fetch sản phẩm theo id
 * - Quản lý loading/error/product
 * - Tách khỏi index.jsx để page gọn
 */

import { useEffect, useState } from "react";

/**
 * useProductDetail
 * @param {string|number} id - id sản phẩm từ router params
 * @returns {{product: any, loading: boolean, error: string|null}}
 */
export function useProductDetail(id) {
  const [product, setProduct] = useState(null); // dữ liệu sản phẩm
  const [loading, setLoading] = useState(true); // trạng thái loading
  const [error, setError] = useState(null); // lỗi khi fetch

  useEffect(() => {
    let ignore = false; // tránh setState khi component unmount / id đổi quá nhanh

    async function fetchProduct() {
      try {
        setError(null);
        setLoading(true);

        const res = await fetch(`https://api-eyewear.purintech.id.vn/api/products/${id}`);
        if (!res.ok) throw new Error("Không tìm thấy sản phẩm!");

        const data = await res.json();
        if (!ignore) setProduct(data);
      } catch (err) {
        if (!ignore) {
          setProduct(null);
          setError(err?.message || "Có lỗi xảy ra");
        }
      } finally {
        if (!ignore) setLoading(false);
      }
    }

    if (id) fetchProduct();

    return () => { //Khi component unmount hoặc id đổi (effect cũ bị dọn dẹp), React sẽ chạy cleanup
      ignore = true;
    };
  }, [id]);

  return { product, loading, error };
}