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

export async function fetchOrders(token: string, searchParams: any) {

  const res = await fetch(
    "https://api-eyewear.purintech.id.vn/api/operation-staff/orders/search",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(searchParams),
    }
  );

  const data = await res.json();

  if (!res.ok) {
    console.error("API Error:", data);
    throw new Error(data.message || "Không thể lấy danh sách đơn hàng");
  }

  // API purintech thường trả dạng này
  // result.content hoặc result

  if (data?.result?.content) {
    return data.result.content;
  }

  if (Array.isArray(data?.result)) {
    return data.result;
  }

  return [];
}