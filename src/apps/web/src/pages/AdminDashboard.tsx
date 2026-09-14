import { useState, useEffect, useCallback, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type {
  QuoteDTO as Quote,
  MoodDTO as Mood,
  AdminSubscriberDTO as Subscriber,
  DeliverySummaryDTO,
} from "life-goes-on-shared";
import { api } from "@/lib/api";
import { setAccessToken } from "@/lib/authToken";

// ── Types ─────────────────────────────────────────────────────────────────────

interface QuotesResponse {
  quotes: Quote[];
  total: number;
  page: number;
  limit: number;
}

interface SubscribersResponse {
  subscribers: Subscriber[];
  total: number;
  page: number;
  limit: number;
}

const LIMIT = 20;

// ── Helpers ───────────────────────────────────────────────────────────────────

const toLabelName = (label: string) =>
  label
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

// ── QuoteForm ──────────────────────────────────────────────────────────────────

function QuoteForm({
  initial,
  moods,
  onSave,
  onCancel,
}: {
  initial?: Quote;
  moods: Mood[];
  onSave: (q: Quote) => void;
  onCancel: () => void;
}) {
  const [text, setText] = useState(initial?.text ?? "");
  const [selected, setSelected] = useState<string[]>(initial?.moods ?? []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const toggle = (name: string) =>
    setSelected((prev) => (prev.includes(name) ? prev.filter((m) => m !== name) : [...prev, name]));

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !selected.length) {
      setError("El texto y al menos un estado de ánimo son requeridos.");
      return;
    }
    setLoading(true);
    setError("");
    const result = initial
      ? await api.put<{ quote: Quote }>(`/api/v1/admin/quotes/${initial._id}`, {
          text,
          moods: selected,
        })
      : await api.post<{ quote: Quote }>("/api/v1/admin/quotes", { text, moods: selected });
    setLoading(false);
    if (initial) {
      // Editing: on failure, revert to the original values instead of
      // wiping the edit — losing your place in a long quote is worse than
      // just seeing the error and trying again.
      setText(initial.text);
      setSelected(initial.moods);
    } else {
      setText("");
      setSelected([]);
    }
    if (result.ok) onSave(result.data.quote);
    else setError(result.message);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="glass rounded-2xl p-6 mb-6 space-y-5"
    >
      <h3 className="text-sm font-medium">{initial ? "Editar frase" : "Nueva frase"}</h3>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground uppercase tracking-widest">Texto</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="Escribe la frase motivadora..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-crimson/60 transition resize-none"
        />
      </div>

      <div className="space-y-2">
        <label className="text-xs text-muted-foreground uppercase tracking-widest">
          Estados de ánimo ({selected.length} seleccionados)
        </label>
        <div className="flex flex-wrap gap-2 max-h-44 overflow-y-auto pr-1">
          {moods.map((m) => (
            <button
              key={m.name}
              type="button"
              onClick={() => toggle(m.name)}
              className={`rounded-full px-3 py-1 text-xs transition ${
                selected.includes(m.name)
                  ? "bg-(--gradient-crimson) text-primary-foreground"
                  : "glass text-muted-foreground hover:text-foreground"
              }`}
            >
              {m.label}
            </button>
          ))}
        </div>
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-(--gradient-crimson) px-5 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="glass rounded-lg px-5 py-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          Cancelar
        </button>
      </div>
    </motion.form>
  );
}

// ── MoodForm ──────────────────────────────────────────────────────────────────

function MoodForm({
  initial,
  onSave,
  onCancel,
}: {
  initial?: Mood;
  onSave: (m: Mood) => void;
  onCancel: () => void;
}) {
  const [label, setLabel] = useState(initial?.label ?? "");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const preview = initial ? initial.name : toLabelName(label);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!label.trim()) {
      setError("El nombre visible es requerido.");
      return;
    }
    setLoading(true);
    setError("");
    const result = initial
      ? await api.put<{ mood: Mood }>(`/api/v1/admin/moods/${initial._id}`, { label })
      : await api.post<{ mood: Mood }>("/api/v1/admin/moods", { label, name: toLabelName(label) });
    setLoading(false);
    // Editing: on failure, revert to the original label instead of wiping it.
    setLabel(initial ? initial.label : "");
    if (result.ok) onSave(result.data.mood);
    else setError(result.message);
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.25 }}
      className="glass rounded-2xl p-6 mb-6 space-y-4"
    >
      <h3 className="text-sm font-medium">{initial ? "Editar estado" : "Nuevo estado de ánimo"}</h3>

      <div className="space-y-1">
        <label className="text-xs text-muted-foreground uppercase tracking-widest">
          Nombre visible
        </label>
        <input
          type="text"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          placeholder="ej: Abrumado"
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-crimson/60 transition"
        />
        {preview && (
          <p className="text-[11px] text-muted-foreground/60 mt-1">
            Clave interna: <span className="font-mono text-muted-foreground">{preview}</span>
            {initial && <span className="ml-2 text-muted-foreground/40">(no editable)</span>}
          </p>
        )}
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded-lg bg-(--gradient-crimson) px-5 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed transition"
        >
          {loading ? "Guardando..." : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="glass rounded-lg px-5 py-2 text-sm text-muted-foreground hover:text-foreground transition"
        >
          Cancelar
        </button>
      </div>
    </motion.form>
  );
}

