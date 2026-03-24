/**

 */

import { useState } from "react";
import QuantitySelector from "./QuantitySelector";
import LensModal from "./LensModal";
import { PRODUCT_TYPES } from "../utils/constants";
import { useShoppingContext } from "../../Cart/contexts/ShoppingContext";
import PrescriptionInputTabs from "./PrescriptionInputTabs";

export default function AddToCartBar({ product, isFrame, isLenses, formik }) {
    const [quantity, setQuantity] = useState(1);
    const [isSoloChecked, setIsSoloChecked] = useState(false);
    const [pairedProduct, setPairedProduct] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    // ─── Xác định nội dung hiển thị theo loại sản phẩm ───────────────────────
    const soloLabel = isFrame ? "Không mua tròng kính" : "Đã có gọng kính";
    const pairLabel = isFrame ? "Chọn tròng kính phù hợp" : "Chọn gọng kính phù hợp";
    const modalType = isFrame ? PRODUCT_TYPES.LENSES : PRODUCT_TYPES.FRAME;
    const modalTitle = isFrame ? "Chọn Tròng Kính Phù Hợp" : "Chọn Gọng Kính Phù Hợp";

    // ─── LOGIC TỒN KHO SẢN PHẨM CHÍNH ───
    const availableQuantity = product.availableQuantity || 0;
    const allowPreorder = product.allowPreorder || false;
    const isOutOfStock = availableQuantity === 0 && !allowPreorder;

    // ─── LOGIC TỒN KHO SẢN PHẨM BỔ TRỢ (NẾU CÓ) ───
    const pairedAvailableQty = pairedProduct?.availableQuantity || 0;
    const pairedAllowPreorder = pairedProduct?.allowPreorder || false;

    // Block phụ: Chỉ kiểm tra khi có pairedProduct
    const isPairedOutOfStock = pairedProduct
        ? (pairedAvailableQty === 0 && !pairedAllowPreorder)
        : false;

    // Tổng hợp trạng thái: 1 trong 2 món hết hàng -> Khóa nút Add To Cart
    const isAnyOutOfStock = isOutOfStock || isPairedOutOfStock;

    console.log("Available quantity of main product:", availableQuantity);
    console.log("Allow preorder for main product:", allowPreorder);
    console.log("Is main product out of stock?", isOutOfStock);

    console.log("Available quantity of paired product:", pairedAvailableQty);
    console.log("Allow preorder for paired product:", pairedAllowPreorder);
    console.log("Is paired product out of stock?", isPairedOutOfStock);
    const { addCartItem } = useShoppingContext();
    async function handleAddToCart() {
        if (isOutOfStock) {
            alert("Sản phẩm đã hết hàng và không hỗ trợ đặt trước.");
            return;
        }

        if (isPairedOutOfStock) {
            alert("Sản phẩm đi kèm bạn chọn đã hết hàng. Vui lòng chọn mẫu khác!");
            return;
        }

        const errors = await formik.validateForm();

        if (Object.keys(errors).length > 0) {
            formik.setTouched(
                Object.keys(formik.initialValues).reduce((acc, key) => ({ ...acc, [key]: true }), {})
            );
            alert("Vui lòng kiểm tra lại thông số đơn thuốc!");
            return;
        }



        // Tạo payload
        // Gồm thông tin sản phẩm chính + sản phẩm kèm + đơn thuốc + loại sản phẩm
        // Các field "productType", "frameId", "lensId", "contactLensId" → dùng khi gọi API cart/add
        const payload = {
            productId: product.id,
            priceProduct: product.price,
            nameProduct: product.name,
            imgProduct: product.imageUrls,
            quantity,
            prescription: formik.values,

            // ── Loại sản phẩm + ID riêng theo loại (dùng cho API) ──
            productType: product.Product_Type,
            frameId: product.frameId ?? null,
            lensId: product.lensId ?? null,
            contactLensId: product.contactLensId ?? null,

            // ── Sản phẩm kèm (null nếu mua đơn lẻ) ──
            pairedProductId: pairedProduct?.id ?? null,
            pricePairedProduct: pairedProduct?.price ?? null,
            namePairedProduct: pairedProduct?.name ?? null,
            imgPairedProduct: pairedProduct?.image ?? null,
            pairedProductType: pairedProduct?.productType ?? null,
            pairedFrameId: pairedProduct?.frameId ?? null,
            pairedLensId: pairedProduct?.lensId ?? null,
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

    // Logic kiểm tra xem đã nhập độ chưa để disable solo
    const hasRxData = Object.values(formik.values).some(v => v !== "0" && v !== "" && v !== 0);

    // ─── Checkbox "Không mua tròng kính" có bị disable không ────────────────
    // Chỉ disable khi: đang xem Gọng kính VÀ người dùng đã nhập độ
    // → Bắt buộc phải chọn tròng kính, không được mua đơn lẻ
    const isSoloDisabled = isFrame && hasRxData;

    // ─── Tính trạng thái nút "Thêm vào giỏ" ─────────────────────────────────
    // Nút cảnh báo (đỏ) khi là Gọng/Tròng mà chưa chọn phương án nào
    // Kính áp tròng luôn xanh vì không cần chọn phương án
    const needsSelection = (isFrame || isLenses) && !isSoloChecked && !pairedProduct;

    let cartBtnClass = "";
    let buttonText = "";

    // 1. Ưu tiên kiểm tra lỗi hết hàng trước
    if (isOutOfStock) {
        cartBtnClass = "bg-gray-400 text-white cursor-not-allowed";
        buttonText = "Sản phẩm chính đã hết hàng";
    } else if (isPairedOutOfStock) {
        cartBtnClass = "bg-gray-400 text-white cursor-not-allowed";
        buttonText = "Sản phẩm kèm đã hết hàng";
    }
    // 2. Kiểm tra xem đã chọn đủ combo/solo chưa
    else if (needsSelection) {
        cartBtnClass = "bg-red-50 border-2 border-red-400 text-red-500 cursor-not-allowed";
        buttonText = "Chưa hoàn tất lựa chọn";
    }
    // 3. Hợp lệ -> Hiển thị nút Mua hoặc Pre-order
    else {
        cartBtnClass = "bg-teal-500 text-white hover:bg-teal-600";

        // Nếu món chính HOẶC món phụ rơi vào trạng thái cần Pre-order, nút sẽ thành Đặt trước
        const isPreorderAction =
            (availableQuantity === 0 && allowPreorder) ||
            (pairedProduct && pairedAvailableQty === 0 && pairedAllowPreorder);

        buttonText = isPreorderAction ? "Đặt hàng trước (Pre-order)" : "Thêm vào giỏ hàng";
    }

    return (
        <div className="space-y-5">
            {/* ── PrescriptionInputTabs: cho phép nhập hoặc upload ảnh đơn thuốc ── */}
            <PrescriptionInputTabs
                formik={formik}
            />

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
                    onIncrease={() => {
                        // 1. Kiểm tra giới hạn của Sản phẩm chính (Chỉ chặn nếu ĐANG CÓ HÀNG trong kho)
                        if (availableQuantity > 0 && quantity >= availableQuantity) {
                            alert(`Sản phẩm chính chỉ còn ${availableQuantity} món trong kho.`);
                            return;
                        }

                        // 2. Kiểm tra giới hạn của Sản phẩm kèm (Chỉ chặn nếu có pairedProduct và ĐANG CÓ HÀNG)
                        if (pairedProduct && pairedAvailableQty > 0 && quantity >= pairedAvailableQty) {
                            alert(`Sản phẩm kèm "${pairedProduct.name}" chỉ còn ${pairedAvailableQty} món.`);
                            return;
                        }

                        // Nếu vượt qua cả 2 bước check (hoặc cả 2 đều là hàng Pre-order) thì mới cho tăng
                        setQuantity((q) => q + 1);
                    }}
                    // Vô hiệu hóa nếu món chính hoặc món kèm bị hết hàng hoàn toàn
                    disabled={isAnyOutOfStock}
                />

                <button
                    onClick={handleAddToCart}
                    disabled={isAnyOutOfStock || needsSelection}
                    className={`flex-1 h-10 rounded-lg font-bold uppercase text-sm transition-all duration-200 ${cartBtnClass}`}
                >
                    {buttonText}
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