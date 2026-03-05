import React, { useState, useEffect } from "react";
import axios from "axios";

interface AddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  // FIX: Thêm provinceCode vào type của codes

  onConfirm: (fullAddress: string, isSave: boolean, codes: {provinceCode?: string; provinceName?: string; districtCode: string; districtName: string; wardCode: string, wardName: string, street: string}) => void;
}

const inputBase = "w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-red-500 focus:ring-4 focus:ring-red-100 disabled:bg-zinc-50";

const AddressModal: React.FC<AddressModalProps> = ({ isOpen, onClose, onConfirm }) => {
  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  const [isSaveToProfile, setIsSaveToProfile] = useState(false);
  const [tempAddress, setTempAddress] = useState({
    provinceCode: "", provinceName: "",
    districtCode: "", districtName: "",
    wardCode: "", wardName: "",
    detail: "",
  });

  // 1. Lấy danh sách Tỉnh/Thành
  useEffect(() => {
    if (isOpen) {
      axios.get("https://api-eyewear.purintech.id.vn/ghn/provinces")
        .then(res => setProvinces(res.data?.result || []))
        .catch(err => console.error("Lỗi lấy provinces:", err));
    }
  }, [isOpen]);

  // 2. Xử lý đổi Tỉnh -> Lấy Huyện
  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const pId = e.target.value;
    const pName = e.target.selectedOptions[0].text;
    if (!pId) return;

    setTempAddress({ 
      ...tempAddress, 
      provinceCode: pId, 
      provinceName: pName, 
      districtCode: "", 
      wardCode: "" 
    });

    try {
      const res = await axios.get(`https://api-eyewear.purintech.id.vn/ghn/districts?provinceId=${pId}`);
      setDistricts(res.data?.result || []);
      setWards([]);
    } catch (err) { console.error(err); }
  };

  // 3. Xử lý đổi Huyện -> Lấy Xã
  const handleDistrictChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const dId = e.target.value;
    const dName = e.target.selectedOptions[0].text;
    if (!dId) return;

    setTempAddress({ 
      ...tempAddress, 
      districtCode: dId, 
      districtName: dName, 
      wardCode: "" 
    });

    try {
      const res = await axios.get(`https://api-eyewear.purintech.id.vn/ghn/wards?districtId=${dId}`);
      setWards(res.data?.result || []);
    } catch (err) { console.error(err); }
  };

  // --- FIX: HÀM XỬ LÝ XÁC NHẬN ---
  const confirmNewAddress = () => {
  const { detail, wardName, districtName, provinceName, provinceCode, districtCode, wardCode } = tempAddress;
  
  if (!provinceCode || !districtCode || !wardCode || !detail.trim()) {
    return alert("Vui lòng chọn đầy đủ Tỉnh/Huyện/Xã và Số nhà!");
  }

  const fullAddress = `${detail.trim()}, ${wardName}, ${districtName}, ${provinceName}`;
  
  // TRUYỀN ĐỦ CẢ TÊN LẪN MÃ CODE SANG PARENT
  onConfirm(fullAddress, isSaveToProfile, { 
    provinceCode,
    provinceName, 
    districtCode, 
    districtName, 
    wardCode,
    wardName,     
    street: detail.trim() // Thêm dòng này
  });
};

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-zinc-900/60 backdrop-blur-sm">
      <div className="relative w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
        <h3 className="mb-6 text-xl font-bold text-zinc-800">Địa chỉ giao hàng mới</h3>
        
        <div className="space-y-4">
          <select 
            className={inputBase} 
            onChange={handleProvinceChange} 
            value={tempAddress.provinceCode || ""}
          >
            <option value="">Chọn Tỉnh/Thành</option>
            {provinces.map((p: any) => (
              <option key={p.ProvinceID || p.provinceId || p.code} value={p.ProvinceID || p.provinceId || p.code}>
                {p.ProvinceName || p.provinceName || p.name}
              </option>
            ))}
          </select>

          <select 
            className={inputBase} 
            onChange={handleDistrictChange} 
            disabled={!districts.length} 
            value={tempAddress.districtCode || ""}
          >
            <option value="">Chọn Quận/Huyện</option>
            {districts.map((d: any) => (
              <option key={d.DistrictID || d.districtId || d.code} value={d.DistrictID || d.districtId || d.code}>
                {d.DistrictName || d.districtName || d.name}
              </option>
            ))}
          </select>

          <select 
            className={inputBase} 
            onChange={(e) => setTempAddress({
              ...tempAddress, 
              wardCode: e.target.value, 
              wardName: e.target.selectedOptions[0].text
            })} 
            disabled={!wards.length} 
            value={tempAddress.wardCode || ""}
          >
            <option value="">Chọn Phường/Xã</option>
            {wards.map((w: any) => (
              <option key={w.WardCode || w.wardCode || w.code} value={w.WardCode || w.wardCode || w.code}>
                {w.WardName || w.wardName || w.name}
              </option>
            ))}
          </select>

          <input 
            className={inputBase} 
            placeholder="Số nhà, tên đường..." 
            value={tempAddress.detail}
            onChange={(e) => setTempAddress({...tempAddress, detail: e.target.value})} 
          />
        </div>

        <div 
          className="flex items-center gap-3 mt-4 p-2 cursor-pointer hover:bg-zinc-50 rounded-lg transition"
          onClick={() => setIsSaveToProfile(!isSaveToProfile)}
        >
          <input 
            type="checkbox" 
            checked={isSaveToProfile} 
            onChange={() => {}} 
            className="h-5 w-5 rounded border-zinc-300 text-red-600 focus:ring-red-500 cursor-pointer" 
          />
          <span className="text-sm font-medium text-zinc-600 select-none">
            Cập nhật địa chỉ này vào thông tin cá nhân
          </span>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={onClose} 
            className="flex-1 rounded-xl bg-zinc-100 py-3 font-semibold text-zinc-600 hover:bg-zinc-200 transition"
          >
            Hủy
          </button>
          <button 
            onClick={confirmNewAddress} 
            className="flex-1 rounded-xl bg-red-600 py-3 font-semibold text-white shadow-lg shadow-red-200 hover:bg-red-700 transition"
          >
            Xác nhận
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddressModal;