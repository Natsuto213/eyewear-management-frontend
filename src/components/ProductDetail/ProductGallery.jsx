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
      <div className="grid grid-cols-4 gap-2 mt-8">
        {images?.slice(0, 4).map((url, i) => (
          <div
            key={i}
            className="aspect-square border border-teal-500/30 overflow-hidden cursor-pointer hover:border-teal-500 transition p-1 bg-white"
          >
            <ImageWithFallback
              src={url}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    </div>
  );
}