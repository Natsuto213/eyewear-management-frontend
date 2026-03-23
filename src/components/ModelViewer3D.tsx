import { useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

type Props = {
  modelUrl: string;
  height?: number;
  className?: string;
};

function disposeObject3D(object: THREE.Object3D) {
  object.traverse((node) => {
    const mesh = node as THREE.Mesh;

    if (mesh.geometry) {
      mesh.geometry.dispose();
    }

    const material: unknown = (mesh as any).material;
    if (!material) return;

    if (Array.isArray(material)) {
      for (const mat of material) {
        if (mat?.dispose) mat.dispose();
      }
      return;
    }

    if ((material as any).dispose) {
      (material as any).dispose();
    }
  });
}

function fitCameraToObject(params: {
  camera: THREE.PerspectiveCamera;
  controls: OrbitControls;
  object: THREE.Object3D;
}) {
  const { camera, controls, object } = params;

  const box = new THREE.Box3().setFromObject(object);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  const maxSize = Math.max(size.x, size.y, size.z);
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const distance = maxSize / (2 * Math.tan(fov / 2));

  const direction = new THREE.Vector3(0.8, 0.4, 1).normalize();
  camera.position.copy(center.clone().add(direction.multiplyScalar(distance * 1.6)));
  camera.near = Math.max(distance / 100, 0.01);
  camera.far = Math.max(distance * 100, 100);
  camera.updateProjectionMatrix();

  controls.target.copy(center);
  controls.update();
}

export default function ModelViewer3D({ modelUrl, height = 520, className }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasHostRef = useRef<HTMLDivElement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const normalizedUrl = useMemo(() => (modelUrl ?? "").trim(), [modelUrl]);

  useEffect(() => {
    if (!normalizedUrl) {
      setLoading(false);
      setError("Không tìm thấy đường dẫn model (.glb) để hiển thị.");
      return;
    }

    const container = containerRef.current;
    const canvasHost = canvasHostRef.current;
    if (!container || !canvasHost) return;

    setLoading(true);
    setError(null);

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#ffffff");

    const camera = new THREE.PerspectiveCamera(45, 1, 0.01, 2000);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: false });
    renderer.setPixelRatio(window.devicePixelRatio || 1);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;

    canvasHost.innerHTML = "";
    canvasHost.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.06;
    controls.enablePan = false;
    controls.minDistance = 0.2;

    const hemi = new THREE.HemisphereLight(0xffffff, 0x334155, 1);
    scene.add(hemi);
    const dir = new THREE.DirectionalLight(0xffffff, 1.25);
    dir.position.set(3, 5, 4);
    scene.add(dir);
    const ambient = new THREE.AmbientLight(0xffffff, 0.35);
    scene.add(ambient);

    const loader = new GLTFLoader();

    let disposed = false;
    let modelRoot: THREE.Object3D | null = null;
    let rafId = 0;
    let resizeObserver: ResizeObserver | null = null;

    const resize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const heightPx = container.clientHeight;
      if (width <= 0 || heightPx <= 0) return;

      camera.aspect = width / heightPx;
      camera.updateProjectionMatrix();
      renderer.setSize(width, heightPx, false);
    };

    resizeObserver = new ResizeObserver(() => resize());
    resizeObserver.observe(container);
    resize();

    const animate = () => {
      if (disposed) return;
      controls.update();
      renderer.render(scene, camera);
      rafId = window.requestAnimationFrame(animate);
    };

    rafId = window.requestAnimationFrame(animate);

    loader.load(
      normalizedUrl,
      (gltf) => {
        if (disposed) {
          disposeObject3D(gltf.scene);
          return;
        }

        if (modelRoot) {
          scene.remove(modelRoot);
          disposeObject3D(modelRoot);
        }

        modelRoot = gltf.scene;
        scene.add(modelRoot);

        fitCameraToObject({ camera, controls, object: modelRoot });
        setLoading(false);
      },
      undefined,
      (err) => {
        if (disposed) return;
        setLoading(false);
        setError(
          err instanceof Error
            ? err.message
            : "Tải model thất bại (kiểm tra URL/CORS/định dạng .glb)."
        );
      }
    );

    return () => {
      disposed = true;
      if (rafId) window.cancelAnimationFrame(rafId);
      if (resizeObserver) resizeObserver.disconnect();
      controls.dispose();

      if (modelRoot) {
        scene.remove(modelRoot);
        disposeObject3D(modelRoot);
      }

      renderer.dispose();
      if (renderer.domElement.parentElement === canvasHost) {
        canvasHost.removeChild(renderer.domElement);
      }
    };
  }, [normalizedUrl]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        className="relative w-full overflow-hidden rounded-xl border border-slate-200 bg-white"
        style={{ height }}
      >
        <div ref={canvasHostRef} className="absolute inset-0" />
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/85">
            <div className="text-sm font-medium text-slate-700">Đang tải model 3D…</div>
          </div>
        )}

        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-white px-6">
            <div className="max-w-xl text-center text-sm text-red-600">{error}</div>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2 text-xs text-slate-600">
        <span className="rounded-md bg-slate-100 px-2 py-1">Kéo để xoay</span>
        <span className="rounded-md bg-slate-100 px-2 py-1">Cuộn để zoom</span>
      </div>
    </div>
  );
}
