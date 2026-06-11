"use client";

import { motion, useInView } from "framer-motion";
import { useRef, useState } from "react";
import { Send, Mail } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import Magnetic from "./Magnetic";
import TextReveal from "./TextReveal";

const GithubIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/></svg>
);

const LinkedinIcon = ({ size = 22 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
);

export default function Contact() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formState, setFormState] = useState({ name: "", email: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { t } = useLanguage();
  const contact = t("contact");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormState({ ...formState, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formState),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || 'Failed to send message');
      setSuccess(true);
      setFormState({ name: '', email: '', message: '' });
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : String(err);
      setError(errorMessage || contact.errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const socials = [
    { icon: GithubIcon, label: "GitHub", href: "https://github.com/umarfarooq", color: "hover:text-white" },
    { icon: LinkedinIcon, label: "LinkedIn", href: "https://www.linkedin.com/in/umar-farooq-aa9251378?utm_source=share_via&utm_content=profile&utm_medium=member_android", color: "hover:text-[#0A66C2]" },
    { icon: Mail, label: "Email", href: "mailto:uf126322@gmail.com", color: "hover:text-cyan-neon" },
  ];

  return (
    <section id="contact" className="relative py-24 sm:py-32" ref={ref}>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-cyan-neon/20 to-transparent" />
      <div className="section-container">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={isInView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }} className="flex items-center gap-3 mb-16">
          <span className="font-mono text-xs text-cyan-neon tracking-widest uppercase">04</span>
          <span className="w-12 h-px bg-cyan-neon/30" />
          <span className="font-mono text-xs text-text-muted tracking-widest uppercase">{contact.sectionTitle}</span>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-16">
          {/* Left — Info */}
          <motion.div initial={{ opacity: 0, x: -30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.1 }}>
            <h2 className="font-grotesk text-4xl sm:text-5xl font-bold text-white mb-6">
              <TextReveal text={contact.heading1} type="word" />
              <br />
              <TextReveal text={contact.heading2} type="word" className="gradient-text" />
            </h2>
            <p className="text-text-primary/60 leading-relaxed mb-10 max-w-md">
              {contact.desc}
            </p>
            <div className="flex gap-4">
              {socials.map((s) => (
                <Magnetic key={s.label} range={40} strength={0.3}>
                  <a href={s.href} target="_blank" rel="noopener noreferrer" className={`group p-4 glass-card ${s.color} text-text-muted transition-all duration-300 block`}>
                    <s.icon size={22} />
                  </a>
                </Magnetic>
              ))}
            </div>
          </motion.div>

          {/* Right — Form */}
          <motion.form initial={{ opacity: 0, x: 30 }} animate={isInView ? { opacity: 1, x: 0 } : {}} transition={{ duration: 0.6, delay: 0.2 }} className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label className="block font-mono text-xs text-text-muted mb-2 tracking-wider uppercase">{contact.nameLabel}</label>
              <input type="text" name="name" value={formState.name} onChange={handleChange} className="w-full bg-slate/50 border border-text-primary/10 rounded-lg px-4 py-3 text-white font-grotesk text-sm focus:outline-none focus:border-cyan-neon/50 focus:shadow-[0_0_15px_rgba(102,252,241,0.1)] transition-all duration-300 placeholder:text-text-muted/40" placeholder={contact.namePlaceholder} />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-muted mb-2 tracking-wider uppercase">{contact.emailLabel}</label>
              <input type="email" name="email" value={formState.email} onChange={handleChange} className="w-full bg-slate/50 border border-text-primary/10 rounded-lg px-4 py-3 text-white font-grotesk text-sm focus:outline-none focus:border-cyan-neon/50 focus:shadow-[0_0_15px_rgba(102,252,241,0.1)] transition-all duration-300 placeholder:text-text-muted/40" placeholder={contact.emailPlaceholder} />
            </div>
            <div>
              <label className="block font-mono text-xs text-text-muted mb-2 tracking-wider uppercase">{contact.messageLabel}</label>
              <textarea name="message" value={formState.message} onChange={handleChange} rows={5} className="w-full bg-slate/50 border border-text-primary/10 rounded-lg px-4 py-3 text-white font-grotesk text-sm focus:outline-none focus:border-cyan-neon/50 focus:shadow-[0_0_15px_rgba(102,252,241,0.1)] transition-all duration-300 resize-none placeholder:text-text-muted/40" placeholder={contact.messagePlaceholder} />
            </div>
            {success && <p className="text-sm text-green-400">{contact.successMsg}</p>}
            {error && <p className="text-sm text-red-400">{error}</p>}
            <Magnetic range={50} strength={0.3}>
              <button type="submit" disabled={loading} className="group flex items-center gap-3 px-7 py-3 bg-cyan-neon/10 text-cyan-neon font-grotesk text-sm rounded-lg glow-border hover:bg-cyan-neon/15 transition-all duration-300">
                {loading ? contact.sendingBtn : contact.sendBtn}
                <Send size={16} className="transition-transform group-hover:translate-x-1" />
              </button>
            </Magnetic>
          </motion.form>
        </div>
      </div>
    </section>
  );
}
