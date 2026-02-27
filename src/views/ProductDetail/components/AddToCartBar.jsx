/**
 * AddToCartBar.jsx
 * =================
 * Khu vực chứa toàn bộ logic "Thêm vào giỏ hàng" với các business rule:
 *
 * ┌─────────────────────────────────────────────────────────────────────┐
 * │ GỌNG KÍNH:                                                          │
 * │  - Luôn hiển thị PrescriptionForm                                   │
 * │  - Người dùng phải CHỌN 1 trong 2:                                  │
 * │    A) Tick "Không mua tròng kính" → thêm đơn lẻ vào giỏ            │
 * │    B) Click "Chọn tròng kính phù hợp" → mở Modal chọn Tròng kính   │
 * │       → sau khi chọn, hiển thị tên tròng kính đã chọn              │
 * │       → lúc này mới được Thêm vào giỏ (bundle Gọng + Tròng)        │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ TRÒNG KÍNH:                                                         │
 * │  - Luôn hiển thị PrescriptionForm                                   │
 * │  - Người dùng phải CHỌN 1 trong 2:                                  │
 * │    A) Tick "Đã có gọng kính" → thêm đơn lẻ vào giỏ                 │
 * │    B) Click "Chọn gọng kính phù hợp" → mở Modal chọn Gọng kính     │
 * │       → sau khi chọn, hiển thị tên gọng đã chọn                    │
 * │       → lúc này mới được Thêm vào giỏ (bundle Tròng + Gọng)        │
 * ├─────────────────────────────────────────────────────────────────────┤
 * │ KÍNH ÁP TRÒNG:                                                      │
 * │  - Hiển thị PrescriptionForm để nhập độ (tùy chọn)                  │
 * │  - Luôn là đơn lẻ, không cần chọn sản phẩm kèm                      │
 * │  - Chọn số lượng rồi Thêm vào giỏ ngay                              │
 * └─────────────────────────────────────────────────────────────────────┘
 *
 * Props nhận từ index.jsx:
 * @param {object}   product         - Dữ liệu sản phẩm
 * @param {boolean}  isFrame         - True nếu là Gọng kính
 * @param {boolean}  isLenses        - True nếu là Tròng kính
 * @param {boolean}  isContact       - True nếu là Kính áp tròng
 * @param {object}   rxData          - Dữ liệu đơn thuốc từ usePrescription
 * @param {object}   rxErrors        - Lỗi validate đơn thuốc
 * @param {function} onUpdateRx      - Hàm cập nhật field đơn thuốc
 * @param {function} onBlurRx        - Hàm validate onBlur đơn thuốc
 * @param {function} validateAllRx   - Hàm validate toàn bộ đơn thuốc
 */

import { useState } from "react";
import PrescriptionForm from "./PrescriptionForm";
import QuantitySelector from "./QuantitySelector";
import LensModal from "./LensModal";
import { PRODUCT_TYPES } from "../utils/constants";
import { useShoppingContext } from "../../Cart/contexts/ShoppingContext";

