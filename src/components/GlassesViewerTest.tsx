import { useEffect, useRef } from "react";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

type Props = {
  modelUrl: string;
  scale?: number;
  offsetX?: number;
  offsetY?: number;
  offsetZ?: number;
  rotationX?: number;
  rotationY?: number;
  rotationZ?: number;
};

export default function GlassesViewerTest({
  modelUrl,
  scale = 1,
  offsetX = 0,
  offsetY = 0,
  offsetZ = 0,
  rotationX = 0,
  rotationY = 0,
  rotationZ = 0,
}: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!containerRef.current || !modelUrl) return;

    const container = containerRef.current;
    const width = container.clientWidth || 800;
    const height = container.clientHeight || 420;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color("#f9fafb");

    const camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
    camera.position.set(0, 0, 5);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const ambientLight = new THREE.AmbientLight(0xffffff, 1.2);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    const loader = new GLTFLoader();
    let glassesModel: THREE.Object3D | null = null;
    let animationId = 0;

    loader.load(
      modelUrl,
      (gltf) => {
        glassesModel = gltf.scene;

        const box = new THREE.Box3().setFromObject(glassesModel);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        glassesModel.position.set(-center.x, -center.y, -center.z);
        glassesModel.position.x += offsetX;
        glassesModel.position.y += offsetY;
        glassesModel.position.z += offsetZ;

        glassesModel.scale.set(scale, scale, scale);
        glassesModel.rotation.set(rotationX, rotationY, rotationZ);

        scene.add(glassesModel);

        const maxDim = Math.max(size.x, size.y, size.z);
        camera.position.z = maxDim * 2.5 || 5;
        camera.lookAt(0, 0, 0);

        const animate = () => {
          animationId = requestAnimationFrame(animate);

          if (glassesModel) {
            glassesModel.rotation.y += 0.005;
          }

          renderer.render(scene, camera);
        };

        animate();
      },
      undefined,
      (error) => {
        console.error("Lỗi load GLB:", error);
      }
    );

    const handleResize = () => {
      if (!containerRef.current) return;

      const newWidth = containerRef.current.clientWidth || 800;
      const newHeight = containerRef.current.clientHeight || 420;

      camera.aspect = newWidth / newHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(newWidth, newHeight);
      renderer.render(scene, camera);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);

      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();

        if (mesh.material) {
          if (Array.isArray(mesh.material)) {
            mesh.material.forEach((material) => material.dispose());
          } else {
            mesh.material.dispose();
          }
        }
      });

      renderer.dispose();

      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [modelUrl, scale, offsetX, offsetY, offsetZ, rotationX, rotationY, rotationZ]);

  return (
    <div className="w-full">
      <div
        ref={containerRef}
        className="w-full h-[420px] rounded-xl border bg-gray-50 overflow-hidden"
      />
    </div>
  );
}