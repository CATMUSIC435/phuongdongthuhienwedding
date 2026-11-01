"use client";

import React, { useEffect, useRef } from "react";
import { useWeddingStore } from "@/store/useWeddingStore";

/**
 * ChillAudioEngine:
 * Plays `/TBAYE.aac` background music directly in its pure, original studio quality
 * (no Web Audio EQ filters, no delay effects, and no playbackRate alteration).
 */
export function ChillAudioEngine() {
  const { isPlayingMusic, isEnvelopeOpen, musicVolume, setMusicPlaying } =
    useWeddingStore();

  const audioElRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const el = audioElRef.current;
    if (!el) return;

    // Pure original audio playback without any speed or pitch intervention
    el.playbackRate = 1.0;
    el.volume = Math.min(1, Math.max(0, musicVolume));

    if (isPlayingMusic) {
      el.play().catch(() => {
        // Wait for first user gesture if browser blocks autoplay
      });
    } else {
      el.pause();
    }
  }, [isPlayingMusic, musicVolume]);

  // If the page was opened directly via ?open=1, start music on the very first touch/click
  useEffect(() => {
    if (!isEnvelopeOpen) return;

    const tryResumeMusic = () => {
      if (!isPlayingMusic) {
        setMusicPlaying(true);
      } else if (audioElRef.current && audioElRef.current.paused) {
        audioElRef.current.play().catch(() => {});
      }
    };

    window.addEventListener("pointerdown", tryResumeMusic, { once: true });
    return () => window.removeEventListener("pointerdown", tryResumeMusic);
  }, [isEnvelopeOpen, isPlayingMusic, setMusicPlaying]);

  return (
    <div style={{ display: "none" }} aria-hidden="true">
      <audio
        ref={audioElRef}
        src="/TBAYE.aac"
        loop
        preload={isPlayingMusic || isEnvelopeOpen ? "auto" : "none"}
      />
    </div>
  );
}
