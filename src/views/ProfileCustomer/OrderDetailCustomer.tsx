import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MapPin, Phone, Mail, Package, Clock, CheckCircle2, XCircle, Truck } from "lucide-react";

const BASE_URL = "https://api-eyewear.purintech.id.vn";

const formatCurrency = (v: number) =>
  v?.toLocaleString("vi-VN", { style: "currency", currency: "VND" });

const formatDate = (str: string) => {
  if (!str) return "";
  return new Date(str).toLocaleString("vi-VN");
};

const orderStatusConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  PENDING:    { label: "Chờ xác nhận",   bg: "bg-yellow-100", text: "text-yellow-800", icon: Clock },
  CONFIRMED:  { label: "Đã xác nhận",    bg: "bg-blue-100",   text: "text-blue-800",   icon: CheckCircle2 },
  PROCESSING: { label: "Đang gia công",  bg: "bg-amber-100",  text: "text-amber-800",  icon: Package },
  READY:      { label: "Chờ vận chuyển", bg: "bg-purple-100", text: "text-purple-800", icon: Package },
  COMPLETED:  { label: "Hoàn thành",     bg: "bg-green-100",  text: "text-green-800",  icon: CheckCircle2 },
  CANCELED:   { label: "Đã hủy",         bg: "bg-red-100",    text: "text-red-800",    icon: XCircle },
};

const shippingConfig: Record<string, { label: string; bg: string; text: string; icon: any }> = {
  PENDING:   { label: "Chờ xử lý",      bg: "bg-zinc-100",    text: "text-zinc-700",   icon: Clock },
  PACKING:   { label: "Đang đóng gói",  bg: "bg-blue-100",    text: "text-blue-800",   icon: Package },
  SHIPPING:  { label: "Đang giao hàng", bg: "bg-indigo-100",  text: "text-indigo-800", icon: Truck },
  DELIVERED: { label: "Đã giao",        bg: "bg-green-100",   text: "text-green-800",  icon: CheckCircle2 },
  FAILED:    { label: "Giao thất bại",  bg: "bg-red-100",     text: "text-red-800",    icon: XCircle },
  RETURNED:  { label: "Hoàn hàng",      bg: "bg-orange-100",  text: "text-orange-800", icon: XCircle },
  CANCELED:  { label: "Đã hủy",         bg: "bg-red-100",     text: "text-red-800",    icon: XCircle },
};

