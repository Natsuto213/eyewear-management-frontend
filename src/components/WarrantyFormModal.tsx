import React, { useState, useMemo, useEffect } from 'react';
import { ShieldAlert, X, Upload, Plus, Minus, Image as ImageIcon, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';

import { api } from "@/lib/api";
import { Popup } from "@/components/Popup";

const formatCurrency = (v: number) =>
    v?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

interface WarrantyFormModalProps {
    isOpen: boolean;
    onClose: () => void;
    order: any;
}

export default function WarrantyFormModal({ isOpen, onClose, order }: WarrantyFormModalProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [popup, setPopup] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'error' });
    
    // STATE LƯU LỖI ĐỂ HIỂN THỊ TRÊN FORM
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    // FORM STATE
    const [form, setForm] = useState({
        returnType: 'WARRANTY',
        requestScope: 'ITEM',
        returnReason: '',
        refundMethod: '',
        refundAccountNumber: '',
        refundAccountName: '',
        requestNote: ''
    });

    const [selectedItems, setSelectedItems] = useState<Record<number, any>>({});

    const showCustomPopup = (message: string, type: 'success' | 'error', title: string = '') => {
        setPopup({ isOpen: true, title, message, type });
    };

    // GỘP CHUNG SẢN PHẨM ĐỂ HIỂN THỊ
    const unifiedProducts = useMemo(() => {
        if (!order) return [];
        const items: any[] = [];
        
        if (order.orderDetail) {
            order.orderDetail.forEach((item: any) => {
                items.push({
                    id: item.orderDetailId,
                    name: item.productName,
                    price: item.unitPrice,
                    maxQty: item.quantity,
                    img: item.imageUrl,
                    type: 'NORMAL'
                });
            });
        }
        
        if (order.prescriptionOrderDetail) {
            order.prescriptionOrderDetail.forEach((item: any) => {
                items.push({
                    id: item.prescriptionOrderDetailId,
                    name: `${item.frameName} + ${item.lensName || 'Tròng'}`,
                    price: item.totalPrice / item.quantity,
                    maxQty: item.quantity,
                    img: item.frameImg || item.lensImg,
                    type: 'PRESCRIPTION'
                });
            });
        }
        return items;
    }, [order]);

    // RESET DỮ LIỆU KHI MỞ MODAL
    useEffect(() => {
        if (isOpen && unifiedProducts.length > 0) {
            const initialItems: Record<number, any> = {};
            unifiedProducts.forEach(p => {
                initialItems[p.id] = { selected: false, qty: 1, maxQty: p.maxQty, reason: '', note: '', file: null, preview: null };
            });
            setSelectedItems(initialItems);
            setForm({ returnType: 'WARRANTY', requestScope: 'ITEM', returnReason: '', refundMethod: '', refundAccountNumber: '', refundAccountName: '', requestNote: '' });
            setErrorMsg(null); // Xóa lỗi cũ khi mở lại modal
        }
    }, [isOpen, unifiedProducts]);

    const handleFormChange = (field: string, value: string) => {
        setErrorMsg(null); // Khách đang sửa form thì ẩn thông báo lỗi đi
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleItemToggle = (id: number) => {
        setErrorMsg(null); // Khách đang click chọn lại item thì ẩn thông báo lỗi
        setSelectedItems(prev => ({
            ...prev, [id]: { ...prev[id], selected: !prev[id].selected }
        }));
    };

    const handleItemDataChange = (id: number, field: string, value: any) => {
        setErrorMsg(null);
        setSelectedItems(prev => ({
            ...prev, [id]: { ...prev[id], [field]: value }
        }));
    };

    const handleItemImageUpload = (id: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setErrorMsg(null);
        if (selectedItems[id].preview) URL.revokeObjectURL(selectedItems[id].preview);
        const preview = URL.createObjectURL(file);
        handleItemDataChange(id, 'file', file);
        handleItemDataChange(id, 'preview', preview);
    };

    // ── GỌI API TRỰC TIẾP KHI BẤM NÚT GỬI ──
    const submitWarrantyRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null); // Reset lỗi trước khi check lại
        
        // Validate và set lỗi hiển thị lên form thay vì dùng toast
        if (!form.returnReason.trim()) { 
            setErrorMsg("Vui lòng nhập lý do chung!"); 
            return; 
        }
        if (form.returnType === 'RETURN' || form.returnType === 'REFUND') {
            if (!form.refundMethod || !form.refundAccountNumber || !form.refundAccountName) {
                setErrorMsg("Vui lòng điền đầy đủ thông tin ngân hàng nhận tiền hoàn!"); 
                return;
            }
        }

        const selectedArray = Object.entries(selectedItems).filter(([_, data]) => data.selected);
        if (form.requestScope === 'ITEM' && selectedArray.length === 0) {
            setErrorMsg("Vui lòng chọn ít nhất 1 sản phẩm cần đổi trả!"); 
            return;
        }

        setIsSubmitting(true);
        
        try {
            const formData = new FormData();
            
            const requestPayload: any = {
                orderId: order.orderId,
                returnType: form.returnType,
                requestScope: form.requestScope,
                returnReason: form.returnReason,
                requestNote: form.requestNote || null,
                refundMethod: (form.returnType === 'RETURN' || form.returnType === 'REFUND') ? form.refundMethod : null,
                refundAccountNumber: (form.returnType === 'RETURN' || form.returnType === 'REFUND') ? form.refundAccountNumber : null,
                refundAccountName: (form.returnType === 'RETURN' || form.returnType === 'REFUND') ? form.refundAccountName : null,
                items: []
            };

            if (form.requestScope === 'ITEM') {
                selectedArray.forEach(([id, itemData]) => {
                    requestPayload.items.push({
                        orderDetailId: Number(id),
                        quantity: itemData.qty,
                        itemReason: itemData.reason || null,
                        note: itemData.note || null
                    });
                    if (itemData.file) {
                        formData.append('itemImages', itemData.file as Blob);
                    }
                });
            }

            formData.append('request', new Blob([JSON.stringify(requestPayload)], {
                type: "application/json"
            }));

            await api.post('/api/return-exchanges', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            showCustomPopup("Yêu cầu của bạn đã được gửi và đang chờ xử lý.", "success", "Gửi đơn thành công!");
            
            // Đợi 2s cho user đọc thông báo rồi tắt modal
            setTimeout(() => {
                onClose();
            }, 2000);

        } catch (error: any) {
            console.error('Submit error:', error);
            const backendErrorMsg = error.response?.data?.message || error.response?.data?.result || 'Có lỗi xảy ra từ máy chủ. Vui lòng kiểm tra lại thông tin!';
            showCustomPopup(backendErrorMsg, "error", "Gửi yêu cầu thất bại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 overflow-y-auto">
                <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl overflow-hidden my-auto animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col relative">
                    
                    {/* Header Modal */}
                    <div className="bg-teal-600 text-white px-6 py-4 flex justify-between items-center sticky top-0 z-10 shrink-0">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <ShieldAlert className="w-5 h-5" /> 
                            Lập Phiếu Yêu Cầu Hỗ Trợ
                        </h2>
                        <button onClick={onClose} disabled={isSubmitting} className="p-1 hover:bg-teal-500 rounded-full transition disabled:opacity-50">
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Body Modal (Cuộn được) */}
                    <div className="p-6 overflow-y-auto space-y-6 flex-1 bg-gray-50">
                        
                        {/* THÔNG BÁO LỖI (CHỈ HIỆN KHI CÓ LỖI) */}
                        {errorMsg && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 rounded-r-xl shadow-sm flex items-center gap-3 animate-in fade-in slide-in-from-top-2">
                                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                                <p className="text-sm font-bold text-red-700">{errorMsg}</p>
                            </div>
                        )}

                        {/* NHÓM 1: THÔNG TIN CHUNG */}
                        <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                            <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">1. Thông tin yêu cầu</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Mã đơn hàng</label>
                                    <input type="text" disabled value={order.orderCode} className="w-full bg-gray-100 border border-gray-200 rounded-lg text-sm py-2 px-3 text-gray-500 font-mono" />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Phạm vi áp dụng <span className="text-red-500">*</span></label>
                                    <select value={form.requestScope} onChange={(e) => handleFormChange('requestScope', e.target.value)} className="w-full border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500">
                                        <option value="ITEM">Chỉ vài món lẻ</option>
                                        <option value="ORDER">Toàn bộ đơn hàng</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-gray-700 mb-1">Loại yêu cầu <span className="text-red-500">*</span></label>
                                    <select value={form.returnType} onChange={(e) => handleFormChange('returnType', e.target.value)} className="w-full border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500">
                                        <option value="WARRANTY">Bảo Hành</option>
                                        <option value="RETURN">Trả Hàng</option>
                                        <option value="REFUND">Hoàn Tiền</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Lý do chung <span className="text-red-500">*</span></label>
                                <textarea value={form.returnReason} onChange={(e) => handleFormChange('returnReason', e.target.value)} placeholder="Vui lòng mô tả ngắn gọn lý do bạn muốn hỗ trợ..." rows={3} className="w-full border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 resize-none"/>
                            </div>
                        </section>

                        {/* NHÓM 2: THÔNG TIN NGÂN HÀNG */}
                        {(form.returnType === 'RETURN' || form.returnType === 'REFUND') && (
                            <section className="bg-orange-50 p-5 rounded-xl border border-orange-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
                                <h3 className="font-bold text-orange-800 border-b border-orange-200/50 pb-2">2. Thông tin nhận tiền hoàn</h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-semibold text-orange-900 mb-1">Tên Ngân hàng / Ví điện tử <span className="text-red-500">*</span></label>
                                        <input type="text" value={form.refundMethod} onChange={(e) => handleFormChange('refundMethod', e.target.value)} placeholder="VD: Vietcombank, Momo..." className="w-full border border-orange-300 rounded-lg text-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"/>
                                    </div>
                                    <div>
                                        <label className="block text-sm font-semibold text-orange-900 mb-1">Số tài khoản / SĐT <span className="text-red-500">*</span></label>
                                        <input type="text" value={form.refundAccountNumber} onChange={(e) => handleFormChange('refundAccountNumber', e.target.value)} className="w-full border border-orange-300 rounded-lg text-sm py-2 px-3 focus:ring-orange-500 focus:border-orange-500"/>
                                    </div>
                                    <div className="md:col-span-2">
                                        <label className="block text-sm font-semibold text-orange-900 mb-1">Tên chủ tài khoản <span className="text-red-500">*</span></label>
                                        <input type="text" value={form.refundAccountName} onChange={(e) => handleFormChange('refundAccountName', e.target.value.toUpperCase())} placeholder="NGUYEN VAN A" className="w-full border border-orange-300 rounded-lg text-sm py-2 px-3 uppercase focus:ring-orange-500 focus:border-orange-500"/>
                                    </div>
                                </div>
                            </section>
                        )}

                        {/* NHÓM 3: CHỌN SẢN PHẨM */}
                        {form.requestScope === 'ITEM' && (
                            <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-4">
                                <h3 className="font-bold text-gray-800 border-b border-gray-100 pb-2">3. Chọn sản phẩm cần hỗ trợ</h3>
                                <div className="space-y-3">
                                    {unifiedProducts.map(p => {
                                        const isSelected = selectedItems[p.id]?.selected;
                                        const itemState = selectedItems[p.id];
                                        return (
                                            <div key={p.id} className={`border rounded-xl transition-all overflow-hidden ${isSelected ? 'border-teal-400 bg-teal-50/20 shadow-sm ring-1 ring-teal-400' : 'border-gray-200 hover:border-gray-300'}`}>
                                                <div className="flex items-center gap-4 p-3 cursor-pointer" onClick={() => handleItemToggle(p.id)}>
                                                    <div className="pl-2">
                                                        <input type="checkbox" checked={isSelected} readOnly className="w-5 h-5 text-teal-600 rounded border-gray-300 focus:ring-teal-500 cursor-pointer" />
                                                    </div>
                                                    <img src={p.img} alt={p.name} className="w-14 h-14 rounded-lg object-cover border border-gray-200 shrink-0" />
                                                    <div className="flex-1 min-w-0">
                                                        <div className="font-semibold text-gray-900 text-sm truncate">{p.name}</div>
                                                        <div className="text-xs text-gray-500 mt-0.5">Đã mua: {p.maxQty}</div>
                                                    </div>
                                                    <div className="font-bold text-sm text-gray-900 pr-2">
                                                        {formatCurrency(p.price)}
                                                    </div>
                                                </div>

                                                {isSelected && (
                                                    <div className="border-t border-teal-100 bg-white p-4 space-y-4 animate-in slide-in-from-top-1">
                                                        <div className="flex items-center gap-4">
                                                            <label className="text-sm font-semibold text-gray-700 w-32 shrink-0">Số lượng bị lỗi:</label>
                                                            <div className="flex items-center justify-center bg-white border border-gray-300 rounded-lg overflow-hidden h-9">
                                                                <button type="button" onClick={() => handleItemDataChange(p.id, 'qty', Math.max(1, itemState.qty - 1))} className="p-2 px-3 text-gray-500 hover:bg-gray-100 transition-colors disabled:opacity-30"><Minus className="w-3.5 h-3.5" /></button>
                                                                <input type="text" readOnly value={itemState.qty} className="w-10 text-center font-bold text-teal-700 border-none p-1 text-sm focus:ring-0" />
                                                                <button type="button" onClick={() => handleItemDataChange(p.id, 'qty', Math.min(p.maxQty, itemState.qty + 1))} className="p-2 px-3 text-gray-500 hover:bg-gray-100 transition-colors"><Plus className="w-3.5 h-3.5" /></button>
                                                            </div>
                                                        </div>

                                                        <div className="flex flex-col md:flex-row gap-4 items-start">
                                                            <div className="flex-1 w-full space-y-3">
                                                                <div>
                                                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Lý do chi tiết</label>
                                                                    <input type="text" value={itemState.reason} onChange={(e) => handleItemDataChange(p.id, 'reason', e.target.value)} placeholder="VD: Gọng bị xước, tròng bị mờ..." className="w-full border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
                                                                </div>
                                                                <div>
                                                                    <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase">Ghi chú thêm</label>
                                                                    <input type="text" value={itemState.note} onChange={(e) => handleItemDataChange(p.id, 'note', e.target.value)} placeholder="Ghi chú thêm (Nếu có)" className="w-full border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500" />
                                                                </div>
                                                            </div>
                                                            <div className="w-full md:w-32 shrink-0">
                                                                <label className="block text-xs font-semibold text-gray-500 mb-1 uppercase text-center">Ảnh minh chứng</label>
                                                                {!itemState.preview ? (
                                                                    <label className="w-full h-24 border-2 border-dashed border-teal-300 rounded-xl flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 transition-colors text-teal-600">
                                                                        <ImageIcon className="w-5 h-5 mb-1 opacity-50" />
                                                                        <span className="text-[10px] font-bold">Tải ảnh lên</span>
                                                                        <input type="file" accept="image/*" onChange={(e) => handleItemImageUpload(p.id, e)} className="hidden" />
                                                                    </label>
                                                                ) : (
                                                                    <div className="relative w-full h-24 group">
                                                                        <img src={itemState.preview} alt="Preview" className="w-full h-full object-cover rounded-xl border border-teal-200 shadow-sm" />
                                                                        <button type="button" onClick={() => {
                                                                            URL.revokeObjectURL(itemState.preview);
                                                                            handleItemDataChange(p.id, 'file', null);
                                                                            handleItemDataChange(p.id, 'preview', null);
                                                                        }} className="absolute -top-2 -right-2 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md">
                                                                            <X className="w-3 h-3" />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            </section>
                        )}

                        {/* NHÓM 4: GHI CHÚ CHUNG */}
                        <section className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm space-y-2">
                            <label className="block font-bold text-gray-800">Ghi chú cho cửa hàng (Tùy chọn)</label>
                            <textarea value={form.requestNote} onChange={(e) => handleFormChange('requestNote', e.target.value)} placeholder="Lời nhắn nhủ thêm của bạn..." rows={2} className="w-full border border-gray-300 rounded-lg text-sm py-2 px-3 focus:ring-teal-500 focus:border-teal-500 resize-none"/>
                        </section>
                    </div>

                    {/* Footer Modal */}
                    <div className="bg-white border-t border-gray-200 p-4 shrink-0 flex justify-end gap-3">
                        <button type="button" onClick={onClose} disabled={isSubmitting} className="px-5 py-2.5 rounded-xl font-bold text-gray-600 bg-gray-100 hover:bg-gray-200 transition-colors disabled:opacity-50">
                            Hủy bỏ
                        </button>
                        <button onClick={submitWarrantyRequest} disabled={isSubmitting} className="px-6 py-2.5 rounded-xl font-bold text-white bg-teal-600 hover:bg-teal-700 transition-all flex items-center gap-2 shadow-md hover:shadow-lg disabled:opacity-50">
                            {isSubmitting ? <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span> : <Upload className="w-4 h-4" />}
                            Gửi yêu cầu
                        </button>
                    </div>
                </div>
            </div>

            {/* Gọi Component Popup ra để dùng */}
            <Popup 
                isOpen={popup.isOpen} 
                title={popup.title}
                message={popup.message} 
                type={popup.type} 
                onClose={() => setPopup({ ...popup, isOpen: false })} 
            />
        </>
    );
}