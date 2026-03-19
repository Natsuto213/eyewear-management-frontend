import React, { useEffect } from 'react';
import { CheckCircle2, XCircle, X } from 'lucide-react';

interface PopupProps {
    isOpen: boolean;
    message: string;
    type: 'success' | 'error';
    onClose: () => void;
}

export const Popup: React.FC<PopupProps> = ({ isOpen, message, type, onClose }) => {
    // Tự động đóng popup sau 3 giây
    useEffect(() => {
        if (isOpen) {
            const timer = setTimeout(() => {
                onClose();
            }, 3000);
            return () => clearTimeout(timer);
        }
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    const isSuccess = type === 'success';

    return (
        <div className="fixed top-6 right-6 z-[9999] transition-all duration-300 ease-in-out transform">
            <div className={`flex items-start gap-3 px-4 py-4 rounded-xl shadow-2xl border min-w-[300px] max-w-md ${
                isSuccess 
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-800' 
                    : 'bg-red-50 border-red-200 text-red-800'
            }`}>
                {/* Icon trạng thái */}
                <div className="shrink-0 mt-0.5">
                    {isSuccess ? (
                        <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    ) : (
                        <XCircle className="w-5 h-5 text-red-500" />
                    )}
                </div>

                {/* Nội dung tin nhắn */}
                <div className="flex-1">
                    <h4 className={`text-sm font-bold mb-0.5 ${isSuccess ? 'text-emerald-800' : 'text-red-800'}`}>
                        {isSuccess ? 'Thành công' : 'Thất bại'}
                    </h4>
                    <p className="text-sm opacity-90">{message}</p>
                </div>

                {/* Nút đóng */}
                <button 
                    onClick={onClose} 
                    className={`shrink-0 p-1 rounded-lg transition-colors ${
                        isSuccess ? 'hover:bg-emerald-100 text-emerald-600' : 'hover:bg-red-100 text-red-600'
                    }`}
                >
                    <X className="w-4 h-4" />
                </button>
            </div>
        </div>
    );
};