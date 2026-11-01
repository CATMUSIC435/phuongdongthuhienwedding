"use client";

import React from "react";
import { CheckCircle2 } from "lucide-react";
import { useWeddingStore } from "@/store/useWeddingStore";
import { ChillAudioEngine } from "@/components/effects/ChillAudioEngine";

export function FloatingControls() {
  const { toast } = useWeddingStore();

  return (
    <>
      {/* Persistent Background Music Engine */}
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
    </>
  );
}
