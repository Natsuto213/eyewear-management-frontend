//Component sản phẩm tương tự
import { Link } from "react-router-dom";
import ProductCard from "../Common/ProductCard";

export default function RelatedSection({ title, products}) {
  if (!products || products.length === 0) return null;
  return (
    <section className="w-full bg-white mt-10">
      <div className="w-full h-[2px] bg-[#00B5AD]/30"></div>
      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-12">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight uppercase">
            {title}
          </h2>
          <Link
            to="/all-product"
            className="text-[#00B5AD] font-medium flex items-center gap-1 hover:underline"
          >
            → Xem thêm
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((item) => (
            <ProductCard key={item.id} item={item} />
          ))}
        </div>
      </div>
    </section>
  );
}