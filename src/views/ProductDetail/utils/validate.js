/**
 * validate.js
 * ============
 * Chứa hàm validate (kiểm tra hợp lệ) từng thông số đơn thuốc mắt.
 *
 * Quy tắc dựa theo tiêu chuẩn ngành quang học / nhãn khoa quốc tế:
 *  - SPH (Độ cầu): -20.00 đến +10.00, bội số 0.25
 *  - CYL (Độ loạn): -6.00 đến 0.00, bội số 0.25
 *  - AXIS (Trục loạn): 1 đến 180, số nguyên (chỉ có ý nghĩa khi CYL ≠ 0)
 *  - ADD (Cộng thêm): 0.75 đến 3.50, bội số 0.25
 *  - PD (Khoảng cách đồng tử): 25 đến 40 mm mỗi bên (full PD 50–80)
 *
 * Mỗi hàm trả về { isValid: boolean, message: string }
 * - isValid: true = hợp lệ
 * - message: chuỗi thông báo lỗi (rỗng nếu hợp lệ)
 */

// ─── Hàm nội bộ: kiểm tra bội số 0.25 ────────────────────────────────────────
// Math.round(num * 100) % 25 === 0 là cách tránh lỗi dấu phẩy động (floating point)
function isMultipleOf025(num) {
    return Math.round(num * 100) % 25 === 0;
}

// ─── Hàm nội bộ: parse chuỗi thành số ────────────────────────────────────────
// Trả về null nếu chuỗi không phải số hợp lệ
function parseNum(value) {
    const trimmed = String(value).trim();
    if (trimmed === "" || trimmed === "-") return null;
    const num = parseFloat(trimmed);
    return isNaN(num) ? null : num;
}

/**
 * validateSPH - Kiểm tra độ cầu (Sphere)
 * Cận thị: âm (ví dụ -3.00), Viễn thị: dương (ví dụ +2.50)
 * Phạm vi: -20.00 đến +10.00, bội số 0.25
 */
export function validateSPH(value) {
    const num = parseNum(value);
    if (num === null) return { isValid: false, message: "Vui lòng nhập số" };
    if (num < -20 || num > 10) return { isValid: false, message: "Từ -20.00 đến +10.00" };
    if (!isMultipleOf025(num)) return { isValid: false, message: "Phải là bội số 0.25" };
    return { isValid: true, message: "" };
}

/**
 * validateCYL - Kiểm tra độ loạn (Cylinder)
 * Trên đơn kính thường ghi âm: 0.00 đến -6.00
 * Phạm vi: -6.00 đến 0.00, bội số 0.25
 */
export function validateCYL(value) {
    const num = parseNum(value);
    if (num === null) return { isValid: false, message: "Vui lòng nhập số" };
    if (num < -6 || num > 0) return { isValid: false, message: "Từ -6.00 đến 0.00" };
    if (!isMultipleOf025(num)) return { isValid: false, message: "Phải là bội số 0.25" };
    return { isValid: true, message: "" };
}

/**
 * validateAXIS - Kiểm tra trục loạn (Axis)
 * Chỉ có ý nghĩa khi CYL ≠ 0. Phạm vi: 1 đến 180, số nguyên.
 * @param {string} value - Giá trị trục
 * @param {string} cylValue - Giá trị CYL tương ứng (để kiểm tra có cần AXIS không)
 */
export function validateAXIS(value, cylValue) {
    const cylNum = parseNum(cylValue);
    const axisNum = parseNum(value);

    // Nếu CYL = 0, trục không cần thiết → bỏ qua
    if (cylNum === 0 || cylNum === null) {
        return { isValid: true, message: "" };
    }

    if (axisNum === null) return { isValid: false, message: "Vui lòng nhập trục" };
    if (!Number.isInteger(axisNum)) return { isValid: false, message: "Phải là số nguyên" };
    if (axisNum < 1 || axisNum > 180) return { isValid: false, message: "Từ 1 đến 180" };
    return { isValid: true, message: "" };
}

/**
 * validateADD - Kiểm tra cộng thêm (Addition) - dùng cho kính đa tròng / đọc sách
 * Phạm vi: 0 (không cần) hoặc 0.75 đến 3.50, bội số 0.25
 */
export function validateADD(value) {
    const num = parseNum(value);
    if (num === null) return { isValid: false, message: "Vui lòng nhập số" };
    if (num === 0) return { isValid: true, message: "" }; // 0 = không cần cộng thêm
    if (num < 0.75 || num > 3.5) return { isValid: false, message: "Từ 0 hoặc 0.75 đến 3.50" };
    if (!isMultipleOf025(num)) return { isValid: false, message: "Phải là bội số 0.25" };
    return { isValid: true, message: "" };
}

/**
 * validatePD - Kiểm tra khoảng cách đồng tử từng mắt (monocular PD)
 * Phạm vi thực tế: 25mm đến 40mm mỗi bên (tổng 2 mắt khoảng 50–80mm)
 * Được nhập theo từng mắt, chấp nhận số thập phân 0.5
 */
export function validatePD(value) {
    const num = parseNum(value);
    if (num === null) return { isValid: false, message: "Vui lòng nhập số" };

    // PD thường đo được 0.5mm, không cần bội số 0.25
    return { isValid: true, message: "" };
}

/**
 * validateField - Hàm dispatch: nhận key (SPH/CYL/AXIS/ADD/PD) và giá trị, gọi đúng validator
 * @param {string} fieldKey  - "SPH" | "CYL" | "AXIS" | "ADD" | "PD"
 * @param {string} value     - Giá trị người dùng nhập
 * @param {string} [cylValue] - Cần thêm khi fieldKey = "AXIS" để biết CYL có ≠ 0 không
 * @returns {{ isValid: boolean, message: string }}
 */
export function validateField(fieldKey, value, cylValue = "0") {
    switch (fieldKey) {
        case "SPH": return validateSPH(value);
        case "CYL": return validateCYL(value);
        case "AXIS": return validateAXIS(value, cylValue);
        case "ADD": return validateADD(value);
        case "PD": return validatePD(value);
        default: return { isValid: true, message: "" };
    }
}
