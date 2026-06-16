"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Building2, ShoppingBag, ShoppingCart, ShieldAlert, Compass, Globe, LucideIcon } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import TiltCard from "./TiltCard";

interface ProjectItem {
  title: string;
  subtitle: string;
  description: string;
  tags: string[];
  icon: LucideIcon;
  accent: string;
  featured: boolean;
  link: string;
}

function ProjectCard({ project, index, isInView }: { project: ProjectItem; index: number; isInView: boolean }) {
  const isCyan = project.accent === "cyan";
  const glowColor = isCyan ? "rgba(102, 252, 241, 0.12)" : "rgba(168, 85, 247, 0.12)";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 * index }}
      className={`${project.featured ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      <TiltCard
        className="glass-card group cursor-pointer h-full"
        glowColor={glowColor}
        maxTilt={10}
      >
        <div className="p-6 sm:p-8 h-full flex flex-col">
          {/* Header */}
          <div className="flex items-start justify-between mb-6">
            <div className={`p-3 rounded-lg ${isCyan ? "bg-cyan-neon/10" : "bg-violet-bright/10"}`}>
              <project.icon size={24} className={isCyan ? "text-cyan-neon" : "text-violet-bright"} />
            </div>
            <div className="flex gap-2">
              <a href={project.link} target="_blank" rel="noopener noreferrer" className={`p-2 rounded-lg border transition-all duration-300 ${isCyan ? "border-cyan-neon/10 hover:border-cyan-neon/50 hover:text-cyan-neon" : "border-violet-bright/10 hover:border-violet-bright/50 hover:text-violet-bright"} text-text-muted block`}>
                <ExternalLink size={16} />
              </a>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            <p className={`font-mono text-xs tracking-widest uppercase mb-2 ${isCyan ? "text-cyan-neon/60" : "text-violet-bright/60"}`}>
              {project.subtitle}
            </p>
            <h3 className="font-grotesk text-2xl sm:text-3xl font-bold text-white mb-3 group-hover:text-cyan-neon transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-text-primary/60 text-sm leading-relaxed mb-6">
              {project.description}
            </p>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span key={tag} className="px-3 py-1 font-mono text-[10px] tracking-wider uppercase rounded-full border border-text-primary/10 text-text-muted">
                {tag}
              </span>
            ))}
          </div>

          {/* Hover Glow Line */}
          <div className={`absolute bottom-0 left-0 w-full h-px ${isCyan ? "bg-cyan-neon/0 group-hover:bg-cyan-neon/40" : "bg-violet-bright/0 group-hover:bg-violet-bright/40"} transition-all duration-500`} />
        </div>
      </TiltCard>
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const { t } = useLanguage();
  const projTranslations = t("projects");

  const projects: ProjectItem[] = [
    {
      title: "Abdanix Solutions",
      subtitle: projTranslations.abdanix.subtitle,
      description: projTranslations.abdanix.description,
      tags: ["React", "Vite", "Tailwind CSS", "TypeScript"],
      icon: Globe,
      accent: "cyan",
      featured: true,
      link: "https://www.abdanixsolutions.com/",
    },
    {
      title: "Safar Bot",
      subtitle: projTranslations.safarBot.subtitle,
      description: projTranslations.safarBot.description,
      tags: ["MongoDB", "Express.js", "React", "Node.js", "Tailwind CSS"],
      icon: Compass,
      accent: "violet",
      featured: true,
      link: "https://safar-bot.vercel.app/",
    },
    {
      title: "AI Disaster Relief System",
      subtitle: projTranslations.aiDisaster.subtitle,
      description: projTranslations.aiDisaster.description,
      tags: ["MongoDB", "Express.js", "React", "Node.js"],
      icon: ShieldAlert,
      accent: "violet",
      featured: false,
      link: "https://ai-disaster-nu.vercel.app/",
    },
    {
      title: "Margalla Estates",
      subtitle: projTranslations.margallaEstate.subtitle,
      description: projTranslations.margallaEstate.description,
      tags: ["React", "Express.js", "MongoDB", "Tailwind CSS"],
      icon: Building2,
      accent: "cyan",
      featured: false,
      link: "https://margalla-estates.vercel.app/",
    },
    {
      title: "umii",
      subtitle: projTranslations.umii.subtitle,
      description: projTranslations.umii.description,
      tags: ["React", "Node.js", "MongoDB", "Express.js"],
      icon: ShoppingBag,
      accent: "cyan",
      featured: false,
      link: "https://umii-zvz9.vercel.app/",
    },
    {
      title: "Umii Shoes",
      subtitle: projTranslations.umiiShoes.subtitle,
      description: projTranslations.umiiShoes.description,
      tags: ["React", "Express.js", "MongoDB", "Tailwind CSS"],
      icon: ShoppingCart,
      accent: "cyan",
      featured: false,
      link: "https://umii-footwear.vercel.app/",
    },
  ];

  return (
    <section id="projects" className="relative py-24 sm:py-32" ref={ref}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-16">
          <span className="font-mono text-xs text-cyan-neon tracking-widest uppercase">02</span>
          <span className="w-12 h-px bg-cyan-neon/30" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">{projTranslations.sectionTitle}</span>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {projects.map((project, i) => (
            <ProjectCard key={project.title} project={project} index={i} isInView={isInView} />
          ))}
        </div>
      </div>
    </section>
  );
}
