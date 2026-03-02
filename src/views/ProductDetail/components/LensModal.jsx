/**
 * LensModal.jsx
 * ==============
 * Modal popup để khách hàng chọn sản phẩm bổ trợ khi mua kèm đơn thuốc:
 *  - Khi mua Gọng kính → Modal chọn Tròng kính
 *  - Khi mua Tròng kính → Modal chọn Gọng kính
 *
 * Tính năng:
 *  - Fetch danh sách sản phẩm từ API (tất cả sản phẩm)
 *  - Filter theo Loại sản phẩm, Thương hiệu, Khoảng giá
 *  - Click vào card → chọn sản phẩm đó và đóng modal
 *  - Nút X để đóng modal không chọn gì
 */

import { useState, useEffect } from "react";
import { X, Filter } from "lucide-react";
import { api } from "@/lib/api";
import { ImageWithFallback } from "@/components/ImageWithFallback";

/**
 * @param {boolean}  isOpen       - Modal có đang mở không
 * @param {function} onClose      - Hàm đóng modal (không chọn)
 * @param {function} onSelect     - Hàm callback khi chọn 1 sản phẩm (nhận object sản phẩm)
 * @param {string}   filterType   - Loại sản phẩm cần lọc: "Tròng kính" hoặc "Gọng kính"
 * @param {string}   title        - Tiêu đề modal
 */
