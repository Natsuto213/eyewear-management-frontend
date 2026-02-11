import { useEffect } from "react";  
import { useNavigate, Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ImageWithFallback";

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import banner from "@/../public/Sale_banner.png";
import { ArrowRight } from "lucide-react";

export default function HomePage() {
    useEffect(() => {
        console.log(
            "ACCESS TOKEN IN HOMEPAGE =",
            localStorage.getItem("access_token")
        );
    }, []);

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

    function BannerSale() {
        return (
            <section className="relative h-full overflow-hidden p-5">
                {/* Background Image with Overlay */}
                <div
                    className="absolute inset-0 bg-cover bg-center z-0"
                    style={{
                        backgroundImage: `url(${banner})`,
                    }}
                >
                    {/* Dark Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/50 to-black/70 pointer-events-none" />
                </div>

                {/* Content */}
                <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center justify-end">
                    <div className="max-w-2xl text-white text-right">
                        {/* Badge */}
                        <div className="inline-block mb-4 px-4 py-2 bg-red-600 rounded-full animate-pulse">
                            <span className="text-sm uppercase tracking-wider">
                                Flash Sale
                            </span>
                        </div>

                        {/* Main Heading */}
                        <h1 className="text-5xl md:text-6xl mb-4 leading-tight">
                            Giảm Giá Đến
                            <span className="block text-yellow-400 text-7xl md:text-8xl mt-2">
                                50%
                            </span>
                        </h1>

                        {/* Subheading */}
                        <p className="text-xl md:text-2xl mb-6 text-gray-200">
                            Tất Cả Gọng & Tròng Kính
                        </p>

                        {/* Description */}
                        <p className="text-lg mb-8 text-gray-300 max-w-lg">
                            Khuyến mãi lớn nhất trong năm! Hàng ngàn mẫu gọng kính
                            thời trang và tròng kính chất lượng cao.
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-wrap gap-4 justify-end">
                            <Link
                                to="/all-product"
                                className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
                            >
                                Mua Ngay
                            </Link>
                            <Link
                                to="/about"
                                className="px-8 py-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-2 border-white rounded-lg text-lg transition-all duration-300"
                            >
                                Xem Thêm
                            </Link>
                        </div>

                        {/* Countdown Timer (Static for demo) */}
                        <div className="mt-8 flex gap-4 text-center justify-end">
                            <div className="bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg min-w-[70px]">
                                <div className="text-3xl">12</div>
                                <div className="text-xs text-gray-300 mt-1">Giờ</div>
                            </div>
                            <div className="bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg min-w-[70px]">
                                <div className="text-3xl">35</div>
                                <div className="text-xs text-gray-300 mt-1">Phút</div>
                            </div>
                            <div className="bg-black/40 backdrop-blur-sm px-4 py-3 rounded-lg min-w-[70px]">
                                <div className="text-3xl">42</div>
                                <div className="text-xs text-gray-300 mt-1">Giây</div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute bottom-0 right-0 w-1/3 h-1/3 bg-gradient-to-tl from-red-600/20 to-transparent blur-3xl" />
                <div className="absolute top-0 right-1/4 w-64 h-64 bg-yellow-400/10 rounded-full blur-3xl" />
            </section>
        );
    }

    function ProductSection({ title }) {
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
                            </div>
                            <div className="p-4">
                                <div className="text-xs text-blue-600 mb-1">
                                    Ray-ban
                                </div>
                                <p className="text-gray-900 mb-2 min-h-[48px] line-clamp-2">
                                    {productNames[i]}
                                </p>
                                <div className="flex items-center gap-2 mb-3">
                                    <span className="text-gray-600 text-lg">
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
                        className="group inline-flex items-center gap-2 px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-full hover:from-gray-700 hover:to-gray-800 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                        <span>Xem toàn bộ sản phẩm</span>
                        <ArrowRight className="size-5 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </div>
            </section>
        );
    }

    return (
        <>
            <Navbar />
            <BannerSale />
            <ProductSection title={"Best Seller"} />
            <ProductSection title={"New Arrival "} />
            <Footer />
        </>
    )
}
