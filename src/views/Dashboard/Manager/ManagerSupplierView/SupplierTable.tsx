// ManagerSupplierView/SupplierTable.tsx
import { Loader2, Phone, MapPin, Tags, PackageOpen, ChevronDown } from 'lucide-react'; // 👇 Import ChevronDown
import { useState } from 'react';
import { Supplier } from './SupplierConfig';
import { api } from '@/lib/ApiService';

interface Props {
    loading: boolean;
    suppliers: Supplier[];
    onAddBrandClick: (supplier: Supplier) => void;
}

// Format tiền tệ
const formatCurrency = (val: number) => new Intl.NumberFormat('vi-VN').format(Math.round(val)) + ' đ';

// COMPONENT CON: TỪNG DÒNG NHÀ CUNG CẤP (CÓ TÍCH HỢP SỔ XUỐNG ACCORDION)
function SupplierRow({ supplier, onAddBrandClick }: { supplier: Supplier, onAddBrandClick: (s: Supplier) => void }) {
    const [isExpanded, setIsExpanded] = useState(false);
    const [products, setProducts] = useState<any[]>([]);
    const [loadingProducts, setLoadingProducts] = useState(false);
    const [hasFetched, setHasFetched] = useState(false);

    const handleToggle = async () => {
        if (!isExpanded && !hasFetched) {
            setLoadingProducts(true);
            try {
                const res = await api.get(`/api/inventory-receipts/products/search?supplierId=${supplier.id}`);
                setProducts(res.data || []);
                setHasFetched(true);
            } catch (error) {
                console.error(`Lỗi lấy sản phẩm của NCC ${supplier.name}:`, error);
            } finally {
                setLoadingProducts(false);
            }
        }
        setIsExpanded(!isExpanded);
    };

    return (
        <>
            {/* DÒNG CHÍNH */}
            <tr className={`hover:bg-gray-50 transition-colors ${isExpanded ? 'bg-blue-50/30' : ''}`}>
                <td className="p-4 text-center font-mono text-sm font-semibold text-gray-500">{supplier.id}</td>
                <td className="p-4 font-semibold text-gray-800">
                    <div 
                        className="flex items-center gap-3 cursor-pointer group" 
                        onClick={handleToggle}
                    >
                        <button className={`p-1 rounded-md transition-colors ${isExpanded ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-500 group-hover:bg-blue-50 group-hover:text-blue-500'}`}>
                            {/* Dùng ChevronDown, thêm xoay (rotate) mượt mà */}
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isExpanded ? 'rotate-180' : 'rotate-0'}`} />
                        </button>
                        <span className="group-hover:text-blue-600 transition-colors">{supplier.name}</span>
                    </div>
                </td>
                <td className="p-4">
                    <div className="flex flex-col gap-1 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-gray-400" /> {supplier.phone}</span>
                    </div>
                </td>
                <td className="p-4 text-sm text-gray-600">
                    <span className="flex items-start gap-1.5"><MapPin className="w-4 h-4 text-gray-400 shrink-0 mt-0.5" /> {supplier.address}</span>
                </td>
                <td className="p-4 text-center">
                    <button
                        onClick={() => onAddBrandClick(supplier)}
                        className="bg-emerald-50 hover:bg-emerald-500 text-emerald-600 hover:text-white border border-emerald-200 hover:border-emerald-500 font-semibold py-1.5 px-3 rounded-md text-xs shadow-sm transition-all flex items-center gap-1.5 mx-auto"
                    >
                        <Tags className="w-3.5 h-3.5" />
                        Thêm Brand
                    </button>
                </td>
            </tr>

            {/* DÒNG SỔ XUỐNG (ACCORDION) */}
            {isExpanded && (
                <tr className="bg-gray-50 border-b border-gray-200">
                    <td colSpan={5} className="p-0">
                        <div className="px-12 py-5 animate-in slide-in-from-top-2 duration-200">                            
                            {loadingProducts ? (
                                <div className="flex items-center gap-2 text-sm text-gray-500 py-3">
                                    <Loader2 className="w-4 h-4 animate-spin text-blue-500" /> Đang tải sản phẩm...
                                </div>
                            ) : products.length === 0 ? (
                                <p className="text-sm text-gray-500 italic py-3 bg-white px-4 border border-gray-200 rounded-lg">Nhà cung cấp này chưa có sản phẩm nào.</p>
                            ) : (
                                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-sm">
                                    <table className="w-full text-left text-sm">
                                        <thead className="bg-gray-100/70 border-b border-gray-200 text-gray-600 text-xs">
                                            <tr>
                                                <th className="px-4 py-2.5 font-bold uppercase">Tên sản phẩm</th>
                                                <th className="px-4 py-2.5 font-bold uppercase">SKU</th>
                                                <th className="px-4 py-2.5 font-bold uppercase">Loại</th>
                                                <th className="px-4 py-2.5 font-bold uppercase">Thương hiệu</th>
                                                <th className="px-4 py-2.5 font-bold uppercase text-right">Giá nhập</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-100">
                                            {products.map(p => (
                                                <tr key={p.productID} className="hover:bg-gray-50">
                                                    <td className="px-4 py-3 font-medium text-gray-800">{p.productName}</td>
                                                    <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.SKU}</td>
                                                    <td className="px-4 py-3 text-gray-600">{p.productTypeName}</td>
                                                    <td className="px-4 py-3 text-gray-600 font-medium">{p.brandName}</td>
                                                    <td className="px-4 py-3 text-right font-bold text-red-600">{formatCurrency(p.costPrice)}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>
                    </td>
                </tr>
            )}
        </>
    );
}

// COMPONENT CHÍNH: BẢNG
export function SupplierTable({ loading, suppliers, onAddBrandClick }: Props) {
    return (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead className="bg-blue-50/50 border-b border-gray-200">
                        <tr>
                            <th className="p-4 text-xs font-bold text-gray-600 uppercase w-16 text-center">ID</th>
                            <th className="p-4 text-xs font-bold text-gray-600 uppercase">Tên nhà cung cấp</th>
                            <th className="p-4 text-xs font-bold text-gray-600 uppercase">SĐT</th>
                            <th className="p-4 text-xs font-bold text-gray-600 uppercase">Địa chỉ</th>
                            <th className="p-4 text-xs font-bold text-gray-600 uppercase text-center w-40">Thao tác</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {loading ? (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-gray-500">
                                    <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-blue-500" />
                                    Đang tải dữ liệu...
                                </td>
                            </tr>
                        ) : suppliers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="p-10 text-center text-gray-500 italic">
                                    Không tìm thấy nhà cung cấp nào.
                                </td>
                            </tr>
                        ) : (
                            suppliers.map((supplier) => (
                                <SupplierRow 
                                    key={supplier.id} 
                                    supplier={supplier} 
                                    onAddBrandClick={onAddBrandClick} 
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}