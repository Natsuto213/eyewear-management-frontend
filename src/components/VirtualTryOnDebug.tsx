import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { FaceLandmarker, FilesetResolver } from "@mediapipe/tasks-vision";

type Props = {
  modelUrl: string;
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
  frameLensWidth?: number;
  frameBridgeWidth?: number;
  frameTempleLength?: number;
  showControls?: boolean;
  showLandmarks?: boolean;
  viewerHeight?: number;
};

type TryOnConfigValue = {
  scale: number;
  offsetX: number;
  offsetY: number;
  offsetZ: number;
  rotationX: number;
  rotationY: number;
  rotationZ: number;
  anchorMode: "NOSE_BRIDGE" | "EYE_CENTER";
  scaleMode: "FACE_WIDTH" | "IPD";
  fitRatio: number;
  offsetIpdX: number;
  offsetIpdY: number;
  offsetIpdZ: number;
  yawBias: number;
  pitchBias: number;
  rollBias: number;
  depthRatio: number;
};

type NumericConfigKey = {
  [K in keyof TryOnConfigValue]: TryOnConfigValue[K] extends number ? K : never;
}[keyof TryOnConfigValue];

type LandmarkPoint = {
  x: number;
  y: number;
  z: number;
};

type FaceLandmarkerLike = {
  detectForVideo: (
    video: HTMLVideoElement,
    timestampMs: number
  ) => {
    faceLandmarks?: LandmarkPoint[][];
  };
  close: () => void;
};

const MEDIAPIPE_WASM_URL =
  "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.33/wasm";
const LOCAL_MODEL_URL = "/mediapipe/face_landmarker.task";

const DEFAULT_CONFIG: TryOnConfigValue = {
  scale: 1,
  offsetX: 0,
  offsetY: 0,
  offsetZ: 0,
  rotationX: 0,
  rotationY: 0,
  rotationZ: 0,
  anchorMode: "NOSE_BRIDGE",
  scaleMode: "FACE_WIDTH",
  fitRatio: -0.5,
  offsetIpdX: 0,
  offsetIpdY: 0,
  offsetIpdZ: 0,
  yawBias: 0,
  pitchBias: 0,
  rollBias: 0,
  depthRatio: 0,
};

const MODEL_WIDTH_COMPENSATION = 0.82;

/* =========================
   SHARED CAMERA STATE
   Giúp reuse webcam trong cùng tab,
   tránh stop -> getUserMedia lại quá nhanh
   ========================= */
const SHARED_CAMERA_RELEASE_DELAY_MS = 5000;
const CAMERA_RETRY_DELAYS_MS = [0, 500, 1200, 2200];
const CAMERA_COOLDOWN_AFTER_STOP_MS = 1200;

let sharedCameraStream: MediaStream | null = null;
let sharedCameraConsumerCount = 0;
let sharedCameraStopTimer: number | null = null;
let sharedCameraStartPromise: Promise<MediaStream> | null = null;
let sharedCameraLastStopAt = 0;

function wait(ms: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}

function markSharedCameraStopped() {
  sharedCameraLastStopAt = performance.now();
}

function stopStream(stream: MediaStream | null) {
  stream?.getTracks().forEach((track) => {
    try {
      track.stop();
    } catch {}
  });
}

function hasLiveVideoTrack(stream: MediaStream | null) {
  if (!stream) return false;
  return stream.getVideoTracks().some((track) => track.readyState === "live");
}

function cancelScheduledSharedCameraStop() {
  if (sharedCameraStopTimer !== null) {
    window.clearTimeout(sharedCameraStopTimer);
    sharedCameraStopTimer = null;
  }
}

function retainSharedCameraStream() {
  cancelScheduledSharedCameraStop();
  sharedCameraConsumerCount += 1;
}

function releaseSharedCameraStream(
  delayMs = SHARED_CAMERA_RELEASE_DELAY_MS
) {
  sharedCameraConsumerCount = Math.max(0, sharedCameraConsumerCount - 1);
  cancelScheduledSharedCameraStop();

  sharedCameraStopTimer = window.setTimeout(() => {
    if (sharedCameraConsumerCount === 0 && sharedCameraStream) {
      stopStream(sharedCameraStream);
      sharedCameraStream = null;
      markSharedCameraStopped();
    }
    sharedCameraStopTimer = null;
  }, delayMs);
}

function dropSharedCameraStream() {
  if (sharedCameraConsumerCount > 0) return;

  if (sharedCameraStream) {
    stopStream(sharedCameraStream);
    sharedCameraStream = null;
    markSharedCameraStopped();
  }
}

function dropSharedCameraStreamIfUnused() {
  if (sharedCameraConsumerCount > 0) return;
  if (sharedCameraStream) {
    stopStream(sharedCameraStream);
    sharedCameraStream = null;
    markSharedCameraStopped();
  }
}

