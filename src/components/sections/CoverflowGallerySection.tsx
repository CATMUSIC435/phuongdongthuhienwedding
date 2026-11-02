"use client";

import React from "react";
import dynamic from "next/dynamic";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useWeddingStore } from "@/store/useWeddingStore";
import { THEME_PALETTES } from "@/data/mockWeddingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CrimsonFloralBackdrop } from "@/components/ui/CrimsonFloralBackdrop";
import { SectionHeading } from "@/components/ui/SectionHeading";

const PixiPhotoCarousel = dynamic(
  () =>
    import("@/components/pixi/PixiPhotoCarousel").then(
      (m) => m.PixiPhotoCarousel
    ),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-[380px] sm:h-[420px] flex items-center justify-center">
        <div className="w-56 h-80 rounded-[22px] border border-[#ffe8a4]/30 bg-black/20 animate-pulse" />
      </div>
    ),
  }
);

export function CoverflowGallerySection() {
  const {
    activePhotoIndex,
    galleryPhotos,
    themeId,
    setActivePhoto,
    nextPhoto,
    prevPhoto,
  } = useWeddingStore();

  const theme = THEME_PALETTES[themeId];
  const photos = galleryPhotos;
  const total = photos.length;

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
        {/* Standardized Cream Line-Art Floral Branches */}
        <CrimsonFloralBackdrop
          rightTopClass="-top-[17px] md:-top-[23px]"
          leftTopClass="top-[203px] md:top-[276px]"
        />

        <div className="relative z-10 flex w-full flex-col items-center py-[32px] px-2 md:px-4">
          <SectionHeading
            title="Album Ảnh Cưới"
            color={theme.accentText}
            floralVariant="garland"
            floralPalette="gold"
            className="mb-1"
          />

          {/* PixiJS 2:3 Golden Framed Photo Carousel */}
          <div className="relative w-full max-w-[430px] md:max-w-[580px]">
            <button
              type="button"
              onClick={() => prevPhoto(total)}
              aria-label="Ảnh trước"
              className="flex absolute left-1.5 md:left-1 top-1/2 -translate-y-1/2 z-30 w-9 h-9 items-center justify-center rounded-full bg-black/45 hover:bg-black/75 text-[#ffe8a4] border border-[#ffe8a4]/35 transition-all cursor-pointer shadow-lg"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              type="button"
              onClick={() => nextPhoto(total)}
              aria-label="Ảnh tiếp theo"
              className="flex absolute right-1.5 md:right-1 top-1/2 -translate-y-1/2 z-30 w-9 h-9 items-center justify-center rounded-full bg-black/45 hover:bg-black/75 text-[#ffe8a4] border border-[#ffe8a4]/35 transition-all cursor-pointer shadow-lg"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            <PixiPhotoCarousel
              photos={photos}
              activeIndex={activePhotoIndex}
              onSelectIndex={(idx) => setActivePhoto(idx)}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
