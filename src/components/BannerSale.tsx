import { Link } from "react-router-dom";
import banner from "../assets/Sale_banner.png";

export default function BannerSale() {
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
