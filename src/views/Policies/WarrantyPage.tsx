import React, { useState } from 'react';
import { Camera, X, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import LoginPopup from "@/views/Cart/components/LoginPopup"; 

export default function WarrantyPage() {
    const [orderCode, setOrderCode] = useState('');
    const [quantity, setQuantity] = useState<number>(1);
    const [requestType, setRequestType] = useState<string>('WARRANTY'); 
    const [description, setDescription] = useState('');
    
    const [refundMethod, setRefundMethod] = useState('');
    const [refundAccountNumber, setRefundAccountNumber] = useState('');

    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // STATE ĐỂ HIỂN THỊ LOGIN POPUP
    const [showLoginPopup, setShowLoginPopup] = useState(false);

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = e.target.files;
        if (!files) return;

        const newFiles = Array.from(files);
        const newPreviews = newFiles.map(file => URL.createObjectURL(file));

        setImages(prev => [...prev, ...newFiles]);
        setImagePreviews(prev => [...prev, ...newPreviews]);
    };

    const removeImage = (index: number) => {
        setImages(prev => prev.filter((_, i) => i !== index));
        URL.revokeObjectURL(imagePreviews[index]);
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // 1. KIỂM TRA ĐĂNG NHẬP
        const token = localStorage.getItem("access_token");
        const userStr = localStorage.getItem("user");
        
        if (!token || !userStr) {
            // MỞ POPUP ĐĂNG NHẬP THAY VÌ HIỆN TOAST LỖI
            setShowLoginPopup(true);
            return;
        }

        const userData = JSON.parse(userStr);
        const userId = userData?.id || userData?.userId || userData?.User_ID; 

        if (!userId) {
            setShowLoginPopup(true);
            return;
        }

        // 2. VALIDATE CÁC TRƯỜNG DỮ LIỆU
        if (!orderCode.trim()) {
            toast.error('Vui lòng nhập mã đơn');
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
            toast.error('Vui lòng nhập mô tả');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            
            formData.append('User_ID', userId.toString());
            formData.append('orderCode', orderCode);
            formData.append('quantity', quantity.toString());
            formData.append('Return_Type', requestType); 

            if (requestType === 'RETURN') {
                formData.append('Refund_Method', refundMethod);
                formData.append('Refund_Account_Number', refundAccountNumber);
            }

            formData.append('description', description);

            images.forEach((image) => {
                formData.append('images', image);
            });

            const response = await fetch('http://localhost:8080/warranty', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            if (response.ok) {
                toast.success('Gửi đơn thành công!');
                // Reset form
                setOrderCode('');
                setQuantity(1);
                setRequestType('WARRANTY');
                setRefundMethod('');
                setRefundAccountNumber('');
                setDescription('');
                setImages([]);
                imagePreviews.forEach(url => URL.revokeObjectURL(url));
                setImagePreviews([]);
            } else {
                toast.error('Có lỗi xảy ra từ máy chủ. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Error submitting warranty request:', error);
            toast.error('Không thể kết nối tới server. Vui lòng kiểm tra lại!');
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
                                        Nhập mã đơn <span className="text-red-500">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        value={orderCode}
                                        onChange={(e) => setOrderCode(e.target.value)}
                                        placeholder="Nhập mã đơn hàng"
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

                            {requestType === 'RETURN' && (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg border border-gray-100 animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            Phương thức hoàn tiền <span className="text-red-500">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={refundMethod}
                                            onChange={(e) => setRefundMethod(e.target.value)}
                                            placeholder="VD: MoMo, Vietcombank, TPBank..."
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
                                    Mô tả <span className="text-red-500">*</span>
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
                                    Thêm hình ảnh
                                </label>
                                <div className="mb-4">
                                    <label className="inline-flex items-center gap-2 px-6 py-3 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-colors">
                                        <Camera className="w-5 h-5 text-gray-600" />
                                        <span className="text-gray-700">Chọn ảnh</span>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            multiple
                                            onChange={handleImageUpload}
                                            className="hidden"
                                        />
                                    </label>
                                </div>

                                {imagePreviews.length > 0 && (
                                    <div className="grid grid-cols-3 gap-4">
                                        {imagePreviews.map((preview, index) => (
                                            <div key={index} className="relative group">
                                                <img
                                                    src={preview}
                                                    alt={`Preview ${index + 1}`}
                                                    className="w-full h-32 object-cover rounded-lg border-2 border-gray-200"
                                                />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(index)}
                                                    className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className="pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-6 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {isSubmitting ? 'Đang gửi...' : 'Gửi đơn'}
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

            {/* NHÚNG COMPONENT POPUP ĐĂNG NHẬP VÀO ĐÂY */}
            {showLoginPopup && (
                <LoginPopup onClose={() => setShowLoginPopup(false)} />
            )}
        </div>
    )
}