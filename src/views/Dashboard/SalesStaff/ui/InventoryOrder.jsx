import React, { useState, useEffect } from 'react';
import { api } from '../../../../lib/ApiService'; // Đảm bảo đường dẫn này đúng với dự án của bạn

const InventoryOrder = () => {
    const [inventory, setInventory] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState("Gọng kính");
    const [searchTerm, setSearchTerm] = useState("");

    // Danh sách các loại sản phẩm để làm Tab
    const tabs = ["Gọng kính", "Tròng kính", "Kính áp tròng"];

    const fetchInventory = async () => {
        try {
            const res = await api.get("api/inventory/products");
            if (res.data.code === 1000) {
                setInventory(res.data.result);
            }
        } catch (err) {
            console.error("Lỗi gọi API quản lý kho:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchInventory();
    }, []);

    // Logic lọc: Theo Tab và theo từ khóa tìm kiếm
    const filteredData = inventory.filter(item => {
        const matchesTab = item.productTypeName === activeTab;
        const matchesSearch =
            item.productName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.SKU.toLowerCase().includes(searchTerm.toLowerCase()) ||
            item.brandName.toLowerCase().includes(searchTerm.toLowerCase());

        return matchesTab && matchesSearch;
    });

    if (loading) return <div className="p-10 text-center text-gray-500">Đang tải dữ liệu kho...</div>;

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h2 className="mb-6 text-2xl font-bold text-gray-800">Quản lý Tồn kho Sản phẩm</h2>

            {/* Thanh tìm kiếm và Tabs */}
            <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="flex space-x-2 rounded-lg bg-gray-200 p-1">
                    {tabs.map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`rounded-md px-4 py-2 text-sm font-medium transition-all ${activeTab === tab
                                ? "bg-white text-blue-600 shadow"
                                : "text-gray-600 hover:bg-gray-300"
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="relative">
                    <input
                        type="text"
                        placeholder="Tìm tên, SKU, thương hiệu..."
                        className="w-full rounded-lg border border-gray-300 px-4 py-2 pl-10 focus:outline-none focus:ring-2 focus:ring-blue-400 md:w-80"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                    <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
                </div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-hidden rounded-xl bg-white shadow-md">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">Sản phẩm</th>
                                <th className="px-6 py-3 text-left text-xs font-semibold uppercase text-gray-500">SKU / Brand</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">Đặc tính</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">Tồn thực tế</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">Giữ chỗ (Reserve)</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">Khả dụng</th>
                                <th className="px-6 py-3 text-center text-xs font-semibold uppercase text-gray-500">Trạng thái</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100 bg-white">
                            {filteredData.length > 0 ? (
                                filteredData.map((item) => (
                                    <tr key={item.productId} className="hover:bg-gray-50">
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-medium text-gray-900">{item.productName}</div>
                                            <div className="text-xs text-gray-400">ID: {item.productId}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm text-gray-700 font-mono">{item.SKU}</div>
                                            <div className="text-xs text-blue-500">{item.brandName}</div>
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm text-gray-600">
                                            {/* Hiển thị đặc tính tùy theo loại sản phẩm */}
                                            {item.productTypeName === "Gọng kính" && `${item.frameMaterialName} - ${item.frameShapeName}`}
                                            {item.productTypeName === "Tròng kính" && `Chiết suất: ${item.indexValue}`}
                                            {item.productTypeName === "Kính áp tròng" && `BC: ${item.baseCurve} - Hạn: ${item.replacementSchedule}`}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-semibold text-gray-800">
                                            {item.onHandQuantity}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-bold">
                                            {item.reservedQuantity}
                                        </td>
                                        <td className="px-6 py-4 text-center text-sm font-bold text-blue-600">
                                            {item.availableQuantity}
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            {item.availableQuantity > 0 ? (
                                                <span className="inline-flex rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-800">
                                                    Còn hàng
                                                </span>
                                            ) : (
                                                <span className="inline-flex rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-medium text-red-800">
                                                    Hết hàng
                                                </span>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="6" className="py-10 text-center text-gray-400">
                                        Không tìm thấy sản phẩm nào trong kho.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="mt-4 text-sm text-gray-500">
                Hiển thị <span className="font-bold text-gray-700">{filteredData.length}</span> sản phẩm thuộc loại <span className="italic">{activeTab}</span>
            </div>
        </div>
    );
};

export default InventoryOrder;