import { useEffect } from "react";
import VirtualTryOnDebug from "@/components/VirtualTryOnDebug";

type VirtualTryOnConfig = {
  enabled?: boolean;
  modelUrl: string;
  modelFormat?: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  offsetZ?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
  anchorMode?: string;
  scaleMode?: string;
  fitRatio?: number;
  offsetIpdX?: number;
  offsetIpdY?: number;
  offsetIpdZ?: number;
  yawBias?: number;
  pitchBias?: number;
  rollBias?: number;
  depthRatio?: number;
};

type Props = {
  open: boolean;
  onClose: () => void;
  productName?: string;
  tryOnConfig?: VirtualTryOnConfig | null;
  frameMetrics?: {
    lensWidth: number | null;
    bridgeWidth: number | null;
    templeLength: number | null;
  } | null;
};

export default function VirtualTryOnModal({
  open,
  onClose,
  productName,
  tryOnConfig,
  frameMetrics,
}: Props) {
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

  if (!open || !tryOnConfig?.enabled) return null;

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
          {/* Header */}
          <div className="flex items-center justify-between border-b border-slate-200 px-4 py-4 md:px-6">
            <div>
              <h2 className="text-lg font-bold text-slate-900 md:text-xl">
                Thử kính ảo
              </h2>
              {productName && (
                <p className="mt-1 text-sm text-slate-500">
                  {productName}
                </p>
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

          {/* Body */}
          <div className="flex-1 overflow-y-auto px-4 py-4 md:px-6 md:py-6">
            <div className="mb-4 rounded-lg border border-blue-100 bg-blue-50 px-4 py-3 text-sm text-blue-800">
              Camera chỉ được dùng cục bộ trong trình duyệt để thử kính, không gửi video lên server.
            </div>

            <VirtualTryOnDebug
              modelUrl={tryOnConfig.modelUrl}
              scale={tryOnConfig.scale}
              offsetX={tryOnConfig.offsetX}
              offsetY={tryOnConfig.offsetY}
              offsetZ={tryOnConfig.offsetZ}
              rotationX={tryOnConfig.rotationX}
              rotationY={tryOnConfig.rotationY}
              rotationZ={tryOnConfig.rotationZ}
              anchorMode={tryOnConfig.anchorMode}
              scaleMode={tryOnConfig.scaleMode}
              fitRatio={tryOnConfig.fitRatio}
              offsetIpdX={tryOnConfig.offsetIpdX}
              offsetIpdY={tryOnConfig.offsetIpdY}
              offsetIpdZ={tryOnConfig.offsetIpdZ}
              yawBias={tryOnConfig.yawBias}
              pitchBias={tryOnConfig.pitchBias}
              rollBias={tryOnConfig.rollBias}
              depthRatio={tryOnConfig.depthRatio}
              frameLensWidth={frameMetrics?.lensWidth ?? undefined}
              frameBridgeWidth={frameMetrics?.bridgeWidth ?? undefined}
              frameTempleLength={frameMetrics?.templeLength ?? undefined}
              showLandmarks={false}
              showControls={false}
              viewerHeight={560}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
