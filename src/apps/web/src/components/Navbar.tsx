import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useTheme } from "@/contexts/ThemeContext";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const { t, i18n } = useTranslation();

  const currentLang = i18n.language?.startsWith("es") ? "es" : "en";
  const otherLang = currentLang === "en" ? "es" : "en";

  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(960px,calc(100vw-2rem))]">
      <nav className="glass rounded-full px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--gradient-crimson) glow-crimson">
            <span className="absolute inset-0 rounded-full bg-background/30 backdrop-blur-sm" />
            <span className="relative font-display text-base">命</span>
          </span>
          <span className="font-display text-lg tracking-wide">{t("nav.brand")}</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            {t("nav.home")}
          </Link>
          <Link to="/quotes" className="hover:text-foreground transition-colors">
            {t("nav.quotes")}
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => i18n.changeLanguage(otherLang)}
            aria-label={t("nav.toggleLanguage")}
            className="glass rounded-full px-2.5 py-2 text-[11px] font-medium tracking-wide text-muted-foreground hover:text-foreground transition-colors"
          >
            {currentLang.toUpperCase()}
          </button>
          <button
            onClick={toggleTheme}
            aria-label={t("nav.toggleTheme")}
            className="glass rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <a
            href="/#subscribe"
            className="rounded-full bg-(--gradient-crimson) px-4 py-1.5 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition"
          >
            {t("nav.subscribe")}
          </a>
        </div>
      </nav>
    </header>
  );
}
