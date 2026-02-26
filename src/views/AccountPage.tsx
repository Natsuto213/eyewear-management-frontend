import React, { useEffect, useState } from "react";

import { apiGetMyInfo, apiUpdateMyInfo } from "../lib/userApi";


type FormState = {
  email: string;
  phone: string;
  name: string;
  dob: string;
  address: string;
  idNumber: string;
};

const Account: React.FC = () => {
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<FormState>({
    email: "",
    phone: "",
    name: "",
    dob: "",
    address: "",
    idNumber: "",
  });

  const setField =
    (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((p) => ({ ...p, [k]: e.target.value }));

  // GET /users/my-info
  useEffect(() => {
    (async () => {
      setError("");
      setLoading(true);
      try {
        const res = await apiGetMyInfo();

// BE thường trả { code: 1000, result: {...} }
const u = res?.result ?? res;

setForm({
  email: u?.email ?? "",
  phone: u?.phone ?? "",
  name: u?.name ?? "",
  dob: (u?.dob ?? "").slice(0, 10),
  address: u?.address ?? "",     // nếu null => ""
  idNumber: u?.idNumber ?? "",   // nếu null => ""
});

      } catch (err: any) {
        setError(err?.response?.data?.message || err?.message || "Không lấy được thông tin user");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // PUT /users/my-info (KHÔNG password)
  const handleSave = async () => {
    setError("");
    try {
      await apiUpdateMyInfo({
  email: form.email,
  phone: form.phone,
  name: form.name,
  dob: form.dob,
  address: form.address.trim() === "" ? null : form.address,
  idNumber: form.idNumber.trim() === "" ? null : form.idNumber,
});


      alert("Cập nhật thành công!");
      setEditing(false);
    } catch (err: any) {
      setError(err?.response?.data?.message || err?.message || "Update thất bại");
    }
  };

  const handleCancel = () => {
    setEditing(false);
    setError("");
  };

  if (loading) return <div className="h-full w-full">Loading...</div>;

  return (
    <div className="h-full w-full overflow-y-auto">
      <h2 className="mb-6 text-xl font-medium">Thông tin tài khoản</h2>

      {/* ===== AVATAR ===== */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-32 w-32 rounded-full bg-zinc-300/60">
          <button type="button" className="absolute bottom-2 right-2 rounded-full bg-white p-1 shadow">
            <span className="block h-4 w-4 rounded bg-black/50" />
          </button>
        </div>
      </div>

      {/* ===== PROFILE FORM (đúng field update spec) ===== */}
      <div className="grid grid-cols-2 gap-6">
        <Input label="Họ và tên" value={form.name} onChange={setField("name")} disabled={!editing} />
        <Input label="Số điện thoại" value={form.phone} onChange={setField("phone")} disabled={!editing} />
        <Input label="Email" value={form.email} onChange={setField("email")} disabled={!editing} />
        <Input label="Ngày sinh" type="date" value={form.dob} onChange={setField("dob")} disabled={!editing} />
        <Input label="Địa chỉ" full value={form.address} onChange={setField("address")} disabled={!editing} />
        <Input label="ID Number" value={form.idNumber} onChange={setField("idNumber")} disabled={!editing} />
      </div>

      {/* span error theo yêu cầu (Update) */}
      {error && <span className="block mt-4 text-sm text-red-600">{error}</span>}

      {/* ===== ACTION ===== */}
      <div className="mt-6 flex gap-4">
        {!editing ? (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="rounded-xl bg-cyan-400 px-6 py-2 text-white hover:bg-cyan-500"
          >
            CHỈNH SỬA
          </button>
        ) : (
          <button
            type="button"
            onClick={handleSave}
            className="rounded-xl bg-cyan-400 px-6 py-2 text-white hover:bg-cyan-500"
          >
            LƯU
          </button>
        )}

        <button
          type="button"
          onClick={handleCancel}
          className="rounded-xl border border-gray-300 bg-gray-200 px-6 py-2 text-black hover:bg-gray-300"
        >
          HỦY
        </button>
      </div>
    </div>
  );
};

export default Account;

/* ===== INPUT ===== */
type InputProps = {
  label: string;
  type?: string;
  full?: boolean;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
};

const Input: React.FC<InputProps> = ({
  label,
  type = "text",
  full = false,
  value,
  onChange,
  disabled = false,
}) => {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="mb-1 block text-sm text-black">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`h-7 w-full rounded-2xl bg-zinc-300/60 px-3 text-sm outline-none focus:ring-2 focus:ring-cyan-400 ${
          disabled ? "opacity-60" : ""
        }`}
      />
    </div>
  );

};

