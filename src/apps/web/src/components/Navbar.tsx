import { Link } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(960px,calc(100vw-2rem))]">
      <nav className="glass rounded-full px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-(--gradient-crimson) glow-crimson">
            <span className="absolute inset-0 rounded-full bg-background/30 backdrop-blur-sm" />
            <span className="relative font-display text-base">命</span>
          </span>
          <span className="font-display text-lg tracking-wide">Life Goes On</span>
        </Link>

        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <Link to="/quotes" className="hover:text-foreground transition-colors">
            Quotes
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="glass rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>
          <a
            href="/#subscribe"
            className="rounded-full bg-(--gradient-crimson) px-4 py-1.5 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition"
          >
            Subscribe
          </a>
        </div>
      </nav>
    </header>
  );
}
