import { Trash2, Minus, Plus } from "lucide-react";
import { useShoppingContext } from "../contexts/ShoppingContext";
import { formatCurrency } from "../helpers/common";

/**
 * CartItem — hiển thị 1 dòng trong dropdown giỏ hàng (Navbar).
 *
 * Props (từ {...item} spread):
 *   cartItemId         — ID duy nhất từ server (dùng cho tăng/giảm/xóa)
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
    cartItemId,
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
    const hasPaired = pairedProductId != null;
    const lineTotal = (priceProduct + (pricePairedProduct ?? 0)) * quantity;

    return (
        <div className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0 hover:bg-gray-50 transition-colors">
            {/* Ảnh sản phẩm chính */}
            <img
                src={imgProduct}
                alt={nameProduct}
                className="w-16 h-16 object-cover rounded-xl bg-gray-100 shadow-sm"
            />
            {/* Ảnh sản phẩm kèm */}
            {hasPaired && imgPairedProduct && (
                <div className="relative">
                    <img
                        src={imgPairedProduct}
                        alt={namePairedProduct}
                        className="w-10 h-10 object-cover rounded-lg bg-gray-100 border-2 border-teal-200"
                    />
                    <span className="absolute -top-1 -right-1 bg-teal-500 text-white text-[9px] font-bold px-1 rounded-full">
                        Kèm
                    </span>
                </div>
            )}
            {/* Thông tin sản phẩm */}
            <div className="flex-1 min-w-0">
                <div className="font-semibold text-gray-800 truncate">{nameProduct}</div>
                {hasPaired && namePairedProduct && (
                    <div className="text-xs text-gray-500 truncate">+ {namePairedProduct}</div>
                )}
                <div className="text-xs text-gray-400 mt-1">Đơn giá: {formatCurrency(priceProduct)}</div>
                {hasPaired && pricePairedProduct && (
                    <div className="text-xs text-gray-400">Kèm: {formatCurrency(pricePairedProduct)}</div>
                )}
            </div>
            {/* Số lượng và tổng */}
            <div className="flex flex-col items-end gap-1">
                <div className="flex items-center gap-2">
                    <button onClick={() => decreaseQty(cartItemId)} className="p-1 rounded bg-gray-200 hover:bg-gray-300">
                        <Minus className="w-4 h-4 text-gray-600" />
                    </button>
                    <span className="font-bold text-gray-700 text-sm">{quantity}</span>
                    <button onClick={() => increaseQty(cartItemId)} className="p-1 rounded bg-gray-200 hover:bg-gray-300">
                        <Plus className="w-4 h-4 text-gray-600" />
                    </button>
                </div>
                <div className="text-xs text-gray-700 font-semibold">{formatCurrency(lineTotal)}</div>
            </div>
            {/* Xóa */}
            <button onClick={() => removeCartItem(cartItemId)} className="ml-2 p-1 rounded bg-red-100 hover:bg-red-200">
                <Trash2 className="w-4 h-4 text-red-500" />
            </button>
        </div>
    );
};

export default CartItem;
