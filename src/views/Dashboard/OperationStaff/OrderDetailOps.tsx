import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import { ArrowLeft, Phone, Mail, MapPin, User, Package, CheckCircle2, Clock, XCircle, Truck, Eye } from "lucide-react";
import { motion } from "framer-motion";

export default function OrderDetail() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== "undefined"
      ? localStorage.getItem("access_token")
      : null;

  useEffect(() => {
    const fetchOrder = async () => {
      if (!token) {
        setError("Phiên đăng nhập hết hạn.");
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        const res = await fetch(
          `https://api-eyewear.purintech.id.vn/api/operation-staff/orders/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const data = await res.json();
        if (data.code === 1000) {
          setOrder(data.result);
        } else {
          setError("Không tìm thấy đơn hàng.");
        }
      } catch (err: any) {
        setError(err.message || "Không thể tải chi tiết đơn hàng.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId, token]);

  const formatDate = (dateString: string) => {
    if (!dateString) return "---";
    const date = new Date(dateString);
    return isNaN(date.getTime()) ? "---" : date.toLocaleString("vi-VN");
  };

  const formatCurrency = (value: number) => {
    if (value === undefined || value === null) return "0 ₫";
    return value.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
  };

  const statusConfig: Record<string, { bg: string; text: string; icon: any; label: string }> = {
    PROCESSING: { 
      bg: "bg-gradient-to-r from-amber-100 to-yellow-100", 
      text: "text-amber-800", 
      icon: Clock,
      label: "Đang xử lý"
    },
    CONFIRMED: { 
      bg: "bg-gradient-to-r from-blue-100 to-cyan-100", 
      text: "text-blue-800", 
      icon: CheckCircle2,
      label: "Đã xác nhận"
    },
    COMPLETED: { 
      bg: "bg-gradient-to-r from-emerald-100 to-green-100", 
      text: "text-emerald-800", 
      icon: CheckCircle2,
      label: "Hoàn thành"
    },
    CANCELED: { 
      bg: "bg-gradient-to-r from-red-100 to-rose-100", 
      text: "text-red-800", 
      icon: XCircle,
      label: "Đã hủy"
    },
    READY: { 
      bg: "bg-gradient-to-r from-violet-100 to-purple-100", 
      text: "text-violet-800", 
      icon: CheckCircle2,
      label: "Sẵn sàng"
    },
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center"
        >
          <div className="relative">
            <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-indigo-200"></div>
            <div className="absolute inset-0 inline-block animate-spin rounded-full h-16 w-16 border-4 border-t-indigo-600 border-r-transparent border-b-transparent border-l-transparent"></div>
          </div>
          <p className="text-gray-600 mt-4 font-medium">Đang tải chi tiết đơn hàng...</p>
        </motion.div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-pink-50 to-rose-50">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md"
        >
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <XCircle className="w-8 h-8 text-red-600" />
          </div>
          <p className="text-red-600 font-semibold text-lg mb-6">
            {error || "Không tìm thấy đơn hàng"}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all shadow-lg hover:shadow-xl font-medium"
          >
            Quay lại
          </button>
        </motion.div>
      </div>
    );
  }

  const hasOrderDetail = order.orderDetail && order.orderDetail.length > 0;
  const hasPrescription = order.prescriptionOrderDetail && order.prescriptionOrderDetail.length > 0;
  const statusInfo = statusConfig[order.orderStatus] || { 
    bg: "bg-gray-100", 
    text: "text-gray-800", 
    icon: Package,
    label: order.orderStatus 
  };
  const StatusIcon = statusInfo.icon;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:text-indigo-600 transition-all font-medium bg-white rounded-xl shadow-sm hover:shadow-md"
          >
            <ArrowLeft className="w-5 h-5" /> Quay lại
          </button>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
            Chi tiết đơn hàng
          </h1>
        </motion.div>

        {/* Thông tin chung với gradient đẹp */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl shadow-xl border border-indigo-100 overflow-hidden mb-6"
        >
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <div className="flex flex-wrap justify-between items-start gap-4">
              <div>
                <p className="text-indigo-100 text-xs uppercase font-semibold mb-2">Mã đơn hàng</p>
                <p className="text-3xl font-bold text-white mb-1">{order.orderCode}</p>
                <div className="flex items-center gap-2 text-indigo-100">
                  <Clock className="w-4 h-4" />
                  <p className="text-sm">{formatDate(order.orderDate)}</p>
                </div>
              </div>
              <div className="flex gap-3 flex-wrap">
                <div className={`px-4 py-2 rounded-xl ${statusInfo.bg} shadow-md flex items-center gap-2`}>
                  <StatusIcon className={`w-4 h-4 ${statusInfo.text}`} />
                  <span className={`text-sm font-bold ${statusInfo.text}`}>
                    {statusInfo.label}
                  </span>
                </div>
                <div className="px-4 py-2 rounded-xl bg-gradient-to-r from-pink-100 to-rose-100 text-pink-800 text-sm font-bold shadow-md">
                  {order.orderType}
                </div>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                  <Truck className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase font-semibold">Vận chuyển</p>
                  <p className="font-semibold text-gray-800">{order.shippingStatus}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Tổng tiền</p>
                <p className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  {formatCurrency(order.totalAmount)}
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Thông tin khách hàng */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-blue-500 to-cyan-500 p-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <User className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg">Thông tin khách hàng</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Họ tên</p>
                <p className="font-bold text-gray-900 text-lg">{order.customerName}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-blue-600" />
                </div>
                <span>{order.customerPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-blue-600" />
                </div>
                <span className="break-all">{order.customerEmail}</span>
              </div>
            </div>
          </motion.div>

          {/* Thông tin giao hàng */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-2xl shadow-lg border border-purple-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-purple-500 to-pink-500 p-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <MapPin className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg">Thông tin giao hàng</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Người nhận</p>
                <p className="font-bold text-gray-900 text-lg">{order.recipientName}</p>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Phone className="w-4 h-4 text-purple-600" />
                </div>
                <span>{order.recipientPhone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-700">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center">
                  <Mail className="w-4 h-4 text-purple-600" />
                </div>
                <span className="break-all">{order.recipientEmail}</span>
              </div>
              <div className="flex items-start gap-3 text-gray-700">
                <div className="w-8 h-8 bg-purple-50 rounded-lg flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4 text-purple-600" />
                </div>
                <span className="leading-relaxed">{order.recipientAddress}</span>
              </div>
              {order.note && (
                <div className="pt-4 border-t border-gray-100">
                  <p className="text-xs text-gray-500 uppercase font-semibold mb-2">Ghi chú</p>
                  <p className="text-sm text-gray-700 bg-amber-50 p-3 rounded-lg border border-amber-200">
                    📝 {order.note}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        </div>

        {/* Sản phẩm thường */}
        {hasOrderDetail && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-2xl shadow-lg border border-green-100 overflow-hidden mb-6 hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Package className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg">Sản phẩm</h2>
              </div>
            </div>
            <div className="p-6 space-y-4">
              {order.orderDetail.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200 hover:shadow-md transition-all"
                >
                  {item.img && (
                    <div className="w-20 h-20 rounded-xl overflow-hidden shadow-md">
                      <img 
                        src={item.img} 
                        alt={item.name} 
                        className="w-full h-full object-cover hover:scale-110 transition-transform" 
                      />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-gray-900 text-lg mb-1">{item.name}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded-full font-semibold">
                        SL: {item.quantity}
                      </span>
                    </div>
                  </div>
                  <p className="text-xl font-bold text-green-600">{formatCurrency(item.totalPrice)}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Đơn kính thuốc */}
        {hasPrescription && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white rounded-2xl shadow-lg border border-indigo-100 overflow-hidden hover:shadow-xl transition-shadow"
          >
            <div className="bg-gradient-to-r from-indigo-500 to-purple-500 p-4">
              <div className="flex items-center gap-3 text-white">
                <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                  <Eye className="w-5 h-5" />
                </div>
                <h2 className="font-bold text-lg">Đơn kính thuốc</h2>
              </div>
            </div>
            <div className="p-6 space-y-6">
              {order.prescriptionOrderDetail.map((item: any, index: number) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.1 * index }}
                  className="border-2 border-indigo-100 rounded-2xl p-6 bg-gradient-to-br from-indigo-50 to-purple-50 hover:border-indigo-300 transition-all"
                >
                  {/* Gọng + Tròng */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    {/* Gọng */}
                    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-xs text-indigo-600 uppercase font-bold mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-indigo-100 rounded-md flex items-center justify-center">
                          👓
                        </div>
                        Gọng kính
                      </p>
                      <div className="flex gap-4 items-start">
                        {item.frameImg && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md">
                            <img 
                              src={item.frameImg} 
                              alt={item.frameName} 
                              className="w-full h-full object-cover hover:scale-110 transition-transform" 
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-2">{item.frameName}</p>
                          <p className="text-lg font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                            {formatCurrency(item.framePrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tròng */}
                    <div className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow">
                      <p className="text-xs text-purple-600 uppercase font-bold mb-3 flex items-center gap-2">
                        <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                          🔍
                        </div>
                        Tròng kính
                      </p>
                      <div className="flex gap-4 items-start">
                        {item.lensImg && (
                          <div className="w-20 h-20 rounded-lg overflow-hidden shadow-md">
                            <img 
                              src={item.lensImg} 
                              alt={item.lensName} 
                              className="w-full h-full object-cover hover:scale-110 transition-transform" 
                            />
                          </div>
                        )}
                        <div className="flex-1">
                          <p className="font-bold text-gray-900 mb-2">{item.lensName}</p>
                          <p className="text-lg font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                            {formatCurrency(item.lensPrice)}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Thông số mắt */}
                  <div className="bg-white rounded-xl p-5 shadow-sm">
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-500 rounded-lg flex items-center justify-center">
                        <Eye className="w-4 h-4 text-white" />
                      </div>
                      <p className="text-sm text-gray-700 uppercase font-bold">Thông số mắt</p>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b-2 border-indigo-200">
                            <th className="py-3 px-2 text-left font-bold text-gray-700">Mắt</th>
                            <th className="py-3 px-2 text-center font-bold text-indigo-600">SPH</th>
                            <th className="py-3 px-2 text-center font-bold text-indigo-600">CYL</th>
                            <th className="py-3 px-2 text-center font-bold text-indigo-600">AXIS</th>
                            <th className="py-3 px-2 text-center font-bold text-indigo-600">ADD</th>
                            <th className="py-3 px-2 text-center font-bold text-indigo-600">PD</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-indigo-100 bg-blue-50/50 hover:bg-blue-100/50 transition-colors">
                            <td className="py-3 px-2 font-bold text-gray-900">👁️ Phải (R)</td>
                            <td className="py-3 px-2 text-center text-gray-700 font-semibold">{item.rightEyeSph ?? "---"}</td>
                            <td className="py-3 px-2 text-center text-gray-700 font-semibold">{item.rightEyeCyl ?? "---"}</td>
                            <td className="py-3 px-2 text-center text-gray-700 font-semibold">{item.rightEyeAxis ?? "---"}</td>
                            <td className="py-3 px-2 text-center text-gray-700 font-semibold">{item.rightEyeAdd ?? "---"}</td>
                            <td className="py-3 px-2 text-center text-gray-700 font-semibold">{item.rightPD ?? "---"}</td>
                          </tr>
                          <tr className="bg-purple-50/50 hover:bg-purple-100/50 transition-colors">
                            <td className="py-3 px-2 font-bold text-gray-900">👁️ Trái (L)</td>
                            <td className="py-3 px-2 text-center text-gray-700 font-semibold">{item.leftEyeSph ?? "---"}</td>
                            <td className="py-3 px-2 text-center text-gray-700 font-semibold">{item.leftEyeCyl ?? "---"}</td>
                            <td className="py-3 px-2 text-center text-gray-700 font-semibold">{item.leftEyeAxis ?? "---"}</td>
                            <td className="py-3 px-2 text-center text-gray-700 font-semibold">{item.leftEyeAdd ?? "---"}</td>
                            <td className="py-3 px-2 text-center text-gray-700 font-semibold">{item.leftPD ?? "---"}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Tổng giá */}
                  <div className="mt-6 flex justify-between items-center bg-white rounded-xl p-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <span className="text-sm bg-indigo-200 text-indigo-800 px-3 py-1 rounded-full font-semibold">
                        Số lượng: {item.quantity}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-xs text-gray-500 uppercase font-semibold mb-1">Thành tiền</p>
                      <p className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        {formatCurrency(item.totalPrice)}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

      </div>
    </div>
  );
}
