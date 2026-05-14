"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Layers, Zap, Coffee } from "lucide-react";

const stats = [
  { icon: Code2, value: "50+", label: "Projects Built" },
  { icon: Layers, value: "3+", label: "Years Exp" },
  { icon: Zap, value: "15+", label: "Tech Stack" },
  { icon: Coffee, value: "∞", label: "Coffee Cups" },
];

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="about" className="relative py-24 sm:py-32" ref={ref}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-16">
          <span className="font-mono text-xs text-cyan-neon tracking-widest uppercase">01</span>
          <span className="w-12 h-px bg-cyan-neon/30" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">About</span>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-2 glass-card p-8 sm:p-10">
            <h2 className="font-grotesk text-3xl sm:text-4xl font-bold text-white mb-6">
              Building the future,<br /><span className="gradient-text-cyan">one line at a time.</span>
            </h2>
            <div className="space-y-4 text-text-primary/70 leading-relaxed">
              <p>I&apos;m a MERN Stack Developer with a passion for building scalable, production-grade web applications. My work spans from designing elegant React frontends to architecting robust Node.js and Express.js backend systems with MongoDB databases.</p>
              <p>With deep expertise in the MERN ecosystem — MongoDB, Express.js, React, and Node.js — I craft full-stack digital experiences that are not only visually stunning but also performant and accessible.</p>
              <p>When I&apos;m not coding, you&apos;ll find me exploring new JavaScript libraries, building REST APIs, or deep-diving into database optimization and application architecture.</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div key={stat.label} initial={{ opacity: 0, scale: 0.9 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }} className="glass-card p-5 sm:p-6 flex flex-col items-center justify-center text-center group">
                <stat.icon size={22} className="text-cyan-neon/60 mb-3 group-hover:text-cyan-neon transition-colors duration-300" />
                <span className="font-grotesk text-2xl sm:text-3xl font-bold text-white">{stat.value}</span>
                <span className="font-mono text-[10px] sm:text-xs text-text-muted mt-1 tracking-wider uppercase">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
