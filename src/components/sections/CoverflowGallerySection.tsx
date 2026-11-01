"use client";

import React, { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { createPortal } from "react-dom";
import {
  ChevronLeft,
  ChevronRight,
  X,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
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
    isLightboxOpen,
    galleryPhotos,
    themeId,
    setActivePhoto,
    nextPhoto,
    prevPhoto,
    openLightbox,
    closeLightbox,
  } = useWeddingStore();

  const theme = THEME_PALETTES[themeId];
  const photos = galleryPhotos;
  const total = photos.length;

  const { ref, spring } = useScrollReveal({ threshold: 0.12 });

  const lightboxTouchStartX = useRef<number | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock body scroll when Lightbox is open & support Escape / Arrow keys
  useEffect(() => {
    if (!isLightboxOpen) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") nextPhoto(total);
      if (e.key === "ArrowLeft") prevPhoto(total);
      if (e.key === "Escape") closeLightbox();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isLightboxOpen, nextPhoto, prevPhoto, closeLightbox, total]);

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
              onOpenLightbox={(idx) => openLightbox(idx)}
            />
          </div>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal (Rendered via Portal into document.body) */}
      {mounted && isLightboxOpen
        ? createPortal(
            <div
              onClick={() => {
                setZoomLevel(1);
                closeLightbox();
              }}
              onTouchStart={(e) => {
                lightboxTouchStartX.current = e.touches[0]?.clientX ?? null;
              }}
              onTouchEnd={(e) => {
                if (lightboxTouchStartX.current === null) return;
                const dx =
                  (e.changedTouches[0]?.clientX ?? 0) -
                  lightboxTouchStartX.current;
                if (dx < -45) nextPhoto(total);
                else if (dx > 45) prevPhoto(total);
                lightboxTouchStartX.current = null;
              }}
              style={{
                animation: "songhy-modal-pop 240ms cubic-bezier(0.22,1,0.36,1)",
              }}
              className="fixed inset-0 z-[10000] bg-black/92 backdrop-blur-md flex flex-col items-center justify-between p-3 sm:p-6 select-none cursor-pointer"
            >
              {/* Top Bar */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="w-full max-w-5xl flex items-center justify-between z-20 cursor-default"
              >
                <div className="text-white text-sm sm:text-base bg-black/50 px-3.5 py-1 rounded-full font-serif">
                  {activePhotoIndex + 1} / {total}
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() =>
                      setZoomLevel((z) =>
                        z >= 1.8 ? 1 : Number((z + 0.4).toFixed(1))
                      )
                    }
                    className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                    title="Phóng to / Thu nhỏ"
                  >
                    {zoomLevel > 1 ? (
                      <ZoomOut className="w-5 h-5" />
                    ) : (
                      <ZoomIn className="w-5 h-5" />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoomLevel(1);
                      closeLightbox();
                    }}
                    className="p-2 rounded-full bg-white/10 hover:bg-white/25 text-white transition-colors cursor-pointer"
                    aria-label="Đóng"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Main Image Viewer */}
              <div className="relative flex-1 w-full max-w-5xl flex items-center justify-center my-2 overflow-hidden">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel(1);
                    prevPhoto(total);
                  }}
                  className="absolute left-1 sm:left-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 cursor-pointer"
                  aria-label="Ảnh trước"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>

                <img
                  src={photos[activePhotoIndex]?.src}
                  alt={photos[activePhotoIndex]?.caption}
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel((z) => (z > 1 ? 1 : 1.5));
                  }}
                  style={{
                    transform: `scale(${zoomLevel})`,
                    transition: "transform 0.25s ease-out",
                    objectPosition:
                      photos[activePhotoIndex]?.objectPosition || "50% 50%",
                  }}
                  className="max-h-[74dvh] max-w-full rounded-xl sm:rounded-2xl object-contain shadow-2xl cursor-zoom-in"
                />

                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setZoomLevel(1);
                    nextPhoto(total);
                  }}
                  className="absolute right-1 sm:right-4 z-20 p-2.5 rounded-full bg-black/50 hover:bg-black/80 text-white border border-white/20 cursor-pointer"
                  aria-label="Ảnh tiếp"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </div>

              {/* Bottom Thumbnail Strip */}
              <div
                onClick={(e) => e.stopPropagation()}
                className="flex gap-2 sm:gap-3 overflow-x-auto px-3 py-2 bg-black/40 rounded-xl backdrop-blur-sm max-w-[92vw] cursor-default"
              >
                {photos.map((thumb, idx) => (
                  <button
                    key={thumb.id}
                    type="button"
                    onClick={() => {
                      setZoomLevel(1);
                      setActivePhoto(idx);
                    }}
                    className={`shrink-0 h-14 w-14 sm:h-16 sm:w-16 rounded-lg overflow-hidden transition-all duration-200 cursor-pointer ${
                      idx === activePhotoIndex
                        ? "ring-2 ring-[#ffe8a4] scale-105 opacity-100"
                        : "opacity-55 hover:opacity-90"
                    }`}
                  >
                    <img
                      src={thumb.src}
                      alt={thumb.caption}
                      style={{
                        objectPosition: thumb.objectPosition || "50% 50%",
                      }}
                      className="h-full w-full object-cover"
                    />
                  </button>
                ))}
              </div>
            </div>,
            document.body
          )
        : null}
    </section>
  );
}
