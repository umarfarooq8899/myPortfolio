"use client";

import { useRef, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

// ─── Singleton Mouse Listener ─────────────────────────────────────────────────
// A single global `mousemove` listener shared across ALL Magnetic instances.
// Previously, each instance added its own `window.addEventListener("mousemove")`
// — with 7 instances on the page (5 in Navbar + 2 in Hero) that was 7 separate
// listeners firing synchronously on every mouse event.
//
// Now: one listener fires, stores the coords, and notifies all subscribers.
// Cost drops from O(n listeners) to O(1) regardless of Magnetic count on page.

type MouseCallback = (x: number, y: number) => void;

const subscribers = new Set<MouseCallback>();
let globalRafId: number | null = null;
let latestX = 0;
let latestY = 0;
let listenerAttached = false;

function flushMouseMove() {
  globalRafId = null;
  // Notify all active Magnetic instances with the same coords in one rAF tick
  subscribers.forEach((cb) => cb(latestX, latestY));
}

function attachGlobalListener() {
  if (listenerAttached || typeof window === "undefined") return;
  listenerAttached = true;

  window.addEventListener(
    "mousemove",
    (e: MouseEvent) => {
      latestX = e.clientX;
      latestY = e.clientY;
      // rAF-throttle: at most one flush per animation frame
      if (globalRafId === null) {
        globalRafId = requestAnimationFrame(flushMouseMove);
      }
    },
    { passive: true }
  );
}

function subscribe(cb: MouseCallback): () => void {
  attachGlobalListener();
  subscribers.add(cb);
  return () => subscribers.delete(cb);
}

// ─── Magnetic Component ───────────────────────────────────────────────────────
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

    // Subscribe to the shared singleton listener — no new window listener added
    const unsubscribe = subscribe((clientX, clientY) => {
      if (!currentRef) return;
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
    });

    const handleMouseLeave = () => {
      x.set(0);
      y.set(0);
    };

    currentRef?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      unsubscribe();
      currentRef?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [range, strength, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY, willChange: "transform" }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
