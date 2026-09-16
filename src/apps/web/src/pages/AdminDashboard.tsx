import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence } from "framer-motion";
import type { MoodDTO as Mood, DeliverySummaryDTO } from "life-goes-on-shared";
import { api } from "@/lib/api";
import { setAccessToken } from "@/lib/authToken";
import { QuotesTab } from "./admin/QuotesTab";
import { MoodsTab } from "./admin/MoodsTab";
import { SubscribersTab } from "./admin/SubscribersTab";

type Tab = "quotes" | "moods" | "subscribers";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("quotes");

  // Shared across tabs: moods (used by the quote filter/form and the moods
  // tab itself), and the header's aggregate counts.
  const [moods, setMoods] = useState<Mood[]>([]);
  const [moodsLoading, setMoodsLoading] = useState(true);
  const [quotesTotal, setQuotesTotal] = useState(0);
  const [subscriberTotal, setSubscriberTotal] = useState(0);
  const [deliverySummary, setDeliverySummary] = useState<DeliverySummaryDTO | null>(null);

  useEffect(() => {
    void api.get<DeliverySummaryDTO>("/api/v1/admin/deliveries/today").then((r) => {
      if (r.ok) setDeliverySummary(r.data);
    });
  }, []);

  const fetchMoods = useCallback(async () => {
    setMoodsLoading(true);
    const r = await api.get<{ moods: Mood[] }>("/api/v1/moods");
    setMoodsLoading(false);
    if (r.ok) setMoods(r.data.moods);
    else if (r.message === "Unauthorized") navigate("/admin/login");
  }, [navigate]);

  useEffect(() => {
    void fetchMoods();
  }, [fetchMoods]);

  const handleLogout = async () => {
    await api.post("/api/v1/admin/logout", {});
    setAccessToken(null);
    navigate("/admin/login");
  };

  return (
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 px-4 sm:px-6 py-4 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-(--gradient-crimson) text-base font-display">
            命
          </span>
          <div className="min-w-0">
            <p className="text-sm font-medium text-foreground truncate">Life Goes On — Admin</p>
            <p className="text-xs text-muted-foreground truncate">
              {quotesTotal} frases · {moods.length} estados · {subscriberTotal} suscriptores
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4 shrink-0">
          {deliverySummary && deliverySummary.total > 0 && (
            <div className="hidden sm:flex items-center gap-3 text-xs">
              <span className="text-emerald-400">✓ {deliverySummary.sent} enviados hoy</span>
              {deliverySummary.failed > 0 && (
                <span className="text-red-400">✕ {deliverySummary.failed} fallidos</span>
              )}
            </div>
          )}
          <button
            onClick={handleLogout}
            className="glass rounded-full px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground transition whitespace-nowrap"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="border-b border-white/10 px-4 sm:px-6 flex gap-1 overflow-x-auto">
        {(["quotes", "moods", "subscribers"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm transition border-b-2 -mb-px whitespace-nowrap shrink-0 ${
              tab === t
                ? "border-crimson text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "quotes" ? "Frases" : t === "moods" ? "Estados de ánimo" : "Suscriptores"}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-4xl px-5 sm:px-6 py-8">
        <AnimatePresence mode="wait">
          {tab === "quotes" && <QuotesTab moods={moods} onTotalChange={setQuotesTotal} />}
          {tab === "moods" && (
            <MoodsTab moods={moods} moodsLoading={moodsLoading} onMoodsChange={setMoods} />
          )}
          {tab === "subscribers" && <SubscribersTab onTotalChange={setSubscriberTotal} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
