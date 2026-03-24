

import { api } from "@/lib/api";

// Frontend lưu: { productId, pairedProductId, priceProduct, pricePairedProduct, prescription, ... }
// API cần:      { frameId, lensId, contactLensId, framePrice, lensPrice, price, rightEyeSph, ... }
//
// Vì 1 sản phẩm có thể là Gọng, Tròng, hoặc Kính áp tròng
//  cần dựa vào productType để biết gán vào field nào


function parsePrescription(value, needPrescription) {
    // Chuyển chuỗi thành số
    const number = parseFloat(value);

    // Trường hợp 1: Có cả frame + lens → luôn giữ giá trị (kể cả 0)
    if (needPrescription) {
        // Nếu chuyển thất bại (NaN) → mặc định 0
        if (isNaN(number)) {
            return 0;
        }
        return number;
    }

    // Trường hợp 2 & 3: Chỉ có 1 ID
    // Nếu NaN hoặc = 0 → null, nếu ≠ 0 → giữ giá trị
    if (isNaN(number) || number === 0) {
        return null;
    }
    return number;
}

function buildCartApiBody(item, quantity) {
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

    // Lấy thông số đơn thuốc
    const rx = item.prescription || {};

    // Kiểm tra sản phẩm có cần đơn thuốc không?
    // Chỉ cần đơn thuốc khi mua Gọng kính + Tròng kính cùng lúc
    const needPrescription = frameId !== null && lensId !== null;

    //Tính tổng giá
    const totalPrice = (item.priceProduct ?? 0) + (item.pricePairedProduct ?? 0);
    return {
        frameId,
        lensId,
        contactLensId,
        quantity,
        framePrice: framePrice || null,
        lensPrice: lensPrice || null,
        price: totalPrice || null,

        // Đơn thuốc mắt phải
        rightEyeSph: parsePrescription(rx.rightSPH, needPrescription),
        rightEyeCyl: parsePrescription(rx.rightCYL, needPrescription),
        rightEyeAxis: parsePrescription(rx.rightAXIS, needPrescription),
        rightEyeAdd: parsePrescription(rx.rightADD, needPrescription),

        // Đơn thuốc mắt trái
        leftEyeSph: parsePrescription(rx.leftSPH, needPrescription),
        leftEyeCyl: parsePrescription(rx.leftCYL, needPrescription),
        leftEyeAxis: parsePrescription(rx.leftAXIS, needPrescription),
        leftEyeAdd: parsePrescription(rx.leftADD, needPrescription),

        // Khoảng cách đồng tử (PD)
        pdRight: parsePrescription(rx.rightPD, needPrescription),
        pdLeft: parsePrescription(rx.leftPD, needPrescription),
        pd: needPrescription
            ? parsePrescription(rx.rightPD, true) + parsePrescription(rx.leftPD, true)
            : null,
    };
}

// ═══════════════════════════════════════════════════════════════
//  HÀM CHUYỂN ĐỔI: response API → object hiển thị trên UI
// ═══════════════════════════════════════════════════════════════
// API trả về: { cartItemId, frameName, framePrice, frameImg, lensName, lensPrice, lensImg,
//               contactLensName, contactLensPrice, contactLensImg, quantity, price }
//
// UI cần:     { cartItemId, nameProduct, imgProduct, priceProduct, quantity, price,
//               namePairedProduct, imgPairedProduct, pricePairedProduct, ... }
// ═══════════════════════════════════════════════════════════════

export function mapApiItemToLocal(apiItem) {
    let nameProduct = "";
    let imgProduct = "";
    let priceProduct = 0;
    let productId = null;

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
        itemType: apiItem.itemType,

    };
}


/**
 * Dùng buildCartApiBody để chuyển payload frontend → body API
 */
export async function addCartItemApi(item, quantity) {
    const body = buildCartApiBody(item, quantity);
    console.log("[ADD] Gọi API cart/add:", body);
    const response = await api.post("/api/cart/add", body);
    return response.data;
}


export async function updateCartQtyApi(cartItemId, newQty) {
    const body = {
        cartItemId,
        quantity: newQty,
    };

    console.log("[UPDATE] Gọi API cart/update:", body);
    const response = await api.put("/api/cart/update", body);
    return response.data;
}


export async function getAllCartApi() {
    const response = await api.get("/api/cart/getAllCart");
    return response.data;
}

export async function deleteCartItemApi(cartItemId) {
    const response = await api.delete(`/api/cart/delete/${cartItemId}`);
    return response.data;
}


export async function deleteAllCartApi() {
    const response = await api.delete("/api/cart/deleteAllCart");
    return response.data;
}