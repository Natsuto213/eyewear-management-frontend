import { Package } from 'lucide-react';
import { ImageWithFallback } from '@/components/ImageWithFallback';

export const TopProductsTable = ({ topProducts }: any) => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-100 bg-gray-50/50">
                <h2 className="text-base text-gray-800 font-bold">Top mặt hàng bán chạy nhất</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                    <thead className="text-xs text-gray-500 bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 font-semibold rounded-tl-xl">Xếp hạng</th>
                            <th className="px-6 py-3 font-semibold">Sản phẩm</th>
                            <th className="px-6 py-3 font-semibold text-right">Đơn giá</th>
                            <th className="px-6 py-3 font-semibold text-right rounded-tr-xl">Đã bán</th>
                        </tr>
                    </thead>
                    <tbody>
                        {topProducts && topProducts.length > 0 ? (
                            topProducts.map((product: any, index: number) => (
                                <tr key={product.id} className="border-b border-gray-50 hover:bg-purple-50/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full font-bold text-xs ${
                                            index === 0 ? 'bg-yellow-100 text-yellow-600' :
                                            index === 1 ? 'bg-gray-200 text-gray-600' :
                                            index === 2 ? 'bg-amber-100 text-amber-700' :
                                            'bg-gray-100 text-gray-500'
                                        }`}>
                                            #{index + 1}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 flex items-center gap-3">
                                        <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden bg-white shrink-0">
                                            <ImageWithFallback src={product.image} alt={product.name} className="w-full h-full object-cover" />
                                        </div>
                                        <span className="font-semibold text-gray-800">{product.name}</span>
                                    </td>
                                    <td className="px-6 py-4 text-right font-medium text-gray-600">
                                        {product.price.toLocaleString('vi-VN')} ₫
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <span className="inline-flex items-center gap-1 font-bold text-purple-600 bg-purple-50 px-2.5 py-1 rounded-full">
                                            {product.sold} <Package className="w-3 h-3" />
                                        </span>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan={4} className="px-6 py-8 text-center text-gray-400">
                                    Chưa có sản phẩm nào được bán ra
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};