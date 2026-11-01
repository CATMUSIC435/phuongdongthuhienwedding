"use client";

import React from "react";
import { CheckCircle2, Gift } from "lucide-react";
import { useWeddingStore } from "@/store/useWeddingStore";
import { THEME_PALETTES } from "@/data/mockWeddingData";
import { ChillAudioEngine } from "@/components/effects/ChillAudioEngine";

export function FloatingControls() {
  const { isEnvelopeOpen, themeId, toast, setGiftModalOpen } =
    useWeddingStore();

  const theme = THEME_PALETTES[themeId];

  return (
    <>
      {/* Persistent TBAYE.aac + Web Audio Chill Melody Engine */}
      <ChillAudioEngine />

      {/* Top-Center Glassmorphic Toast Notification */}
      {toast ? (
        <div
          key={toast.id}
          style={{
            backdropFilter: "blur(10px)",
            WebkitBackdropFilter: "blur(10px)",
            animation: "songhy-modal-pop 280ms cubic-bezier(0.22,1,0.36,1)",
          }}
          className="fixed top-4 left-1/2 -translate-x-1/2 z-[10005] flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/92 text-[#5A0000] border border-[#fdcb9c] shadow-[0_8px_30px_rgba(0,0,0,0.28)] text-xs md:text-sm font-serif font-semibold max-w-[92vw] text-center pointer-events-none"
        >
          <CheckCircle2 className="w-4 h-4 text-[#8C0000] shrink-0" />
          <span className="truncate">{toast.message}</span>
        </div>
      ) : null}

      {/* Single Floating Gift Box Button at Bottom-Right */}
      {isEnvelopeOpen && (
        <div className="fixed bottom-4 right-4 z-[900]">
          <button
            type="button"
            onClick={() => setGiftModalOpen(true)}
            style={{
              backgroundColor: theme.accentText,
              color: theme.bgPrimary,
            }}
            className="w-12 h-12 rounded-full shadow-[0_8px_25px_rgba(0,0,0,0.45)] flex items-center justify-center transition-transform hover:scale-110 active:scale-95 cursor-pointer ring-2 ring-[#ffe8a4]/50"
            aria-label="Mở Hộp Quà Mừng Cưới"
            title="Mở Hộp Quà Mừng Cưới"
          >
            <Gift className="w-5 h-5" />
          </button>
        </div>
      )}
    </>
  );
}
