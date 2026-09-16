import { useState, useEffect, useCallback, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import type { AdminSubscriberDTO as Subscriber } from "life-goes-on-shared";
import { api } from "@/lib/api";

interface SubscribersResponse {
  subscribers: Subscriber[];
  total: number;
  page: number;
  limit: number;
}

const LIMIT = 20;

export function SubscribersTab({ onTotalChange }: { onTotalChange: (total: number) => void }) {
  const navigate = useNavigate();

  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const totalPages = Math.ceil(total / LIMIT);

  // Guards against out-of-order responses — e.g. clicking "next page" or
  // typing a new search term before the previous request has resolved.
  const requestId = useRef(0);

  const fetchSubscribers = useCallback(
    async (p = page) => {
      const id = ++requestId.current;
      setLoading(true);
      const params = new URLSearchParams({ page: String(p), limit: String(LIMIT) });
      if (search) params.set("search", search);
      const result = await api.get<SubscribersResponse>(`/api/v1/admin/subscribers?${params}`);
      if (id !== requestId.current) return;
      setLoading(false);
      if (!result.ok) {
        if (result.message === "Unauthorized") navigate("/admin/login");
        return;
      }
      setSubscribers(result.data.subscribers);
      setTotal(result.data.total);
      onTotalChange(result.data.total);
    },
    [page, search, navigate, onTotalChange],
  );

  useEffect(() => {
    void fetchSubscribers(page);
  }, [fetchSubscribers, page]);
  useEffect(() => {
    setPage(1);
  }, [search]);

  return (
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Buscar por nombre o correo..."
          className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-foreground placeholder:text-muted-foreground/50 focus:outline-none focus:border-crimson/60 transition"
        />
      </div>

      {/* List */}
      {loading ? (
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
                <span className="text-[10px] rounded-full px-2 py-0.5 bg-emerald-500/10 text-emerald-400">
                  Activo
                </span>
                <span className="text-[10px] text-muted-foreground/60">
                  Desde{" "}
                  {new Date(s.subscribedAt).toLocaleDateString("es", {
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
  );
}
