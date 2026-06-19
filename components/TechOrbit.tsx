"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { useLanguage } from "@/context/LanguageContext";

const orbitItems = [
  { label: "MongoDB", color: "#47A248", angle: 0, radius: 130, speed: 20, icon: "🍃" },
  { label: "Express.js", color: "#68A063", angle: 90, radius: 130, speed: 25, icon: "⚡" },
  { label: "React", color: "#61DAFB", angle: 180, radius: 130, speed: 18, icon: "⚛" },
  { label: "Node.js", color: "#339933", angle: 270, radius: 130, speed: 22, icon: "⬡" },
];

const extraTech = [
  "JavaScript", "TypeScript", "Next.js", "Redux",
  "Mongoose", "REST APIs", "JWT Auth", "Socket.io",
  "TailwindCSS", "Framer Motion", "Git", "Vercel",
];

export default function TechOrbit() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();
  const tech = t("tech");

  return (
    <section id="expertise" className="relative py-24 sm:py-32" ref={ref}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-16">
          <span className="font-mono text-xs text-cyan-neon tracking-widest uppercase">03</span>
          <span className="w-12 h-px bg-cyan-neon/30" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">{tech.sectionTitle}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Orbit Visual */}
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={isInView ? { opacity: 1, scale: 1 } : {}} transition={{ duration: 0.8 }} className="flex justify-center">
            <div className="orbit-container">
              {/* Orbit Rings */}
              <div className="orbit-ring" style={{ inset: "15%" }} />
              <div className="orbit-ring" style={{ inset: "5%" }} />
              <div className="orbit-ring" style={{ inset: "-5%" }} />

              {/* Center Core */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative">
                  <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-gradient-to-br from-cyan-neon/20 to-violet-bright/20 flex items-center justify-center border border-cyan-neon/20 shadow-[0_0_15px_rgba(102,252,241,0.3)]">
                    <span className="font-grotesk text-lg sm:text-xl font-bold text-white text-center leading-tight whitespace-pre-line">{tech.coreStack}</span>
                  </div>
                </div>
              </div>

              {/* Orbiting Items */}
              {orbitItems.map((item, i) => (
                <div
                  key={item.label}
                  className="absolute inset-0"
                  style={{
                    animation: `orbit ${item.speed}s linear infinite ${i % 2 === 1 ? "reverse" : ""}`,
                    ["--orbit-radius" as string]: `${item.radius}px`,
                  }}
                >
                  <div
                    className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{
                      animation: `orbit ${item.speed}s linear infinite ${i % 2 === 1 ? "" : "reverse"}`,
                      ["--orbit-radius" as string]: "0px",
                    }}
                  >
                    <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-slate/80 backdrop-blur-sm border border-cyan-neon/10 flex items-center justify-center text-lg sm:text-xl hover:border-cyan-neon/50 transition-colors cursor-pointer group">
                      <span>{item.icon}</span>
                    </div>
                    <span className="font-mono text-[9px] sm:text-[10px] text-text-muted mt-1 tracking-wider whitespace-nowrap">{item.label}</span>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Tech Tags */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.3 }}>
            <h3 className="font-grotesk text-3xl sm:text-4xl font-bold text-white mb-4">
              {tech.toolsTitle} <span className="gradient-text">{tech.toolsSubtitle}</span>
            </h3>
            <p className="text-text-primary/60 mb-8 leading-relaxed">
              {tech.desc}
            </p>
            <div className="flex flex-wrap gap-3">
              {extraTech.map((tech, i) => (
                <motion.span
                  key={tech}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={isInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.3, delay: 0.4 + i * 0.05 }}
                  className="px-4 py-2 font-mono text-xs tracking-wider rounded-lg border border-text-primary/10 text-text-muted hover:border-cyan-neon/40 hover:text-cyan-neon hover:bg-cyan-neon/5 transition-all duration-300 cursor-default"
                >
                  {tech}
                </motion.span>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
