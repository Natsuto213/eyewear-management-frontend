/**
 * RelatedSection.jsx
 * ===================
 * Hiển thị 1 section các sản phẩm liên quan bên dưới trang chi tiết sản phẩm.
 *
 * Dùng cho 2 trường hợp:
 *  1. Sản phẩm bổ trợ (Gọng ↔ Tròng): "Tròng kính bổ trợ" / "Gọng kính bổ trợ"
 *  2. Sản phẩm tương tự cùng loại
 *
 * Nếu danh sách rỗng → không render gì (return null).
 */

import { Link } from "react-router-dom";
import ProductCard from "./ProductCard";

/**
 * @param {string}  title    - Tiêu đề section
 * @param {any[]}   products - Danh sách sản phẩm liên quan từ API
 */
export default function RelatedSection({ title, products }) {
  // Không hiển thị section nếu không có sản phẩm nào
  if (!products || products.length === 0) return null;

  return (
    <section className="w-full bg-white mt-10">
      {/* Đường kẻ teal mỏng chia tách section */}
      <div className="w-full h-0.5 bg-teal-500/20" />

      <div className="max-w-350 mx-auto px-4 md:px-10 py-12">
        {/* Header section */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900 uppercase tracking-tight">
            {title}
          </h2>
          <Link
            to="/all-product"
            className="text-teal-600 text-sm font-medium hover:underline flex items-center gap-1"
          >
            Xem thêm →
          </Link>
        </div>

        {/* Grid sản phẩm: 2 cột mobile, 4 cột desktop */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}
