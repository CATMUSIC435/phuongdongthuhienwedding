"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useWeddingStore } from "@/store/useWeddingStore";
import { THEME_PALETTES } from "@/data/mockWeddingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CrimsonFloralBackdrop } from "@/components/ui/CrimsonFloralBackdrop";
import { SectionHeading } from "@/components/ui/SectionHeading";

const MapboxWeddingVenue = dynamic(
  () =>
    import("@/components/map/MapboxWeddingVenue").then(
      (m) => m.MapboxWeddingVenue
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[300px] sm:h-[340px] rounded-2xl border border-[#ffe8a4]/30 bg-black/20 animate-pulse" />
    ),
  }
);

export function VenueMapDressCodeSection() {
  const { themeId } = useWeddingStore();
  const theme = THEME_PALETTES[themeId];
  const { ref, spring } = useScrollReveal({ threshold: 0.12 });

  return (
    <section
      ref={ref}
      className="relative isolate overflow-x-clip mt-[23px] md:mt-[31px]"
    >
      <div
        style={spring}
        className="relative mx-auto w-full max-w-[441px] md:max-w-[600px]"
      >
        {/* Standardized Cream Floral Line Art Branches */}
        <CrimsonFloralBackdrop
          rightTopClass="-top-[37px] md:-top-[50px]"
          leftTopClass="top-[233px] md:top-[317px]"
        />

        <div className="relative z-10 flex w-full flex-col items-center">
          <div className="relative flex w-full flex-col items-center gap-[14px] px-[20px] pb-[20px] pt-[24px] md:gap-[18px] md:px-[48px] md:pb-[28px] md:pt-[32px]">
            <SectionHeading
              as="h3"
              title={<>Bản đồ &amp; Chỉ đường</>}
              color={theme.accentText}
              floralVariant="crest"
              floralPalette="gold"
            />

            {/* Interactive Mapbox 3D Venue Map & Directions at 14.878851, 108.9506447 */}
            <MapboxWeddingVenue />
          </div>
        </div>
      </div>
    </section>
  );
}
