"use client";

import { useRef, useState, useCallback } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";

interface TiltCardProps {
  children: React.ReactNode;
  className?: string;
  maxTilt?: number;
  glowColor?: string;
}

export default function TiltCard({
  children,
  className = "",
  maxTilt = 12,
  glowColor = "rgba(102, 252, 241, 0.12)",
}: TiltCardProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Rotation motion values
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);

  // Smooth spring physics for rotation
  const springOptions = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(rotateXVal, springOptions);
  const rotateY = useSpring(rotateYVal, springOptions);

  // Parallax translation for child elements
  const transX = useTransform(rotateYVal, [-maxTilt, maxTilt], [-5, 5]);
  const transY = useTransform(rotateXVal, [-maxTilt, maxTilt], [5, -5]);

  // ─── Spotlight via CSS Custom Properties ──────────────────────────
  // Performance Fix: Previously `setSpotlightPos` (React state) was called
  // on every mousemove pixel, triggering a full React re-render + style
  // recalculation on every frame. Now we write directly to CSS custom
  // properties on the DOM node — zero React renders during mouse movement.
  const spotlightRef = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || !spotlightRef.current) return;
      const rect = ref.current.getBoundingClientRect();

      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      rotateXVal.set(-y * maxTilt);
      rotateYVal.set(x * maxTilt);

      // Write spotlight position directly to the DOM element's CSS vars
      spotlightRef.current.style.setProperty(
        "--spotlight-x",
        `${e.clientX - rect.left}px`
      );
      spotlightRef.current.style.setProperty(
        "--spotlight-y",
        `${e.clientY - rect.top}px`
      );
    },
    [maxTilt, rotateXVal, rotateYVal]
  );

  const handleMouseEnter = useCallback(() => setHovered(true), []);

  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    rotateXVal.set(0);
    rotateYVal.set(0);
  }, [rotateXVal, rotateYVal]);

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
      className={`relative rounded-xl transition-shadow duration-300 ${className}`}
    >
      {/* Spotlight Glow Overlay — reads CSS custom props, no re-renders */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-500 z-10"
        style={{
          // CSS var defaults (before first mousemove) — centered
          ["--spotlight-x" as string]: "50%",
          ["--spotlight-y" as string]: "50%",
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 250px at var(--spotlight-x) var(--spotlight-y), ${glowColor}, transparent 80%)`,
        }}
      />

      {/* Content wrapper with depth */}
      <motion.div
        style={{
          x: transX,
          y: transY,
          transformStyle: "preserve-3d",
        }}
        className="h-full w-full"
      >
        {children}
      </motion.div>
    </motion.div>
  );
}
