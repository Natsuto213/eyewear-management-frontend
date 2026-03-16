import { api } from "@/lib/api";
export const handleReject = async (returnExchangeId, reason, fetchOrderDetail) => {
    try {
        const res = await api.put(`api/staff/return-exchange/${returnExchangeId}/status`, {
            action: "REJECT",
            rejectReason: reason
        });
        console.log("API response COMPLETE:", res.data);
        alert("Hoàn tất yêu cầu thành công!");
        fetchOrderDetail(); // Gọi lại API để cập nhật thông tin đơn hàng mới nhất sau khi từ chối
        return res.data;
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        alert(
            err?.response?.data?.message ||
            err?.message ||
            "Từ chối yêu cầu thất bại"
        );
    }
}

export const handleApprove = async (returnExchangeId, fetchOrderDetail) => {
    try {
        const res = await api.put(`api/staff/return-exchange/${returnExchangeId}/status`, {
            action: "APPROVE"
        });
        console.log("API response COMPLETE:", res.data);
        alert("Hoàn tất yêu cầu thành công!");
        fetchOrderDetail(); // Gọi lại API để cập nhật thông tin đơn hàng mới nhất sau khi từ chối
        return res.data;
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        alert(
            err?.response?.data?.message ||
            err?.message ||
            "Chap nhan yêu cầu thất bại"
        );
    }
}

export const handleComplete = async (returnExchangeId, fetchOrderDetail) => {
    try {
        const res = await api.put(`api/staff/return-exchange/${returnExchangeId}/status`, {
            action: "COMPLETE"
        });
        console.log("API response COMPLETE:", res.data);
        alert("Hoàn tất yêu cầu thành công!");
        fetchOrderDetail(); // Gọi lại API để cập nhật thông tin đơn hàng mới nhất sau khi từ chối
        return res.data;
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        alert(
            err?.response?.data?.message ||
            err?.message ||
            "Chap nhan yêu cầu thất bại"
        );
    }
}