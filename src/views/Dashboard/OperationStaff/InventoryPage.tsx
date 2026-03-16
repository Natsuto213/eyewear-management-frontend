import React, { useState, useEffect } from "react";
import { Search, Filter, Package, Eye, Layers } from "lucide-react";

// --- Types ---
interface BaseProduct {
  productId: number;
  productName: string;
  productTypeName: "Gọng kính" | "Tròng kính" | "Kính áp tròng";
  SKU: string;
  brandName: string;
  onHandQuantity: number;
  reservedQuantity: number;
  availableQuantity: number;
  isActive: boolean;
}

interface FrameProduct extends BaseProduct {
  productTypeName: "Gọng kính";
  frameMaterialName: string;
  frameShapeName: string;
}

interface LensProduct extends BaseProduct {
  productTypeName: "Tròng kính";
  lensTypeName: string;
  indexValue: number;
  isBlueLightBlock: boolean;
  isPhotochromic: boolean;
}

interface ContactLensProduct extends BaseProduct {
  productTypeName: "Kính áp tròng";
  usageType: string;
  lensMaterial: string;
  baseCurve: number;
  waterContent: number;
  replacementSchedule: string;
}

type Product = FrameProduct | LensProduct | ContactLensProduct;

// --- API ---
async function fetchProducts(token: string): Promise<Product[]> {
  const res = await fetch("https://api-eyewear.purintech.id.vn/api/inventory/products", {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) throw new Error("Không thể tải sản phẩm");

  const data = await res.json();
  if (data.code !== 1000) throw new Error(data.message || "Lỗi không xác định");
  return data.result as Product[];
}

// --- Badge helpers ---
const TYPE_CONFIG: Record<string, { icon: React.ReactNode; color: string; bg: string }> = {
  "Gọng kính": {
    icon: <Layers className="w-3.5 h-3.5" />,
    color: "text-indigo-700",
    bg: "bg-indigo-50 border-indigo-200",
  },
  "Tròng kính": {
    icon: <Eye className="w-3.5 h-3.5" />,
    color: "text-emerald-700",
    bg: "bg-emerald-50 border-emerald-200",
  },
  "Kính áp tròng": {
    icon: <Package className="w-3.5 h-3.5" />,
    color: "text-amber-700",
    bg: "bg-amber-50 border-amber-200",
  },
};

function TypeBadge({ type }: { type: string }) {
  const cfg = TYPE_CONFIG[type] ?? { icon: null, color: "text-gray-600", bg: "bg-gray-100 border-gray-200" };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-md border text-xs font-medium ${cfg.color} ${cfg.bg}`}>
      {cfg.icon}
      {type}
    </span>
  );
}

function BoolBadge({ value, trueLabel = "Có", falseLabel = "Không" }: { value: boolean; trueLabel?: string; falseLabel?: string }) {
  return value ? (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-50 text-green-700 border border-green-200">
      ✓ {trueLabel}
    </span>
  ) : (
    <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-50 text-gray-400 border border-gray-200">
      — {falseLabel}
    </span>
  );
}

// --- Extra info per product type ---
function ProductDetails({ product }: { product: Product }) {
  if (product.productTypeName === "Gọng kính") {
    return (
      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="bg-slate-100 px-2 py-0.5 rounded">{product.frameMaterialName}</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded">{product.frameShapeName}</span>
      </div>
    );
  }

  if (product.productTypeName === "Tròng kính") {
    return (
      <div className="flex flex-wrap items-center gap-2 text-xs text-gray-500">
        <span className="bg-slate-100 px-2 py-0.5 rounded">{product.lensTypeName}</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded">Index {product.indexValue}</span>
        <BoolBadge value={product.isBlueLightBlock} trueLabel="Chống ánh sáng xanh" falseLabel="Không chống AS xanh" />
        <BoolBadge value={product.isPhotochromic} trueLabel="Đổi màu" falseLabel="Không đổi màu" />
      </div>
    );
  }

  if (product.productTypeName === "Kính áp tròng") {
    return (
      <div className="flex flex-wrap gap-2 text-xs text-gray-500">
        <span className="bg-slate-100 px-2 py-0.5 rounded">{product.usageType}</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded">{product.lensMaterial}</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded">BC {product.baseCurve}</span>
        <span className="bg-slate-100 px-2 py-0.5 rounded">H₂O {product.waterContent}%</span>
        <span className="bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded">{product.replacementSchedule}</span>
      </div>
    );
  }

  return null;
}

// --- Quantity cell ---
function QuantityCell({ product }: { product: Product }) {
  const available = product.availableQuantity ?? 0;
  const onHand = product.onHandQuantity ?? 0;
  const reserved = product.reservedQuantity ?? 0;
  const pct = onHand > 0 ? Math.min(100, Math.round((available / onHand) * 100)) : 0;
  const color = available > 50 ? "bg-green-500" : available > 10 ? "bg-amber-400" : available > 0 ? "bg-red-400" : "bg-gray-300";

  return (
    <div className="text-right space-y-1">
      <p className={`text-lg font-bold ${available === 0 ? "text-gray-400" : "text-gray-800"}`}>
        {available.toLocaleString()}
      </p>
      <div className="w-24 h-1.5 bg-gray-100 rounded-full ml-auto overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400">
        {available === 0 ? <span className="text-red-400 font-medium">Hết hàng</span> : <>Đặt trước: {reserved} / Thực tế: {onHand}</>}
      </p>
    </div>
  );
}

// --- Main page ---
const PRODUCT_TYPES = ["Gọng kính", "Tròng kính", "Kính áp tròng"];

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token = localStorage.getItem("access_token");

  useEffect(() => {
    if (!token) {
      setError("Token không hợp lệ, vui lòng đăng nhập lại.");
      return;
    }

    const load = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await fetchProducts(token);
        setProducts(data);
        setFilteredProducts(data);
      } catch {
        setError("Không thể tải sản phẩm. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [token]);

  useEffect(() => {
    const q = search.toLowerCase();
    const filtered = products.filter((p) => {
      const matchType = selectedType ? p.productTypeName === selectedType : true;
      const matchSearch =
        p.productName?.toLowerCase().includes(q) ||
        p.SKU?.toLowerCase().includes(q) ||
        p.brandName?.toLowerCase().includes(q);
      return matchType && matchSearch;
    });
    setFilteredProducts(filtered);
  }, [selectedType, search, products]);

  // Counts per type
  const counts = PRODUCT_TYPES.reduce<Record<string, number>>((acc, t) => {
    acc[t] = products.filter((p) => p.productTypeName === t).length;
    return acc;
  }, {});

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Hàng trong kho</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {products.length} sản phẩm tổng cộng
            </p>
          </div>

          {/* Quick stats */}
          <div className="hidden md:flex items-center gap-3">
            {PRODUCT_TYPES.map((t) => {
              const cfg = TYPE_CONFIG[t];
              return (
                <button
                  key={t}
                  onClick={() => setSelectedType(selectedType === t ? "" : t)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all
                    ${selectedType === t
                      ? `${cfg.bg} ${cfg.color} border-current shadow-sm`
                      : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                    }`}
                >
                  {cfg.icon}
                  {t}
                  <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${selectedType === t ? "bg-white/60" : "bg-gray-100"}`}>
                    {counts[t] ?? 0}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center gap-3 py-16 text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm">Đang tải sản phẩm...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">
            {error}
          </div>
        )}

        {!loading && !error && (
          <>
            {/* Search & Filter */}
            <div className="flex flex-wrap items-center gap-3 mb-5">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Tìm theo tên, SKU, thương hiệu..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white w-72 shadow-sm"
                />
              </div>

              <div className="relative md:hidden">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <select
                  value={selectedType}
                  onChange={(e) => setSelectedType(e.target.value)}
                  className="pl-9 pr-8 py-2.5 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 bg-white shadow-sm cursor-pointer"
                >
                  <option value="">Tất cả phân loại</option>
                  {PRODUCT_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {(search || selectedType) && (
                <span className="text-sm text-gray-500">
                  {filteredProducts.length} kết quả
                  {selectedType && <span className="ml-1 text-indigo-600 font-medium">trong {selectedType}</span>}
                </span>
              )}

              {(search || selectedType) && (
                <button
                  onClick={() => { setSearch(""); setSelectedType(""); }}
                  className="text-xs text-gray-400 hover:text-gray-600 underline"
                >
                  Xoá bộ lọc
                </button>
              )}
            </div>

            {/* Table */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead>
                    <tr className="border-b border-gray-100 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      <th className="px-5 py-3.5">Sản phẩm</th>
                      <th className="px-5 py-3.5">SKU</th>
                      <th className="px-5 py-3.5">Thương hiệu</th>
                      <th className="px-5 py-3.5">Loại</th>
                      <th className="px-5 py-3.5">Thông số</th>
                      <th className="px-5 py-3.5 text-right">Tồn kho</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {filteredProducts.length > 0 ? (
                      filteredProducts.map((product) => (
                        <tr
                          key={product.productId}
                          className="hover:bg-indigo-50/40 transition-colors"
                        >
                          <td className="px-5 py-4">
                            <p className="font-medium text-gray-900 leading-snug">{product.productName}</p>
                          </td>
                          <td className="px-5 py-4">
                            <code className="text-xs bg-indigo-50 text-indigo-600 px-2 py-1 rounded font-mono">
                              {product.SKU}
                            </code>
                          </td>
                          <td className="px-5 py-4 text-gray-700 font-medium">{product.brandName}</td>
                          <td className="px-5 py-4">
                            <TypeBadge type={product.productTypeName} />
                          </td>
                          <td className="px-5 py-4 max-w-xs">
                            <ProductDetails product={product} />
                          </td>
                          <td className="px-5 py-4">
                            <QuantityCell product={product} />
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={6} className="text-center py-16 text-gray-400">
                          <Package className="w-10 h-10 mx-auto mb-3 opacity-30" />
                          <p>Không tìm thấy sản phẩm nào</p>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              {filteredProducts.length > 0 && (
                <div className="px-5 py-3 border-t border-gray-100 bg-gray-50 text-xs text-gray-400 flex justify-between">
                  <span>Hiển thị {filteredProducts.length} / {products.length} sản phẩm</span>
                  <span>Số lượng hiển thị: khả dụng (onHand − reserved)</span>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}