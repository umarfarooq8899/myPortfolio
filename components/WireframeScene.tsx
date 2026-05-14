"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function WireframeGeometry() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const mousePos = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Create icosahedron geometry
  const geometry = useMemo(() => new THREE.IcosahedronGeometry(2.2, 1), []);

  useFrame((state) => {
    if (!meshRef.current) return;

    const t = state.clock.getElapsedTime();

    // Smooth mouse following
    const targetX = (state.pointer.x * viewport.width) / 8;
    const targetY = (state.pointer.y * viewport.height) / 8;
    mousePos.current.x += (targetX - mousePos.current.x) * 0.02;
    mousePos.current.y += (targetY - mousePos.current.y) * 0.02;

    meshRef.current.rotation.x = t * 0.15 + mousePos.current.y * 0.3;
    meshRef.current.rotation.y = t * 0.2 + mousePos.current.x * 0.3;
    meshRef.current.rotation.z = t * 0.1;

    // Floating motion
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.3;
    meshRef.current.position.x = mousePos.current.x * 0.5;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color="#66FCF1" wireframe transparent opacity={0.35} />
    </mesh>
  );
}

function InnerGeometry() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geometry = useMemo(() => new THREE.OctahedronGeometry(1.0, 0), []);

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();
    meshRef.current.rotation.x = -t * 0.3;
    meshRef.current.rotation.y = t * 0.2;
    meshRef.current.position.y = Math.sin(t * 0.5) * 0.3;
  });

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshBasicMaterial color="#A855F7" wireframe transparent opacity={0.2} />
    </mesh>
  );
}

function FloatingParticles() {
  const pointsRef = useRef<THREE.Points>(null!);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const particleCount = isMobile ? 50 : 200;

  const particlePositions = useMemo(() => {
    const positions = new Float32Array(particleCount * 3);
    for (let i = 0; i < particleCount; i++) {
      positions[i * 3] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
    }
    return positions;
  }, [particleCount]);

  useFrame((state) => {
    if (!pointsRef.current) return;
    pointsRef.current.rotation.y = state.clock.getElapsedTime() * 0.02;
  });

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          args={[particlePositions, 3]}
          count={particleCount}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial color="#66FCF1" size={0.02} transparent opacity={0.4} sizeAttenuation />
    </points>
  );
}

export default function WireframeScene() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 6], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={typeof window !== "undefined" && window.innerWidth < 768 ? [1, 1] : [1, 2]}
      >
        <ambientLight intensity={0.5} />
        <WireframeGeometry />
        <InnerGeometry />
        <FloatingParticles />
      </Canvas>
    </div>
  );
}
