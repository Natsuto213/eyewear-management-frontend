// src/components/WarrantyForm.tsx (Hoặc đường dẫn tùy bạn chọn)
import React, { useState } from 'react';
import { X, Upload } from 'lucide-react';
import { toast } from 'sonner';

import LoginPopup from "@/views/Cart/components/LoginPopup"; 
import { Popup } from "@/components/Popup"; 
import { api } from "@/lib/api";

export default function WarrantyForm() {
    const [orderDetailId, setOrderDetailId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [requestType, setRequestType] = useState<string>('WARRANTY'); 
    const [description, setDescription] = useState('');
    
    const [refundMethod, setRefundMethod] = useState(''); 
    const [refundAccountNumber, setRefundAccountNumber] = useState('');

    // Hình minh chứng
    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Hình QR Code
    const [qrImage, setQrImage] = useState<File | null>(null);
    const [qrImagePreview, setQrImagePreview] = useState<string | null>(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const [popup, setPopup] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'error' });

    const showPopup = (message: string, type: 'success' | 'error', title: string = '') => {
        setPopup({ isOpen: true, title, message, type });
    };

    const isImageEmpty = !imagePreview;

    // ----- XỬ LÝ ẢNH -----
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        if (files.length > 1) toast.error("Vui lòng chỉ chọn 1 hình ảnh duy nhất để minh chứng!");

        const file = files[0];
        if (imagePreview) URL.revokeObjectURL(imagePreview);

        const newPreview = URL.createObjectURL(file);
        setImage(file);
        setImagePreview(newPreview);
    };

    const removeImage = () => {
        if (imagePreview) URL.revokeObjectURL(imagePreview);
        setImage(null);
        setImagePreview(null);
    };

    const handleQrImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;
        if (files.length > 1) toast.error("Vui lòng chỉ tải lên 1 hình QR Code!");

        const file = files[0];
        if (qrImagePreview) URL.revokeObjectURL(qrImagePreview);

        const newPreview = URL.createObjectURL(file);
        setQrImage(file);
        setQrImagePreview(newPreview);
    };

    const removeQrImage = () => {
        if (qrImagePreview) URL.revokeObjectURL(qrImagePreview);
        setQrImage(null);
        setQrImagePreview(null);
    };

    // ----- SUBMIT FORM -----
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem("access_token");
        if (!token) {
            setShowLoginPopup(true);
            return;
        }

        if (orderDetailId === '' || orderDetailId <= 0) {
            toast.error('Vui lòng nhập ID chi tiết đơn hàng hợp lệ');
            return;
        }
        if (quantity <= 0) {
            toast.error('Số lượng phải lớn hơn 0');
            return;
        }
        if (requestType === 'RETURN') {
            if (!refundMethod.trim()) {
                toast.error('Vui lòng nhập phương thức hoàn tiền (VD: MoMo, Vietcombank...)');
                return;
            }
            if (!refundAccountNumber.trim()) {
                toast.error('Vui lòng nhập số tài khoản / số điện thoại nhận tiền');
                return;
            }
        }
        if (!description.trim()) {
            toast.error('Vui lòng nhập lý do (mô tả)');
            return;
        }
        if (isImageEmpty) {
            toast.error("Vui lòng tải lên 1 hình ảnh để minh chứng!");
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            
            formData.append('orderDetailId', orderDetailId.toString());
            formData.append('quantity', quantity.toString());
            formData.append('returnReason', description);
            formData.append('returnType', requestType); 

            if (requestType === 'RETURN') {
                formData.append('refundMethod', refundMethod);
                formData.append('refundAccountNumber', refundAccountNumber);
                if (qrImage) {
                    formData.append('qrCodeImage', qrImage as Blob); 
                }
            }

            formData.append('image', image as Blob);

            await api.post('/api/return-exchanges', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            showPopup("Yêu cầu của bạn đã được gửi và đang chờ xử lý.", "success", "Gửi đơn thành công!");
            
            // Reset form
            setOrderDetailId('');
            setQuantity(1);
            setRequestType('WARRANTY');
            setRefundMethod('');
            setRefundAccountNumber('');
            setDescription('');
            removeImage();
            removeQrImage();

        } catch (error: any) {
            console.error('Error submitting warranty request:', error);
            const backendErrorMsg = error.response?.data?.message || error.response?.data?.result || 'Có lỗi xảy ra từ máy chủ. Vui lòng kiểm tra lại thông tin!';
            showPopup(backendErrorMsg, "error", "Gửi yêu cầu thất bại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6 w-full">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin yêu cầu</h2>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="md:col-span-2">
                        <label className="block text-gray-700 font-medium mb-2">Mã chi tiết đơn hàng (ID) <span className="text-red-500">*</span></label>
                        <input type="number" min="1" value={orderDetailId} onChange={(e) => setOrderDetailId(Number(e.target.value))} placeholder="Ví dụ: 1024" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" required />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-gray-700 font-medium mb-2">Số lượng <span className="text-red-500">*</span></label>
                        <input type="number" min="1" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" required />
                    </div>

                    <div className="md:col-span-1">
                        <label className="block text-gray-700 font-medium mb-2">Yêu cầu <span className="text-red-500">*</span></label>
                        <select value={requestType} onChange={(e) => setRequestType(e.target.value)} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white" required>
                            <option value="WARRANTY">Bảo hành</option>
                            <option value="RETURN">Đổi trả</option>
                        </select>
                    </div>
                </div>

                {requestType === 'RETURN' && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Phương thức hoàn tiền <span className="text-red-500">*</span></label>
                            <input type="text" value={refundMethod} onChange={(e) => setRefundMethod(e.target.value)} placeholder="VD: MoMo, Vietcombank..." className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white" required={requestType === 'RETURN'} />
                        </div>
                        <div>
                            <label className="block text-gray-700 font-medium mb-2">Số tài khoản / SĐT <span className="text-red-500">*</span></label>
                            <input type="text" value={refundAccountNumber} onChange={(e) => setRefundAccountNumber(e.target.value)} placeholder="Nhập số tài khoản / SĐT ví" className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors" required={requestType === 'RETURN'} />
                        </div>
                        
                        <div className="md:col-span-2 pt-2 border-t border-gray-200 mt-2">
                            <label className="block text-gray-700 font-medium mb-2">Ảnh QR Code tài khoản (Tùy chọn)</label>
                            <div className="flex flex-wrap gap-3 items-start">
                                {!qrImagePreview && (
                                    <label className="w-24 h-24 shrink-0 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500">
                                        <Upload className="h-5 w-5 mb-1" />
                                        <span className="text-[10px] font-medium text-center px-1">Tải ảnh QR</span>
                                        <input type="file" accept="image/*" onChange={handleQrImageUpload} className="hidden" />
                                    </label>
                                )}

                                {qrImagePreview && (
                                    <div className="relative group w-24 h-24">
                                        <img src={qrImagePreview} alt="QR Preview" className="w-full h-full object-cover rounded-xl border-2 border-blue-200 shadow-sm" />
                                        <button type="button" onClick={removeQrImage} className="absolute top-1 right-1 p-1 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md opacity-0 group-hover:opacity-100">
                                            <X className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Lý do <span className="text-red-500">*</span></label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Mô tả chi tiết vấn đề của sản phẩm..." rows={6} className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none" required />
                </div>

                <div>
                    <label className="block text-gray-700 font-medium mb-2">Thêm hình ảnh minh chứng (Chỉ 1 ảnh) <span className="text-red-500">*</span></label>
                    <div className="flex flex-wrap gap-3 items-start">
                        {!imagePreview && (
                            <label className={`w-32 h-32 shrink-0 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors ${isImageEmpty ? 'border-red-400 bg-red-50 text-red-500 hover:border-red-500 hover:bg-red-100' : 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500'}`}>
                                <Upload className="h-6 w-6 mb-2" />
                                <span className="text-xs font-medium">Tải lên</span>
                                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                            </label>
                        )}
                        {imagePreview && (
                            <div className="relative group w-32 h-32">
                                <img src={imagePreview} alt="Preview" className="w-full h-full object-cover rounded-xl border-2 border-blue-200 shadow-sm" />
                                <button type="button" onClick={removeImage} className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md opacity-0 group-hover:opacity-100">
                                    <X className="w-4 h-4" />
                                </button>
                            </div>
                        )}
                    </div>
                    {isImageEmpty && <p className="text-xs text-red-500 mt-2 font-medium">Vui lòng tải lên 1 hình ảnh để hoàn tất yêu cầu.</p>}
                </div>

                <div className="pt-4">
                    <button type="submit" disabled={isSubmitting || isImageEmpty} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg">
                        {isSubmitting ? 'Đang gửi...' : 'Gửi đơn yêu cầu'}
                    </button>
                </div>
            </form>

            {/* Các popup thông báo đi kèm form */}
            {showLoginPopup && <LoginPopup onClose={() => setShowLoginPopup(false)} />}
            <Popup isOpen={popup.isOpen} title={popup.title} message={popup.message} type={popup.type} onClose={() => setPopup({ ...popup, isOpen: false })} />
        </>
    );
}