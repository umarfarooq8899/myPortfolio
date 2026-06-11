"use client";

import { motion, useInView, Variants } from "framer-motion";
import { useRef } from "react";

interface TextRevealProps {
  text: string;
  className?: string;
  type?: "char" | "word";
  delay?: number;
}

export default function TextReveal({ text, className = "", type = "char", delay = 0 }: TextRevealProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, margin: "-10%" });

  // Variants for container
  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: type === "char" ? 0.015 : 0.05,
        delayChildren: delay,
      },
    },
  };

  // Variants for each unit (char or word)
  const itemVariants: Variants = {
    hidden: { y: "100%", opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.6,
        ease: [0.215, 0.61, 0.355, 1], // easeOutCubic
      },
    },
  };

  const items = type === "char" ? Array.from(text) : text.split(" ");

  return (
    <motion.div
      ref={containerRef}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      className={`inline-flex flex-wrap overflow-hidden py-1 ${className}`}
    >
      {items.map((item, idx) => (
        <span
          key={idx}
          className="inline-block overflow-hidden"
          style={{ whiteSpace: "pre" }}
        >
          <motion.span
            variants={itemVariants}
            className="inline-block"
          >
            {item === " " && type === "char" ? "\u00A0" : item}
          </motion.span>
          {type === "word" && idx < items.length - 1 && <span>&nbsp;</span>}
        </span>
      ))}
    </motion.div>
  );
}