export default function OrderDetailCustomer() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) { navigate("/login", { replace: true }); return; }

    const fetchDetail = async () => {
      try {
        setLoading(true);
        const res = await fetch(`${BASE_URL}/orders/${orderId}/detail`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        if (data.code === 1000) {
          setOrder(data.result);
        } else {
          setError("Không tìm thấy đơn hàng");
        }
      } catch {
        setError("Lỗi kết nối server");
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [orderId, navigate]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-white">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-teal-200 border-t-teal-600" />
    </div>
  );

  if (error || !order) return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-teal-50 to-white">
      <div className="text-center bg-white rounded-3xl shadow-lg p-10">
        <XCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
        <p className="text-red-600 font-semibold mb-4">{error || "Không tìm thấy đơn hàng"}</p>
        <button onClick={() => navigate("/profile")} className="rounded-xl bg-teal-600 px-5 py-2 text-sm font-semibold text-white hover:bg-teal-700">
          Quay lại
        </button>
      </div>
    </div>
  );

  const orderStatus = orderStatusConfig[order.orderStatus] || { label: order.orderStatus, bg: "bg-zinc-100", text: "text-zinc-800", icon: Package };
  const shippingStatus = shippingConfig[order.shippingStatus] || { label: order.shippingStatus, bg: "bg-zinc-100", text: "text-zinc-800", icon: Truck };
  const OrderStatusIcon = orderStatus.icon;
  const ShippingStatusIcon = shippingStatus.icon;

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white px-4 py-8">
      <div className="mx-auto w-full max-w-3xl space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/profile")}
            className="flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2 text-sm font-semibold text-zinc-700 hover:bg-zinc-50 hover:shadow-sm transition"
          >
            <ArrowLeft className="w-4 h-4" /> Quay lại
          </button>
          <div>
            <h1 className="text-xl font-bold text-zinc-900">{order.orderCode}</h1>
            <p className="text-xs text-zinc-500">{formatDate(order.orderDate)}</p>
          </div>
        </div>

        {/* Trạng thái */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm flex flex-wrap gap-3 items-center">
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${orderStatus.bg}`}>
            <OrderStatusIcon className={`w-4 h-4 ${orderStatus.text}`} />
            <span className={`text-sm font-bold ${orderStatus.text}`}>{orderStatus.label}</span>
          </div>
          <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${shippingStatus.bg}`}>
            <ShippingStatusIcon className={`w-4 h-4 ${shippingStatus.text}`} />
            <span className={`text-sm font-bold ${shippingStatus.text}`}>🚚 {shippingStatus.label}</span>
          </div>
          {order.requiresFinalPayment && (
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-orange-100">
              <span className="text-sm font-bold text-orange-800">⚠️ Cần thanh toán thêm</span>
            </div>
          )}
        </div>

        {/* Thông tin giao hàng */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
          <h2 className="font-bold text-zinc-900">Thông tin giao hàng</h2>
          <div className="space-y-2 text-sm text-zinc-700">
            <div className="flex items-center gap-2">
              <Package className="w-4 h-4 text-zinc-400" />
              <span className="font-semibold">{order.recipientName}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="w-4 h-4 text-zinc-400" />
              <span>{order.recipientPhone}</span>
            </div>
            <div className="flex items-center gap-2">
              <Mail className="w-4 h-4 text-zinc-400" />
              <span>{order.recipientEmail}</span>
            </div>
            <div className="flex items-start gap-2">
              <MapPin className="w-4 h-4 text-zinc-400 mt-0.5" />
              <span>{order.recipientAddress}</span>
            </div>
            
            {order.expectedDeliveryAt && (
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-zinc-400" />
                <span>Dự kiến giao: {formatDate(order.expectedDeliveryAt)}</span>
                {order.isPastExpectedDeliveryAt && (
                  <span className="text-xs font-semibold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">Quá hạn</span>
                )}
              </div>
            )}
            {order.note && (
              <div className="rounded-xl bg-zinc-50 border border-zinc-200 px-3 py-2 text-xs text-zinc-600">
                📝 {order.note}
              </div>
            )}
          </div>
        </div>

        {/* Sản phẩm thường */}
        {order.orderDetail?.length > 0 && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-3">
            <h2 className="font-bold text-zinc-900">Sản phẩm</h2>
            <div className="space-y-3">
              {order.orderDetail.map((item: any, idx: number) => (
                <div key={idx} className="flex items-center gap-4 rounded-2xl border border-zinc-100 p-3 hover:bg-zinc-50 transition">
                  <img src={item.imageUrl} alt={item.productName} className="w-16 h-16 rounded-xl object-cover border border-zinc-200" />
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-zinc-900 truncate">{item.productName}</div>
                    <div className="text-xs text-zinc-500 mt-1">Số lượng: {item.quantity}</div>
                  </div>
                  <div className="text-sm font-bold text-zinc-900 whitespace-nowrap">
                    {formatCurrency(item.totalPrice)}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Kính thuốc */}
        {order.prescriptionOrderDetail?.length > 0 && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-4">
            <h2 className="font-bold text-zinc-900">Kính thuốc</h2>
            {order.prescriptionOrderDetail.map((item: any, idx: number) => (
              <div key={idx} className="rounded-2xl border border-zinc-100 p-4 space-y-3">
                {/* Gọng */}
                <div className="flex items-center gap-3">
                  <img src={item.frameImg} alt={item.frameName} className="w-14 h-14 rounded-xl object-cover border border-zinc-200" />
                  <div className="flex-1">
                    <div className="text-xs text-indigo-600 font-bold uppercase mb-0.5">Gọng kính</div>
                    <div className="font-semibold text-zinc-900 text-sm">{item.frameName}</div>
                    <div className="text-xs text-zinc-500">{formatCurrency(item.framePrice)}</div>
                  </div>
                </div>

                {/* Tròng */}
                {item.lensId && (
                  <div className="flex items-center gap-3">
                    <img src={item.lensImg} alt={item.lensName} className="w-14 h-14 rounded-xl object-cover border border-zinc-200" />
                    <div className="flex-1">
                      <div className="text-xs text-purple-600 font-bold uppercase mb-0.5">Tròng kính</div>
                      <div className="font-semibold text-zinc-900 text-sm">{item.lensName}</div>
                      <div className="text-xs text-zinc-500">{formatCurrency(item.lensPrice)}</div>
                    </div>
                  </div>
                )}

                {/* Thông số mắt */}
                <div className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                  <div className="text-xs font-bold text-zinc-700 mb-2">Thông số mắt</div>
                  <div className="grid grid-cols-2 gap-x-6 gap-y-1 text-xs text-zinc-600">
                    {[
                      ["Mắt phải SPH", item.rightEyeSph],
                      ["Mắt trái SPH", item.leftEyeSph],
                      ["Mắt phải CYL", item.rightEyeCyl],
                      ["Mắt trái CYL", item.leftEyeCyl],
                      ["Mắt phải AXIS", item.rightEyeAxis],
                      ["Mắt trái AXIS", item.leftEyeAxis],
                      ["Mắt phải ADD", item.rightEyeAdd],
                      ["Mắt trái ADD", item.leftEyeAdd],
                      ["PD phải", item.rightPD],
                      ["PD trái", item.leftPD],
                    ].map(([label, val]) => (
                      <div key={label} className="flex justify-between">
                        <span className="text-zinc-400">{label}</span>
                        <span className="font-semibold">{val || "—"}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="text-right text-sm font-bold text-zinc-900">
                  Tổng: {formatCurrency(item.totalPrice)}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Tổng tiền */}
        <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm space-y-2">
          <div className="flex justify-between text-sm text-zinc-600">
            <span>Phí vận chuyển</span>
            <span>{formatCurrency(order.shippingFee)}</span>
          </div>
          <div className="h-px bg-zinc-100" />
          <div className="flex justify-between font-bold text-zinc-900">
            <span>Tổng cộng</span>
            <span className="text-teal-700 text-lg">{formatCurrency(order.totalAmount)}</span>
          </div>
        </div>

      </div>
    </div>
  );
}