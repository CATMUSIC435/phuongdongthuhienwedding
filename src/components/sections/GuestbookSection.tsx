"use client";

import React, { useState } from "react";
import confetti from "canvas-confetti";
import { Send, Wand2 } from "lucide-react";
import { useWeddingStore } from "@/store/useWeddingStore";
import { THEME_PALETTES } from "@/data/mockWeddingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CrimsonFloralBackdrop } from "@/components/ui/CrimsonFloralBackdrop";
import { SectionHeading } from "@/components/ui/SectionHeading";

export function GuestbookSection() {
  const { wishes, guestName, themeId, addWish, getNextAiWish, showToast } =
    useWeddingStore();
  const theme = THEME_PALETTES[themeId];
  const { ref, spring } = useScrollReveal({ threshold: 0.1 });

  const [author, setAuthor] = useState(guestName || "");
  const [message, setMessage] = useState("");
  const [wandSpin, setWandSpin] = useState(false);

  // Sync guestName into author field when loaded asynchronously from Google Sheet (?id=...)
  React.useEffect(() => {
    if (guestName && !author) {
      setAuthor(guestName);
    }
  }, [guestName, author]);

  const handleGenerateAiWish = () => {
    setWandSpin(true);
    const suggestion = getNextAiWish();
    setMessage(suggestion);
    setTimeout(() => setWandSpin(false), 380);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanAuthor = author.trim();
    const cleanMessage = message.trim();
    if (!cleanAuthor || !cleanMessage) return;

    addWish(cleanAuthor, cleanMessage);
    setMessage("");
    showToast("Đã gửi lời chúc tới Phương Đông & Thu Hiền!");

    // Gửi lời chúc qua Gmail App Mail
    fetch("/api/wish", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type: "wish",
        author: cleanAuthor,
        message: cleanMessage,
      }),
    }).catch(() => {
      // ignore network error on client
    });

    try {
      confetti({
        particleCount: 45,
        spread: 60,
        origin: { y: 0.7 },
        colors: ["#FFE8A4", "#FDCB9C", "#FFF9E6"],
      });
    } catch {
      // ignore
    }
  };

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
          rightTopClass="-top-[67px] md:-top-[91px]"
          leftTopClass="top-[203px] md:top-[276px]"
        />

        <div
          className="relative z-10 pb-[30px] pt-[40px] px-5 sm:px-[37px] md:px-[50px]"
          style={{ color: theme.accentText }}
        >
          <SectionHeading
            title="Sổ lưu bút"
            subtitle="Gửi những lời chúc tốt đẹp nhất tới Phương Đông & Thu Hiền"
            color={theme.accentText}
            floralVariant="crest"
            floralPalette="gold"
            className="mb-5"
          />

          {/* Wish Form */}
          <form
            onSubmit={handleSubmit}
            className="mt-4 mx-auto w-full max-w-full md:max-w-[600px]"
          >
            <div className="flex w-full flex-col gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Nhập tên của bạn *"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  maxLength={120}
                  required
                  style={{
                    borderColor: `${theme.accentText}99`,
                    color: theme.accentText,
                  }}
                  className="w-full rounded-xl border bg-black/15 px-3.5 py-2.5 text-sm md:text-base placeholder:text-[#ffe8a4]/50 focus:outline-none focus:ring-2 focus:ring-[#ffe8a4]/60"
                />
              </div>

              <div>
                <textarea
                  placeholder="Nhập lời chúc trăm năm hạnh phúc... *"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  maxLength={2000}
                  required
                  style={{
                    borderColor: `${theme.accentText}99`,
                    color: theme.accentText,
                  }}
                  className="w-full rounded-xl border bg-black/15 px-3.5 py-2.5 text-sm md:text-base placeholder:text-[#ffe8a4]/50 focus:outline-none focus:ring-2 focus:ring-[#ffe8a4]/60 resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1">
                {/* Magic AI Wish Generator Button */}
                <button
                  type="button"
                  onClick={handleGenerateAiWish}
                  style={{
                    backgroundColor: `${theme.accentText}1F`,
                    color: theme.accentText,
                    transform: wandSpin ? "scale(1.08)" : "scale(1)",
                    transition: "transform 280ms cubic-bezier(0.22,1,0.36,1)",
                  }}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-[#ffe8a4]/35 text-xs md:text-sm font-medium hover:bg-[#ffe8a4]/25 transition-colors cursor-pointer whitespace-nowrap"
                  title="Tạo lời chúc gợi ý bằng AI"
                >
                  <span
                    style={{
                      display: "inline-block",
                      transform: wandSpin ? "rotate(360deg)" : "rotate(0deg)",
                      transition: "transform 360ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                  >
                    🪄
                  </span>
                  <Wand2 className="w-3.5 h-3.5 hidden sm:inline" />
                  <span>Gợi ý lời chúc AI</span>
                </button>

                {/* Submit Wish Button */}
                <button
                  type="submit"
                  style={{
                    backgroundColor: theme.accentText,
                    color: theme.bgPrimary,
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-xs md:text-sm font-serif font-bold uppercase tracking-wider shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span>GỬI LỜI CHÚC</span>
                </button>
              </div>
            </div>
          </form>

          {/* Scrollable Wishes Feed */}
          <div className="mt-7 w-full max-h-[460px] space-y-3 overflow-y-auto pr-1 mx-auto max-w-full md:max-w-[600px]">
            {wishes.map((wish) => (
              <div
                key={wish.id}
                style={{
                  borderColor: `${theme.accentText}4D`,
                  backgroundColor: "rgba(255, 255, 255, 0.08)",
                  animation: "songhy-fade-up 340ms cubic-bezier(0.22,1,0.36,1)",
                }}
                className="rounded-xl border p-3.5 sm:p-4 text-sm shadow-md backdrop-blur-[2px]"
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1 border-b border-[#ffe8a4]/15 pb-1.5">
                  <span
                    className="font-bold text-sm md:text-base font-serif leading-snug"
                    style={{ color: theme.accentText }}
                  >
                    {wish.author}
                  </span>
                  <span className="text-[11px] opacity-70 shrink-0 whitespace-nowrap font-sans">
                    {wish.timestamp}
                  </span>
                </div>
                <p className="mt-2 leading-relaxed text-[#fff9e6]/95 text-[13px] sm:text-sm break-words">
                  {wish.message}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
