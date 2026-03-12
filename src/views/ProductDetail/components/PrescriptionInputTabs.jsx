import React, { useRef, useState } from "react";
import { PRESCRIPTION_FIELDS } from "../utils/constants";
import { api } from "../../../lib/api";

/**
 * Component cho phép chọn giữa nhập bảng thông số hoặc upload ảnh đơn thuốc.
 * Props:
 *   - data, errors, onUpdate, onBlur: dùng cho bảng nhập liệu
 */
export default function PrescriptionInputTabs({ data, errors, onUpdate, onBlur }) {
    const [mode, setMode] = useState("form"); // "form" hoặc "image"
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("");
    const [loadingParse, setLoadingParse] = useState(false);
    const [warnings, setWarnings] = useState([]);
    const inputRef = useRef();

    // Khi chọn file mới
    const handleFileChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            if (image) URL.revokeObjectURL(image);
            setImage(URL.createObjectURL(file));
            setFileName(file.name);
            setLoadingParse(true);
            setWarnings([]);
            try {
                const formData = new FormData();
                formData.append("file", file);
                const response = await api.post("api/prescriptions/parse-image", formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        // "Authorization": `Bearer ${your_token}` // Nếu server yêu cầu
                    }
                });
                const result = response.data;
                console.log("API parse-image result:", result);
                if (result.code === 1000 && result.result) {
                    // Map API fields to rxData
                    const parsed = result.result;
                    // Chuyển sang định dạng rxData
                    const rxMap = {
                        leftSPH: parsed.leftEyeSph,
                        leftCYL: parsed.leftEyeCyl,
                        leftAXIS: parsed.leftEyeAxis,
                        leftADD: parsed.leftEyeAdd,
                        rightSPH: parsed.rightEyeSph,
                        rightCYL: parsed.rightEyeCyl,
                        rightAXIS: parsed.rightEyeAxis,
                        rightADD: parsed.rightEyeAdd,
                        PD: parsed.pd,
                        PDLeft: parsed.pdLeft,
                        PDRight: parsed.pdRight,
                    };
                    // Cập nhật từng field vào form
                    Object.entries(rxMap).forEach(([field, value]) => {
                        onUpdate && onUpdate(field, value ?? "");
                    });
                    if (parsed.warnings) setWarnings(parsed.warnings);
                    console.log("Parsed prescription data:", rxMap, "Warnings:", parsed.warnings);
                    if (parsed.warnings?.length === 0) {
                        setMode("form");
                    }
                } else {
                    setWarnings([result.message || "Không nhận diện được đơn thuốc."]);
                }
            } catch (err) {
                setWarnings(["Không thể nhận diện các số đo trong ảnh."]);
                console.error("Lỗi khi gọi API parse-image:", err);
            }
            setLoadingParse(false);
        }
    };
    // Khi bấm Xóa ảnh
    const handleRemove = () => {
        if (image) URL.revokeObjectURL(image);
        setImage(null);
        setFileName("");
        setWarnings([]);
        if (inputRef.current) inputRef.current.value = "";
    };

    return (
        <div className="mb-6 p-5 bg-teal-50/60 border border-teal-200 rounded-xl">
            <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-teal-800">
                        ĐƠN THUỐC MẮT
                    </h3>
                    <p className="text-xs text-teal-600 mt-1">
                        Chọn 1 trong 2 cách: nhập thông số hoặc upload ảnh đơn thuốc.
                    </p>
                </div>
                <div className="flex gap-2 mt-2 md:mt-0">
                    <button
                        type="button"
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${mode === "form" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-teal-700 border-teal-300 hover:bg-teal-50"}`}
                        onClick={() => setMode("form")}
                    >
                        Nhập thông số
                    </button>
                    <button
                        type="button"
                        className={`px-3 py-1 rounded-lg text-xs font-semibold border transition-all ${mode === "image" ? "bg-teal-600 text-white border-teal-600" : "bg-white text-teal-700 border-teal-300 hover:bg-teal-50"}`}
                        onClick={() => setMode("image")}
                    >
                        Upload ảnh
                    </button>
                </div>
            </div>

            {mode === "form" ? (
                <>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr>
                                    <th className="text-left py-2 pr-3 text-gray-500 font-medium w-32">Thông số</th>
                                    <th className="text-center py-2 px-3 text-teal-700 font-semibold">Mắt Trái (OS)</th>
                                    <th className="text-center py-2 px-3 text-teal-700 font-semibold">Mắt Phải (OD)</th>
                                </tr>
                            </thead>
                            <tbody>
                                {PRESCRIPTION_FIELDS.map(({ key, label, unit }) => (
                                    <tr key={key} className="border-t border-teal-100">
                                        <td className="py-2 pr-3 text-gray-600 font-medium text-xs">
                                            {label}
                                            <span className="text-gray-400 ml-1">({unit})</span>
                                        </td>
                                        {["left", "right"].map((side) => {
                                            const fieldName = `${side}${key}`;
                                            const errorMsg = errors?.[fieldName];
                                            return (
                                                <td key={side} className="py-2 px-3 text-center">
                                                    <input
                                                        type="text"
                                                        inputMode="decimal"
                                                        value={data?.[fieldName] || ""}
                                                        placeholder="0"
                                                        onChange={(e) => onUpdate && onUpdate(fieldName, e.target.value)}
                                                        onBlur={() => onBlur && onBlur(fieldName, key, side)}
                                                        className={`w-20 text-center border rounded-lg px-2 py-1.5 text-sm outline-none transition
                          focus:ring-2 focus:ring-teal-400 focus:border-teal-500
                          ${errorMsg ? "border-red-400 bg-red-50" : "border-gray-300 bg-white hover:border-teal-300"}`}
                                                    />
                                                    {errorMsg && (
                                                        <p className="text-[10px] text-red-500 mt-0.5 leading-tight">{errorMsg}</p>
                                                    )}
                                                </td>
                                            );
                                        })}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3 italic">
                        * Thông tin đơn thuốc sẽ được lưu kèm đơn hàng để kỹ thuật viên cắt kính đúng độ.
                    </p>
                </>
            ) : (
                <>
                    <div className="flex flex-col items-center gap-4">
                        {!image ? (
                            <input
                                type="file"
                                accept="image/*"
                                ref={inputRef}
                                onChange={handleFileChange}
                                className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200"
                            />
                        ) : (
                            <div className="flex flex-col items-center gap-2">
                                <img src={image} alt="Đơn thuốc" className="max-h-60 rounded-lg border border-teal-200 shadow" />
                                <span className="text-xs text-gray-500">{fileName}</span>
                                <button
                                    type="button"
                                    onClick={handleRemove}
                                    className="mt-2 px-4 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200"
                                >
                                    Xóa ảnh
                                </button>
                                {loadingParse && <div className="text-xs text-teal-600 mt-2">Đang nhận diện đơn thuốc...</div>}
                                {warnings.length > 0 && (
                                    <ul className="mt-2 text-xs text-orange-600 bg-orange-50 rounded-lg p-2">
                                        {warnings.map((w, i) => <li key={i}> {w}</li>)}
                                    </ul>
                                )}
                            </div>
                        )}
                    </div>
                    <p className="text-[10px] text-gray-400 mt-3 italic">
                        * Ảnh đơn thuốc sẽ được gửi kèm đơn hàng để kỹ thuật viên kiểm tra và cắt kính đúng độ.
                    </p>
                </>
            )}
        </div>
    );
}
