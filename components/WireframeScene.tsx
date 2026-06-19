"use client";

import { useRef, useMemo, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";

// ─── Mobile Detection ────────────────────────────────────────────────────────
// Detected once at module level — avoids useState/useEffect + resize listener.
const IS_MOBILE =
  typeof window !== "undefined" && window.innerWidth < 768;

// ─── GLSL Shaders for MorphingHologram ───────────────────────────────────────
// Moving vertex displacement to the GPU eliminates the main-thread CPU cost of
// mutating 242 Float32Array values every animation frame in JavaScript.
// The morph math is identical to the old JS version, just running on the GPU.
const HOLOGRAM_VERT = /* glsl */ `
  uniform float uTime;
  varying vec3 vNormal;
  varying vec3 vPosition;

  void main() {
    vec3 pos = position;
    float wave =
      sin(pos.x * 2.0 + uTime * 2.2) * cos(pos.y * 2.0 + uTime * 2.2) * 0.15 +
      cos(pos.z * 2.5 - uTime * 1.8) * 0.08;

    // Displace along the surface normal (normalised position = normal on a sphere)
    vec3 n = normalize(pos);
    pos += n * wave;

    vNormal = normalize(normalMatrix * normal);
    vPosition = pos;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  }
`;

const HOLOGRAM_FRAG = /* glsl */ `
  uniform float uOpacity;
  uniform vec3 uColor;

  void main() {
    gl_FragColor = vec4(uColor, uOpacity);
  }
`;

// ─── MorphingHologram ─────────────────────────────────────────────────────────
function MorphingHologram() {
  const meshRef = useRef<THREE.Mesh>(null!);
  const mousePos = useRef({ x: 0, y: 0 });
  const { viewport } = useThree();

  // Shader uniforms — updated in useFrame, not in React state
  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColor: { value: new THREE.Color("#66FCF1") },
      uOpacity: { value: 0.3 },
    }),
    []
  );

  useFrame((state) => {
    if (!meshRef.current) return;
    const t = state.clock.getElapsedTime();

    // Update the time uniform — GPU does the displacement, zero JS math
    uniforms.uTime.value = t;

    const targetX = (state.pointer.x * viewport.width) / 6;
    const targetY = (state.pointer.y * viewport.height) / 6;
    mousePos.current.x += (targetX - mousePos.current.x) * 0.04;
    mousePos.current.y += (targetY - mousePos.current.y) * 0.04;

    meshRef.current.rotation.x = t * 0.1 + mousePos.current.y * 0.25;
    meshRef.current.rotation.y = t * 0.12 + mousePos.current.x * 0.25;
    meshRef.current.rotation.z = t * 0.05;
    meshRef.current.position.y = Math.sin(t * 0.6) * 0.2;
    meshRef.current.position.x = mousePos.current.x * 0.3;
  });

  return (
    <mesh ref={meshRef}>
      {/* Detail=2 → 80 verts; detail=3 was 242. GPU shader handles morphing now. */}
      <icosahedronGeometry args={[1.8, IS_MOBILE ? 1 : 2]} />
      <shaderMaterial
        vertexShader={HOLOGRAM_VERT}
        fragmentShader={HOLOGRAM_FRAG}
        uniforms={uniforms}
        wireframe
        transparent
        blending={THREE.AdditiveBlending}
        depthWrite={false}
      />
    </mesh>
  );
}

// ─── HolographicCore ──────────────────────────────────────────────────────────
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

// ─── PlexusConstellation ──────────────────────────────────────────────────────
function PlexusConstellation() {
  const pointsRef = useRef<THREE.Points>(null!);
  const linesRef = useRef<THREE.LineSegments>(null!);
  const frameCount = useRef(0);

  const particleCount = IS_MOBILE ? 35 : 70;
  const maxDistance = 1.6;
  const maxConnections = 200;

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

  const pointsPositions = useMemo(
    () => new Float32Array(particleCount * 3),
    [particleCount]
  );
  const linesPositions = useMemo(
    () => new Float32Array(maxConnections * 2 * 3),
    []
  );

  useFrame(() => {
    if (!pointsRef.current || !linesRef.current) return;
    frameCount.current++;

    particles.forEach((p, idx) => {
      p.pos.add(p.vel);
      if (Math.abs(p.pos.x) > 4.5) p.vel.x *= -1;
      if (Math.abs(p.pos.y) > 4.5) p.vel.y *= -1;
      if (Math.abs(p.pos.z) > 4.5) p.vel.z *= -1;
      pointsPositions[idx * 3] = p.pos.x;
      pointsPositions[idx * 3 + 1] = p.pos.y;
      pointsPositions[idx * 3 + 2] = p.pos.z;
    });

    pointsRef.current.geometry.attributes.position.needsUpdate = true;

    // Throttle O(n²) scan to every 2 frames (30fps for connections)
    if (frameCount.current % 2 !== 0) return;

    let connectionCount = 0;
    const linesAttr = linesRef.current.geometry.attributes.position;
    const linesArr = linesAttr.array as Float32Array;

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const pA = particles[i].pos;
        const pB = particles[j].pos;
        if (
          pA.distanceTo(pB) < maxDistance &&
          connectionCount < maxConnections
        ) {
          const w = connectionCount * 6;
          linesArr[w] = pA.x; linesArr[w + 1] = pA.y; linesArr[w + 2] = pA.z;
          linesArr[w + 3] = pB.x; linesArr[w + 4] = pB.y; linesArr[w + 5] = pB.z;
          connectionCount++;
        }
      }
    }

    linesAttr.needsUpdate = true;
    linesRef.current.geometry.setDrawRange(0, connectionCount * 2);
  });

  return (
    <group>
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

// ─── Scene Visibility Pauser ──────────────────────────────────────────────────
// Pauses the Three.js render loop when the canvas is off-screen (scrolled past).
// Resumes it as soon as even 1px of the canvas is visible again.
function VisibilityPauser({ containerRef }: { containerRef: React.RefObject<HTMLDivElement> }) {
  const { gl, invalidate } = useThree();

  useEffect(() => {
    const canvas = gl.domElement;
    const target = containerRef.current ?? canvas;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          // Resume — re-register the animation loop
          gl.setAnimationLoop(() => invalidate());
        } else {
          // Pause — stop the loop to free GPU budget for the rest of the page
          gl.setAnimationLoop(null);
        }
      },
      { threshold: 0 }
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [gl, invalidate, containerRef]);

  return null;
}

// ─── WireframeScene ───────────────────────────────────────────────────────────
export default function WireframeScene() {
  const containerRef = useRef<HTMLDivElement>(null!);

  return (
    <div ref={containerRef} className="w-full h-full min-h-[400px]">
      <Canvas
        camera={{ position: [0, 0, 6.5], fov: 45 }}
        style={{ background: "transparent" }}
        dpr={IS_MOBILE ? [1, 1] : [1, 1.5]}
        gl={{ antialias: !IS_MOBILE, powerPreference: "high-performance" }}
      >
        <VisibilityPauser containerRef={containerRef} />
        <ambientLight intensity={0.5} />
        <MorphingHologram />
        <HolographicCore />
        <PlexusConstellation />
      </Canvas>
    </div>
  );
}
