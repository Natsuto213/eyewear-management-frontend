/**
 * getRelatedProducts.js
 * Chức năng:
 * - Nhận product -> trả ra:
 *   + cờ loại sản phẩm (isFrame/isLenses/isContact)
 *   + complementaryProducts (sản phẩm bổ trợ)
 *   + similarProducts (sản phẩm tương tự)
 *
 * Mục tiêu:
 * - index.jsx không còn nested ternary rối mắt
 */

import { PRODUCT_TYPES } from "./constants";

export function getRelatedProducts(product) {
  const type = product?.Product_Type;

  const isFrame = type === PRODUCT_TYPES.FRAME;
  const isLenses = type === PRODUCT_TYPES.LENSES;
  const isContact = type === PRODUCT_TYPES.CONTACT_LENSES;

  // Sản phẩm bổ trợ
  const complementaryProducts = isFrame
    ? product?.relatedLenses || []
    : isLenses
      ? product?.relatedFrames || []
      : [];

  // Sản phẩm tương tự
  const similarProducts = isContact
    ? product?.relatedContactLenses || []
    : isFrame
      ? product?.relatedFrames || []
      : product?.relatedLenses || [];

  return {
    isFrame,
    isLenses,
    isContact,
    complementaryProducts,
    similarProducts,
  };
}
