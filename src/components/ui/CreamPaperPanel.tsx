"use client";

import React from "react";
import { BloomingFloralSvg } from "@/components/effects/BloomingFloralSvg";

interface CreamPaperPanelProps {
  children: React.ReactNode;
  /** Optional wavy red & gold curtain + 囍 seal at bottom of paper sheet */
  showBottomCurtain?: boolean;
  /** Bottom offset class for the curtain SVG */
  curtainBottomClass?: string;
  /** Bottom offset class for the 囍 seal */
  sealBottomClass?: string;
  /** Top/bottom inset classes for the 9-slice border frame */
  frameInsetClass?: string;
  /** Inner content container classes */
  contentClassName?: string;
  /** Show corner blooming floral branches at top-left & top-right */
  showCornerFlowers?: boolean;
}

/**
 * Standardized 9-Slice Cream & Gold Paper Frame with softly rounded corners (26px),
 * optional corner blooming SVG branches, and optional bottom wavy curtain + 囍 emblem.
 */
export const CreamPaperPanel: React.FC<CreamPaperPanelProps> = ({
  children,
  showBottomCurtain = false,
  curtainBottomClass = "-bottom-[284px] md:-bottom-[550px]",
  sealBottomClass = "bottom-[54px] md:bottom-[83px]",
  frameInsetClass = "-top-[34px] bottom-0 md:-top-[46px]",
  contentClassName = "pt-[16px] pb-[122px] md:pt-[22px] md:pb-[166px] px-4 sm:px-[34px] md:px-[48px]",
  showCornerFlowers = true,
}) => {
  return (
    <div className="relative">
      {/* 9-Slice Cream & Gold Nested Frame Panel (Softly Rounded Corners) */}
      <div
        aria-hidden="true"
        className={`pointer-events-none absolute left-[4.54%] right-[4.54%] -z-10 border-[90px_80px] md:border-[122px_109px] rounded-[26px] md:rounded-[34px] overflow-hidden ${frameInsetClass}`}
        style={{
          borderStyle: "solid",
          borderColor: "transparent",
          borderImageSource: "url(/images/themes/song-hy-v2-red/panel.webp)",
          borderImageSlice: "270 240 fill",
          borderImageRepeat: "stretch",
          clipPath: "inset(0 round 26px)",
        }}
      />

      {/* Optional Bottom Wavy Curtain & Double Happiness Emblem */}
      {showBottomCurtain && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-[1]"
        >
          <img
            src="/images/themes/song-hy-v2-red/hero-shape.svg"
            alt=""
            decoding="async"
            aria-hidden="true"
            className={`pointer-events-none absolute max-w-none object-contain left-1/2 h-[509px] w-[113.4%] -translate-x-1/2 md:h-[992px] md:w-[163.33%] ${curtainBottomClass}`}
          />
          <img
            src="/images/themes/song-hy-v2-red/double-happiness.webp"
            alt=""
            decoding="async"
            aria-hidden="true"
            className={`pointer-events-none absolute max-w-none object-contain left-1/2 -translate-x-1/2 h-[40px] w-[43px] md:h-[54px] md:w-[59px] ${sealBottomClass}`}
          />
        </div>
      )}

      {/* Inner Content Container */}
      <div
        className={`relative z-10 flex flex-col items-center ${contentClassName}`}
      >
        {showCornerFlowers && (
          <>
            <BloomingFloralSvg
              variant="corner"
              palette="crimson"
              className="absolute top-1 left-6 sm:left-8 w-16 h-16 md:w-20 md:h-20 opacity-85"
            />
            <BloomingFloralSvg
              variant="corner"
              palette="crimson"
              flipX
              className="absolute top-1 right-6 sm:right-8 w-16 h-16 md:w-20 md:h-20 opacity-85"
            />
          </>
        )}
        {children}
      </div>
    </div>
  );
};
