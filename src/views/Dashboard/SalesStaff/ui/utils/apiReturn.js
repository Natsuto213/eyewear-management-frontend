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

// Cập nhật lại hàm handleComplete trong apiReturn.js
export const handleComplete = async (returnExchangeId, refundAmount, evidenceFile, fetchOrderDetail) => {
    try {
        const formData = new FormData();

        // 1. Tạo object request theo chuẩn Swagger, những trường không cần thiết để chuỗi rỗng
        formData.append("refundAmount", String(refundAmount));

        // 3. Đưa file ảnh vào formData (staffEvidenceFile)
        if (evidenceFile) {
            formData.append("staffEvidenceFile", evidenceFile);
        }

        // 4. Gọi API
        const res = await api.put(`api/staff/return-exchange/${returnExchangeId}/status`, formData, {
            headers: {
                "Content-Type": "application/json",
            }
        });

        console.log("API response COMPLETE:", res.data);
        alert("Hoàn tất yêu cầu thành công!");
        fetchOrderDetail();
        return res.data;
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        alert(
            err?.response?.data?.message ||
            err?.message ||
            "Hoàn thành yêu cầu thất bại"
        );
    }
}