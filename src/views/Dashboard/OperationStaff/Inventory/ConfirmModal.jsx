const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, items }) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden animate-in fade-in zoom-in duration-200">
                {/* Header */}
                <div className="p-6 border-b border-slate-100 flex items-center gap-3">
                    <h3 className="text-xl font-bold text-slate-900">{title}</h3>
                </div>

                {/* Content */}
                <div className="p-6 space-y-4">
                    <p className="text-slate-600 font-medium">{message}</p>

                    {items.length > 0 && (
                        <div className="bg-red-50 rounded-xl p-4 border border-red-100 max-h-60 overflow-y-auto">
                            <p className="text-red-800 font-bold text-[10px] uppercase mb-3 tracking-wider">Chi tiết sai lệch & Ghi chú:</p>
                            <ul className="space-y-3">
                                {items.map((item, idx) => {
                                    const diff = item.orderedQuantity - parseInt(item.actualQty);
                                    const statusText = diff > 0 ? `Thiếu ${diff}` : `Dư ${Math.abs(diff)}`;

                                    return (
                                        <li key={idx} className="text-sm border-b border-red-200/50 pb-2 last:border-0">
                                            <div className="flex justify-between items-start">
                                                <span className="font-bold text-red-900">{item.productName}</span>
                                                <span className="font-black text-red-600 whitespace-nowrap ml-4">
                                                    {statusText}
                                                </span>
                                            </div>
                                            {/* Phần hiển thị Note */}
                                            <p className="text-[12px] mt-1 text-red-700/80 italic">
                                                <span className="font-semibold">Ghi chú:</span> {item.note && item.note.trim() !== "" ? item.note : "Không có ghi chú"}
                                            </p>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 bg-slate-50 flex gap-3 justify-end">
                    <button
                        onClick={onClose}
                        className="px-6 py-2.5 rounded-xl font-semibold text-slate-600 hover:bg-slate-200 transition-colors"
                    >
                        Kiểm tra lại
                    </button>
                    <button
                        onClick={onConfirm}
                        className="px-6 py-2.5 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-lg shadow-blue-200 transition-all active:scale-95"
                    >
                        Xác nhận nhập kho
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmModal;