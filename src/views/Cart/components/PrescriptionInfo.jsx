/**
 * PrescriptionInfo.jsx
 * ─────────────────────
 * Component hiển thị THÔNG TIN ĐƠN THUỐC của 1 sản phẩm.
 *
 * Cách hoạt động:
 *  1. Kiểm tra xem có dữ liệu đơn thuốc không (hasData)
 *  2. Nếu KHÔNG có → không render gì cả (return null)
 *  3. Nếu CÓ → hiện nút "📋 Đơn thuốc"
 *     - Click vào nút → mở/đóng bảng chi tiết (toggle)
 *
 * Props:
 *  - prescription: object chứa các thông số mắt
 *    Ví dụ: { leftSPH: "-1.50", rightSPH: "-2.00", leftCYL: "0", ... }
 */

import { useState } from "react";

export default function PrescriptionInfo({ prescription }) {
    // ── State: bảng đang mở (true) hay đóng (false) ──
    const [isOpen, setIsOpen] = useState(false);

    // ── Kiểm tra dữ liệu ──
    // Nếu prescription = null → không có đơn
    // Nếu tất cả giá trị đều là "0", "", "0.00" → cũng coi như không có đơn
    const hasData =
        prescription &&
        Object.values(prescription).some(
            (value) => value !== "0" && value !== "" && value !== "0.00"
        );

    // Không có dữ liệu → không hiển thị gì
    if (!hasData) return null;

    // ── Chuẩn bị dữ liệu bảng ──
    // Mỗi phần tử trong mảng = 1 hàng trong bảng
    // label: tên thông số, l: giá trị mắt trái, r: giá trị mắt phải
    const rows = [
        { label: "SPH", l: prescription.leftSPH, r: prescription.rightSPH },
        { label: "CYL", l: prescription.leftCYL, r: prescription.rightCYL },
        { label: "Axis", l: prescription.leftAXIS, r: prescription.rightAXIS },
        { label: "Add", l: prescription.leftADD, r: prescription.rightADD },
        { label: "PD", l: prescription.leftPD, r: prescription.rightPD },
    ];

    return (
        <div style={{ marginTop: "8px" }}>
            {/* ── Nút toggle: click để mở/đóng bảng ── */}
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full px-2.5 py-1 transition-colors"
            >
                📋 Đơn thuốc &nbsp;{isOpen ? "▲" : "▼"}
            </button>

            {/* ── Bảng chi tiết: chỉ hiện khi isOpen = true ── */}
            {isOpen && (
                <div className="mt-2 p-3 bg-amber-50 border border-amber-100 rounded-xl text-xs text-gray-700">
                    <table className="w-full">
                        {/* Tiêu đề cột */}
                        <thead>
                            <tr className="text-amber-700 font-semibold text-center">
                                <th className="text-left pb-1 pr-3">Thông số</th>
                                <th className="pb-1 pr-2">Mắt trái (L)</th>
                                <th className="pb-1">Mắt phải (R)</th>
                            </tr>
                        </thead>
                        {/* Nội dung từng hàng */}
                        <tbody>
                            {rows.map(({ label, l, r }) => (
                                <tr key={label} className="border-t border-amber-100">
                                    {/* Tên thông số */}
                                    <td className="py-0.5 pr-3 text-gray-400">{label}</td>
                                    {/* Giá trị mắt trái — nếu rỗng thì hiện "—" */}
                                    <td className="py-0.5 pr-2 text-center font-medium">{l}</td>
                                    {/* Giá trị mắt phải */}
                                    <td className="py-0.5 text-center font-medium">{r}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
