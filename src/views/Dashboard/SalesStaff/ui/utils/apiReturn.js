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

        // 1. Tạo object request đầy đủ các trường theo schema của Swagger
        // Ép kiểu Number để tránh lỗi 400 nếu Backend yêu cầu định dạng số
        const requestData = {
            refundAmount: Number(refundAmount),
            refundReferenceCode: "",            // THÊM TRƯỜNG NÀY
            processedNote: ""
        };

        // 2. Đóng gói JSON vào Blob với nhãn application/json
        formData.append(
            "request",
            new Blob([JSON.stringify(requestData)], { type: "application/json" })
        );

        // 3. Đưa file ảnh vào formData với đúng key 'staffEvidenceFile'
        if (evidenceFile && (evidenceFile instanceof File || evidenceFile instanceof Blob)) {
            formData.append("staffEvidenceFile", evidenceFile);
        }

        // 4. Gọi API - Lưu ý: bỏ dấu "/" ở đầu nếu baseURL của bạn đã có /api
        const res = await api.put(`api/staff/return-exchange/${returnExchangeId}/complete-refund`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });

        console.log("API response COMPLETE:", res.data);
        alert("Hoàn tất yêu cầu thành công!");

        // Load lại dữ liệu để cập nhật UI
        if (fetchOrderDetail) fetchOrderDetail();

        return res.data;
    } catch (err) {
        console.error("Lỗi khi gọi API:", err);
        // In ra chi tiết phản hồi từ Server để dễ debug nếu vẫn lỗi 400
        console.log("Status:", err.response?.status);
        console.log("Data:", err.response?.data);
        console.log("Message:", err.response?.data?.message);
        console.log("Errors:", err.response?.data?.errors);

        alert(
            err?.response?.data?.message ||
            err?.message ||
            "Hoàn thành yêu cầu thất bại"
        );
    }
};