/**
 * InfoAccordion.jsx
 * ==================
 * Accordion hiển thị các thông tin bổ sung của sản phẩm:
 *  - Mô tả sản phẩm
 *  - Chính sách vận chuyển
 *  - Chính sách bảo hành
 *  - Tìm cửa hàng gần nhất
 *
 * Click vào tiêu đề → mở/đóng phần nội dung bên dưới (toggle).
 * Nếu đang mở → click lại → đóng.
 */

import { useState } from "react";
import { ACCORDION_ITEMS } from "../utils/constants";

/**
 * @param {string} description - Mô tả sản phẩm từ API (field Description)
 */
export default function InfoAccordion({ description }) {
  // ─── State: index của mục đang mở (-1 = đóng hết) ───────────────────────
  const [openIndex, setOpenIndex] = useState(-1);

  /**
   * toggleAccordion - Mở mục nếu đang đóng, đóng mục nếu đang mở
   * @param {number} index - Index của mục được click
   */
  function toggleAccordion(index) {
    setOpenIndex((prev) => (prev === index ? -1 : index));
  }

  return (
    <div className="border-t border-gray-200 mt-6">
      {ACCORDION_ITEMS.map((title, index) => (
        <div key={index} className="border-b border-gray-200">
          {/* ── Nút tiêu đề (click để toggle) ── */}
          <button
            onClick={() => toggleAccordion(index)}
            className="w-full py-4 flex justify-between items-center text-left font-bold uppercase text-sm tracking-wide hover:text-teal-600 transition-colors"
          >
            <span>{title}</span>
            {/* Dấu + hoặc − */}
            <span className="text-xl text-teal-500 leading-none">
              {openIndex === index ? "−" : "+"}
            </span>
          </button>

          {/* ── Nội dung (ẩn/hiện bằng max-height animation) ── */}
          <div
            className={`overflow-hidden transition-all duration-300 ease-in-out
              ${openIndex === index ? "max-h-60 pb-4" : "max-h-0"}`}
          >
            <p className="text-sm text-gray-500 leading-relaxed italic">
              {/* Mục đầu tiên (Mô tả) hiển thị nội dung từ API */}
              {index === 0 ? (description || "Chưa có mô tả sản phẩm.") : "Đang cập nhật..."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
