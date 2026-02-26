/**
 * index.jsx (ProductDetail Page)
 * Chức năng:
 * - Là page chính render chi tiết sản phẩm theo :id
 * - Lắp ráp các component, không chứa logic dài (logic đã tách ra hooks/utils)
 */

import React, { useCallback, useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";

import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";
import { ImageWithFallback } from "../../components/ImageWithFallback";

import ProductGallery from "./components/ProductGallery";
import PrescriptionForm from "./components/PrescriptionForm";
import RelatedSection from "./components/RelatedSection";

import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import QuantitySelector from "./components/QuantitySelector";
import InfoAccordion from "./components/InfoAccordion";

import { useProductDetail } from "./hooks/useProductDetail";
import { usePrescriptionInput } from "./hooks/usePrescriptionInput";
import { getRelatedProducts } from "./utils/getRelatedProducts";

// validate.js nằm trong views/ProductDetail/utils/
import { validateEyeDegree } from "./utils/validate";

export default function ProductDetailPage() {
  const { id } = useParams();

  // 1) Fetch product theo id
  const { product, loading, error } = useProductDetail(id);

  // 2) UI state đơn giản
  const [quantity, setQuantity] = useState(1);
  const [openAccordion, setOpenAccordion] = useState(null);
  const didMountRef = useRef(false);

  // 3) State & handler cho phần đơn thuốc
  // Pass current product id so the hook can persist per-product draft in sessionStorage
  const rx = usePrescriptionInput(id, validateEyeDegree);

  /**
   * Reset UI khi id đổi:
   * - quantity về 1
   * - accordion đóng lại
   * - đơn thuốc reset
   * - scroll lên đầu
   */
  useEffect(() => {
    setQuantity(1);
    setOpenAccordion(null);
    // Only reset prescription when switching between products, not on initial mount
    // This avoids clearing the draft on page refresh (F5). sessionStorage retains data per tab.
    if (!didMountRef.current) {
      didMountRef.current = true;
    } else {
      rx.resetPrescription();
    }
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // ====== useCallback CHỈ DÙNG KHI child có React.memo ======
  // QuantitySelector là React.memo => onDecrease/onIncrease nên ổn định reference
  const handleDecrease = useCallback(() => {
    setQuantity((q) => Math.max(1, q - 1));
  }, []);

  const handleIncrease = useCallback(() => {
    setQuantity((q) => q + 1);
  }, []);

  // InfoAccordion là React.memo => onToggle nên ổn định reference
  const handleToggleAccordion = useCallback((index) => {
    setOpenAccordion((current) => (current === index ? null : index));
  }, []);
  // ===========================================================

  if (loading) return <LoadingState />;
  if (error || !product) return <ErrorState message={error} />;

  // 4) Tính loại sản phẩm + related
  const {
    isFrame,
    isLenses,
    isContact,
    complementaryProducts,
    similarProducts,
  } = getRelatedProducts(product);

  return (
    <div className="w-full bg-white font-sans text-black antialiased">
      <Navbar />

      <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-start">
          <ProductGallery images={product.imageUrls} name={product.name} />

          <div className="flex flex-col pl-4 lg:pl-10">
            <h1 className="text-xl md:text-2xl font-bold uppercase">
              {product.name}, mã hàng: {product.sku}
            </h1>

            <div className="text-2xl font-bold text-red-600 mb-6 font-mono">
              {product.price.toLocaleString()}đ
            </div>

            {/* 4 Ảnh nhỏ dưới giá tiền */}
            <div className="grid grid-cols-4 gap-2 mb-8">
              {product.imageUrls?.slice(0, 4).map((url, i) => (
                <div
                  key={i}
                  className="aspect-square border border-teal-500/30 overflow-hidden cursor-pointer p-1 bg-white"
                >
                  <ImageWithFallback
                    src={url}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>

            {/* Form đơn thuốc chỉ hiện cho Tròng/Kính áp tròng */}
            {(isLenses || isContact) && (
              <PrescriptionForm
                method={rx.method}
                setMethod={rx.setMethod}
                data={rx.prescriptionData}
                onUpdate={rx.updateField}
                onFileChange={rx.handleFileChange}
                previewUrl={rx.previewUrl}
                errors={rx.errors}
                onBlurAction={rx.handleBlurAction}
              />
            )}

            <div className="space-y-4 mb-10">
              <div className="flex gap-4 items-center">
                <QuantitySelector
                  quantity={quantity}
                  onDecrease={handleDecrease}
                  onIncrease={handleIncrease}
                />

                <button className="flex-1 border border-teal-500 text-teal-500 h-10 font-bold uppercase hover:bg-teal-50">
                  THÊM VÀO GIỎ HÀNG
                </button>
              </div>

              <button className="w-full bg-white border border-teal-500 text-teal-500 h-10 font-bold uppercase hover:bg-teal-500 hover:text-white transition-all">
                MUA NGAY
              </button>
            </div>

            <InfoAccordion
              openAccordion={openAccordion}
              onToggle={handleToggleAccordion}
              description={product.Description}
            />
          </div>
        </div>
      </div>

      {/* Section bổ trợ (chỉ Gong/Trong) */}
      {(isFrame || isLenses) && (
        <RelatedSection
          title={isFrame ? "TRÒNG KÍNH BỔ TRỢ" : "GỌNG KÍNH BỔ TRỢ"}
          products={complementaryProducts}
        />
      )}

      <RelatedSection title="SẢN PHẨM TƯƠNG TỰ" products={similarProducts} />

      <Footer />
    </div>
  );
}
