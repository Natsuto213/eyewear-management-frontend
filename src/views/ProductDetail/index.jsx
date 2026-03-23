/**
 * Luồng hoạt động:
 *  1. Lấy :id từ URL (useParams)
 *  2. Fetch dữ liệu sản phẩm qua useProductDetail hook
 *  3. Hiển thị LoadingState hoặc ErrorState nếu cần
 *  4. Khi có dữ liệu → phân loại sản phẩm (Gọng/Tròng/Kính áp tròng) qua productHelpers
 *  5. Render layout 2 cột: trái (Gallery) | phải (Info + Form + Cart)
 *  6. Bên dưới: RelatedSection sản phẩm bổ trợ + sản phẩm tương tự
 *
 * Quan trọng:
 *  - Khi :id thay đổi (người dùng xem sản phẩm khác), useEffect reset đơn thuốc + scroll lên đầu
 */

import { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

// ── Layout chung ──
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ── Components con ──
import ProductGallery from "./components/ProductGallery";
import ProductInfo from "./components/ProductInfo";
import AddToCartBar from "./components/AddToCartBar";
import InfoAccordion from "./components/InfoAccordion";
import RelatedSection from "./components/RelatedSection";
import LoadingState from "./components/LoadingState";
import ErrorState from "./components/ErrorState";

import { useProductDetail } from "./hooks/useProductDetail";
import { usePrescription } from "./hooks/usePrescription";

// ── Shopping Context (để lấy trạng thái popup đăng nhập) ──
import { useShoppingContext } from "@/views/Cart/contexts/ShoppingContext";

// ── Login Popup ──
import LoginPopup from "@/views/Cart/components/LoginPopup";
// ── Cart Success Popup ──
import CartSuccessPopup from "@/views/Cart/components/CartSuccessPopup";

// ── Utilities ──
import { getProductFlags, getRelatedLists } from "./utils/productHelpers";
import VirtualTryOnModal from "./components/VirtualTryOnModal";
import Model3DModal from "./components/Model3DModal";

export default function ProductDetailPage() {
    const { id } = useParams();
    const { showLoginPopup, setShowLoginPopup, showSuccessPopup, setShowSuccessPopup } = useShoppingContext();
    const { product, loading, error } = useProductDetail(id);

    // ─── Hook 2: Quản lý state form đơn thuốc mắt ─────────────────────────────
    const { formik, resetPrescription } = usePrescription();
    const [tryOnOpenForId, setTryOnOpenForId] = useState(null);
    const [model3DOpenForId, setModel3DOpenForId] = useState(null);

    const isTryOnOpen = tryOnOpenForId === id;
    const isModel3DOpen = model3DOpenForId === id;

    const prevIdRef = useRef(id);
    useEffect(() => {
        if (prevIdRef.current !== id) {
            console.log("ID sản phẩm thay đổi, reset form và scroll lên đầu", { id });
            resetPrescription();
            window.scrollTo({ top: 0, behavior: "smooth" });
            prevIdRef.current = id; // Cập nhật ref với id mới
        }
    }, [id, resetPrescription]);

    // ─── Hiển thị màn hình loading/lỗi ────────────────────────────────────────
    if (loading) return <LoadingState />;
    if (error || !product) return <ErrorState message={error} />;

    // ─── Phân loại sản phẩm: Gọng / Tròng / Kính áp tròng ────────────────────
    const flags = getProductFlags(product);
    const { isFrame, isLenses, isContact } = flags;
    const canTryOn = isFrame;
    const canView3D = isFrame;

    // ─── Lấy danh sách sản phẩm liên quan ─────────────────────────────────────
    const {
        complementaryTitle,
        complementaryProducts,
        similarTitle,
        similarProducts,
    } = getRelatedLists(product, flags);

    // ─── Render trang ──────────────────────────────────────────────────────────
    return (
        <div className="w-full bg-white font-sans text-black antialiased min-h-screen">
            <Navbar />

            {/* ── Popup đăng nhập — hiện khi chưa login mà bấm "Thêm vào giỏ" ── */}
            {showLoginPopup && (
                <LoginPopup onClose={() => setShowLoginPopup(false)} />
            )}

            {showSuccessPopup && (
                <CartSuccessPopup show={showSuccessPopup} onClose={() => setShowSuccessPopup(false)} />
            )}

            {canTryOn && (
                <VirtualTryOnModal
                    open={isTryOnOpen}
                    onClose={() => setTryOnOpenForId(null)}
                    productName={product.name}
                    tryOnConfig={product.virtualTryOn}
                    frameMetrics={product.frameMetrics}
                />
            )}

            {canView3D && (
                <Model3DModal
                    open={isModel3DOpen}
                    onClose={() => setModel3DOpenForId(null)}
                    productName={product.name}
                    modelUrl={product.virtualTryOn?.modelUrl}
                />
            )}

            <main className="max-w-350 mx-auto px-4 md:px-10 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-start">

                    {/* ── CỘT TRÁI: Gallery ảnh sản phẩm ── */}
                    <ProductGallery
                        images={product.imageUrls}
                        name={product.name}
                    />

                    {/* ── CỘT PHẢI: Thông tin + Form + Nút thêm giỏ ── */}
                    <div className="flex flex-col lg:pl-6">

                        {/* Tên, SKU, Brand, Giá, thông số đặc trưng */}
                        {/* <ProductInfo product={product} isContact={isContact} /> */}
                        <ProductInfo
                            product={product}
                            isContact={isContact}
                            isFrame={isFrame}
                            onTryOn={() => setTryOnOpenForId(id)}
                            onView3D={() => setModel3DOpenForId(id)}
                        />

                        {/* AddToCartBar xử lý toàn bộ business logic:
                - PrescriptionForm (nếu là Gọng/Tròng)
                - Checkbox "mua đơn lẻ" / Nút mở Modal chọn sản phẩm kèm
                - QuantitySelector + Nút "Thêm vào giỏ" */}
                        <AddToCartBar
                            product={product}
                            formik={formik} // Truyền object formik xuống
                            isFrame={isFrame}
                            isLenses={isLenses}
                            isContact={isContact}
                        />

                        {/* Accordion: Mô tả / Vận chuyển / Bảo hành / Cửa hàng */}
                        <InfoAccordion description={product.Description} />
                    </div>
                </div>
            </main>

            {/* ── SECTION SẢN PHẨM BỔ TRỢ (Gọng ↔ Tròng) ── */}
            {/* Chỉ hiển thị khi có sản phẩm bổ trợ */}
            <RelatedSection
                title={complementaryTitle}
                products={complementaryProducts}
            />

            {/* ── SECTION SẢN PHẨM TƯƠNG TỰ ── */}
            <RelatedSection
                title={similarTitle}
                products={similarProducts}
            />

            <Footer />
        </div>
    );
}
