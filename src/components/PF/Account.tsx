import React from "react";

const Account: React.FC = () => {
  return (
    <div className="h-full w-full overflow-y-auto">
      <h2 className="mb-6 text-xl font-medium">Thông tin tài khoản</h2>

      {/* ===== AVATAR ===== */}
      <div className="mb-6 flex items-center gap-4">
        <div className="relative h-32 w-32 rounded-full bg-zinc-300/60">
          <button className="absolute bottom-2 right-2 rounded-full bg-white p-1 shadow">
            <span className="block h-4 w-4 rounded bg-black/50" />
          </button>
        </div>
      </div>

      {/* ===== PROFILE FORM ===== */}
      <div className="grid grid-cols-2 gap-6">
        <Input label="Họ và tên" />
        <Input label="Số điện thoại" />
        <Input label="Email" />
        <Input label="Địa chỉ chi tiết" full />
        <Input label="Tỉnh / Thành phố" />
        <Input label="Quận / Huyện" />
        <Input label="Phường / Xã" />
        <Input label="Ghi chú" full />
      </div>

      {/* ===== PASSWORD ===== */}
      <h3 className="mt-8 mb-4 text-lg font-medium">Đổi mật khẩu</h3>

      <div className="grid grid-cols-2 gap-6">
        <Input label="Mật khẩu hiện tại" type="password" />
        <Input label="Mật khẩu mới" type="password" />
        <Input label="Nhập lại mật khẩu" type="password" />
      </div>

      {/* ===== ACTION ===== */}
<div className="mt-6 flex gap-4">
  <button className="rounded-xl bg-cyan-400 px-6 py-2 text-white hover:bg-cyan-500">
    Lưu thay đổi
  </button>

  <button className="rounded-xl border border-gray-300 bg-gray-200 px-6 py-2 text-black hover:bg-gray-300">
    Hủy
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
};

const Input: React.FC<InputProps> = ({ label, type = "text", full }) => {
  return (
    <div className={full ? "col-span-2" : ""}>
      <label className="mb-1 block text-sm text-black">{label}</label>
      <input
        type={type}
        className="h-7 w-full rounded-2xl bg-zinc-300/60 px-3 text-sm outline-none focus:ring-2 focus:ring-cyan-400"
      />
    </div>
  );
};
