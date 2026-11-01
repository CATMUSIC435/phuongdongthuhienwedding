"use client";

import React from "react";

interface CrimsonFloralBackdropProps {
  rightTopClass?: string;
  leftTopClass?: string;
}

/**
 * Standardized faint cream line-art floral branch watermarks for crimson sections.
 */
export const CrimsonFloralBackdrop: React.FC<CrimsonFloralBackdropProps> = ({
  rightTopClass = "-top-[24px] md:-top-[32px]",
  leftTopClass = "top-[203px] md:top-[276px]",
}) => {
  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 -z-10"
    >
      <img
        src="/images/themes/song-hy-v2-red/flower1.webp"
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden="true"
        className={`pointer-events-none absolute max-w-none object-contain h-[311px] w-[274px] opacity-20 md:h-[423px] md:w-[373px] right-[-62px] md:right-[-153px] ${rightTopClass}`}
      />
      <img
        src="/images/themes/song-hy-v2-red/flower1.webp"
        alt=""
        loading="lazy"
        decoding="async"
        aria-hidden="true"
        className={`pointer-events-none absolute max-w-none object-contain h-[311px] w-[274px] opacity-20 md:h-[423px] md:w-[373px] left-[-62px] md:left-[-153px] ${leftTopClass}`}
      />
    </div>
  );
};
