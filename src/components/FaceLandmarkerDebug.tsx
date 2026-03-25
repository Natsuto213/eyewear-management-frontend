import { useEffect, useRef, useState } from "react";
// import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

type VisionModule = {
  FaceLandmarker: {
    createFromOptions: (
      vision: unknown,
      options: Record<string, unknown>
    ) => Promise<FaceLandmarkerInstance>;
  };
  FilesetResolver: {
    forVisionTasks: (wasmRoot: string) => Promise<unknown>;
  };
};

type FaceLandmarkerInstance = {
  detectForVideo: (video: HTMLVideoElement, timestampMs: number) => {
    faceLandmarks?: Array<Array<{ x: number; y: number; z: number }>>;
  };
  close: () => void;
};

const MEDIAPIPE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.33/wasm";
const MEDIAPIPE_ESM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.33/vision_bundle.mjs";
const LOCAL_MODEL_URL = "/mediapipe/face_landmarker.task";

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

async function loadVisionModule(): Promise<VisionModule> {
  return import(/* @vite-ignore */ MEDIAPIPE_ESM_URL) as Promise<VisionModule>;
}

async function waitForVideoReady(video: HTMLVideoElement) {
  if (video.readyState >= 2) return;

  await new Promise<void>((resolve) => {
    const onReady = () => {
      if (video.readyState >= 2) {
        video.removeEventListener("loadedmetadata", onReady);
        video.removeEventListener("canplay", onReady);
        resolve();
      }
    };

    video.addEventListener("loadedmetadata", onReady);
    video.addEventListener("canplay", onReady);
  });
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => track.stop());
}

async function startCamera(video: HTMLVideoElement) {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Trình duyệt hiện tại không hỗ trợ truy cập camera.");
  }

  const constraintCandidates: MediaStreamConstraints[] = [
    {
      video: {
        facingMode: { ideal: "user" },
        width: { ideal: 1280 },
        height: { ideal: 720 },
      },
      audio: false,
    },
    {
      video: {
        facingMode: { ideal: "user" },
      },
      audio: false,
    },
    {
      video: true,
      audio: false,
    },
  ];

  let lastError: unknown;

  for (const constraints of constraintCandidates) {
    let stream: MediaStream | null = null;

    try {
      video.pause();
      stopStream(video.srcObject as MediaStream | null);
      video.srcObject = null;

      stream = await navigator.mediaDevices.getUserMedia(constraints);
      video.srcObject = stream;
      video.muted = true;
      video.playsInline = true;

      await waitForVideoReady(video);

      const playPromise = video.play();
      if (playPromise) {
        await playPromise;
      }

      return stream;
    } catch (error) {
      stopStream(stream);
      video.srcObject = null;
      lastError = error;

      if (error instanceof DOMException && error.name === "NotReadableError") {
        await wait(500);
      }
    }
  }

  throw lastError;
}

function getErrorMessage(error: unknown) {
  if (!(error instanceof DOMException) && !(error instanceof Error)) {
    return "Không thể khởi tạo camera hoặc face tracking.";
  }

  const name = "name" in error ? error.name : "";
  if (name === "NotReadableError") {
    return "Camera đang bị thiết bị hoặc ứng dụng khác chiếm dụng. Hãy đóng mọi app/tab dùng webcam rồi thử lại.";
  }

  if (name === "NotAllowedError") {
    return "Trình duyệt đang chặn quyền camera. Hãy cho phép truy cập camera rồi tải lại trang.";
  }

  if (name === "NotFoundError") {
    return "Không tìm thấy camera khả dụng trên thiết bị này.";
  }

  return error.message || "Không thể khởi tạo camera hoặc face tracking.";
}

