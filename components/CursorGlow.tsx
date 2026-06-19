"use client";

import { useEffect, useRef } from "react";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
} from "framer-motion";

// Module-level constant — no string allocation per frame
const INTERACTIVE_SELECTOR =
  "a, button, [role='button'], .cursor-pointer, .glow-border, input, textarea";

export default function CursorGlow() {
  // ─── Raw mouse position ──────────────────────────────────────────
  const mouseX = useMotionValue(-200);
  const mouseY = useMotionValue(-200);

  // ─── Outer ring target (can snap to elements) ────────────────────
  const ringTargetX = useMotionValue(-200);
  const ringTargetY = useMotionValue(-200);
  const ringWidthTarget = useMotionValue(40);
  const ringHeightTarget = useMotionValue(40);

  // ─── isHovering as a motion value (0 = false, 1 = true) ─────────
  // Using a MotionValue instead of React state means zero re-renders
  // during cursor movement. All derived visuals use useTransform.
  const isHoveringMV = useMotionValue(0);

  // ─── borderRadius as a motion value ─────────────────────────────
  // Avoids React setState (which causes a re-render + reconcile per frame)
  const borderRadiusMV = useMotionValue("50%");

  // ─── Springs ─────────────────────────────────────────────────────
  const dotX = useSpring(mouseX, { stiffness: 700, damping: 45 });
  const dotY = useSpring(mouseY, { stiffness: 700, damping: 45 });

  const ringX = useSpring(ringTargetX, { stiffness: 120, damping: 20 });
  const ringY = useSpring(ringTargetY, { stiffness: 120, damping: 20 });
  const ringWidth = useSpring(ringWidthTarget, { stiffness: 150, damping: 22 });
  const ringHeight = useSpring(ringHeightTarget, { stiffness: 150, damping: 22 });

  // Loose spring for large ambient glow
  const glowX = useSpring(mouseX, { stiffness: 40, damping: 18 });
  const glowY = useSpring(mouseY, { stiffness: 40, damping: 18 });

  // ─── Derived motion values (replaces animate prop) ───────────────
  // Bug Fix: We use useTransform instead of the `animate={}` prop.
  // Mixing animate={} with style={} caused the ring/dot to get stuck
  // because Framer's animation queue and direct style updates raced.

  const ringBorderColor = useTransform(
    isHoveringMV,
    [0, 1],
    ["rgba(102, 252, 241, 0.3)", "rgba(168, 85, 247, 0.5)"]
  );
  const ringBoxShadow = useTransform(
    isHoveringMV,
    [0, 1],
    ["none", "0 0 15px rgba(102, 252, 241, 0.15)"]
  );
  const ringBgColor = useTransform(
    isHoveringMV,
    [0, 1],
    ["rgba(102, 252, 241, 0)", "rgba(102, 252, 241, 0.04)"]
  );

  // Bug Fix: Dot opacity/scale driven by transform, not by React state + animate={}
  // The old pattern (animate={{ scale: isHovering ? 0 : 1 }}) got permanently
  // stuck at scale:0 because Framer's queue didn't re-fire on rapid toggles.
  const dotScale = useTransform(isHoveringMV, [0, 1], [1, 0]);
  const dotOpacity = useTransform(isHoveringMV, [0, 1], [1, 0]);

  // ─── Track last interactive element to avoid redundant style reads ──
  const lastInteractiveRef = useRef<Element | null>(null);
  const lastX = useRef(-200);
  const lastY = useRef(-200);

  useEffect(() => {
    // Only activate on desktop — no cursor effects on touch devices
    if (typeof window === "undefined") return;
    if (window.matchMedia("(max-width: 1024px)").matches) return;

    let rafId: number | null = null;

    const processMove = () => {
      rafId = null;
      const clientX = lastX.current;
      const clientY = lastY.current;

      mouseX.set(clientX);
      mouseY.set(clientY);

      const el = document.elementFromPoint(clientX, clientY) as HTMLElement | null;
      const interactive = el?.closest(INTERACTIVE_SELECTOR) ?? null;

      if (interactive) {
        const rect = interactive.getBoundingClientRect();
        ringTargetX.set(rect.left + rect.width / 2);
        ringTargetY.set(rect.top + rect.height / 2);
        ringWidthTarget.set(rect.width + 12);
        ringHeightTarget.set(rect.height + 12);

        // Only call getComputedStyle when the hovered element changes
        if (interactive !== lastInteractiveRef.current) {
          lastInteractiveRef.current = interactive;
          const style = window.getComputedStyle(interactive);
          // Set motion value directly — no React re-render
          borderRadiusMV.set(style.borderRadius || "8px");
        }

        isHoveringMV.set(1);
      } else {
        lastInteractiveRef.current = null;
        ringTargetX.set(clientX);
        ringTargetY.set(clientY);
        ringWidthTarget.set(40);
        ringHeightTarget.set(40);
        // Bug Fix: always reset borderRadius when not hovering, no stale value
        borderRadiusMV.set("50%");
        isHoveringMV.set(0);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      // Minimum displacement threshold — skip processing if cursor barely moved
      // Prevents elementFromPoint + getBoundingClientRect on every tiny jitter
      const dx = e.clientX - lastX.current;
      const dy = e.clientY - lastY.current;
      lastX.current = e.clientX;
      lastY.current = e.clientY;

      if (Math.abs(dx) < 2 && Math.abs(dy) < 2 && rafId !== null) return;

      if (rafId === null) {
        rafId = requestAnimationFrame(processMove);
      }
    };

    // Bug Fix: snap cursor to off-screen when the window loses focus
    // Prevents the ring from being frozen at its last position
    const handleMouseLeave = () => {
      mouseX.set(-200);
      mouseY.set(-200);
      ringTargetX.set(-200);
      ringTargetY.set(-200);
      isHoveringMV.set(0);
      borderRadiusMV.set("50%");
      lastInteractiveRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.documentElement.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      document.documentElement.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [mouseX, mouseY, ringTargetX, ringTargetY, ringWidthTarget, ringHeightTarget, isHoveringMV, borderRadiusMV]);

  // On mobile/touch — render nothing at all (no hidden DOM nodes)
  if (typeof window !== "undefined" && window.matchMedia("(max-width: 1024px)").matches) {
    return null;
  }

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
          background:
            "radial-gradient(circle, rgba(102, 252, 241, 0.05) 0%, transparent 70%)",
        }}
      />

      {/* 2. Outer Ring — all styling driven by motion values, NO animate prop */}
      {/* Bug Fix: Removed animate={{ borderColor }} which raced with style updates. */}
      {/* Now borderColor, boxShadow, backgroundColor are all useTransform values. */}
      <motion.div
        className="fixed pointer-events-none z-[9999] hidden lg:block border"
        style={{
          x: ringX,
          y: ringY,
          width: ringWidth,
          height: ringHeight,
          borderRadius: borderRadiusMV,
          translateX: "-50%",
          translateY: "-50%",
          borderColor: ringBorderColor,
          boxShadow: ringBoxShadow,
          backgroundColor: ringBgColor,
        }}
      />

      {/* 3. Inner Dot — scale/opacity via useTransform, not animate prop */}
      {/* Bug Fix: animate={{ scale: 0 }} was getting permanently stuck. */}
      <motion.div
        className="fixed pointer-events-none z-[10000] hidden lg:block w-2.5 h-2.5 rounded-full bg-cyan-neon shadow-[0_0_10px_#66FCF1]"
        style={{
          x: dotX,
          y: dotY,
          translateX: "-50%",
          translateY: "-50%",
          scale: dotScale,
          opacity: dotOpacity,
        }}
      />
    </>
  );
}
