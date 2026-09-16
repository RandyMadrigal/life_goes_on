import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useTranslation } from "react-i18next";
import { Navbar } from "@/components/Navbar";
import { AtmosphericBackdrop } from "@/components/AtmosphericBackdrop";

const SECTION_KEYS = ["collect", "why", "share", "retention", "localStorage"] as const;

export default function Privacy() {
  const { t } = useTranslation();

  return (
    <div className="relative min-h-screen pt-28 pb-20 px-4">
      <Navbar />
      <AtmosphericBackdrop petals={10} />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-10 mx-auto max-w-2xl"
      >
        <p className="text-[10px] tracking-[0.35em] uppercase text-crimson/70">
          {t("privacy.eyebrow")}
        </p>
        <h1 className="mt-3 font-display text-4xl md:text-5xl">{t("privacy.title")}</h1>
        <p className="mt-4 text-sm text-muted-foreground leading-relaxed">{t("privacy.intro")}</p>

        <div className="mt-10 space-y-6">
          {SECTION_KEYS.map((key) => (
            <div key={key} className="glass rounded-2xl p-6 border-l-2 border-crimson/30">
              <h2 className="font-display text-lg text-foreground/90">
                {t(`privacy.sections.${key}.title`)}
              </h2>
              <p className="mt-2 text-sm text-muted-foreground leading-relaxed">
                {t(`privacy.sections.${key}.body`)}
              </p>
            </div>
          ))}
        </div>

        <Link
          to="/"
          className="mt-10 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          {t("privacy.backHome")}
        </Link>
      </motion.div>
    </div>
  );
}
