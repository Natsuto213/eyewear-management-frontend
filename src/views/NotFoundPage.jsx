import React from "react";

export default function NotFoundPage() {
    return (
        <div style={{ minHeight: "60vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
            <h1 style={{ fontSize: 48, color: "#0f766e", marginBottom: 16 }}>404</h1>
            <h2 style={{ fontSize: 24, color: "#333", marginBottom: 8 }}>Không tìm thấy trang</h2>
            <p style={{ color: "#666" }}>Đường dẫn bạn truy cập không tồn tại hoặc đã bị thay đổi.</p>
            <a href="/" style={{ marginTop: 24, color: "#0f766e", textDecoration: "underline" }}>Quay về trang chủ</a>
        </div>
    );
}
