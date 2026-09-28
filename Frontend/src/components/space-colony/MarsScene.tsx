import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer, OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

function createMarsTexture() {
  const size = 512;
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = size;
  const context = canvas.getContext("2d");
  if (!context) return null;
  const base = context.createRadialGradient(180, 150, 20, 256, 256, 350);
  base.addColorStop(0, "#d87a4e");
  base.addColorStop(0.55, "#a9472e");
  base.addColorStop(1, "#61251e");
  context.fillStyle = base;
  context.fillRect(0, 0, size, size);
  let seed = 94731;
  const random = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };
  for (let index = 0; index < 350; index += 1) {
    const x = random() * size;
    const y = random() * size;
    const radius = 2 + random() * 26;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fillStyle = random() > 0.35 ? "rgba(70, 24, 19, .2)" : "rgba(240, 154, 96, .13)";
    context.fill();
  }
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function Planet() {
  const planet = useRef<THREE.Mesh>(null);
  const texture = useMemo(createMarsTexture, []);
  useFrame((_, delta) => {
    if (planet.current) planet.current.rotation.y += Math.min(delta, 0.05) * 0.06;
  });
  return (
    <group rotation-z={-0.18}>
      <mesh ref={planet} castShadow>
        <sphereGeometry args={[2, 96, 96]} />
        <meshStandardMaterial map={texture ?? undefined} roughness={0.86} metalness={0.02} />
      </mesh>
      <mesh scale={1.008}>
        <sphereGeometry args={[2, 64, 64]} />
        <meshBasicMaterial color="#e8966a" transparent opacity={0.05} side={THREE.BackSide} />
      </mesh>
    </group>
  );
}

export function MarsScene({ compact = false }: { compact?: boolean }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return <div className="h-full w-full bg-space" aria-label="Loading Mars model" />;
  return (
    <div className="h-full w-full" aria-label="Interactive 3D model of Mars">
      <Canvas dpr={1} camera={{ position: [0, 0.15, compact ? 6.8 : 6.2], fov: 42 }} gl={{ antialias: true, alpha: true }}>
        <Suspense fallback={null}>
          <ambientLight intensity={0.45} />
          <directionalLight position={[-4, 3, 5]} intensity={3.4} color="#ffd1b7" />
          <pointLight position={[4, -1, 2]} intensity={5} color="#8b2f21" />
          <Stars radius={38} depth={24} count={compact ? 250 : 650} factor={2} saturation={0.05} fade speed={0.15} />
          <Planet />
          <Environment resolution={64}>
            <Lightformer intensity={2} position={[0, 5, 4]} scale={[8, 8, 1]} color="#ffc2a0" />
          </Environment>
          <OrbitControls enablePan={false} enableZoom={!compact} minDistance={5} maxDistance={8} autoRotate={false} />
        </Suspense>
      </Canvas>
    </div>
  );
}
