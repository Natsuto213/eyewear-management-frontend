import { ImageWithFallback } from "@/components/ImageWithFallback";
import { useOutletContext, Link } from "react-router-dom";

export default function AllProductFrame() {
    const { sortedProducts, clearAllFilters } = useOutletContext();

    return (
        <div>
            {sortedProducts.length > 0 ? (
                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                        <Link
                            key={product.id}
                            to={`/product/${product.id}`}
                            className="block"
                        >
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
                                </div>
                                <div className="p-4">
                                    <div className="text-xs text-blue-600 mb-1">
                                        {product.brand}
                                    </div>
                                    <p className="text-gray-900 mb-2 min-h-[48px] line-clamp-2">
                                        {product.name}
                                    </p>
                                    <div className="flex items-center gap-2 mb-3">
                                        <span className="text-gray-600 text-lg">
                                            {product.price.toLocaleString()}đ
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="text-center py-20">
                    <div className="text-6xl mb-4">🔍</div>
                    <h3 className="text-xl mb-2">Không tìm thấy sản phẩm</h3>
                    <p className="text-gray-600 mb-4">Vui lòng thử lại với bộ lọc khác</p>
                    <button
                        onClick={clearAllFilters}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                    >
                        Xóa Bộ Lọc
                    </button>
                </div>
            )}
        </div>
    );
}
