import React, { useState, useMemo, useEffect } from 'react';
import { Truck, Search, PlusCircle, Trash2, Calendar, ShoppingBag, Plus, Minus } from 'lucide-react';

// 1. DỮ LIỆU GIẢ LẬP: DANH SÁCH CÁC NHÀ CUNG CẤP (SUPPLIERS)
const suppliers = [
    { id: "SUP001", name: "Công ty TNHH Eyewear Miền Nam", code: "SRC-HCM-001", phone: "028 3844 5566", address: "Khu công nghệ cao, Quận 9, TP. HCM" },
    { id: "SUP002", name: "Tổng đại lý Ray-Ban VN", code: "RB-VN-HQ", phone: "024 1122 3344", address: "Quận Hoàn Kiếm, TP. Hà Nội" },
    { id: "SUP003", name: "Nhà phân phối Tròng kính Essilor", code: "ESSILOR-DIST", phone: "0909 888 777", address: "Quận 1, TP. HCM" }
];

// 2. DỮ LIỆU GIẢ LẬP: KHO SẢN PHẨM TỪ CÁC NHÀ CUNG CẤP
const allProducts = [
    { id: 101, name: "Gọng kính Ray-Ban Aviator", code: "RB-3025", unit: "Cái", price: 3500000, vat: 10, supplierId: "SUP002" },
    { id: 102, name: "Tròng kính Essilor Crizal", code: "ES-CRIZ", unit: "Cặp", price: 1200000, vat: 10, supplierId: "SUP003" },
    { id: 103, name: "Kính áp tròng Acuvue", code: "AC-OAS", unit: "Hộp", price: 650000, vat: 10, supplierId: "SUP001" },
    { id: 104, name: "Gọng kính Gentle Monster", code: "GM-KUBO", unit: "Cái", price: 5800000, vat: 10, supplierId: "SUP001" },
    { id: 105, name: "Gọng kính Titanium siêu nhẹ", code: "TI-001", unit: "Cái", price: 2100000, vat: 10, supplierId: "SUP001" },
    { id: 106, name: "Tròng kính chống ánh sáng xanh", code: "BL-CUT", unit: "Cặp", price: 850000, vat: 10, supplierId: "SUP003" }
];

