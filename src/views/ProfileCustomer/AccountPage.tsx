import React, { useEffect, useState } from "react";
import { apiGetMyInfo, apiUpdateMyInfo } from "../../lib/ApiService";

type FormState = {
  email: string;
  phone: string;
  name: string;
  dob: string;
  address: string;
  idNumber: string;
};

type FormErrors = Partial<FormState>;

const Account: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [errors, setErrors] = useState<FormErrors>({});
  const [apiError, setApiError] = useState("");
  const [loading, setLoading] = useState(true);
  const [original, setOriginal] = useState<FormState | null>(null); // lưu bản gốc để Cancel về đúng

  const [form, setForm] = useState<FormState>({
    email: "",
    phone: "",
    name: "",
    dob: "",
    address: "",
    idNumber: "",
  });

  const setField = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm((p) => ({ ...p, [k]: e.target.value }));
    if (errors[k]) setErrors((p) => ({ ...p, [k]: "" }));
  };

  useEffect(() => {
    const fetchInfo = async () => {
      setLoading(true);
      try {
        const res = await apiGetMyInfo();
        const u = res?.result ?? res;
        const loaded: FormState = {
          email:    u?.email   ?? "",
          phone:    u?.phone   ?? "",
          name:     u?.name    ?? "",
          dob:      u?.dob ? u.dob.slice(0, 10) : "",
          address:  u?.address  ?? "",
          idNumber: u?.idNumber ?? "",
        };
        setForm(loaded);
        setOriginal(loaded); // lưu bản gốc
      } catch (err: any) {
        setApiError(err?.response?.data?.message || "Không lấy được thông tin tài khoản");
      } finally {
        setLoading(false);
      }
    };
    fetchInfo();
  }, []);

  // ─── Validate ──────────────────────────────────────────────────────────────
  const validate = (): boolean => {
    const errs: FormErrors = {};

    if (!form.name.trim())
      errs.name = "Vui lòng nhập họ và tên";
    else if (form.name.trim().length < 2)
      errs.name = "Họ tên tối thiểu 2 ký tự";

    if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      errs.email = "Email không đúng định dạng";

    if (form.phone && !/^(0[3|5|7|8|9])\d{8}$/.test(form.phone))
      errs.phone = "Số điện thoại không hợp lệ (VD: 0912345678)";

    if (form.dob) {
      const dob = new Date(form.dob);
      const age = new Date().getFullYear() - dob.getFullYear();
      if (isNaN(dob.getTime()))
        errs.dob = "Ngày sinh không hợp lệ";
      else if (age < 10 || age > 100)
        errs.dob = "Ngày sinh không hợp lệ";
    }

    if (form.idNumber && !/^\d{9}$|^\d{12}$/.test(form.idNumber))
      errs.idNumber = "CCCD/CMND phải có 9 hoặc 12 chữ số";

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSave = async () => {
    setApiError("");
    if (!validate()) return;

    try {
      await apiUpdateMyInfo({
        ...form,
        address:  form.address.trim()  || null,
        idNumber: form.idNumber.trim() || null,
      });
      setOriginal(form); // cập nhật bản gốc sau khi lưu thành công
      alert("Cập nhật thành công!");
      setEditing(false);
    } catch (err: any) {
      setApiError(err?.response?.data?.message || "Cập nhật thất bại");
    }
  };

  const handleCancel = () => {
    // Khôi phục về dữ liệu gốc thay vì giữ nguyên thay đổi chưa lưu
    if (original) setForm(original);
    setErrors({});
    setApiError("");
    setEditing(false);
  };

  if (loading) return <div className="p-10 text-center font-medium">Đang tải thông tin...</div>;

  return (
    <div className="h-full w-full overflow-y-auto p-4">
      <h2 className="mb-6 text-xl font-medium text-zinc-800">Thông tin tài khoản</h2>

      {/* Avatar */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-32 w-32 rounded-full bg-zinc-200 flex items-center justify-center border border-zinc-300">
          <span className="text-zinc-400 text-xs text-center px-2">Avatar placeholder</span>
          <button type="button" className="absolute bottom-1 right-1 rounded-full bg-white p-2 shadow-md hover:bg-zinc-50 transition">
            <div className="h-4 w-4 rounded-full bg-zinc-400" />
          </button>
        </div>
      </div>

      {/* Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
        <InputField label="Họ và tên" value={form.name} onChange={setField("name")} disabled={!editing} error={errors.name} required />
        <InputField label="Số điện thoại" value={form.phone} onChange={setField("phone")} disabled={!editing} error={errors.phone} placeholder="09xxxxxxxx" />
        <InputField label="Email" value={form.email} onChange={setField("email")} disabled={!editing} error={errors.email} placeholder="email@domain.com" />
        <InputField label="Ngày sinh" type="date" value={form.dob} onChange={setField("dob")} disabled={!editing} error={errors.dob} />
        <InputField label="Địa chỉ" full value={form.address} onChange={setField("address")} disabled={!editing} error={errors.address} />
        <InputField label="Số CCCD/ID" value={form.idNumber} onChange={setField("idNumber")} disabled={!editing} error={errors.idNumber} placeholder="9 hoặc 12 chữ số" />
      </div>

      {apiError && <p className="mt-4 text-sm font-medium text-red-500">{apiError}</p>}

      {/* Actions */}
      <div className="mt-8 flex gap-4">
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-xl bg-teal-600 px-8 py-2.5 text-white font-semibold shadow-sm hover:bg-teal-700 transition"
          >
            CHỈNH SỬA
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-teal-600 px-8 py-2.5 text-white font-semibold shadow-sm hover:bg-teal-700 transition"
          >
            LƯU THÔNG TIN
          </button>
        )}
        <button
          type="button"
          onClick={handleCancel}
          className="rounded-xl border border-zinc-300 bg-zinc-100 px-8 py-2.5 text-zinc-700 font-semibold hover:bg-zinc-200 transition"
        >
          HỦY
        </button>
      </div>
    </div>
  );
};

// Sub-component Input với hiển thị lỗi
type InputFieldProps = {
  label: string;
  type?: string;
  full?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: string;
  required?: boolean;
  placeholder?: string;
};

const InputField: React.FC<InputFieldProps> = ({
  label, type = "text", full = false, value, onChange,
  disabled = false, error, required, placeholder,
}) => (
  <div className={full ? "md:col-span-2" : ""}>
    <label className="mb-1.5 block text-sm font-semibold text-zinc-700">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    <input
      type={type}
      value={value}
      onChange={onChange}
      disabled={disabled}
      placeholder={placeholder}
      className={[
        "h-10 w-full rounded-xl border px-4 text-sm outline-none transition-all",
        "focus:ring-2",
        error
          ? "border-red-400 bg-red-50 focus:border-red-400 focus:ring-red-100"
          : "border-zinc-200 bg-zinc-50 focus:border-cyan-400 focus:ring-cyan-100",
        disabled ? "cursor-not-allowed opacity-70 bg-zinc-100" : "hover:border-zinc-300",
      ].join(" ")}
    />
    {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
  </div>
);

export default Account;