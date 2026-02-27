/**
 * index.jsx - ProductDetail Page
 * ================================
 * Trang chi tiết sản phẩm. Đây là "bộ khung" lắp ráp các component lại với nhau.
 * Tất cả logic phức tạp đã được tách vào hooks/ và utils/ để file này gọn, dễ đọc.
 *
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

import { useEffect, useRef } from "react";
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

// ── Custom Hooks ──
import { useProductDetail } from "./hooks/useProductDetail";
import { usePrescription } from "./hooks/usePrescription";

// ── Utilities ──
import { getProductFlags, getRelatedLists } from "./utils/productHelpers";

export default function ProductDetailPage() {
    // ─── Lấy id sản phẩm từ URL (/product/:id) ────────────────────────────────
    const { id } = useParams();

    // ─── Hook 1: Fetch dữ liệu sản phẩm từ API ────────────────────────────────
    const { product, loading, error } = useProductDetail(id);

    // ─── Hook 2: Quản lý state form đơn thuốc mắt ─────────────────────────────
    const {
        data: rxData,       // Dữ liệu 10 fields đơn thuốc
        errors: rxErrors,     // Lỗi validate từng field
        updateField: onUpdateRx,   // Hàm cập nhật 1 field
        validateOnBlur: onBlurRx,     // Hàm validate khi rời ô input
        validateAll: validateAllRx, // Hàm validate toàn bộ trước khi thêm vào giỏ
        resetPrescription,             // Hàm reset form về mặc định (0 hết)
    } = usePrescription();

    // ─── Ref: đánh dấu đã mount lần đầu chưa ─────────────────────────────────
    // Mục đích: phân biệt "lần đầu vào trang (F5)" vs "chuyển sang id khác"
    // - Lần đầu mount: isMounted = false → KHÔNG reset (giữ data từ localStorage)
    // - Đổi id sau đó:  isMounted = true  → reset form + scroll lên đầu
    const isMounted = useRef(false);

    /**
     * useEffect: Khi id thay đổi (người dùng điều hướng sang sản phẩm khác)
     *  → Reset form đơn thuốc về 0
     *  → Scroll lên đầu trang
     *
     * Lần đầu mount (F5): bỏ qua reset để giữ dữ liệu đã lưu trong localStorage.
     */
    useEffect(() => {
        // Lần đầu mount: chỉ đánh dấu đã mount, không reset
        if (!isMounted.current) {
            isMounted.current = true;
            return;
        }
        // Từ lần thứ 2 trở đi (id thực sự thay đổi): reset form và scroll lên đầu
        resetPrescription();
        window.scrollTo({ top: 0, behavior: "smooth" });
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [id]); // Chỉ chạy khi id thay đổi

    // ─── Hiển thị màn hình loading/lỗi ────────────────────────────────────────
    if (loading) return <LoadingState />;
    if (error || !product) return <ErrorState message={error} />;

    // ─── Phân loại sản phẩm: Gọng / Tròng / Kính áp tròng ────────────────────
    const flags = getProductFlags(product);
    const { isFrame, isLenses, isContact } = flags;

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

            {/* ── Vùng nội dung chính (max 1400px, có padding responsive) ── */}
            <main className="max-w-350 mx-auto px-4 md:px-10 py-8">

                {/* ── GRID 2 CỘT: 60% Gallery | 40% Thông tin ── */}
                {/* Mobile: 1 cột dọc / Desktop: 2 cột ngang */}
                <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-start">

                    {/* ── CỘT TRÁI: Gallery ảnh sản phẩm ── */}
                    <ProductGallery
                        images={product.imageUrls}
                        name={product.name}
                    />

                    {/* ── CỘT PHẢI: Thông tin + Form + Nút thêm giỏ ── */}
                    <div className="flex flex-col lg:pl-6">

                        {/* Tên, SKU, Brand, Giá, thông số đặc trưng */}
                        <ProductInfo product={product} isContact={isContact} />

                        {/* AddToCartBar xử lý toàn bộ business logic:
                - PrescriptionForm (nếu là Gọng/Tròng)
                - Checkbox "mua đơn lẻ" / Nút mở Modal chọn sản phẩm kèm
                - QuantitySelector + Nút "Thêm vào giỏ" */}
                        <AddToCartBar
                            product={product}
                            isFrame={isFrame}
                            isLenses={isLenses}
                            isContact={isContact}
                            rxData={rxData}
                            rxErrors={rxErrors}
                            onUpdateRx={onUpdateRx}
                            onBlurRx={onBlurRx}
                            validateAllRx={validateAllRx}
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