export default function AddToCartBar({
    product,
    isFrame,
    isLenses,
    isContact,
    rxData,
    rxErrors,
    onUpdateRx,
    onBlurRx,
    validateAllRx,
}) {
    // ─── State: số lượng ──────────────────────────────────────────────────────
    const [quantity, setQuantity] = useState(1);

    // ─── State: người dùng đã tick "mua đơn lẻ" chưa ─────────────────────────
    // isSoloChecked = true → mua đơn lẻ, không cần chọn sản phẩm bổ trợ
    const [isSoloChecked, setIsSoloChecked] = useState(false);

    // ─── State: sản phẩm bổ trợ đã chọn trong modal ──────────────────────────
    // null = chưa chọn, object = đã chọn (có .id, .name, .price)
    const [pairedProduct, setPairedProduct] = useState(null);

    // ─── State: modal có đang mở không ──────────────────────────────────────
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ─── Xác định nội dung hiển thị theo loại sản phẩm ───────────────────────
    // Gọng kính → cần chọn TRÒNG kính bổ trợ
    // Tròng kính → cần chọn GỌNG kính bổ trợ
    const soloLabel = isFrame ? "Không mua tròng kính" : "Đã có gọng kính";
    const pairLabel = isFrame ? "Chọn tròng kính phù hợp" : "Chọn gọng kính phù hợp";
    const modalType = isFrame ? PRODUCT_TYPES.LENSES : PRODUCT_TYPES.FRAME;
    const modalTitle = isFrame ? "Chọn Tròng Kính Phù Hợp" : "Chọn Gọng Kính Phù Hợp";


    const { addCartItem } = useShoppingContext();

    /**
     * handleAddToCart - Xử lý khi nhấn "Thêm vào giỏ hàng"
     *
     * Kiểm tra:
     *  1. Validate đơn thuốc (nếu là Gọng/Tròng/Kính áp tròng)
     *  2. Với Gọng/Tròng: kiểm tra người dùng đã chọn solo hoặc sản phẩm kèm chưa
     *  3. Kính áp tròng: luôn là đơn lẻ, không cần bước 2
     *  4. Tạo payload gửi đi:
     *     - Đơn lẻ:  { productId, quantity, prescription }
     *     - Mua kèm: { productId, pairedProductId, quantity, prescription }
     */
    function handleAddToCart() {
        // Bước 1: Validate đơn thuốc cho tất cả loại (Gọng, Tròng, Kính áp tròng đều có form)
        const isValid = validateAllRx();
        if (!isValid) {
            alert("Vui lòng kiểm tra lại thông số đơn thuốc!");
            return;
        }

        // Bước 2: Chỉ Gọng/Tròng mới cần chọn phương án mua
        // Kính áp tròng bỏ qua bước này (luôn là đơn lẻ)
        if ((isFrame || isLenses) && !isSoloChecked && !pairedProduct) {
            alert(`Vui lòng tick "${soloLabel}" hoặc "${pairLabel}" để tiếp tục!`);
            return;
        }

        // Bước 3: Tạo payload
        const payload = {
            productId: product.id,
            priceProduct: product.price,                        // Giá sản phẩm chính
            nameProduct: product.name,                          // Tên sản phẩm chính
            imgProduct: product.imageUrls,                      // Ảnh sản phẩm chính
            quantity,
            prescription: rxData,                               // Tất cả loại đều gửi đơn thuốc                              // TODO: Giá dịch vụ cắt kính theo đơn (do backend tính)
            pairedProductId: pairedProduct?.id ?? null,         // null nếu mua đơn lẻ
            pricePairedProduct: pairedProduct?.price ?? null,   // Giá sản phẩm kèm
            namePairedProduct: pairedProduct?.name ?? null,     // Tên sản phẩm kèm
            imgPairedProduct: pairedProduct?.image ?? null, // Ảnh sản phẩm kèm
        };

        addCartItem(payload);
    }

    /**
     * handleSoloChange - Xử lý khi tick/bỏ tick checkbox "mua đơn lẻ"
     * Nếu tick → bỏ chọn sản phẩm kèm (nếu đã chọn)
     */
    function handleSoloChange(checked) {
        setIsSoloChecked(checked);
        if (checked) {
            setPairedProduct(null); // Bỏ chọn sản phẩm kèm nếu muốn mua đơn lẻ
        }
    }

    // ─── Kiểm tra form đơn thuốc có dữ liệu khác 0 không ────────────────────
    // Duyệt qua tất cả giá trị trong rxData (10 field).
    // Nếu có BẤT KỲ field nào khác "0" và khác "" → hasRxData = true (người dùng đã nhập độ)
    // Ví dụ: leftSPH = "-3.00" → hasRxData = true → bắt buộc phải chọn tròng kính
    const hasRxData = Object.values(rxData).some(
        (val) => val !== "0" && val !== "" && val !== "0.00"
    );

    // ─── Checkbox "Không mua tròng kính" có bị disable không ────────────────
    // Chỉ disable khi: đang xem Gọng kính VÀ người dùng đã nhập độ
    // → Bắt buộc phải chọn tròng kính, không được mua đơn lẻ
    const isSoloDisabled = isFrame && hasRxData;

    // ─── Tính trạng thái nút "Thêm vào giỏ" ─────────────────────────────────
    // Nút cảnh báo (đỏ) khi là Gọng/Tròng mà chưa chọn phương án nào
    // Kính áp tròng luôn xanh vì không cần chọn phương án
    const needsSelection = (isFrame || isLenses) && !isSoloChecked && !pairedProduct;
    const cartBtnClass = needsSelection
        ? "bg-red-50 border-2 border-red-400 text-red-500 cursor-not-allowed"
        : "bg-teal-500 text-white hover:bg-teal-600";

    return (
        <div className="space-y-5">
            {/* ── PrescriptionForm: hiện cho tất cả loại sản phẩm ── */}
            {/* Gọng + Tròng: nhập để cắt kính theo đơn                */}
            {/* Kính áp tròng: nhập tùy chọn, luôn tính là đơn lẻ     */}
            <PrescriptionForm
                data={rxData}
                errors={rxErrors}
                onUpdate={onUpdateRx}
                onBlur={onBlurRx}
            />

            {/* ── Ghi chú cho Kính áp tròng ── */}
            {/* Giải thích rõ đây chỉ là thông tin tham khảo, không bắt buộc */}
            {isContact && (
                <p className="text-xs text-gray-400 italic -mt-3">
                    * Thông số độ mắt chỉ để tham khảo khi chọn kính áp tròng có độ.
                    Sản phẩm này được tính là mua đơn lẻ.
                </p>
            )}

            {/* ── Phần chọn phương án (chỉ Gọng/Tròng) ── */}
            {(isFrame || isLenses) && (
                <div className="p-4 bg-amber-50 border border-amber-200 rounded-xl space-y-3">
                    <p className="text-sm font-semibold text-amber-800">
                        Bạn cần chọn 1 trong 2 phương án bên dưới:
                    </p>

                    {/* Phương án A: Mua đơn lẻ */}
                    {/* isSoloDisabled = true khi là Gọng kính + đã nhập độ → disable checkbox */}
                    <label className={`flex items-center gap-3 ${isSoloDisabled ? "opacity-40 cursor-not-allowed" : "cursor-pointer group"}`}>
                        <input
                            type="checkbox"
                            checked={isSoloChecked}
                            disabled={isSoloDisabled}
                            onChange={(e) => handleSoloChange(e.target.checked)}
                            className="w-5 h-5 rounded text-teal-600 accent-teal-600"
                        />
                        <span className={`text-sm font-medium transition
              ${isSoloChecked ? "text-teal-700" : "text-gray-700 group-hover:text-teal-600"}`}
                        >
                            {soloLabel}
                        </span>
                    </label>

                    {/* Thông báo giải thích khi checkbox bị disable */}
                    {isSoloDisabled && (
                        <p className="text-xs text-amber-700 bg-amber-100 rounded-lg px-3 py-2">
                            Bạn đã nhập thông số độ mắt. Vui lòng chọn tròng kính phù hợp để cắt theo đơn.
                        </p>
                    )}

                    {/* Phương án B: Chọn sản phẩm kèm từ modal */}
                    <div className="flex flex-col gap-2">
                        <button
                            onClick={() => {
                                setIsSoloChecked(false); // Bỏ tick solo nếu đang chọn modal
                                setIsModalOpen(true);
                            }}
                            className={`w-full py-2.5 px-4 rounded-xl border-2 font-semibold text-sm transition
                ${pairedProduct
                                    ? "border-teal-500 bg-teal-50 text-teal-700"
                                    : "border-dashed border-teal-400 text-teal-600 hover:bg-teal-50"
                                }`}
                        >
                            {/* Hiển thị tên sản phẩm đã chọn hoặc text mặc định */}
                            {pairedProduct ? `Da chon: ${pairedProduct.name}` : pairLabel}
                        </button>

                        {/* Nút bỏ chọn sản phẩm kèm */}
                        {pairedProduct && (
                            <button
                                onClick={() => setPairedProduct(null)}
                                className="text-xs text-gray-400 hover:text-red-500 transition underline text-left"
                            >
                                Bo chon san pham kem
                            </button>
                        )}
                    </div>
                </div>
            )}

            {/* ── Hàng QuantitySelector + Nút Thêm vào giỏ ── */}
            <div className="flex gap-3 items-center">
                <QuantitySelector
                    quantity={quantity}
                    onDecrease={() => setQuantity((q) => Math.max(1, q - 1))}
                    onIncrease={() => setQuantity((q) => q + 1)}
                />

                <button
                    onClick={handleAddToCart}
                    title={needsSelection ? `Vui long tick "${soloLabel}" hoac chon san pham kem` : ""}
                    className={`flex-1 h-10 rounded-lg font-bold uppercase text-sm transition-all duration-200 ${cartBtnClass}`}
                >
                    {needsSelection ? "Chua hoan tat lua chon" : "Them vao gio hang"}
                </button>
            </div>

            {/* ── Modal chọn sản phẩm bổ trợ (chỉ Gọng/Tròng) ── */}
            <LensModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSelect={(selected) => setPairedProduct(selected)}
                filterType={modalType}
                title={modalTitle}
            />
        </div>
    );
}
