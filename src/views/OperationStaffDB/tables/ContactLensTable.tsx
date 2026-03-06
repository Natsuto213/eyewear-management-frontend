// src/components/tables/ContactLensTable.tsx
import React from "react";

export default function ContactLensTable() {
  return (
    <table className="w-full">
      <thead className="border-b">
        <tr>
          <th>Tên sản phẩm</th>
          <th>Mã hàng</th>
          <th>Thương hiệu</th>
          <th>Độ ẩm</th>
          <th>Độ cong</th>
          <th>Chất liệu</th>
          <th>Hạn sử dụng</th>
          <th>Số lượng</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Lens A</td>
          <td>CL001</td>
          <td>Acuvue</td>
          <td>58%</td>
          <td>8.6</td>
          <td>Silicone</td>
          <td>12/2026</td>
          <td>15</td>
        </tr>
      </tbody>
    </table>
  );
}
