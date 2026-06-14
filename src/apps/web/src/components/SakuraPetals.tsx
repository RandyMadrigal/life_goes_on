import { useMemo } from "react";

interface Props {
  count?: number;
}

export function SakuraPetals({ count = 24 }: Props) {
  const petals = useMemo(
    () =>
      Array.from({ length: count }).map((_, i) => ({
        id: i,
        left: Math.random() * 200,
        delay: Math.random() * 12,
        duration: 12 + Math.random() * 16,
        size: 8 + Math.random() * 10,
        drift: (Math.random() - 0.5) * 200,
        rotate: Math.random() * 360,
        opacity: 0.5 + Math.random() * 0.5,
      })),
    [count],
  );

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {petals.map((p) => (
        <span
          key={p.id}
          className="absolute -top-10 block"
          style={{
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            opacity: p.opacity,
            animation: `petalFall ${p.duration}s linear ${p.delay}s infinite`,
            ["--drift" as never]: `${p.drift}px`,
            ["--rot" as never]: `${p.rotate}deg`,
          }}
        >
          <svg
            viewBox="0 0 20 20"
            className="h-full w-full drop-shadow-[0_0_4px_rgba(255,180,200,0.4)]"
          >
            <path
              d="M10 1 C 13 5, 18 8, 10 19 C 2 8, 7 5, 10 1 Z"
              fill="oklch(0.88 0.1 5)"
              opacity="0.85"
            />
          </svg>
        </span>
      ))}
      <style>{`
        @keyframes petalFall {
          0%   { transform: translate3d(0,-5vh,0) rotate(0deg); }
          100% { transform: translate3d(var(--drift), 110vh, 0) rotate(calc(var(--rot) + 540deg)); }
        }
      `}</style>
    </div>
  );
}
