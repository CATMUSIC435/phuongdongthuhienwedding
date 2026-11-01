"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useWeddingStore } from "@/store/useWeddingStore";

interface ParticleSeed {
  id: number;
  symbol: string;
  leftPercent: number;
  size: number;
  color: string;
  swayAmp: number;
  duration: number;
  delay: number;
  opacityMax: number;
}

const PARTICLE_COLORS = ["#FFE8A4", "#FDCB9C", "#FFF9E6", "#D9463E"];

export function AmbientParticles({
  density = 14,
  variant = "envelope",
}: {
  density?: number;
  variant?: "envelope" | "invitation";
}) {
  const particlesEnabled = useWeddingStore((s) => s.particlesEnabled);
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setMounted(true);
    const handleMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const norm = ((e.clientX / (window.innerWidth || 1)) - 0.5) * 24;
      containerRef.current.style.transform = `translate3d(${norm.toFixed(1)}px, 0, 0)`;
    };
    window.addEventListener("mousemove", handleMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMove);
  }, []);

  const seeds: ParticleSeed[] = useMemo(() => {
    return Array.from({ length: density }, (_, i) => {
      const isSparkle = i % 3 === 0;
      return {
        id: i,
        symbol: isSparkle ? "✦" : "囍",
        leftPercent: ((i * 7.3 + 5) % 92) + 4,
        size: isSparkle ? 11 + (i % 4) * 3 : 13 + (i % 5) * 3.5,
        color: PARTICLE_COLORS[i % PARTICLE_COLORS.length],
        swayAmp: (i % 2 === 0 ? 1 : -1) * (14 + (i % 4) * 7),
        duration: 13 + (i % 6) * 2.4,
        delay: -((i * 1.7) % 12),
        opacityMax: variant === "envelope" ? 0.34 : 0.22,
      };
    });
  }, [density, variant]);

  if (!mounted || !particlesEnabled) return null;

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      style={{
        transition: "transform 450ms cubic-bezier(0.22, 1, 0.36, 1)",
      }}
      className="pointer-events-none fixed inset-0 overflow-hidden z-[5]"
    >
      {seeds.map((s) => (
        <div
          key={s.id}
          style={
            {
              left: `${s.leftPercent}%`,
              bottom: "-36px",
              fontSize: `${s.size}px`,
              color: s.color,
              "--sway-amp": `${s.swayAmp}px`,
              "--max-op": s.opacityMax,
              animation: `songhy-ambient-rise ${s.duration}s ease-in-out ${s.delay}s infinite`,
            } as React.CSSProperties
          }
          className="absolute select-none font-serif drop-shadow-[0_0_8px_rgba(255,232,164,0.35)]"
        >
          {s.symbol}
        </div>
      ))}
    </div>
  );
}
