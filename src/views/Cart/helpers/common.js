/**
 * common.js - Các hàm tiện ích dùng chung trong Cart
 */

/**
 * formatCurrency - Format số tiền sang định dạng VND
 * @param {number} amount - Số tiền cần format
 * @returns {string} - VD: 1.200.000 đ
 */
export function formatCurrency(amount) {
    if (amount == null) return "—";
    return amount.toLocaleString("vi-VN") + " đ";
}

