"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";

interface TiltOptions {
  maxTilt?: number;
  scale?: number;
}

interface TiltState {
  rotateX: number;
  rotateY: number;
  scale: number;
  shineX: number;
  shineY: number;
  shineOpacity: number;
}

export function useSpringTilt({ maxTilt = 7, scale = 1.02 }: TiltOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const rafRef = useRef<number | null>(null);
  const [tilt, setTilt] = useState<TiltState>({
    rotateX: 0,
    rotateY: 0,
    scale: 1,
    shineX: 50,
    shineY: 50,
    shineOpacity: 0,
  });

  useEffect(() => {
    return () => {
      if (rafRef.current !== null) {
        cancelAnimationFrame(rafRef.current);
      }
    };
  }, []);

  const onMouseMove = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const el = ref.current;
      if (!el || rafRef.current !== null) return;

      const clientX = e.clientX;
      const clientY = e.clientY;

      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = null;
        const targetEl = ref.current;
        if (!targetEl) return;
        const rect = targetEl.getBoundingClientRect();
        if (rect.width <= 0 || rect.height <= 0) return;

        const px = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
        const py = Math.min(1, Math.max(0, (clientY - rect.top) / rect.height));

        const rotateX = Number(((0.5 - py) * maxTilt * 2).toFixed(2));
        const rotateY = Number(((px - 0.5) * maxTilt * 2).toFixed(2));

        setTilt({
          rotateX,
          rotateY,
          scale,
          shineX: Math.round(px * 100),
          shineY: Math.round(py * 100),
          shineOpacity: 0.28,
        });
      });
    },
    [maxTilt, scale]
  );

  const onMouseLeave = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    setTilt({
      rotateX: 0,
      rotateY: 0,
      scale: 1,
      shineX: 50,
      shineY: 50,
      shineOpacity: 0,
    });
  }, []);

  const tiltStyle: React.CSSProperties = {
    transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
    transition: "transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
    transformStyle: "preserve-3d",
  };

  const glareStyle: React.CSSProperties = {
    opacity: tilt.shineOpacity,
    background: `radial-gradient(circle at ${tilt.shineX}% ${tilt.shineY}%, rgba(255, 232, 164, 0.4), transparent 60%)`,
    transition: "opacity 260ms ease-out",
  };

  return {
    ref,
    tilt,
    tiltStyle,
    glareStyle,
    bind: {
      onMouseMove,
      onMouseLeave,
    },
  };
}
