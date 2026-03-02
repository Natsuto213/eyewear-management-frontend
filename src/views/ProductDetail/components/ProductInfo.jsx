/**
 * ProductInfo.jsx
 * ================
 * Hiển thị thông tin cơ bản của sản phẩm ở đầu cột phải:
 *  - Tên sản phẩm, mã SKU
 *  - Thương hiệu (brand)
 *  - Giá bán (màu đỏ, nổi bật)
 *  - Thông tin đặc trưng: diameter, waterContent (cho Kính áp tròng)
 *
 * Nhận toàn bộ object product từ cha, chỉ hiển thị, không có logic.
 */

/**
 * @param {object} product - Dữ liệu sản phẩm từ API
 * @param {boolean} isContact - True nếu là Kính áp tròng (để hiện thêm thông số đặc trưng)
 */
export default function ProductInfo({ product, isContact }) {
    return (
        <div className="mb-4">
            {/* Tên sản phẩm + Mã hàng */}
            <h1 className="text-xl md:text-2xl font-bold uppercase leading-snug mb-1">
                {product.name}
            </h1>

            <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">
                Mã hàng: <span className="font-semibold text-gray-600">{product.sku}</span>
                {product.brandName && (
                    <>
                        {" · "}
                        Thương hiệu: <span className="font-semibold text-gray-600">{product.brandName}</span>
                    </>
                )}
            </p>

            {/* Giá bán – nổi bật màu đỏ */}
            <p className="text-3xl font-bold text-red-600 font-mono mb-4">
                {product.price?.toLocaleString("vi-VN")}đ
            </p>

            {/* Thông số đặc trưng cho Kính áp tròng */}
            {isContact && (
                <div className="flex gap-4 flex-wrap text-sm text-gray-600 bg-teal-50 border border-teal-100 rounded-lg px-4 py-3 mb-2">
                    {product.diameter && (
                        <span>
                            Duong kinh: <strong className="text-teal-700">{product.diameter} mm</strong>
                        </span>
                    )}
                    {product.waterContent && (
                        <span>
                            Do am: <strong className="text-teal-700">{product.waterContent}%</strong>
                        </span>
                    )}
                </div>
            )}
        </div>
    );
}
