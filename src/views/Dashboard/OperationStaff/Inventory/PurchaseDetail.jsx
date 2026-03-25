import React, { useState, useMemo, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CheckCircle, AlertCircle, Loader2, ArrowLeft } from 'lucide-react';
import { api } from '../../../../lib/api';

// Import các component con
import OrderHeader from './OrderHeader';
import ProductTable from './ProductTable';
import Pagination from './Pagination';

const PurchaseDetail = () => {
    const { inventoryReceiptId: id } = useParams();
    const navigate = useNavigate();

    const [orderData, setOrderData] = useState(null);
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [actualReceiveDate, setActualReceiveDate] = useState(new Date().toISOString().split('T')[0]);
    const [status, setStatus] = useState("Pending Verification");
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 12;

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
                        actualQty: data.status === "Pending Verification" ? d.orderedQuantity.toString() : d.receivedQuantity.toString(),
                        note: d.note || ''
                    })));
                }
                setLoading(false);
            })
            .catch(() => setLoading(false));
    };

    useEffect(() => { if (id) fetchOrderDetail(); }, [id]);

    // Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = products.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(products.length / itemsPerPage);

    // Tính toán sai lệch
    const discrepancies = useMemo(() => {
        return products.filter(p => parseInt(p.actualQty || 0) !== p.orderedQuantity)
            .map(p => ({ name: p.productName, diff: p.orderedQuantity - parseInt(p.actualQty || 0) }));
    }, [products]);

    // Tổng tiền thực tế
    const totalActualAmount = useMemo(() => {
        return products.reduce((s, p) => s + (p.unitCost * parseInt(p.actualQty || 0) * (1 + p.vatRate / 100)), 0);
    }, [products]);

    const handleActualQtyChange = (receiptDetailId, val) => {
        if (val === '' || /^\d+$/.test(val)) {
            setProducts(products.map(p => p.receiptDetailId === receiptDetailId ? { ...p, actualQty: val } : p));
        }
    };

    const handleNoteChange = (receiptDetailId, val) => {
        setProducts(products.map(p => p.receiptDetailId === receiptDetailId ? { ...p, note: val } : p));
    };

    const handleConfirm = () => {
        if (products.some(p => p.actualQty === '')) {
            alert("Vui lòng nhập đầy đủ số lượng!");
            return;
        }
        if (window.confirm("Xác nhận nhập kho phiếu này?")) {
            const payload = {
                inventoryReceiptId: parseInt(id),
                totalAmount: totalActualAmount,
                details: products.map(p => ({
                    productId: p.productId,
                    receiptDetailId: p.receiptDetailId,
                    receivedQuantity: parseInt(p.actualQty),
                    unitCost: p.unitCost,
                    totalPrice: p.unitCost * parseInt(p.actualQty) * (1 + p.vatRate / 100),
                    note: p.note
                }))
            };
            api.put(`api/inventory-receipts/${id}/receive`, payload)
                .then(() => { alert("Thành công!"); fetchOrderDetail(); })
                .catch(() => alert("Lỗi xác nhận!"));
        }
    };

    const formatCurrency = (val) => new Intl.NumberFormat('vi-VN').format(val);
    const formatDate = (dateStr) => dateStr ? new Date(dateStr).toLocaleString('vi-VN') : "---";
    const getStatusVN = (s) => s === "Pending Verification" ? "Chờ xác thực" : (s === "Fully Entered" ? "Đã nhập toàn bộ" : "Đã nhập một phần");

    if (loading) return <div className="flex flex-col items-center justify-center min-h-[400px]"><Loader2 className="animate-spin text-blue-600" /></div>;
    if (!orderData) return <div className="text-center py-20 text-red-500">Không tìm thấy dữ liệu.</div>;

    return (
        <main className="max-w-7xl mx-auto py-8 px-4 space-y-6">
            <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-600 hover:text-blue-700 font-semibold transition-colors">
                <ArrowLeft size={20} /> Quay lại
            </button>

            <header className="text-center">
                <h1 className="text-3xl font-extrabold text-blue-900 uppercase">Chi Tiết Phiếu Nhập Kho</h1>
                <div className="h-1 w-24 bg-blue-600 mx-auto mt-4 rounded-full"></div>
            </header>

            <OrderHeader
                orderData={orderData} status={status} actualReceiveDate={actualReceiveDate}
                setActualReceiveDate={setActualReceiveDate} getStatusVN={getStatusVN} formatDate={formatDate}
            />

            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                <ProductTable
                    products={currentItems} status={status} onQtyChange={handleActualQtyChange}
                    onNoteChange={handleNoteChange} formatCurrency={formatCurrency} startIndex={indexOfFirstItem}
                />

                <div className="p-4 bg-blue-50 border-t flex justify-end items-center gap-4">
                    <span className="text-blue-900 font-bold uppercase text-xs">Tổng thực tế nhập kho:</span>
                    <span className="text-xl font-extrabold text-blue-900">{formatCurrency(totalActualAmount)} VNĐ</span>
                </div>

                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />

                <div className="p-8 space-y-6">
                    {discrepancies.length > 0 && status === "Pending Verification" && (
                        <div className="bg-red-50 border-l-4 border-red-500 p-4 flex gap-3">
                            <AlertCircle className="text-red-500 shrink-0" />
                            <div>
                                <p className="text-red-800 font-bold text-xs uppercase">Cảnh báo sai lệch:</p>
                                <ul className="text-[11px] text-red-600 font-bold list-disc ml-4 mt-1">
                                    {discrepancies.map((d, i) => <li key={i}>{d.name}: {d.diff > 0 ? `Thiếu ${d.diff}` : `Dư ${Math.abs(d.diff)}`}</li>)}
                                </ul>
                            </div>
                        </div>
                    )}

                    <div className="flex justify-center">
                        {status === "Pending Verification" ? (
                            <button onClick={handleConfirm} className="py-4 px-20 bg-blue-700 hover:bg-blue-800 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 flex gap-3">
                                <CheckCircle /> XÁC NHẬN NHẬP KHO
                            </button>
                        ) : (
                            <div className="text-center font-bold text-green-700 bg-green-50 p-4 rounded-lg border border-green-200 uppercase">
                                Phiếu này đã hoàn tất xử lý
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </main>
    );
};

export default PurchaseDetail;