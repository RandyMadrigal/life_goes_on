import { useState, type FormEvent } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { MoodDTO as Mood } from "life-goes-on-shared";
import { api } from "@/lib/api";
import { DeleteModal } from "@/components/admin/DeleteModal";

const toLabelName = (label: string) =>
  label
    .trim()
    .split(/\s+/)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("");

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

// ── MoodsTab ─────────────────────────────────────────────────────────────────

export function MoodsTab({
  moods,
  moodsLoading,
  onMoodsChange,
}: {
  moods: Mood[];
  moodsLoading: boolean;
  onMoodsChange: (moods: Mood[]) => void;
}) {
  const [editingMood, setEditingMood] = useState<Mood | null>(null);
  const [showAddMood, setShowAddMood] = useState(false);
  const [deleteMoodId, setDeleteMoodId] = useState<string | null>(null);
  const [deletingMood, setDeletingMood] = useState(false);

  const handleMoodDeleted = async () => {
    if (!deleteMoodId) return;
    setDeletingMood(true);
    const r = await api.delete(`/api/v1/admin/moods/${deleteMoodId}`);
    setDeletingMood(false);
    setDeleteMoodId(null);
    if (r.ok) onMoodsChange(moods.filter((m) => m._id !== deleteMoodId));
  };

  const handleMoodSaved = (saved: Mood) => {
    if (editingMood) {
      onMoodsChange(moods.map((m) => (m._id === saved._id ? saved : m)));
      setEditingMood(null);
    } else {
      onMoodsChange([...moods, saved].sort((a, b) => a.order - b.order));
      setShowAddMood(false);
    }
  };

  return (
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

      {/* Delete modal */}
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
    </motion.div>
  );
}
