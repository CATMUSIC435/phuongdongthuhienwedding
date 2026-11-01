"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { useWeddingStore } from "@/store/useWeddingStore";
import { THEME_PALETTES } from "@/data/mockWeddingData";
import { useSpringTilt } from "@/hooks/useSpringTilt";
import { BloomingFloralSvg } from "@/components/effects/BloomingFloralSvg";

interface EnvelopeGateProps {
  initialGuestName?: string;
  initialGuestRelation?: string;
}

export function EnvelopeGate({
  initialGuestName = "",
  initialGuestRelation,
}: EnvelopeGateProps = {}) {
  const {
    isUnsealing,
    guestName,
    guestRelation,
    customGroomName,
    customBrideName,
    customDateDisplay,
    themeId,
    startUnsealEnvelope,
    finishOpenEnvelope,
  } = useWeddingStore();

  const displayGuestName = guestName || initialGuestName;
  const displayGuestRelation =
    initialGuestRelation ||
    (guestRelation === "Thân Mời" ? "Trân Trọng Kính Mời" : guestRelation);

  const theme = THEME_PALETTES[themeId];
  const { ref: tiltRef, tiltStyle, glareStyle, bind } = useSpringTilt({
    maxTilt: 6,
    scale: 1.015,
  });

  // Pre-warm heavy WebGL chunks in background idle time while user views the envelope
  useEffect(() => {
    const timer = setTimeout(() => {
      import("@/components/pixi/PixiPhotoCarousel").catch(() => {});
      import("@/components/map/MapboxWeddingVenue").catch(() => {});
    }, 800);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenCard = () => {
    if (isUnsealing) return;
    startUnsealEnvelope();

    try {
      confetti({
        particleCount: 36,
        spread: 68,
        origin: { y: 0.58 },
        colors: ["#FFE8A4", "#FDCB9C", "#D4AF37", "#FFF9E6", "#B30000"],
        disableForReducedMotion: true,
      });
    } catch {
      // ignore
    }

    setTimeout(() => {
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      }
      finishOpenEnvelope();
    }, 260);
  };

  return (
    <div
      className="relative min-h-[100dvh] w-full flex flex-col items-center justify-center px-4 py-8 overflow-hidden select-none"
      style={{
        background: `radial-gradient(circle at 50% 25%, ${theme.bgPrimary} 0%, ${theme.bgDeep} 60%, ${theme.bgDark} 100%)`,
      }}
    >
      {/* Centered Invitation Envelope Card (Responsive from 320px phones to Desktop) */}
      <div
        style={{
          opacity: isUnsealing ? 0 : 1,
          transform: isUnsealing
            ? "translate3d(0, -24px, 0) scale(1.03)"
            : "translate3d(0, 0px, 0) scale(1)",
          willChange: "transform, opacity",
          transition:
            "opacity 260ms cubic-bezier(0.22, 1, 0.36, 1), transform 260ms cubic-bezier(0.22, 1, 0.36, 1)",
        }}
        className="relative z-10 w-full flex flex-col items-center justify-center"
      >
        <div
          ref={tiltRef}
          {...bind}
          style={{ perspective: "1200px" }}
          className="relative w-full max-w-[345px] sm:max-w-[380px] md:max-w-[480px]"
        >
          <div style={tiltStyle} className="relative">
            {/* Crimson & Gold Luxury Envelope Card */}
            <div
              onClick={handleOpenCard}
              style={{
                boxShadow:
                  "0 28px 65px -12px rgba(0, 0, 0, 0.65), 0 8px 24px rgba(0, 0, 0, 0.3), 0 0 45px rgba(253, 203, 156, 0.22)",
              }}
              className="relative rounded-[24px] overflow-hidden backdrop-blur-md cursor-pointer group"
            >
              {/* Card Background & Ornamental Inner Gold Border */}
              <div
                style={{
                  backgroundColor: `${theme.bgPrimary}F2`,
                  border: "1.5px solid rgba(255, 232, 164, 0.42)",
                }}
                className="absolute inset-0 rounded-[24px] overflow-hidden"
              >
                {/* Delicate Inner Gold Frame */}
                <div className="pointer-events-none absolute inset-2.5 sm:inset-3 rounded-[18px] border border-[#ffe8a4]/22" />

                {/* Blooming SVG Floral Corners on Envelope Card */}
                <BloomingFloralSvg
                  variant="corner"
                  palette="gold"
                  autoBloom
                  className="absolute top-2 left-2 w-20 h-20 opacity-85 z-10"
                />
                <BloomingFloralSvg
                  variant="corner"
                  palette="gold"
                  autoBloom
                  flipX
                  className="absolute top-2 right-2 w-20 h-20 opacity-85 z-10"
                />

                {/* Interactive Glare Reflection */}
                <div
                  style={glareStyle}
                  className="pointer-events-none absolute inset-0 z-10"
                />

                {/* Corner 囍 Watermarks */}
                <img
                  src="/images/themes/song-hy-v2-red/double-happiness-light.webp"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute w-[190px] sm:w-[220px] md:w-[260px] -top-[55px] -left-[125px] opacity-[0.11] rotate-[30deg]"
                />
                <img
                  src="/images/themes/song-hy-v2-red/double-happiness-light.webp"
                  alt=""
                  aria-hidden="true"
                  className="pointer-events-none absolute w-[190px] sm:w-[220px] md:w-[260px] -bottom-[55px] -right-[125px] opacity-[0.11] rotate-[30deg]"
                />
              </div>

              {/* Envelope Content with Dedicated Top Double-Happiness Emblem (No rounded circle or animation) */}
              <div className="relative z-20 flex flex-col items-center text-center px-6 sm:px-8 pt-7 sm:pt-8 pb-8 sm:pb-9">
                {/* Clean Golden Double-Happiness Emblem */}
                <div className="mb-3 sm:mb-4 flex items-center justify-center">
                  <img
                    src="/images/themes/song-hy-v2-red/double-happiness-light.webp"
                    alt="Song Hỷ"
                    className="w-11 h-11 sm:w-12 sm:h-12 object-contain"
                  />
                </div>

                {/* Small Ceremonial Subtitle */}
                <p
                  style={{ color: "rgba(255, 232, 164, 0.8)" }}
                  className="text-[11px] sm:text-xs uppercase tracking-[0.26em] font-serif font-semibold mb-2"
                >
                  Thiệp Mời Lễ Thành Hôn
                </p>

                {/* Couple Names in Original Carattere Calligraphy */}
                <h1
                  style={{
                    color: theme.accentText,
                    fontFamily: "var(--font-carattere), cursive",
                  }}
                  className="mb-3 flex flex-col items-center leading-tight text-[36px] sm:text-[42px] md:text-[48px] font-script"
                >
                  <span className="block w-full text-center tracking-wide whitespace-nowrap drop-shadow-[0_3px_10px_rgba(0,0,0,0.4)]">
                    {customGroomName}
                  </span>
                  <span
                    style={{ fontFamily: "var(--font-ms-madi), cursive" }}
                    className="font-madi block w-full text-center text-xl sm:text-2xl leading-none my-0.5 opacity-90"
                  >
                    &amp;
                  </span>
                  <span className="block w-full text-center tracking-wide whitespace-nowrap drop-shadow-[0_3px_10px_rgba(0,0,0,0.4)]">
                    {customBrideName}
                  </span>
                </h1>

                {/* Animated Blooming Peony & Golden Vine Divider */}
                <BloomingFloralSvg
                  variant="crest"
                  palette="gold"
                  autoBloom
                  className="w-[215px] sm:w-[240px] mb-2.5"
                />

                {/* Wedding Date */}
                <div
                  style={{
                    color: "rgba(255, 249, 230, 0.92)",
                  }}
                  className="font-serif font-semibold tracking-wider text-[16px] sm:text-[18px] mb-4 flex flex-col items-center"
                >
                  <span>{customDateDisplay}</span>
                </div>

                {/* Guest Invitation Label (Luxury Borderless Typography, Instant SSR Render) */}
                <div className="mb-7 flex flex-col items-center">
                  <p
                    style={{ color: "rgba(255, 232, 164, 0.85)" }}
                    className="font-serif uppercase tracking-[0.22em] text-[11px] sm:text-[12px] font-semibold"
                  >
                    {displayGuestRelation}
                  </p>
                  {displayGuestName ? (
                    <div className="mt-2 flex flex-col items-center">
                      <p
                        style={{ color: theme.accentText }}
                        className="font-fraunces italic font-bold text-[24px] sm:text-[28px] tracking-wide leading-snug drop-shadow-[0_2px_10px_rgba(0,0,0,0.45)]"
                      >
                        {displayGuestName}
                      </p>
                      <span
                        aria-hidden="true"
                        style={{
                          background: `linear-gradient(90deg, transparent, ${theme.accentText}99, transparent)`,
                        }}
                        className="mt-1.5 block h-px w-28 sm:w-36"
                      />
                    </div>
                  ) : null}
                </div>

                {/* Clean "Mở thiệp" Button */}
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleOpenCard();
                  }}
                  style={{
                    backgroundColor: theme.accentText,
                    color: theme.bgPrimary,
                    boxShadow: "0 6px 20px rgba(255, 232, 164, 0.42)",
                  }}
                  className="relative px-9 py-2.5 text-base sm:text-lg font-serif font-bold tracking-wider uppercase rounded-full shadow-lg cursor-pointer flex w-fit items-center justify-center mx-auto overflow-hidden transition-transform duration-200 hover:scale-105 active:scale-95"
                >
                  <span>Mở Thiệp</span>
                  <div
                    style={{
                      background:
                        "linear-gradient(90deg, transparent, rgba(255,255,255,0.65), transparent)",
                      animation: "songhy-foil-shine 2.8s ease-in-out infinite",
                    }}
                    className="absolute top-0 left-0 h-full w-8 pointer-events-none"
                  />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
