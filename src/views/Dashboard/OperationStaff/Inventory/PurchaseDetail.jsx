import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Truck, ClipboardList, Loader2, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { api } from '../../../../lib/api';

const PurchaseDetail = () => {
    const { inventoryReceiptId: id } = useParams();
    const navigate = useNavigate();

    // --- STATE QUẢN LÝ DỮ LIỆU ---
    const [orderData, setOrderData] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actualReceiveDate, setActualReceiveDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState("Pending Verification");

    // --- STATE PHÂN TRANG (12 hàng/trang) ---
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

    // Hàm dịch Status sang Tiếng Việt
    const getStatusVN = (statusEn) => {
        switch (statusEn) {
            case "Pending Verification": return "Chờ xác thực";
            case "Fully Entered": return "Đã nhập toàn bộ";
            case "Partially Entered": return "Đã nhập một phần";
            default: return statusEn;
        }
    };

    // 1. Lấy dữ liệu chi tiết từ API
    const fetchOrderDetail = () => {
        setLoading(true);
        api.get(`api/inventory-receipts/${id}`)
            .then((res) => {
                const data = res.data;
                setOrderData(data);
                setStatus(data.status);

                if (data.details) {
                    setProducts(data.details.map(d => ({
                        ...d,
                        actualQty: data.status === "Pending Verification"
                            ? d.orderedQuantity.toString()
                            : d.receivedQuantity.toString(),
                        note: d.note || ''
                    })));
                }
                setLoading(false);
            })
            .catch((err) => {
                console.error("Lỗi khi gọi API chi tiết phiếu:", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        if (id) fetchOrderDetail();
    }, [id]);

    // 2. Logic Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // 3. Tính toán sai lệch (Memoized)
    const discrepancies = useMemo(() => {
        return products
            .filter(p => {
                const actual = p.actualQty === '' ? 0 : parseInt(p.actualQty);
                return actual !== p.orderedQuantity;
            })
            .map(p => ({
                name: p.productName,
                diff: p.orderedQuantity - (p.actualQty === '' ? 0 : parseInt(p.actualQty)),
                note: p.note
            }));
    }, [products]);

    // 4. Xử lý thay đổi Input
    const handleActualQtyChange = (receiptDetailId, val) => {
        if (val === '' || /^\d+$/.test(val)) {
            setProducts(products.map(p =>
                p.receiptDetailId === receiptDetailId ? { ...p, actualQty: val } : p
            ));
        }
    };

    const handleNoteChange = (receiptDetailId, val) => {
        setProducts(products.map(p =>
            p.receiptDetailId === receiptDetailId ? { ...p, note: val } : p
        ));
    };

    const handleConfirm = () => {
        if (products.some(p => p.actualQty === '')) {
            alert("Vui lòng nhập đầy đủ số lượng thực tế cho tất cả các dòng!");
            return;
        }

        // Lọc danh sách sai lệch để Console Log và Alert
        const itemsWithDiscrepancy = products.filter(p => parseInt(p.actualQty) !== p.orderedQuantity);

        if (itemsWithDiscrepancy.length > 0) {
            console.group("--- DANH SÁCH HÀNG SAI LỆCH SỐ LƯỢNG ---");
            itemsWithDiscrepancy.forEach(p => {
                const actual = parseInt(p.actualQty);
                const diff = p.orderedQuantity - actual;
                console.log(
                    `📦 Sản phẩm: ${p.productName}\n` +
                    `❌ Sai lệch: ${diff > 0 ? `THIẾU ${diff}` : `DƯ ${Math.abs(diff)}`}\n` +
                    `📝 Ghi chú: ${p.note || "(Không có chú thích)"}`
                );
            });
            console.groupEnd();
        }

        let confirmMessage = "Bạn xác nhận hoàn tất nhập kho cho phiếu này?";
        if (itemsWithDiscrepancy.length > 0) {
            confirmMessage = "⚠️ CẢNH BÁO SAI LỆCH SỐ LƯỢNG:\n\n";
            itemsWithDiscrepancy.forEach(p => {
                const actual = parseInt(p.actualQty);
                const diff = p.orderedQuantity - actual;
                const statusText = diff > 0 ? `Thiếu ${diff}` : `Dư ${Math.abs(diff)}`;
                const noteText = p.note ? `[Ghi chú: ${p.note}]` : "[Không có ghi chú]";
                confirmMessage += `- ${p.productName}: ${statusText} ${noteText}\n`;
            });
            confirmMessage += "\nBạn vẫn muốn tiếp tục xác nhận chứ?";
        }

        if (window.confirm(confirmMessage)) {
            // Tính Total Amount thực tế
            let totalAmountActual = 0;
            const detailsPayload = products.map(p => {
                const qty = parseInt(p.actualQty);
                const lineTotal = p.unitCost * qty * (1 + p.vatRate / 100);
                totalAmountActual += lineTotal;
                return {
                    productId: p.productId,
                    receiptDetailId: p.receiptDetailId,
                    receivedQuantity: qty,
                    unitCost: p.unitCost,
                    totalPrice: lineTotal,
                    note: p.note
                };
            });

            const payload = {
                inventoryReceiptId: parseInt(id),
                totalAmount: totalAmountActual,
                details: detailsPayload
            };

            // Gọi API POST /receive
            api.put(`api/inventory-receipts/${id}/receive`, payload)
                .then(() => {
                    alert("Nhập kho thành công!");
                    fetchOrderDetail(); // Tải lại để cập nhật status mới
                })
                .catch(err => {
                    console.error(err);
                    alert("Có lỗi xảy ra khi xác nhận nhập kho.");
                });
        }
    };

    const formatCurrency = (val) => new Intl.NumberFormat('vi-VN').format(val);
    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleString('vi-VN') : "---";

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-[400px] gap-4">
                <Loader2 className="w-10 h-10 animate-spin text-blue-600" />
                <p className="text-slate-500 font-medium">Đang tải chi tiết phiếu nhập...</p>
            </div>
        );
    }

    if (!orderData) return <div className="text-center py-20 text-red-500">Không tìm thấy dữ liệu phiếu nhập.</div>;

    return (
        <main className="max-w-7xl mx-auto py-8 px-4 md:px-6 space-y-8">
            <div className="flex items-center justify-between mb-2">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-600 hover:text-blue-700 transition-colors font-semibold"
                >
                    <ArrowLeft size={20} /> Quay lại
                </button>
            </div>

            <header className="text-center mb-6">
                <h1 className="text-3xl font-extrabold text-blue-900 flex items-center justify-center gap-3 uppercase">
                    Chi Tiết Phiếu Nhập Kho
                </h1>
                <div className="h-1 w-24 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </header>

            <section className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <div className="bg-slate-50 border-b border-slate-200 px-6 py-4 flex justify-between items-center text-sm">
                    <h2 className="text-lg font-semibold text-slate-800 uppercase flex items-center gap-2">
                        <Truck className="w-5 h-5 text-blue-700" /> Thông tin nguồn cung
                    </h2>
                    <div className={`px-4 py-1.5 rounded-full font-bold text-sm shadow-sm flex items-center gap-2 
                        ${status === "Pending Verification" ? "bg-amber-100 text-amber-700 border-amber-200" : "bg-green-100 text-green-700 border-green-200"}`}>
                        {status === "Pending Verification" ? <ClipboardList className="w-4 h-4" /> : <CheckCircle className="w-4 h-4" />}
                        {getStatusVN(status).toUpperCase()}
                    </div>
                </div>

                <div className="p-6 text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6">
                        <div className="space-y-4">
                            <p><span className="text-slate-500 font-medium">Nhà cung cấp:</span> <span className="font-bold ml-2 text-slate-800">{orderData.supplierName}</span></p>
                            <p><span className="text-slate-500 font-medium">Số điện thoại:</span> <span className="ml-2 text-slate-800">{orderData.supplierPhone}</span></p>
                            <p><span className="text-slate-500 font-medium">Địa chỉ:</span> <span className="ml-2 text-slate-800">{orderData.supplierAddress}</span></p>
                        </div>
                        <div className="space-y-4 border-l border-slate-100 pl-8">
                            <p><span className="text-slate-500 font-medium font-bold text-blue-800 uppercase">Mã phiếu:</span> <span className="font-mono text-blue-700 font-bold ml-2">{orderData.receiptCode}</span></p>
                            <p><span className="text-slate-500 font-medium">Ngày đặt đơn:</span> <span className="ml-2 text-slate-800">{formatDate(orderData.orderDate)}</span></p>
                            <div className="flex items-center gap-2">
                                <span className="text-blue-700 font-bold uppercase text-[12px]">Ngày nhận thực tế:</span>
                                <input
                                    type="date"
                                    className="ml-2 border-slate-300 rounded-md text-sm font-semibold py-1 px-2 focus:ring-blue-500 outline-none border bg-white"
                                    value={actualReceiveDate}
                                    onChange={(e) => setActualReceiveDate(e.target.value)}
                                    disabled={status !== "Pending Verification"}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* BẢNG SẢN PHẨM */}
                <div className="overflow-x-auto border-t">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-[#1e40af] text-white">
                                <th className="p-4 uppercase text-[0.7rem] font-semibold text-center w-12">STT</th>
                                <th className="p-4 uppercase text-[0.7rem] font-semibold text-left">Sản phẩm</th>
                                <th className="p-4 uppercase text-[0.7rem] font-semibold text-right">Giá nhập</th>
                                <th className="p-4 uppercase text-[0.7rem] font-semibold text-center">VAT</th>
                                <th className="p-4 uppercase text-[0.7rem] font-semibold text-center">Dự kiến</th>
                                <th className="p-4 uppercase text-[0.7rem] font-semibold text-right">Thành tiền (DK)</th>
                                <th className="p-4 uppercase text-[0.7rem] font-semibold text-center bg-blue-700 w-24">Thực tế *</th>
                                <th className="p-4 uppercase text-[0.7rem] font-semibold text-left">Ghi chú</th>
                                <th className="p-4 uppercase text-[0.7rem] font-semibold text-right">Thành tiền (TT)</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-200">
                            {currentItems.map((p, idx) => {
                                const actual = p.actualQty === '' ? 0 : parseInt(p.actualQty);
                                const isMismatch = status === "Pending Verification" && actual !== p.orderedQuantity;
                                const actualTotalPrice = p.unitCost * actual * (1 + p.vatRate / 100);

                                return (
                                    <tr key={p.receiptDetailId} className="hover:bg-slate-50 transition-colors">
                                        <td className="p-4 text-center font-medium text-slate-400">{indexOfFirstItem + idx + 1}</td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <img src={p.productImage} alt={p.productName} className="w-10 h-10 rounded shadow-sm border object-cover" />
                                                <div className="font-semibold text-slate-600 max-w-[200px] truncate">{p.productName}</div>
                                            </div>
                                        </td>
                                        <td className="p-4 text-right font-mono text-slate-500">{formatCurrency(p.unitCost)}</td>
                                        <td className="p-4 text-center text-slate-500 font-medium">{p.vatRate}%</td>
                                        <td className="p-4 text-center font-bold text-slate-400">{p.orderedQuantity}</td>
                                        <td className="p-4 text-right italic text-slate-400 font-mono">{formatCurrency(p.totalPrice)}</td>
                                        <td className="p-4 bg-blue-50/50 text-center">
                                            <input
                                                type="text"
                                                className={`w-full text-center font-bold rounded border py-1.5 bg-white
                                                    ${isMismatch ? 'border-red-500 bg-red-50 text-red-600' : 'border-slate-300 focus:ring-2 focus:ring-blue-500'}`}
                                                value={p.actualQty}
                                                onChange={(e) => handleActualQtyChange(p.receiptDetailId, e.target.value)}
                                                disabled={status !== "Pending Verification"}
                                            />
                                        </td>
                                        <td className="p-4">
                                            <input
                                                type="text"
                                                placeholder="..."
                                                className="w-full border-b border-dashed border-slate-300 focus:border-blue-500 outline-none text-xs text-slate-600 py-1 bg-transparent"
                                                value={p.note}
                                                onChange={(e) => handleNoteChange(p.receiptDetailId, e.target.value)}
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
                        <tfoot className="bg-blue-50">
                            <tr>
                                <td className="p-4 text-right font-semibold text-slate-500 text-xs uppercase" colSpan="5">Dự kiến tổng đơn:</td>
                                <td className="p-4 text-right font-bold text-slate-600">{formatCurrency(orderData.totalAmount)}</td>
                                <td className="p-4 text-right font-bold text-blue-900 text-sm uppercase" colSpan="2">Thực tế nhập kho:</td>
                                <td className="p-4 text-right font-extrabold text-blue-900 text-xl tracking-tight">
                                    {formatCurrency(products.reduce((s, p) => s + (p.unitCost * (p.actualQty === '' ? 0 : parseInt(p.actualQty)) * (1 + p.vatRate / 100)), 0))}
                                    <span className="text-[10px] ml-1">VNĐ</span>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>

                {/* PHÂN TRANG */}
                {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-4 p-4 border-t bg-slate-50">
                        <button onClick={() => setCurrentPage(p => Math.max(p - 1, 1))} disabled={currentPage === 1} className="p-1 disabled:opacity-30 border rounded bg-white hover:bg-slate-100"><ChevronLeft size={16} /></button>
                        <span className="text-xs font-bold">Trang {currentPage} / {totalPages}</span>
                        <button onClick={() => setCurrentPage(p => Math.min(p + 1, totalPages))} disabled={currentPage === totalPages} className="p-1 disabled:opacity-30 border rounded bg-white hover:bg-slate-100"><ChevronRight size={16} /></button>
                    </div>
                )}

                {/* THÔNG BÁO SAI LỆCH VÀ NÚT XÁC NHẬN */}
                <div className="p-6 space-y-6">
                    {discrepancies.length > 0 && status === "Pending Verification" && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded flex items-start gap-3">
                            <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
                            <div>
                                <h3 className="text-red-800 font-bold text-xs uppercase tracking-widest">Phát hiện sai lệch hàng hóa:</h3>
                                <ul className="text-[11px] text-red-600 mt-1 list-disc ml-5 font-bold space-y-1">
                                    {discrepancies.map((d, i) => (
                                        <li key={i}><strong>{d.name}</strong>: {d.diff > 0 ? `Thiếu ${d.diff}` : `Dư ${Math.abs(d.diff)}`} đơn vị.</li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col items-center pb-6">
                        {status === "Pending Verification" ? (
                            <button
                                className="py-4 px-24 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-xl transition-all transform active:scale-95 flex items-center gap-3"
                                onClick={handleConfirm}
                            >
                                <CheckCircle className="w-6 h-6" /> XÁC NHẬN NHẬP KHO
                            </button>
                        ) : (
                            <div className="text-center space-y-4">
                                <div className={`p-4 rounded-lg border font-bold ${status === "Fully Entered" ? "bg-green-50 text-green-700 border-green-200" : "bg-blue-50 text-blue-700 border-blue-200"}`}>
                                    PHIẾU ĐÃ ĐƯỢC XỬ LÝ: {getStatusVN(status).toUpperCase()}
                                </div>
                                <button
                                    className="text-blue-600 hover:underline font-medium"
                                    onClick={() => navigate('/operation-staff/purchase-list')}
                                >
                                    Quay lại danh sách phiếu nhập
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </section>
        </main>
    );
};

export default PurchaseDetail;