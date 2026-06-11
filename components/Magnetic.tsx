"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

interface MagneticProps {
  children: React.ReactElement;
  range?: number;
  strength?: number;
}

export default function Magnetic({ children, range = 60, strength = 0.35 }: MagneticProps) {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springOptions = { stiffness: 150, damping: 15, mass: 0.1 };
  const springX = useSpring(x, springOptions);
  const springY = useSpring(y, springOptions);

  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const currentRef = ref.current;

    const handleMouseMove = (e: MouseEvent) => {
      if (!currentRef) return;
      const { clientX, clientY } = e;
      const { left, top, width, height } = currentRef.getBoundingClientRect();
      const centerX = left + width / 2;
      const centerY = top + height / 2;

      // Distance between cursor and button center
      const distanceX = clientX - centerX;
      const distanceY = clientY - centerY;
      const distance = Math.hypot(distanceX, distanceY);

      if (distance < range) {
        setIsHovered(true);
        // Magnetic pull toward cursor
        x.set(distanceX * strength);
        y.set(distanceY * strength);
      } else {
        setIsHovered(false);
        x.set(0);
        y.set(0);
      }
    };

    const handleMouseLeave = () => {
      setIsHovered(false);
      x.set(0);
      y.set(0);
    };

    window.addEventListener("mousemove", handleMouseMove);
    currentRef?.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      currentRef?.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [range, strength, x, y]);

  return (
    <motion.div
      ref={ref}
      style={{ x: springX, y: springY }}
      animate={{ scale: isHovered ? 1.05 : 1 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
}
