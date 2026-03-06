import { Search, Filter, Calendar, Phone, Mail, MapPin, Clock, User, CheckCircle, XCircle, Package, ShoppingBag } from 'lucide-react';

export default function OrderDetail() {
    // Mock data
    const orderData = {
        orderNumber: '#000001',
        status: 'Chưa xác nhận',
        orderType: 'Pre-order',
        deliveryDate: '01/10/2025 12:00',
        totalAmount: '280.000 vnd',
        customer: {
            name: 'Nguyên văn A',
            phone: '090xxxxxxx',
            email: 'nva@gmail.com',
            code: '#cst001',
        },
    };

    const products = [
        {
            id: '1',
            name: 'GỌNG NHỰA CỨNG G001',
            details: 'Màu sắc: đen, vàng',
            quantity: 1,
            unitPrice: '120.000 vnd',
            totalPrice: '120.000 vnd',
            image: 'https://images.unsplash.com/photo-1574258495973-f010dfbb5371?w=200&h=200&fit=crop',
        },
        {
            id: '2',
            name: 'TRÒNG KÍNH CHEMI U2 T001',
            details: 'Phân loại: đổi màu, chống UV',
            quantity: 2,
            unitPrice: '80.000 vnd',
            totalPrice: '160.000 vnd',
            image: 'https://images.unsplash.com/photo-1509695507497-903c140c43b0?w=200&h=200&fit=crop',
        },
    ];

    const deliveryInfo = {
        recipient: {
            name: 'Trần Văn A',
            phone: '090xxxxxxxx',
            email: 'nva@gmail.com',
        },
        address: '123/23/2c đường abc, phường Tân Định, Quận Gò Vấp, TP. HCM',
        note: 'Giao trước 16:00 giúp em nha',
    };

    return (
        <div className="min-h-screen bg-gray-200">
            {/* Header với Gradient */}
            <header className="bg-white shadow sticky top-0 z-50 border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-8 py-6">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-4">

                            <div>
                                <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                                    Chi tiết đơn hàng
                                </h1>
                                <p className="text-sm text-gray-500 mt-1">Quản lý và xử lý đơn hàng</p>
                            </div>
                        </div>

                        <div className="flex items-center gap-4">
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Tổng giá trị</p>
                                <p className="text-2xl font-bold text-gray-800">{orderData.totalAmount}</p>
                            </div>
                        </div>
                    </div>

                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-8 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Order Details */}
                    <div className="lg:col-span-2 space-y-8">
                        {/* Order Info Card */}
                        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <h2 className="text-3xl font-bold text-white mb-2">{orderData.orderNumber}</h2>
                                        <span className="inline-flex items-center px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30">
                                            <Clock className="w-4 h-4 mr-2" />
                                            {orderData.status}
                                        </span>
                                    </div>

                                </div>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-8">
                                    {/* Order Details */}
                                    <div className="space-y-5">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                            Thông tin đơn hàng
                                        </h3>

                                        <div className="space-y-4">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-sm font-semibold text-gray-500 w-32">Loại đơn:</span>
                                                <span className="text-sm text-gray-800 font-medium">{orderData.orderType}</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <span className="text-sm font-semibold text-gray-500 w-32">Ngày đặt:</span>
                                                <span className="text-sm text-gray-800 font-medium">{orderData.deliveryDate}</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                                <span className="text-sm font-semibold text-gray-500 w-32">Tổng tiền:</span>
                                                <span className="text-lg font-bold text-gray-800">{orderData.totalAmount}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Customer Info */}
                                    <div className="space-y-5">
                                        <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                            Khách hàng
                                        </h3>

                                        <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">

                                            <div>
                                                <h4 className="font-bold text-gray-800 text-lg">{orderData.customer.name}</h4>
                                                <span className="text-sm text-gray-500 font-medium">{orderData.customer.code}</span>
                                            </div>
                                        </div>

                                        <div className="space-y-3">
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <Phone className="w-5 h-5 text-gray-400" />
                                                <span className="text-sm text-gray-800">{orderData.customer.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                                                <Mail className="w-5 h-5 text-gray-400" />
                                                <span className="text-sm text-gray-800">{orderData.customer.email}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Product Table */}
                        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                    <Package className="w-6 h-6 text-gray-400" />
                                    Danh sách sản phẩm
                                </h3>
                            </div>

                            <div className="p-6">
                                <div className="space-y-4">
                                    {products.map((product, index) => (
                                        <div
                                            key={product.id}
                                            className="flex items-center gap-6 p-5 bg-gradient-to-r from-gray-50 to-white rounded-xl border border-gray-100 hover:border-blue-300 hover:shadow transition-all group"
                                        >
                                            <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden shadow group-hover:scale-110 transition-transform flex-shrink-0">
                                                <img
                                                    src={product.image}
                                                    alt={product.name}
                                                    className="w-full h-full object-cover"
                                                />
                                            </div>

                                            <div className="flex-1">
                                                <h4 className="font-bold text-gray-800 text-lg mb-2">{product.name}</h4>
                                                <p className="text-sm text-gray-500 mb-2">{product.details}</p>
                                                <div className="flex items-center gap-4">
                                                    <span className="inline-flex items-center px-3 py-1 rounded-xl bg-gray-100 text-gray-800 text-sm font-semibold border border-gray-200">
                                                        Số lượng: {product.quantity}
                                                    </span>
                                                    <span className="text-sm text-gray-500">Đơn giá: <span className="font-semibold text-gray-800">{product.unitPrice}</span></span>
                                                </div>
                                            </div>

                                            <div className="text-right flex-shrink-0">
                                                <p className="text-sm text-gray-500 mb-1">Tổng</p>
                                                <p className="text-2xl font-bold text-gray-800">{product.totalPrice}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                {/* Total */}
                                <div className="mt-6 p-6 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl">
                                    <div className="flex items-center justify-between text-white">
                                        <span className="text-xl font-bold">TỔNG CỘNG</span>
                                        <span className="text-3xl font-bold">280.000 vnd</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Delivery Info */}
                        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-8 py-5 border-b border-gray-200">
                                <h3 className="text-xl font-bold text-gray-800 flex items-center gap-3">
                                    <MapPin className="w-6 h-6 text-gray-400" />
                                    Thông tin giao hàng
                                </h3>
                            </div>

                            <div className="p-8">
                                <div className="grid grid-cols-2 gap-8">
                                    {/* Recipient Info */}
                                    <div className="space-y-5">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                            Người nhận
                                        </h4>

                                        <div className="space-y-4">
                                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <User className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Tên người nhận</p>
                                                    <p className="text-sm font-semibold text-gray-800">{deliveryInfo.recipient.name}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <Phone className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Số điện thoại</p>
                                                    <p className="text-sm font-semibold text-gray-800">{deliveryInfo.recipient.phone}</p>
                                                </div>
                                            </div>

                                            <div className="flex items-start gap-3 p-4 bg-gray-50 rounded-xl border border-gray-100">
                                                <Mail className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                <div>
                                                    <p className="text-xs text-gray-500 mb-1">Email</p>
                                                    <p className="text-sm font-semibold text-gray-800">{deliveryInfo.recipient.email}</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Address Info */}
                                    <div className="space-y-5">
                                        <h4 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                                            <div className="w-1.5 h-6 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                                            Chi tiết giao hàng
                                        </h4>

                                        <div className="space-y-4">
                                            <div className="p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl border border-gray-200">
                                                <div className="flex items-start gap-3">
                                                    <MapPin className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-2 font-semibold">Địa chỉ giao hàng</p>
                                                        <p className="text-sm text-gray-800 leading-relaxed">{deliveryInfo.address}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                                <div className="flex items-start gap-3">
                                                    <Clock className="w-5 h-5 text-gray-400 mt-1 flex-shrink-0" />
                                                    <div>
                                                        <p className="text-xs text-gray-500 mb-2 font-semibold">Ghi chú</p>
                                                        <p className="text-sm text-gray-800 leading-relaxed italic">{deliveryInfo.note}</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Actions */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-24">
                            <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
                                <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-5">
                                    <h3 className="text-xl font-bold text-white">Thao tác xử lý</h3>
                                </div>

                                <div className="p-6 space-y-5">
                                    <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                                        <p className="text-sm text-gray-800 font-medium">
                                            ⚡ Vui lòng kiểm tra thông tin đơn hàng trước khi xác nhận
                                        </p>
                                    </div>

                                    <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white py-4 px-6 rounded-xl transition-all font-bold text-lg shadow hover:shadow-lg transform hover:scale-105">
                                        <CheckCircle className="w-6 h-6" />
                                        Xác nhận đơn hàng
                                    </button>

                                    <div className="relative">
                                        <div className="flex items-center gap-2 mb-3">
                                            <div className="h-px flex-1 bg-gray-200"></div>
                                            <span className="text-xs text-gray-400 font-semibold">HOẶC</span>
                                            <div className="h-px flex-1 bg-gray-200"></div>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="block text-sm font-semibold text-gray-800 mb-2">
                                            Lý do từ chối
                                        </label>
                                        <textarea
                                            placeholder="Nhập lý do từ chối đơn hàng..."
                                            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none transition-all bg-white"
                                            rows={4}
                                        />
                                    </div>

                                    <button className="w-full flex items-center justify-center gap-3 bg-gradient-to-r from-red-500 to-rose-600 hover:from-red-600 hover:to-rose-700 text-white py-4 px-6 rounded-xl transition-all font-bold text-lg shadow hover:shadow-lg transform hover:scale-105">
                                        <XCircle className="w-6 h-6" />
                                        Từ chối đơn hàng
                                    </button>


                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}