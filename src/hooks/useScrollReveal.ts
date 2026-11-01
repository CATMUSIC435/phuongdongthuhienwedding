"use client";

import React, { useEffect, useRef, useState } from "react";

interface ScrollRevealOptions {
  delay?: number;
  yOffset?: number;
  scaleFrom?: number;
  threshold?: number;
  once?: boolean;
}

export function useScrollReveal({
  delay = 0,
  yOffset = 32,
  scaleFrom = 0.97,
  threshold = 0.12,
  once = true,
}: ScrollRevealOptions = {}) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once, threshold]);

  const spring: React.CSSProperties = {
    opacity: inView ? 1 : 0,
    transform: inView
      ? "translate3d(0, 0px, 0) scale(1)"
      : `translate3d(0, ${yOffset}px, 0) scale(${scaleFrom})`,
    transition: `opacity 680ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms, transform 680ms cubic-bezier(0.22, 1, 0.36, 1) ${delay}ms`,
    willChange: "opacity, transform",
  };

  return { ref, spring, inView };
}
