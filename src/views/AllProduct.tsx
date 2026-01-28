import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import { ImageWithFallback } from "../figma/ImageWithFallback";
import { Filter, SlidersHorizontal } from "lucide-react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

// Mock data
const allProducts = [
    // Gọng
    {
        id: 1,
        name: "Gọng Kính Titan Cao Cấp",
        price: 1200000,
        salePrice: 960000,
        category: "gong",
        brand: "Ray-Ban",
        image: "https://images.unsplash.com/photo-1718967807816-414e2f9bc95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjkxNDc0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        id: 2,
        name: "Gọng Kính Nhựa Dẻo Hàn Quốc",
        price: 800000,
        salePrice: 640000,
        category: "gong",
        brand: "Oakley",
        image: "https://images.unsplash.com/photo-1718967807816-414e2f9bc95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjkxNDc0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        id: 3,
        name: "Gọng Kính Kim Loại Thời Trang",
        price: 950000,
        salePrice: 760000,
        category: "gong",
        brand: "Gucci",
        image: "https://images.unsplash.com/photo-1718967807816-414e2f9bc95a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxzdW5nbGFzc2VzJTIwZmFzaGlvbnxlbnwxfHx8fDE3NjkxNDc0OTB8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        id: 4,
        name: "Gọng Kính Tròn Vintage",
        price: 650000,
        salePrice: 520000,
        category: "gong",
        brand: "Montblanc",
        image: "https://images.unsplash.com/photo-1606357086272-eab87f3db598?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3VuZCUyMGdsYXNzZXN8ZW58MXx8fHwxNzY5MTU4OTkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        id: 5,
        name: "Gọng Kính Vuông Cổ Điển",
        price: 1100000,
        salePrice: 880000,
        category: "gong",
        brand: "Prada",
        image: "https://images.unsplash.com/photo-1606357086272-eab87f3db598?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3VuZCUyMGdsYXNzZXN8ZW58MXx8fHwxNzY5MTU4OTkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        id: 6,
        name: "Gọng Kính Nửa Viền Hiện Đại",
        price: 890000,
        salePrice: 712000,
        category: "gong",
        brand: "Ray-Ban",
        image: "https://images.unsplash.com/photo-1606357086272-eab87f3db598?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb3VuZCUyMGdsYXNzZXN8ZW58MXx8fHwxNzY5MTU4OTkwfDA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    // Tròng
    {
        id: 7,
        name: "Tròng Kính Cận Chống Ánh Sáng Xanh",
        price: 550000,
        salePrice: 440000,
        category: "trong",
        brand: "Essilor",
        image: "https://images.unsplash.com/photo-1582143434535-eba55a806718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250YWN0JTIwbGVuc2VzfGVufDF8fHx8MTc2OTE1ODk4OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        id: 8,
        name: "Tròng Kính Đổi Màu Transitions",
        price: 850000,
        salePrice: 680000,
        category: "trong",
        brand: "Transitions",
        image: "https://images.unsplash.com/photo-1582143434535-eba55a806718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250YWN0JTIwbGVuc2VzfGVufDF8fHx8MTc2OTE1ODk4OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        id: 9,
        name: "Tròng Kính Chống UV 400",
        price: 420000,
        salePrice: 336000,
        category: "trong",
        brand: "Hoya",
        image: "https://images.unsplash.com/photo-1582143434535-eba55a806718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250YWN0JTIwbGVuc2VzfGVufDF8fHx8MTc2OTE1ODk4OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        id: 10,
        name: "Tròng Kính Đa Tròng Progressive",
        price: 1200000,
        salePrice: 960000,
        category: "trong",
        brand: "Essilor",
        image: "https://images.unsplash.com/photo-1582143434535-eba55a806718?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb250YWN0JTIwbGVuc2VzfGVufDF8fHx8MTc2OTE1ODk4OXww&ixlib=rb-4.1.0&q=80&w=1080",
    },
    // Kính áp tròng
    {
        id: 11,
        name: "Kính Áp Tròng 1 Ngày Acuvue",
        price: 320000,
        salePrice: 256000,
        category: "kinhaptrong",
        brand: "Acuvue",
        image: "https://images.unsplash.com/photo-1627260125320-fbafe86e341e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmVkJTIwY29udGFjdCUyMGxlbnNlc3xlbnwxfHx8fDE3NjkxNjQ3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        id: 12,
        name: "Kính Áp Tròng Màu Freshlook",
        price: 380000,
        salePrice: 304000,
        category: "kinhaptrong",
        brand: "Freshlook",
        image: "https://images.unsplash.com/photo-1627260125320-fbafe86e341e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmVkJTIwY29udGFjdCUyMGxlbnNlc3xlbnwxfHx8fDE3NjkxNjQ3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        id: 13,
        name: "Kính Áp Tròng Tháng Bausch & Lomb",
        price: 450000,
        salePrice: 360000,
        category: "kinhaptrong",
        brand: "Bausch & Lomb",
        image: "https://images.unsplash.com/photo-1627260125320-fbafe86e341e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmVkJTIwY29udGFjdCUyMGxlbnNlc3xlbnwxfHx8fDE3NjkxNjQ3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
    {
        id: 14,
        name: "Kính Áp Tròng Loại Mềm Comfort",
        price: 290000,
        salePrice: 232000,
        category: "kinhaptrong",
        brand: "Cooper Vision",
        image: "https://images.unsplash.com/photo-1627260125320-fbafe86e341e?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xvcmVkJTIwY29udGFjdCUyMGxlbnNlc3xlbnwxfHx8fDE3NjkxNjQ3MjJ8MA&ixlib=rb-4.1.0&q=80&w=1080",
    },
];

export default function AllProduct() {
    const [searchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get("category");

    const [selectedCategory, setSelectedCategory] = useState<string[]>(
        categoryFromUrl ? [categoryFromUrl] : []
    );
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("newest");
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    // Get unique brands
    const brands = Array.from(new Set(allProducts.map((p) => p.brand)));

    // Filter products
    const filteredProducts = allProducts.filter((product) => {
        // Category filter
        if (
            selectedCategory.length > 0 &&
            !selectedCategory.includes(product.category)
        ) {
            return false;
        }

        // Brand filter
        if (
            selectedBrands.length > 0 &&
            !selectedBrands.includes(product.brand)
        ) {
            return false;
        }

        // Price filter
        if (priceRange === "under500" && product.salePrice >= 500000)
            return false;
        if (
            priceRange === "500-1000" &&
            (product.salePrice < 500000 || product.salePrice >= 1000000)
        )
            return false;
        if (priceRange === "over1000" && product.salePrice < 1000000)
            return false;

        return true;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "price-asc") return a.salePrice - b.salePrice;
        if (sortBy === "price-desc") return b.salePrice - a.salePrice;
        return 0; // newest
    });

    const toggleCategory = (category: string) => {
        setSelectedCategory((prev) =>
            prev.includes(category)
                ? prev.filter((c) => c !== category)
                : [...prev, category]
        );
    };

    const toggleBrand = (brand: string) => {
        setSelectedBrands((prev) =>
            prev.includes(brand)
                ? prev.filter((b) => b !== brand)
                : [...prev, brand]
        );
    };

    const clearAllFilters = () => {
        setSelectedCategory([]);
        setSelectedBrands([]);
        setPriceRange("all");
    };

    const FilterSidebar = () => (
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 h-fit sticky top-4">
            <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg flex items-center gap-2">
                    <Filter className="size-5" />
                    Bộ Lọc
                </h3>
                <button
                    onClick={clearAllFilters}
                    className="text-sm text-blue-600 hover:text-blue-700 transition"
                >
                    Xóa tất cả
                </button>
            </div>

            {/* Category Filter */}
            <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="mb-3">Loại Sản Phẩm</h4>
                <div className="space-y-2">
                    {[
                        { value: "gong", label: "Gọng Kính" },
                        { value: "trong", label: "Tròng Kính" },
                        { value: "kinhaptrong", label: "Kính Áp Tròng" },
                    ].map((cat) => (
                        <label
                            key={cat.value}
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
                        >
                            <input
                                type="checkbox"
                                checked={selectedCategory.includes(cat.value)}
                                onChange={() => toggleCategory(cat.value)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span>{cat.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Price Filter */}
            <div className="mb-6 pb-6 border-b border-gray-200">
                <h4 className="mb-3">Khoảng Giá</h4>
                <div className="space-y-2">
                    {[
                        { value: "all", label: "Tất cả" },
                        { value: "under500", label: "Dưới 500.000đ" },
                        { value: "500-1000", label: "500.000đ - 1.000.000đ" },
                        { value: "over1000", label: "Trên 1.000.000đ" },
                    ].map((range) => (
                        <label
                            key={range.value}
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
                        >
                            <input
                                type="radio"
                                name="priceRange"
                                value={range.value}
                                checked={priceRange === range.value}
                                onChange={(e) => setPriceRange(e.target.value)}
                                className="w-4 h-4 text-blue-600 focus:ring-2 focus:ring-blue-500"
                            />
                            <span>{range.label}</span>
                        </label>
                    ))}
                </div>
            </div>

            {/* Brand Filter */}
            <div>
                <h4 className="mb-3">Thương Hiệu</h4>
                <div className="space-y-2">
                    {brands.map((brand) => (
                        <label
                            key={brand}
                            className="flex items-center gap-2 cursor-pointer hover:text-blue-600 transition"
                        >
                            <input
                                type="checkbox"
                                checked={selectedBrands.includes(brand)}
                                onChange={() => toggleBrand(brand)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <span>{brand}</span>
                        </label>
                    ))}
                </div>
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50">
            <Navbar />
            {/* Header */}
            <div className="bg-white border-b border-gray-200 mt-5 shadow-sm">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl mb-2">Tất Cả Sản Phẩm</h1>
                    <p className="text-gray-600">
                        Khám phá bộ sưu tập gọng kính, tròng kính và kính áp
                        tròng
                    </p>
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Desktop Sidebar */}
                    <aside className="hidden lg:block w-64 flex-shrink-0">
                        <FilterSidebar />
                    </aside>

                    {/* Main Content */}
                    <div className="flex-1">
                        {/* Mobile Filter Button & Sort */}
                        <div className="flex items-center justify-between mb-6 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
                            <button
                                onClick={() => setShowMobileFilter(true)}
                                className="lg:hidden flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                            >
                                <SlidersHorizontal className="size-4" />
                                Bộ Lọc
                            </button>

                            <div className="flex items-center gap-2">
                                <label className="text-sm text-gray-600">
                                    Sắp xếp:
                                </label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value)}
                                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                >
                                    <option value="newest">Mới nhất</option>
                                    <option value="price-asc">
                                        Giá: Thấp → Cao
                                    </option>
                                    <option value="price-desc">
                                        Giá: Cao → Thấp
                                    </option>
                                </select>
                            </div>
                        </div>

                        {/* Results Count */}
                        <div className="mb-4 text-gray-600">
                            Hiển thị {sortedProducts.length} sản phẩm
                        </div>

                        {/* Products Grid */}
                        {sortedProducts.length > 0 ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                                {sortedProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className="group border border-gray-200 rounded-xl overflow-hidden hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white cursor-pointer"
                                    >
                                        <div className="relative overflow-hidden bg-gray-50">
                                            <ImageWithFallback
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                                            />
                                            <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full text-xs">
                                                -20%
                                            </div>
                                        </div>
                                        <div className="p-4">
                                            <div className="text-xs text-blue-600 mb-1">
                                                {product.brand}
                                            </div>
                                            <p className="text-gray-900 mb-2 min-h-[48px] line-clamp-2">
                                                {product.name}
                                            </p>
                                            <div className="flex items-center gap-2 mb-3">
                                                <span className="text-red-600 text-lg">
                                                    {product.salePrice.toLocaleString()}
                                                    đ
                                                </span>
                                                <span className="text-gray-400 text-sm line-through">
                                                    {product.price.toLocaleString()}
                                                    đ
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <div className="text-6xl mb-4">🔍</div>
                                <h3 className="text-xl mb-2">
                                    Không tìm thấy sản phẩm
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Vui lòng thử lại với bộ lọc khác
                                </p>
                                <button
                                    onClick={clearAllFilters}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                                >
                                    Xóa Bộ Lọc
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}