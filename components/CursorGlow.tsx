"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [borderRadius, setBorderRadius] = useState("50%");

  // Raw mouse position
  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  // Target positions for outer ring (can snap to elements)
  const ringTargetX = useMotionValue(-100);
  const ringTargetY = useMotionValue(-100);

  // Target size for outer ring
  const ringWidthTarget = useMotionValue(40);
  const ringHeightTarget = useMotionValue(40);

  // Springs for smooth movement
  const dotX = useSpring(mouseX, { stiffness: 700, damping: 45 });
  const dotY = useSpring(mouseY, { stiffness: 700, damping: 45 });

  const ringX = useSpring(ringTargetX, { stiffness: 120, damping: 20 });
  const ringY = useSpring(ringTargetY, { stiffness: 120, damping: 20 });

  const ringWidth = useSpring(ringWidthTarget, { stiffness: 150, damping: 22 });
  const ringHeight = useSpring(ringHeightTarget, { stiffness: 150, damping: 22 });

  // A very loose spring for the massive ambient background glow
  const glowX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const glowY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  useEffect(() => {
    // Only enable on desktop screens
    if (window.matchMedia("(max-width: 1024px)").matches) return;
    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      mouseX.set(clientX);
      mouseY.set(clientY);

      // Check if mouse is hovering over interactive elements
      const target = e.target as HTMLElement | null;
      if (!target) return;

      const interactive = target.closest("a, button, [role='button'], .cursor-pointer, .glow-border, input, textarea");

      if (interactive) {
        setIsHovering(true);
        const rect = interactive.getBoundingClientRect();

        // Snap outer ring coordinates to center of the element
        ringTargetX.set(rect.left + rect.width / 2);
        ringTargetY.set(rect.top + rect.height / 2);

        // Resize outer ring to wrap the element
        ringWidthTarget.set(rect.width + 12);
        ringHeightTarget.set(rect.height + 12);

        // Match the border radius
        const style = window.getComputedStyle(interactive);
        setBorderRadius(style.borderRadius || "8px");
      } else {
        setIsHovering(false);
        // Follow cursor directly
        ringTargetX.set(clientX);
        ringTargetY.set(clientY);
        // Restore default circular ring size
        ringWidthTarget.set(40);
        ringHeightTarget.set(40);
        setBorderRadius("50%");
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY, ringTargetX, ringTargetY, ringWidthTarget, ringHeightTarget]);

  if (!enabled) return null;

  return (
    <>
      {/* 1. Large Ambient Background Glow */}
      <motion.div
        className="fixed pointer-events-none z-0 hidden lg:block"
        style={{
          x: glowX,
          y: glowY,
          translateX: "-50%",
          translateY: "-50%",
          width: 500,
          height: 500,
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(102, 252, 241, 0.05) 0%, transparent 70%)",
        }}
      />

      {/* 2. Outer Ring (snapping/trail element) */}
      <motion.div
        className="fixed pointer-events-none z-[9999] hidden lg:block border border-cyan-neon/30 bg-cyan-neon/0"
        style={{
          x: ringX,
          y: ringY,
          width: ringWidth,
          height: ringHeight,
          borderRadius,
          translateX: "-50%",
          translateY: "-50%",
          backdropFilter: isHovering ? "none" : "blur(1px)",
          boxShadow: isHovering ? "0 0 15px rgba(102, 252, 241, 0.15)" : "none",
          backgroundColor: isHovering ? "rgba(102, 252, 241, 0.04)" : "rgba(102, 252, 241, 0)",
        }}
        animate={{
          borderColor: isHovering ? "rgba(168, 85, 247, 0.5)" : "rgba(102, 252, 241, 0.3)",
        }}
        transition={{ duration: 0.2 }}
      />

      {/* 3. Inner Dot (direct tracking element) */}
      <motion.div
        className="fixed pointer-events-none z-[10000] hidden lg:block w-2.5 h-2.5 rounded-full bg-cyan-neon shadow-[0_0_10px_#66FCF1]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHovering ? 0 : 1,
          opacity: isHovering ? 0 : 1,
        }}
        transition={{ duration: 0.15 }}
      />
    </>
  );
}
