import { motion } from "framer-motion";

export function DeleteModal({
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
