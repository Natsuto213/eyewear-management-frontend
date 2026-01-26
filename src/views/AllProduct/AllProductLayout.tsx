import { useEffect, useState } from "react";
import { Outlet, useSearchParams, useLocation } from "react-router-dom";
import { Filter, SlidersHorizontal } from "lucide-react";

import api from "@/lib/axios";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function AllProductLayout() {
    const [allProducts, setAllProducts] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [searchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get("category");

    const [selectedCategory, setSelectedCategory] = useState<string[]>(
        categoryFromUrl ? [categoryFromUrl] : []
    );
    const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState<string>("all");
    const [sortBy, setSortBy] = useState<string>("newest");
    const [showMobileFilter, setShowMobileFilter] = useState(false);

    const location = useLocation();

    const fetchProducts = async () => {
        try {
            setLoading(true);
            setError(null);

            const res = await api.get("/products/search");

            const mapped = res.data.map((p: any) => {
                const type = p.Product_Type?.toLowerCase().trim() || "";

                return {
                    id: p.id,
                    name: p.name,
                    price: Number(p.price),
                    brand: p.Brand,
                    image: p.Image_URL?.startsWith("http")
                        ? p.Image_URL
                        : `http://localhost:8080/${p.Image_URL}`,
                    category: type.includes("gong")
                        ? "gong"
                        : type.includes("trong") && !type.includes("ap")
                            ? "trong"
                            : "kinhaptrong",
                };
            });

            setAllProducts(mapped);

            console.log("API raw:", res.data);
            console.log("Mapped:", mapped);
        } catch (err) {
            console.error("Fetch products error:", err);
            setError("Không thể tải danh sách sản phẩm");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    useEffect(() => {
        if (location.pathname === "/all-product/gong") {
            setSelectedCategory(["gong"]);
        } else if (location.pathname === "/all-product/trong") {
            setSelectedCategory(["trong"]);
        } else if (location.pathname === "/all-product/kinh-ap-trong") {
            setSelectedCategory(["kinhaptrong"]);
        } else {
            setSelectedCategory([]);
        }
    }, [location.pathname]);

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
        if (priceRange === "under500" && product.price >= 500000)
            return false;
        if (
            priceRange === "500-1000" &&
            (product.price < 500000 || product.price >= 1000000)
        )
            return false;
        if (priceRange === "over1000" && product.price < 1000000)
            return false;

        return true;
    });

    // Sort products
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        if (sortBy === "price-asc") return a.price - b.price;
        if (sortBy === "price-desc") return b.price - a.price;
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

                        {loading && <div>Đang tải sản phẩm...</div>}
                        {error && <div className="text-red-500">{error}</div>}

                        {/* Products Grid */}
                        <Outlet context={{ sortedProducts, clearAllFilters }} />
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    );
}