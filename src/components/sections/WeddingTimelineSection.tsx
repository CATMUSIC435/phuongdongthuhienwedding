"use client";

import React from "react";
import { useWeddingStore } from "@/store/useWeddingStore";
import { INITIAL_WEDDING_DATA, THEME_PALETTES } from "@/data/mockWeddingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CreamPaperPanel } from "@/components/ui/CreamPaperPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";

const BADGE_IMAGES: Record<
  "ring" | "toast" | "cake",
  { src: string; className: string }
> = {
  ring: {
    src: "/images/themes/song-hy-v2-red/ring.webp",
    className: "h-[24px] w-[34px] md:h-[32px] md:w-[46px]",
  },
  toast: {
    src: "/images/themes/song-hy-v2-red/toast.webp",
    className: "h-[34px] w-[32px] md:h-[46px] md:w-[43px]",
  },
  cake: {
    src: "/images/themes/song-hy-v2-red/cake.webp",
    className: "h-[34px] w-[32px] md:h-[46px] md:w-[43px]",
  },
};

export function WeddingTimelineSection() {
  const { themeId } = useWeddingStore();
  const theme = THEME_PALETTES[themeId];
  const { ref, spring, inView } = useScrollReveal({ threshold: 0.12 });

  const events = INITIAL_WEDDING_DATA.timeline;

  return (
    <section
      ref={ref}
      className="relative isolate overflow-x-clip mt-[18px] pt-[5px] pb-[12px] -mb-[12px] md:mt-[24px] md:pt-[7px] md:pb-[16px] md:-mb-[16px]"
    >
      <div
        style={spring}
        className="relative mx-auto w-full max-w-[441px] md:max-w-[600px]"
      >
        <CreamPaperPanel
          showBottomCurtain={false}
          frameInsetClass="-top-[5px] -bottom-[12px] md:-top-[7px] md:-bottom-[16px]"
          contentClassName="mx-auto w-full max-w-[414px] gap-[18px] px-6 sm:px-[38px] pt-[48px] sm:pt-[53px] pb-[44px] sm:pb-[48px] md:max-w-[563px] md:px-[52px] md:pt-[59px]"
        >
          <SectionHeading
            title={<>LỊCH TRÌNH NGÀY&nbsp;CƯỚI</>}
            color={theme.paperTextPrimary}
            floralVariant="crest"
            floralPalette="crimson"
          />

            <ol className="relative mx-auto grid w-full max-w-[460px] grid-cols-[minmax(0,1fr)_16px_minmax(0,1fr)] items-center gap-x-5 md:gap-x-8 gap-y-6 md:gap-y-8 font-serif">
              {events.map((ev, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === events.length - 1;
                const badgeInfo = ev.badge ? BADGE_IMAGES[ev.badge] : null;
                const delayMs = 140 + idx * 100;

                return (
                  <li key={`${ev.dayTag}-${ev.time}`} className="contents">
                    {/* Left Column: Time + Day Tag + Optional Folk Badge */}
                    <span
                      style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                          ? "translateX(0px)"
                          : "translateX(-16px)",
                        transition: `opacity 580ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms, transform 580ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms`,
                        color: theme.paperTextPrimary,
                      }}
                      className="pt-0.5 text-right tabular-nums tracking-wide leading-tight"
                    >
                      <span className="relative inline-flex flex-col items-end">
                        {badgeInfo && (
                          <span
                            aria-hidden="true"
                            className="absolute top-1/2 -translate-y-1/2 flex w-max items-center justify-center right-full mr-3 sm:mr-[20px]"
                          >
                            <img
                              src={badgeInfo.src}
                              alt=""
                              loading="lazy"
                              decoding="async"
                              className={`${badgeInfo.className} max-w-none object-contain drop-shadow-sm`}
                            />
                          </span>
                        )}
                        <span className="text-[15px] md:text-[19px] font-bold">
                          {ev.time}
                        </span>
                        {ev.dayTag && (
                          <span
                            style={{ color: theme.paperTextSecondary }}
                            className="text-[10px] md:text-xs font-semibold uppercase tracking-wider opacity-75"
                          >
                            {ev.dayTag}
                          </span>
                        )}
                      </span>
                    </span>

                    {/* Center Column: Vertical Axis Line & Node Dot */}
                    <span
                      aria-hidden="true"
                      className="relative flex items-center justify-center self-stretch"
                    >
                      <span
                        className={`absolute left-1/2 -translate-x-1/2 w-px ${
                          isFirst
                            ? "top-1/2 -bottom-6 md:-bottom-8"
                            : isLast
                            ? "-top-6 md:-top-8 bottom-1/2"
                            : "-top-6 md:-top-8 -bottom-6 md:-bottom-8"
                        }`}
                        style={{
                          backgroundColor: `${theme.paperTextPrimary}66`,
                        }}
                      />
                      <span
                        style={{
                          transform: inView ? "scale(1)" : "scale(0)",
                          transition: `transform 480ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms`,
                          backgroundColor: theme.paperTextPrimary,
                          boxShadow: `0 0 0 3px ${theme.paperTextPrimary}22`,
                        }}
                        className="relative block h-2.5 w-2.5 rounded-full"
                      />
                    </span>

                    {/* Right Column: Event Title */}
                    <span
                      style={{
                        opacity: inView ? 1 : 0,
                        transform: inView
                          ? "translateX(0px)"
                          : "translateX(16px)",
                        transition: `opacity 580ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms, transform 580ms cubic-bezier(0.22,1,0.36,1) ${delayMs}ms`,
                        color: theme.paperTextPrimary,
                      }}
                      className="text-[14px] md:text-[18px] leading-snug font-semibold"
                    >
                      <span>{ev.title}</span>
                    </span>
                  </li>
                );
              })}
            </ol>
        </CreamPaperPanel>
      </div>
    </section>
  );
}
