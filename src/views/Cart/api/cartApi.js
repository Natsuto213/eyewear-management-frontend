/**
 * cartApi.js
 * ───────────
 * Chứa tất cả hàm gọi API giỏ hàng.
 *
 * 5 API dùng:
 *   POST   /api/cart/add           — Thêm sản phẩm mới vào giỏ
 *   PUT    /api/cart/update        — Cập nhật số lượng sản phẩm đã có
 *   GET    /api/cart/getAllCart     — Lấy toàn bộ giỏ hàng
 *   DELETE /api/cart/delete/:id    — Xóa 1 sản phẩm
 *   DELETE /api/cart/deleteAllCart — Xóa toàn bộ giỏ hàng
 */

import { api } from "@/lib/api";

// ═══════════════════════════════════════════════════════════════
// 1. HÀM CHUYỂN ĐỔI: payload frontend → body API (dùng khi POST /add)
// ═══════════════════════════════════════════════════════════════
// Frontend lưu: { productId, pairedProductId, priceProduct, pricePairedProduct, prescription, ... }
// API cần:      { frameId, lensId, contactLensId, framePrice, lensPrice, price, rightEyeSph, ... }
//
// Vì 1 sản phẩm có thể là Gọng, Tròng, hoặc Kính áp tròng
// → cần dựa vào productType để biết gán vào field nào
// ═══════════════════════════════════════════════════════════════

function buildCartApiBody(item, quantity) {
    // Bước 1: Xác định frameId, lensId, contactLensId
    let frameId = null;
    let lensId = null;
    let contactLensId = null;
    let framePrice = 0;
    let lensPrice = 0;

    // Sản phẩm CHÍNH
    if (item.productType === "Gọng kính") {
        frameId = item.frameId ?? null;
        framePrice = item.priceProduct ?? 0;
    } else if (item.productType === "Tròng kính") {
        lensId = item.lensId ?? null;
        lensPrice = item.priceProduct ?? 0;
    } else if (item.productType === "Kính áp tròng") {
        contactLensId = item.contactLensId ?? null;
    }

    // Sản phẩm KÈM (nếu có)
    if (item.pairedProductType === "Gọng kính") {
        frameId = item.pairedFrameId ?? null;
        framePrice = item.pricePairedProduct ?? 0;
    } else if (item.pairedProductType === "Tròng kính") {
        lensId = item.pairedLensId ?? null;
        lensPrice = item.pricePairedProduct ?? 0;
    }

    // Bước 2: Lấy thông số đơn thuốc
    const rx = item.prescription || {};
    const pdRight = parseFloat(rx.rightPD) || 0;
    const pdLeft = parseFloat(rx.leftPD) || 0;

    // Bước 3: Tính tổng giá
    const totalPrice = (item.priceProduct ?? 0) + (item.pricePairedProduct ?? 0);

    // Bước 4: Tạo body API
    return {
        frameId,
        lensId,
        contactLensId,
        quantity,
        framePrice: framePrice || null,
        lensPrice: lensPrice || null,
        price: totalPrice || null,

        // Đơn thuốc mắt phải
        rightEyeSph: parseFloat(rx.rightSPH) || 0,
        rightEyeCyl: parseFloat(rx.rightCYL) || 0,
        rightEyeAxis: parseFloat(rx.rightAXIS) || 0,
        rightEyeAdd: parseFloat(rx.rightADD) || 0,

        // Đơn thuốc mắt trái
        leftEyeSph: parseFloat(rx.leftSPH) || 0,
        leftEyeCyl: parseFloat(rx.leftCYL) || 0,
        leftEyeAxis: parseFloat(rx.leftAXIS) || 0,
        leftEyeAdd: parseFloat(rx.leftADD) || 0,

        // Khoảng cách đồng tử (PD)
        pdRight,
        pdLeft,
        pd: pdRight + pdLeft,
    };
}

// ═══════════════════════════════════════════════════════════════
// 2. HÀM CHUYỂN ĐỔI: response API → object hiển thị trên UI
// ═══════════════════════════════════════════════════════════════
// API trả về: { cartItemId, frameName, framePrice, frameImg, lensName, lensPrice, lensImg,
//               contactLensName, contactLensPrice, contactLensImg, quantity, price }
//
// UI cần:     { cartItemId, nameProduct, imgProduct, priceProduct, quantity, price,
//               namePairedProduct, imgPairedProduct, pricePairedProduct, ... }
//
// Quy tắc:
//   - Nếu framePrice > 0 → Gọng kính là sản phẩm CHÍNH
//   - Nếu lensPrice > 0 kèm frame → Tròng kính là sản phẩm KÈM
//   - Nếu lensPrice > 0 mà KHÔNG có frame → Tròng kính là sản phẩm CHÍNH
//   - Nếu contactLensPrice > 0 → Kính áp tròng là sản phẩm CHÍNH
// ═══════════════════════════════════════════════════════════════

