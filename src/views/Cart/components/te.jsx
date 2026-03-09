<tr className="hover:bg-gray-50 transition-colors">

    {/* ═══ CỘT 1: Ảnh sản phẩm ═══ */}
    <td className="py-4 pl-2 pr-3 align-top w-28">
        <div className="flex flex-col items-center gap-1.5">
            {/* Ảnh chính */}
            <img
                src={img}
                alt={item.nameProduct}
                className="w-20 h-20 object-cover rounded-xl bg-gray-100 shadow-sm"
            />

            {/* Ảnh sản phẩm kèm — chỉ hiện nếu có */}
            {hasPaired && item.imgPairedProduct && (
                <div className="relative">
                    <img
                        src={item.imgPairedProduct}
                        alt={item.namePairedProduct}
                        className="w-14 h-14 object-cover rounded-lg bg-gray-100 border-2 border-teal-200"
                    />
                    {/* Badge nhỏ "Kèm" */}
                    <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[9px] font-bold px-1 rounded-full">
                        Kèm
                    </span>
                </div>
            )}
        </div>
    </td>

    {/* ═══ CỘT 2: Tên + sản phẩm kèm + đơn thuốc ═══ */}
    <td className="py-4 px-3 align-top">
        {/* Tên sản phẩm chính */}
        <p className="font-semibold text-gray-800 text-sm">
            {item.nameProduct}
        </p>

        {/* Tên sản phẩm kèm (nếu có) */}
        {hasPaired && (
            <p className="text-xs text-teal-600 mt-0.5">
                <span className="text-gray-400">Kèm: </span>
                {item.namePairedProduct}
            </p>
        )}

        {/* Đơn thuốc — hiển thị thông số đơn thuốc (tự ẩn nếu không có dữ liệu) */}
        <PrescriptionInfo prescription={item.prescription} />
    </td>

    {/* ═══ CỘT 3: Đơn giá ═══ */}
    <td className="py-4 px-3 align-middle text-right whitespace-nowrap">
        {/* Giá sản phẩm chính */}
        <p className="text-sm text-gray-700 font-medium">
            {formatCurrency(item.priceProduct)}
        </p>

        {/* Giá sản phẩm kèm (nếu có) */}
        {hasPaired && item.pricePairedProduct != null && (
            <p className="text-xs text-teal-600 mt-0.5">
                + {formatCurrency(item.pricePairedProduct)}
            </p>
        )}
    </td>


    {/* ═══ CỘT 4: Thành tiền ═══ */}
    <td className="py-4 px-3 align-middle text-right whitespace-nowrap">
        <span className="font-bold text-red-500 text-sm">
            {formatCurrency(lineTotal)}
        </span>
    </td>
</tr>