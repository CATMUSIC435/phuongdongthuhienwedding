"use client";

import React, { useState } from "react";
import { Heart } from "lucide-react";
import { useWeddingStore } from "@/store/useWeddingStore";
import { INITIAL_WEDDING_DATA, THEME_PALETTES } from "@/data/mockWeddingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function LuckyGiftBoxSection() {
  const { themeId } = useWeddingStore();
  const theme = THEME_PALETTES[themeId];
  const { ref, spring } = useScrollReveal({ threshold: 0.12 });

  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <section
        ref={ref}
        className="relative isolate overflow-x-clip mt-[23px] md:mt-[31px]"
      >
        <div
          style={spring}
          className="relative mx-auto w-full max-w-[441px] md:max-w-[600px]"
        >
          {/* Oriental Cloud & Water Wave Pattern at Bottom */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <img
              src="/images/themes/song-hy-v2-red/cloud-pattern.webp"
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
              className="pointer-events-none absolute max-w-none object-contain bottom-[-38%] -left-[191px] h-[239px] w-[824px] opacity-40 md:-left-[260px] md:h-[325px] md:w-[1121px]"
            />
          </div>

          <div className="flex flex-col items-center justify-center py-6 relative z-10 pb-[16px] md:pb-[24px] px-5 sm:px-[37px] md:px-[50px]">
            <SectionHeading
              title={<>Hộp Quà&nbsp;Mừng</>}
              subtitle="Gửi trao lời chúc phúc và tấm lòng mừng hạnh phúc trăm năm"
              color={theme.accentText}
              floralVariant="garland"
              floralPalette="gold"
              className="mb-2"
            />

            {/* Decorative Twin Red Envelopes (No button pill or bank popup) */}
            <div
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ width: "250px", height: "305px" }}
              className="relative select-none"
            >
              <div className="relative w-full h-full flex items-end justify-center pb-[12px]">
                {/* 4 Twinkling Sparkles */}
                <span
                  style={{
                    top: "6%",
                    left: "12%",
                    color: "#fff9e6",
                    fontSize: "21px",
                  }}
                  className="absolute pointer-events-none z-20 animate-pulse"
                >
                  ✦
                </span>
                <span
                  style={{
                    top: "14%",
                    right: "8%",
                    color: "#fff9e6",
                    fontSize: "15px",
                  }}
                  className="absolute pointer-events-none z-20 animate-ping"
                >
                  ✦
                </span>
                <span
                  style={{
                    top: "34%",
                    left: "3%",
                    color: "#fff9e6",
                    fontSize: "14px",
                  }}
                  className="absolute pointer-events-none z-20 animate-pulse"
                >
                  ✦
                </span>
                <span
                  style={{
                    top: "24%",
                    right: "3%",
                    color: "#fff9e6",
                    fontSize: "14px",
                  }}
                  className="absolute pointer-events-none z-20 animate-pulse"
                >
                  ✦
                </span>

                <div
                  style={{ width: "190px", height: "275px" }}
                  className="relative"
                >
                  {/* Dynamic Ground Shadow */}
                  <div
                    style={{
                      left: "50%",
                      bottom: "-6px",
                      width: "125px",
                      height: "12px",
                      marginLeft: "-62.5px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.45)",
                      filter: "blur(4px)",
                      transform: isHovered ? "scaleX(1.18)" : "scaleX(1)",
                      transition: "transform 320ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                    className="absolute pointer-events-none z-0"
                  />

                  {/* Back Red Envelope */}
                  <img
                    src="/images/envelope/song_hy_v2_red.webp"
                    alt="Phong bao lì xì sau"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center bottom",
                      transformOrigin: "50% 100%",
                      transform: isHovered
                        ? "translateX(28%) translateY(-10%) scale(-0.82, 0.82) rotate(-22deg)"
                        : "translateX(20%) translateY(-10%) scale(-0.82, 0.82) rotate(-15deg)",
                      transition: "transform 340ms cubic-bezier(0.22,1,0.36,1)",
                      filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.22))",
                    }}
                    className="absolute inset-0 pointer-events-none z-[1]"
                  />

                  {/* Front Red Envelope */}
                  <img
                    src="/images/envelope/song_hy_v2_red.webp"
                    alt="Phong bao lì xì trước"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center bottom",
                      transformOrigin: "50% 100%",
                      transform: isHovered
                        ? "rotate(-4deg) scale(1.08)"
                        : "rotate(-10deg) scale(1)",
                      transition: "transform 340ms cubic-bezier(0.22,1,0.36,1)",
                      filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.28))",
                    }}
                    className="absolute inset-0 pointer-events-none z-[2]"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative isolate overflow-x-clip mt-[18px] pb-16 md:mt-[24px]">
        <div className="relative mx-auto w-full max-w-[441px] md:max-w-[600px]">
          <div className="relative z-10 flex flex-col items-center text-center pb-[24px] pt-[20px] px-6 sm:px-[37px] md:px-[50px]">
            <span
              className="whitespace-pre-line flex flex-col items-center gap-1 px-2 text-center text-[14px] leading-relaxed md:text-[16px] mx-auto md:max-w-[520px] font-serif italic opacity-90"
              style={{ color: theme.accentText }}
            >
              <span>
                Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng
                tôi!
              </span>
            </span>

            {/* Ceremonial Centered Couple Signature (Each full name on its own line) */}
            <div
              style={{ color: theme.accentText }}
              className="mt-5 flex flex-col items-center justify-center text-center gap-1 font-serif"
            >
              <span className="text-[15px] sm:text-[16px] md:text-[18px] font-fraunces font-bold tracking-wide whitespace-nowrap">
                {INITIAL_WEDDING_DATA.groomFullName}
              </span>
              <span className="inline-flex items-center justify-center gap-2.5 text-xs opacity-75 my-0.5">
                <span className="h-px w-7 bg-current opacity-40" />
                <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
                <span className="h-px w-7 bg-current opacity-40" />
              </span>
              <span className="text-[15px] sm:text-[16px] md:text-[18px] font-fraunces font-bold tracking-wide whitespace-nowrap">
                {INITIAL_WEDDING_DATA.brideFullName}
              </span>
              <span className="mt-1 text-xs md:text-[13px] tracking-[0.22em] opacity-80 font-medium">
                24 • 12 • 2026
              </span>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
