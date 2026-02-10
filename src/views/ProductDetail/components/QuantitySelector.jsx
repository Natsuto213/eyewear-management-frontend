/**
 * QuantitySelector.jsx
 * Chức năng:
 * - UI tăng/giảm số lượng
 * - Dùng React.memo để tránh re-render nếu props không đổi
 */

import React from "react";

function QuantitySelector({ quantity, onDecrease, onIncrease }) {
  return (
    <div className="flex border border-gray-300 h-10 items-center">
      <button onClick={onDecrease} className="px-3">
        -
      </button>
      <div className="w-10 text-center">{quantity}</div>
      <button onClick={onIncrease} className="px-3">
        +
      </button>
    </div>
  );
}

export default React.memo(QuantitySelector);
