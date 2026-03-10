import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Phone, Mail, MapPin, User, Package } from "lucide-react";

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

  const statusColors: Record<string, string> = {
    PROCESSING: "bg-yellow-100 text-yellow-800",
    CONFIRMED: "bg-blue-100 text-blue-800",
    COMPLETED: "bg-green-100 text-green-800",
    CANCELED: "bg-red-100 text-red-800",
    READY: "bg-indigo-100 text-indigo-800",
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-blue-500 border-t-transparent mb-3"></div>
          <p className="text-gray-400 italic">Đang tải chi tiết đơn hàng...</p>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <p className="text-red-500 font-medium mb-4">⚠️ {error || "Không tìm thấy đơn hàng"}</p>
          <button
            onClick={() => navigate(-1)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Quay lại
          </button>
        </div>
      </div>
    );
  }

  const hasOrderDetail = order.orderDetail && order.orderDetail.length > 0;
  const hasPrescription = order.prescriptionOrderDetail && order.prescriptionOrderDetail.length > 0;

  return (
    <div className="min-h-screen p-6 bg-gray-50">
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-gray-500 hover:text-blue-600 transition font-medium"
          >
            <ArrowLeft className="w-5 h-5" /> Quay lại
          </button>
          <h1 className="text-2xl font-bold text-gray-800">Chi tiết đơn hàng</h1>
        </div>

        {/* Thông tin chung */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
          <div className="flex flex-wrap justify-between items-start gap-4">
            <div>
              <p className="text-xs text-gray-400 uppercase font-semibold mb-1">Mã đơn</p>
              <p className="text-xl font-bold text-blue-600">{order.orderCode}</p>
              <p className="text-sm text-gray-500 mt-1">{formatDate(order.orderDate)}</p>
            </div>
            <div className="flex gap-3">
              <span className={`px-3 py-1 rounded-full text-xs font-bold ${statusColors[order.orderStatus] || "bg-gray-100 text-gray-800"}`}>
                {order.orderStatus}
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800">
                {order.orderType}
              </span>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
            <p className="text-sm text-gray-500">Trạng thái vận chuyển: <span className="font-semibold text-gray-700">{order.shippingStatus}</span></p>
            <p className="text-lg font-bold text-gray-900">Tổng: {formatCurrency(order.totalAmount)}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Thông tin khách hàng */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <User className="w-4 h-4 text-blue-500" /> Thông tin khách hàng
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">{order.customerName}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{order.customerPhone}</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{order.customerEmail}</p>
            </div>
          </div>

          {/* Thông tin giao hàng */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <MapPin className="w-4 h-4 text-blue-500" /> Thông tin giao hàng
            </h2>
            <div className="space-y-2 text-sm text-gray-600">
              <p className="font-semibold text-gray-800">{order.recipientName}</p>
              <p className="flex items-center gap-2"><Phone className="w-4 h-4 text-gray-400" />{order.recipientPhone}</p>
              <p className="flex items-center gap-2"><Mail className="w-4 h-4 text-gray-400" />{order.recipientEmail}</p>
              <p className="flex items-start gap-2"><MapPin className="w-4 h-4 text-gray-400 mt-0.5 shrink-0" />{order.recipientAddress}</p>
            </div>
            {order.note && (
              <p className="mt-3 pt-3 border-t border-gray-100 text-xs text-gray-500 italic">📝 {order.note}</p>
            )}
          </div>
        </div>

        {/* Sản phẩm thường */}
        {hasOrderDetail && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-blue-500" /> Sản phẩm
            </h2>
            <div className="space-y-3">
              {order.orderDetail.map((item: any, index: number) => (
                <div key={index} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                  {item.img && <img src={item.img} alt={item.name} className="w-16 h-16 object-cover rounded-lg border" />}
                  <div className="flex-1">
                    <p className="font-semibold text-gray-800">{item.name}</p>
                    <p className="text-sm text-gray-500">SL: {item.quantity}</p>
                  </div>
                  <p className="font-bold text-gray-900">{formatCurrency(item.totalPrice)}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Đơn kính thuốc */}
        {hasPrescription && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4">
            <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
              <Package className="w-4 h-4 text-purple-500" /> Đơn kính thuốc
            </h2>
            {order.prescriptionOrderDetail.map((item: any, index: number) => (
              <div key={index} className="border border-gray-100 rounded-xl p-4 mb-4 last:mb-0">

                {/* Gọng + Tròng */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  {/* Gọng */}
                  <div className="flex gap-3 items-start">
                    {item.frameImg && <img src={item.frameImg} alt={item.frameName} className="w-16 h-16 object-cover rounded-lg border" />}
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">Gọng</p>
                      <p className="font-semibold text-gray-800">{item.frameName}</p>
                      <p className="text-sm text-blue-600 font-bold">{formatCurrency(item.framePrice)}</p>
                    </div>
                  </div>
                  {/* Tròng */}
                  <div className="flex gap-3 items-start">
                    {item.lensImg && <img src={item.lensImg} alt={item.lensName} className="w-16 h-16 object-cover rounded-lg border" />}
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-semibold">Tròng kính</p>
                      <p className="font-semibold text-gray-800">{item.lensName}</p>
                      <p className="text-sm text-blue-600 font-bold">{formatCurrency(item.lensPrice)}</p>
                    </div>
                  </div>
                </div>

                {/* Thông số mắt */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <p className="text-xs text-gray-400 uppercase font-semibold mb-3">Thông số mắt</p>
                  <table className="w-full text-sm text-center">
                    <thead>
                      <tr className="text-gray-500">
                        <th className="py-1 text-left">Mắt</th>
                        <th className="py-1">SPH</th>
                        <th className="py-1">CYL</th>
                        <th className="py-1">AXIS</th>
                        <th className="py-1">ADD</th>
                        <th className="py-1">PD</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      <tr>
                        <td className="py-2 text-left font-semibold text-gray-700">Phải (R)</td>
                        <td className="py-2">{item.rightEyeSph ?? "---"}</td>
                        <td className="py-2">{item.rightEyeCyl ?? "---"}</td>
                        <td className="py-2">{item.rightEyeAxis ?? "---"}</td>
                        <td className="py-2">{item.rightEyeAdd ?? "---"}</td>
                        <td className="py-2">{item.rightPD ?? "---"}</td>
                      </tr>
                      <tr>
                        <td className="py-2 text-left font-semibold text-gray-700">Trái (L)</td>
                        <td className="py-2">{item.leftEyeSph ?? "---"}</td>
                        <td className="py-2">{item.leftEyeCyl ?? "---"}</td>
                        <td className="py-2">{item.leftEyeAxis ?? "---"}</td>
                        <td className="py-2">{item.leftEyeAdd ?? "---"}</td>
                        <td className="py-2">{item.leftPD ?? "---"}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-3 flex justify-between items-center">
                  <p className="text-sm text-gray-500">Số lượng: <span className="font-semibold">{item.quantity}</span></p>
                  <p className="font-bold text-gray-900">{formatCurrency(item.totalPrice)}</p>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}