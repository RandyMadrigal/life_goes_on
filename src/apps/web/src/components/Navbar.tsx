import { Link, useNavigate } from "react-router-dom";
import { Sun, Moon } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";
import { moodLabel } from "@/data/moods";

export function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate("/");
  };

  return (
    <header className="fixed top-4 left-1/2 z-50 -translate-x-1/2 w-[min(960px,calc(100vw-2rem))]">
      <nav className="glass rounded-full px-5 py-3 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="relative inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--gradient-crimson)] glow-crimson">
            <span className="absolute inset-0 rounded-full bg-background/30 backdrop-blur-sm" />
            <span className="relative font-display text-base">命</span>
          </span>
          <span className="font-display text-lg tracking-wide">Life Goes On</span>
        </Link>
        <div className="hidden md:flex items-center gap-6 text-sm text-muted-foreground">
          <Link to="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="hover:text-foreground transition-colors">
                Dashboard
              </Link>
              <button onClick={handleLogout} className="hover:text-foreground transition-colors">
                Sign out
              </button>
            </>
          ) : (
            <Link to="/login" className="hover:text-foreground transition-colors">
              Sign in
            </Link>
          )}
        </div>
        <div className="flex items-center gap-2">
          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="glass rounded-full p-2 text-muted-foreground hover:text-foreground transition-colors"
          >
            {theme === "dark" ? <Sun size={14} /> : <Moon size={14} />}
          </button>

          {isAuthenticated && user ? (
            <span className="hidden sm:flex items-center gap-1.5 glass rounded-full px-3 py-1">
              <span className="h-1.5 w-1.5 rounded-full bg-crimson/80 animate-pulse" />
              <span className="text-[11px] tracking-[0.15em] uppercase text-muted-foreground">
                {user.name.split(" ")[0]}
              </span>
              <span className="text-[10px] text-muted-foreground/50">·</span>
              <span className="text-[11px] tracking-widest text-crimson/80">
                {moodLabel(user.mood)}
              </span>
            </span>
          ) : (
            <Link
              to="/register"
              className="rounded-full bg-(--gradient-crimson) px-4 py-1.5 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition"
            >
              Begin
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
