/**
 * QuantitySelector.jsx
 * =====================
 * Component chọn số lượng sản phẩm (tăng/giảm bằng nút + và -).
 *
 * Quy tắc:
 *  - Không được giảm xuống dưới 1
 *  - Giao diện: nút [ - ] | số | [ + ]
 */

/**
 * @param {number}   quantity   - Số lượng hiện tại
 * @param {function} onDecrease - Hàm giảm số lượng
 * @param {function} onIncrease - Hàm tăng số lượng
 */
export default function QuantitySelector({ quantity, onDecrease, onIncrease }) {
    return (
        <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10">
            {/* Nút giảm */}
            <button
                onClick={onDecrease}
                disabled={quantity <= 1} // Không được giảm xuống dưới 1
                className="w-10 h-full flex items-center justify-center text-lg font-bold
          hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed transition"
            >
                −
            </button>

            {/* Hiển thị số lượng */}
            <div className="w-12 h-full flex items-center justify-center text-center font-semibold border-x border-gray-300">
                {quantity}
            </div>

            {/* Nút tăng */}
            <button
                onClick={onIncrease}
                className="w-10 h-full flex items-center justify-center text-lg font-bold hover:bg-gray-100 transition"
            >
                +
            </button>
        </div>
    );
}
