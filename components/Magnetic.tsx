"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export default function Magnetic({
  children,
  range = 60,
  strength = 0.35,
}: {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springOptions = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springOptions);
  const springY = useSpring(y, springOptions);

  useEffect(() => {
    const currentRef = ref.current;
    // rAF handle — ensures the mousemove handler runs at most once per
    // animation frame regardless of how fast the browser fires the event.
    // This fixes the issue where 5+ Magnetic instances each add their own
    // unthrottled global listener, stacking synchronous JS on every mouse tick.
    let rafId: number | null = null;
    let latestEvent: MouseEvent | null = null;

    const processMove = () => {
      rafId = null;
      if (!currentRef || !latestEvent) return;

      const { clientX, clientY } = latestEvent;
      const { left, top, width, height } = currentRef.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < range) {
        x.set(distanceX * strength);
        y.set(distanceY * strength);
      } else {
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseMove = (e: MouseEvent) => {
      latestEvent = e;
      if (rafId === null) {
        rafId = requestAnimationFrame(processMove);
      }
    };

    const handleMouseLeave = () => {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    currentRef?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
      window.removeEventListener("mousemove", handleMouseMove);
      currentRef?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [range, strength, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
