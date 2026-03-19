import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";

import { ImageWithFallback } from "@/components/ImageWithFallback";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api } from "@/lib/api"; 

import banner1 from "@/assets/Sale_banner_01.png"; 
import banner2 from "@/assets/Sale_banner_02.png"; 
import banner3 from "@/assets/Sale_banner_03.png"; 

// Hàm hỗ trợ format ngày (YYYY-MM-DD)
const getFormattedDate = (date: Date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
};

export default function HomePage() {
    const [bestSellers, setBestSellers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchHomepageData = async () => {
            try {
                // TÍNH TOÁN NGÀY: StartDate = Mùng 1 đầu tháng, EndDate = Hôm nay
                const todayDate = new Date();
                
                const firstDayOfMonth = new Date(todayDate.getFullYear(), todayDate.getMonth(), 1);
                
                const start = getFormattedDate(firstDayOfMonth);
                const end = getFormattedDate(todayDate);

                // GỌI CHUNG API DASHBOARD
                const response = await api.get(`/api/v1/dashboard?startDate=${start}&endDate=${end}`); 
                
                // Lấy mảng topProducts ra (chỉ lấy tối đa 5 cái cho đẹp giao diện)
                const topProducts = response.data?.topProducts || [];
                const top5 = topProducts.slice(0, 5);

                setBestSellers(top5);
                
            } catch (error) {
                console.error("Lỗi khi tải sản phẩm trang chủ:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchHomepageData();
    }, []);

    // ----------------------------------------------------
    // COMPONENT: BANNER SLIDER (Tự lướt + Đếm ngược)
    // ----------------------------------------------------
    function BannerSlider() {
        const banners = [
            { id: 1, image: banner1, title: "Giảm Giá Đến", highlight: "50%", desc: "Khuyến mãi lớn nhất trong năm! Hàng ngàn mẫu kính thời trang." },
            { id: 2, image: banner2, title: "BST Mùa Hè", highlight: "Mới Lên Kệ", desc: "Khám phá ngay bộ sưu tập kính mát cực chất cho mùa hè sôi động." },
            { id: 3, image: banner3, title: "Đồng Giá Dưới", highlight: "399K", desc: "Rất nhiều gọng kính nhựa dẻo siêu nhẹ, cực bền đang chờ bạn." }
        ];

        const [currentSlide, setCurrentSlide] = useState(0);
        const [timeLeft, setTimeLeft] = useState({ hours: 0, minutes: 0, seconds: 0 });

        useEffect(() => {
            const slideTimer = setInterval(() => {
                setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
            }, 5000);

            const countdownTimer = setInterval(() => {
                const now = new Date();
                const midnight = new Date();
                midnight.setHours(24, 0, 0, 0); 
                const diff = midnight.getTime() - now.getTime();

                setTimeLeft({
                    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
                    minutes: Math.floor((diff / 1000 / 60) % 60),
                    seconds: Math.floor((diff / 1000) % 60)
                });
            }, 1000);

            return () => {
                clearInterval(slideTimer);
                clearInterval(countdownTimer);
            };
        }, [banners.length]);

        const nextSlide = () => setCurrentSlide((prev) => (prev === banners.length - 1 ? 0 : prev + 1));
        const prevSlide = () => setCurrentSlide((prev) => (prev === 0 ? banners.length - 1 : prev - 1));

        return (
            <section className="relative h-[600px] overflow-hidden">
                {banners.map((banner, index) => (
                    <div
                        key={banner.id}
                        className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                            index === currentSlide ? "opacity-100 z-10" : "opacity-0 z-0"
                        }`}
                    >
                        <div
                            className="absolute inset-0 bg-cover bg-center"
                            style={{ backgroundImage: `url(${banner.image})` }}
                        >
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/50 to-black/80" />
                        </div>

                        <div className="relative z-10 h-full max-w-7xl mx-auto px-4 flex items-center justify-end">
                            <div className="max-w-2xl text-white text-right">
                                <div className="inline-block mb-4 px-4 py-2 bg-red-600 rounded-full animate-pulse">
                                    <span className="text-sm uppercase tracking-wider font-bold">Flash Sale Mùa Hè</span>
                                </div>

                                <h1 className="text-5xl md:text-6xl mb-4 leading-tight font-light">
                                    {banner.title}
                                    <span className="block text-yellow-400 text-7xl md:text-8xl mt-2 font-bold drop-shadow-lg">
                                        {banner.highlight}
                                    </span>
                                </h1>

                                <p className="text-lg mb-8 text-gray-200 max-w-lg ml-auto">
                                    {banner.desc}
                                </p>

                                <div className="flex flex-wrap gap-4 justify-end">
                                    <Link to="/all-product" className="px-8 py-4 bg-red-600 hover:bg-red-700 rounded-lg text-lg font-bold transition-all duration-300 transform hover:scale-105 shadow-lg">
                                        Test VERCEL
                                    </Link>
                                </div>

                                <div className="mt-8 flex gap-4 text-center justify-end">
                                    <div className="bg-black/60 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10">
                                        <div className="text-3xl font-bold text-white">{String(timeLeft.hours).padStart(2, '0')}</div>
                                        <div className="text-xs text-gray-400 mt-1 uppercase">Giờ</div>
                                    </div>
                                    <div className="text-3xl font-bold text-white/50 pt-2">:</div>
                                    <div className="bg-black/60 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10">
                                        <div className="text-3xl font-bold text-white">{String(timeLeft.minutes).padStart(2, '0')}</div>
                                        <div className="text-xs text-gray-400 mt-1 uppercase">Phút</div>
                                    </div>
                                    <div className="text-3xl font-bold text-white/50 pt-2">:</div>
                                    <div className="bg-black/60 backdrop-blur-md px-5 py-3 rounded-xl border border-white/10">
                                        <div className="text-3xl font-bold text-red-400">{String(timeLeft.seconds).padStart(2, '0')}</div>
                                        <div className="text-xs text-gray-400 mt-1 uppercase">Giây</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}

                <button onClick={prevSlide} className="absolute left-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all">
                    <ChevronLeft className="w-6 h-6" />
                </button>
                <button onClick={nextSlide} className="absolute right-4 top-1/2 -translate-y-1/2 z-20 p-3 bg-black/30 hover:bg-black/60 text-white rounded-full backdrop-blur-sm transition-all">
                    <ChevronRight className="w-6 h-6" />
                </button>

                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
                    {banners.map((_, index) => (
                        <button 
                            key={index} 
                            onClick={() => setCurrentSlide(index)}
                            className={`h-2 rounded-full transition-all ${index === currentSlide ? "w-8 bg-red-600" : "w-2 bg-white/50 hover:bg-white"}`} 
                        />
                    ))}
                </div>
            </section>
        );
    }

    // ----------------------------------------------------
    // COMPONENT: DANH SÁCH SẢN PHẨM 
    // ----------------------------------------------------
    function ProductSection({ title, dataList }) {
        return (
            <section className="max-w-7xl mx-auto px-4 py-12">
                <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
                    <h3 className="text-3xl font-bold text-gray-800 relative">
                        {title}
                        <span className="absolute -bottom-[17px] left-0 w-1/2 h-1 bg-black"></span>
                    </h3>
                    <Link to="/all-product" className="text-sm font-medium text-gray-500 hover:text-black transition-colors flex items-center gap-1">
                        Xem tất cả <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-20">
                        <div className="w-8 h-8 border-4 border-gray-200 border-t-black rounded-full animate-spin"></div>
                    </div>
                ) : dataList.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
                        {dataList.map((product: any, index: number) => {
                            const avatarUrl = product.image || product.Image_URL;
                            const productName = product.name || product.productName;
                            const productPrice = product.price;

                            return (
                                <Link
                                    to={`/product/${product.id}`}
                                    key={index}
                                    className="group flex flex-col bg-white border border-gray-100 rounded-2xl overflow-hidden hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] transition-all duration-300 transform hover:-translate-y-1"
                                >
                                    <div className="relative aspect-square overflow-hidden bg-gray-50 p-4 flex items-center justify-center">
                                        <ImageWithFallback
                                            src={avatarUrl}
                                            alt={productName}
                                            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-700 ease-out"
                                        />
                                        {/* Huy hiệu hiển thị số lượng đã bán dựa vào mảng TopProducts */}
                                        {product.sold && (
                                            <div className="absolute top-3 left-3 px-2 py-1 bg-red-100 text-red-600 text-[10px] font-bold tracking-wider rounded uppercase shadow-sm">
                                                Đã bán: {product.sold}
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-5 flex flex-col flex-1">
                                        <h4 className="text-sm font-medium text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors leading-relaxed">
                                            {productName}
                                        </h4>
                                        <div className="mt-auto pt-4 border-t border-gray-100 flex items-center justify-between">
                                            <span className="text-base font-bold text-red-600">
                                                {(productPrice || 0).toLocaleString('vi-VN')}đ
                                            </span>
                                            <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-black group-hover:text-white transition-colors">
                                                <ArrowRight className="w-4 h-4" />
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            )
                        })}
                    </div>
                ) : (
                    <div className="text-center py-10 text-gray-500">Chưa có sản phẩm nào để hiển thị</div>
                )}
            </section>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Navbar />
            
            <main>
                <BannerSlider />
                
                <div className="h-8"></div>

                <ProductSection title={`Best Seller Tháng ${new Date().getMonth() + 1}`} dataList={bestSellers} />
                
                <div className="h-12"></div>
            </main>

            <Footer />
        </div>
    );
}