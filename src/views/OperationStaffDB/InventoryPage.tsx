// src/pages/OperationStaff/InventoryPage.tsx
import React, { useState } from "react";
import InventoryTabs from "../OperationStaffDB/InventoryTab";
import Sidebar from "../../dashboard/Sidebar";  // Import Sidebar

export default function InventoryPage() {
  const [tab, setTab] = useState("gong");

  return (
    <div className="min-h-screen flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content area */}
      <div className="flex-1 p-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900">
          Hàng trong kho
        </h1>
        <InventoryTabs tab={tab} setTab={setTab} />
      </div>
    </div>
  );
}
