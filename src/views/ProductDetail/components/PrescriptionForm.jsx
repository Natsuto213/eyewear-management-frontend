//Component nhập thông số mắt
export default function PrescriptionForm({
    method,
    setMethod,
    data,
    onUpdate,
    onFileChange,
    previewUrl,
    errors,
    onBlurAction,
}) {
    const eyes = [
        { label: "Mắt trái (L/OS)", prefix: "left" },
        { label: "Mắt phải (R/OD)", prefix: "right" },
    ];

    return (
        <div className="mb-8 p-6 bg-[#F8FDFD] border border-teal-100 rounded-md shadow-sm">
            <div className="flex justify-between items-start mb-6">
                <div>
                    <h3 className="text-[13px] font-black uppercase tracking-widest text-teal-800">
                        Thông số mắt
                    </h3>
                    <p className="text-[9px] font-bold text-teal-600/60 uppercase tracking-tighter mt-1">
                        (Chọn nhập số hoặc gửi ảnh)
                    </p>
                </div>
                <div className="flex gap-4 text-[11px] font-bold">
                    <button
                        onClick={() => setMethod("manual")}
                        className={`transition-colors py-1 ${method === "manual" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-400"}`}
                    >
                        NHẬP SỐ
                    </button>
                    <button
                        onClick={() => setMethod("upload")}
                        className={`transition-colors py-1 ${method === "upload" ? "text-teal-600 border-b-2 border-teal-600" : "text-gray-400"}`}
                    >
                        GỬI ẢNH
                    </button>
                </div>
            </div>

            {method === "manual" ? (
                <div className="space-y-6 animate-fadeIn">
                    {eyes.map((eye) => (
                        <div key={eye.prefix} className="space-y-2">
                            <label className="text-[10px] font-black text-gray-400 uppercase">
                                {eye.label}
                            </label>
                            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                {["Can", "Vien", "Loan", "Lao"].map((type) => {
                                    const fieldName = `${eye.prefix}${type}`;
                                    const errorMsg = errors[fieldName]; // Lấy lỗi của riêng ô này từ Cha truyền xuống
                                    return (
                                        <div key={type} className="border-b border-gray-200">
                                            <p className="text-[8px] font-bold text-teal-600 uppercase">
                                                {type === "Lao" ? "Lão thị (Add)" : type}
                                            </p>
                                            <input
                                                type="text"
                                                placeholder="0.00"
                                                value={data[`${eye.prefix}${type}`]}
                                                onChange={(e) =>
                                                    onUpdate(`${eye.prefix}${type}`, e.target.value)
                                                }
                                                onBlur={(e) => { //Kiểm tra lỗi các ô input số đo, hàm kiểm tra trong src/untils/validate.js
                                                    onBlurAction(fieldName, e.target.value, type);
                                                }}
                                                className="w-full py-1 text-sm bg-transparent outline-none focus:border-teal-500"
                                            />
                                            {/* Hiển thị chữ đỏ ngay dưới input */}
                                            {errorMsg && (
                                                <span className="text-[10px] text-red-600 mt-1 font-medium">
                                                    {errorMsg}
                                                </span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <label className="group cursor-pointer relative flex flex-col items-center justify-center w-full min-h-[250px] border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 bg-white shadow-inner overflow-hidden">
                    {previewUrl ? (
                        <img src={previewUrl} className="w-full h-[200px] object-contain" />
                    ) : (
                        <span className="text-4xl opacity-40">📄</span>
                    )}
                    <input
                        type="file"
                        className="hidden"
                        onChange={onFileChange}
                        accept="image/*"
                    />
                </label>
            )}
        </div>
    );
}