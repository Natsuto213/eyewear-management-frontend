import { useEffect } from "react";
import ModelViewer3D from "@/components/ModelViewer3D";

type Props = {
    open: boolean;
    onClose: () => void;
    productName?: string;
    modelUrl?: string | null;
};

export default function Model3DModal({ open, onClose, productName, modelUrl }: Props) {
    useEffect(() => {
        if (!open) return;

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key === "Escape") {
                onClose();
            }
        };

        window.addEventListener("keydown", handleKeyDown);

        return () => {
            document.body.style.overflow = previousOverflow;
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, [open, onClose]);

    if (!open) return null;

    const handleBackdropClick = (
        event: React.MouseEvent<HTMLDivElement, MouseEvent>
    ) => {
        if (event.target === event.currentTarget) {
            onClose();
        }
    };

    return (
        <div
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm px-4 py-6 md:px-6"
            onClick={handleBackdropClick}
        >
            <div className="mx-auto flex h-full w-full max-w-6xl items-center justify-center">
                <div className="flex max-h-full w-full flex-col overflow-hidden rounded-2xl bg-white shadow-2xl">
                    <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 md:px-6">
                        <div>
                            <h2 className="text-lg font-bold text-slate-900 md:text-xl">Xem ảnh 3D</h2>
                            {productName && (
                                <p className="mt-1 text-sm text-slate-500">{productName}</p>
                            )}
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="inline-flex h-10 min-w-10 items-center justify-center rounded-lg border border-slate-300 bg-white px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50"
                        >
                            Đóng
                        </button>
                    </div>

                    <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
                        <ModelViewer3D modelUrl={(modelUrl ?? "").trim()} height={560} />
                    </div>
                </div>
            </div>
        </div>
    );
}

