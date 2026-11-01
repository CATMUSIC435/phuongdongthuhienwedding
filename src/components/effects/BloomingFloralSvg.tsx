"use client";

import React, { useEffect, useId, useRef, useState } from "react";

interface BloomingFloralSvgProps {
  /**
   * "garland": 3-flower royal Peony & Peach Blossom arch/header ornament
   * "crest": Single-flower symmetrical section divider with scrolling vines
   * "corner": Corner botanical branch with blooming flower & buds
   */
  variant?: "garland" | "crest" | "corner";
  /**
   * "gold": Radiant champagne gold + ruby accents (best on dark red backgrounds)
   * "crimson": Deep royal crimson + antique gold accents (best on cream paper cards)
   */
  palette?: "gold" | "crimson";
  className?: string;
  flipX?: boolean;
  flipY?: boolean;
  autoBloom?: boolean;
}

const OUTER_ANGLES_8 = [0, 45, 90, 135, 180, 225, 270, 315];
const MID_ANGLES_8 = [22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5];
const INNER_ANGLES_6 = [0, 60, 120, 180, 240, 300];
const SIDE_ANGLES_5 = [0, 72, 144, 216, 288];

export const BloomingFloralSvg: React.FC<BloomingFloralSvgProps> = ({
  variant = "crest",
  palette = "gold",
  className = "",
  flipX = false,
  flipY = false,
  autoBloom = false,
}) => {
  const uid = useId().replace(/:/g, "");
  const containerRef = useRef<HTMLDivElement>(null);
  const [isBloomed, setIsBloomed] = useState(autoBloom);

  useEffect(() => {
    if (autoBloom) {
      setIsBloomed(true);
      return;
    }
    const el = containerRef.current;
    if (!el || typeof IntersectionObserver === "undefined") {
      setIsBloomed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setIsBloomed(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -20px 0px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [autoBloom]);

  const outerGradId = `outer-petal-${uid}`;
  const midGradId = `mid-petal-${uid}`;
  const innerGradId = `inner-petal-${uid}`;
  const goldGradId = `gold-stem-${uid}`;
  const coreGradId = `core-glow-${uid}`;

  const isCrimson = palette === "crimson";

  // Helper to render a multi-layered blooming Oriental Peony / Lotus at (cx, cy)
  const renderBloomingFlower = (
    cx: number,
    cy: number,
    scale: number = 1,
    baseDelayMs: number = 0,
    isFivePetal: boolean = false
  ) => {
    const outerAngles = isFivePetal ? SIDE_ANGLES_5 : OUTER_ANGLES_8;
    const midAngles = isFivePetal ? [36, 108, 180, 252, 324] : MID_ANGLES_8;

    return (
      <g transform={`translate(${cx}, ${cy}) scale(${scale})`}>
        {/* Continuous gentle breathing after bloom */}
        <g
          style={
            isBloomed
              ? {
                  animation: `songhy-flower-breathe 5.6s ease-in-out ${baseDelayMs + 1100}ms infinite`,
                }
              : { opacity: 0 }
          }
        >
          {/* Layer 1: Outer Petals */}
          <g
            style={{
              transformOrigin: "0px 0px",
              opacity: isBloomed ? 1 : 0,
              animation: isBloomed
                ? `songhy-petal-unfurl 950ms cubic-bezier(0.22, 1, 0.36, 1) ${baseDelayMs}ms both`
                : "none",
            }}
          >
            {outerAngles.map((deg) => (
              <path
                key={`outer-${deg}`}
                d="M 0,0 C -8.5,-9 -11.5,-21 0,-29 C 11.5,-21 8.5,-9 0,0 Z"
                fill={`url(#${outerGradId})`}
                stroke={`url(#${goldGradId})`}
                strokeWidth="0.75"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>

          {/* Layer 2: Middle Velvet Petals */}
          <g
            style={{
              transformOrigin: "0px 0px",
              opacity: isBloomed ? 1 : 0,
              animation: isBloomed
                ? `songhy-petal-unfurl 950ms cubic-bezier(0.22, 1, 0.36, 1) ${baseDelayMs + 160}ms both`
                : "none",
            }}
          >
            {midAngles.map((deg) => (
              <path
                key={`mid-${deg}`}
                d="M 0,0 C -6.5,-7 -8.5,-16 0,-22 C 8.5,-16 6.5,-7 0,0 Z"
                fill={`url(#${midGradId})`}
                stroke={`url(#${goldGradId})`}
                strokeWidth="0.65"
                transform={`rotate(${deg})`}
              />
            ))}
          </g>

          {/* Layer 3: Inner Silk Petals */}
          {!isFivePetal && (
            <g
              style={{
                transformOrigin: "0px 0px",
                opacity: isBloomed ? 1 : 0,
                animation: isBloomed
                  ? `songhy-petal-unfurl 900ms cubic-bezier(0.22, 1, 0.36, 1) ${baseDelayMs + 310}ms both`
                  : "none",
              }}
            >
              {INNER_ANGLES_6.map((deg) => (
                <path
                  key={`inner-${deg}`}
                  d="M 0,0 C -4.8,-5 -6,-11.5 0,-15.5 C 6,-11.5 4.8,-5 0,0 Z"
                  fill={`url(#${innerGradId})`}
                  stroke={`url(#${goldGradId})`}
                  strokeWidth="0.55"
                  transform={`rotate(${deg})`}
                />
              ))}
            </g>
          )}

          {/* Layer 4: Golden Stamen Ring & Pearl Core */}
          <g
            style={{
              transformOrigin: "0px 0px",
              opacity: isBloomed ? 1 : 0,
              animation: isBloomed
                ? `songhy-petal-unfurl 800ms cubic-bezier(0.22, 1, 0.36, 1) ${baseDelayMs + 440}ms both`
                : "none",
            }}
          >
            {OUTER_ANGLES_8.map((deg) => (
              <g key={`stamen-${deg}`} transform={`rotate(${deg})`}>
                <line
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="-7.5"
                  stroke={`url(#${goldGradId})`}
                  strokeWidth="0.7"
                />
                <circle cx="0" cy="-8" r="1.15" fill="#fff6d1" />
              </g>
            ))}
            <circle
              cx="0"
              cy="0"
              r="3.8"
              fill={`url(#${coreGradId})`}
              stroke="#fff6d1"
              strokeWidth="0.6"
            />
          </g>
        </g>
      </g>
    );
  };

  // Helper to render a sprouting golden/crimson leaf at (x, y, rotation, scale, delayMs)
  const renderLeaf = (
    x: number,
    y: number,
    rot: number,
    scale: number,
    delayMs: number
  ) => (
    <g transform={`translate(${x}, ${y}) rotate(${rot}) scale(${scale})`}>
      <path
        d="M 0,0 C -4.5,-5 -4.5,-13 0,-18 C 4.5,-13 4.5,-5 0,0 Z M 0,-2 L 0,-14"
        fill={`url(#${goldGradId})`}
        fillOpacity={isCrimson ? 0.72 : 0.85}
        stroke={`url(#${goldGradId})`}
        strokeWidth="0.6"
        style={{
          transformOrigin: "0px 0px",
          opacity: isBloomed ? 1 : 0,
          animation: isBloomed
            ? `songhy-leaf-sprout 750ms cubic-bezier(0.22, 1, 0.36, 1) ${delayMs}ms both`
            : "none",
        }}
      />
    </g>
  );

  const transformStyle =
    flipX || flipY
      ? `scale(${flipX ? -1 : 1}, ${flipY ? -1 : 1})`
      : undefined;

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none select-none flex items-center justify-center ${className}`}
      style={{ transform: transformStyle }}
      aria-hidden="true"
    >
      {variant === "garland" && (
        <svg
          viewBox="0 0 360 94"
          className="w-full max-w-[330px] h-auto overflow-visible"
          fill="none"
        >
          <defs>
            <radialGradient id={outerGradId} cx="50%" cy="75%" r="75%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#7a0600" : "#b8141c"}
              />
              <stop
                offset="65%"
                stopColor={isCrimson ? "#c91e27" : "#e33942"}
              />
              <stop
                offset="100%"
                stopColor={isCrimson ? "#f5c281" : "#ffe6a3"}
              />
            </radialGradient>
            <radialGradient id={midGradId} cx="50%" cy="75%" r="75%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#960b04" : "#cf1b24"}
              />
              <stop
                offset="70%"
                stopColor={isCrimson ? "#e04850" : "#f77e84"}
              />
              <stop offset="100%" stopColor="#fff1c7" />
            </radialGradient>
            <radialGradient id={innerGradId} cx="50%" cy="80%" r="80%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#b81820" : "#e63b44"}
              />
              <stop offset="60%" stopColor="#f7b97c" />
              <stop offset="100%" stopColor="#fff9e6" />
            </radialGradient>
            <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#9c6b19" : "#d4af37"}
              />
              <stop
                offset="50%"
                stopColor={isCrimson ? "#d4af37" : "#fff1be"}
              />
              <stop
                offset="100%"
                stopColor={isCrimson ? "#8a5a10" : "#c5982c"}
              />
            </linearGradient>
            <radialGradient id={coreGradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffdf2" />
              <stop offset="60%" stopColor="#f5c542" />
              <stop offset="100%" stopColor="#b07908" />
            </radialGradient>
          </defs>

          {/* Left & Right Self-Drawing Golden Botanical Vines */}
          <path
            d="M 180,48 C 142,48 124,26 92,34 C 62,42 44,64 14,50"
            stroke={`url(#${goldGradId})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="240"
            style={{
              strokeDashoffset: isBloomed ? 0 : 240,
              animation: isBloomed
                ? "songhy-vine-grow 1200ms cubic-bezier(0.22, 1, 0.36, 1) 60ms both"
                : "none",
            }}
          />
          <path
            d="M 180,48 C 218,48 236,26 268,34 C 298,42 316,64 346,50"
            stroke={`url(#${goldGradId})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="240"
            style={{
              strokeDashoffset: isBloomed ? 0 : 240,
              animation: isBloomed
                ? "songhy-vine-grow 1200ms cubic-bezier(0.22, 1, 0.36, 1) 60ms both"
                : "none",
            }}
          />

          {/* Secondary Delicate Scroll Tendrils */}
          <path
            d="M 135,38 C 122,18 98,16 86,26"
            stroke={`url(#${goldGradId})`}
            strokeWidth="1"
            strokeLinecap="round"
            strokeOpacity="0.75"
            strokeDasharray="240"
            style={{
              strokeDashoffset: isBloomed ? 0 : 240,
              animation: isBloomed
                ? "songhy-vine-grow 1300ms cubic-bezier(0.22, 1, 0.36, 1) 220ms both"
                : "none",
            }}
          />
          <path
            d="M 225,38 C 238,18 262,16 274,26"
            stroke={`url(#${goldGradId})`}
            strokeWidth="1"
            strokeLinecap="round"
            strokeOpacity="0.75"
            strokeDasharray="240"
            style={{
              strokeDashoffset: isBloomed ? 0 : 240,
              animation: isBloomed
                ? "songhy-vine-grow 1300ms cubic-bezier(0.22, 1, 0.36, 1) 220ms both"
                : "none",
            }}
          />

          {/* Sprouting Golden Leaves */}
          {renderLeaf(140, 42, -52, 0.85, 220)}
          {renderLeaf(125, 36, 48, 0.72, 300)}
          {renderLeaf(74, 42, -62, 0.75, 420)}
          {renderLeaf(46, 54, 58, 0.65, 520)}

          {renderLeaf(220, 42, 52, 0.85, 220)}
          {renderLeaf(235, 36, -48, 0.72, 300)}
          {renderLeaf(286, 42, 62, 0.75, 420)}
          {renderLeaf(314, 54, -58, 0.65, 520)}

          {/* Side Peach Blossoms (Left & Right) */}
          {renderBloomingFlower(98, 36, 0.64, 260, true)}
          {renderBloomingFlower(262, 36, 0.64, 260, true)}

          {/* Outer Mini Flower Buds */}
          {renderBloomingFlower(38, 51, 0.36, 460, true)}
          {renderBloomingFlower(322, 51, 0.36, 460, true)}

          {/* Central Royal Blooming Peony */}
          {renderBloomingFlower(180, 47, 1.08, 80, false)}

          {/* Twinkling Golden Pollen Stars */}
          {[
            { x: 148, y: 18, d: 300 },
            { x: 212, y: 18, d: 550 },
            { x: 64, y: 24, d: 700 },
            { x: 296, y: 24, d: 900 },
          ].map((pt, idx) => (
            <circle
              key={idx}
              cx={pt.x}
              cy={pt.y}
              r="1.6"
              fill="#ffe9a6"
              style={{
                opacity: isBloomed ? 0.85 : 0,
                animation: isBloomed
                  ? `songhy-pollen-twinkle 3.2s ease-in-out ${pt.d}ms infinite`
                  : "none",
              }}
            />
          ))}
        </svg>
      )}

      {variant === "crest" && (
        <svg
          viewBox="0 0 280 68"
          className="w-full max-w-[250px] h-auto overflow-visible"
          fill="none"
        >
          <defs>
            <radialGradient id={outerGradId} cx="50%" cy="75%" r="75%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#7a0600" : "#b8141c"}
              />
              <stop
                offset="65%"
                stopColor={isCrimson ? "#c91e27" : "#e33942"}
              />
              <stop
                offset="100%"
                stopColor={isCrimson ? "#f5c281" : "#ffe6a3"}
              />
            </radialGradient>
            <radialGradient id={midGradId} cx="50%" cy="75%" r="75%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#960b04" : "#cf1b24"}
              />
              <stop
                offset="70%"
                stopColor={isCrimson ? "#e04850" : "#f77e84"}
              />
              <stop offset="100%" stopColor="#fff1c7" />
            </radialGradient>
            <radialGradient id={innerGradId} cx="50%" cy="80%" r="80%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#b81820" : "#e63b44"}
              />
              <stop offset="60%" stopColor="#f7b97c" />
              <stop offset="100%" stopColor="#fff9e6" />
            </radialGradient>
            <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#9c6b19" : "#d4af37"}
              />
              <stop
                offset="50%"
                stopColor={isCrimson ? "#d4af37" : "#fff1be"}
              />
              <stop
                offset="100%"
                stopColor={isCrimson ? "#8a5a10" : "#c5982c"}
              />
            </linearGradient>
            <radialGradient id={coreGradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffdf2" />
              <stop offset="60%" stopColor="#f5c542" />
              <stop offset="100%" stopColor="#b07908" />
            </radialGradient>
          </defs>

          {/* Left & Right Symmetrical Golden Vines */}
          <path
            d="M 140,34 C 110,34 94,22 66,30 C 44,36 28,42 10,34"
            stroke={`url(#${goldGradId})`}
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeDasharray="240"
            style={{
              strokeDashoffset: isBloomed ? 0 : 240,
              animation: isBloomed
                ? "songhy-vine-grow 1100ms cubic-bezier(0.22, 1, 0.36, 1) 50ms both"
                : "none",
            }}
          />
          <path
            d="M 140,34 C 170,34 186,22 214,30 C 236,36 252,42 270,34"
            stroke={`url(#${goldGradId})`}
            strokeWidth="1.35"
            strokeLinecap="round"
            strokeDasharray="240"
            style={{
              strokeDashoffset: isBloomed ? 0 : 240,
              animation: isBloomed
                ? "songhy-vine-grow 1100ms cubic-bezier(0.22, 1, 0.36, 1) 50ms both"
                : "none",
            }}
          />

          {/* Sprouting Leaves */}
          {renderLeaf(106, 30, -55, 0.72, 180)}
          {renderLeaf(86, 28, 48, 0.62, 280)}
          {renderLeaf(44, 36, -65, 0.56, 380)}

          {renderLeaf(174, 30, 55, 0.72, 180)}
          {renderLeaf(194, 28, -48, 0.62, 280)}
          {renderLeaf(236, 36, 65, 0.56, 380)}

          {/* Side Peach Buds */}
          {renderBloomingFlower(66, 31, 0.44, 260, true)}
          {renderBloomingFlower(214, 31, 0.44, 260, true)}

          {/* Central Blooming Peony */}
          {renderBloomingFlower(140, 34, 0.86, 60, false)}
        </svg>
      )}

      {variant === "corner" && (
        <svg
          viewBox="0 0 120 120"
          className="w-full h-full overflow-visible"
          fill="none"
        >
          <defs>
            <radialGradient id={outerGradId} cx="50%" cy="75%" r="75%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#7a0600" : "#b8141c"}
              />
              <stop
                offset="65%"
                stopColor={isCrimson ? "#c91e27" : "#e33942"}
              />
              <stop
                offset="100%"
                stopColor={isCrimson ? "#f5c281" : "#ffe6a3"}
              />
            </radialGradient>
            <radialGradient id={midGradId} cx="50%" cy="75%" r="75%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#960b04" : "#cf1b24"}
              />
              <stop
                offset="70%"
                stopColor={isCrimson ? "#e04850" : "#f77e84"}
              />
              <stop offset="100%" stopColor="#fff1c7" />
            </radialGradient>
            <radialGradient id={innerGradId} cx="50%" cy="80%" r="80%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#b81820" : "#e63b44"}
              />
              <stop offset="60%" stopColor="#f7b97c" />
              <stop offset="100%" stopColor="#fff9e6" />
            </radialGradient>
            <linearGradient id={goldGradId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop
                offset="0%"
                stopColor={isCrimson ? "#9c6b19" : "#d4af37"}
              />
              <stop
                offset="50%"
                stopColor={isCrimson ? "#d4af37" : "#fff1be"}
              />
              <stop
                offset="100%"
                stopColor={isCrimson ? "#8a5a10" : "#c5982c"}
              />
            </linearGradient>
            <radialGradient id={coreGradId} cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#fffdf2" />
              <stop offset="60%" stopColor="#f5c542" />
              <stop offset="100%" stopColor="#b07908" />
            </radialGradient>
          </defs>

          {/* Corner Branch Curves */}
          <path
            d="M 8,104 C 12,64 28,32 98,12"
            stroke={`url(#${goldGradId})`}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray="240"
            style={{
              strokeDashoffset: isBloomed ? 0 : 240,
              animation: isBloomed
                ? "songhy-vine-grow 1200ms cubic-bezier(0.22, 1, 0.36, 1) 80ms both"
                : "none",
            }}
          />
          <path
            d="M 24,56 C 44,54 58,64 68,82"
            stroke={`url(#${goldGradId})`}
            strokeWidth="1.1"
            strokeLinecap="round"
            strokeDasharray="240"
            style={{
              strokeDashoffset: isBloomed ? 0 : 240,
              animation: isBloomed
                ? "songhy-vine-grow 1200ms cubic-bezier(0.22, 1, 0.36, 1) 240ms both"
                : "none",
            }}
          />

          {renderLeaf(16, 76, 35, 0.72, 220)}
          {renderLeaf(48, 28, 65, 0.75, 320)}
          {renderLeaf(74, 18, 72, 0.64, 420)}
          {renderLeaf(48, 60, 125, 0.62, 380)}

          {renderBloomingFlower(34, 38, 0.78, 140, false)}
          {renderBloomingFlower(74, 22, 0.46, 320, true)}
          {renderBloomingFlower(20, 74, 0.44, 380, true)}
        </svg>
      )}
    </div>
  );
};
