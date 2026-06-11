"use client";

import { useRef, useState } from "react";
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
  const [spotlightPos, setSpotlightPos] = useState({ x: 0, y: 0 });

  // Rotation motion values
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);

  // Smooth spring physics for rotation
  const springOptions = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(rotateXVal, springOptions);
  const rotateY = useSpring(rotateYVal, springOptions);

  // Parallax translation for child elements (optional depth effect)
  const transX = useTransform(rotateYVal, [-maxTilt, maxTilt], [-5, 5]);
  const transY = useTransform(rotateXVal, [-maxTilt, maxTilt], [5, -5]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;

    // Normalize coordinates: -0.5 to 0.5 relative to center
    const x = (e.clientX - rect.left - width / 2) / (width / 2);
    const y = (e.clientY - rect.top - height / 2) / (height / 2);

    // Set target rotation values
    rotateXVal.set(-y * maxTilt);
    rotateYVal.set(x * maxTilt);

    // Set spotlight coordinates
    setSpotlightPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = () => {
    setHovered(true);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    rotateXVal.set(0);
    rotateYVal.set(0);
  };

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
      }}
      className={`relative rounded-xl transition-shadow duration-300 ${className}`}
    >
      {/* Background/Spotlight Glow Overlay */}
      <div
        className="absolute inset-0 rounded-xl pointer-events-none transition-opacity duration-500 z-10"
        style={{
          opacity: hovered ? 1 : 0,
          background: `radial-gradient(circle 250px at ${spotlightPos.x}px ${spotlightPos.y}px, ${glowColor}, transparent 80%)`,
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
