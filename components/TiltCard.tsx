"use client";

import { useRef, useCallback, useEffect } from "react";
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
  const spotlightRef = useRef<HTMLDivElement>(null);

  // Rotation motion values
  const rotateXVal = useMotionValue(0);
  const rotateYVal = useMotionValue(0);

  const springOptions = { stiffness: 150, damping: 20, mass: 0.5 };
  const rotateX = useSpring(rotateXVal, springOptions);
  const rotateY = useSpring(rotateYVal, springOptions);

  const transX = useTransform(rotateYVal, [-maxTilt, maxTilt], [-5, 5]);
  const transY = useTransform(rotateXVal, [-maxTilt, maxTilt], [5, -5]);

  // ─── Spotlight helpers ────────────────────────────────────────────
  // We never use React state for the spotlight. Position + opacity are
  // written directly to the DOM element's style so zero re-renders occur.
  // Initial position is -9999px so the gradient is invisible before the
  // first mousemove — fixes the "whole card lights up on hover" bug.
  const showSpotlight = useCallback(() => {
    if (spotlightRef.current) {
      spotlightRef.current.style.opacity = "1";
    }
  }, []);

  const hideSpotlight = useCallback(() => {
    if (!spotlightRef.current) return;
    spotlightRef.current.style.opacity = "0";
    // Reset to off-card position so next hover starts clean
    spotlightRef.current.style.setProperty("--spotlight-x", "-9999px");
    spotlightRef.current.style.setProperty("--spotlight-y", "-9999px");
  }, []);

  const handleMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      if (!ref.current || !spotlightRef.current) return;
      const rect = ref.current.getBoundingClientRect();

      const x = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
      const y = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);

      rotateXVal.set(-y * maxTilt);
      rotateYVal.set(x * maxTilt);

      // Write cursor-relative coords directly to CSS vars — zero React renders
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

  const handleMouseEnter = useCallback(() => {
    // Don't show yet — wait for first mousemove to set the correct position.
    // This prevents the "whole card lights up" flash from the 50%/50% default.
    // showSpotlight() is called on first mousemove via the move handler itself.
  }, []);

  const handleMouseLeave = useCallback(() => {
    hideSpotlight();
    rotateXVal.set(0);
    rotateYVal.set(0);
  }, [hideSpotlight, rotateXVal, rotateYVal]);

  // ─── Scroll fix ───────────────────────────────────────────────────
  // The browser does NOT fire mouseleave when the page scrolls under
  // the cursor — so `hovered` would stay true and the spotlight would
  // remain visible as the card moves away. We listen for scroll and
  // forcibly reset both the spotlight and rotation.
  useEffect(() => {
    const handleScroll = () => {
      hideSpotlight();
      rotateXVal.set(0);
      rotateYVal.set(0);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [hideSpotlight, rotateXVal, rotateYVal]);

  // Show spotlight on first real mousemove (not mouseenter)
  const handleMouseMoveWithShow = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      showSpotlight();
      handleMouseMove(e);
    },
    [showSpotlight, handleMouseMove]
  );

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMoveWithShow}
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
      {/* Spotlight overlay — fully DOM-driven, zero React re-renders */}
      <div
        ref={spotlightRef}
        className="absolute inset-0 rounded-xl pointer-events-none z-10"
        style={{
          // Start off-card so the gradient is invisible before first mousemove
          ["--spotlight-x" as string]: "-9999px",
          ["--spotlight-y" as string]: "-9999px",
          opacity: 0,
          // CSS transition only on opacity, not on the gradient (prevents travel bug)
          transition: "opacity 0.3s ease",
          background: `radial-gradient(circle 250px at var(--spotlight-x) var(--spotlight-y), ${glowColor}, transparent 80%)`,
        }}
      />

      {/* Content wrapper with parallax depth */}
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
