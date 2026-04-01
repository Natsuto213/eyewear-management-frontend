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
  // Props mới — nhận errors từ Confirm và xóa lỗi khi user gõ
  errors?: {
    fullName?: string;
    phone?: string;
    email?: string;
    address?: string;
  };
  setErrors?: React.Dispatch<React.SetStateAction<any>>;
}

const inputBase =
  "w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition " +
  "focus:ring-4 placeholder:text-zinc-400";

const inputClass = (hasError?: string) =>
  `${inputBase} ${
    hasError
      ? "border-red-400 focus:border-red-400 focus:ring-red-100"
      : "border-zinc-200 focus:border-red-500 focus:ring-red-100"
  }`;

const ShippingForm: React.FC<ShippingFormProps> = ({
  form, setForm, onOpenModal, errors = {}, setErrors,
}) => {
  const clearError = (field: string) => {
    if (setErrors) setErrors((p: any) => ({ ...p, [field]: "" }));
  };

  return (
    <section className="rounded-2xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h1 className="mb-6 text-xl font-bold">Thông tin giao hàng</h1>
      <div className="grid gap-5 sm:grid-cols-2">

        {/* Họ và tên */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Họ và tên <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClass(errors.fullName)}
            value={form.fullName}
            onChange={(e) => { setForm({ ...form, fullName: e.target.value }); clearError("fullName"); }}
          />
          {errors.fullName && <p className="mt-1 text-xs text-red-500">{errors.fullName}</p>}
        </div>

        {/* Số điện thoại */}
        <div>
          <label className="mb-2 block text-sm font-medium">
            Số điện thoại <span className="text-red-500">*</span>
          </label>
          <input
            className={inputClass(errors.phone)}
            value={form.phone}
            placeholder="09xxxxxxxx"
            onChange={(e) => { setForm({ ...form, phone: e.target.value }); clearError("phone"); }}
          />
          {errors.phone && <p className="mt-1 text-xs text-red-500">{errors.phone}</p>}
        </div>

        {/* Email */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium">Email</label>
          <input
            className={inputClass(errors.email)}
            value={form.email}
            placeholder="email@domain.com (tùy chọn)"
            onChange={(e) => { setForm({ ...form, email: e.target.value }); clearError("email"); }}
          />
          {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
        </div>

        {/* Địa chỉ */}
        <div className="sm:col-span-2">
          <label className="mb-2 block text-sm font-medium">
            Địa chỉ nhận hàng <span className="text-red-500">*</span>
          </label>
          <div className="flex flex-col gap-3">
            <textarea
              className={`${inputBase} min-h-[80px] cursor-default italic text-zinc-500 ${
                errors.address ? "border-red-400" : "border-zinc-200"
              } bg-zinc-50`}
              value={form.address || "Vui lòng bấm nút bên dưới để cập nhật địa chỉ..."}
              readOnly
            />
            {errors.address && <p className="-mt-2 text-xs text-red-500">{errors.address}</p>}
            <button
              type="button"
              onClick={onOpenModal}
              className="rounded-xl bg-teal-600 px-6 py-3 text-sm font-bold text-white hover:bg-teal-700 transition"
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