async function waitForCameraCooldown() {
  const elapsed = performance.now() - sharedCameraLastStopAt;
  if (elapsed < CAMERA_COOLDOWN_AFTER_STOP_MS) {
    await wait(CAMERA_COOLDOWN_AFTER_STOP_MS - elapsed);
  }
}

function isCameraBusyError(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === "NotReadableError" || error.name === "AbortError")
  );
}

function detachVideoElement(video: HTMLVideoElement | null) {
  if (!video) return;

  try {
    video.pause();
  } catch {}

  video.srcObject = null;
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

async function createCameraStream() {
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
      stream = await navigator.mediaDevices.getUserMedia(constraints);
      return stream;
    } catch (error) {
      stopStream(stream);
      lastError = error;

      if (isCameraBusyError(error)) {
        await wait(400);
      }
    }
  }

  throw lastError;
}

async function getOrCreateSharedCameraStream() {
  cancelScheduledSharedCameraStop();

  if (hasLiveVideoTrack(sharedCameraStream)) {
    return sharedCameraStream as MediaStream;
  }

  if (sharedCameraStartPromise) {
    return sharedCameraStartPromise;
  }

  dropSharedCameraStreamIfUnused();
  await waitForCameraCooldown();

  sharedCameraStartPromise = (async () => {
    const stream = await createCameraStream();
    sharedCameraStream = stream;
    return stream;
  })();

  try {
    return await sharedCameraStartPromise;
  } finally {
    sharedCameraStartPromise = null;
  }
}

async function startCamera(video: HTMLVideoElement) {
  let lastError: unknown = null;

  for (const delayMs of CAMERA_RETRY_DELAYS_MS) {
    if (delayMs > 0) {
      await wait(delayMs);
    }

    try {
      const stream = await getOrCreateSharedCameraStream();

      detachVideoElement(video);

      video.srcObject = stream;
      video.muted = true;
      video.defaultMuted = true;
      video.playsInline = true;
      video.autoplay = true;
      video.setAttribute("playsinline", "true");
      video.setAttribute("muted", "true");
      video.setAttribute("autoplay", "true");

      await waitForVideoReady(video);

      const playPromise = video.play();
      if (playPromise) {
        await playPromise;
      }

      retainSharedCameraStream();
      return stream;
    } catch (error) {
      lastError = error;
      detachVideoElement(video);

      if (isCameraBusyError(error)) {
        if (
          !hasLiveVideoTrack(sharedCameraStream) &&
          sharedCameraConsumerCount === 0
        ) {
          dropSharedCameraStream();
        }
        continue;
      }

      throw error;
    }
  }

  throw lastError;
}

function getErrorMessage(error: unknown) {
  if (!(error instanceof DOMException) && !(error instanceof Error)) {
    return "Không thể khởi tạo camera hoặc virtual try-on.";
  }

  const name = "name" in error ? error.name : "";

  if (name === "NotReadableError" || name === "AbortError") {
    return "Camera đang bận hoặc chưa kịp được nhả. Hãy đóng ứng dụng khác đang dùng camera rồi thử lại.";
  }

  if (name === "NotAllowedError") {
    return "Trình duyệt đang chặn quyền camera. Hãy cho phép truy cập camera rồi tải lại trang.";
  }

  if (name === "NotFoundError") {
    return "Không tìm thấy camera khả dụng trên thiết bị này.";
  }

  return error.message || "Không thể khởi tạo camera hoặc virtual try-on.";
}

function averagePoint(points: LandmarkPoint[]): LandmarkPoint {
  const validPoints = points.filter(Boolean);
  const total = validPoints.reduce(
    (acc, point) => ({
      x: acc.x + point.x,
      y: acc.y + point.y,
      z: acc.z + point.z,
    }),
    { x: 0, y: 0, z: 0 }
  );

  const count = validPoints.length || 1;

  return {
    x: total.x / count,
    y: total.y / count,
    z: total.z / count,
  };
}

function landmarkToVector(point: LandmarkPoint) {
  return new THREE.Vector3(point.x, -point.y, -point.z * 0.6);
}

function screenToWorld(
  normalizedX: number,
  normalizedY: number,
  camera: THREE.PerspectiveCamera,
  planeZ = 0
) {
  const distance = Math.max(camera.position.z - planeZ, 0.001);
  const fovRad = THREE.MathUtils.degToRad(camera.fov);
  const viewHeight = 2 * Math.tan(fovRad / 2) * distance;
  const viewWidth = viewHeight * camera.aspect;

  return new THREE.Vector3(
    (normalizedX - 0.5) * viewWidth,
    -(normalizedY - 0.5) * viewHeight,
    planeZ
  );
}

