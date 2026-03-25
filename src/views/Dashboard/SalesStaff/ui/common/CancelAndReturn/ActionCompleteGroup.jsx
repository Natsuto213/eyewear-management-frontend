import React from "react";
import { CheckCircle } from "lucide-react";
import ImageCustom from "../ImageCustom"; // Đảm bảo đường dẫn này đúng với project của bạn

export default function ActionCompleteGroup({
    evidenceFile,
    setEvidenceFile,
    onComplete,

}) {
    return (

        <div className="flex flex-col gap-4">


            <>
                <p className="text-sm font-bold text-gray-800">
                    Tiến trình xử lý (Hoàn tiền & Nhập kho)
                </p>

                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <p className="text-xs font-semibold text-gray-700 mb-3">
                        Ảnh minh chứng hoàn trả (*)
                    </p>
                    <ImageCustom
                        onFileSelect={(file) => setEvidenceFile(file)}
                        onRemove={() => setEvidenceFile(null)}
                    />
                </div>
            </>

            <button
                className={`w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl transition-all font-bold shadow ${evidenceFile
                    ? "bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white"
                    : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }`}
                type="button"
                disabled={!evidenceFile}
                onClick={onComplete}
            >
                <CheckCircle className="w-5 h-5" />
                XÁC NHẬN HOÀN THÀNH
            </button>
        </div>
    );
}
