"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { ExternalLink, Bot, BarChart3, Building2 } from "lucide-react";

const GithubIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
);

const projects = [
  {
    title: "umii",
    subtitle: "E-Commerce Platform",
    description: "Modern clothing e-commerce platform offering a curated selection of apparel with a seamless shopping experience.",
    tags: ["React", "Node.js", "MongoDB", "Express.js"],
    icon: Building2,
    accent: "cyan",
    featured: true,
    link: "https://umii-zvz9.vercel.app/",
  },
  {
    title: "AI Disaster Relief System",
    subtitle: "AI Relief System",
    description: "An advanced platform for disaster prediction and relief coordination, utilizing machine learning algorithms to forecast and manage emergency responses.",
    tags: ["MongoDB", "Express.js", "React", "Node.js"],
    icon: Bot,
    accent: "violet",
    featured: false,
    link: "https://ai-disaster-nu.vercel.app/",
  },
  {
    title: "Umii Shoes",
    subtitle: "Luxury Footwear Store",
    description: "A premium e-commerce storefront for luxury footwear, featuring elegant UI design, smooth animations, and optimized performance.",
    tags: ["React", "Express.js", "MongoDB", "Tailwind CSS"],
    icon: BarChart3,
    accent: "cyan",
    featured: false,
    link: "https://umii-footwear.vercel.app/",
  },
];

function ProjectCard({ project, index, isInView }: { project: typeof projects[0]; index: number; isInView: boolean }) {
  const isCyan = project.accent === "cyan";

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.15 * index }}
      className={`glass-card group cursor-pointer ${project.featured ? "md:col-span-2 md:row-span-2" : ""}`}
    >
      <div className="p-6 sm:p-8 h-full flex flex-col">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div className={`p-3 rounded-lg ${isCyan ? "bg-cyan-neon/10" : "bg-violet-bright/10"}`}>
            <project.icon size={24} className={isCyan ? "text-cyan-neon" : "text-violet-bright"} />
          </div>
          <div className="flex gap-2">
            <button className={`p-2 rounded-lg border transition-all duration-300 ${isCyan ? "border-cyan-neon/10 hover:border-cyan-neon/50 hover:text-cyan-neon" : "border-violet-bright/10 hover:border-violet-bright/50 hover:text-violet-bright"} text-text-muted`}>
              <GithubIcon size={16} />
            </button>
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
    </motion.div>
  );
}

export default function Projects() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="projects" className="relative py-24 sm:py-32" ref={ref}>
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-16">
          <span className="font-mono text-xs text-cyan-neon tracking-widest uppercase">02</span>
          <span className="w-12 h-px bg-cyan-neon/30" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">Projects</span>
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