function normalizedWidthToWorld(
  normalizedWidth: number,
  camera: THREE.PerspectiveCamera,
  planeZ = 0
) {
  const distance = Math.max(camera.position.z - planeZ, 0.001);
  const fovRad = THREE.MathUtils.degToRad(camera.fov);
  const viewHeight = 2 * Math.tan(fovRad / 2) * distance;
  const viewWidth = viewHeight * camera.aspect;
  return normalizedWidth * viewWidth;
}

function getSafePoint(landmarks: LandmarkPoint[], index: number) {
  return landmarks[index] || null;
}

function toAnchorMode(value: string | undefined) {
  return value === "EYE_CENTER" ? "EYE_CENTER" : "NOSE_BRIDGE";
}

function toScaleMode(value: string | undefined) {
  return value === "IPD" ? "IPD" : "FACE_WIDTH";
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function computeFrameFitMultiplier(
  frameLensWidth?: number,
  frameBridgeWidth?: number
) {
  if (!Number.isFinite(frameLensWidth) || !Number.isFinite(frameBridgeWidth)) {
    return 1;
  }
  const frontWidthMm = frameLensWidth * 2 + frameBridgeWidth;
  const baselineFrontWidthMm = 80;
  return clamp(frontWidthMm / baselineFrontWidthMm, 0.7, 1.05);
}

function computeFrameDepthOffset(frameTempleLength?: number) {
  if (!Number.isFinite(frameTempleLength)) {
    return 0;
  }
  return clamp((frameTempleLength - 140) / 200, -0.08, 0.08);
}

function buildFacePose(landmarks: LandmarkPoint[]) {
  const leftTemple = getSafePoint(landmarks, 234) || getSafePoint(landmarks, 33);
  const rightTemple =
    getSafePoint(landmarks, 454) || getSafePoint(landmarks, 263);

  const leftEyeOuter = getSafePoint(landmarks, 33);
  const leftEyeInner = getSafePoint(landmarks, 133);
  const rightEyeInner = getSafePoint(landmarks, 362);
  const rightEyeOuter = getSafePoint(landmarks, 263);

  const chin = getSafePoint(landmarks, 152);
  const noseBridge =
    getSafePoint(landmarks, 168) ||
    getSafePoint(landmarks, 6) ||
    getSafePoint(landmarks, 1);

  if (
    !leftTemple ||
    !rightTemple ||
    !leftEyeOuter ||
    !leftEyeInner ||
    !rightEyeInner ||
    !rightEyeOuter ||
    !chin ||
    !noseBridge
  ) {
    return null;
  }

  const leftEye = averagePoint([leftEyeOuter, leftEyeInner]);
  const rightEye = averagePoint([rightEyeOuter, rightEyeInner]);
  const eyeCenter = averagePoint([leftEye, rightEye]);

  const xAxis = landmarkToVector(rightTemple)
    .sub(landmarkToVector(leftTemple))
    .normalize();

  const upCandidate = landmarkToVector(eyeCenter)
    .sub(landmarkToVector(chin))
    .normalize();

  let zAxis = new THREE.Vector3().crossVectors(xAxis, upCandidate).normalize();
  if (!Number.isFinite(zAxis.x) || zAxis.lengthSq() === 0) {
    zAxis = new THREE.Vector3(0, 0, 1);
  }

  if (zAxis.z < 0) {
    zAxis.negate();
  }

  let yAxis = new THREE.Vector3().crossVectors(zAxis, xAxis).normalize();
  if (!Number.isFinite(yAxis.x) || yAxis.lengthSq() === 0) {
    yAxis = new THREE.Vector3(0, 1, 0);
  }

  const rotationMatrix = new THREE.Matrix4().makeBasis(xAxis, yAxis, zAxis);
  const quaternion = new THREE.Quaternion().setFromRotationMatrix(rotationMatrix);

  const templeDistance = Math.hypot(
    rightTemple.x - leftTemple.x,
    rightTemple.y - leftTemple.y
  );

  const ipdDistance = Math.hypot(
    rightEye.x - leftEye.x,
    rightEye.y - leftEye.y
  );

  return {
    eyeCenter,
    noseBridge,
    templeDistance,
    ipdDistance,
    quaternion,
  };
}

function sanitizeModel(root: THREE.Object3D) {
  const removeTargets: THREE.Object3D[] = [];
  const namePattern =
    /(palette|swatch|helper|camera|light|rig|ground|floor|background|shadow)/i;

  root.traverse((object) => {
    const maybeAny = object as THREE.Object3D & {
      isCamera?: boolean;
      isLight?: boolean;
    };

    if (maybeAny.isCamera || maybeAny.isLight || namePattern.test(object.name || "")) {
      removeTargets.push(object);
    }
  });

  removeTargets.forEach((object) => {
    object.parent?.remove(object);
  });

  const overallBox = new THREE.Box3().setFromObject(root);
  const overallCenter = overallBox.getCenter(new THREE.Vector3());
  const overallSize = overallBox.getSize(new THREE.Vector3());
  const overallLength = Math.max(overallSize.length(), 0.0001);

  const suspiciousMeshes: THREE.Object3D[] = [];

  root.traverse((object) => {
    const mesh = object as THREE.Mesh;
    if (!mesh.isMesh) return;

    const meshBox = new THREE.Box3().setFromObject(mesh);
    const meshCenter = meshBox.getCenter(new THREE.Vector3());
    const meshSize = meshBox.getSize(new THREE.Vector3());

    const farSmallOutlier =
      meshCenter.distanceTo(overallCenter) > overallLength * 0.55 &&
      meshSize.length() < overallLength * 0.22;

    const upperPaletteLike =
      meshCenter.y > overallCenter.y + overallSize.y * 0.55 &&
      meshSize.x < overallSize.x * 0.35 &&
      meshSize.y < overallSize.y * 0.35;

    const flatHugeStrip =
      meshSize.x > overallSize.x * 1.15 &&
      meshSize.y < overallSize.y * 0.22 &&
      meshSize.z < Math.max(overallSize.z * 0.7, 0.03) &&
      Math.abs(meshCenter.y - overallCenter.y) > overallSize.y * 0.2;

    if (farSmallOutlier || upperPaletteLike || flatHugeStrip) {
      suspiciousMeshes.push(mesh);
    }
  });

  suspiciousMeshes.forEach((mesh) => {
    mesh.parent?.remove(mesh);
  });
}

export default function VirtualTryOnDebug({
  modelUrl,
  scale = DEFAULT_CONFIG.scale,
  offsetX = DEFAULT_CONFIG.offsetX,
  offsetY = DEFAULT_CONFIG.offsetY,
  offsetZ = DEFAULT_CONFIG.offsetZ,
  rotationX = DEFAULT_CONFIG.rotationX,
  rotationY = DEFAULT_CONFIG.rotationY,
  rotationZ = DEFAULT_CONFIG.rotationZ,
  anchorMode = DEFAULT_CONFIG.anchorMode,
  scaleMode = DEFAULT_CONFIG.scaleMode,
  fitRatio = DEFAULT_CONFIG.fitRatio,
  offsetIpdX = DEFAULT_CONFIG.offsetIpdX,
  offsetIpdY = DEFAULT_CONFIG.offsetIpdY,
  offsetIpdZ = DEFAULT_CONFIG.offsetIpdZ,
  yawBias = DEFAULT_CONFIG.yawBias,
  pitchBias = DEFAULT_CONFIG.pitchBias,
  rollBias = DEFAULT_CONFIG.rollBias,
  depthRatio = DEFAULT_CONFIG.depthRatio,
  frameLensWidth,
  frameBridgeWidth,
  frameTempleLength,
  showControls = true,
  showLandmarks = true,
  viewerHeight = 420,
}: Props) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const debugCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const threeContainerRef = useRef<HTMLDivElement | null>(null);

  const animationRef = useRef<number | null>(null);
  const faceLandmarkerRef = useRef<FaceLandmarkerLike | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const setupTokenRef = useRef(0);

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const faceAnchorGroupRef = useRef<THREE.Group | null>(null);
  const modelCalibrationGroupRef = useRef<THREE.Group | null>(null);
  const glassesModelRef = useRef<THREE.Object3D | null>(null);

  const smoothPositionRef = useRef(new THREE.Vector3());
  const smoothQuaternionRef = useRef(new THREE.Quaternion());
  const smoothScaleRef = useRef(1);
  const poseInitializedRef = useRef(false);
  const configRef = useRef<TryOnConfigValue>(DEFAULT_CONFIG);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState("Đang khởi tạo...");
  const [reloadKey, setReloadKey] = useState(0);

  const [config, setConfig] = useState<TryOnConfigValue>({
    scale,
    offsetX,
    offsetY,
    offsetZ,
    rotationX,
    rotationY,
    rotationZ,
    anchorMode: toAnchorMode(anchorMode),
    scaleMode: toScaleMode(scaleMode),
    fitRatio: clamp(fitRatio, 0.08, 3),
    offsetIpdX,
    offsetIpdY,
    offsetIpdZ,
    yawBias,
    pitchBias,
    rollBias,
    depthRatio,
  });

  useEffect(() => {
    setConfig({
      scale,
      offsetX,
      offsetY,
      offsetZ,
      rotationX,
      rotationY,
      rotationZ,
      anchorMode: toAnchorMode(anchorMode),
      scaleMode: toScaleMode(scaleMode),
      fitRatio: clamp(fitRatio, 0.08, 3),
      offsetIpdX,
      offsetIpdY,
      offsetIpdZ,
      yawBias,
      pitchBias,
      rollBias,
      depthRatio,
    });
  }, [
    scale,
    offsetX,
    offsetY,
    offsetZ,
    rotationX,
    rotationY,
    rotationZ,
    anchorMode,
    scaleMode,
    fitRatio,
    offsetIpdX,
    offsetIpdY,
    offsetIpdZ,
    yawBias,
    pitchBias,
    rollBias,
    depthRatio,
  ]);

  useEffect(() => {
    configRef.current = config;
    const calibrationGroup = modelCalibrationGroupRef.current;
    if (!calibrationGroup) return;
    const frameDepthOffset = computeFrameDepthOffset(frameTempleLength);

    calibrationGroup.position.set(
      config.offsetX + config.offsetIpdX,
      config.offsetY + config.offsetIpdY,
      config.offsetZ + config.offsetIpdZ + config.depthRatio + frameDepthOffset
    );
    calibrationGroup.rotation.set(
      config.rotationX + config.pitchBias,
      config.rotationY + config.yawBias,
      config.rotationZ + config.rollBias
    );
    calibrationGroup.scale.setScalar(config.scale);
  }, [config, frameTempleLength]);

  const disposeThree = () => {
    if (rendererRef.current && threeContainerRef.current) {
      const dom = rendererRef.current.domElement;
      if (threeContainerRef.current.contains(dom)) {
        threeContainerRef.current.removeChild(dom);
      }
    }

    if (sceneRef.current) {
      sceneRef.current.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) {
          mesh.geometry.dispose();
        }

        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });
    }

    rendererRef.current?.dispose();
    rendererRef.current = null;
    sceneRef.current = null;
    cameraRef.current = null;
    faceAnchorGroupRef.current = null;
    modelCalibrationGroupRef.current = null;
    glassesModelRef.current = null;
    poseInitializedRef.current = false;
  };

  const setupThree = (width: number, height: number) => {
    disposeThree();

    const container = threeContainerRef.current;
    if (!container) {
      throw new Error("Không tìm thấy vùng hiển thị 3D.");
    }

    const scene = new THREE.Scene();
    scene.background = null;

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1.2);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    const fillLight = new THREE.DirectionalLight(0xffffff, 0.8);
    fillLight.position.set(-2, 1, 4);
    scene.add(fillLight);

    const faceAnchorGroup = new THREE.Group();
    faceAnchorGroup.visible = false;

    const cfg = configRef.current;
    const frameDepthOffset = computeFrameDepthOffset(frameTempleLength);
    const modelCalibrationGroup = new THREE.Group();
    modelCalibrationGroup.position.set(
      cfg.offsetX + cfg.offsetIpdX,
      cfg.offsetY + cfg.offsetIpdY,
      cfg.offsetZ + cfg.offsetIpdZ + cfg.depthRatio + frameDepthOffset
    );
    modelCalibrationGroup.rotation.set(
      cfg.rotationX + cfg.pitchBias,
      cfg.rotationY + cfg.yawBias,
      cfg.rotationZ + cfg.rollBias
    );
    modelCalibrationGroup.scale.setScalar(cfg.scale);

    faceAnchorGroup.add(modelCalibrationGroup);
    scene.add(faceAnchorGroup);

    rendererRef.current = renderer;
    sceneRef.current = scene;
    cameraRef.current = camera;
    faceAnchorGroupRef.current = faceAnchorGroup;
    modelCalibrationGroupRef.current = modelCalibrationGroup;
  };

  const loadGlassesModel = async () => {
    const calibrationGroup = modelCalibrationGroupRef.current;
    if (!calibrationGroup || !modelUrl) {
      throw new Error("Thiếu modelUrl để tải mô hình kính.");
    }

    await new Promise<void>((resolve, reject) => {
      const loader = new GLTFLoader();

      loader.load(
        modelUrl,
        (gltf) => {
          const glassesModel = gltf.scene;
          sanitizeModel(glassesModel);

          const firstBox = new THREE.Box3().setFromObject(glassesModel);
          const firstCenter = firstBox.getCenter(new THREE.Vector3());
          const firstSize = firstBox.getSize(new THREE.Vector3());
          const safeWidth = Math.max(firstSize.x, 0.0001);

          glassesModel.position.sub(firstCenter);
          glassesModel.scale.setScalar(1 / safeWidth);

          glassesModel.traverse((object) => {
            const mesh = object as THREE.Mesh;
            if (!mesh.isMesh) return;
            mesh.castShadow = false;
            mesh.receiveShadow = false;
          });

          calibrationGroup.clear();
          calibrationGroup.add(glassesModel);
          const cfg = configRef.current;
          const frameDepthOffset = computeFrameDepthOffset(frameTempleLength);
          calibrationGroup.position.set(
            cfg.offsetX + cfg.offsetIpdX,
            cfg.offsetY + cfg.offsetIpdY,
            cfg.offsetZ + cfg.offsetIpdZ + cfg.depthRatio + frameDepthOffset
          );
          calibrationGroup.rotation.set(
            cfg.rotationX + cfg.pitchBias,
            cfg.rotationY + cfg.yawBias,
            cfg.rotationZ + cfg.rollBias
          );
          calibrationGroup.scale.setScalar(cfg.scale);

          glassesModelRef.current = glassesModel;
          resolve();
        },
        undefined,
        (loadError) => {
          reject(loadError);
        }
      );
    });
  };

  useEffect(() => {
    let mounted = true;
    let lastVideoTime = -1;
    const token = ++setupTokenRef.current;

    const handleResize = () => {
      const video = videoRef.current;
      const debugCanvas = debugCanvasRef.current;
      const renderer = rendererRef.current;
      const camera = cameraRef.current;

      if (!video || !debugCanvas || !renderer || !camera) return;

      const width = video.clientWidth || video.videoWidth || 640;
      const height = video.clientHeight || video.videoHeight || viewerHeight;

      debugCanvas.width = width;
      debugCanvas.height = height;

      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    const setup = async () => {
      try {
        setLoading(true);
        setError("");
        setStatus("Đang kiểm tra webcam...");

        const video = videoRef.current;
        const debugCanvas = debugCanvasRef.current;

        if (!video || !debugCanvas) {
          throw new Error("Không tìm thấy vùng video/canvas để khởi tạo try-on.");
        }

        if (!modelUrl) {
          throw new Error("Thiếu modelUrl để tải mô hình kính.");
        }

        if (animationRef.current) {
          cancelAnimationFrame(animationRef.current);
          animationRef.current = null;
        }

        faceLandmarkerRef.current?.close();
        faceLandmarkerRef.current = null;

        if (streamRef.current) {
          releaseSharedCameraStream();
          streamRef.current = null;
        }

        detachVideoElement(video);
        await wait(80);

        if (!mounted || token !== setupTokenRef.current) return;

        streamRef.current = await startCamera(video);
        if (!mounted || token !== setupTokenRef.current) {
          if (streamRef.current) {
            releaseSharedCameraStream();
            streamRef.current = null;
          }
          detachVideoElement(video);
          return;
        }

        const width = video.clientWidth || video.videoWidth || 640;
        const height = video.clientHeight || video.videoHeight || viewerHeight;

        debugCanvas.width = width;
        debugCanvas.height = height;

        setupThree(width, height);

        setStatus("Đang tải model kính...");
        await loadGlassesModel();
        if (!mounted || token !== setupTokenRef.current) return;

        setStatus("Đang tải MediaPipe...");
        const fileset = await FilesetResolver.forVisionTasks(MEDIAPIPE_WASM_URL);
        if (!mounted || token !== setupTokenRef.current) return;

        setStatus("Đang khởi tạo Face Landmarker...");
        faceLandmarkerRef.current = (await FaceLandmarker.createFromOptions(fileset, {
          baseOptions: {
            modelAssetPath: LOCAL_MODEL_URL,
          },
          runningMode: "VIDEO",
          numFaces: 1,
          outputFaceBlendshapes: false,
          outputFacialTransformationMatrixes: false,
          minFaceDetectionConfidence: 0.5,
          minFacePresenceConfidence: 0.5,
          minTrackingConfidence: 0.5,
        })) as unknown as FaceLandmarkerLike;

        if (!mounted || token !== setupTokenRef.current) return;

        poseInitializedRef.current = false;
        setLoading(false);
        setStatus("Virtual try-on debug đang chạy.");

        const renderLoop = () => {
          if (!mounted || token !== setupTokenRef.current) return;

          const currentVideo = videoRef.current;
          const currentCanvas = debugCanvasRef.current;
          const currentRenderer = rendererRef.current;
          const currentScene = sceneRef.current;
          const currentCamera = cameraRef.current;
          const currentFaceLandmarker = faceLandmarkerRef.current;
          const faceAnchorGroup = faceAnchorGroupRef.current;

          if (
            !currentVideo ||
            !currentCanvas ||
            !currentRenderer ||
            !currentScene ||
            !currentCamera ||
            !currentFaceLandmarker ||
            !faceAnchorGroup
          ) {
            return;
          }

          const ctx = currentCanvas.getContext("2d");
          if (!ctx) return;

          const width = currentVideo.clientWidth || currentVideo.videoWidth || 640;
          const height =
            currentVideo.clientHeight || currentVideo.videoHeight || viewerHeight;

          if (currentCanvas.width !== width || currentCanvas.height !== height) {
            currentCanvas.width = width;
            currentCanvas.height = height;
            currentCamera.aspect = width / height;
            currentCamera.updateProjectionMatrix();
            currentRenderer.setSize(width, height);
          }

          ctx.clearRect(0, 0, currentCanvas.width, currentCanvas.height);

          if (currentVideo.readyState >= 2 && currentVideo.currentTime !== lastVideoTime) {
            lastVideoTime = currentVideo.currentTime;

            const results = currentFaceLandmarker.detectForVideo(
              currentVideo,
              performance.now()
            );

            const landmarks = results.faceLandmarks?.[0];

            if (landmarks?.length) {
              if (showLandmarks) {
                ctx.fillStyle = "#00ff88";

                landmarks.forEach((landmark) => {
                  const x = landmark.x * currentCanvas.width;
                  const y = landmark.y * currentCanvas.height;
                  ctx.beginPath();
                  ctx.arc(x, y, 1.5, 0, Math.PI * 2);
                  ctx.fill();
                });
              }

              const pose = buildFacePose(landmarks);

              if (pose) {
                const cfg = configRef.current;
                const anchorPoint =
                  cfg.anchorMode === "EYE_CENTER" ? pose.eyeCenter : pose.noseBridge;
                const targetPosition = screenToWorld(
                  anchorPoint.x,
                  anchorPoint.y,
                  currentCamera,
                  0
                );

                const referenceDistance =
                  cfg.scaleMode === "IPD"
                    ? Math.max(pose.ipdDistance, 0.01)
                    : Math.max(pose.templeDistance, 0.01);
                const frameFitMultiplier = computeFrameFitMultiplier(
                  frameLensWidth,
                  frameBridgeWidth
                );
                const effectiveFitRatio = clamp(
                  cfg.fitRatio * frameFitMultiplier * MODEL_WIDTH_COMPENSATION,
                  0.08,
                  3
                );

                const targetWidthWorld = Math.max(
                  normalizedWidthToWorld(
                    referenceDistance * effectiveFitRatio,
                    currentCamera,
                    0
                  ),
                  0.01
                );

                if (!poseInitializedRef.current) {
                  smoothPositionRef.current.copy(targetPosition);
                  smoothQuaternionRef.current.copy(pose.quaternion);
                  smoothScaleRef.current = targetWidthWorld;
                  poseInitializedRef.current = true;
                } else {
                  smoothPositionRef.current.lerp(targetPosition, 0.35);
                  smoothQuaternionRef.current.slerp(pose.quaternion, 0.25);
                  smoothScaleRef.current = THREE.MathUtils.lerp(
                    smoothScaleRef.current,
                    targetWidthWorld,
                    0.35
                  );
                }

                faceAnchorGroup.visible = true;
                faceAnchorGroup.position.copy(smoothPositionRef.current);
                faceAnchorGroup.quaternion.copy(smoothQuaternionRef.current);
                faceAnchorGroup.scale.setScalar(Math.max(smoothScaleRef.current, 0.01));
              } else {
                faceAnchorGroup.visible = false;
                poseInitializedRef.current = false;
              }
            } else {
              faceAnchorGroup.visible = false;
              poseInitializedRef.current = false;
            }
          }

          currentRenderer.render(currentScene, currentCamera);
          animationRef.current = requestAnimationFrame(renderLoop);
        };

        animationRef.current = requestAnimationFrame(renderLoop);
      } catch (setupError) {
        console.error("Lỗi khởi tạo VirtualTryOnDebug:", setupError);

        if (!mounted || token !== setupTokenRef.current) return;

        if (streamRef.current) {
          releaseSharedCameraStream();
          streamRef.current = null;
        }

        detachVideoElement(videoRef.current);
        setLoading(false);
        setError(getErrorMessage(setupError));
        setStatus("Khởi tạo thất bại.");
      }
    };

    setup();
    window.addEventListener("resize", handleResize);

    return () => {
      mounted = false;
      setupTokenRef.current++;

      window.removeEventListener("resize", handleResize);

      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
        animationRef.current = null;
      }

      faceLandmarkerRef.current?.close();
      faceLandmarkerRef.current = null;

      if (streamRef.current) {
        releaseSharedCameraStream();
        streamRef.current = null;
      }

      detachVideoElement(videoRef.current);
      disposeThree();
    };
  }, [
    modelUrl,
    reloadKey,
    viewerHeight,
    showLandmarks,
    frameLensWidth,
    frameBridgeWidth,
    frameTempleLength,
  ]);

  const updateConfigValue = (key: NumericConfigKey, value: number) => {
    setConfig((current) => ({
      ...current,
      [key]: Number.isFinite(value) ? value : 0,
    }));
  };

  const updateAnchorMode = (value: string) => {
    setConfig((current) => ({
      ...current,
      anchorMode: toAnchorMode(value),
    }));
  };

  const updateScaleMode = (value: string) => {
    setConfig((current) => ({
      ...current,
      scaleMode: toScaleMode(value),
    }));
  };

  const resetConfig = () => {
    setConfig({
      scale,
      offsetX,
      offsetY,
      offsetZ,
      rotationX,
      rotationY,
      rotationZ,
      anchorMode: toAnchorMode(anchorMode),
      scaleMode: toScaleMode(scaleMode),
      fitRatio: clamp(fitRatio, 0.08, 3),
      offsetIpdX,
      offsetIpdY,
      offsetIpdZ,
      yawBias,
      pitchBias,
      rollBias,
      depthRatio,
    });
  };

  const renderNumberInput = (
    label: string,
    key: NumericConfigKey,
    step: number,
    min?: number,
    max?: number
  ) => (
    <label className="flex flex-col gap-1 text-xs text-slate-600">
      <span className="font-medium text-slate-700">{label}</span>
      <input
        type="number"
        value={config[key]}
        step={step}
        min={min}
        max={max}
        onChange={(event) => updateConfigValue(key, Number(event.target.value))}
        className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-800 outline-none transition focus:border-slate-400"
      />
    </label>
  );

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

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={resetConfig}
            className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Reset config
          </button>

          <button
            type="button"
            onClick={() => setReloadKey((current) => current + 1)}
            className="rounded-md border border-slate-300 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-50"
          >
            Thử lại camera
          </button>
        </div>
      </div>

      <div
        className="relative w-full overflow-hidden rounded-lg bg-black"
        style={{ height: `${viewerHeight}px` }}
      >
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full scale-x-[-1] object-cover"
          autoPlay
          muted
          playsInline
        />

        <div
          ref={threeContainerRef}
          className="pointer-events-none absolute inset-0 z-10 h-full w-full scale-x-[-1]"
        />

        <canvas
          ref={debugCanvasRef}
          className="pointer-events-none absolute inset-0 z-20 h-full w-full scale-x-[-1]"
        />

        {loading && (
          <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 px-4 text-center text-sm text-white">
            {status}
          </div>
        )}
      </div>

      {showControls && (
        <div className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-4 xl:grid-cols-7">
          <label className="flex flex-col gap-1 text-xs text-slate-600">
            <span className="font-medium text-slate-700">anchorMode</span>
            <select
              value={config.anchorMode}
              onChange={(event) => updateAnchorMode(event.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-800 outline-none transition focus:border-slate-400"
            >
              <option value="NOSE_BRIDGE">NOSE_BRIDGE</option>
              <option value="EYE_CENTER">EYE_CENTER</option>
            </select>
          </label>
          <label className="flex flex-col gap-1 text-xs text-slate-600">
            <span className="font-medium text-slate-700">scaleMode</span>
            <select
              value={config.scaleMode}
              onChange={(event) => updateScaleMode(event.target.value)}
              className="rounded-md border border-slate-300 px-2 py-1.5 text-sm text-slate-800 outline-none transition focus:border-slate-400"
            >
              <option value="FACE_WIDTH">FACE_WIDTH</option>
              <option value="IPD">IPD</option>
            </select>
          </label>
          {renderNumberInput("fitRatio", "fitRatio", 0.01, 0.08, 3)}
          {renderNumberInput("scale", "scale", 0.01, 0.01)}
          {renderNumberInput("offsetX", "offsetX", 0.01)}
          {renderNumberInput("offsetY", "offsetY", 0.01)}
          {renderNumberInput("offsetZ", "offsetZ", 0.01)}
          {renderNumberInput("offsetIpdX", "offsetIpdX", 0.01)}
          {renderNumberInput("offsetIpdY", "offsetIpdY", 0.01)}
          {renderNumberInput("offsetIpdZ", "offsetIpdZ", 0.01)}
          {renderNumberInput("rotationX (rad)", "rotationX", 0.01)}
          {renderNumberInput("rotationY (rad)", "rotationY", 0.01)}
          {renderNumberInput("rotationZ (rad)", "rotationZ", 0.01)}
          {renderNumberInput("yawBias", "yawBias", 0.01)}
          {renderNumberInput("pitchBias", "pitchBias", 0.01)}
          {renderNumberInput("rollBias", "rollBias", 0.01)}
          {renderNumberInput("depthRatio", "depthRatio", 0.01)}
        </div>
      )}
    </div>
  );
}