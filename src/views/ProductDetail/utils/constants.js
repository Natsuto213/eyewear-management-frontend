/**
 * constants.js
 * =============
 * Tập trung tất cả các hằng số (constants) dùng chung trong ProductDetail.
 * Mục đích: tránh hard-code string rải rác → dễ thay đổi sau này chỉ cần sửa 1 chỗ.
 */

// ─── Loại sản phẩm ───────────────────────────────────────────────────────────
// Phải khớp chính xác với giá trị "Product_Type" trả về từ API
export const PRODUCT_TYPES = {
    FRAME: "Gọng kính",           // Gọng kính
    LENSES: "Tròng kính",         // Tròng kính (kính cắt theo đơn)
    CONTACT: "Kính áp tròng",     // Kính áp tròng
};

// ─── Các mục trong Accordion thông tin sản phẩm ──────────────────────────────
export const ACCORDION_ITEMS = [
    "Mô tả sản phẩm",
    "Chính sách vận chuyển",
    "Chính sách bảo hành",
    "Tìm cửa hàng gần nhất",
];

// ─── Giá trị mặc định cho form đơn thuốc ─────────────────────────────────────
// Mỗi mắt có 5 thông số: Cầu (SPH), Loạn (CYL), Trục (AXIS), Cộng thêm (ADD), KCĐT (PD)
// Mặc định 0 hết (nghĩa là không có độ)
export const DEFAULT_PRESCRIPTION = {
    // Mắt trái (Left / OS)
    leftSPH: "0",   // Độ Cầu (Cận/Viễn): âm = cận thị, dương = viễn thị
    leftCYL: "0",   // Độ Loạn (Cylinder): luôn âm hoặc 0 trên đơn kính
    leftAXIS: "0",  // Trục loạn (Axis): từ 1 đến 180 độ
    leftADD: "0",   // Cộng thêm (Add): dùng cho kính đọc sách / đa tròng
    leftPD: "0",    // Khoảng cách đồng tử trái (PD left), đơn vị mm

    // Mắt phải (Right / OD)
    rightSPH: "0",
    rightCYL: "0",
    rightAXIS: "0",
    rightADD: "0",
    rightPD: "0",
};

// ─── Định nghĩa các field của form đơn thuốc ─────────────────────────────────
// Dùng để render bảng input tự động, tránh code lặp lại
export const PRESCRIPTION_FIELDS = [
    { key: "SPH", label: "Cầu (SPH)", unit: "D" },
    { key: "CYL", label: "Loạn (CYL)", unit: "D" },
    { key: "AXIS", label: "Trục (AXIS)", unit: "°" },
    { key: "ADD", label: "Cộng thêm (ADD)", unit: "D" },
    { key: "PD", label: "KCĐT (PD)", unit: "mm" },
];
