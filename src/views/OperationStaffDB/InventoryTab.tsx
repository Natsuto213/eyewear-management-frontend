// src/components/InventoryTabs.tsx
import React from "react";
import FrameTable from "./tables/FrameTable";
import LensTable from "./tables/LensTable";
import ContactLensTable from "./tables/ContactLensTable";

export default function InventoryTabs({
  tab,
  setTab,
}: {
  tab: string;
  setTab: (t: any) => void;
}) {
  return (
    <>
      <div className="flex gap-3 mb-4">
        {["gong", "trong", "contact"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-6 py-2 rounded-xl font-bold ${
              tab === t ? "bg-black text-white" : "bg-gray-200"
            }`}
          >
            {t === "gong"
              ? "Gọng kính"
              : t === "trong"
              ? "Tròng kính"
              : "Kính áp tròng"}
          </button>
        ))}
      </div>

      {tab === "gong" && <FrameTable />}
      {tab === "trong" && <LensTable />}
      {tab === "contact" && <ContactLensTable />}
    </>
  );
}
