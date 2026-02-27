import { Trash2, Minus, Plus } from "lucide-react";
import { useShoppingContext } from "../contexts/ShoppingContext";
import { formatCurrency } from "../helpers/common";

/**
 * CartItem — hiển thị 1 dòng trong giỏ hàng.
 *
 * Props:
 *   productId          — ID sản phẩm chính
 *   nameProduct        — Tên sản phẩm chính
 *   imgProduct         — Ảnh sản phẩm chính
 *   priceProduct       — Giá sản phẩm chính
 *   quantity           — Số lượng
 *   pairedProductId    — ID sản phẩm kèm (null nếu không có)
 *   namePairedProduct  — Tên sản phẩm kèm
 *   imgPairedProduct   — Ảnh sản phẩm kèm
 *   pricePairedProduct — Giá sản phẩm kèm
 */
const CartItem = ({
    productId,
    nameProduct,
    imgProduct,
    priceProduct,
    quantity,
    pairedProductId,
    namePairedProduct,
    imgPairedProduct,
    pricePairedProduct,
}) => {
    const { increaseQty, decreaseQty, removeCartItem } = useShoppingContext();

    const hasPaired = pairedProductId;
    const lineTotal = (priceProduct + (pricePairedProduct ?? 0)) * quantity;

    return (
        <tr className="border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">

            {/* ── CỘT 1: Ảnh ── */}
            <td className="py-3 pl-4 pr-2 align-middle w-24">
                <div className="flex flex-col items-center gap-2">

                    {/* Ảnh sản phẩm chính */}
                    <img
                        src={imgProduct}
                        alt={nameProduct}
                        className="w-20 h-20 object-cover rounded-xl bg-gray-100 shadow-sm"
                    />

                    {/* Ảnh sản phẩm kèm (chỉ hiện khi có) */}
                    {hasPaired && imgPairedProduct && (
                        <div className="relative">
                            <img
                                src={imgPairedProduct}
                                alt={namePairedProduct}
                                className="w-14 h-14 object-cover rounded-lg bg-gray-100 border-2 border-teal-200"
                            />
                            <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[9px] font-bold px-1 rounded-full">
                                Kèm
                            </span>
                        </div>
                    )}
                </div>
            </td>

            {/* ── CỘT 2: Tên sản phẩm ── */}
            <td className="py-3 px-3 align-middle">

                {/* Tên sản phẩm chính */}
                <p className="font-semibold text-gray-800 text-sm leading-snug">
                    {nameProduct}
                </p>

                {/* Tên sản phẩm kèm (chỉ hiện khi có) */}
                {hasPaired && namePairedProduct && (
                    <p className="text-xs text-gray-500 mt-1">
                        <span className="bg-teal-50 text-teal-600 font-medium rounded px-1.5 py-0.5 mr-1">
                            Kèm
                        </span>
                        {namePairedProduct}
                    </p>
                )}
            </td>

            {/* ── CỘT 3: Đơn giá ── */}
            <td className="py-3 px-3 align-middle text-right whitespace-nowrap">

                {/* Giá sản phẩm chính */}
                <p className="text-sm text-gray-700 font-medium">
                    {formatCurrency(priceProduct)}
                </p>

                {/* Giá sản phẩm kèm (chỉ hiện khi có) */}
                {hasPaired && pricePairedProduct != null && (
                    <p className="text-xs text-teal-600 mt-1">
                        + {formatCurrency(pricePairedProduct)}
                    </p>
                )}
            </td>

            {/* ── CỘT 4: Số lượng ── */}
            <td className="py-3 px-3 align-middle">
                <div className="flex items-center gap-1.5 justify-center">

                    {/* Nút giảm */}
                    <button
                        type="button"
                        onClick={() => decreaseQty(productId, pairedProductId)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-teal-100 text-gray-600 hover:text-teal-700 transition-colors active:scale-90"
                    >
                        <Minus size={13} strokeWidth={2.5} />
                    </button>

                    {/* Số lượng */}
                    <span className="min-w-8 text-center text-sm font-bold text-gray-800 select-none">
                        {quantity}
                    </span>

                    {/* Nút tăng */}
                    <button
                        type="button"
                        onClick={() => increaseQty(productId, pairedProductId)}
                        className="w-7 h-7 flex items-center justify-center rounded-lg bg-gray-100 hover:bg-teal-100 text-gray-600 hover:text-teal-700 transition-colors active:scale-90"
                    >
                        <Plus size={13} strokeWidth={2.5} />
                    </button>
                </div>
            </td>

            {/* ── CỘT 5: Thành tiền ── */}
            <td className="py-3 px-3 align-middle text-right whitespace-nowrap">
                <span className="font-bold text-red-500 text-sm">
                    {formatCurrency(lineTotal)}
                </span>
            </td>

            {/* ── CỘT 6: Nút xóa ── */}
            <td className="py-3 pl-2 pr-4 align-middle text-center">
                <button
                    type="button"
                    onClick={() => removeCartItem(productId, pairedProductId)}
                    aria-label="Xóa sản phẩm"
                    className="p-1.5 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                >
                    <Trash2 size={16} />
                </button>
            </td>

        </tr>
    );
};

export default CartItem;
