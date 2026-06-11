"use client";

import { useRef, useMemo, useEffect, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

function MorphingHologram() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const geomRef = useRef<THREE.IcosahedronGeometry>(null!);
  const mousePos = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Create base icosahedron geometry
  const baseGeom = useMemo(() => new THREE.IcosahedronGeometry(1.8, 3), []);
  
  // Clone original vertex positions for displacement reference
  const originalPositions = useMemo(() => {
    return baseGeom.attributes.position.clone();
  }, [baseGeom]);

  useFrame((state) => {
    if (!meshRef.current || !geomRef.current) return;

    const t = state.clock.getElapsedTime();

    // Smooth mouse following with spring inertia
    const targetX = (state.pointer.x * viewport.width) / 6;
    const targetY = (state.pointer.y * viewport.height) / 6;
    mousePos.current.x += (targetX - mousePos.current.x) * 0.04;
    mousePos.current.y += (targetY - mousePos.current.y) * 0.04;

    // Apply rotations
    meshRef.current.rotation.x = t * 0.1 + mousePos.current.y * 0.25;
    meshRef.current.rotation.y = t * 0.12 + mousePos.current.x * 0.25;
    meshRef.current.rotation.z = t * 0.05;

    // Float position
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.2;
    meshRef.current.position.x = mousePos.current.x * 0.3;

    // Displace vertices using wave formula for a dynamic liquid morphing hologram
    const posAttr = geomRef.current.attributes.position;
    const orig = originalPositions.array as Float32Array;
    const current = posAttr.array as Float32Array;

    for (let i = 0; i < posAttr.count; i++) {
      const ix = i * 3;
      const iy = i * 3 + 1;
      const iz = i * 3 + 2;

      const x = orig[ix];
      const y = orig[iy];
      const z = orig[iz];

      // Math wave formula based on time, vertex index, and cursor proximity
      const wave = Math.sin(x * 2.0 + t * 2.2) * Math.cos(y * 2.0 + t * 2.2) * 0.15 +
                   Math.cos(z * 2.5 - t * 1.8) * 0.08;

      // Displacement along normal vector (sphere normal = position / radius)
      const len = Math.hypot(x, y, z);
      const nx = x / len;
      const ny = y / len;
      const nz = z / len;

      current[ix] = x + nx * wave;
      current[iy] = y + ny * wave;
      current[iz] = z + nz * wave;
    }

    posAttr.needsUpdate = true;
    geomRef.current.computeVertexNormals();
  });

  return (
    <mesh ref={meshRef}>
      <icosahedronGeometry ref={geomRef} args={[1.8, 3]} />
      <meshBasicMaterial
        color="#66FCF1"
        wireframe
        transparent
        opacity={0.3}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

function HolographicCore() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const { viewport } = useThree();
  const mousePos = useRef({ x: 0, y: 0 });

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    const targetX = (state.pointer.x * viewport.width) / 6;
    const targetY = (state.pointer.y * viewport.height) / 6;
    mousePos.current.x += (targetX - mousePos.current.x) * 0.04;
    mousePos.current.y += (targetY - mousePos.current.y) * 0.04;

    // Rotate core in opposite direction
    meshRef.current.rotation.x = -t * 0.35;
    meshRef.current.rotation.y = -t * 0.25;
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.2;
    meshRef.current.position.x = mousePos.current.x * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      <octahedronGeometry args={[0.7, 0]} />
      <meshBasicMaterial
        color="#A855F7"
        wireframe
        transparent
        opacity={0.5}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// Custom Plexus / Constellation Effect
function PlexusConstellation() {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const particleCount = isMobile ? 35 : 110;
  const maxDistance = 1.6;
  const maxConnections = 200;

  // Initialize particle positions and velocities
  const particles = useMemo(() => {
    const arr = [];
    for (let i = 0; i < particleCount; i++) {
      arr.push({
        pos: new THREE.Vector3(
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8,
          (Math.random() - 0.5) * 8
        ),
        vel: new THREE.Vector3(
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015,
          (Math.random() - 0.5) * 0.015
        ),
      });
    }
    return arr;
  }, [particleCount]);

  // Float32 position buffers
  const pointsPositions = useMemo(() => new Float32Array(particleCount * 3), [particleCount]);
  const linesPositions = useMemo(() => new Float32Array(maxConnections * 2 * 3), []);

  useFrame((state) => {
    if (!pointsRef.current || !linesRef.current) return;

    // 1. Update particle coordinates
    particles.forEach((p, idx) => {
      p.pos.add(p.vel);

      // Bounce boundaries
      if (Math.abs(p.pos.x) > 4.5) p.vel.x *= -1;
      if (Math.abs(p.pos.y) > 4.5) p.vel.y *= -1;
      if (Math.abs(p.pos.z) > 4.5) p.vel.z *= -1;

      // Snap values into Float32Array
      pointsPositions[idx * 3] = p.pos.x;
      pointsPositions[idx * 3 + 1] = p.pos.y;
      pointsPositions[idx * 3 + 2] = p.pos.z;
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // 2. Generate line connections dynamically (Plexus effect)
    let connectionCount = 0;
    const linesAttr = linesRef.current.geometry.attributes.position;
    const linesArr = linesAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const pA = particles[i].pos;
        const pB = particles[j].pos;
        const dist = pA.distanceTo(pB);

        if (dist < maxDistance && connectionCount < maxConnections) {
          const writeIndex = connectionCount * 6;
          // Vertex A
          linesArr[writeIndex] = pA.x;
          linesArr[writeIndex + 1] = pA.y;
          linesArr[writeIndex + 2] = pA.z;
          // Vertex B
          linesArr[writeIndex + 3] = pB.x;
          linesArr[writeIndex + 4] = pB.y;
          linesArr[writeIndex + 5] = pB.z;

          connectionCount++;
        }
      }
    }

    linesAttr.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, connectionCount * 2);
  });

  return (
    <group>
      {/* The floating nodes */}
      <points ref={pointsRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[pointsPositions, 3]}
            count={particleCount}
            itemSize={3}
          />
        </bufferGeometry>
        <pointsMaterial
          color="#66FCF1"
          size={0.07}
          transparent
          opacity={0.5}
          sizeAttenuation
        />
      </points>

      {/* The connecting lines */}
      <lineSegments ref={linesRef}>
        <bufferGeometry>
          <bufferAttribute
            attach="attributes-position"
            args={[linesPositions, 3]}
            count={maxConnections * 2}
            itemSize={3}
          />
        </bufferGeometry>
        <lineBasicMaterial
          color="#66FCF1"
          transparent
          opacity={0.12}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </lineSegments>
    </group>
  );
}

export default function WireframeScene() {
  return (
    <div className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={typeof window !== "undefined" && window.innerWidth < 768 ? [1, 1] : [1, 2]}
      >
        <ambientLight intensity={0.5} />
        <MorphingHologram />
        <HolographicCore />
        <PlexusConstellation />
      </Canvas>
    </div>
  );
}
