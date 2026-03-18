import React, { useState, useRef, useEffect } from 'react';

// Nhận 2 props từ Component Cha để giao tiếp dữ liệu
function ImageCustom({ onFileSelect, onRemove }) {
    const [image, setImage] = useState(null);
    const [fileName, setFileName] = useState("");
    const [warnings, setWarnings] = useState([]);
    const inputRef = useRef();

    const handleFileChange = (e) => {
        const file = e.target.files[0];

        if (file) {
            // (Tùy chọn) Kiểm tra dung lượng file trước khi hiển thị (Ví dụ: tối đa 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setWarnings(["Dung lượng ảnh không được vượt quá 5MB."]);
                return;
            }

            // Xóa sạch cảnh báo cũ nếu file hợp lệ
            setWarnings([]);

            // Quản lý bộ nhớ RAM: Giải phóng URL cũ trước khi tạo URL mới
            if (image) URL.revokeObjectURL(image);

            // Hiển thị ảnh xem trước
            setImage(URL.createObjectURL(file));
            setFileName(file.name);

            // Truyền file vật lý (raw file) lên cho Component Cha
            if (onFileSelect) {
                onFileSelect(file);
            }
        }
    };

    const handleRemove = () => {
        // Dọn dẹp giao diện và bộ nhớ
        if (image) URL.revokeObjectURL(image);
        setImage(null);
        setFileName("");
        setWarnings([]);
        if (inputRef.current) inputRef.current.value = "";

        // Báo cho Component Cha biết để xóa file khỏi dữ liệu Form
        if (onRemove) {
            onRemove();
        }
    };

    // Cleanup: Chắc chắn rằng khi người dùng rời khỏi trang, bộ nhớ RAM lưu ảnh cũng được giải phóng
    useEffect(() => {
        return () => {
            if (image) URL.revokeObjectURL(image);
        };
    }, [image]);

    return (
        <div className="w-full">
            <div className="flex flex-col items-center gap-4">
                {!image ? (
                    <input
                        type="file"
                        accept="image/*"
                        ref={inputRef}
                        onChange={handleFileChange}
                        className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-teal-100 file:text-teal-700 hover:file:bg-teal-200 cursor-pointer"
                    />
                ) : (
                    <div className="flex flex-col items-center gap-2 w-full">
                        <img
                            src={image}
                            alt="Ảnh minh chứng"
                            className="max-h-60 w-full object-contain rounded-lg border border-teal-200 shadow-sm bg-gray-50"
                        />
                        <span className="text-xs text-gray-500 truncate max-w-[250px]">{fileName}</span>

                        <div className="flex gap-2">
                            <button
                                type="button"
                                onClick={handleRemove}
                                className="mt-2 px-4 py-1 bg-red-100 text-red-700 rounded-lg text-xs font-semibold hover:bg-red-200 transition-colors"
                            >
                                Xóa ảnh
                            </button>
                            <label className="mt-2 px-4 py-1 bg-teal-100 text-teal-700 rounded-lg text-xs font-semibold hover:bg-teal-200 cursor-pointer transition-colors">
                                Thay ảnh khác
                                <input type="file" hidden accept="image/*" onChange={handleFileChange} />
                            </label>
                        </div>

                        {warnings.length > 0 && (
                            <ul className="mt-2 text-xs text-orange-600 bg-orange-50 rounded-lg p-2 border border-orange-200 w-full text-center">
                                {warnings.map((w, i) => <li key={i}>{w}</li>)}
                            </ul>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ImageCustom;