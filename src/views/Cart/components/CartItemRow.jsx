/**
 * CartItemRow.jsx
 * ────────────────
 * Component hiển thị MỘT DÒNG sản phẩm trong bảng giỏ hàng.
 *
 * Mỗi dòng gồm 7 cột:
 *   1. ✅ Checkbox tick/bỏ tick
 *   2. Ảnh sản phẩm (+ ảnh kèm nếu có)
 *   3. Tên sản phẩm (+ tên kèm + đơn thuốc)
 *   4. Đơn giá
 *   5. Nút tăng / giảm số lượng
 *   6. Thành tiền (= đơn giá × số lượng)
 *   7. Nút xóa
 *
 * Props:
 *   - item: object chứa thông tin 1 sản phẩm trong giỏ
 *   - isSelected: boolean — sản phẩm này đang được tick hay không
 *   - onToggle: hàm gọi khi click checkbox
 *   - onIncrease: hàm gọi khi nhấn nút "+"
 *   - onDecrease: hàm gọi khi nhấn nút "−"
 *   - onRemove: hàm gọi khi nhấn nút "Xoá"
 *   - formatCurrency: hàm format số tiền (VD: 1.200.000 đ)
 */

import PrescriptionInfo from "./PrescriptionInfo";

export default function CartItemRow({ item, isSelected, onToggle, onIncrease, onDecrease, onRemove, formatCurrency }) {

    // ── Lấy ảnh sản phẩm chính ──
    // imgProduct có thể là string "url" hoặc array ["url1", "url2"]
    // → Nếu là array, lấy phần tử đầu tiên
    const img = Array.isArray(item.imgProduct)
        ? item.imgProduct[0]
        : item.imgProduct;

    // ── Tính thành tiền cho dòng này ──
    // Công thức: (giá chính + giá kèm) × số lượng
    // pricePairedProduct có thể null → dùng ?? 0 để thay bằng 0
    const lineTotal = (item.priceProduct + (item.pricePairedProduct ?? 0)) * item.quantity;

    // ── Kiểm tra có sản phẩm kèm không ──
    const hasPaired = item.pairedProductId != null;

    return (
        <tr className="hover:bg-gray-50 transition-colors">

            {/* ═══ CỘT 0: Checkbox tick/bỏ tick ═══ */}
            <td className="py-4 pl-5 pr-2 align-middle text-center w-10">
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={onToggle}
                    className="w-4 h-4 accent-teal-600 cursor-pointer"
                />
            </td>

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

            {/* ═══ CỘT 4: Nút tăng / giảm số lượng ═══ */}
            <td className="py-4 px-3 align-middle">
                <div className="flex items-center justify-center gap-0 border border-gray-200 rounded-xl overflow-hidden w-fit mx-auto">
                    {/* Nút giảm */}
                    <button
                        type="button"
                        onClick={onDecrease}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                    >
                        −
                    </button>

                    {/* Số lượng hiện tại */}
                    <span className="min-w-8 text-center text-sm font-bold text-gray-800 select-none">
                        {item.quantity}
                    </span>

                    {/* Nút tăng */}
                    <button
                        type="button"
                        onClick={onIncrease}
                        className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 text-gray-600 font-bold transition-colors"
                    >
                        +
                    </button>
                </div>
            </td>

            {/* ═══ CỘT 5: Thành tiền ═══ */}
            <td className="py-4 px-3 align-middle text-right whitespace-nowrap">
                <span className="font-bold text-red-500 text-sm">
                    {formatCurrency(lineTotal)}
                </span>
            </td>

            {/* ═══ CỘT 6: Nút xóa ═══ */}
            <td className="py-4 pl-3 pr-5 align-middle text-center">
                <button
                    type="button"
                    onClick={onRemove}
                    aria-label="Xóa sản phẩm"
                    className="px-3 py-1.5 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 border border-red-200 rounded-lg transition-colors"
                >
                    Xoá
                </button>
            </td>
        </tr>
    );
}
