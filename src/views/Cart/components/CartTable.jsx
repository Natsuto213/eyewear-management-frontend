

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
                        const itemKey = getItemKey(item);

                        return (
                            <CartItemRow
                                key={itemKey}
                                item={item}
                                isSelected={selectedKeys.includes(itemKey)}
                                onToggle={() => onToggle(itemKey)}
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
