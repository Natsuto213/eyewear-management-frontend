/**
 * CartTable.jsx
 * ──────────────
 * Component hiển thị BẢNG DANH SÁCH tất cả sản phẩm trong giỏ hàng.
 *
 * Có thêm cột CHECKBOX ở đầu mỗi dòng:
 *   - Header: checkbox "Chọn tất cả"
 *   - Mỗi dòng: checkbox tick/bỏ tick từng sản phẩm
 *
 * Cấu trúc bảng (7 cột):
 *   ✅ | Ảnh | Tên & Đơn thuốc | Đơn giá | Số lượng | Thành tiền | Xoá
 *
 * Props:
 *   - cartItems: mảng sản phẩm trong giỏ
 *   - selectedKeys: MẢNG chứa key của các item đã tick (dạng ["cart-0", "cart-1"])
 *   - isAllSelected: boolean — tất cả đã tick chưa?
 *   - onToggle(itemKey): hàm tick/bỏ tick 1 sản phẩm
 *   - onToggleAll(): hàm tick/bỏ tick tất cả
 *   - getItemKey(item, index): hàm tạo key duy nhất cho item (dùng index)
 *   - onIncrease, onDecrease, onRemove: hàm xử lý số lượng/xóa
 *   - formatCurrency: hàm format tiền
 */

import CartItemRow from "./CartItemRow";

export default function CartTable({
    cartItems,
    selectedKeys,
    isAllSelected,
    onToggle,
    onToggleAll,
    getItemKey,
    onIncrease,
    onDecrease,
    onRemove,
    formatCurrency,
}) {
    return (
        // Container: nền trắng, bo tròn, cho phép cuộn ngang nếu màn hình nhỏ
        <div className="flex-1 bg-white rounded-2xl shadow-sm overflow-x-auto">
            <table className="w-full min-w-160">

                {/* ── Hàng tiêu đề ── */}
                <thead>
                    <tr className="border-b border-gray-100 text-xs font-semibold text-gray-400 uppercase tracking-wide">
                        {/* Cột checkbox "Chọn tất cả" */}
                        <th className="py-3 pl-5 pr-2 text-center w-10">
                            <input
                                type="checkbox"
                                checked={isAllSelected}
                                onChange={onToggleAll}
                                className="w-4 h-4 accent-teal-600 cursor-pointer"
                                title="Chọn tất cả"
                            />
                        </th>
                        <th className="py-3 pl-2 pr-3 text-left">Ảnh</th>
                        <th className="py-3 px-3 text-left">Tên &amp; Đơn thuốc</th>
                        <th className="py-3 px-3 text-right">Đơn giá</th>
                        <th className="py-3 px-3 text-center">Số lượng</th>
                        <th className="py-3 px-3 text-right">Thành tiền</th>
                        <th className="py-3 pl-3 pr-5 text-center">Xoá</th>
                    </tr>
                </thead>

                {/* ── Nội dung: lặp qua từng sản phẩm ── */}
                <tbody className="divide-y divide-gray-50">
                    {cartItems.map((item) => {
                        // Tạo key duy nhất dùng cartItemId từ server
                        const itemKey = getItemKey(item);

                        return (
                            <CartItemRow
                                key={itemKey}
                                item={item}
                                // ── Checkbox props ──
                                isSelected={selectedKeys.includes(itemKey)}
                                onToggle={() => onToggle(itemKey)}
                                // ── Hàm xử lý — truyền cartItemId (ID duy nhất từ server) ──
                                onIncrease={() => onIncrease(item.cartItemId)}
                                onDecrease={() => onDecrease(item.cartItemId)}
                                onRemove={() => onRemove(item.cartItemId)}
                                formatCurrency={formatCurrency}
                            />
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
