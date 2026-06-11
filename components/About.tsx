"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Code2, Layers, Zap, Coffee } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import TiltCard from "./TiltCard";
import TextReveal from "./TextReveal";

export default function About() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();
  const about = t("about");

  const stats = [
    { icon: Code2, value: "7+", label: about.projectsBuilt },
    { icon: Layers, value: "5+", label: about.monthsExp },
    { icon: Zap, value: "15+", label: about.techStack },
    { icon: Coffee, value: "∞", label: about.coffeeCups },
  ];

  return (
    <section id="about" className="relative py-24 sm:py-32" ref={ref}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-16">
          <span className="font-mono text-xs text-cyan-neon tracking-widest uppercase">01</span>
          <span className="w-12 h-px bg-cyan-neon/30" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">{about.sectionTitle}</span>
        </motion.div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          <motion.div initial={{ opacity: 0, y: 30 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }} className="lg:col-span-2 glass-card p-8 sm:p-10">
            <h2 className="font-grotesk text-3xl sm:text-4xl font-bold text-white mb-6">
              <TextReveal text={about.heading1} type="word" />
              <br />
              <TextReveal text={about.heading2} type="word" className="gradient-text-cyan" />
            </h2>
            <div className="space-y-4 text-text-primary/70 leading-relaxed">
              <p>{about.para1}</p>
              <p>{about.para2}</p>
              <p>{about.para3}</p>
            </div>
          </motion.div>
          <div className="grid grid-cols-2 gap-4 sm:gap-6">
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
                className="h-full"
              >
                <TiltCard className="glass-card group h-full" maxTilt={15}>
                  <div className="p-5 sm:p-6 flex flex-col items-center justify-center text-center h-full">
                    <stat.icon size={22} className="text-cyan-neon/60 mb-3 group-hover:text-cyan-neon transition-colors duration-300" />
                    <span className="font-grotesk text-2xl sm:text-3xl font-bold text-white">{stat.value}</span>
                    <span className="font-mono text-[10px] sm:text-xs text-text-muted mt-1 tracking-wider uppercase">{stat.label}</span>
                  </div>
                </TiltCard>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
