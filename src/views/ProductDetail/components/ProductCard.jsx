/**
 * ProductCard.jsx
 * ================
 * Card nhỏ hiển thị 1 sản phẩm trong RelatedSection.
 * Click vào → điều hướng đến trang chi tiết sản phẩm đó.
 *
 * Dữ liệu sản phẩm liên quan từ API có format khác (Image_URL, Brand)
 * nên cần xử lý cả 2 kiểu key.
 */

import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ImageWithFallback";

/**
 * @param {object} item - Sản phẩm liên quan từ relatedFrames / relatedLenses / relatedContactLenses
 */
export default function ProductCard({ item }) {
  return (
    <Link
      to={`/product/${item.id}`}
      className="group block border border-gray-200 rounded-xl overflow-hidden
        hover:shadow-xl hover:-translate-y-1 transition-all duration-300 bg-white"
    >
      {/* Ảnh sản phẩm */}
      <div className="aspect-square bg-gray-50 p-4 flex items-center justify-center overflow-hidden">
        <ImageWithFallback
          src={item.Image_URL || item.imageUrls?.[0]}
          alt={item.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>

      {/* Thông tin sản phẩm */}
      <div className="p-4 border-t border-gray-100 text-center">
        {/* Tên thương hiệu */}
        {item.Brand && (
          <p className="text-xs text-teal-600 mb-1">{item.Brand}</p>
        )}
        {/* Tên sản phẩm – cắt 2 dòng nếu quá dài */}
        <p className="text-sm font-semibold text-gray-800 line-clamp-2 leading-snug mb-2 uppercase tracking-tight">
          {item.name}
        </p>
        {/* Giá */}
        <p className="text-red-600 font-bold">
          {item.price?.toLocaleString("vi-VN")}đ
        </p>
      </div>
    </Link>
  );
}
