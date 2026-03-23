export default function ProductInfo({ product, isContact, isFrame, onTryOn, onView3D }) {
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

            {/* ĐÃ SỬA CHỖ NÀY: Chỉ cần là Gọng kính (isFrame) là hiện luôn 2 nút để test UI */}
            {isFrame && (
                <div className="flex flex-wrap gap-3 mt-2 mb-4">
                    <button
                        type="button"
                        onClick={onTryOn}
                        className="rounded-lg border-2 border-teal-500 text-teal-600 hover:bg-teal-50 hover:shadow-md px-5 py-2 text-sm font-bold transition-all flex items-center gap-2"
                    >
                        {/* Thêm cái icon cho nó ngầu */}
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
                        Thử kính ảo
                    </button>

                    <button
                        type="button"
                        onClick={onView3D}
                        className="rounded-lg border-2 border-slate-300 text-slate-700 hover:bg-slate-50 hover:shadow-md px-5 py-2 text-sm font-bold transition-all flex items-center gap-2"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinelinejoin="round"><path d="m21 16-9 5-9-5V8l9-5 9 5v8z"/><path d="m3.27 6.96 8.73 4.88 8.73-4.88"/><path d="M12 22.76V11.84"/></svg>
                        Xem ảnh 3D
                    </button>
                </div>
            )}

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