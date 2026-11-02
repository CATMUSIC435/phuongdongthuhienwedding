"use client";

import React, { useId } from "react";
import { useWeddingStore } from "@/store/useWeddingStore";
import { INITIAL_WEDDING_DATA, THEME_PALETTES } from "@/data/mockWeddingData";
import { useSpringTilt } from "@/hooks/useSpringTilt";
import { BloomingFloralSvg } from "@/components/effects/BloomingFloralSvg";

export function HeroArchSection() {
  const { customGroomName, customBrideName, themeId } =
    useWeddingStore();
  const theme = THEME_PALETTES[themeId];
  const uid = useId().replace(/:/g, "");
  const outerClipId = `arch-outer-${uid}`;
  const innerClipId = `arch-inner-${uid}`;

  const { ref: tiltRef, tilt, bind } = useSpringTilt({
    maxTilt: 5,
    scale: 1.018,
  });

  return (
    <header className="relative isolate overflow-x-clip">
      <div className="relative mx-auto w-full max-w-[441px] md:max-w-[600px]">
        <div className="relative h-[710px] sm:h-[736px] md:h-[1001px]">
          {/* Cream Paper Backdrop (Rounded bottom & tucked cleanly behind wavy curtain) */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-0 -top-[12px] -z-10 h-[630px] sm:h-[660px] md:h-[895px] rounded-b-[48px] md:rounded-b-[68px] shadow-inner"
            style={{ backgroundColor: theme.paperBg }}
          />

          {/* Giant Faint Double-Happiness Watermark on Cream Sheet */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 overflow-hidden rounded-b-[48px] md:rounded-b-[68px]"
          >
            <img
              src="/images/themes/song-hy-v2-red/double-happiness-bg.webp"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute max-w-none object-contain -left-[49px] -top-[30px] h-[606px] w-[541px] opacity-[0.07] md:-left-[67px] md:-top-[41px] md:h-[824px] md:w-[736px]"
            />
          </div>

          {/* Blooming SVG Peony & Peach Blossom Garland Crown at Top of Hero Sheet */}
          <div className="pointer-events-none absolute inset-x-0 top-[8px] sm:top-[10px] md:top-[16px] z-20 flex justify-center">
            <BloomingFloralSvg
              variant="garland"
              palette="crimson"
              autoBloom
              className="w-[235px] sm:w-[260px] md:w-[320px]"
            />
          </div>

          {/* Symmetrical Top Couple Short Names & Central 囍 Seal (Single-line aligned) */}
          <div className="absolute inset-x-0 top-[68px] sm:top-[74px] z-20 grid grid-cols-[1fr_auto_1fr] items-center gap-2 px-3.5 sm:px-5 md:top-[100px] md:gap-4 md:px-7">
            {/* Groom Column */}
            <div className="flex min-w-0 flex-col items-center justify-center text-center">
              <p
                className="mb-1 text-[11px] sm:text-[12px] leading-tight md:mb-1.5 md:text-[15px] tracking-widest uppercase font-sans opacity-90"
                style={{ color: theme.paperTextPrimary }}
              >
                Chú Rể
              </p>
              <p
                className="w-full uppercase whitespace-nowrap leading-tight font-fraunces font-bold tracking-wide text-[15px] sm:text-[17px] md:text-[23px]"
                style={{ color: theme.paperTextPrimary }}
              >
                {customGroomName}
              </p>
            </div>

            {/* Center Double Happiness Medallion */}
            <div className="flex items-center justify-center px-1">
              <img
                src="/images/themes/song-hy-v2-red/double-happiness.webp"
                alt="Song Hỷ"
                className="h-[34px] w-[35px] max-w-none shrink-0 object-contain md:h-[46px] md:w-[48px]"
              />
            </div>

            {/* Bride Column */}
            <div className="flex min-w-0 flex-col items-center justify-center text-center">
              <p
                className="mb-1 text-[11px] sm:text-[12px] leading-tight md:mb-1.5 md:text-[15px] tracking-widest uppercase font-sans opacity-90"
                style={{ color: theme.paperTextPrimary }}
              >
                Cô Dâu
              </p>
              <p
                className="w-full uppercase whitespace-nowrap leading-tight font-fraunces font-bold tracking-wide text-[15px] sm:text-[17px] md:text-[23px]"
                style={{ color: theme.paperTextPrimary }}
              >
                {customBrideName}
              </p>
            </div>
          </div>

          {/* Oriental Double-Rect Arch SVG Frame (Interactive 3D Tilt) */}
          <div
            ref={tiltRef}
            {...bind}
            style={{
              aspectRatio: "321 / 527",
              transform: `perspective(1000px) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(${tilt.scale})`,
              transition: "transform 280ms cubic-bezier(0.22, 1, 0.36, 1)",
            }}
            className="absolute left-[13.61%] top-[146px] sm:top-[151px] w-[72.79%] md:top-[205px] z-10 group"
          >
            <svg
              viewBox="0 0 321 527"
              className="h-full w-full drop-shadow-[0_16px_32px_rgba(140,0,0,0.22)]"
              aria-label="Ảnh cưới chính Phạm Phương Đông và Nguyễn Thị Thu Hiền"
            >
              <defs>
                <clipPath id={outerClipId}>
                  <rect
                    x="29.5"
                    y="1"
                    width="262"
                    height="525"
                    rx="23.5"
                    ry="25"
                  />
                  <rect
                    x="1"
                    y="28"
                    width="319"
                    height="471"
                    rx="26.5"
                    ry="22"
                  />
                </clipPath>
                <clipPath id={innerClipId}>
                  <rect
                    x="31.5"
                    y="3"
                    width="258"
                    height="521"
                    rx="21.5"
                    ry="23"
                  />
                  <rect
                    x="3"
                    y="30"
                    width="315"
                    height="467"
                    rx="24.5"
                    ry="20"
                  />
                </clipPath>
              </defs>
              {/* Crimson Outer Frame Border */}
              <rect
                width="321"
                height="527"
                fill={theme.bgPrimary}
                clipPath={`url(#${outerClipId})`}
              />
              {/* Main Wedding Portrait Clipped Inside */}
              <image
                href={INITIAL_WEDDING_DATA.heroPhoto}
                width="321"
                height="527"
                preserveAspectRatio="xMidYMid slice"
                clipPath={`url(#${innerClipId})`}
                className="transition-transform duration-700 group-hover:scale-105"
              />
            </svg>
          </div>

          {/* Golden Wavy Curtain Border Closing the Hero Sheet + Flanking 囍 Seals */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 z-[15]"
          >
            <div
              className="absolute left-[13.61%] top-[146px] sm:top-[151px] w-[72.79%] md:top-[205px]"
              style={{ aspectRatio: "321 / 527" }}
            >
              <img
                src="/images/themes/song-hy-v2-red/hero-shape.svg"
                alt=""
                aria-hidden="true"
                className="pointer-events-none absolute max-w-none object-contain left-1/2 -bottom-[281px] h-[509px] w-[155.76%] -translate-x-1/2 md:-bottom-[550px] md:h-[992px] md:w-[224.39%]"
              />
            </div>
            <img
              src="/images/themes/song-hy-v2-red/double-happiness-light.webp"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute max-w-none object-contain -right-[80px] top-[560px] sm:top-[581px] h-[155px] w-[163px] opacity-10 md:-right-[109px] md:top-[790px] md:h-[211px] md:w-[222px]"
            />
            <img
              src="/images/themes/song-hy-v2-red/double-happiness-light.webp"
              alt=""
              aria-hidden="true"
              className="pointer-events-none absolute max-w-none object-contain -left-[80px] top-[560px] sm:top-[581px] h-[155px] w-[163px] opacity-10 md:-left-[109px] md:top-[790px] md:h-[211px] md:w-[222px]"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
