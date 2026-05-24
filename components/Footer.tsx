import { Heart } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  const footer = t("footer");
  const authorName = "Umar Farooq";

  return (
    <footer className="relative py-10 border-t border-text-primary/5">
      <div className="section-container flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-text-muted text-sm font-mono">
          <span>© {new Date().getFullYear()}</span>
          <span className="text-cyan-neon">{authorName}</span>
        </div>
        <div className="flex items-center gap-1.5 text-text-muted text-xs font-mono">
          <span>{footer.builtWith}</span>
          <Heart size={12} className="text-red-400 fill-red-400" />
          <span>{footer.mernStack}</span>
        </div>
      </div>
    </footer>
  );
}