// ── AdminDashboard ─────────────────────────────────────────────────────────────

type Tab = "quotes" | "moods" | "subscribers";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("quotes");

  // ── Quotes state ──────────────────────────────────────────────────────────
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [filterMood, setFilterMood] = useState("");
  const [quotesLoading, setQuotesLoading] = useState(true);
  const [editingQuote, setEditingQuote] = useState<Quote | null>(null);
  const [showAddQuote, setShowAddQuote] = useState(false);
  const [deleteQuoteId, setDeleteQuoteId] = useState<string | null>(null);
  const [deletingQuote, setDeletingQuote] = useState(false);

  // ── Moods state ───────────────────────────────────────────────────────────
  const [moods, setMoods] = useState<Mood[]>([]);
  const [moodsLoading, setMoodsLoading] = useState(true);
  const [editingMood, setEditingMood] = useState<Mood | null>(null);
  const [showAddMood, setShowAddMood] = useState(false);
  const [deleteMoodId, setDeleteMoodId] = useState<string | null>(null);
  const [deletingMood, setDeletingMood] = useState(false);

  // ── Subscribers state ─────────────────────────────────────────────────────
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [subscriberTotal, setSubscriberTotal] = useState(0);
  const [subscriberPage, setSubscriberPage] = useState(1);
  const [subscriberSearch, setSubscriberSearch] = useState("");
  const [subscribersLoading, setSubscribersLoading] = useState(true);

  // ── Delivery summary state ────────────────────────────────────────────────
  const [deliverySummary, setDeliverySummary] = useState<DeliverySummaryDTO | null>(null);

  const totalPages = Math.ceil(total / LIMIT);
  const subscriberTotalPages = Math.ceil(subscriberTotal / LIMIT);

  // ── Fetch today's delivery summary ───────────────────────────────────────
  useEffect(() => {
    void api.get<DeliverySummaryDTO>("/api/v1/admin/deliveries/today").then((r) => {
      if (r.ok) setDeliverySummary(r.data);
    });
  }, []);

  // ── Fetch moods ───────────────────────────────────────────────────────────
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

  // ── Fetch quotes ──────────────────────────────────────────────────────────
  const fetchQuotes = useCallback(
    async (p = page) => {
      setQuotesLoading(true);
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (filterMood) params.set("mood", filterMood);
      if (search) params.set("search", search);
      const result = await api.get<QuotesResponse>(`/api/v1/admin/quotes?${params}`);
      setQuotesLoading(false);
      if (!result.ok) {
        if (result.message === "Unauthorized") navigate("/admin/login");
        return;
      }
      setQuotes(result.data.quotes);
      setTotal(result.data.total);
    },
    [page, filterMood, search, navigate],
  );

  useEffect(() => {
    void fetchQuotes(page);
  }, [fetchQuotes, page]);
  useEffect(() => {
    setPage(1);
  }, [filterMood, search]);

  // ── Fetch subscribers ─────────────────────────────────────────────────────
  const fetchSubscribers = useCallback(
    async (p = subscriberPage) => {
      setSubscribersLoading(true);
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (subscriberSearch) params.set("search", subscriberSearch);
      const result = await api.get<SubscribersResponse>(`/api/v1/admin/subscribers?${params}`);
      setSubscribersLoading(false);
      if (!result.ok) {
        if (result.message === "Unauthorized") navigate("/admin/login");
        return;
      }
      setSubscribers(result.data.subscribers);
      setSubscriberTotal(result.data.total);
    },
    [subscriberPage, subscriberSearch, navigate],
  );

  useEffect(() => {
    void fetchSubscribers(subscriberPage);
  }, [fetchSubscribers, subscriberPage]);
  useEffect(() => {
    setSubscriberPage(1);
  }, [subscriberSearch]);

  // ── Logout ────────────────────────────────────────────────────────────────
  const handleLogout = async () => {
    await api.post("/api/v1/admin/logout", {});
    setAccessToken(null);
    navigate("/admin/login");
  };

  // ── Quote actions ─────────────────────────────────────────────────────────
  const handleQuoteDeleted = async () => {
    if (!deleteQuoteId) return;
    setDeletingQuote(true);
    const r = await api.delete(`/api/v1/admin/quotes/${deleteQuoteId}`);
    setDeletingQuote(false);
    setDeleteQuoteId(null);
    if (r.ok) {
      setQuotes((p) => p.filter((q) => q._id !== deleteQuoteId));
      setTotal((t) => t - 1);
    }
  };

  const handleQuoteSaved = (updated: Quote) => {
    if (editingQuote) {
      setQuotes((p) => p.map((q) => (q._id === updated._id ? updated : q)));
      setEditingQuote(null);
    } else {
      setShowAddQuote(false);
      void fetchQuotes(1);
      setPage(1);
    }
  };

  // ── Mood actions ──────────────────────────────────────────────────────────
  const handleMoodDeleted = async () => {
    if (!deleteMoodId) return;
    setDeletingMood(true);
    const r = await api.delete(`/api/v1/admin/moods/${deleteMoodId}`);
    setDeletingMood(false);
    setDeleteMoodId(null);
    if (r.ok) setMoods((p) => p.filter((m) => m._id !== deleteMoodId));
  };

  const handleMoodSaved = (saved: Mood) => {
    if (editingMood) {
      setMoods((p) => p.map((m) => (m._id === saved._id ? saved : m)));
      setEditingMood(null);
    } else {
      setMoods((p) => [...p, saved].sort((a, b) => a.order - b.order));
      setShowAddMood(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* ── Header ──────────────────────────────────────────────────────────── */}
      <header className="border-b border-white/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-(--gradient-crimson) text-base font-display">
            命
          </span>
          <div>
            <p className="text-sm font-medium text-foreground">Life Goes On — Admin</p>
            <p className="text-xs text-muted-foreground">
              {total} frases · {moods.length} estados · {subscriberTotal} suscriptores
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
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
            className="glass rounded-full px-4 py-1.5 text-xs text-muted-foreground hover:text-foreground transition"
          >
            Cerrar sesión
          </button>
        </div>
      </header>

      {/* ── Tabs ────────────────────────────────────────────────────────────── */}
      <div className="border-b border-white/10 px-6 flex gap-1">
        {(["quotes", "moods", "subscribers"] as Tab[]).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-3 text-sm transition border-b-2 -mb-px ${
              tab === t
                ? "border-crimson text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            {t === "quotes" ? "Frases" : t === "moods" ? "Estados de ánimo" : "Suscriptores"}
          </button>
        ))}
      </div>

      <div className="mx-auto max-w-4xl px-4 py-8">
        <AnimatePresence mode="wait">
          {/* ══ QUOTES TAB ══════════════════════════════════════════════════ */}
          {tab === "quotes" && (
            <motion.div
              key="quotes"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Controls */}
              <div className="flex flex-col sm:flex-row gap-3 mb-6">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Buscar frases..."
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-crimson/60 transition"
                />
                <select
                  value={filterMood}
                  onChange={(e) => setFilterMood(e.target.value)}
                  className="bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground focus:outline-none focus:border-crimson/60 transition"
                >
                  {/* Native <option> lists render with the OS's own (usually
                      light) background, so they need an explicit dark
                      background + light text — inheriting from the <select>
                      isn't enough and made the closed-but-unselected options
                      unreadable (light text on a white dropdown). */}
                  <option value="" className="bg-[#12171a] text-foreground">
                    Todos los estados
                  </option>
                  {moods.map((m) => (
                    <option key={m.name} value={m.name} className="bg-[#12171a] text-foreground">
                      {m.label}
                    </option>
                  ))}
                </select>
                <button
                  onClick={() => {
                    setShowAddQuote(true);
                    setEditingQuote(null);
                  }}
                  className="rounded-lg bg-(--gradient-crimson) px-5 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition whitespace-nowrap"
                >
                  + Nueva frase
                </button>
              </div>

              {/* Add / Edit form */}
              <AnimatePresence>
                {(showAddQuote || editingQuote) && (
                  <QuoteForm
                    key={editingQuote?._id ?? "new-quote"}
                    initial={editingQuote ?? undefined}
                    moods={moods}
                    onSave={handleQuoteSaved}
                    onCancel={() => {
                      setShowAddQuote(false);
                      setEditingQuote(null);
                    }}
                  />
                )}
              </AnimatePresence>

              {/* List */}
              {quotesLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass rounded-xl p-4 animate-pulse">
                      <div className="h-3 bg-white/10 rounded w-3/4 mb-2" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : quotes.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground text-sm">
                  No se encontraron frases.
                </div>
              ) : (
                <div className="space-y-3">
                  {quotes.map((q) => (
                    <motion.div
                      key={q._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className={`glass rounded-xl p-4 border-l-2 transition ${
                        editingQuote?._id === q._id ? "border-crimson/60" : "border-white/10"
                      }`}
                    >
                      <p className="text-sm text-foreground/90 mb-2 line-clamp-2">{q.text}</p>
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex flex-wrap gap-1">
                          {q.moods.slice(0, 4).map((m) => (
                            <span
                              key={m}
                              className="text-[10px] rounded-full px-2 py-0.5 bg-white/8 text-muted-foreground"
                            >
                              {m}
                            </span>
                          ))}
                          {q.moods.length > 4 && (
                            <span className="text-[10px] text-muted-foreground">
                              +{q.moods.length - 4}
                            </span>
                          )}
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button
                            onClick={() => {
                              setEditingQuote(q);
                              setShowAddQuote(false);
                            }}
                            className="text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 glass rounded-lg"
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => setDeleteQuoteId(q._id)}
                            className="text-xs text-red-400/70 hover:text-red-400 transition px-2 py-1 glass rounded-lg"
                          >
                            Borrar
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="glass rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    ← Anterior
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page === totalPages}
                    className="glass rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ══ MOODS TAB ═══════════════════════════════════════════════════ */}
          {tab === "moods" && (
            <motion.div
              key="moods"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex justify-between items-center mb-6">
                <p className="text-xs text-muted-foreground">{moods.length} estados de ánimo</p>
                <button
                  onClick={() => {
                    setShowAddMood(true);
                    setEditingMood(null);
                  }}
                  className="rounded-lg bg-(--gradient-crimson) px-5 py-2 text-sm font-medium text-primary-foreground hover:brightness-110 transition"
                >
                  + Nuevo estado
                </button>
              </div>

              {/* Add / Edit form */}
              <AnimatePresence>
                {(showAddMood || editingMood) && (
                  <MoodForm
                    key={editingMood?._id ?? "new-mood"}
                    initial={editingMood ?? undefined}
                    onSave={handleMoodSaved}
                    onCancel={() => {
                      setShowAddMood(false);
                      setEditingMood(null);
                    }}
                  />
                )}
              </AnimatePresence>

              {/* List */}
              {moodsLoading ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div key={i} className="glass rounded-xl p-4 animate-pulse h-16" />
                  ))}
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {moods.map((m) => (
                    <motion.div
                      key={m._id}
                      layout
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`glass rounded-xl p-4 border transition ${
                        editingMood?._id === m._id ? "border-crimson/60" : "border-white/8"
                      }`}
                    >
                      <p className="text-sm text-foreground font-medium truncate">{m.label}</p>
                      <p className="text-[11px] font-mono text-muted-foreground/60 truncate mt-0.5">
                        {m.name}
                      </p>
                      <div className="flex gap-2 mt-3">
                        <button
                          onClick={() => {
                            setEditingMood(m);
                            setShowAddMood(false);
                          }}
                          className="text-xs text-muted-foreground hover:text-foreground transition px-2 py-1 glass rounded-lg"
                        >
                          Editar
                        </button>
                        <button
                          onClick={() => setDeleteMoodId(m._id)}
                          className="text-xs text-red-400/70 hover:text-red-400 transition px-2 py-1 glass rounded-lg"
                        >
                          Borrar
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* ══ SUBSCRIBERS TAB ═════════════════════════════════════════════ */}
          {tab === "subscribers" && (
            <motion.div
              key="subscribers"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              {/* Controls */}
              <div className="mb-6">
                <input
                  type="text"
                  value={subscriberSearch}
                  onChange={(e) => setSubscriberSearch(e.target.value)}
                  placeholder="Buscar por nombre o correo..."
                  className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-crimson/60 transition"
                />
              </div>

              {/* List */}
              {subscribersLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <div key={i} className="glass rounded-xl p-4 animate-pulse">
                      <div className="h-3 bg-white/10 rounded w-1/3 mb-2" />
                      <div className="h-3 bg-white/10 rounded w-1/2" />
                    </div>
                  ))}
                </div>
              ) : subscribers.length === 0 ? (
                <div className="text-center py-20 text-muted-foreground text-sm">
                  No se encontraron suscriptores.
                </div>
              ) : (
                <div className="space-y-3">
                  {subscribers.map((s) => (
                    <motion.div
                      key={s._id}
                      layout
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      className="glass rounded-xl p-4 border-l-2 border-white/10 flex items-center justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <p className="text-sm text-foreground/90 truncate">{s.name}</p>
                        <p className="text-xs text-muted-foreground truncate">{s.email}</p>
                      </div>
                      <div className="flex flex-col items-end gap-1 shrink-0">
                        <span
                          className={`text-[10px] rounded-full px-2 py-0.5 ${
                            s.active
                              ? "bg-emerald-500/10 text-emerald-400"
                              : "bg-white/8 text-muted-foreground"
                          }`}
                        >
                          {s.active ? "Activo" : "Dado de baja"}
                        </span>
                        <span className="text-[10px] text-muted-foreground/60">
                          {s.active ? "Desde " : "Baja "}
                          {new Date(
                            s.active ? s.subscribedAt : (s.unsubscribedAt ?? s.subscribedAt),
                          ).toLocaleDateString("es", {
                            day: "2-digit",
                            month: "short",
                            year: "numeric",
                          })}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}

              {/* Pagination */}
              {subscriberTotalPages > 1 && (
                <div className="mt-8 flex items-center justify-center gap-4">
                  <button
                    onClick={() => setSubscriberPage((p) => Math.max(1, p - 1))}
                    disabled={subscriberPage === 1}
                    className="glass rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    ← Anterior
                  </button>
                  <span className="text-xs text-muted-foreground">
                    {subscriberPage} / {subscriberTotalPages}
                  </span>
                  <button
                    onClick={() => setSubscriberPage((p) => Math.min(subscriberTotalPages, p + 1))}
                    disabled={subscriberPage === subscriberTotalPages}
                    className="glass rounded-full px-4 py-1.5 text-sm text-muted-foreground hover:text-foreground disabled:opacity-30 disabled:cursor-not-allowed transition"
                  >
                    Siguiente →
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ── Delete Quote modal ───────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteQuoteId && (
          <DeleteModal
            message="¿Borrar esta frase?"
            loading={deletingQuote}
            onConfirm={handleQuoteDeleted}
            onCancel={() => setDeleteQuoteId(null)}
          />
        )}
      </AnimatePresence>

      {/* ── Delete Mood modal ────────────────────────────────────────────────── */}
      <AnimatePresence>
        {deleteMoodId && (
          <DeleteModal
            message="¿Borrar este estado de ánimo?"
            note="Las frases que lo usen no serán eliminadas, pero dejarán de aparecer en este filtro."
            loading={deletingMood}
            onConfirm={handleMoodDeleted}
            onCancel={() => setDeleteMoodId(null)}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ── DeleteModal ───────────────────────────────────────────────────────────────

function DeleteModal({
  message,
  note,
  loading,
  onConfirm,
  onCancel,
}: {
  message: string;
  note?: string;
  loading: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
      onClick={onCancel}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="glass rounded-2xl p-8 max-w-sm w-full text-center"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="text-sm text-foreground mb-1">{message}</p>
        {note && <p className="text-xs text-muted-foreground/70 mb-1">{note}</p>}
        <p className="text-xs text-muted-foreground mb-6">Esta acción no se puede deshacer.</p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="rounded-lg bg-red-500/80 hover:bg-red-500 px-5 py-2 text-sm font-medium text-white transition disabled:opacity-50"
          >
            {loading ? "Borrando..." : "Sí, borrar"}
          </button>
          <button
            onClick={onCancel}
            className="glass rounded-lg px-5 py-2 text-sm text-muted-foreground hover:text-foreground transition"
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}
