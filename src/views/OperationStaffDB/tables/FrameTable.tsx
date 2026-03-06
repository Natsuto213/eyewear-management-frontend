// src/components/tables/FrameTable.tsx
import React from "react";

export default function FrameTable() {
  return (
    <table className="w-full">
      <thead className="border-b">
        <tr>
          <th>Tên sản phẩm</th>
          <th>Mã hàng</th>
          <th>Thương hiệu</th>
          <th>Chất liệu</th>
          <th>Kiểu dáng</th>
          <th>Màu sắc</th>
          <th>Số lượng</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Gọng A</td>
          <td>GK001</td>
          <td>Rayban</td>
          <td>Nhựa</td>
          <td>Vuông</td>
          <td>Đen</td>
          <td>10</td>
        </tr>
      </tbody>
    </table>
  );
}
