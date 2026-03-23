export const formatCurrency = (amount) => {
    if (amount == null) return "0 đ";
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
    }).format(amount);
};

export const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleString("vi-VN");
};

export const mapOrderStatus = (status) => {
    switch (status) {
        case "PENDING":
            return "Chờ xử lý";
        case "PARTIALLY_PAID":
            return "Đã thanh toán một phần";
        case "PAID":
            return "Hoàn tất thanh toán";
        case "CANCELED":
            return "Đã hủy";
        case "COMPLETED":
            return "Hoàn thành";
        case "CONFIRMED":
            return "Đã xác nhận";
        case "READY":
            return "Sẵn sàng giao";
        case "PROCESSING":
            return "Đang xử lý";
        default:
            return status || "";
    }
};

export const mapOrderType = (type) => {
    switch (type) {
        case "MIX_ORDER":
            return "Đơn hàng kết hợp";
        case "DIRECT_ORDER":
            return "Đơn hàng mua trực tiếp";
        case "PRE_ORDER":
            return "Đơn hàng đặt trước";
        case "PRESCRIPTION_ORDER":
            return "Đơn hàng theo đơn kính";
        default:
            return type || "";
    }
};

export const mapReturnExchangeStatus = (status) => {
    switch (status) {
        case "RETURN":
            return "Yêu cầu trả hàng";
        case "EXCHANGE":
            return "Yêu cầu đổi hàng";
        case "PENDING":
            return "Chờ xử lý";
        case "APPROVED":
            return "Đã duyệt";
        case "REJECTED":
            return "Từ chối";
        case "COMPLETED":
            return "Hoàn tất";
        default:
            return status || "";
    }
};

export const mapActionLabel = (action) => {
    switch (action) {
        case "APPROVE_RETURN":
            return "Duyệt trả hàng";
        case "REJECT_RETURN":
            return "Từ chối trả hàng";
        case "APPROVE_EXCHANGE":
            return "Duyệt đổi hàng";
        case "REJECT_EXCHANGE":
            return "Từ chối đổi hàng";
        case "CONFIRM_RECEIVED_RETURN":
            return "Xác nhận đã nhận hàng hoàn";
        case "CONFIRM_REFUND":
            return "Xác nhận hoàn tiền";
        case "CONFIRM_EXCHANGE_SHIPMENT":
            return "Xác nhận gửi hàng đổi";
        default:
            return action?.replaceAll("_", " ") || "";
    }
};