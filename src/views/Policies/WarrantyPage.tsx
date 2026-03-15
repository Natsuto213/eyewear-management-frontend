import React, { useState } from 'react';
import { Camera, X, RefreshCw, Clock, CheckCircle, Upload } from 'lucide-react';
import { toast } from 'sonner';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginPopup from "@/views/Cart/components/LoginPopup"; 
import { Popup } from "@/components/Popup"; 
import { api } from "@/lib/api";

export default function WarrantyPage() {
    const [orderDetailId, setOrderDetailId] = useState<number | ''>('');
    const [quantity, setQuantity] = useState<number>(1);
    const [requestType, setRequestType] = useState<string>('WARRANTY'); 
    const [description, setDescription] = useState('');
    
    const [refundMethod, setRefundMethod] = useState(''); 
    const [refundAccountNumber, setRefundAccountNumber] = useState('');

    const [image, setImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const [popup, setPopup] = useState({ isOpen: false, title: '', message: '', type: 'success' as 'success' | 'error' });

    const showPopup = (message: string, type: 'success' | 'error', title: string = '') => {
        setPopup({ isOpen: true, title, message, type });
    };

    const isImageEmpty = !imagePreview;

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files || files.length === 0) return;

        if (files.length > 1) {
            toast.error("Vui lòng chỉ chọn 1 hình ảnh duy nhất để minh chứng!");
        }

        const file = files[0];
        
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }

        const newPreview = URL.createObjectURL(file);
        setImage(file);
        setImagePreview(newPreview);
    };

    const removeImage = () => {
        if (imagePreview) {
            URL.revokeObjectURL(imagePreview);
        }
        setImage(null);
        setImagePreview(null);
    };

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

        // Chỉ validate Hoàn tiền khi chọn Đổi trả
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

            // CHỈ APPEND 2 TRƯỜNG NÀY KHI LÀ RETURN. NẾU BẢO HÀNH THÌ BỎ QUA.
            if (requestType === 'RETURN') {
                formData.append('refundMethod', refundMethod);
                formData.append('refundAccountNumber', refundAccountNumber);
            }

            formData.append('image', image as Blob);

            await api.post('/api/return-exchanges', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            showPopup("Yêu cầu của bạn đã được gửi và đang chờ xử lý.", "success", "Gửi đơn thành công!");
            
            // Reset form sau khi gửi thành công
            setOrderDetailId('');
            setQuantity(1);
            setRequestType('WARRANTY');
            setRefundMethod('');
            setRefundAccountNumber('');
            setDescription('');
            removeImage();

        } catch (error: any) {
            console.error('Error submitting warranty request:', error);
            
            const backendErrorMsg = error.response?.data?.message 
                                 || error.response?.data?.result 
                                 || 'Có lỗi xảy ra từ máy chủ. Vui lòng kiểm tra lại thông tin!';
                                 
            showPopup(backendErrorMsg, "error", "Gửi yêu cầu thất bại!");
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">
                        YÊU CẦU BẢO HÀNH - ĐỔI TRẢ
                    </h1>
                    <p className="text-gray-600">
                        Vui lòng điền đầy đủ thông tin bên dưới
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {/* Left Column - Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin yêu cầu</h2>

                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="md:col-span-2">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Mã chi tiết đơn hàng (ID) <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={orderDetailId}
                                        onChange={(e) => setOrderDetailId(Number(e.target.value))}
                                        placeholder="Ví dụ: 1024"
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Số lượng <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="number"
                                        min="1"
                                        value={quantity}
                                        onChange={(e) => setQuantity(Number(e.target.value))}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                        required
                                    />
                                </div>

                                <div className="md:col-span-1">
                                    <label className="block text-gray-700 font-medium mb-2">
                                        Yêu cầu <span className="text-red-500">*</span>
                                    </label>
                                    <select
                                        value={requestType}
                                        onChange={(e) => setRequestType(e.target.value)}
                                        className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white"
                                        required
                                    >
                                        <option value="WARRANTY">Bảo hành</option>
                                        <option value="RETURN">Đổi trả</option>
                                    </select>
                                </div>
                            </div>

                            {/* Khu vực Chọn hoàn tiền: Chỉ hiện khi là RETURN */}
                            {requestType === 'RETURN' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Phương thức hoàn tiền <span className="text-red-500">*</span>
                                        </label>
                                        {/* TRẢ LẠI THÀNH INPUT TEXT CHO PHÉP NHẬP TỰ DO */}
                                        <input
                                            type="text"
                                            value={refundMethod}
                                            onChange={(e) => setRefundMethod(e.target.value)}
                                            placeholder="VD: MoMo, Vietcombank..."
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors bg-white"
                                            required={requestType === 'RETURN'}
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Số tài khoản / SĐT <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={refundAccountNumber}
                                            onChange={(e) => setRefundAccountNumber(e.target.value)}
                                            placeholder="Nhập số tài khoản / SĐT ví"
                                            className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
                                            required={requestType === 'RETURN'}
                                        />
                                    </div>
                                </div>
                            )}

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Lý do <span className="text-red-500">*</span>
                                </label>
                                <textarea
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    placeholder="Mô tả chi tiết vấn đề của sản phẩm..."
                                    rows={6}
                                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition-colors resize-none"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Thêm hình ảnh minh chứng (Chỉ 1 ảnh) <span className="text-red-500">*</span>
                                </label>
                                
                                <div className="flex flex-wrap gap-3 items-start">
                                    {!imagePreview && (
                                        <label className={`w-32 h-32 shrink-0 border-2 border-dashed rounded-xl flex flex-col items-center justify-center cursor-pointer transition-colors
                                            ${isImageEmpty 
                                                ? 'border-red-400 bg-red-50 text-red-500 hover:border-red-500 hover:bg-red-100' 
                                                : 'border-blue-300 text-blue-600 hover:bg-blue-50 hover:border-blue-500'
                                            }`}
                                        >
                                            <Upload className="h-6 w-6 mb-2" />
                                            <span className="text-xs font-medium">Tải lên</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleImageUpload}
                                                className="hidden"
                                            />
                                        </label>
                                    )}

                                    {imagePreview && (
                                        <div className="relative group w-32 h-32">
                                            <img
                                                src={imagePreview}
                                                alt="Preview"
                                                className="w-full h-full object-cover rounded-xl border-2 border-blue-200 shadow-sm"
                                            />
                                            <button
                                                type="button"
                                                onClick={removeImage}
                                                className="absolute top-1 right-1 p-1.5 bg-red-500 hover:bg-red-600 text-white rounded-full transition-colors shadow-md opacity-0 group-hover:opacity-100"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>
                                        </div>
                                    )}
                                </div>

                                {isImageEmpty && (
                                    <p className="text-xs text-red-500 mt-2 font-medium">
                                        Vui lòng tải lên 1 hình ảnh để hoàn tất yêu cầu.
                                    </p>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting || isImageEmpty}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
                                >
                                    {isSubmitting ? 'Đang gửi...' : 'Gửi đơn yêu cầu'}
                                </button>
                            </div>
                        </form>
                    </div>

                    {/* Right Column - Warranty Policy */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="space-y-8">
                            <div>
                                <h3 className="font-bold text-blue-600 text-lg mb-4 flex items-center gap-2">
                                    <CheckCircle className="w-5 h-5" />
                                    CHÍNH SÁCH BẢO HÀNH
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">1. Phạm vi bảo hành</h4>
                                        <p className="text-sm text-gray-700 pl-4">
                                            Áp dụng cho các sản phẩm mua trên hệ thống bán kính mắt trực tuyến, bao gồm gọng kính và tròng kính.
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">2. Thời gian bảo hành</h4>
                                        <ul className="text-sm text-gray-700 pl-4 space-y-1">
                                            <li>• Thời gian bảo hành được áp dụng theo thông tin công bố cho từng sản phẩm</li>
                                            <li>• Thời gian bảo hành được tính từ ngày khách hàng nhận hàng</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">3. Điều kiện bảo hành</h4>
                                        <p className="text-sm text-gray-700 pl-4 mb-1">Sản phẩm được bảo hành trong các trường hợp:</p>
                                        <ul className="text-sm text-gray-700 pl-4 space-y-1">
                                            <li>• Lỗi kỹ thuật do nhà sản xuất</li>
                                            <li>• Lỗi gia công tròng kính (đối với đơn prescription)</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="border-t-2 border-gray-200"></div>

                            <div>
                                <h3 className="font-bold text-blue-600 text-lg mb-4 flex items-center gap-2">
                                    <RefreshCw className="w-5 h-5" />
                                    CHÍNH SÁCH ĐỔI TRẢ
                                </h3>

                                <div className="space-y-4">
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">1. Điều kiện đổi trả</h4>
                                        <p className="text-sm text-gray-700 pl-4 mb-1">Khách hàng được đổi hoặc trả sản phẩm trong các trường hợp:</p>
                                        <ul className="text-sm text-gray-700 pl-4 space-y-1">
                                            <li>• Sản phẩm bị lỗi kỹ thuật do nhà sản xuất</li>
                                            <li>• Giao sai sản phẩm, sai mẫu mã so với đơn hàng</li>
                                        </ul>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">2. Quy trình đổi trả</h4>
                                        <ul className="text-sm text-gray-700 pl-4 space-y-1">
                                            <li>• Khách hàng liên hệ bộ phận hỗ trợ và cung cấp thông tin đơn hàng</li>
                                            <li>• Hệ thống kiểm tra và xác nhận điều kiện đổi trả</li>
                                            <li>• Thực hiện đổi sản phẩm hoặc hoàn tiền theo quy định</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-600">
                                <h3 className="font-bold text-blue-600 mb-2 flex items-center gap-2">
                                    <Clock className="w-5 h-5" />
                                    Hỗ trợ khách hàng
                                </h3>
                                <p className="text-sm text-gray-700">
                                    <strong>Hotline:</strong> 090 123 4567<br />
                                    <strong>Email:</strong> support@kinhmat.com<br />
                                    <strong>Giờ làm việc:</strong> 8:00 - 22:00 hàng ngày
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />

            {/* Các popup thông báo */}
            {showLoginPopup && (
                <LoginPopup onClose={() => setShowLoginPopup(false)} />
            )}

            <Popup 
                isOpen={popup.isOpen} 
                title={popup.title}
                message={popup.message} 
                type={popup.type} 
                onClose={() => setPopup({ ...popup, isOpen: false })} 
            />
        </div>
    )
}