export default function FaceLandmarkerDebug() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationRef = useRef<number | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarkerInstance | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Đang khởi tạo...");
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    let mounted = true;
    let lastVideoTime = -1;

    const setup = async () => {
      try {
        setLoading(true);
        setError("");
        setStatus("Đang kiểm tra webcam...");

        const video = videoRef.current;
        const canvas = canvasRef.current;

        if (!video || !canvas) {
          throw new Error("Không tìm thấy vùng video/canvas để khởi tạo debug.");
        }

        stopStream(streamRef.current);
        streamRef.current = null;
        video.srcObject = null;

        streamRef.current = await startCamera(video);
        if (!mounted) return;

        setStatus("Đang tải MediaPipe...");
        const vision = await loadVisionModule();
        if (!mounted) return;

        setStatus("Đang khởi tạo Face Landmarker...");
        const fileset = await vision.FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
        if (!mounted) return;

        faceLandmarkerRef.current = await vision.FaceLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: LOCAL_MODEL_URL,
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: true,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        setLoading(false);
        setStatus("Camera và landmark đã sẵn sàng.");

        const renderLoop = () => {
          if (!mounted || !videoRef.current || !canvasRef.current || !faceLandmarkerRef.current) {
            return;
          }

          const currentVideo = videoRef.current;
          const currentCanvas = canvasRef.current;
          const context = currentCanvas.getContext("2d");

          if (!context) return;

          const width = currentVideo.clientWidth || currentVideo.videoWidth || 640;
          const height = currentVideo.clientHeight || currentVideo.videoHeight || 360;

          if (currentCanvas.width !== width || currentCanvas.height !== height) {
            currentCanvas.width = width;
            currentCanvas.height = height;
          }

          context.clearRect(0, 0, currentCanvas.width, currentCanvas.height);

          if (currentVideo.readyState >= 2 && currentVideo.currentTime !== lastVideoTime) {
            lastVideoTime = currentVideo.currentTime;

            const results = faceLandmarkerRef.current.detectForVideo(
              currentVideo,
              performance.now()
            );

            const landmarks = results.faceLandmarks?.[0];
            if (landmarks?.length) {
              context.fillStyle = "#00ff88";

              landmarks.forEach((landmark) => {
                const x = landmark.x * currentCanvas.width;
                const y = landmark.y * currentCanvas.height;
                context.beginPath();
                context.arc(x, y, 1.5, 0, Math.PI * 2);
                context.fill();
              });
            }
          }

          animationRef.current = requestAnimationFrame(renderLoop);
        };

        animationRef.current = requestAnimationFrame(renderLoop);
      } catch (setupError) {
        console.error("Lỗi khởi tạo FaceLandmarkerDebug:", setupError);
        if (!mounted) return;
        setLoading(false);
        setError(getErrorMessage(setupError));
        setStatus("Khởi tạo thất bại.");
      }
    };

    setup();

    return () => {
      mounted = false;

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }

      faceLandmarkerRef.current?.close();
      faceLandmarkerRef.current = null;

      stopStream(streamRef.current);
      streamRef.current = null;

      if (videoRef.current) {
        videoRef.current.pause();
        videoRef.current.srcObject = null;
      }
    };
  }, [reloadKey]);

  return (
    <div className="w-full rounded-xl border border-slate-200 bg-white p-3 shadow-sm">
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <span className="rounded-full bg-slate-100 px-2 py-1 text-slate-600">
            {status}
          </span>
          {error && (
            <span className="rounded-full bg-red-100 px-2 py-1 text-red-700">
              {error}
            </span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setReloadKey((current) => current + 1)}
          className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-50"
        >
          Thử lại camera
        </button>
      </div>

      <div className="relative h-[420px] w-full overflow-hidden rounded-lg bg-black">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
          autoPlay
          muted
          playsInline
        />
        <canvas
          ref={canvasRef}
          className="pointer-events-none absolute inset-0 h-full w-full scale-x-[-1]"
        />

        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 px-4 text-center text-sm text-white">
            {status}
          </div>
        )}
      </div>
    </div>
  );
}