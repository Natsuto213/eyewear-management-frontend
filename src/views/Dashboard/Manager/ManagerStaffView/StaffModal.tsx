// ManagerStaffView/StaffModal.tsx
import { useEffect, useState } from 'react';
import { X, MapPin } from 'lucide-react';
import axios from 'axios';
import { roleConfig } from './StaffConfig';

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSave: (e: React.FormEvent) => void;
    formData: any;
    setFormData: (data: any) => void;
    handleFormChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
    isEditing: boolean;
    isSubmitting: boolean;
}

export function StaffModal({ isOpen, onClose, onSave, formData, setFormData, handleFormChange, isEditing, isSubmitting }: Props) {
    // STATE CHO ADDRESS MODAL CON
    const [isAddressModalOpen, setIsAddressModalOpen] = useState(false);
    
    // STATE DỮ LIỆU ĐỊA CHỈ TẠM THỜI
    const [provinces, setProvinces] = useState<any[]>([]);
    const [districts, setDistricts] = useState<any[]>([]);
    const [wards, setWards] = useState<any[]>([]);
    const [tempAddress, setTempAddress] = useState({
        provinceCode: 0, provinceName: "",
        districtCode: 0, districtName: "",
        wardCode: "", wardName: "",
        street: ""
    });

    // 1. Mở Modal Địa chỉ -> Lấy danh sách Tỉnh/Thành
    useEffect(() => {
        if (isAddressModalOpen) {
            axios.get("https://api-eyewear.purintech.id.vn/ghn/provinces")
                .then(res => setProvinces(res.data?.result || []))
                .catch(err => console.error("Lỗi lấy provinces:", err));
            
            setTempAddress({
                provinceCode: formData.provinceCode || 0,
                provinceName: formData.provinceName || "",
                districtCode: formData.districtCode || 0,
                districtName: formData.districtName || "",
                wardCode: formData.wardCode || "",
                wardName: formData.wardName || "",
                street: formData.address || "" 
            });
        }
    }, [isAddressModalOpen]);

    // 2. Load Huyện khi Tỉnh thay đổi trong Temp
    useEffect(() => {
        if (isAddressModalOpen && tempAddress.provinceCode) {
            axios.get(`https://api-eyewear.purintech.id.vn/ghn/districts?provinceId=${tempAddress.provinceCode}`)
                .then(res => setDistricts(res.data?.result || []))
                .catch(err => console.error(err));
        } else {
            setDistricts([]);
        }
    }, [isAddressModalOpen, tempAddress.provinceCode]);

    // 3. Load Xã khi Huyện thay đổi trong Temp
    useEffect(() => {
        if (isAddressModalOpen && tempAddress.districtCode) {
            axios.get(`https://api-eyewear.purintech.id.vn/ghn/wards?districtId=${tempAddress.districtCode}`)
                .then(res => setWards(res.data?.result || []))
                .catch(err => console.error(err));
        } else {
            setWards([]);
        }
    }, [isAddressModalOpen, tempAddress.districtCode]);

    // Handlers chọn địa chỉ bên trong Modal con
    const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const pId = Number(e.target.value);
        const pName = e.target.selectedOptions[0].text;
        setTempAddress(prev => ({ 
            ...prev, provinceCode: pId, provinceName: pId ? pName : '', 
            districtCode: 0, districtName: '', wardCode: '', wardName: '' 
        }));
    };

    const handleDistrictChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const dId = Number(e.target.value);
        const dName = e.target.selectedOptions[0].text;
        setTempAddress(prev => ({ 
            ...prev, districtCode: dId, districtName: dId ? dName : '', 
            wardCode: '', wardName: '' 
        }));
    };

    const handleWardChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const wId = e.target.value;
        const wName = e.target.selectedOptions[0].text;
        setTempAddress(prev => ({ ...prev, wardCode: wId, wardName: wId ? wName : '' }));
    };

    const handleConfirmAddress = () => {
        if (!tempAddress.provinceCode || !tempAddress.districtCode || !tempAddress.wardCode || !tempAddress.street.trim()) {
            return alert("Vui lòng chọn đầy đủ Tỉnh/Huyện/Xã và Số nhà!");
        }

        setFormData({
            ...formData,
            provinceCode: tempAddress.provinceCode,
            provinceName: tempAddress.provinceName,
            districtCode: tempAddress.districtCode,
            districtName: tempAddress.districtName,
            wardCode: tempAddress.wardCode,
            wardName: tempAddress.wardName,
            address: tempAddress.street.trim() 
        });

        setIsAddressModalOpen(false);
    };

    if (!isOpen) return null;

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white";
    
    const displayFullAddress = formData.provinceName ? 
        `${formData.address}, ${formData.wardName}, ${formData.districtName}, ${formData.provinceName}` 
        : formData.address || 'Chưa cập nhật địa chỉ';

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            {/* --- MODAL CHÍNH --- */}
            <div className={`bg-white rounded-xl shadow-xl w-[600px] max-w-[95%] max-h-[90vh] flex flex-col transition-all ${isAddressModalOpen ? 'blur-sm scale-95 opacity-50' : 'scale-100 opacity-100'}`}>
                <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                    <h3 className="text-lg font-bold text-gray-800">{isEditing ? 'Cập nhật thông tin' : 'Thêm nhân viên mới'}</h3>
                    <button type="button" onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors p-1"><X className="h-5 w-5" /></button>
                </div>

                <div className="p-6 overflow-y-auto">
                    <form id="staff-form" onSubmit={onSave} className="space-y-5">
                        
                        {/* THÔNG TIN TÀI KHOẢN */}
                        {!isEditing && (
                            <div className="p-4 bg-gray-50 rounded-lg border border-gray-100 space-y-4">
                                <h4 className="text-sm font-semibold text-gray-700">Thông tin tài khoản</h4>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Username *</label>
                                        <input required type="text" name="username" value={formData.username} onChange={handleFormChange} className={inputClass} />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-1">Mật khẩu *</label>
                                        <input required type="password" name="password" value={formData.password} onChange={handleFormChange} className={inputClass} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* THÔNG TIN CÁ NHÂN */}
                        <div className="space-y-4">
                            <h4 className="text-sm font-semibold text-gray-700 border-b pb-2">Thông tin cá nhân</h4>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Họ và tên *</label>
                                    <input required type="text" name="name" value={formData.name} onChange={handleFormChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Căn cước công dân</label>
                                    <input type="text" name="idNumber" value={formData.idNumber} onChange={handleFormChange} className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                                    <input required type="email" name="email" value={formData.email} onChange={handleFormChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Số điện thoại *</label>
                                    <input required type="tel" name="phone" value={formData.phone} onChange={handleFormChange} className={inputClass} />
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Ngày sinh (YYYY-MM-DD)</label>
                                    <input type="date" name="dob" value={formData.dob} onChange={handleFormChange} className={inputClass} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Vai trò *</label>
                                    <select required name="roleName" value={formData.roleName} onChange={handleFormChange} className={`${inputClass} cursor-pointer`}>
                                        {Object.entries(roleConfig).map(([key, config]) => (
                                            <option key={key} value={key}>{config.label}</option>
                                        ))}
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* HIỂN THỊ ĐỊA CHỈ & NÚT MỞ MODAL */}
                        <div className="space-y-2 mt-2">
                            <label className="block text-sm font-medium text-gray-700">Địa chỉ liên hệ</label>
                            <div className="flex items-center gap-3 bg-gray-50 border border-gray-200 p-3 rounded-lg">
                                <div className="bg-purple-100 p-2 rounded-full text-purple-600">
                                    <MapPin className="h-5 w-5" />
                                </div>
                                <p className="text-sm text-gray-600 flex-1 break-words line-clamp-2">
                                    {displayFullAddress}
                                </p>
                                <button 
                                    type="button" 
                                    onClick={() => setIsAddressModalOpen(true)}
                                    className="px-3 py-1.5 bg-white border border-gray-300 text-sm text-gray-700 font-medium rounded hover:bg-gray-100 transition whitespace-nowrap"
                                >
                                    Thay đổi
                                </button>
                            </div>
                        </div>

                    </form>
                </div>

                <div className="px-6 py-4 border-t border-gray-100 flex items-center justify-end gap-3 bg-gray-50 rounded-b-xl">
                    <button type="button" onClick={onClose} disabled={isSubmitting} className="px-4 py-2 bg-white border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium">Hủy bỏ</button>
                    <button type="submit" form="staff-form" disabled={isSubmitting} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-sm font-medium disabled:opacity-50">
                        {isSubmitting ? 'Đang xử lý...' : 'Lưu thông tin'}
                    </button>
                </div>
            </div>

            {/* --- MODAL PHỤ: CHỌN ĐỊA CHỈ (Nằm đè lên trên) --- */}
            {isAddressModalOpen && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-[2px]">
                    <div className="relative w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl">
                        <div className="flex items-center justify-between mb-4 border-b pb-3">
                            <h3 className="text-lg font-bold text-gray-800">Cập nhật địa chỉ</h3>
                            <button onClick={() => setIsAddressModalOpen(false)} className="text-gray-400 hover:text-gray-600 transition">
                                <X className="h-5 w-5" />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {/* FIX CỨNG: Bắt các trường ID và Name theo chuẩn của GHN API */}
                            <select className={`${inputClass} cursor-pointer`} onChange={handleProvinceChange} value={tempAddress.provinceCode || ""}>
                                <option value="">Chọn Tỉnh/Thành</option>
                                {provinces.map((p: any) => {
                                    const id = p.ProvinceID || p.provinceId || p.code;
                                    const name = p.ProvinceName || p.provinceName || p.name;
                                    return <option key={id} value={id}>{name}</option>;
                                })}
                            </select>

                            <select className={`${inputClass} cursor-pointer`} onChange={handleDistrictChange} disabled={!districts.length} value={tempAddress.districtCode || ""}>
                                <option value="">Chọn Quận/Huyện</option>
                                {districts.map((d: any) => {
                                    const id = d.DistrictID || d.districtId || d.code;
                                    const name = d.DistrictName || d.districtName || d.name;
                                    return <option key={id} value={id}>{name}</option>;
                                })}
                            </select>

                            <select className={`${inputClass} cursor-pointer`} onChange={handleWardChange} disabled={!wards.length} value={tempAddress.wardCode || ""}>
                                <option value="">Chọn Phường/Xã</option>
                                {wards.map((w: any) => {
                                    const id = w.WardCode || w.wardCode || w.code;
                                    const name = w.WardName || w.wardName || w.name;
                                    return <option key={id} value={id}>{name}</option>;
                                })}
                            </select>

                            <input 
                                className={inputClass} 
                                placeholder="Số nhà, tên đường (VD: 123 Đường ABC...)" 
                                value={tempAddress.street}
                                onChange={(e) => setTempAddress({...tempAddress, street: e.target.value})} 
                            />
                        </div>

                        <div className="mt-6 flex justify-end gap-3">
                            <button onClick={() => setIsAddressModalOpen(false)} className="px-4 py-2 bg-gray-100 text-gray-700 font-medium rounded-lg hover:bg-gray-200 transition">Hủy</button>
                            <button onClick={handleConfirmAddress} className="px-4 py-2 bg-purple-600 text-white font-medium rounded-lg shadow hover:bg-purple-700 transition">Xác nhận</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}