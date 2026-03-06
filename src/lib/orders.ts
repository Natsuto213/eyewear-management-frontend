// src/api/orders.ts

export type OrderStatus =
  | "Đang chờ"
  | "Đang gia công"
  | "Đang đóng gói"
  | "Đang giao hàng"
  | "Hoàn thành";

export type OrderRow = {
  id: string;
  code: string;
  date: string;
  status: OrderStatus;
  type: "Pre-order" | "In-stock";
  total: string;
  customer: string;
};

// API function to fetch orders
// src/api/orders.ts

// src/api/orders.ts

// src/api/orders.ts
export async function fetchOrders(token: string, searchParams: any) {
  const res = await fetch("https://api-eyewear.purintech.id.vn/api/operation-staff/orders/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,  // Truyền token vào header Authorization
    },
    body: JSON.stringify(searchParams),  // Dữ liệu tìm kiếm
  });

  if (!res.ok) {
    // In ra mã lỗi và chi tiết phản hồi lỗi
    const errorDetails = await res.text();
    console.error("Error details:", errorDetails);
    throw new Error(`Failed to fetch orders: ${res.status} - ${errorDetails}`);
  }

  const data = await res.json();
  return data.result.content;  // Trả về danh sách đơn hàng
}