export default function LensModal({ isOpen, onClose, onSelect, filterType, title }) {
    // ─── State: danh sách sản phẩm fetch từ API ────────────────────────────────
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);

    // ─── State: bộ lọc trong modal ────────────────────────────────────────────
    const [selectedBrands, setSelectedBrands] = useState([]);
    const [priceRange, setPriceRange] = useState("all");
    const [showFilter, setShowFilter] = useState(false);

    // ─── Fetch sản phẩm khi modal mở ─────────────────────────────────────────
    useEffect(() => {
        if (!isOpen) return; // Không fetch khi modal đóng

        async function fetchProducts() {
            try {
                setLoading(true);
                const res = await api.get("/api/products/search");

                // Map dữ liệu API thành format đơn giản hơn để dùng trong modal
                // Giữ lại frameId, lensId, contactLensId → AddToCartBar cần để gọi API cart/add
                const mapped = res.data.map((p) => ({
                    id: p.id,
                    name: p.name,
                    price: p.price,
                    brand: p.Brand,
                    image: p.Image_URL,
                    productType: p.Product_Type,
                    frameId: p.frameId ?? null,           // ID gọng (có khi là Gọng kính)
                    lensId: p.lensId ?? null,             // ID tròng (có khi là Tròng kính)
                    contactLensId: p.contactLensId ?? null, // ID kính áp tròng
                }));

                // Chỉ giữ lại sản phẩm thuộc loại cần tìm (Tròng kính hoặc Gọng kính)
                const filtered = mapped.filter((p) => p.productType === filterType);
                setProducts(filtered);
            } catch (err) {
                console.error("LensModal fetch error:", err);
            } finally {
                setLoading(false);
            }
        }

        fetchProducts();

        // Reset filter mỗi lần mở modal
        setSelectedBrands([]);
        setPriceRange("all");
    }, [isOpen, filterType]);

    // ─── Không render gì khi modal đóng ───────────────────────────────────────
    if (!isOpen) return null;

    // ─── Lấy danh sách brand duy nhất để hiển thị bộ lọc ────────────────────
    const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

    // ─── Hàm toggle chọn/bỏ brand ─────────────────────────────────────────────
    function toggleBrand(brand) {
        setSelectedBrands((prev) =>
            prev.includes(brand) ? prev.filter((b) => b !== brand) : [...prev, brand]
        );
    }

    // ─── Lọc và render danh sách sản phẩm ─────────────────────────────────────
    const displayProducts = products.filter((p) => {
        // Filter theo brand
        if (selectedBrands.length > 0 && !selectedBrands.includes(p.brand)) return false;
        // Filter theo giá
        if (priceRange === "under500" && p.price >= 500000) return false;
        if (priceRange === "500-1000" && (p.price < 500000 || p.price >= 1000000)) return false;
        if (priceRange === "over1000" && p.price < 1000000) return false;
        return true;
    });

    return (
        // ── Overlay (lớp nền tối phía sau modal) ──
        <div
            className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4"
            onClick={onClose} // Click vào overlay → đóng modal
        >
            {/* ── Hộp modal ── */}
            {/* stopPropagation để click bên trong modal không đóng modal */}
            <div
                className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] flex flex-col shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                {/* ── Header modal ── */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-bold text-gray-900">{title}</h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-gray-100 rounded-full transition"
                    >
                        <X className="size-5 text-gray-500" />
                    </button>
                </div>

                {/* ── Toolbar: nút filter + số lượng ── */}
                <div className="flex items-center justify-between px-6 py-3 border-b border-gray-100 bg-gray-50">
                    <span className="text-sm text-gray-600">
                        {displayProducts.length} sản phẩm
                    </span>
                    <button
                        onClick={() => setShowFilter((v) => !v)}
                        className="flex items-center gap-2 text-sm px-3 py-1.5 border border-gray-300 rounded-lg hover:border-teal-400 transition"
                    >
                        <Filter className="size-4" />
                        Bộ lọc
                    </button>
                </div>

                {/* ── Bộ lọc (ẩn/hiện khi click nút filter) ── */}
                {showFilter && (
                    <div className="px-6 py-4 border-b border-gray-100 bg-gray-50 flex flex-wrap gap-6">
                        {/* Lọc theo thương hiệu */}
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Thương hiệu</p>
                            <div className="flex flex-wrap gap-2">
                                {brands.map((brand) => (
                                    <button
                                        key={brand}
                                        onClick={() => toggleBrand(brand)}
                                        className={`px-3 py-1 rounded-full text-xs border transition
                      ${selectedBrands.includes(brand)
                                                ? "bg-teal-500 text-white border-teal-500"
                                                : "bg-white text-gray-600 border-gray-300 hover:border-teal-400"
                                            }`}
                                    >
                                        {brand}
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Lọc theo giá */}
                        <div>
                            <p className="text-xs font-semibold text-gray-500 uppercase mb-2">Khoảng giá</p>
                            <div className="flex flex-wrap gap-2">
                                {[
                                    { value: "all", label: "Tất cả" },
                                    { value: "under500", label: "< 500k" },
                                    { value: "500-1000", label: "500k – 1 triệu" },
                                    { value: "over1000", label: "> 1 triệu" },
                                ].map((range) => (
                                    <button
                                        key={range.value}
                                        onClick={() => setPriceRange(range.value)}
                                        className={`px-3 py-1 rounded-full text-xs border transition
                      ${priceRange === range.value
                                                ? "bg-teal-500 text-white border-teal-500"
                                                : "bg-white text-gray-600 border-gray-300 hover:border-teal-400"
                                            }`}
                                    >
                                        {range.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* ── Danh sách sản phẩm ── */}
                <div className="flex-1 overflow-y-auto px-6 py-4">
                    {loading ? (
                        // Trạng thái đang tải
                        <div className="flex justify-center py-20">
                            <div className="w-8 h-8 border-4 border-gray-200 border-t-teal-500 rounded-full animate-spin" />
                        </div>
                    ) : displayProducts.length === 0 ? (
                        // Không có sản phẩm phù hợp
                        <div className="text-center py-16 text-gray-400">
                            <p>Khong tim thay san pham phu hop</p>
                        </div>
                    ) : (
                        // Grid sản phẩm
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {displayProducts.map((product) => (
                                <button
                                    key={product.id}
                                    onClick={() => {
                                        onSelect(product); // Trả sản phẩm đã chọn về cho cha
                                        onClose();         // Đóng modal
                                    }}
                                    className="group border border-gray-200 rounded-xl overflow-hidden text-left hover:border-teal-400 hover:shadow-lg transition-all duration-200"
                                >
                                    {/* Ảnh sản phẩm */}
                                    <div className="bg-gray-50 p-3 aspect-square flex items-center justify-center overflow-hidden">
                                        <ImageWithFallback
                                            src={product.image}
                                            alt={product.name}
                                            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                                        />
                                    </div>
                                    {/* Thông tin */}
                                    <div className="p-3">
                                        <p className="text-xs text-teal-600 mb-0.5">{product.brand}</p>
                                        <p className="text-xs font-semibold text-gray-800 line-clamp-2 leading-snug mb-1">
                                            {product.name}
                                        </p>
                                        <p className="text-sm font-bold text-red-600">
                                            {product.price?.toLocaleString("vi-VN")}đ
                                        </p>
                                    </div>
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
