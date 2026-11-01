"use client";

import React from "react";
import { useWeddingStore } from "@/store/useWeddingStore";
import { INITIAL_WEDDING_DATA, THEME_PALETTES } from "@/data/mockWeddingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { BloomingFloralSvg } from "@/components/effects/BloomingFloralSvg";
import { CreamPaperPanel } from "@/components/ui/CreamPaperPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function FamilyCeremonySection() {
  const { customGroomName, customBrideName, customVenueName, themeId } =
    useWeddingStore();
  const theme = THEME_PALETTES[themeId];
  const { ref, spring, inView } = useScrollReveal({ threshold: 0.12 });

  const staggerStyle = (index: number): React.CSSProperties => ({
    opacity: inView ? 1 : 0,
    transform: inView ? "translate3d(0, 0px, 0)" : "translate3d(0, 22px, 0)",
    transition: `opacity 620ms cubic-bezier(0.22, 1, 0.36, 1) ${
      index * 90
    }ms, transform 620ms cubic-bezier(0.22, 1, 0.36, 1) ${index * 90}ms`,
  });

  const fullGroom =
    customGroomName === "Phương Đông"
      ? INITIAL_WEDDING_DATA.groomFullName
      : customGroomName;
  const fullBride =
    customBrideName === "Thu Hiền"
      ? INITIAL_WEDDING_DATA.brideFullName
      : customBrideName;

  return (
    <section
      ref={ref}
      className="relative isolate overflow-x-clip -mt-[11px] pt-[34px] md:-mt-[15px] md:pt-[46px]"
    >
      <div
        style={spring}
        className="relative mx-auto w-full max-w-[441px] md:max-w-[600px]"
      >
        <CreamPaperPanel
          showBottomCurtain
          curtainBottomClass="-bottom-[284px] md:-bottom-[550px]"
          sealBottomClass="bottom-[54px] md:bottom-[83px]"
          frameInsetClass="-top-[34px] bottom-0 md:-top-[46px]"
          contentClassName="pt-[16px] pb-[122px] md:pt-[22px] md:pb-[166px] px-4 sm:px-[34px] md:px-[48px]"
        >
          {/* Standardized Heading */}
          <SectionHeading
            title={<>THÔNG TIN LỄ&nbsp;CƯỚI</>}
            color={theme.paperTextPrimary}
            floralVariant="crest"
            floralPalette="crimson"
            style={staggerStyle(0)}
          />

            {/* Parents Two-Column Grid (Larger font & strictly single-line whitespace-nowrap) */}
            <div
              style={{
                ...staggerStyle(1),
                color: theme.paperTextPrimary,
              }}
              className="mt-[14px] grid w-full grid-cols-[1fr_auto_1fr] items-center justify-center gap-x-[10px] sm:gap-x-[14px] md:mt-[18px] md:gap-x-[22px] font-serif"
            >
              {/* Groom's Parents */}
              <div className="flex flex-col items-center text-center gap-1 min-w-0">
                <span
                  className="text-[12px] sm:text-[13px] md:text-[15px] uppercase tracking-wider font-semibold whitespace-nowrap opacity-85"
                  style={{ color: theme.paperTextSecondary }}
                >
                  Nhà Trai • Ông Bà
                </span>
                {INITIAL_WEDDING_DATA.groomParents.map((parent) => (
                  <span
                    key={parent}
                    className="font-bold text-[16px] sm:text-[17px] md:text-[21px] whitespace-nowrap leading-snug"
                    style={{ color: theme.paperTextPrimary }}
                  >
                    {parent}
                  </span>
                ))}
                <span
                  className="mt-0.5 text-[10.5px] sm:text-[11.5px] md:text-[13px] leading-snug opacity-80 font-medium"
                  style={{ color: theme.paperTextSecondary }}
                >
                  {INITIAL_WEDDING_DATA.groomParentsAddress}
                </span>
              </div>

              {/* Vertical Gold Divider */}
              <div
                className="h-[86px] w-px self-center md:h-[106px]"
                style={{ backgroundColor: theme.accentRose }}
              />

              {/* Bride's Parents */}
              <div className="flex flex-col items-center text-center gap-1 min-w-0">
                <span
                  className="text-[12px] sm:text-[13px] md:text-[15px] uppercase tracking-wider font-semibold whitespace-nowrap opacity-85"
                  style={{ color: theme.paperTextSecondary }}
                >
                  Nhà Gái • Ông Bà
                </span>
                {INITIAL_WEDDING_DATA.brideParents.map((parent) => (
                  <span
                    key={parent}
                    className="font-bold text-[16px] sm:text-[17px] md:text-[21px] whitespace-nowrap leading-snug"
                    style={{ color: theme.paperTextPrimary }}
                  >
                    {parent}
                  </span>
                ))}
                <span
                  className="mt-0.5 text-[10.5px] sm:text-[11.5px] md:text-[13px] leading-snug opacity-80 font-medium"
                  style={{ color: theme.paperTextSecondary }}
                >
                  {INITIAL_WEDDING_DATA.brideParentsAddress}
                </span>
              </div>
            </div>

            {/* Announcement Text */}
            <div
              style={{
                ...staggerStyle(2),
                color: theme.paperTextPrimary,
              }}
              className="mt-[16px] flex flex-col gap-[3px] text-center text-[15px] md:text-[19px] uppercase md:mt-[20px] mx-auto md:max-w-[520px] font-serif leading-relaxed"
            >
              <span>{INITIAL_WEDDING_DATA.announcementText}</span>
            </div>

            {/* Full Couple Names in Original Carattere Calligraphy (Single-line whitespace-nowrap) */}
            <div
              style={{
                ...staggerStyle(3),
                color: theme.paperTextPrimary,
              }}
              className="w-full min-w-0 mt-[14px] flex flex-col items-center gap-[2px] md:mt-[18px]"
            >
              <h3
                style={{ fontFamily: "var(--font-carattere), cursive" }}
                className="flex w-full items-center justify-center text-center text-[31px] sm:text-[36px] md:text-[48px] whitespace-nowrap leading-tight font-script tracking-wide"
              >
                {fullGroom}
              </h3>
              <div
                style={{ fontFamily: "var(--font-ms-madi), cursive" }}
                className="text-[26px] sm:text-[30px] leading-none md:text-[40px] font-madi opacity-85"
              >
                &amp;
              </div>
              <h3
                style={{ fontFamily: "var(--font-carattere), cursive" }}
                className="flex w-full items-center justify-center text-center text-[31px] sm:text-[36px] md:text-[48px] whitespace-nowrap leading-tight font-script tracking-wide"
              >
                {fullBride}
              </h3>
            </div>

            {/* Ceremony & Reception Date Blocks */}
            <div
              style={staggerStyle(4)}
              className="w-full flex flex-col items-center"
            >
              {/* Block 1: TIỆC CƯỚI NHÀ GÁI (Chiều hôm trước - Thứ Tư 23/12/2026) */}
              <div
                className="mt-[16px] flex w-full flex-col items-center gap-[5px] text-center md:mt-[22px] font-serif"
                style={{ color: theme.paperTextPrimary }}
              >
                <span
                  style={{ color: theme.paperTextSecondary }}
                  className="text-[11px] md:text-xs uppercase tracking-[0.16em] font-semibold opacity-80"
                >
                  Nhà Gái • Tổ Chức Chiều Hôm Trước
                </span>
                <div className="whitespace-pre-line text-[16px] md:text-[20px] uppercase font-semibold leading-relaxed">
                  TIỆC CƯỚI NHÀ GÁI{"\n"}
                  {INITIAL_WEDDING_DATA.brideSideVenueLabel}
                </div>
                <div
                  className="flex w-full max-w-[215px] items-center justify-center text-[12px] uppercase md:max-w-[260px] md:text-[15px] whitespace-nowrap gap-x-3 font-medium"
                  style={{ color: theme.paperTextSecondary }}
                >
                  <span>CHIỀU LÚC {INITIAL_WEDDING_DATA.brideSideTime}</span>
                  <span>•</span>
                  <span>{INITIAL_WEDDING_DATA.brideSideDayOfWeek}</span>
                </div>
                <div className="flex items-center justify-center gap-[10px] md:gap-[14px]">
                  <span className="text-[56px] leading-none md:text-[76px] font-serif">
                    {INITIAL_WEDDING_DATA.brideSideDayNumber}
                  </span>
                  <div
                    className="h-[46px] w-px shrink-0 self-center md:h-[62px]"
                    style={{ backgroundColor: theme.paperTextPrimary }}
                  />
                  <div className="flex flex-col items-start justify-center gap-1 text-left">
                    <span className="text-[17px] uppercase leading-none md:text-[22px]">
                      {INITIAL_WEDDING_DATA.monthLabel}
                    </span>
                    <span className="text-[17px] uppercase leading-none md:text-[22px]">
                      {INITIAL_WEDDING_DATA.yearLabel}
                    </span>
                  </div>
                </div>
                <div
                  className="text-xs uppercase tracking-normal md:text-sm italic opacity-85"
                  style={{ color: theme.paperTextSecondary }}
                >
                  ({INITIAL_WEDDING_DATA.brideSideLunarDate})
                </div>
              </div>

              {/* Blooming Peony & Vine Divider Between Nhà Gái & Nhà Trai */}
              <BloomingFloralSvg
                variant="crest"
                palette="crimson"
                className="w-[185px] md:w-[215px] my-2.5"
              />

              {/* Block 2: LỄ THÀNH HÔN & TIỆC CƯỚI NHÀ TRAI (Thứ Năm 24/12/2026) */}
              <div
                className="flex w-full flex-col items-center gap-[5px] text-center font-serif"
                style={{ color: theme.paperTextPrimary }}
              >
                <span
                  style={{ color: theme.paperTextSecondary }}
                  className="text-[11px] md:text-xs uppercase tracking-[0.16em] font-semibold opacity-80"
                >
                  Nhà Trai • Lễ Thành Hôn &amp; Tiệc Cưới
                </span>
                <div className="whitespace-pre-line text-[16px] md:text-[20px] uppercase font-semibold leading-relaxed">
                  LỄ THÀNH HÔN &amp; TIỆC CƯỚI{"\n"}
                  {customVenueName}
                </div>
                <div
                  className="flex flex-wrap items-center justify-center text-[12px] uppercase md:text-[15px] gap-x-2.5 gap-y-0.5 font-medium"
                  style={{ color: theme.paperTextSecondary }}
                >
                  <span>LỄ {INITIAL_WEDDING_DATA.ceremonyTime}</span>
                  <span>•</span>
                  <span>TIỆC {INITIAL_WEDDING_DATA.receptionTime}</span>
                  <span>•</span>
                  <span>{INITIAL_WEDDING_DATA.dayOfWeek}</span>
                </div>
                <div className="flex items-center justify-center gap-[10px] md:gap-[14px]">
                  <span className="text-[56px] leading-none md:text-[76px] font-serif">
                    {INITIAL_WEDDING_DATA.dayNumber}
                  </span>
                  <div
                    className="h-[46px] w-px shrink-0 self-center md:h-[62px]"
                    style={{ backgroundColor: theme.paperTextPrimary }}
                  />
                  <div className="flex flex-col items-start justify-center gap-1 text-left">
                    <span className="text-[17px] uppercase leading-none md:text-[22px]">
                      {INITIAL_WEDDING_DATA.monthLabel}
                    </span>
                    <span className="text-[17px] uppercase leading-none md:text-[22px]">
                      {INITIAL_WEDDING_DATA.yearLabel}
                    </span>
                  </div>
                </div>
                <div
                  className="text-xs uppercase tracking-normal md:text-sm italic opacity-85"
                  style={{ color: theme.paperTextSecondary }}
                >
                  ({INITIAL_WEDDING_DATA.lunarDate})
                </div>
              </div>
            </div>
        </CreamPaperPanel>
      </div>
    </section>
  );
}
