"use client";

import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Send, Wand2 } from "lucide-react";
import { useWeddingStore } from "@/store/useWeddingStore";
import { THEME_PALETTES } from "@/data/mockWeddingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CrimsonFloralBackdrop } from "@/components/ui/CrimsonFloralBackdrop";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ThankYouPopupModal } from "@/components/ui/ThankYouPopupModal";

const wishFormSchema = z.object({
  author: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập tên của bạn trước khi gửi.")
    .max(120, "Tên tối đa 120 ký tự."),
  message: z
    .string()
    .trim()
    .min(1, "Vui lòng nhập nội dung lời chúc trước khi gửi.")
    .max(2000, "Lời chúc tối đa 2000 ký tự."),
});

type WishFormValues = z.infer<typeof wishFormSchema>;

export function GuestbookSection() {
  const { wishes, guestName, themeId, addWish, getNextAiWish, showToast } =
    useWeddingStore();
  const theme = THEME_PALETTES[themeId];
  const { ref, spring } = useScrollReveal({ threshold: 0.1 });

  const [wandSpin, setWandSpin] = useState(false);
  const [thankYouPopup, setThankYouPopup] = useState<{
    isOpen: boolean;
    author: string;
    message: string;
  }>({
    isOpen: false,
    author: "",
    message: "",
  });

  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors, isSubmitting },
  } = useForm<WishFormValues>({
    resolver: zodResolver(wishFormSchema),
    defaultValues: {
      author: guestName || "",
      message: "",
    },
  });

  // Sync guestName into author field when loaded from Google Sheet (?id=...)
  useEffect(() => {
    if (guestName && !getValues("author")?.trim()) {
      setValue("author", guestName, { shouldValidate: true });
    }
  }, [guestName, getValues, setValue]);

  const handleGenerateAiWish = () => {
    setWandSpin(true);
    const suggestion = getNextAiWish();
    setValue("message", suggestion, {
      shouldValidate: true,
      shouldDirty: true,
    });
    setTimeout(() => setWandSpin(false), 380);
  };

  const onValidSubmit = async (data: WishFormValues) => {
    const cleanAuthor = data.author.trim();
    const cleanMessage = data.message.trim();

    addWish(cleanAuthor, cleanMessage);
    setValue("message", "", { shouldValidate: false });

    // Mở popup cảm ơn có hiệu ứng chuyển động trang trọng
    setThankYouPopup({
      isOpen: true,
      author: cleanAuthor,
      message: cleanMessage,
    });

    // Gửi lời chúc qua Gmail App Mail (phuongdongiot@gmail.com)
    try {
      await fetch("/api/wish", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "wish",
          author: cleanAuthor,
          message: cleanMessage,
        }),
      });
    } catch {
      // ignore network error on client
    }
  };

  const onInvalidSubmit = () => {
    showToast("Vui lòng nhập đầy đủ tên và nội dung lời chúc trước khi gửi!");
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

          {/* Wish Form validated with react-hook-form + zod */}
          <form
            onSubmit={handleSubmit(onValidSubmit, onInvalidSubmit)}
            noValidate
            className="mt-4 mx-auto w-full max-w-full md:max-w-[600px]"
          >
            <div className="flex w-full flex-col gap-4">
              <div>
                <input
                  type="text"
                  placeholder="Nhập tên của bạn *"
                  maxLength={120}
                  aria-invalid={Boolean(errors.author)}
                  {...register("author")}
                  style={{
                    borderColor: errors.author
                      ? "#FF8080"
                      : `${theme.accentText}99`,
                    color: theme.accentText,
                  }}
                  className="w-full rounded-xl border bg-black/15 px-3.5 py-2.5 text-sm md:text-base placeholder:text-[#ffe8a4]/50 focus:outline-none focus:ring-2 focus:ring-[#ffe8a4]/60"
                />
                {errors.author && (
                  <p className="mt-1.5 text-xs text-[#ffb3b3] font-medium">
                    * {errors.author.message}
                  </p>
                )}
              </div>

              <div>
                <textarea
                  placeholder="Nhập lời chúc trăm năm hạnh phúc... *"
                  rows={3}
                  maxLength={2000}
                  aria-invalid={Boolean(errors.message)}
                  {...register("message")}
                  style={{
                    borderColor: errors.message
                      ? "#FF8080"
                      : `${theme.accentText}99`,
                    color: theme.accentText,
                  }}
                  className="w-full rounded-xl border bg-black/15 px-3.5 py-2.5 text-sm md:text-base placeholder:text-[#ffe8a4]/50 focus:outline-none focus:ring-2 focus:ring-[#ffe8a4]/60 resize-none"
                />
                {errors.message && (
                  <p className="mt-1.5 text-xs text-[#ffb3b3] font-medium">
                    * {errors.message.message}
                  </p>
                )}
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
                  disabled={isSubmitting}
                  style={{
                    backgroundColor: theme.accentText,
                    color: theme.bgPrimary,
                  }}
                  className="inline-flex items-center justify-center gap-2 rounded-full px-5 py-2 text-xs md:text-sm font-serif font-bold uppercase tracking-wider shadow-md transition-transform hover:scale-105 active:scale-95 disabled:opacity-65 cursor-pointer whitespace-nowrap"
                >
                  <Send className="w-3.5 h-3.5 shrink-0" />
                  <span>{isSubmitting ? "ĐANG GỬI..." : "GỬI LỜI CHÚC"}</span>
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

      {/* Animated Thank You Popup Modal */}
      <ThankYouPopupModal
        isOpen={thankYouPopup.isOpen}
        onClose={() =>
          setThankYouPopup((prev) => ({ ...prev, isOpen: false }))
        }
        variant="wish"
        senderName={thankYouPopup.author}
        message={thankYouPopup.message}
      />
    </section>
  );
}
