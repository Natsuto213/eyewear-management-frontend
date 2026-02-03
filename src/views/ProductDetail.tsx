import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ImageWithFallback } from "../components/ImageWithFallback";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* =======================
   TYPES
======================= */

type PrescriptionKey =
    | "leftCan"
    | "leftVien"
    | "leftLoan"
    | "leftLao"
    | "rightCan"
    | "rightVien"
    | "rightLoan"
    | "rightLao"
    | "file";

interface PrescriptionData {
    leftCan: string;
    leftVien: string;
    leftLoan: string;
    leftLao: string;
    rightCan: string;
    rightVien: string;
    rightLoan: string;
    rightLao: string;
    file: File | null;
}

interface Product {
    id: number;
    name: string;
    sku: string;
    price: number;
    Product_Type: string;
    Description?: string;
    imageUrls: string[];
    relatedFrames?: Product[];
    relatedLenses?: Product[];
    relatedContactLenses?: Product[];
    Image_URL?: string;
}

/* =======================
   COMPONENT
======================= */

export default function ProductDetail() {
    const { id } = useParams<{ id: string }>();

    const [quantity, setQuantity] = useState<number>(1);
    const [openAccordion, setOpenAccordion] = useState<number | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [method, setMethod] = useState<"manual" | "upload">("manual");

    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [prescriptionData, setPrescriptionData] =
        useState<PrescriptionData>({
            leftCan: "0",
            leftVien: "0",
            leftLoan: "0",
            leftLao: "0",
            rightCan: "0",
            rightVien: "0",
            rightLoan: "0",
            rightLao: "0",
            file: null,
        });

    const productTypeFrame = "Gọng kính";
    const productTypeLenses = "Tròng kính";
    const productTypeContactLenses = "Kính áp tròng";

    /* =======================
       FETCH DATA
    ======================= */

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

                const data: Product = await response.json();
                setProduct(data);

                setQuantity(1);
                setOpenAccordion(null);
                setMethod("manual");
                setPrescriptionData({
                    leftCan: "0",
                    leftVien: "0",
                    leftLoan: "0",
                    leftLao: "0",
                    rightCan: "0",
                    rightVien: "0",
                    rightLoan: "0",
                    rightLao: "0",
                    file: null,
                });
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError("Đã xảy ra lỗi không xác định");
                }
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetail();
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [id]);

    useEffect(() => {
        return () => {
            if (previewUrl) {
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

    /* =======================
       HANDLERS
    ======================= */

    const handleUpdate = (field: PrescriptionKey, value: string | File | null) => {
        setPrescriptionData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
            handleUpdate("file", file);
            setMethod("upload");
        }
    };

    const isGong = product.Product_Type === productTypeFrame;
    const isTrong = product.Product_Type === productTypeLenses;
    const isKinhApTrong = product.Product_Type === productTypeContactLenses;

    const validatePrescription = (): boolean => {
        if (!isTrong && !isKinhApTrong) return true;

        if (method === "manual") {
            const left = [
                prescriptionData.leftCan,
                prescriptionData.leftVien,
                prescriptionData.leftLoan,
                prescriptionData.leftLao,
            ];
            const right = [
                prescriptionData.rightCan,
                prescriptionData.rightVien,
                prescriptionData.rightLoan,
                prescriptionData.rightLao,
            ];

            if (!left.some((v) => v.trim()) || !right.some((v) => v.trim())) {
                alert("Vui lòng nhập thông số cho cả hai mắt");
                return false;
            }

            if ([...left, ...right].some((v) => v.trim() && isNaN(Number(v)))) {
                alert("Thông số phải là số hợp lệ");
                return false;
            }
        } else if (!prescriptionData.file) {
            alert("Vui lòng tải ảnh đơn thuốc");
            return false;
        }

        return true;
    };

    const handleAddToCart = () => {
        if (!validatePrescription()) return;

        const cartItem = {
            id: product.id,
            name: product.name,
            price: product.price,
            quantity,
            method,
        };

        console.log("Đã thêm vào giỏ:", cartItem);
        alert("Đã thêm vào giỏ hàng!");
    };

    /* =======================
       RELATED PRODUCTS
    ======================= */

    let relatedProducts: Product[] = [];
    let similarProducts: Product[] = [];

    if (!isKinhApTrong) {
        const frames = product.relatedFrames ?? [];
        const lenses = product.relatedLenses ?? [];

        relatedProducts = [...frames, ...lenses].slice(0, 4);
        similarProducts = [...frames, ...lenses].slice(0, 4);
    } else {
        relatedProducts = product.relatedContactLenses ?? [];
    }

    /* =======================
       RENDER
    ======================= */

    return (
        <div className="w-full bg-white font-sans text-black">
            <Navbar />
            {/* phần JSX giữ nguyên UI của bạn */}
            <Footer />
        </div>
    );
}

/* =======================
   RELATED COMPONENTS
======================= */

interface RelatedSectionProps {
    title: string;
    products: Product[];
    category?: string;
}

function RelatedSection({ title, products }: RelatedSectionProps) {
    return (
        <section className="max-w-[1400px] mx-auto px-4 py-10">
            <h2 className="text-3xl font-bold mb-6">{title}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {products.map((item) => (
                    <ProductCard key={item.id} item={item} />
                ))}
            </div>
        </section>
    );
}

function ProductCard({ item }: { item: Product }) {
    return (
        <Link
            to={`/product/${item.id}`}
            className="border rounded overflow-hidden hover:shadow-lg transition"
        >
            <ImageWithFallback
                src={item.Image_URL ?? item.imageUrls?.[0]}
                alt={item.name}
                className="w-full h-48 object-contain"
            />
            <div className="p-4 text-center">
                <p className="font-bold">{item.name}</p>
                <p className="text-red-600 font-bold">
                    {item.price.toLocaleString()}đ
                </p>
            </div>
        </Link>
    );
}
