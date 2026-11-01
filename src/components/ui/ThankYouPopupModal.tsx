"use client";

import React, { useEffect } from "react";
import confetti from "canvas-confetti";
import { Heart, Sparkles, X } from "lucide-react";
import { PortalModal } from "@/components/ui/PortalModal";
import { BloomingFloralSvg } from "@/components/effects/BloomingFloralSvg";

interface ThankYouPopupModalProps {
  isOpen: boolean;
  onClose: () => void;
  variant: "wish" | "rsvp";
  senderName: string;
  message?: string;
  rsvpDetails?: {
    side: "groom" | "bride";
    attending: "yes" | "maybe" | "no";
    guestsCount: number;
  };
}

const FLOATING_HEARTS = [
  { left: "16%", delay: "0ms", duration: "2400ms", hx: "-14px", size: 13 },
  { left: "28%", delay: "320ms", duration: "2600ms", hx: "10px", size: 10 },
  { left: "50%", delay: "150ms", duration: "2300ms", hx: "-6px", size: 15 },
  { left: "72%", delay: "480ms", duration: "2500ms", hx: "12px", size: 11 },
  { left: "84%", delay: "220ms", duration: "2700ms", hx: "-12px", size: 13 },
];

export function ThankYouPopupModal({
  isOpen,
  onClose,
  variant,
  senderName,
  message,
  rsvpDetails,
}: ThankYouPopupModalProps) {
  useEffect(() => {
    if (!isOpen) return;

    try {
      confetti({
        particleCount: 55,
        spread: 70,
        origin: { y: 0.58 },
        colors: ["#FFE8A4", "#FDCB9C", "#D4AF37", "#990000"],
      });
      const timer = setTimeout(() => {
        confetti({
          particleCount: 35,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.65 },
          colors: ["#FFE8A4", "#FFF9E6", "#FDCB9C"],
        });
        confetti({
          particleCount: 35,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.65 },
          colors: ["#FFE8A4", "#FFF9E6", "#FDCB9C"],
        });
      }, 240);
      return () => clearTimeout(timer);
    } catch {
      // ignore if canvas-confetti fails
    }
  }, [isOpen]);

  const attendingMap: Record<string, string> = {
    yes: "Sẽ tham dự chung vui",
    maybe: "Có thể tham dự",
    no: "Gửi lời chúc từ xa",
  };

  return (
    <PortalModal isOpen={isOpen} onClose={onClose}>
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          animation:
            "songhy-thankyou-pop 460ms cubic-bezier(0.22, 1, 0.36, 1) forwards",
        }}
        className="relative w-full max-w-[390px] sm:max-w-[430px] overflow-hidden rounded-[26px] border-2 border-[#fdcb9c] bg-[#fff9e6] shadow-[0_24px_70px_rgba(0,0,0,0.68)]"
      >
        {/* Top Royal Crimson Header with Blooming Gold Crest */}
        <div
          style={{
            background:
              "radial-gradient(circle at 50% 18%, #9e0b0f 0%, #6d0002 68%, #470001 100%)",
          }}
          className="relative overflow-hidden px-6 pt-6 pb-8 text-center text-[#ffe8a4]"
        >
          {/* Subtle Oriental Cloud Pattern Overlay */}
          <div
            style={{
              backgroundImage: "url(/images/themes/song-hy-v2-red/cloud-pattern.webp)",
              backgroundSize: "240px auto",
              opacity: 0.14,
            }}
            className="pointer-events-none absolute inset-0"
          />

          {/* Close Button */}
          <button
            type="button"
            onClick={onClose}
            aria-label="Đóng thông báo"
            className="absolute right-3.5 top-3.5 z-20 rounded-full p-1.5 text-[#ffe8a4]/80 transition-colors hover:bg-white/15 hover:text-[#ffe8a4] cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>

          {/* Floating Heart Particles */}
          <div className="pointer-events-none absolute inset-x-0 bottom-3 h-16 overflow-hidden">
            {FLOATING_HEARTS.map((item, idx) => (
              <span
                key={idx}
                style={
                  {
                    left: item.left,
                    animation: `songhy-heart-rise ${item.duration} ease-out ${item.delay} infinite`,
                    "--hx": item.hx,
                  } as React.CSSProperties
                }
                className="absolute bottom-0 inline-block text-[#ffe8a4]/85"
              >
                <Heart
                  style={{ width: item.size, height: item.size }}
                  className="fill-[#ffe8a4] text-[#ffe8a4]"
                />
              </span>
            ))}
          </div>

          {/* Solemn Song Hỷ Emblem */}
          <div className="relative z-10 mx-auto flex flex-col items-center">
            <span className="text-[28px] leading-none text-[#ffe8a4] drop-shadow-[0_2px_8px_rgba(0,0,0,0.35)] select-none">
              囍
            </span>

            <BloomingFloralSvg
              variant="crest"
              palette="gold"
              className="mt-1.5 h-[36px] w-[195px]"
            />

            <p className="mt-1.5 text-[11px] uppercase tracking-[0.22em] text-[#fdcb9c]/90 font-serif font-semibold">
              {variant === "wish"
                ? "Sổ Lưu Bút Trăm Năm"
                : "Xác Nhận Hiện Diện"}
            </p>
            <h3 className="mt-1 font-fraunces text-[20px] sm:text-[22px] font-bold uppercase tracking-wide text-[#ffe8a4] drop-shadow-xs">
              {variant === "wish"
                ? "Cảm Ơn Lời Chúc!"
                : "Gửi Xác Nhận Thành Công!"}
            </h3>
          </div>
        </div>

        {/* Center Overlapping Animated Checkmark Medallion */}
        <div className="relative z-20 -mt-7 flex justify-center">
          <div className="relative flex h-14 w-14 items-center justify-center rounded-full border-2 border-[#fdcb9c] bg-[#8c0000] shadow-[0_8px_20px_rgba(140,0,0,0.38)]">
            <svg
              viewBox="0 0 36 36"
              className="h-8 w-8 text-[#ffe8a4]"
              fill="none"
            >
              <circle
                cx="18"
                cy="18"
                r="15"
                stroke="currentColor"
                strokeOpacity="0.28"
                strokeWidth="1.5"
              />
              <path
                d="M10.5 18.5L15.8 23.6L25.8 13.2"
                stroke="currentColor"
                strokeWidth="2.8"
                strokeLinecap="round"
                strokeLinejoin="round"
                style={{
                  strokeDasharray: 60,
                  strokeDashoffset: 0,
                  animation:
                    "songhy-check-draw 620ms cubic-bezier(0.22, 1, 0.36, 1) 140ms both",
                }}
              />
            </svg>
          </div>
        </div>

        {/* Cream Paper Content Body */}
        <div className="relative px-6 pt-3 pb-6 text-center text-[#5c0001]">
          {/* Corner Blooming Floral Ornaments */}
          <BloomingFloralSvg
            variant="corner"
            palette="crimson"
            className="pointer-events-none absolute left-2.5 top-2 h-10 w-10 opacity-45"
          />
          <BloomingFloralSvg
            variant="corner"
            palette="crimson"
            className="pointer-events-none absolute right-2.5 top-2 h-10 w-10 -scale-x-100 opacity-45"
          />

          <p className="text-xs uppercase tracking-[0.16em] text-[#8c0000]/75 font-serif font-semibold">
            Trân trọng cảm ơn quý khách
          </p>
          <h4 className="mt-0.5 font-carattere text-[36px] sm:text-[40px] leading-tight text-[#8c0000]">
            {senderName}
          </h4>

          {variant === "wish" && message ? (
            <div className="mt-2.5 rounded-2xl border border-[#8c0000]/20 bg-white/75 px-4 py-3 text-left shadow-inner">
              <p className="text-[11px] font-serif uppercase tracking-wider text-[#8c0000]/70 mb-1 flex items-center gap-1">
                <Sparkles className="h-3 w-3 text-[#8c0000]" />
                <span>Lời chúc đã gửi tới cô dâu &amp; chú rể:</span>
              </p>
              <p className="max-h-[110px] overflow-y-auto text-[13.5px] sm:text-sm italic leading-relaxed text-[#420001] break-words">
                &ldquo;{message}&rdquo;
              </p>
            </div>
          ) : null}

          {variant === "rsvp" && rsvpDetails ? (
            <div className="mt-2.5 rounded-2xl border border-[#8c0000]/20 bg-white/75 px-4 py-3 text-xs sm:text-[13px] font-serif text-[#420001] shadow-inner space-y-1">
              <div className="font-bold text-[#8c0000] uppercase tracking-wider">
                {attendingMap[rsvpDetails.attending] || "Sẽ tham dự"}
              </div>
              <div>
                Tiệc:{" "}
                <strong className="text-[#8c0000]">
                  {rsvpDetails.side === "bride"
                    ? "Nhà Gái (15:00 Chiều 23/12 • Thu Hiền)"
                    : "Nhà Trai (24/12 • Phương Đông)"}
                </strong>
              </div>
              <div>
                Số lượng khách: <strong>{rsvpDetails.guestsCount} người</strong>
              </div>
            </div>
          ) : null}

          <p className="mt-3 text-[13px] sm:text-sm leading-relaxed text-[#5c0001]/90 font-serif">
            {variant === "wish"
              ? "Tình cảm và lời chúc tốt đẹp của bạn là món quà vô giá đối với vợ chồng mình trong ngày trọng đại."
              : "Gia đình hai bên rất hân hạnh được đón tiếp bạn tại buổi tiệc mừng hạnh phúc trăm năm."}
          </p>

          {/* Solemn Couple Signature */}
          <div className="mt-3.5 flex flex-col items-center border-t border-[#8c0000]/15 pt-3 font-serif text-[#8c0000]">
            <span className="text-[13px] sm:text-sm font-bold tracking-wide">
              Phạm Phương Đông
            </span>
            <div className="my-0.5 flex items-center gap-2 opacity-75">
              <span className="h-px w-6 bg-[#8c0000]" />
              <span className="text-[10px]">♥</span>
              <span className="h-px w-6 bg-[#8c0000]" />
            </div>
            <span className="text-[13px] sm:text-sm font-bold tracking-wide">
              Nguyễn Thị Thu Hiền
            </span>
            <span className="mt-0.5 text-[11px] tracking-[0.22em] opacity-75">
              24 • 12 • 2026
            </span>
          </div>

          {/* Close Action Button */}
          <button
            type="button"
            onClick={onClose}
            className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#8c0000] px-6 py-2.5 font-serif text-xs sm:text-sm font-bold uppercase tracking-widest text-[#ffe8a4] shadow-md transition-transform hover:scale-[1.02] active:scale-95 cursor-pointer"
          >
            <span>Đóng Lại</span>
          </button>
        </div>
      </div>
    </PortalModal>
  );
}
