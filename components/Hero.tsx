"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";

// Dynamically import Three.js scene to avoid SSR issues
const WireframeScene = dynamic(() => import("./WireframeScene"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex items-center justify-center">
      <div className="w-16 h-16 border border-cyan-neon/20 rounded-full animate-spin border-t-cyan-neon" />
    </div>
  ),
});

const titles = ["MERN Stack Developer", "React Specialist", "Node.js Engineer"];

export default function Hero() {
  const [titleIndex, setTitleIndex] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);

  const currentTitle = titles.find((_, index) => index === titleIndex) || "";

  const typeEffect = useCallback(() => {
    if (!isDeleting) {
      if (displayText.length < currentTitle.length) {
        setTimeout(() => {
          setDisplayText(currentTitle.slice(0, displayText.length + 1));
        }, 80);
      } else {
        setTimeout(() => setIsDeleting(true), 2000);
      }
    } else {
      if (displayText.length > 0) {
        setTimeout(() => {
          setDisplayText(currentTitle.slice(0, displayText.length - 1));
        }, 40);
      } else {
        setIsDeleting(false);
        setTitleIndex((prev) => (prev + 1) % titles.length);
      }
    }
  }, [displayText, isDeleting, currentTitle]);

  useEffect(() => {
    const timeout = setTimeout(typeEffect, 0);
    return () => clearTimeout(timeout);
  }, [typeEffect]);

  return (
    <section
      id="hero"
      className="relative min-h-screen flex items-center overflow-hidden grid-bg"
    >
      {/* Gradient Orbs */}
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-cyan-neon/5 rounded-full blur-[128px]" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-violet-bright/5 rounded-full blur-[128px]" />

      <div className="section-container w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-4 items-center min-h-[80vh]">
          {/* Left Side — Typography */}
          <motion.div
            initial={{ opacity: 0, x: -60 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="z-10 order-2 lg:order-1"
          >
            {/* Greeting */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="font-mono text-sm text-cyan-neon/80 mb-4 tracking-widest uppercase"
            >
              &lt;Hello World /&gt;
            </motion.p>

            {/* Name */}
            <h1 className="font-grotesk text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold text-white leading-[0.95] tracking-tight mb-6">
              UMAR
              <br />
              <span className="gradient-text">FAROOQ</span>
            </h1>

            {/* Typewriter */}
            <div className="flex items-center gap-2 mb-8">
              <span className="w-8 h-px bg-cyan-neon/50" />
              <p className="font-mono text-base sm:text-lg text-cyan-muted">
                {displayText}
                <span className="inline-block w-[2px] h-5 bg-cyan-neon ml-1 animate-typewriter-blink align-middle" />
              </p>
            </div>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-text-primary/60 text-base sm:text-lg max-w-md leading-relaxed mb-10"
            >
              Crafting scalable digital experiences with MongoDB, Express.js,
              React, and Node.js — the complete MERN stack.
            </motion.p>

            {/* CTAs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="flex flex-wrap gap-4"
            >
              <a
                href="#projects"
                className="group relative px-7 py-3 bg-cyan-neon/10 text-cyan-neon font-grotesk text-sm rounded-lg glow-border hover:bg-cyan-neon/15 transition-all duration-300"
              >
                View Projects
                <span className="inline-block ml-2 transition-transform group-hover:translate-x-1">
                  →
                </span>
              </a>
              <a
                href="#contact"
                className="px-7 py-3 text-text-primary/70 font-grotesk text-sm rounded-lg border border-text-primary/10 hover:border-violet-bright/50 hover:text-violet-bright hover:shadow-[0_0_15px_rgba(168,85,247,0.1)] transition-all duration-300"
              >
                Get In Touch
              </a>
            </motion.div>
          </motion.div>

          {/* Right Side — 3D Wireframe */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2, ease: "easeOut" }}
            className="relative h-[400px] sm:h-[500px] lg:h-[600px] order-1 lg:order-2"
          >
            <WireframeScene />
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.5 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <span className="text-xs font-mono text-text-muted tracking-widest uppercase">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <ChevronDown size={20} className="text-cyan-neon/50" />
        </motion.div>
      </motion.div>
    </section>
  );
}