export function mapApiItemToLocal(apiItem) {
    // Kết quả sẽ điền vào đây
    let nameProduct = "";
    let imgProduct = "";
    let priceProduct = 0;
    let productId = null;           // ID sản phẩm chính (frameId / lensId / contactLensId)

    let namePairedProduct = null;
    let imgPairedProduct = null;
    let pricePairedProduct = null;
    let pairedProductId = null;     // ID sản phẩm kèm (lensId khi frame là chính)

    // ── Trường hợp 1: Có Gọng kính (framePrice > 0) → Gọng là sản phẩm chính ──
    if (apiItem.framePrice > 0) {
        productId = apiItem.frameId;
        nameProduct = apiItem.frameName;
        imgProduct = apiItem.frameImg;
        priceProduct = apiItem.framePrice;

        // Nếu có cả Tròng kính → Tròng là sản phẩm kèm
        if (apiItem.lensPrice > 0) {
            pairedProductId = apiItem.lensId;
            namePairedProduct = apiItem.lensName;
            imgPairedProduct = apiItem.lensImg;
            pricePairedProduct = apiItem.lensPrice;
        }
    }
    // ── Trường hợp 2: Chỉ có Tròng kính (không có Gọng) → Tròng là sản phẩm chính ──
    else if (apiItem.lensPrice > 0) {
        productId = apiItem.lensId;
        nameProduct = apiItem.lensName;
        imgProduct = apiItem.lensImg;
        priceProduct = apiItem.lensPrice;
    }
    // ── Trường hợp 3: Kính áp tròng → Kính áp tròng là sản phẩm chính ──
    else if (apiItem.contactLensPrice > 0) {
        productId = apiItem.contactLensId;
        nameProduct = apiItem.contactLensName;
        imgProduct = apiItem.contactLensImg;
        priceProduct = apiItem.contactLensPrice;
    }

    // ── Đơn thuốc — API đã trả về prescription object ──
    // Nếu API trả prescription → dùng luôn, nếu chưa có → null
    const prescription = apiItem.prescription ?? null;

    return {
        cartItemId: apiItem.cartItemId,
        productId,
        pairedProductId,
        nameProduct,
        imgProduct,
        priceProduct,
        quantity: apiItem.quantity,
        price: apiItem.price,

        namePairedProduct,
        imgPairedProduct,
        pricePairedProduct,

        prescription,

        // ⭐ _raw = dữ liệu gốc từ server
        // Dùng khi bấm +/- (PUT /api/cart/update) để gửi lại đúng data
        // Vì item trong giỏ không có productType → không dùng buildCartApiBody được
        _raw: {
            frameId: apiItem.frameId ?? null,
            lensId: apiItem.lensId ?? null,
            contactLensId: apiItem.contactLensId ?? null,
            framePrice: apiItem.framePrice ?? null,
            lensPrice: apiItem.lensPrice ?? null,
            price: apiItem.price ?? null,
        },
    };
}

// ═══════════════════════════════════════════════════════════════
// 3. CÁC HÀM GỌI API
// ═══════════════════════════════════════════════════════════════

/**
 * addCartItemApi — POST /api/cart/add
 * Thêm sản phẩm MỚI vào giỏ (gọi từ trang ProductDetail)
 * Dùng buildCartApiBody để chuyển payload frontend → body API
 */
export async function addCartItemApi(item, quantity) {
    const body = buildCartApiBody(item, quantity);
    console.log("📦 [ADD] Gọi API cart/add:", body);
    const response = await api.post("/api/cart/add", body);
    return response.data;
}

/**
 * updateCartQtyApi — PUT /api/cart/update
 * Cập nhật số lượng sản phẩm ĐÃ CÓ trong giỏ (bấm +/-)
 *
 * Backend chỉ cần 2 field: cartItemId + quantity
 *
 * @param {number} cartItemId - ID của item trong giỏ
 * @param {number} newQty     - Số lượng mới
 */
export async function updateCartQtyApi(cartItemId, newQty) {
    const body = {
        cartItemId,
        quantity: newQty,
    };

    console.log("[UPDATE] Gọi API cart/update:", body);
    const response = await api.put("/api/cart/update", body);
    return response.data;
}


/**
 * getAllCartApi — GET /api/cart/getAllCart
 * Lấy toàn bộ giỏ hàng từ server
 */
export async function getAllCartApi() {
    const response = await api.get("/api/cart/getAllCart");
    return response.data;
}

/**
 * deleteCartItemApi — DELETE /api/cart/delete/:cartItemId
 * Xóa 1 sản phẩm khỏi giỏ
 */
export async function deleteCartItemApi(cartItemId) {
    const response = await api.delete(`/api/cart/delete/${cartItemId}`);
    return response.data;
}

/**
 * deleteAllCartApi — DELETE /api/cart/deleteAllCart
 * Xóa toàn bộ giỏ hàng
 */
export async function deleteAllCartApi() {
    const response = await api.delete("/api/cart/deleteAllCart");
    return response.data;
}
