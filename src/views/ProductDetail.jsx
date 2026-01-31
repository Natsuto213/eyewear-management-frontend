import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ProductDetail() {
    const { id } = useParams();

    const [quantity, setQuantity] = useState(1);
    const [openAccordion, setOpenAccordion] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [method, setMethod] = useState("manual");

    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [prescriptionData, setPrescriptionData] = useState({
        leftCan: "0", // Cận thị trái
        leftVien: "0", // Viễn thị trái
        leftLoan: "0", // Loạn thị trái
        leftLao: "0", // Lão thị trái
        rightCan: "0", // Cận thị phải
        rightVien: "0", // Viễn thị phải
        rightLoan: "0", // Loạn thị phải
        rightLao: "0", // Lão thị phải
        file: null,
    });

    const productTypeFrame = "Gọng kính";
    const productTypeLenses = "Tròng kính";
    const productTypeContactLenses = "Kính áp tròng";

    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                setError(null);

                const response = await fetch(
                    `http://localhost:8080/api/products/${id}`,
                );

                if (!response.ok) {
                    throw new Error("Không tìm thấy sản phẩm trên hệ thống!");
                }

                const data = await response.json();
                setProduct(data); // Cập nhật dữ liệu vào state

                // Reset các thông số giao diện khi đổi sản phẩm thành công
                setQuantity(1);
                setOpenAccordion(null);
                setMethod("manual");
                setPrescriptionData({
                    leftCan: "0", // Cận thị trái
                    leftVien: "0", // Viễn thị trái
                    leftLoan: "0", // Loạn thị trái
                    leftLao: "0", // Lão thị trái
                    rightCan: "0", // Cận thị phải
                    rightVien: "0", // Viễn thị phải
                    rightLoan: "0", // Loạn thị phải
                    rightLao: "0", // Lão thị phải
                    file: null,
                });
            } catch (err) {
                console.error("Lỗi API:", err.message);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();

        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [id]);

    // useEffect khi cập nhật ảnh mới thì ảnh cũ trong bộ nhớ trình duyệt sẽ bị xoá (Memory Leak)
    useEffect(() => {
        return () => {
            if (previewUrl) {
                console.log("Đang giải phóng bộ nhớ cho ảnh:", previewUrl);
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, [previewUrl]);

    if (loading) {
        return (
            <div className="w-full h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-teal-500"></div>
                <p className="ml-4 font-bold text-teal-800 uppercase tracking-widest">
                    Đang lấy dữ liệu...
                </p>
            </div>
        );
    }

    if (error || !product) {
        return (
            <div className="text-center py-40">
                <h2 className="text-2xl font-bold text-red-600">
                    {error || "Sản phẩm không tồn tại!"}
                </h2>
                <Link to="/all-product" className="mt-4 text-teal-600 underline">
                    Quay lại cửa hàng
                </Link>
            </div>
        );
    }

    // cập nhật dữ liệu mới
    const handleUpdate = (field, value) => {
        setPrescriptionData((prev) => ({ ...prev, [field]: value }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            handleUpdate("file", file);
            setMethod("upload");
        }
    };

    // kiểm tra điều kiện để bỏ vào giỏ hàng
    const validatePrescription = () => {
        // 1. Gọng kính thì cho qua luôn
        if (!isTrong && !isKinhApTrong) return true;

        if (method === "manual") {
            // Danh sách các biến của từng mắt
            const leftFields = [
                prescriptionData.leftCan,
                prescriptionData.leftVien,
                prescriptionData.leftLoan,
                prescriptionData.leftLao,
            ];
            const rightFields = [
                prescriptionData.rightCan,
                prescriptionData.rightVien,
                prescriptionData.rightLoan,
                prescriptionData.rightLao,
            ];

            // Kiểm tra xem mỗi mắt đã nhập ít nhất 1 ô chưa
            const isLeftEntered = leftFields.some((val) => val.trim() !== "");
            const isRightEntered = rightFields.some((val) => val.trim() !== "");

            if (!isLeftEntered || !isRightEntered) {
                alert(
                    "Vui lòng nhập ít nhất một loại thông số độ mắt (Cận/Viễn/Loạn/Lão) cho cả hai bên!",
                );
                return false;
            }

            // Kiểm tra: Nếu đã nhập thì phải là định dạng số
            const allValues = [...leftFields, ...rightFields];
            const hasInvalidNumber = allValues.some(
                (val) => val.trim() !== "" && isNaN(val),
            );

            if (hasInvalidNumber) {
                alert("Thông số độ mắt phải là định dạng số (ví dụ: -2.5 hoặc 1.0)!");
                return false;
            }
        } else {
            // 2. Nếu là upload ảnh thì bắt buộc phải có file
            if (!prescriptionData.file) {
                alert("Vui lòng tải lên ảnh đơn thuốc của bạn!");
                return false;
            }
        }

        return true;
    };

    // đây là khi bấm thêm giỏ hàng thì hàm này xử lý
    const handleAddToCart = () => {
        if (!validatePrescription()) return;

        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: quantity,
            method: method,
            details:
                method === "manual"
                    ? {
                        left: {
                            can: prescriptionData.leftCan,
                            vien: prescriptionData.leftVien,
                            loan: prescriptionData.leftLoan,
                            lao: prescriptionData.leftLao,
                        },
                        right: {
                            can: prescriptionData.rightCan,
                            vien: prescriptionData.rightVien,
                            loan: prescriptionData.rightLoan,
                            lao: prescriptionData.rightLao,
                        },
                    }
                    : {
                        imageName: prescriptionData.file?.name,
                        imageUrl: previewUrl,
                    },
        };

        console.log("Kiện hàng gửi đi:", cartItem);
        alert(`Đã thêm vào giỏ hàng thành công!`);
    };

    if (!product)
        return <div className="text-center py-40">Sản phẩm không tồn tại!</div>;

    const isGong = product.Product_Type === productTypeFrame;
    const isTrong = product.Product_Type === productTypeLenses;
    const isKinhApTrong = product.Product_Type === productTypeContactLenses;

    const sectionTitle = isGong
        ? "TRÒNG KÍNH BỔ TRỢ"
        : isTrong
            ? "GỌNG KÍNH BỔ TRỢ"
            : "SẢN PHẨM TƯƠNG TỰ";
    const relatedCategory = isGong
        ? productTypeLenses
        : isTrong
            ? productTypeFrame
            : product.Product_Type;

    let relatedProducts = [];
    let similarProducts = [];

    if (product.Product_Type !== productTypeContactLenses) {
        const frames = product.relatedFrames ?? [];
        const lenses = product.relatedLenses ?? [];
        relatedProducts = frames
            .concat(lenses)
            .filter(
                (p) =>
                    p.Product_Type === relatedCategory && p.id !== product.id,
            )
            .slice(0, 4);
        similarProducts = frames
            .concat(lenses)
            .filter(
                (p) =>
                    p.Product_Type === product.Product_Type &&
                    p.id !== product.id,
            )
            .slice(0, 4);
    } else {
        relatedProducts = product.relatedContactLenses;
    }

    return (
        <div className="w-full bg-white font-sans text-black antialiased">
            <Navbar />
            <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-start">
                    <div className="w-full">
                        <div className="relative aspect-[1/0.85] bg-[#F5F5F5] overflow-hidden group rounded-sm">
                            <ImageWithFallback
                                src={product.imageUrls[0]}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col pl-4 lg:pl-10">
                        <div className="mb-4">
                            <h1 className="text-xl md:text-2xl font-bold text-gray-800 leading-tight uppercase">
                                {product.name}, mã hàng: {product.sku}
                            </h1>
                        </div>
                        <div className="text-2xl font-bold text-red-600 mb-6 font-mono">
                            {product.price.toLocaleString()}đ
                        </div>

                        {(isTrong || isKinhApTrong) && (
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
                                        {[
                                            { label: "Mắt trái (L/OS)", prefix: "left" },
                                            { label: "Mắt phải (R/OD)", prefix: "right" },
                                        ].map((eye) => (
                                            <div key={eye.prefix} className="space-y-2">
                                                <label className="text-[10px] font-black text-gray-400 uppercase">
                                                    {eye.label}
                                                </label>
                                                <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                                                    {/* Cận thị */}
                                                    <div className="border-b border-gray-200">
                                                        <p className="text-[8px] font-bold text-teal-600 uppercase">
                                                            Cận thị
                                                        </p>
                                                        <input
                                                            type="text"
                                                            placeholder="0.00"
                                                            value={prescriptionData[`${eye.prefix}Can`]}
                                                            onChange={(e) =>
                                                                handleUpdate(
                                                                    `${eye.prefix}Can`,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full py-1 text-sm bg-transparent outline-none focus:border-teal-500"
                                                        />
                                                    </div>
                                                    {/* Viễn thị */}
                                                    <div className="border-b border-gray-200">
                                                        <p className="text-[8px] font-bold text-teal-600 uppercase">
                                                            Viễn thị
                                                        </p>
                                                        <input
                                                            type="text"
                                                            placeholder="0.00"
                                                            value={prescriptionData[`${eye.prefix}Vien`]}
                                                            onChange={(e) =>
                                                                handleUpdate(
                                                                    `${eye.prefix}Vien`,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full py-1 text-sm bg-transparent outline-none"
                                                        />
                                                    </div>
                                                    {/* Loạn thị */}
                                                    <div className="border-b border-gray-200">
                                                        <p className="text-[8px] font-bold text-teal-600 uppercase">
                                                            Loạn thị
                                                        </p>
                                                        <input
                                                            type="text"
                                                            placeholder="0.00"
                                                            value={prescriptionData[`${eye.prefix}Loan`]}
                                                            onChange={(e) =>
                                                                handleUpdate(
                                                                    `${eye.prefix}Loan`,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full py-1 text-sm bg-transparent outline-none"
                                                        />
                                                    </div>
                                                    {/* Lão thị */}
                                                    <div className="border-b border-gray-200">
                                                        <p className="text-[8px] font-bold text-teal-600 uppercase">
                                                            Lão thị (Add)
                                                        </p>
                                                        <input
                                                            type="text"
                                                            placeholder="0.00"
                                                            value={prescriptionData[`${eye.prefix}Lao`]}
                                                            onChange={(e) =>
                                                                handleUpdate(
                                                                    `${eye.prefix}Lao`,
                                                                    e.target.value,
                                                                )
                                                            }
                                                            className="w-full py-1 text-sm bg-transparent outline-none"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="animate-fadeIn">
                                        <label className="group cursor-pointer relative flex flex-col items-center justify-center w-full min-h-[250px] border-2 border-dashed border-gray-300 rounded-lg hover:border-teal-500 hover:bg-white transition-all overflow-hidden bg-white shadow-inner">
                                            {previewUrl ? (
                                                <div className="w-full h-full flex flex-col items-center p-2">
                                                    <img
                                                        src={previewUrl}
                                                        alt="Preview"
                                                        className="w-full h-[200px] object-contain"
                                                    />
                                                    <span className="text-[10px] text-teal-600 font-bold mt-2 uppercase tracking-tighter">
                                                        Bấm để thay đổi ảnh khác
                                                    </span>
                                                </div>
                                            ) : (
                                                <div className="flex flex-col items-center py-10 opacity-40 group-hover:opacity-100 transition-opacity">
                                                    <span className="text-4xl mb-3">📄</span>
                                                    <span className="text-xs font-bold uppercase tracking-tighter">
                                                        Tải lên đơn thuốc
                                                    </span>
                                                </div>
                                            )}
                                            <input
                                                type="file"
                                                className="hidden"
                                                onChange={handleFileChange}
                                                accept="image/*"
                                            />
                                        </label>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-4 gap-2 mb-8">
                            {[1, 2, 3, 4].map((i) => (
                                <div
                                    key={i}
                                    className="aspect-square border border-teal-500/30 overflow-hidden cursor-pointer hover:border-teal-500 transition p-1 bg-white"
                                >
                                    <ImageWithFallback
                                        src={product.imageUrls[0]}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4 mb-10">
                            <div className="flex gap-4 items-center">
                                <div className="flex border border-gray-300 h-10 items-center rounded-sm overflow-hidden">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-8 h-full bg-white hover:bg-gray-100 text-gray-500 border-r border-gray-300 transition"
                                    >
                                        -
                                    </button>
                                    <div className="w-10 text-center font-medium text-sm">
                                        {quantity}
                                    </div>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-8 h-full bg-white hover:bg-gray-100 text-gray-500 border-l border-gray-300 transition"
                                    >
                                        +
                                    </button>
                                </div>
                                {/* GẮN HÀM handleAddToCart VÀO ĐÂY */}
                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 border border-teal-500 text-teal-500 h-10 text-[11px] font-bold uppercase tracking-widest hover:bg-teal-50 transition-all"
                                >
                                    THÊM VÀO GIỎ HÀNG
                                </button>
                            </div>
                            <button
                                onClick={handleAddToCart}
                                className="w-full bg-white border border-teal-500 text-teal-500 h-10 text-[11px] font-bold uppercase tracking-widest hover:bg-teal-500 hover:text-white transition-all"
                            >
                                MUA NGAY
                            </button>
                        </div>

                        <div className="border-t border-gray-200">
                            {[
                                "Thông tin chi tiết ở mô tả",
                                "Chính sách vận chuyển",
                                "Chế độ bảo hành",
                                "Tìm cửa hàng",
                            ].map((item, index) => (
                                <div key={index} className="border-b border-gray-200">
                                    <button
                                        onClick={() =>
                                            setOpenAccordion(openAccordion === index ? null : index)
                                        }
                                        className="w-full py-4 flex justify-between items-center group"
                                    >
                                        <span className="text-[15px] font-bold text-gray-700 uppercase">
                                            {item}
                                        </span>
                                        <span className="text-xl font-light">
                                            {openAccordion === index ? "−" : "+"}
                                        </span>
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${openAccordion === index ? "max-h-32 pb-4" : "max-h-0"}`}
                                    >
                                        <p className="text-[13px] text-gray-500 leading-relaxed italic">
                                            {index === 0 ? product.Description : "Thông tin chi tiết đang được cập nhật..."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
            <RelatedSection title={sectionTitle} products={relatedProducts} />
            {product.Product_Type !== productTypeContactLenses && (
                <RelatedSection
                    title="SẢN PHẨM TƯƠNG TỰ"
                    products={similarProducts}
                    category={product.Product_Type}
                />
            )}
            <Footer />
        </div>
    );
}


function RelatedSection({ title, products, category }) {
    return (
        <section className="w-full bg-white mt-10">
            <div className="w-full h-[2px] bg-[#00B5AD]/30"></div>
            <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-12">
                <div className="flex justify-between items-center mb-10">
                    <h2 className="text-3xl md:text-4xl font-bold text-gray-900 tracking-tight uppercase">
                        {title}
                    </h2>
                    <Link
                        to={category ? `/all-product` : "/all-product"}
                        className="text-[#00B5AD] font-medium flex items-center gap-1 hover:underline transition-all"
                    >
                        → Xem thêm
                    </Link>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                    {products.map((item) => (
                        <ProductCard key={item.id} item={item} />
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProductCard({ item }) {
    return (
      <Link
        to={`/product/${item.id}`}
        className="group border border-gray-200 rounded-sm overflow-hidden hover:shadow-lg transition-all duration-300 flex flex-col h-full bg-white"
      >
        <div className="aspect-square p-4 flex items-center justify-center overflow-hidden">
          <ImageWithFallback
            src={item.Image_URL}
            alt={item.name}
            className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
          />
        </div>
        <div className="p-4 border-t border-gray-100 text-center mt-auto">
          <p className="text-sm font-bold text-gray-800 truncate mb-1 uppercase tracking-tighter">
            {item.name}
          </p>
          <p className="text-red-600 font-bold text-base">
            {item.price.toLocaleString()}đ
          </p>
        </div>
      </Link>
    );
}