const PurchaseCard = () => {
    // --- STATE: THÔNG TIN CHUNG ---
    const [selectedSupplierId, setSelectedSupplierId] = useState("");
    const [orderDate, setOrderDate] = useState("");

    // Set ngày hiện tại làm ngày đặt đơn mặc định
    useEffect(() => {
        const today = new Date().toISOString().split('T')[0];
        setOrderDate(today);
    }, []);

    const selectedSupplier = useMemo(() => {
        return suppliers.find(s => s.id === selectedSupplierId) || null;
    }, [selectedSupplierId]);

    // --- STATE: TÌM KIẾM SẢN PHẨM ---
    const [searchQuery, setSearchQuery] = useState("");

    // Lọc danh sách sản phẩm theo TỪ KHÓA và NHÀ CUNG CẤP đã chọn
    const availableProducts = useMemo(() => {
        if (!selectedSupplierId) return []; // Chưa chọn nhà cung cấp thì không hiện SP
        return allProducts.filter(p =>
            p.supplierId === selectedSupplierId &&
            (p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.code.toLowerCase().includes(searchQuery.toLowerCase()))
        );
    }, [searchQuery, selectedSupplierId]);

    // --- STATE: GIỎ HÀNG ĐẶT MUA ---
    // Cấu trúc item: { ...product, orderQty: 1 }
    const [selectedProducts, setSelectedProducts] = useState<any[]>([]);

    // Xóa sạch giỏ hàng nếu đổi nhà cung cấp
    useEffect(() => {
        setSelectedProducts([]);
    }, [selectedSupplierId]);

    // HÀM THÊM SẢN PHẨM TỪ BẢNG TÌM KIẾM
    const handleAddProduct = (product: any) => {
        const existing = selectedProducts.find(p => p.id === product.id);
        
        if (existing) {
            // Nếu đã có -> Tăng số lượng lên 1
            setSelectedProducts(selectedProducts.map(p => {
                if (p.id === product.id) {
                    const currentQty = p.orderQty === '' ? 0 : parseInt(p.orderQty);
                    return { ...p, orderQty: (currentQty + 1).toString() };
                }
                return p;
            }));
        } else {
            // Nếu chưa có -> Thêm mới với số lượng 1
            setSelectedProducts([...selectedProducts, { ...product, orderQty: '1' }]);
        }
    };

    const handleRemoveProduct = (productId: number) => {
        setSelectedProducts(selectedProducts.filter(p => p.id !== productId));
    };

    const handleQtyChange = (id: number, value: string) => {
        if (value === '' || /^\d+$/.test(value)) {
            setSelectedProducts(selectedProducts.map(p =>
                p.id === id ? { ...p, orderQty: value } : p
            ));
        }
    };

    // HÀM TĂNG SỐ LƯỢNG
    const handleIncrement = (id: number) => {
        setSelectedProducts(selectedProducts.map(p => {
            if (p.id === id) {
                const currentQty = p.orderQty === '' ? 0 : parseInt(p.orderQty);
                return { ...p, orderQty: (currentQty + 1).toString() };
            }
            return p;
        }));
    };

    // HÀM GIẢM SỐ LƯỢNG
    const handleDecrement = (id: number) => {
        setSelectedProducts(selectedProducts.map(p => {
            if (p.id === id) {
                const currentQty = p.orderQty === '' ? 0 : parseInt(p.orderQty);
                const newQty = currentQty > 1 ? currentQty - 1 : 1; // Tối thiểu là 1
                return { ...p, orderQty: newQty.toString() };
            }
            return p;
        }));
    };

    const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(Math.round(val));

    const totalOrderValue = useMemo(() => {
        return selectedProducts.reduce((sum, p) => {
            const qty = p.orderQty === '' ? 0 : parseInt(p.orderQty);
            return sum + (p.price * qty * (1 + p.vat / 100));
        }, 0);
    }, [selectedProducts]);

    return (
        <main className="max-w-5xl mx-auto py-8 px-4 space-y-8 font-sans bg-gray-50 min-h-screen">
            <header className="text-center mb-8">
                <h1 className="text-3xl font-extrabold text-blue-900 uppercase tracking-wide">
                    PHIẾU NHẬP KHO
                </h1>
            </header>

            {/* BƯỚC 1: THÔNG TIN CHUNG TỰ FILL */}
            <section className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-gray-100 border-b border-gray-200 px-6 py-3">
                    <h2 className="text-base font-bold text-gray-800 uppercase flex items-center gap-2">
                        <Truck className="w-5 h-5 text-blue-600" /> Thông tin chung
                    </h2>
                </div>

                <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Cột trái: Cột chọn nhà cung cấp */}
                        <div className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Nguồn nhập (Công ty) *</label>
                                <select
                                    className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-4"
                                    value={selectedSupplierId}
                                    onChange={(e) => setSelectedSupplierId(e.target.value)}
                                >
                                    <option value="">-- Vui lòng chọn nhà cung cấp --</option>
                                    {suppliers.map(s => (
                                        <option key={s.id} value={s.id}>{s.name}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mã nguồn</label>
                                <input type="text" disabled className="w-full bg-gray-100 border-gray-200 rounded-lg text-sm py-2 px-4 text-gray-600 font-mono" value={selectedSupplier?.code || ''} placeholder="Tự động điền..." />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Số điện thoại</label>
                                <input type="text" disabled className="w-full bg-gray-100 border-gray-200 rounded-lg text-sm py-2 px-4 text-gray-600" value={selectedSupplier?.phone || ''} placeholder="Tự động điền..." />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Địa chỉ</label>
                                <textarea disabled className="w-full bg-gray-100 border-gray-200 rounded-lg text-sm py-2 px-4 text-gray-600 resize-none" rows={2} value={selectedSupplier?.address || ''} placeholder="Tự động điền..." />
                            </div>
                        </div>

                        {/* Cột phải: Ngày tháng */}
                        <div className="space-y-5 border-l-0 md:border-l border-gray-100 md:pl-8">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Mã phiếu đặt hàng</label>
                                <input type="text" disabled className="w-full bg-gray-100 border-gray-200 rounded-lg text-sm py-2 px-4 text-blue-700 font-bold font-mono" value="PO-AUTO-001" />
                            </div>

                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1 flex items-center gap-2">
                                    <Calendar className="w-4 h-4" /> Ngày đặt *
                                </label>
                                <input type="date" className="w-full border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 text-sm py-2 px-4" value={orderDate} onChange={(e) => setOrderDate(e.target.value)} />
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* BƯỚC 2: TÌM VÀ THÊM SẢN PHẨM TỪ KHO */}
            <section className={`bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden transition-opacity ${!selectedSupplierId ? 'opacity-50 pointer-events-none' : ''}`}>
                <div className="bg-gray-100 border-b border-gray-200 px-6 py-3 flex justify-between items-center">
                    <h2 className="text-base font-bold text-gray-800 uppercase flex items-center gap-2">
                        <Search className="w-5 h-5 text-blue-600" /> Tìm kiếm sản phẩm
                    </h2>
                    <div className="relative w-72">
                        <input
                            type="text"
                            placeholder="Nhập tên hoặc mã sản phẩm..."
                            className="w-full pl-9 pr-4 py-1.5 border-gray-300 rounded-full text-sm focus:ring-blue-500 focus:border-blue-500 shadow-sm"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2" />
                    </div>
                </div>

                <div className="max-h-64 overflow-y-auto">
                    {!selectedSupplierId ? (
                        <div className="p-8 text-center text-gray-500 italic text-sm">Vui lòng chọn Nguồn nhập ở trên để xem danh sách sản phẩm.</div>
                    ) : availableProducts.length === 0 ? (
                        <div className="p-8 text-center text-gray-500 italic text-sm">Không tìm thấy sản phẩm nào khớp với từ khóa.</div>
                    ) : (
                        <table className="w-full text-sm border-collapse">
                            <thead className="bg-blue-50 sticky top-0">
                                <tr>
                                    <th className="p-3 text-left text-xs font-semibold text-gray-600 uppercase w-1/2">Tên sản phẩm</th>
                                    <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase">Mã SP</th>
                                    <th className="p-3 text-right text-xs font-semibold text-gray-600 uppercase">Đơn giá</th>
                                    <th className="p-3 text-center text-xs font-semibold text-gray-600 uppercase w-20">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-100">
                                {availableProducts.map(p => (
                                    <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="p-3 font-medium text-gray-800">{p.name}</td>
                                        <td className="p-3 text-center font-mono text-gray-500 text-xs">{p.code}</td>
                                        <td className="p-3 text-right text-gray-700">{formatCurrency(p.price)} đ</td>
                                        <td className="p-3 text-center">
                                            <button
                                                onClick={() => handleAddProduct(p)}
                                                className="inline-flex items-center gap-1 bg-blue-100 hover:bg-blue-600 text-blue-700 hover:text-white px-3 py-1.5 rounded-md text-xs font-bold transition-colors"
                                                title="Thêm vào danh sách đặt"
                                            >
                                                <PlusCircle className="w-3.5 h-3.5" /> Thêm
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            </section>

            {/* BƯỚC 3: BẢNG SẢN PHẨM ĐÃ CHỌN ĐỂ ĐẶT */}
            <section className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
                <div className="bg-blue-800 text-white px-6 py-3 flex justify-between items-center">
                    <h2 className="text-base font-bold uppercase flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-blue-200" /> Bảng kế hoạch đặt hàng
                    </h2>
                    <span className="bg-white/20 px-3 py-1 rounded-full text-xs font-bold">{selectedProducts.length} mặt hàng</span>
                </div>

                <div className="overflow-x-auto min-h-[200px]">
                    <table className="w-full text-sm border-collapse">
                        <thead>
                            <tr className="bg-blue-50 border-b border-gray-200">
                                <th className="p-3 uppercase text-[11px] font-bold text-gray-600 text-center w-12">STT</th>
                                <th className="p-3 uppercase text-[11px] font-bold text-gray-600 text-left">Tên hàng hóa</th>
                                <th className="p-3 uppercase text-[11px] font-bold text-gray-600 text-center">Mã hàng</th>
                                <th className="p-3 uppercase text-[11px] font-bold text-gray-600 text-center w-16">ĐVT</th>
                                <th className="p-3 uppercase text-[11px] font-bold text-gray-600 text-right">Đơn giá (VNĐ)</th>
                                <th className="p-3 uppercase text-[11px] font-bold text-gray-600 text-center w-36 bg-yellow-50">SL Nhập *</th>
                                <th className="p-3 uppercase text-[11px] font-bold text-gray-600 text-center w-16">VAT</th>
                                <th className="p-3 uppercase text-[11px] font-bold text-gray-600 text-right">Thành tiền (VNĐ)</th>
                                <th className="p-3 uppercase text-[11px] font-bold text-gray-600 text-center w-16">Xóa</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {selectedProducts.length === 0 ? (
                                <tr>
                                    <td colSpan={9} className="p-10 text-center text-gray-400 italic">
                                        Chưa có sản phẩm nào được chọn. Vui lòng chọn từ bảng tìm kiếm phía trên.
                                    </td>
                                </tr>
                            ) : (
                                selectedProducts.map((p, idx) => {
                                    const qty = p.orderQty === '' ? 0 : parseInt(p.orderQty);
                                    const totalLine = p.price * qty * (1 + p.vat / 100);

                                    return (
                                        <tr key={p.id} className="hover:bg-gray-50 transition-colors">
                                            <td className="p-3 text-center text-gray-500">{idx + 1}</td>
                                            <td className="p-3 font-semibold text-gray-800">{p.name}</td>
                                            <td className="p-3 text-center font-mono text-xs text-gray-500">{p.code}</td>
                                            <td className="p-3 text-center text-gray-500">{p.unit}</td>
                                            <td className="p-3 text-right text-gray-700">{formatCurrency(p.price)}</td>

                                            {/* Ô NHO NG NÚT TĂNG GIẢM */}
                                            <td className="p-3 bg-yellow-50/50">
                                                <div className="flex items-center justify-center bg-white border border-gray-300 rounded-md overflow-hidden focus-within:ring-2 focus-within:ring-blue-500 focus-within:border-blue-500 w-full">
                                                    <button
                                                        type="button"
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-30 disabled:hover:bg-transparent"
                                                        onClick={() => handleDecrement(p.id)}
                                                        disabled={p.orderQty === '' || parseInt(p.orderQty) <= 1}
                                                    >
                                                        <Minus className="w-3.5 h-3.5" />
                                                    </button>
                                                    <input
                                                        type="text"
                                                        className="w-12 text-center font-bold text-blue-700 border-none p-1 text-sm focus:ring-0"
                                                        value={p.orderQty}
                                                        onChange={(e) => handleQtyChange(p.id, e.target.value)}
                                                    />
                                                    <button
                                                        type="button"
                                                        className="p-2 text-gray-500 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                                                        onClick={() => handleIncrement(p.id)}
                                                    >
                                                        <Plus className="w-3.5 h-3.5" />
                                                    </button>
                                                </div>
                                            </td>

                                            <td className="p-3 text-center text-gray-500">{p.vat}%</td>
                                            <td className="p-3 text-right font-bold text-gray-900">{formatCurrency(totalLine)}</td>
                                            <td className="p-3 text-center">
                                                <button
                                                    onClick={() => handleRemoveProduct(p.id)}
                                                    className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                                    title="Xóa mặt hàng này"
                                                >
                                                    <Trash2 className="w-5 h-5 mx-auto" />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                        <tfoot className="bg-gray-100 border-t-2 border-gray-300">
                            <tr>
                                <td className="p-4 text-right font-bold text-gray-800 text-sm uppercase tracking-wider" colSpan={7}>
                                    Tổng thanh toán:
                                </td>
                                <td className="p-4 text-right font-black text-red-600 text-xl tracking-tight" colSpan={2}>
                                    {formatCurrency(totalOrderValue)}
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            </section>

            {/* BƯỚC 4: NÚT XÁC NHẬN TỔNG */}
            <div className="flex justify-center pt-4 pb-10">
                <button
                    className={`py-4 px-16 rounded-xl font-bold shadow-lg flex items-center gap-3 transition-all transform active:scale-95 text-lg uppercase tracking-wider
                        ${selectedProducts.length > 0
                            ? 'bg-blue-700 hover:bg-blue-800 text-white shadow-blue-300 hover:-translate-y-1'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                    disabled={selectedProducts.length === 0}
                    onClick={() => alert("Đã xác nhận tạo Phiếu Đặt Hàng thành công!")}
                >
                    Xác nhận tạo phiếu đặt hàng
                </button>
            </div>
        </main>
    );
};

export default PurchaseCard;