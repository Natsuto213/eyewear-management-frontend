import React from "react";

interface ShippingFormProps {
  form: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };
  setForm: React.Dispatch<React.SetStateAction<any>>;
  onOpenModal: () => void;
}

const inputBase = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100";

const ShippingForm: React.FC<ShippingFormProps> = ({ form, setForm, onOpenModal }) => {
  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-xl font-bold">Thông tin giao hàng</h1>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium">Họ và tên</label>
          <input 
            className={inputBase} 
            value={form.fullName} 
            onChange={(e) => setForm({ ...form, fullName: e.target.value })} 
          />
        </div>
        <div>
          <label className="mb-2 block text-sm font-medium">Số điện thoại</label>
          <input 
            className={inputBase} 
            value={form.phone} 
            onChange={(e) => setForm({ ...form, phone: e.target.value })} 
          />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium">Email</label>
          <input className={`${inputBase} bg-zinc-50 cursor-not-allowed`} value={form.email} readOnly />
        </div>
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium">Địa chỉ nhận hàng</label>
          <div className="flex flex-col gap-3">
            <textarea
              className={`${inputBase} bg-zinc-50 min-h-[80px] cursor-default italic text-zinc-500`}
              value={form.address || "Vui lòng bấm nút bên dưới để cập nhật địa chỉ..."}
              readOnly
            />
            <button
              type="button"
              onClick={onOpenModal}
              className="rounded-xl bg-zinc-900 px-6 py-3 text-sm font-bold text-white hover:bg-zinc-800 transition"
            >
              + Cập nhật địa chỉ
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ShippingForm;