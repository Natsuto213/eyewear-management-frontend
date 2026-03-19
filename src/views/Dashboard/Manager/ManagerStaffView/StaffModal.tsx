// ManagerStaffView/StaffModal.tsx
import { X } from 'lucide-react';
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

export function StaffModal({ isOpen, onClose, onSave, formData, handleFormChange, isEditing, isSubmitting }: Props) {
    
    if (!isOpen) return null;

    const inputClass = "w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-400 bg-white";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-xl shadow-xl w-[600px] max-w-[95%] max-h-[90vh] flex flex-col">
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
                            
                            {/* ĐỊA CHỈ - Input String Đơn Giản */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Địa chỉ liên hệ</label>
                                <input 
                                    type="text" 
                                    name="address" 
                                    placeholder="Nhập địa chỉ (VD: Số 123 Đường ABC, Quận X...)" 
                                    value={formData.address} 
                                    onChange={handleFormChange} 
                                    className={inputClass} 
                                />
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
        </div>
    );
}