import { useState, useEffect } from "react";
import { api } from "@/lib/api"; // axios instance đã cấu hình sẵn baseURL

export function useProductDetail(id) {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Nếu không có id → không fetch
        if (!id) return;

        async function fetchProduct() {
            try {
                setLoading(true);
                setError(null);
                setProduct(null);
                const response = await api.get(`/api/products/${id}`);
                setProduct(response.data);
            } catch (err) {
                const message = err?.response?.data?.message || "Không thể tải sản phẩm";
                setError(message);
            } finally {
                setLoading(false);
            }
        }

        fetchProduct();
    }, [id]);

    return { product, loading, error };
}
