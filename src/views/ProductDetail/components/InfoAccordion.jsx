/**
 * InfoAccordion.jsx
 * Chức năng:
 * - Accordion phần mô tả / vận chuyển / bảo hành / tìm cửa hàng
 * - Dùng React.memo để tránh re-render không cần thiết
 */

import React from "react";
import { ACCORDION_ITEMS } from "../utils/constants";

function InfoAccordion({ openAccordion, onToggle, description }) {
  return (
    <div className="border-t">
      {ACCORDION_ITEMS.map((item, index) => (
        <div key={index} className="border-b">
          <button
            onClick={() => onToggle(index)}
            className="w-full py-4 flex justify-between font-bold uppercase text-[15px]"
          >
            <span>{item}</span>
            <span>{openAccordion === index ? "−" : "+"}</span>
          </button>

          <div
            className={`overflow-hidden transition-all duration-300 ${
              openAccordion === index ? "max-h-32 pb-4" : "max-h-0"
            }`}
          >
            <p className="text-[13px] text-gray-500 italic">
              {index === 0 ? description : "Đang cập nhật..."}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default React.memo(InfoAccordion);
