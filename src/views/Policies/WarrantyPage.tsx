import React from 'react';
import { RefreshCw, Clock, CheckCircle, ClipboardList, User, PackageSearch, FileEdit, Send, HeartHandshake } from 'lucide-react';

import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function WarrantyPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50 relative">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-12">
                <div className="text-center mb-10">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">
                        YÊU CẦU BẢO HÀNH - ĐỔI TRẢ
                    </h1>
                    <p className="text-gray-600">
                        Quy trình tiếp nhận và xử lý nhanh chóng, minh bạch
                    </p>
                </div>

                <div className="grid lg:grid-cols-2 gap-8 max-w-7xl mx-auto">

                    {/* Cột trái: HƯỚNG DẪN THAO TÁC */}
                    <div className="bg-white rounded-lg shadow-lg p-8 h-fit flex flex-col">
                        <h2 className="text-xl font-bold text-gray-800 mb-6 border-b border-gray-100 pb-4 flex items-center gap-2">
                            <ClipboardList className="w-6 h-6 text-blue-600" />
                            Hướng dẫn gửi yêu cầu
                        </h2>

                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-8 rounded-r-lg">
                            <p className="text-sm text-yellow-800 font-medium">
                                <span className="font-bold text-red-600">* Lưu ý quan trọng:</span> Bạn phải đăng nhập vào hệ thống để có thể thực hiện gửi yêu cầu Bảo hành / Đổi trả.
                            </p>
                        </div>

                        <div className="space-y-8 flex-1">
                            {/* Bước 1 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <User className="w-5 h-5" />
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-gray-800 mb-1">Bước 1: Truy cập hồ sơ</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Ấn vào biểu tượng
                                        <span className="inline-flex items-center justify-center p-1 bg-gray-100 rounded text-gray-700 mx-1">
                                            <User className="w-4 h-4" />
                                        </span>
                                        (nằm ở góc trên bên trái màn hình). Sau đó chọn mục <strong>"Hồ sơ cá nhân"</strong>.
                                    </p>
                                </div>
                            </div>

                            {/* Bước 2 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <PackageSearch className="w-5 h-5" />
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-gray-800 mb-1">Bước 2: Tìm đơn hàng</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Chuyển sang <strong>"Đơn hàng của tôi"</strong> và tìm chọn đúng đơn hàng mà bạn cần bảo hành hoặc đổi trả.
                                    </p>
                                </div>
                            </div>

                            {/* Bước 3 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <FileEdit className="w-5 h-5" />
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-gray-800 mb-1">Bước 3: Điền thông tin</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Bấm vào nút Yêu cầu trên đơn hàng, sau đó <strong>vui lòng điền các thông tin</strong> theo đơn yêu cầu (Lý do, hình ảnh minh chứng,...).
                                    </p>
                                </div>
                            </div>

                            {/* Bước 4 */}
                            <div className="flex items-start gap-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center shrink-0">
                                    <Send className="w-5 h-5 ml-0.5" />
                                </div>
                                <div className="pt-1">
                                    <h4 className="font-bold text-gray-800 mb-1">Bước 4: Hoàn tất</h4>
                                    <p className="text-sm text-gray-600 leading-relaxed">
                                        Kiểm tra lại toàn bộ thông tin và ấn <strong>"Gửi đơn yêu cầu"</strong>. Hệ thống sẽ tiếp nhận và xử lý trong thời gian sớm nhất.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Lời ngỏ chân thành */}
                        <div className="mt-10 bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-xl border border-blue-100 text-center">
                            <HeartHandshake className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                            <p className="text-m text-gray-700 leading-relaxed">
                                Chân thành cảm ơn bạn đã tin tưởng lựa chọn sản phẩm của mắt kính Sora. Nếu có bất kỳ sai sót nào phát sinh từ sản phẩm hay trong quá trình vận chuyển, mong bạn thông cảm và đừng ngần ngại gửi yêu cầu nhé. Mắt kính Sora cam kết sẽ luôn đồng hành và hỗ trợ xử lý vấn đề của bạn một cách nhanh chóng, thỏa đáng nhất! ❤️
                            </p>
                        </div>
                    </div>

                    {/* Cột phải: CHÍNH SÁCH */}
                    <div className="bg-white rounded-lg shadow-lg p-8 h-fit">
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
                                <p className="text-sm text-gray-700 leading-relaxed">
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
        </div>
    )
}