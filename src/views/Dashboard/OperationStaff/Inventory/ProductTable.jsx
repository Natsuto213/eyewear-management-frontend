import React from 'react';

const ProductTable = ({ products, status, onQtyChange, onNoteChange, formatCurrency, startIndex }) => {
    return (
        <div className="overflow-x-auto border-t">
            <table className="w-full text-sm border-collapse">
                <thead>
                    <tr className="bg-[#1e40af] text-white">
                        <th className="p-4 uppercase text-[0.7rem] font-semibold text-center w-12">STT</th>
                        <th className="p-4 uppercase text-[0.7rem] font-semibold text-left">Sản phẩm</th>
                        <th className="p-4 uppercase text-[0.7rem] font-semibold text-right">Giá nhập</th>
                        <th className="p-4 uppercase text-[0.7rem] font-semibold text-center">VAT</th>
                        <th className="p-4 uppercase text-[0.7rem] font-semibold text-center">Dự kiến</th>
                        <th className="p-4 uppercase text-[0.7rem] font-semibold text-right w-32">Thành tiền (DK)</th>
                        <th className="p-4 uppercase text-[0.7rem] font-semibold text-center bg-blue-700 w-24">Thực tế *</th>
                        <th className="p-4 uppercase text-[0.7rem] font-semibold text-left">Ghi chú</th>
                        <th className="p-4 uppercase text-[0.7rem] font-semibold text-right">Thành tiền (TT)</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                    {products.map((p, idx) => {
                        const actual = p.actualQty === '' ? 0 : parseInt(p.actualQty);
                        const isMismatch = status === "Pending Verification" && actual !== p.orderedQuantity;
                        const actualTotalPrice = p.unitCost * actual * (1 + p.vatRate / 100);

                        return (
                            <tr key={p.receiptDetailId} className="hover:bg-slate-50 transition-colors">
                                <td className="p-4 text-center font-medium text-slate-400">{startIndex + idx + 1}</td>
                                <td className="p-4">
                                    <div className="flex items-center gap-3">
                                        <img src={p.productImage} alt={p.productName} className="w-10 h-10 rounded shadow-sm border object-cover" />
                                        <div className="font-semibold text-slate-600 max-w-[180px] truncate">{p.productName}</div>
                                    </div>
                                </td>
                                <td className="p-4 text-right font-mono text-slate-500">{formatCurrency(p.unitCost)}</td>
                                <td className="p-4 text-center text-slate-500 font-medium">{p.vatRate}%</td>
                                <td className="p-4 text-center font-bold text-slate-400">{p.orderedQuantity}</td>
                                <td className="p-4 text-right italic text-slate-300 font-mono text-[11px]">{formatCurrency(p.totalPrice)}</td>
                                <td className="p-4 bg-blue-50/50 text-center">
                                    <input
                                        type="text"
                                        className={`w-full text-center font-bold rounded border py-1.5 bg-white
                                            ${isMismatch ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                                        value={p.actualQty}
                                        onChange={(e) => onQtyChange(p.receiptDetailId, e.target.value)}
                                        disabled={status !== "Pending Verification"}
                                    />
                                </td>
                                <td className="p-4">
                                    <input
                                        type="text"
                                        placeholder="..."
                                        className="w-full border-b border-dashed border-slate-300 focus:border-blue-500 outline-none text-xs text-slate-600 py-1 bg-transparent"
                                        value={p.note}
                                        onChange={(e) => onNoteChange(p.receiptDetailId, e.target.value)}
                                        disabled={status !== "Pending Verification"}
                                    />
                                </td>
                                <td className="p-4 text-right font-bold text-slate-900">
                                    {formatCurrency(actualTotalPrice)}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
};

export default ProductTable;