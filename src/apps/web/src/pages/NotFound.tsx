import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import samuraiHero from "@/assets/samurai-hero.jpg";
import { Navbar } from "@/components/Navbar";
import { AtmosphericBackdrop } from "@/components/AtmosphericBackdrop";

export default function NotFound() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen flex items-center justify-center px-4 overflow-hidden">
      <Navbar />

      <div className="absolute inset-0 -z-10">
        <img src={samuraiHero} alt="" className="h-full w-full object-cover opacity-70" />
        <div className="absolute inset-0 bg-linear-to-b from-background/30 via-background/40 to-background" />
      </div>

      <AtmosphericBackdrop petals={22} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 text-center max-w-md"
      >
        <p className="font-display text-sm tracking-[0.4em] uppercase text-white mb-6">
          {t("notFound.eyebrow")}
        </p>
        <h1 className="font-display text-8xl md:text-9xl leading-[1.05] tracking-tight text-glow text-crimson mb-4">
          {t("notFound.title")}
        </h1>
        <p className="text-lg text-white mb-3">{t("notFound.subtitle")}</p>
        <p className="text-sm text-muted-foreground mb-10 leading-relaxed">{t("notFound.body")}</p>
        <Link
          to="/"
          className="group inline-flex items-center gap-2 rounded-full bg-(--gradient-crimson) px-7 py-3.5 text-sm font-medium text-primary-foreground glow-crimson hover:brightness-110 transition"
        >
          {t("notFound.backHome")}
        </Link>
      </motion.div>
    </div>
  );
}
