/**
 * productHelpers.js
 * ==================
 * Các hàm helper (hỗ trợ) liên quan đến phân loại và xử lý dữ liệu sản phẩm.
 * Tách ra file riêng để index.jsx gọn hơn.
 */

import { PRODUCT_TYPES } from "./constants";

/**
 * getProductFlags - Trả về các cờ boolean để biết sản phẩm thuộc loại nào.
 *
 * @param {object} product - Đối tượng sản phẩm từ API
 * @returns {{
 *   isFrame:   boolean,  - Gọng kính
 *   isLenses:  boolean,  - Tròng kính
 *   isContact: boolean,  - Kính áp tròng
 *   needsPrescription: boolean - Có cần đơn thuốc không (Tròng hoặc Kính áp tròng)
 * }}
 */
export function getProductFlags(product) {
  const type = product?.Product_Type ?? "";

  const isFrame   = type === PRODUCT_TYPES.FRAME;
  const isLenses  = type === PRODUCT_TYPES.LENSES;
  const isContact = type === PRODUCT_TYPES.CONTACT;

  // Cần đơn thuốc khi là Gọng, Tròng (không phải Kính áp tròng)
  // Kính áp tròng thường mua theo hộp, không cắt theo đơn
  const needsPrescription = isFrame || isLenses;

  return { isFrame, isLenses, isContact, needsPrescription };
}

/**
 * getRelatedLists - Trả về danh sách sản phẩm liên quan từ dữ liệu API.
 *
 * Logic:
 *  - Gọng kính  → hiển thị "Tròng kính bổ trợ" (relatedLenses)
 *  - Tròng kính → hiển thị "Gọng kính bổ trợ" (relatedFrames)
 *  - Kính áp tròng → hiển thị "Kính áp tròng tương tự" (relatedContactLenses)
 *
 * @param {object} product  - Đối tượng sản phẩm từ API
 * @param {object} flags    - Kết quả từ getProductFlags
 * @returns {{
 *   complementaryTitle:    string,
 *   complementaryProducts: any[],
 *   similarTitle:          string,
 *   similarProducts:       any[]
 * }}
 */
export function getRelatedLists(product, flags) {
  const { isFrame, isLenses, isContact } = flags;

  let complementaryTitle    = "";
  let complementaryProducts = [];
  let similarTitle          = "Sản phẩm tương tự";
  let similarProducts       = [];

  if (isFrame) {
    complementaryTitle    = "Tròng kính bổ trợ";
    complementaryProducts = product?.relatedLenses ?? [];
    similarProducts       = product?.relatedFrames  ?? [];
  } else if (isLenses) {
    complementaryTitle    = "Gọng kính bổ trợ";
    complementaryProducts = product?.relatedFrames  ?? [];
    similarProducts       = product?.relatedLenses  ?? [];
  } else if (isContact) {
    complementaryProducts = [];
    similarProducts       = product?.relatedContactLenses ?? [];
  }

  return {
    complementaryTitle,
    complementaryProducts,
    similarTitle,
    similarProducts,
  };
}
