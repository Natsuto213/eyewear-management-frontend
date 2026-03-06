// src/components/tables/LensTable.tsx
import React from "react";

export default function LensTable() {
  return (
    <table className="w-full">
      <thead className="border-b">
        <tr>
          <th>Tên sản phẩm</th>
          <th>Mã hàng</th>
          <th>Thương hiệu</th>
          <th>Tính năng</th>
          <th>Chiết suất</th>
          <th>Loại</th>
          <th>Số lượng</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Tròng A</td>
          <td>TK001</td>
          <td>Essilor</td>
          <td>Chống UV</td>
          <td>1.56</td>
          <td>Cận</td>
          <td>20</td>
        </tr>
      </tbody>
    </table>
  );
}
