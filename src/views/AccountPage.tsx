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

    // Hàm cập nhật field trong form
    const setField = (k: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement>) =>
        setForm((p) => ({ ...p, [k]: e.target.value }));

    // Lấy thông tin user khi component mount
    useEffect(() => {
        const fetchInfo = async () => {
            setError("");
            setLoading(true);
            try {
                const res = await apiGetMyInfo();
                // Xử lý dữ liệu trả về từ Backend
                const u = res?.result ?? res;

                setForm({
                    email: u?.email ?? "",
                    phone: u?.phone ?? "",
                    name: u?.name ?? "",
                    dob: u?.dob ? u.dob.slice(0, 10) : "",
                    address: u?.address ?? "",
                    idNumber: u?.idNumber ?? "",
                });
            } catch (err: any) {
                setError(err?.response?.data?.message || err?.message || "Không lấy được thông tin user");
            } finally {
                setLoading(false);
            }
        };
        fetchInfo();
    }, []);

    // Lưu thông tin cập nhật
    const handleSave = async () => {
        setError("");
        try {
            await apiUpdateMyInfo({
                ...form,
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
        // Lưu ý: Nếu muốn "Hủy" và quay về dữ liệu cũ, bạn nên lưu một bản sao dữ liệu gốc vào state khác
    };

    if (loading) return <div className="p-10 text-center font-medium">Đang tải thông tin...</div>;

    return (
        <div className="h-full w-full overflow-y-auto p-4">
            <h2 className="mb-6 text-xl font-medium text-zinc-800">Thông tin tài khoản</h2>

            {/* ===== AVATAR ===== */}
            <div className="mb-6 flex items-center gap-4">
                <div className="relative h-32 w-32 rounded-full bg-zinc-200 flex items-center justify-center border border-zinc-300">
                    <span className="text-zinc-400 text-xs text-center px-2">Avatar placeholder</span>
                    <button type="button" className="absolute bottom-1 right-1 rounded-full bg-white p-2 shadow-md hover:bg-zinc-50 transition">
                         <div className="h-4 w-4 rounded-full bg-zinc-400" />
                    </button>
                </div>
            </div>

            {/* ===== PROFILE FORM ===== */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl">
                <Input label="Họ và tên" value={form.name} onChange={setField("name")} disabled={!editing} />
                <Input label="Số điện thoại" value={form.phone} onChange={setField("phone")} disabled={!editing} />
                <Input label="Email" value={form.email} onChange={setField("email")} disabled={!editing} />
                <Input label="Ngày sinh" type="date" value={form.dob} onChange={setField("dob")} disabled={!editing} />
                <Input label="Địa chỉ" full value={form.address} onChange={setField("address")} disabled={!editing} />
                <Input label="Số CCCD/ID" value={form.idNumber} onChange={setField("idNumber")} disabled={!editing} />
            </div>

            {error && <span className="block mt-4 text-sm font-medium text-red-500">{error}</span>}

            {/* ===== ACTION BUTTONS ===== */}
            <div className="mt-8 flex gap-4">
                {!editing ? (
                    <button
                        type="button"
                        onClick={() => setEditing(true)}
                        className="rounded-xl bg-cyan-500 px-8 py-2.5 text-white font-semibold shadow-sm hover:bg-cyan-600 transition"
                    >
                        CHỈNH SỬA
                    </button>
                ) : (
                    <button
                        type="button"
                        onClick={handleSave}
                        className="rounded-xl bg-cyan-500 px-8 py-2.5 text-white font-semibold shadow-sm hover:bg-cyan-600 transition"
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

/* ===== SUB-COMPONENT: INPUT ===== */
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
        <div className={full ? "md:col-span-2" : ""}>
            <label className="mb-1.5 block text-sm font-semibold text-zinc-700">{label}</label>
            <input
                type={type}
                value={value}
                onChange={onChange}
                disabled={disabled}
                className={`h-10 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-4 text-sm outline-none transition-all focus:border-cyan-400 focus:ring-2 focus:ring-cyan-100 ${
                    disabled ? "cursor-not-allowed opacity-70 bg-zinc-100" : "hover:border-zinc-300"
                }`}
            />
        </div>
    );
};

export default Account;