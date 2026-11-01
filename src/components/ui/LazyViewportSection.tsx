"use client";

import React, { useEffect, useRef, useState } from "react";

interface LazyViewportSectionProps {
  children: React.ReactNode;
  /** Placeholder height to prevent layout shift before section mounts */
  minHeight?: number;
  /** Distance before entering viewport to mount cleanly ahead of scroll */
  rootMargin?: string;
  /** Optional delay (ms) after page open to automatically hydrate in background idle time */
  idleMountDelayMs?: number;
  className?: string;
}

/**
 * Defers mounting heavy or below-the-fold sections until either:
 * 1. The user scrolls within `rootMargin` (e.g., 450px) of the section, OR
 * 2. `idleMountDelayMs` elapses after opening the invitation (staggered background hydration).
 * This guarantees 0ms main-thread stutter when clicking "Mở Thiệp" while ensuring
 * sections are already rendered before the user scrolls to them.
 */
export const LazyViewportSection: React.FC<LazyViewportSectionProps> = ({
  children,
  minHeight = 420,
  rootMargin = "450px 0px",
  idleMountDelayMs,
  className = "",
}) => {
  const [shouldRender, setShouldRender] = useState(false);
  const hostRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (shouldRender) return;

    const el = hostRef.current;
    let observer: IntersectionObserver | null = null;
    let timerId: ReturnType<typeof setTimeout> | null = null;

    if (el && typeof IntersectionObserver !== "undefined") {
      observer = new IntersectionObserver(
        (entries) => {
          if (entries[0]?.isIntersecting) {
            setShouldRender(true);
            observer?.disconnect();
          }
        },
        { rootMargin, threshold: 0.01 }
      );
      observer.observe(el);
    } else {
      setShouldRender(true);
    }

    if (typeof idleMountDelayMs === "number" && idleMountDelayMs > 0) {
      timerId = setTimeout(() => {
        setShouldRender(true);
        observer?.disconnect();
      }, idleMountDelayMs);
    }

    return () => {
      observer?.disconnect();
      if (timerId) clearTimeout(timerId);
    };
  }, [shouldRender, rootMargin, idleMountDelayMs]);

  return (
    <div
      ref={hostRef}
      className={className}
      style={
        shouldRender
          ? undefined
          : {
              minHeight: `${minHeight}px`,
              contentVisibility: "auto",
              containIntrinsicSize: `0 ${minHeight}px`,
            }
      }
    >
      {shouldRender ? children : null}
    </div>
  );
};
