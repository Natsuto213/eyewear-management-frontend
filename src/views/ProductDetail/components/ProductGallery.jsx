//Component hiển thị ảnh chi tiết
import { ImageWithFallback } from "@/components/ImageWithFallback";

export default function ProductGallery({ images, name }) {
  return (
    <div className="w-full">
      <div className="relative aspect-[1/0.85] bg-[#F5F5F5] overflow-hidden group rounded-sm">
        <ImageWithFallback
          src={images?.[0]}
          alt={name}
          className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
        />
      </div>
    </div>
  );
}