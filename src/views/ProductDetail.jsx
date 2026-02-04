import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ImageWithFallback } from "@/components/ImageWithFallback";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import PrescriptionForm from "@/components/ProductDetail/PrescriptionForm";
import RelatedSection from "@/components/ProductDetail/RelatedSection";

export default function ProductDetail() {
    const { id } = useParams();
    const [product, setProduct] = useState(null); //là object chứa thôg tin sản phẩm
    const [loading, setLoading] = useState(true); // là boolean khi bấm vô chi tiết lúc đợi dữ liệu từ API load lên
    const [error, setError] = useState(null); // còn boolean khi load bị lỗi hay sản phẩm bị gì đó thì hiện ra
    const [quantity, setQuantity] = useState(1); // Number số lượng sản phẩm mà khách hàng muốn mua
    const [openAccordion, setOpenAccordion] = useState(null); //Lưu chỉ số (index) của mục thông tin đang được mở (Mô tả, Vận chuyển...). Nếu bằng null nghĩa là tất cả đều đang đóng.
    const [previewUrl, setPreviewUrl] = useState(null); // Lưu đường dẫn tạm thời (Blob URL) của ảnh đơn thuốc mà khách hàng vừa tải lên
    const [method, setMethod] = useState("manual"); // để biết khách hàng nhập thủ công hay chọn ảnh
    const [prescriptionData, setPrescriptionData] = useState({
        //Object lớn chứa tất cả các thông số đo mắt của khách hàng (Cận, Viễn, Loạn, Lão cho cả 2 mắt) và file ảnh gốc.
        leftCan: "",
        leftVien: "",
        leftLoan: "",
        leftLao: "",
        rightCan: "",
        rightVien: "",
        rightLoan: "",
        rightLao: "",
        file: null,
    });

    const productTypeFrame = "Gọng kính";
    const productTypeLenses = "Tròng kính";
    const productTypeContactLenses = "Kính áp tròng";

    //call API, và khi id thay đổi thì reset các giá trị, và cuộn lên đầu trang
    useEffect(() => {
        const fetchProductDetail = async () => {
            try {
                setLoading(true);
                const response = await fetch(
                    `http://localhost:8080/api/products/${id}`,
                );
                if (!response.ok) throw new Error("Không tìm thấy sản phẩm!");
                const data = await response.json();
                setProduct(data);
                setQuantity(1);
                setOpenAccordion(null);
                setMethod("manual");
                setPreviewUrl(null);
                setPrescriptionData({
                    leftCan: "",
                    leftVien: "",
                    leftLoan: "",
                    leftLao: "",
                    rightCan: "",
                    rightVien: "",
                    rightLoan: "",
                    rightLao: "",
                    file: null,
                });
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        fetchProductDetail();
        window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    }, [id]);

    //theo dõi biến previewUrl. Khi khách hàng thay đổi ảnh đơn thuốc khác hoặc rời khỏi trang,
    //hàm này sẽ thực hiện URL.revokeObjectURL để giải phóng bộ nhớ đệm cho trình duyệt,
    //tránh tình trạng tràn bộ nhớ (Memory Leak).
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl, id]);

    //cập nhật từng trường dữ liệu nhỏ bên trong Object prescriptionData
    const handleUpdate = (field, value) => setPrescriptionData((prev) => ({ ...prev, [field]: value }));

    //Công dụng: Xử lý khi khách hàng chọn file ảnh đơn thuốc từ máy tính.
    //Logic: Tạo đường dẫn xem trước (previewUrl) và tự động chuyển phương thức nhập sang "upload".
    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            handleUpdate("file", file);
            setMethod("upload");
        }
    };

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

    const isGong = product.Product_Type === productTypeFrame;
    const isTrong = product.Product_Type === productTypeLenses;
    const isKinhApTrong = product.Product_Type === productTypeContactLenses;


    const complementaryProducts = isGong //mảng chứa sản phẩm bổ trợ
        ? product.relatedLenses || []
        : isTrong
            ? product.relatedFrames || []
            : [];
    const similarProducts = isKinhApTrong //mảng chứa sản phẩm tương tự
        ? product.relatedContactLenses || []
        : isGong
            ? product.relatedFrames || []
            : product.relatedLenses || [];

    return (
        <div className="w-full bg-white font-sans text-black antialiased">
            <Navbar />
            <div className="max-w-[1400px] mx-auto px-4 md:px-10 py-6">
                <div className="grid grid-cols-1 lg:grid-cols-[60%_40%] gap-8 items-start">
                    <div className="w-full">
                        <div className="relative aspect-[1/0.85] bg-[#F5F5F5] overflow-hidden rounded-sm group">
                            <ImageWithFallback
                                src={product.imageUrls?.[0]}
                                alt={product.name}
                                className="w-full h-full object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-110"
                            />
                        </div>
                    </div>

                    <div className="flex flex-col pl-4 lg:pl-10">
                        <h1 className="text-xl md:text-2xl font-bold uppercase">
                            {product.name}, mã hàng: {product.sku}
                        </h1>
                        <div className="text-2xl font-bold text-red-600 mb-6 font-mono">
                            {product.price.toLocaleString()}đ
                        </div>

                        {/* 4 Ảnh nhỏ dưới giá tiền */}
                        <div className="grid grid-cols-4 gap-2 mb-8">
                            {product.imageUrls?.slice(0, 4).map((url, i) => (
                                <div
                                    key={i}
                                    className="aspect-square border border-teal-500/30 overflow-hidden cursor-pointer p-1 bg-white"
                                >
                                    <ImageWithFallback
                                        src={url}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                            ))}
                        </div>

                        {(isTrong || isKinhApTrong) && (
                            <PrescriptionForm
                                method={method}
                                setMethod={setMethod}
                                data={prescriptionData}
                                onUpdate={handleUpdate}
                                onFileChange={handleFileChange}
                                previewUrl={previewUrl}
                            />
                        )}

                        <div className="space-y-4 mb-10">
                            <div className="flex gap-4 items-center">
                                <div className="flex border border-gray-300 h-10 items-center">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="px-3"
                                    >
                                        -
                                    </button>
                                    <div className="w-10 text-center">{quantity}</div>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="px-3"
                                    >
                                        +
                                    </button>
                                </div>
                                <button className="flex-1 border border-teal-500 text-teal-500 h-10 font-bold uppercase hover:bg-teal-50">
                                    THÊM VÀO GIỎ HÀNG
                                </button>
                            </div>
                            <button className="w-full bg-white border border-teal-500 text-teal-500 h-10 font-bold uppercase hover:bg-teal-500 hover:text-white transition-all">
                                MUA NGAY
                            </button>
                        </div>

                        <div className="border-t">
                            {[
                                "Thông tin mô tả",
                                "Vận chuyển",
                                "Bảo hành",
                                "Tìm cửa hàng",
                            ].map((item, index) => (
                                <div key={index} className="border-b">
                                    <button
                                        onClick={() =>
                                            setOpenAccordion(openAccordion === index ? null : index)
                                        }
                                        className="w-full py-4 flex justify-between font-bold uppercase text-[15px]"
                                    >
                                        <span>{item}</span>
                                        <span>{openAccordion === index ? "−" : "+"}</span>
                                    </button>
                                    <div
                                        className={`overflow-hidden transition-all duration-300 ${openAccordion === index ? "max-h-32 pb-4" : "max-h-0"}`}
                                    >
                                        <p className="text-[13px] text-gray-500 italic">
                                            {index === 0 ? product.Description : "Đang cập nhật..."}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Hiển thị Section theo logic phân loại của em */}
            {(isGong || isTrong) && (
                <RelatedSection
                    title={isGong ? "TRÒNG KÍNH BỔ TRỢ" : "GỌNG KÍNH BỔ TRỢ"}
                    products={complementaryProducts}
                />
            )}
            <RelatedSection title="SẢN PHẨM TƯƠNG TỰ" products={similarProducts} />

            <Footer />
        </div>
    );
}
