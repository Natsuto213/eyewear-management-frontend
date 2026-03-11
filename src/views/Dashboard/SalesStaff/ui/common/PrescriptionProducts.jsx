import React from 'react'
import { Package } from 'lucide-react'

const PrescriptionProducts = ({ prescriptionProducts, openPrescriptionRows, togglePrescriptionRow, formatCurrency }) => {
    return (
        <div className="bg-white rounded-xl shadow border border-gray-100 overflow-hidden">
            <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                    <Package className="w-5 h-5 text-gray-400" />
                    Danh sách đơn kính
                </h3>
            </div>

            <div className="p-4">
                <table className="w-full table-fixed">
                    <thead>
                        <tr className="border-b border-gray-200 text-left text-xs text-gray-500">
                            <th className="py-2 pr-2 w-20">Hình ảnh</th>
                            <th className="py-2 px-2">Sản phẩm</th>
                            <th className="py-2 px-2 w-28 text-right">Đơn giá</th>
                            <th className="py-2 px-2 w-20 text-center">SL</th>
                            <th className="py-2 pl-2 w-28 text-right">Thành tiền</th>
                        </tr>
                    </thead>

                    <tbody>
                        {prescriptionProducts.map((item, index) => {
                            const rowKey = `${item.frameId || "frame"}-${index}`;
                            const isOpen = !!openPrescriptionRows[rowKey];

                            const hasLens = item.lensId != null;
                            const hasContactLens = item.contactLensId != null;
                            const hasPaired = hasLens || hasContactLens;

                            const hasFrameImage = !!item.frameImg;
                            const hasLensImage = !!item.lensImg;
                            const hasContactLensImage = !!item.contactLensImg;

                            const availableImages = [
                                hasFrameImage
                                    ? {
                                        src: item.frameImg,
                                        alt: item.frameName || "Frame",
                                        type: "frame",
                                    }
                                    : null,
                                hasLensImage
                                    ? {
                                        src: item.lensImg,
                                        alt: item.lensName || "Lens",
                                        type: "lens",
                                    }
                                    : null,
                                hasContactLensImage
                                    ? {
                                        src: item.contactLensImg,
                                        alt: item.contactLensName || "Contact Lens",
                                        type: "contactLens",
                                    }
                                    : null,
                            ].filter(Boolean);

                            const imageCount = availableImages.length;

                            const mainImageObj =
                                imageCount === 1
                                    ? availableImages[0]
                                    : availableImages.find((img) => img.type === "frame") ||
                                    availableImages[0] || {
                                        src: "",
                                        alt: "Sản phẩm",
                                        type: "default",
                                    };

                            const subImages =
                                imageCount > 1
                                    ? availableImages.filter(
                                        (img) => img.src !== mainImageObj.src
                                    )
                                    : [];

                            const mainName =
                                item.frameName ||
                                item.lensName ||
                                item.contactLensName ||
                                "Sản phẩm đơn kính";

                            const mainPrice = item.framePrice ?? 0;

                            const pairedNames = [
                                item.lensName,
                                item.contactLensName,
                            ].filter(Boolean);

                            const pairedNameText = pairedNames.join(" + ");

                            const pairedPrice =
                                (item.lensPrice ?? 0) + (item.contactLensPrice ?? 0);

                            const lineTotal = item.totalPrice ?? 0;

                            const showPrescription =
                                item.leftEyeSph !== undefined ||
                                item.leftEyeCyl !== undefined ||
                                item.leftEyeAxis !== undefined ||
                                item.leftPD !== undefined ||
                                item.rightEyeSph !== undefined ||
                                item.rightEyeCyl !== undefined ||
                                item.rightEyeAxis !== undefined ||
                                item.rightPD !== undefined;

                            const prescriptionRows = [
                                {
                                    label: "SPH",
                                    l: item.leftEyeSph,
                                    r: item.rightEyeSph,
                                },
                                {
                                    label: "CYL",
                                    l: item.leftEyeCyl,
                                    r: item.rightEyeCyl,
                                },
                                {
                                    label: "AXIS",
                                    l: item.leftEyeAxis,
                                    r: item.rightEyeAxis,
                                },
                                {
                                    label: "PD",
                                    l: item.leftPD,
                                    r: item.rightPD,
                                },
                            ];

                            return (
                                <tr
                                    key={rowKey}
                                    className="border-b border-gray-100 align-top"
                                >
                                    <td className="py-3 pr-2">
                                        <div className="flex flex-col items-center gap-1">
                                            {mainImageObj.src ? (
                                                <img
                                                    src={mainImageObj.src}
                                                    alt={mainImageObj.alt}
                                                    className="w-14 h-14 object-cover rounded-lg bg-gray-100 shadow-sm"
                                                />
                                            ) : (
                                                <div className="w-14 h-14 rounded-lg bg-gray-100 shadow-sm flex items-center justify-center text-[10px] text-gray-400">
                                                    No image
                                                </div>
                                            )}

                                            {subImages.map((img, subIndex) => {
                                                const badgeText =
                                                    img.type === "lens"
                                                        ? "Kèm"
                                                        : img.type === "contactLens"
                                                            ? "Lens"
                                                            : "Kèm";

                                                const borderColor =
                                                    img.type === "contactLens"
                                                        ? "border-purple-200"
                                                        : "border-teal-200";

                                                const badgeColor =
                                                    img.type === "contactLens"
                                                        ? "bg-purple-500"
                                                        : "bg-teal-500";

                                                return (
                                                    <div
                                                        key={`${rowKey}-sub-${subIndex}`}
                                                        className="relative"
                                                    >
                                                        <img
                                                            src={img.src}
                                                            alt={img.alt}
                                                            className={`w-10 h-10 object-cover rounded-md bg-gray-100 border ${borderColor}`}
                                                        />
                                                        <span
                                                            className={`absolute -top-1 -right-1 ${badgeColor} text-white text-[8px] font-bold px-1 rounded-full`}
                                                        >
                                                            {badgeText}
                                                        </span>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </td>

                                    <td className="py-3 px-2">
                                        <p className="font-semibold text-gray-800 text-sm leading-snug break-words">
                                            {mainName}
                                        </p>

                                        {hasPaired && pairedNameText && (
                                            <p className="text-[11px] text-teal-600 mt-0.5 leading-snug break-words">
                                                <span className="text-gray-400">Kèm: </span>
                                                {pairedNameText}
                                            </p>
                                        )}

                                        {showPrescription && (
                                            <div className="mt-1.5">
                                                <button
                                                    type="button"
                                                    onClick={() => togglePrescriptionRow(rowKey)}
                                                    className="inline-flex items-center gap-1 text-[11px] font-medium text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 rounded-full px-2 py-0.5 transition-colors"
                                                >
                                                    📋 Đơn thuốc {isOpen ? "▲" : "▼"}
                                                </button>

                                                {isOpen && (
                                                    <div className="mt-1.5 p-2 bg-amber-50 border border-amber-100 rounded-lg text-[11px] text-gray-700">
                                                        <table className="w-full">
                                                            <thead>
                                                                <tr className="text-amber-700 font-semibold text-center">
                                                                    <th className="text-left pb-1 pr-2">
                                                                        TS
                                                                    </th>
                                                                    <th className="pb-1 pr-1">
                                                                        Trái
                                                                    </th>
                                                                    <th className="pb-1">
                                                                        Phải
                                                                    </th>
                                                                </tr>
                                                            </thead>
                                                            <tbody>
                                                                {prescriptionRows.map(({ label, l, r }) => (
                                                                    <tr
                                                                        key={label}
                                                                        className="border-t border-amber-100"
                                                                    >
                                                                        <td className="py-0.5 pr-2 text-gray-500">
                                                                            {label}
                                                                        </td>
                                                                        <td className="py-0.5 pr-1 text-center font-medium">
                                                                            {l ?? "—"}
                                                                        </td>
                                                                        <td className="py-0.5 text-center font-medium">
                                                                            {r ?? "—"}
                                                                        </td>
                                                                    </tr>
                                                                ))}
                                                            </tbody>
                                                        </table>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                    </td>

                                    <td className="py-3 px-2 align-middle text-right whitespace-nowrap">
                                        <p className="text-sm text-gray-700 font-medium">
                                            {formatCurrency(mainPrice)}
                                        </p>

                                        {hasPaired && pairedPrice > 0 && (
                                            <p className="text-[11px] text-teal-600 mt-0.5">
                                                + {formatCurrency(pairedPrice)}
                                            </p>
                                        )}
                                    </td>

                                    <td className="py-3 px-2 align-middle text-center whitespace-nowrap">
                                        <span className="inline-flex items-center justify-center min-w-8 px-2 py-0.5 rounded-lg bg-gray-100 text-gray-800 text-xs font-semibold border border-gray-200">
                                            {item.quantity}
                                        </span>
                                    </td>

                                    <td className="py-3 pl-2 align-middle text-right whitespace-nowrap">
                                        <span className="font-bold text-red-500 text-sm">
                                            {formatCurrency(lineTotal)}
                                        </span>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default PrescriptionProducts
