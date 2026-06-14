export function FogLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      <div
        className="absolute -inset-x-1/4 bottom-0 h-[60vh] opacity-40 blur-3xl"
        style={{
          background:
            "radial-gradient(ellipse at 30% 80%, oklch(0.6 0.18 22 / 0.25), transparent 60%), radial-gradient(ellipse at 70% 90%, oklch(0.4 0.1 250 / 0.35), transparent 60%)",
        }}
      />
      <div className="absolute inset-0 vignette" />
    </div>
  );
}
