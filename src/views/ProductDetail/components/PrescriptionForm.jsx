/**
 * PrescriptionForm.jsx
 * =====================
 * Form nhập đơn thuốc mắt gồm 5 thông số cho mỗi mắt (trái + phải):
 *  - SPH  (Độ Cầu)
 *  - CYL  (Độ Loạn)
 *  - AXIS (Trục)
 *  - ADD  (Cộng thêm)
 *  - PD   (Khoảng cách đồng tử)
 *
 * UI hiển thị dạng bảng 2 cột (Mắt Trái | Mắt Phải) để dễ nhìn.
 * Validate ngay khi rời ô input (onBlur), hiện lỗi màu đỏ bên dưới.
 *
 * Nếu không nhập gì → mặc định là "0" (0 độ), không bắt buộc điền.
 */

import { PRESCRIPTION_FIELDS } from "../utils/constants";

/**
 * @param {object} data            - Dữ liệu đơn thuốc hiện tại (từ usePrescription)
 * @param {object} errors          - Lỗi validate từng field
 * @param {function} onUpdate      - Hàm cập nhật 1 field (fieldName, value)
 * @param {function} onBlur        - Hàm validate khi rời ô (fieldName, fieldKey, side)
 */
export default function PrescriptionForm({ data, errors, onUpdate, onBlur }) {
    return (
        <div className="mb-6 p-5 bg-teal-50/60 border border-teal-200 rounded-xl">
            {/* ── Tiêu đề ── */}
            <div className="mb-4">
                <h3 className="text-sm font-black uppercase tracking-widest text-teal-800">
                    Thong so don thuoc mat
                </h3>
                <p className="text-xs text-teal-600 mt-1">
                    Để trống hoặc nhập 0 nếu không có độ. Ví dụ: SPH -3.00 nghĩa là cận 3 độ.
                </p>
            </div>

            {/* ── Bảng nhập liệu ── */}
            <div className="overflow-x-auto">
                <table className="w-full text-sm">
                    <thead>
                        <tr>
                            {/* Cột tiêu đề thông số */}
                            <th className="text-left py-2 pr-3 text-gray-500 font-medium w-32">
                                Thông số
                            </th>
                            {/* Cột Mắt Trái */}
                            <th className="text-center py-2 px-3 text-teal-700 font-semibold">
                                Mat Trai (OS)
                            </th>
                            {/* Cột Mắt Phải */}
                            <th className="text-center py-2 px-3 text-teal-700 font-semibold">
                                Mat Phai (OD)
                            </th>
                        </tr>
                    </thead>

                    <tbody>
                        {/* Render từng dòng tương ứng với 1 thông số */}
                        {PRESCRIPTION_FIELDS.map(({ key, label, unit }) => (
                            <tr key={key} className="border-t border-teal-100">
                                {/* Tên thông số + đơn vị */}
                                <td className="py-2 pr-3 text-gray-600 font-medium text-xs">
                                    {label}
                                    <span className="text-gray-400 ml-1">({unit})</span>
                                </td>

                                {/* Input cho 2 mắt: left và right */}
                                {["left", "right"].map((side) => {
                                    const fieldName = `${side}${key}`; // ví dụ: "leftSPH", "rightCYL"
                                    const errorMsg = errors[fieldName];

                                    return (
                                        <td key={side} className="py-2 px-3 text-center">
                                            <input
                                                type="text"
                                                inputMode="decimal"           // Bàn phím số trên mobile
                                                value={data[fieldName]}
                                                placeholder="0"
                                                onChange={(e) => onUpdate(fieldName, e.target.value)}
                                                // Validate khi người dùng rời khỏi ô input
                                                onBlur={() => onBlur(fieldName, key, side)}
                                                className={`w-20 text-center border rounded-lg px-2 py-1.5 text-sm outline-none transition
                          focus:ring-2 focus:ring-teal-400 focus:border-teal-500
                          ${errorMsg
                                                        ? "border-red-400 bg-red-50"
                                                        : "border-gray-300 bg-white hover:border-teal-300"
                                                    }`}
                                            />
                                            {/* Thông báo lỗi bên dưới ô input */}
                                            {errorMsg && (
                                                <p className="text-[10px] text-red-500 mt-0.5 leading-tight">
                                                    {errorMsg}
                                                </p>
                                            )}
                                        </td>
                                    );
                                })}
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* ── Ghi chú nhỏ ── */}
            <p className="text-[10px] text-gray-400 mt-3 italic">
                * Thông tin đơn thuốc sẽ được lưu kèm đơn hàng để kỹ thuật viên cắt kính đúng độ.
            </p>
        </div>
    );
}
