import { useState, useEffect, useCallback, useRef, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import type { QuoteDTO as Quote, MoodDTO as Mood } from "life-goes-on-shared";
import { api } from "@/lib/api";
import { DeleteModal } from "@/components/admin/DeleteModal";

interface QuotesResponse {
  quotes: Quote[];
  total: number;
  page: number;
  limit: number;
}

const LIMIT = 20;

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

// ── QuotesTab ────────────────────────────────────────────────────────────────

export function QuotesTab({
  moods,
  onTotalChange,
}: {
  moods: Mood[];
  onTotalChange: (total: number) => void;
}) {
  const navigate = useNavigate();

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

  const totalPages = Math.ceil(total / LIMIT);

  // Guards against out-of-order responses — e.g. clicking "next page" or
  // typing a new search term before the previous request has resolved.
  const requestId = useRef(0);

  const fetchQuotes = useCallback(
    async (p = page) => {
      const id = ++requestId.current;
      setQuotesLoading(true);
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (filterMood) params.set("mood", filterMood);
      if (search) params.set("search", search);
      const result = await api.get<QuotesResponse>(`/api/v1/admin/quotes?${params}`);
      if (id !== requestId.current) return;
      setQuotesLoading(false);
      if (!result.ok) {
        if (result.message === "Unauthorized") navigate("/admin/login");
        return;
      }
      setQuotes(result.data.quotes);
      setTotal(result.data.total);
      onTotalChange(result.data.total);
    },
    [page, filterMood, search, navigate, onTotalChange],
  );

  useEffect(() => {
    void fetchQuotes(page);
  }, [fetchQuotes, page]);
  useEffect(() => {
    setPage(1);
  }, [filterMood, search]);

  const handleQuoteDeleted = async () => {
    if (!deleteQuoteId) return;
    setDeletingQuote(true);
    const r = await api.delete(`/api/v1/admin/quotes/${deleteQuoteId}`);
    setDeletingQuote(false);
    setDeleteQuoteId(null);
    if (r.ok) {
      setQuotes((p) => p.filter((q) => q._id !== deleteQuoteId));
      setTotal((t) => {
        onTotalChange(t - 1);
        return t - 1;
      });
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

  return (
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
          {/* Native <option> lists render with the OS's own (usually light)
              background, so they need an explicit dark background + light
              text — inheriting from the <select> isn't enough and made the
              closed-but-unselected options unreadable. */}
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
                    <span className="text-[10px] text-muted-foreground">+{q.moods.length - 4}</span>
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

      {/* Delete modal */}
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
    </motion.div>
  );
}
