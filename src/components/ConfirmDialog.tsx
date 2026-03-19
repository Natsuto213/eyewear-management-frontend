import React from 'react';
import { AlertTriangle, Info, CheckCircle2 } from 'lucide-react';

interface ConfirmDialogProps {
    isOpen: boolean;
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    type?: 'danger' | 'warning' | 'info' | 'success';
    onConfirm: () => void;
    onCancel: () => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({
    isOpen, title, message, confirmText = 'Xác nhận', cancelText = 'Hủy', type = 'warning', onConfirm, onCancel
}) => {
    if (!isOpen) return null;

    // Bộ màu và Icon tương ứng với từng loại hành động
    const themes = {
        danger: { bg: 'bg-red-100', text: 'text-red-600', btn: 'bg-red-600 hover:bg-red-700', icon: AlertTriangle },
        warning: { bg: 'bg-yellow-100', text: 'text-yellow-600', btn: 'bg-yellow-600 hover:bg-yellow-700', icon: AlertTriangle },
        info: { bg: 'bg-blue-100', text: 'text-blue-600', btn: 'bg-blue-600 hover:bg-blue-700', icon: Info },
        success: { bg: 'bg-emerald-100', text: 'text-emerald-600', btn: 'bg-emerald-600 hover:bg-emerald-700', icon: CheckCircle2 },
    };

    const theme = themes[type];
    const Icon = theme.icon;

    return (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md p-6 transform transition-all animate-in fade-in zoom-in duration-200">
                <div className="flex flex-col items-center text-center">
                    <div className={`p-4 rounded-full ${theme.bg} ${theme.text} mb-4`}>
                        <Icon className="w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-2">{title}</h3>
                    <p className="text-sm text-gray-500 mb-6">{message}</p>
                </div>
                <div className="flex items-center gap-3 w-full">
                    <button
                        onClick={onCancel}
                        className="flex-1 px-4 py-2.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-xl transition-colors"
                    >
                        {cancelText}
                    </button>
                    <button
                        onClick={onConfirm}
                        className={`flex-1 px-4 py-2.5 text-white font-medium rounded-xl transition-colors ${theme.btn}`}
                    >
                        {confirmText}
                    </button>
                </div>
            </div>
        </div>
    );
};