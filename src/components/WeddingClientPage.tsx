"use client";

import React from "react";
import dynamic from "next/dynamic";
import { useWeddingStore } from "@/store/useWeddingStore";
import { THEME_PALETTES } from "@/data/mockWeddingData";
import { EnvelopeGate } from "@/components/sections/EnvelopeGate";
import { HeroArchSection } from "@/components/sections/HeroArchSection";
import { FamilyCeremonySection } from "@/components/sections/FamilyCeremonySection";
import { CoverflowGallerySection } from "@/components/sections/CoverflowGallerySection";
import { ReceptionCalendarSection } from "@/components/sections/ReceptionCalendarSection";
import { VenueMapDressCodeSection } from "@/components/sections/VenueMapDressCodeSection";
import { WeddingTimelineSection } from "@/components/sections/WeddingTimelineSection";
import { GuestbookSection } from "@/components/sections/GuestbookSection";
import { LuckyGiftBoxSection } from "@/components/sections/LuckyGiftBoxSection";
import { AmbientParticles } from "@/components/effects/AmbientParticles";
import { FloatingControls } from "@/components/ui/FloatingControls";
import { LazyViewportSection } from "@/components/ui/LazyViewportSection";

const PixiWeddingEffects = dynamic(
  () =>
    import("@/components/pixi/PixiWeddingEffects").then(
      (m) => m.PixiWeddingEffects
    ),
  { ssr: false }
);

interface WeddingClientPageProps {
  initialGuestName?: string;
  initialGuestRelation?: string;
  initialOpen?: boolean;
}

export function WeddingClientPage({
  initialGuestName = "",
  initialGuestRelation,
  initialOpen = false,
}: WeddingClientPageProps) {
  const {
    isEnvelopeOpen,
    isUnsealing,
    particlesEnabled,
    themeId,
    setGuestInfo,
    finishOpenEnvelope,
  } = useWeddingStore();
  const theme = THEME_PALETTES[themeId];

  // Hydrate store from SSR-resolved guest info (and open flag), with client-side fallback for ?id=
  React.useEffect(() => {
    setGuestInfo(initialGuestName, initialGuestRelation);
    if (initialOpen) {
      finishOpenEnvelope();
    }

    if (!initialGuestName && typeof window !== "undefined") {
      const sp = new URLSearchParams(window.location.search);
      const idParam = (sp.get("id") || "").trim();
      if (idParam) {
        fetch(`/api/guest?id=${encodeURIComponent(idParam)}`, {
          cache: "no-store",
        })
          .then((r) => r.json())
          .then((data) => {
            if (data?.name) {
              setGuestInfo(data.name, initialGuestRelation);
            }
          })
          .catch(() => {});
      }
    }
  }, [
    initialGuestName,
    initialGuestRelation,
    initialOpen,
    setGuestInfo,
    finishOpenEnvelope,
  ]);

  const opened = isEnvelopeOpen || initialOpen;

  return (
    <main className="min-h-screen w-full relative overflow-x-hidden">
      {/* Persistent Audio Engine, Top Toast & Single Gift Box Button */}
      <FloatingControls />

      {/* Single Persistent WebGL Silk Petals & Ambient 囍 Layer (Zero WebGL re-init stutter on open!) */}
      <PixiWeddingEffects
        enabled={opened ? particlesEnabled : true}
        variant={opened ? "invitation" : "envelope"}
        burstActive={isUnsealing}
      />
      <AmbientParticles
        density={10}
        variant={opened ? "invitation" : "envelope"}
      />

      {!opened ? (
        <div className="w-full">
          <EnvelopeGate
            initialGuestName={initialGuestName}
            initialGuestRelation={initialGuestRelation}
          />
        </div>
      ) : (
        <div
          style={{
            background: `radial-gradient(circle at 50% 0%, ${theme.bgDeep} 0%, ${theme.bgDark} 100%)`,
            animation: "songhy-fade-up 340ms cubic-bezier(0.22,1,0.36,1)",
            willChange: "transform, opacity",
          }}
          className="flex w-full justify-center overflow-x-clip min-h-screen"
        >
          {/* Main Showcase Card Container (matching 441px mobile / 600px desktop frame with smooth rounded corners) */}
          <div
            data-testid="song-hy-v2-red-template"
            className="relative w-full max-w-[441px] md:max-w-[600px] mx-auto sm:my-4 sm:rounded-[28px] overflow-hidden sm:border sm:border-[#ffe8a433] shadow-[0_0_90px_rgba(0,0,0,0.65)] isolate"
            style={{
              backgroundColor: theme.bgPrimary,
              color: theme.accentText,
            }}
          >
            {/* 1. Above-the-fold: Hero Couple Short Names & Oriental Arch Photo (Instant 0ms render) */}
            <HeroArchSection />

            {/* 2. Above-the-fold: Family Parents, Couple Calligraphy & Ceremony Dates (Instant 0ms render) */}
            <FamilyCeremonySection />

            {/* 3. Progressive Lazy Viewport: PixiJS WebGL Photo Carousel & Fullscreen Lightbox */}
            <LazyViewportSection
              minHeight={460}
              rootMargin="550px 0px"
              idleMountDelayMs={220}
            >
              <CoverflowGallerySection />
            </LazyViewportSection>

            {/* 4. Progressive Lazy Viewport: Reception Details, Live Countdown, Heart Calendar & RSVP Modal */}
            <LazyViewportSection
              minHeight={680}
              rootMargin="550px 0px"
              idleMountDelayMs={140}
            >
              <ReceptionCalendarSection />
            </LazyViewportSection>

            {/* 5. Progressive Lazy Viewport: Mapbox 3D Venue & Live Directions */}
            <LazyViewportSection
              minHeight={390}
              rootMargin="500px 0px"
              idleMountDelayMs={650}
            >
              <VenueMapDressCodeSection />
            </LazyViewportSection>

            {/* 6. Progressive Lazy Viewport: Wedding Day Timeline with Folk Art Badges */}
            <LazyViewportSection
              minHeight={380}
              rootMargin="550px 0px"
              idleMountDelayMs={340}
            >
              <WeddingTimelineSection />
            </LazyViewportSection>

            {/* 7. Progressive Lazy Viewport: Guestbook with Magic AI Wish Wand & Confetti */}
            <LazyViewportSection
              minHeight={480}
              rootMargin="550px 0px"
              idleMountDelayMs={460}
            >
              <GuestbookSection />
            </LazyViewportSection>

            {/* 8. Progressive Lazy Viewport: Twin Red Envelopes Gift Box & VietQR Bank Modal + Footer */}
            <LazyViewportSection
              minHeight={480}
              rootMargin="600px 0px"
              idleMountDelayMs={540}
            >
              <LuckyGiftBoxSection />
            </LazyViewportSection>
          </div>
        </div>
      )}
    </main>
  );
}
