import { useNavigate } from "react-router-dom";
import { ImageWithFallback } from "../figma/ImageWithFallback";

const productImages = [
    "https://images.unsplash.com/photo-1641048927024-0e801784b4f7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxleWVnbGFzc2VzJTIwZnJhbWVzfGVufDF8fHx8MTc2OTAyODUwM3ww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1762718900539-c51799fd71b3?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxvcHRpY2FsJTIwZ2xhc3NlcyUyMHN0b3JlfGVufDF8fHx8MTc2OTA0MzEwMHww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1764333327297-0ebfd9fda541?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZGlzcGxheXxlbnwxfHx8fDE3NjkwMjMzMTZ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1603578119639-798b8413d8d7?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzcGVjdGFjbGVzJTIwZnJhbWVzfGVufDF8fHx8MTc2OTA0MzEwMXww&ixlib=rb-4.1.0&q=80&w=1080",
    "https://images.unsplash.com/photo-1646084081219-1090f72a531c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxkZXNpZ25lciUyMGV5ZXdlYXJ8ZW58MXx8fHwxNzY5MDQzMTAxfDA&ixlib=rb-4.1.0&q=80&w=1080",
];

const productNames = [
    "Gọng Kính Titan Cao Cấp",
    "Gọng Kính Nhựa Dẻo",
    "Gọng Kính Kim Loại",
    "Gọng Kính Phong Cách",
    "Gọng Kính Thời Trang",
];

const products = Array.from({ length: 5 });

export default function ProductSection({ title }) {
    const navigate = useNavigate();

    const handleViewAll = () => {
        navigate("/all-product");
    };

    return (
        <section className="max-w-7xl mx-auto px-4 py-10 m-2">
            <div className="flex justify-between items-center mb-8">
                <h3 className="text-2xl">{title}</h3>
                <select className="border border-gray-300 px-4 py-2 rounded-lg bg-white hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition cursor-pointer">
                    <option>Gọng</option>
                    <option>Tròng</option>
                </select>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                {products.map((_, i) => (
                    <div
                        key={i}
                        className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white cursor-pointer"
                    >
                        <div className="relative overflow-hidden bg-gray-50">
                            <ImageWithFallback
                                src={productImages[i]}
                                alt={productNames[i]}
                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                            />
                            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs">
                                -20%
                            </div>
                        </div>
                        <div className="p-4">
                            <p className="text-gray-900 mb-2 min-h-[48px]">
                                {productNames[i]}
                            </p>
                            <div className="flex items-center gap-2">
                                <span className="text-red-600 text-lg">
                                    960.000đ
                                </span>
                                <span className="text-gray-400 text-sm line-through">
                                    1.200.000đ
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            <div className="text-center mt-6">
                <button
                    onClick={handleViewAll}
                    className="border px-5 py-2 rounded hover:bg-gray-100"
                >
                    Xem toàn bộ sản phẩm
                </button>
            </div>
        </section>
    );
}
