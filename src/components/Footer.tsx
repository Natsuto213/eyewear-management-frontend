import { Link } from "react-router-dom";
import {
    Phone,
    Mail,
    MapPin,
    Facebook,
    Instagram,
    MessageCircle,
    Clock,
    ShoppingBag,
    RefreshCw,
    Truck,
    Shield,
    Eye,
} from "lucide-react";

export default function Footer() {
    return (
        <footer className="bg-gradient-to-b from-gray-50 to-gray-100 border-t border-gray-200">
            {/* Main Footer Content */}
            <div className="max-w-7xl mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {/* Company Info */}
                    <div>
                        <div className="flex items-center gap-2 mb-4">
                            <Eye className="size-8 text-blue-600" />
                            <h3 className="text-xl">Kính Mắt Sora</h3>
                        </div>
                        <p className="text-gray-600 mb-4 leading-relaxed">
                            Chuyên cung cấp gọng kính, tròng kính chính hãng với
                            chất lượng cao và giá cả hợp lý. Cam kết sản phẩm
                            chính hãng 100%.
                        </p>
                        <div className="flex items-center gap-2 text-gray-600">
                            <Clock className="size-4" />
                            <span className="text-sm">8:00 - 22:00 hàng ngày</span>
                        </div>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h4 className="mb-4 text-lg">Liên Hệ</h4>
                        <div className="space-y-3">
                            <a
                                href="tel:0901234567"
                                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition group"
                            >
                                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                                    <Phone className="size-4 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Hotline</div>
                                    <div>090 123 4567</div>
                                </div>
                            </a>
                            <a
                                href="mailto:support@kinhmat.com"
                                className="flex items-center gap-3 text-gray-600 hover:text-blue-600 transition group"
                            >
                                <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition">
                                    <Mail className="size-4 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Email</div>
                                    <div>support@kinhmat.com</div>
                                </div>
                            </a>
                            <div className="flex items-center gap-3 text-gray-600">
                                <div className="p-2 bg-blue-50 rounded-lg">
                                    <MapPin className="size-4 text-blue-600" />
                                </div>
                                <div>
                                    <div className="text-xs text-gray-500">Địa chỉ</div>
                                    <div>xxx Đường abc, Q.1, TP.HCM</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Policies */}
                    <div>
                        <h4 className="mb-4 text-lg">Chính Sách</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link
                                    to="/chinh-sach-mua-hang"
                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition group"
                                >
                                    <ShoppingBag className="size-4 group-hover:translate-x-1 transition-transform" />
                                    <span>Chính sách mua hàng</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/chinh-sach-doi-tra"
                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition group"
                                >
                                    <RefreshCw className="size-4 group-hover:rotate-180 transition-transform duration-500" />
                                    <span>Chính sách đổi trả</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/chinh-sach-van-chuyen"
                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition group"
                                >
                                    <Truck className="size-4 group-hover:translate-x-1 transition-transform" />
                                    <span>Chính sách vận chuyển</span>
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="/bao-hanh"
                                    className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition group"
                                >
                                    <Shield className="size-5 group-hover:translate-x-1 transition-transform" />
                                    <span>Bảo hành sản phẩm</span>
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social Media */}
                    <div>
                        <h4 className="mb-4 text-lg">Kết Nối Với Chúng Tôi</h4>
                        <p className="text-gray-600 text-sm mb-4">
                            Theo dõi chúng tôi để cập nhật những ưu đãi mới nhất
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://facebook.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                                aria-label="Facebook"
                            >
                                <Facebook className="size-5" />
                            </a>
                            <a
                                href="https://instagram.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-gradient-to-br from-purple-600 via-pink-600 to-orange-500 text-white rounded-lg hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                                aria-label="Instagram"
                            >
                                <Instagram className="size-5" />
                            </a>
                            <a
                                href="https://zalo.me"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 hover:scale-110 transition-all duration-300 shadow-lg hover:shadow-xl"
                                aria-label="Zalo"
                            >
                                <MessageCircle className="size-5" />
                            </a>
                        </div>

                        {/* Feedback */}
                        <div className="mt-6">
                            <p className="text-sm text-gray-600 mb-2">
                                Hãy góp ý để chúng tôi làm tốt hơn !
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="text"
                                    placeholder="Góp ý"
                                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                                />
                                <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-sm whitespace-nowrap">
                                    Gửi
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-300 bg-gray-100">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <p className="text-sm text-gray-600 text-center md:text-left">
                            © 2026 Kính Mắt Sora. All rights reserved.
                        </p>
                        <div className="flex gap-6 text-sm">
                            <Link
                                to="/privacy"
                                className="text-gray-600 hover:text-blue-600 transition"
                            >
                                Chính sách bảo mật
                            </Link>
                            <Link
                                to="/terms"
                                className="text-gray-600 hover:text-blue-600 transition"
                            >
                                Điều khoản sử dụng
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
