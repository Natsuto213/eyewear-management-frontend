import { Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ImageWithFallback";

export default function ProductCard({ item }) {
  return (
    <Link
      to={`/product/${item?.id}`}
      className="group border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-white"
    >
      <div className="aspect-square p-4 flex items-center justify-center overflow-hidden">
        <ImageWithFallback
          src={item?.Image_URL || item?.imageUrls?.[0]}
          alt={item?.name}
          className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
        />
      </div>
      <div className="p-4 border-t border-gray-100 text-center mt-auto">
        <p className="text-sm font-bold text-gray-800 truncate mb-1 uppercase tracking-tighter">
          {item?.name}
        </p>
        <p className="text-red-600 font-bold text-base">
          {item?.price?.toLocaleString()}đ
        </p>
      </div>
    </Link>
  );
}
