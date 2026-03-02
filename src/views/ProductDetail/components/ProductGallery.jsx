/**
 * ProductGallery.jsx
 * ===================
 * Hiển thị ảnh sản phẩm:
 *  - Ảnh lớn ở trên (ảnh đầu tiên trong mảng imageUrls)
 *  - Hàng thumbnail nhỏ bên dưới (tối đa 4 ảnh)
 *  - Click thumbnail → đổi ảnh lớn
 *
 * Dùng ImageWithFallback để không bị vỡ layout khi ảnh lỗi.
 */

import { useState } from "react";
import { ImageWithFallback } from "@/components/ImageWithFallback";

/**
 * @param {string[]} images - Mảng URL ảnh từ API (imageUrls)
 * @param {string}   name   - Tên sản phẩm (dùng làm alt text)
 */
export default function ProductGallery({ images = [], name = "" }) {
    // ─── State: index ảnh đang được hiển thị lớn ─────────────────────────────
    const [activeIndex, setActiveIndex] = useState(0);

    // Ảnh hiện đang hiển thị (dùng index để đồng bộ với thumbnail)
    const mainImage = images[activeIndex] ?? images[0];

    return (
        <div className="w-full flex flex-col gap-4">
            {/* ── Ảnh lớn chính ── */}
            <div className="relative w-full aspect-4/3 bg-gray-50 rounded-xl overflow-hidden group">
                <ImageWithFallback
                    src={mainImage}
                    alt={name}
                    className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                />
            </div>

            {/* Hàng thumbnail - to hơn để dễ nhấn và thấy ảnh rõ */}
            {images.length > 0 && (
                <div className="flex gap-3 flex-wrap">
                    {images.slice(0, 5).map((url, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveIndex(index)}
                            className={`w-24 h-24 rounded-xl overflow-hidden border-2 transition-all shrink-0
                ${activeIndex === index
                                    ? "border-teal-500 shadow-md"
                                    : "border-gray-200 hover:border-teal-300"
                                }`}
                        >
                            <ImageWithFallback
                                src={url}
                                alt={`${name} - anh ${index + 1}`}
                                className="w-full h-full object-contain"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
