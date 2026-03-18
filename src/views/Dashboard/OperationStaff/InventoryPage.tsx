import React, { useState, useEffect, useMemo } from "react";
import { Search, Filter, Package, Eye, Layers, ChevronLeft, ChevronRight, RefreshCcw, AlertCircle, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

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

function QuantityCell({ product }: { product: Product }) {
  const available = product.availableQuantity ?? 0;
  const onHand = product.onHandQuantity ?? 0;
  const reserved = product.reservedQuantity ?? 0;
  const pct = onHand > 0 ? Math.min(100, Math.round((available / onHand) * 100)) : 0;
  const color =
    available > 50 ? "bg-green-500" :
    available > 10 ? "bg-amber-400" :
    available > 0  ? "bg-red-400"   : "bg-gray-300";

  return (
    <div className="text-right space-y-1">
      <p className={`text-lg font-bold ${available === 0 ? "text-gray-400" : "text-gray-800"}`}>
        {available.toLocaleString()}
      </p>
      <div className="w-24 h-1.5 bg-gray-100 rounded-full ml-auto overflow-hidden">
        <div className={`h-full rounded-full ${color} transition-all`} style={{ width: `${pct}%` }} />
      </div>
      <p className="text-[10px] text-gray-400">
        {available === 0
          ? <span className="text-red-400 font-medium">Hết hàng</span>
          : <>Đặt trước: {reserved} / Thực tế: {onHand}</>
        }
      </p>
    </div>
  );
}

// --- Constants ---
const PAGE_SIZE = 10;
const PRODUCT_TYPES = ["Gọng kính", "Tròng kính", "Kính áp tròng"];

// --- Main page ---
export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedType, setSelectedType] = useState<string>("");
  const [showOutOfStock, setShowOutOfStock] = useState(false);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(0);

  const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;

  const loadData = async () => {
    if (!token) { setError("Token không hợp lệ, vui lòng đăng nhập lại."); return; }
    setLoading(true);
    setError(null);
    try {
      setProducts(await fetchProducts(token));
    } catch {
      setError("Không thể tải sản phẩm. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, [token]);

  // Reset trang về 0 khi filter thay đổi
  useEffect(() => { setCurrentPage(0); }, [selectedType, search, showOutOfStock]);

  const outOfStockCount = useMemo(
    () => products.filter((p) => (p.availableQuantity ?? 0) === 0).length,
    [products]
  );

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase();
    return products.filter((p) => {
      const matchType = selectedType ? p.productTypeName === selectedType : true;
      const matchOutOfStock = showOutOfStock ? (p.availableQuantity ?? 0) === 0 : true;
      const matchSearch =
        p.productName?.toLowerCase().includes(q) ||
        p.SKU?.toLowerCase().includes(q) ||
        p.brandName?.toLowerCase().includes(q);
      return matchType && matchOutOfStock && matchSearch;
    });
  }, [selectedType, showOutOfStock, search, products]);

  const totalPages = Math.ceil(filteredProducts.length / PAGE_SIZE);
  const pagedProducts = filteredProducts.slice(
    currentPage * PAGE_SIZE,
    (currentPage + 1) * PAGE_SIZE
  );

  const counts = PRODUCT_TYPES.reduce<Record<string, number>>((acc, t) => {
    acc[t] = products.filter((p) => p.productTypeName === t).length;
    return acc;
  }, {});

  const pageNumbers = () => {
    const pages: (number | "...")[] = [];
    if (totalPages <= 7) {
      for (let i = 0; i < totalPages; i++) pages.push(i);
    } else {
      pages.push(0);
      if (currentPage > 2) pages.push("...");
      for (
        let i = Math.max(1, currentPage - 1);
        i <= Math.min(totalPages - 2, currentPage + 1);
        i++
      ) {
        pages.push(i);
      }
      if (currentPage < totalPages - 3) pages.push("...");
      pages.push(totalPages - 1);
    }
    return pages;
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2">
              Hàng trong kho
            </h1>
            <p className="text-sm text-gray-500">
              Tổng cộng <span className="font-bold text-indigo-600">{products.length}</span> sản phẩm
            </p>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            {/* Quick type filter buttons */}
            <div className="hidden md:flex items-center gap-2">
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

              {/* Nút lọc Hết hàng */}
              <button
                onClick={() => setShowOutOfStock((v) => !v)}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg border text-sm font-medium transition-all
                  ${showOutOfStock
                    ? "bg-red-50 border-red-300 text-red-700 shadow-sm"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                  }`}
              >
                <AlertTriangle className="w-3.5 h-3.5" />
                Hết hàng
                <span className={`ml-1 text-xs px-1.5 py-0.5 rounded-full ${showOutOfStock ? "bg-red-100 text-red-700" : "bg-gray-100 text-gray-500"}`}>
                  {outOfStockCount}
                </span>
              </button>
            </div>

            {/* Refresh button */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={loadData}
              disabled={loading}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl hover:from-indigo-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl font-semibold flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCcw className={`w-5 h-5 ${loading ? "animate-spin" : ""}`} />
              Làm mới
            </motion.button>
          </div>
        </motion.div>

        {/* Loading */}
        {loading && (
          <div className="flex justify-center items-center gap-3 py-16 text-gray-400">
            <div className="w-6 h-6 border-2 border-gray-200 border-t-indigo-500 rounded-full animate-spin" />
            <span className="text-sm">Đang tải sản phẩm...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-gradient-to-r from-red-100 to-rose-100 border-2 border-red-300 rounded-2xl p-5 shadow-lg"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-200 rounded-xl flex items-center justify-center">
                <AlertCircle className="w-6 h-6 text-red-700" />
              </div>
              <div>
                <p className="text-red-700 font-bold text-lg">Lỗi tải dữ liệu</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {!loading && !error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
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

              {/* Mobile filter */}
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

              {/* Mobile: nút hết hàng */}
              <button
                onClick={() => setShowOutOfStock((v) => !v)}
                className={`md:hidden flex items-center gap-2 px-3 py-2.5 rounded-lg border text-sm font-medium transition-all
                  ${showOutOfStock
                    ? "bg-red-50 border-red-300 text-red-700"
                    : "bg-white text-gray-600 border-gray-200"
                  }`}
              >
                <AlertTriangle className="w-4 h-4" />
                Hết hàng ({outOfStockCount})
              </button>

              {(search || selectedType || showOutOfStock) && (
                <span className="text-sm text-gray-500">
                  {filteredProducts.length} kết quả
                  {selectedType && <span className="ml-1 text-indigo-600 font-medium">trong {selectedType}</span>}
                  {showOutOfStock && <span className="ml-1 text-red-500 font-medium">· hết hàng</span>}
                </span>
              )}

              {(search || selectedType || showOutOfStock) && (
                <button
                  onClick={() => { setSearch(""); setSelectedType(""); setShowOutOfStock(false); }}
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
                    {pagedProducts.length > 0 ? (
                      pagedProducts.map((product) => (
                        <tr
                          key={product.productId}
                          className={`hover:bg-indigo-50/40 transition-colors ${
                            (product.availableQuantity ?? 0) === 0 ? "bg-red-50/30" : ""
                          }`}
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
                  <span>Hiển thị {pagedProducts.length} / {filteredProducts.length} sản phẩm</span>
                  <span>Số lượng hiển thị: khả dụng (onHand − reserved)</span>
                </div>
              )}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 flex items-center justify-between flex-wrap gap-4"
              >
                {/* Info */}
                <p className="text-sm text-gray-500">
                  Trang{" "}
                  <span className="font-bold text-indigo-600">{currentPage + 1}</span>{" "}
                  / {totalPages} · Hiển thị{" "}
                  <span className="font-bold">{pagedProducts.length}</span> /{" "}
                  <span className="font-bold">{filteredProducts.length}</span> sản phẩm
                </p>

                {/* Buttons */}
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                    disabled={currentPage === 0}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border-2 border-indigo-100 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" /> Trước
                  </motion.button>

                  <div className="flex items-center gap-1">
                    {pageNumbers().map((page, idx) =>
                      page === "..." ? (
                        <span key={`ellipsis-${idx}`} className="px-2 text-gray-400 font-bold">
                          ...
                        </span>
                      ) : (
                        <motion.button
                          key={page}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setCurrentPage(page as number)}
                          className={`w-9 h-9 rounded-xl font-bold text-sm transition-all shadow-sm
                            ${currentPage === page
                              ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                              : "bg-white border-2 border-indigo-100 text-gray-600 hover:bg-indigo-50"
                            }`}
                        >
                          {(page as number) + 1}
                        </motion.button>
                      )
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={currentPage >= totalPages - 1}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-white border-2 border-indigo-100 text-indigo-600 font-semibold text-sm hover:bg-indigo-50 transition-all shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Tiếp <ChevronRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </div>
    </div>
  );
}