import React from "react";

type OrderStatus = "shipping" | "waiting" | "delivered";

interface OrderItem {
  id: string;
  name: string;
  price: number;
  image: string;
}

interface Order {
  id: string;
  status: OrderStatus;
  description: string;
  items: OrderItem[];
}

const orders: Order[] = [
  {
    id: "ORDER-001",
    status: "shipping",
    description: "Đang đợi đơn vị vận chuyển đến lấy hàng",
    items: [
      {
        id: "1",
        name: "Tên sản phẩm",
        price: 120000,
        image: "https://placehold.co/100x100",
      },
      {
        id: "2",
        name: "Tên sản phẩm",
        price: 150000,
        image: "https://placehold.co/101x100",
      },
    ],
  },
  {
    id: "ORDER-002",
    status: "delivered",
    description: "Đơn hàng đã được giao thành công",
    items: [
      {
        id: "3",
        name: "Tên sản phẩm",
        price: 99000,
        image: "https://placehold.co/101x100",
      },
    ],
  },
];

const statusConfig: Record<OrderStatus, { label: string; color: string }> = {
  shipping: {
    label: "Đang vận chuyển",
    color: "bg-blue-50 text-blue-600",
  },
  waiting: {
    label: "Đang chờ lấy hàng",
    color: "bg-yellow-50 text-yellow-600",
  },
  delivered: {
    label: "Đã giao",
    color: "bg-green-50 text-green-600",
  },
};

const OrderTracking: React.FC = () => {
  return (
    <div className="min-h-screen bg-zinc-50 px-4 py-10">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Title */}
        <h1 className="text-3xl font-semibold text-zinc-900">
          Theo dõi đơn hàng của bạn
        </h1>

        {/* Orders */}
        {orders.map((order) => (
          <div
            key={order.id}
            className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            {/* Header */}
            <div className="mb-4 flex items-center justify-between">
              <div>
                <div className="text-sm font-semibold text-zinc-900">
                  Mã đơn hàng: {order.id}
                </div>
                <div className="mt-1 text-xs text-zinc-500">
                  {order.description}
                </div>
              </div>

              <span
                className={[
                  "rounded-full px-3 py-1 text-xs font-semibold",
                  statusConfig[order.status].color,
                ].join(" ")}
              >
                {statusConfig[order.status].label}
              </span>
            </div>

            {/* Items */}
            <div className="space-y-3">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between rounded-2xl border border-zinc-200 p-4 transition hover:border-zinc-300 hover:bg-zinc-50"
                >
                  <div className="flex items-center gap-4">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-20 w-20 rounded-xl object-cover"
                    />
                    <div>
                      <div className="font-medium text-zinc-900">
                        {item.name}
                      </div>
                      <div className="mt-1 text-sm text-zinc-600">
                        Giá:{" "}
                        <span className="font-semibold">
                          {item.price.toLocaleString()}₫
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="text-sm font-semibold text-zinc-900">
                    {item.price.toLocaleString()}₫
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderTracking; 