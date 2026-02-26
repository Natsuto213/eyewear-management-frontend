import React, { useState } from 'react';
import { Camera, X, Shield, RefreshCw, Clock, CheckCircle } from 'lucide-react';
import { toast } from 'sonner';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WarrantyPage() {
    const [orderCode, setOrderCode] = useState('');
    const [description, setDescription] = useState('');
    const [images, setImages] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [isSubmitting, setIsSubmitting] = useState(false);

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

        // Revoke the URL to free up memory
        URL.revokeObjectURL(imagePreviews[index]);
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!orderCode.trim()) {
            toast.error('Vui lòng nhập mã đơn');
            return;
        }

        if (!description.trim()) {
            toast.error('Vui lòng nhập mô tả');
            return;
        }

        setIsSubmitting(true);

        try {
            const formData = new FormData();
            formData.append('orderCode', orderCode);
            formData.append('description', description);

            // Append all images
            images.forEach((image, index) => {
                formData.append('images', image);
            });

            // Send to API
            const response = await fetch('http://localhost:8080/warranty', {
                method: 'POST',
                body: formData,
            });

            if (response.ok) {
                toast.success('Gửi đơn thành công!');
                // Reset form
                setOrderCode('');
                setDescription('');
                setImages([]);
                imagePreviews.forEach(url => URL.revokeObjectURL(url));
                setImagePreviews([]);
            } else {
                toast.error('Có lỗi xảy ra. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Error submitting warranty request:', error);
            toast.error('Không thể kết nối tới server. Vui lòng kiểm tra lại!');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            < Navbar />

            <main className="flex-1 container mx-auto px-4 py-12">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">
                        YÊU CẦU BẢO HÀNH - ĐỔI TRẢ
                    </h1>
                    <p className="text-gray-600">
                        Vui lòng điền đầy đủ thông tin bên dưới
                    </p>
                </div>

                {/* Two Column Layout */}
                <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">
                    {/* Left Column - Form */}
                    <div>
                        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-lg p-8 space-y-6">
                            <h2 className="text-xl font-bold text-gray-800 mb-4">Thông tin yêu cầu</h2>

                            {/* Order Code Input */}
                            <div>
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

                            {/* Description Textarea */}
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

                            {/* Image Upload */}
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    Thêm hình ảnh
                                </label>

                                {/* Upload Button */}
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

                                {/* Image Previews */}
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

                            {/* Submit Button */}
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
                            {/* Warranty Policy */}
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

                                    <div>
                                        <h4 className="font-semibold text-red-600 mb-2">4. Trường hợp không bảo hành</h4>
                                        <ul className="text-sm text-gray-700 pl-4 space-y-1">
                                            <li>• Hư hỏng do va đập, rơi vỡ, trầy xước trong quá trình sử dụng</li>
                                            <li>• Sử dụng sai cách hoặc bảo quản không đúng hướng dẫn</li>
                                            <li>• Hao mòn tự nhiên theo thời gian</li>
                                            <li>• Tròng kính đã gia công theo đơn prescription nhưng sai do thông tin khách hàng cung cấp</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">5. Quy trình bảo hành</h4>
                                        <ul className="text-sm text-gray-700 pl-4 space-y-1">
                                            <li>• Khách hàng liên hệ bộ phận hỗ trợ và cung cấp thông tin đơn hàng</li>
                                            <li>• Hệ thống kiểm tra và xác nhận điều kiện bảo hành</li>
                                            <li>• Thời gian xử lý bảo hành: 7 ngày làm việc</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Divider */}
                            <div className="border-t-2 border-gray-200"></div>

                            {/* Return/Exchange Policy */}
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
                                        <h4 className="font-semibold text-gray-800 mb-2">2. Thời gian đổi trả</h4>
                                        <p className="text-sm text-gray-700 pl-4">
                                            Yêu cầu đổi trả trong vòng 7 ngày kể từ ngày nhận hàng
                                        </p>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-red-600 mb-2">3. Trường hợp không áp dụng</h4>
                                        <ul className="text-sm text-gray-700 pl-4 space-y-1">
                                            <li>• Sản phẩm đã qua sử dụng, trầy xước do người dùng</li>
                                            <li>• Tròng kính gia công theo đơn thuốc (trừ lỗi kỹ thuật)</li>
                                            <li>• Sản phẩm hư hỏng do va đập hoặc bảo quản không đúng cách</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">4. Quy trình đổi trả</h4>
                                        <ul className="text-sm text-gray-700 pl-4 space-y-1">
                                            <li>• Khách hàng liên hệ bộ phận hỗ trợ và cung cấp thông tin đơn hàng</li>
                                            <li>• Hệ thống kiểm tra và xác nhận điều kiện đổi trả</li>
                                            <li>• Thực hiện đổi sản phẩm hoặc hoàn tiền theo quy định</li>
                                        </ul>
                                    </div>

                                    <div>
                                        <h4 className="font-semibold text-gray-800 mb-2">5. Hoàn tiền</h4>
                                        <ul className="text-sm text-gray-700 pl-4 space-y-1">
                                            <li>• Hoàn tiền theo phương thức thanh toán ban đầu (Momo/Tiền mặt)</li>
                                            <li>• Thời gian hoàn tiền: 2-3 ngày làm việc sau khi xác nhận</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Contact Info */}
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
            </main >
            
            <Footer />
        </div >
    )
}