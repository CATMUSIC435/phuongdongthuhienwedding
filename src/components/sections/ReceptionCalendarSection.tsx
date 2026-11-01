"use client";

import React, { useEffect, useState } from "react";
import confetti from "canvas-confetti";
import { CalendarPlus, CheckCircle2, Sparkles, Users, X } from "lucide-react";
import { useWeddingStore } from "@/store/useWeddingStore";
import { INITIAL_WEDDING_DATA, THEME_PALETTES } from "@/data/mockWeddingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { CreamPaperPanel } from "@/components/ui/CreamPaperPanel";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortalModal } from "@/components/ui/PortalModal";
import { LiveCountdown } from "@/components/ui/LiveCountdown";

export function ReceptionCalendarSection() {
  const {
    themeId,
    guestName,
    isRsvpModalOpen,
    rsvpList,
    setRsvpModalOpen,
    submitRsvp,
    showToast,
  } = useWeddingStore();
  const theme = THEME_PALETTES[themeId];
  const { ref, spring, inView } = useScrollReveal({ threshold: 0.12 });

  // RSVP Form State
  const [rsvpName, setRsvpName] = useState("");
  const [rsvpPhone, setRsvpPhone] = useState("");
  const [attending, setAttending] = useState<"yes" | "no" | "maybe">("yes");
  const [guestsCount, setGuestsCount] = useState(1);
  const [side, setSide] = useState<"groom" | "bride">("groom");
  const [dietaryNotes, setDietaryNotes] = useState("");
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (guestName && !rsvpName) {
      setRsvpName(guestName);
    }
  }, [guestName, rsvpName]);

  const handleRsvpSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rsvpName.trim()) return;
    submitRsvp({
      name: rsvpName.trim(),
      phone: rsvpPhone.trim(),
      attending,
      guestsCount,
      side,
      dietaryNotes: dietaryNotes.trim(),
    });
    setSubmittedSuccess(true);
    showToast("Đã gửi xác nhận tham dự thành công! Cảm ơn quý khách.");
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.65 },
        colors: ["#FFE8A4", "#920002", "#FDCB9C"],
      });
    } catch {
      // ignore
    }
    setTimeout(() => {
      setSubmittedSuccess(false);
      setRsvpModalOpen(false);
    }, 1500);
  };

  // Calendar configuration from INITIAL_WEDDING_DATA (Tháng 12 / 2026, days 23 & 24)
  const emptyDays = Array.from(
    { length: INITIAL_WEDDING_DATA.calendarEmptyLeadingSlots },
    (_, i) => i
  );
  const monthDays = Array.from(
    { length: INITIAL_WEDDING_DATA.calendarDaysInMonth },
    (_, i) => i + 1
  );

  return (
    <section
      ref={ref}
      className="relative isolate overflow-x-clip -mt-[9px] pt-[32px] md:-mt-[13px] md:pt-[44px]"
    >
      <div
        style={spring}
        className="relative mx-auto w-full max-w-[441px] md:max-w-[600px]"
      >
        <CreamPaperPanel
          showBottomCurtain
          curtainBottomClass="-bottom-[247px] md:-bottom-[529px]"
          sealBottomClass="bottom-[108px] md:bottom-[139px]"
          frameInsetClass="-top-[32px] bottom-0 md:-top-[44px]"
          contentClassName="pt-[16px] pb-[181px] md:pt-[22px] md:pb-[246px] px-6 sm:px-[37px] md:px-[50px]"
        >
          <SectionHeading
            title={<>THÔNG TIN TIỆC&nbsp;CƯỚI</>}
            color={theme.paperTextPrimary}
            floralVariant="crest"
            floralPalette="crimson"
          />

            <div className="mt-[20px] flex w-full flex-col items-center gap-[10px] text-center md:mt-[26px]">
              <h3
                className="uppercase text-balance flex flex-col items-center font-serif font-bold text-[15px] md:text-[18px] tracking-wide"
                style={{ color: theme.paperTextSecondary }}
              >
                <span>Lễ Thành Hôn &amp; Tiệc Cưới chính:</span>
              </h3>

              {/* Time & Day of Week */}
              <div
                className="flex w-full max-w-[175px] items-center justify-center text-[15px] font-bold uppercase md:max-w-[230px] md:text-[19px] whitespace-nowrap gap-x-3 font-serif"
                style={{ color: theme.paperTextSecondary }}
              >
                <span>{INITIAL_WEDDING_DATA.ceremonyTime}</span>
                <span>•</span>
                <span>{INITIAL_WEDDING_DATA.dayOfWeek}</span>
              </div>

              {/* Big Day Number 24 | THÁNG 12 2026 */}
              <div
                className="flex items-center justify-center gap-[10px] md:gap-[14px] font-serif"
                style={{ color: theme.paperTextPrimary }}
              >
                <span className="text-[56px] leading-none md:text-[76px] font-fraunces font-bold">
                  {INITIAL_WEDDING_DATA.dayNumber}
                </span>
                <div
                  className="h-[46px] w-px shrink-0 self-center md:h-[62px]"
                  style={{ backgroundColor: theme.paperTextPrimary }}
                />
                <div className="flex flex-col items-start justify-center gap-1 text-left font-bold">
                  <span className="text-[17px] uppercase leading-none md:text-[22px]">
                    {INITIAL_WEDDING_DATA.monthLabel}
                  </span>
                  <span className="text-[17px] uppercase leading-none md:text-[22px]">
                    {INITIAL_WEDDING_DATA.yearLabel}
                  </span>
                </div>
              </div>

              {/* Lunar Date */}
              <div
                className="text-xs md:text-sm uppercase tracking-normal font-serif italic"
                style={{ color: theme.paperTextSecondary }}
              >
                ({INITIAL_WEDDING_DATA.lunarDate})
              </div>

              {/* 3-Column Schedule Summary: Tiệc Nhà Gái (Chiều 23/12) | Đón Khách (24/12) | Khai Tiệc (24/12) */}
              <div className="grid grid-cols-3 items-center justify-center gap-2 sm:gap-4 mt-3 w-full max-w-[335px] md:max-w-[400px] font-serif">
                <div className="flex flex-col items-center py-2 px-1.5 rounded-xl bg-[#990000]/8 border border-[#990000]/20">
                  <span
                    className="text-[10px] md:text-[11px] uppercase tracking-wider font-semibold"
                    style={{ color: theme.paperTextSecondary }}
                  >
                    Tiệc Nhà Gái
                  </span>
                  <span
                    className="mt-0.5 text-[18px] font-bold md:text-[22px] leading-tight"
                    style={{ color: theme.paperTextPrimary }}
                  >
                    {INITIAL_WEDDING_DATA.brideSideTime}
                  </span>
                  <span
                    className="text-[10px] md:text-[11px] font-medium opacity-80"
                    style={{ color: theme.paperTextSecondary }}
                  >
                    Chiều 23/12
                  </span>
                </div>

                <div className="flex flex-col items-center py-2 px-1.5 rounded-xl bg-white/45 border border-[#990000]/15">
                  <span
                    className="text-[10px] md:text-[11px] uppercase tracking-wider font-semibold"
                    style={{ color: theme.paperTextSecondary }}
                  >
                    Đón khách
                  </span>
                  <span
                    className="mt-0.5 text-[18px] font-bold md:text-[22px] leading-tight"
                    style={{ color: theme.paperTextPrimary }}
                  >
                    {INITIAL_WEDDING_DATA.welcomeTime}
                  </span>
                  <span
                    className="text-[10px] md:text-[11px] font-medium opacity-80"
                    style={{ color: theme.paperTextSecondary }}
                  >
                    Ngày 24/12
                  </span>
                </div>

                <div className="flex flex-col items-center py-2 px-1.5 rounded-xl bg-white/45 border border-[#990000]/15">
                  <span
                    className="text-[10px] md:text-[11px] uppercase tracking-wider font-semibold"
                    style={{ color: theme.paperTextSecondary }}
                  >
                    Khai tiệc
                  </span>
                  <span
                    className="mt-0.5 text-[18px] font-bold md:text-[22px] leading-tight"
                    style={{ color: theme.paperTextPrimary }}
                  >
                    {INITIAL_WEDDING_DATA.receptionTime}
                  </span>
                  <span
                    className="text-[10px] md:text-[11px] font-medium opacity-80"
                    style={{ color: theme.paperTextSecondary }}
                  >
                    Ngày 24/12
                  </span>
                </div>
              </div>

              {/* Isolated 1-Second Live Countdown (Zero Parent Re-renders) */}
              <LiveCountdown
                targetISO={INITIAL_WEDDING_DATA.weddingDateISO}
                primaryColor={theme.paperTextPrimary}
                secondaryColor={theme.paperTextSecondary}
              />

              {/* Mini Calendar: Tháng 12 / 2026 (Highlighting 23/12 Nhà Gái & 24/12 Nhà Trai) */}
              <div className="mt-[22px] mx-auto flex w-full max-w-[321px] flex-col items-center justify-center md:w-[437px] md:max-w-full">
                <div
                  className="w-full max-w-[285px] md:max-w-[320px] mx-auto rounded-2xl overflow-hidden border text-[11px] md:text-[15px] shadow-sm bg-white/40"
                  style={{
                    borderColor: `${theme.paperTextPrimary}44`,
                    color: theme.paperTextPrimary,
                  }}
                >
                  <div
                    className="text-center py-2.5 font-semibold tracking-wide border-b text-[26px] leading-none md:text-[34px] font-nautigal"
                    style={{
                      borderColor: `${theme.paperTextPrimary}44`,
                      color: theme.paperTextPrimary,
                    }}
                  >
                    {INITIAL_WEDDING_DATA.calendarMonthHeader}
                  </div>
                  {/* Weekday Headers */}
                  <div
                    className="grid grid-cols-7 border-b-2 font-serif"
                    style={{ borderColor: theme.paperTextPrimary }}
                  >
                    {["T2", "T3", "T4", "T5", "T6", "T7", "CN"].map((d) => (
                      <div
                        key={d}
                        className="text-center py-1.5 text-[10px] md:text-[11px] font-bold opacity-70"
                      >
                        {d}
                      </div>
                    ))}
                  </div>
                  {/* Days Grid */}
                  <div className="grid grid-cols-7 gap-y-0.5 px-1 py-2 font-serif">
                    {emptyDays.map((e) => (
                      <div
                        key={`empty-${e}`}
                        className="flex items-center justify-center h-[30px] md:h-[34px]"
                      />
                    ))}
                    {monthDays.map((day) => {
                      const isBrideDay =
                        day === INITIAL_WEDDING_DATA.calendarBrideDay;
                      const isWeddingDay =
                        day === INITIAL_WEDDING_DATA.calendarHighlightDay;
                      return (
                        <div
                          key={day}
                          className="flex items-center justify-center h-[30px] md:h-[34px]"
                        >
                          {isWeddingDay ? (
                            <div
                              title="24/12/2026: Lễ Thành Hôn & Tiệc Nhà Trai"
                              style={{
                                opacity: inView ? 1 : 0,
                                transform: inView
                                  ? "scale(1) rotate(0deg)"
                                  : "scale(2.2) rotate(-22deg)",
                                transition:
                                  "opacity 550ms cubic-bezier(0.22,1,0.36,1) 300ms, transform 550ms cubic-bezier(0.22,1,0.36,1) 300ms",
                              }}
                              className="relative w-[28px] h-[26px] md:w-[32px] md:h-[30px] flex items-center justify-center"
                            >
                              <img
                                src="/images/themes/song-hy-v2-red/heart.svg"
                                alt="Ngày cưới 24/12"
                                className="absolute inset-0 w-full h-full object-contain drop-shadow-sm"
                              />
                              <span
                                className="relative z-10 text-[11px] md:text-[12px] font-bold"
                                style={{ color: theme.paperBg }}
                              >
                                {day}
                              </span>
                            </div>
                          ) : isBrideDay ? (
                            <div
                              title="Chiều 23/12/2026 (15:00): Tiệc Cưới Nhà Gái"
                              style={{
                                opacity: inView ? 1 : 0,
                                transform: inView ? "scale(1)" : "scale(1.8)",
                                transition:
                                  "opacity 520ms cubic-bezier(0.22,1,0.36,1) 200ms, transform 520ms cubic-bezier(0.22,1,0.36,1) 200ms",
                              }}
                              className="relative w-[26px] h-[26px] md:w-[29px] md:h-[29px] rounded-full border-2 border-[#990000] bg-[#990000]/15 flex items-center justify-center shadow-xs"
                            >
                              <span
                                className="text-[11px] md:text-[12px] font-bold"
                                style={{ color: theme.paperTextPrimary }}
                              >
                                {day}
                              </span>
                            </div>
                          ) : (
                            <span className="text-[12px] md:text-[13px] font-medium">
                              {day}
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Legend for Day 23 (Nhà Gái) & Day 24 (Nhà Trai) */}
                <div className="mt-2.5 flex flex-wrap items-center justify-center gap-x-4 gap-y-1 text-[11px] md:text-xs font-serif font-semibold">
                  <span
                    className="inline-flex items-center gap-1.5"
                    style={{ color: theme.paperTextSecondary }}
                  >
                    <span className="inline-block w-2.5 h-2.5 rounded-full border-2 border-[#990000] bg-[#990000]/20" />
                    <span>23/12 (Chiều 15:00): Tiệc Nhà Gái</span>
                  </span>
                  <span
                    className="inline-flex items-center gap-1"
                    style={{ color: theme.paperTextPrimary }}
                  >
                    <span>♥</span>
                    <span>24/12: Lễ Thành Hôn &amp; Tiệc Nhà Trai</span>
                  </span>
                </div>
              </div>

              {/* Add to Google Calendar Link */}
              <a
                href={INITIAL_WEDDING_DATA.googleCalendarUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="mt-[14px] inline-flex items-center justify-center gap-1.5 text-[14px] underline underline-offset-4 decoration-1 transition-opacity hover:opacity-70 md:text-[16px] font-serif font-semibold"
                style={{ color: theme.paperTextSecondary }}
              >
                <CalendarPlus className="w-4 h-4" />
                <span>Thêm vào lịch</span>
              </a>
            </div>

            {/* RSVP Button */}
            <div className="relative z-10 mt-[18px] flex w-full flex-col items-center justify-center">
              <button
                type="button"
                onClick={() => setRsvpModalOpen(true)}
                className="inline-flex items-center justify-center gap-2 rounded-full px-7 py-2.5 text-sm font-bold tracking-wider transition-all hover:scale-[1.04] active:scale-95 md:text-base shadow-md cursor-pointer font-serif"
                style={{
                  backgroundColor: theme.paperTextPrimary,
                  color: theme.paperBg,
                }}
              >
                <Sparkles className="w-4 h-4" />
                <span>XÁC NHẬN THAM DỰ</span>
              </button>
              {rsvpList.length > 0 && (
                <span
                  className="mt-2 text-xs font-serif opacity-75"
                  style={{ color: theme.paperTextSecondary }}
                >
                  ✓ Đã ghi nhận {rsvpList.length} phản hồi tham dự
                </span>
              )}
            </div>
        </CreamPaperPanel>
      </div>

      {/* RSVP Modal via Standardized PortalModal */}
      <PortalModal
        isOpen={isRsvpModalOpen}
        onClose={() => setRsvpModalOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: theme.paperBg,
            color: theme.paperTextSecondary,
            animation: "songhy-modal-pop 260ms cubic-bezier(0.22,1,0.36,1)",
          }}
          className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-2xl shadow-2xl border-2 border-[#fdcb9c]"
        >
                {/* Modal Header */}
                <div
                  style={{
                    backgroundColor: theme.bgPrimary,
                    color: theme.accentText,
                  }}
                  className="relative px-6 py-4 text-center"
                >
                  <h3 className="font-fraunces text-lg md:text-xl font-bold uppercase tracking-wider">
                    Xác Nhận Tham Dự
                  </h3>
                  <p className="text-xs opacity-85 mt-1 font-serif whitespace-nowrap">
                    Phương Đông &amp; Thu Hiền • 23–24/12/2026
                  </p>
                  <button
                    type="button"
                    onClick={() => setRsvpModalOpen(false)}
                    className="absolute right-3 top-3 p-1.5 rounded-full hover:bg-white/15 text-[#ffe8a4] cursor-pointer"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {submittedSuccess ? (
                  <div className="p-8 flex flex-col items-center text-center gap-3">
                    <CheckCircle2
                      className="w-14 h-14"
                      style={{ color: theme.paperTextPrimary }}
                    />
                    <h4
                      className="text-xl font-serif font-bold"
                      style={{ color: theme.paperTextPrimary }}
                    >
                      Cảm ơn {rsvpName}!
                    </h4>
                    <p className="text-sm opacity-80">
                      Gia đình hai bên rất hân hạnh được đón tiếp bạn tại buổi
                      tiệc.
                    </p>
                  </div>
                ) : (
                  <form
                    onSubmit={handleRsvpSubmit}
                    className="p-5 sm:p-6 space-y-4 text-sm font-sans"
                  >
                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                        Họ và tên quý khách *
                      </label>
                      <input
                        type="text"
                        required
                        value={rsvpName}
                        onChange={(e) => setRsvpName(e.target.value)}
                        placeholder="Nhập tên của bạn..."
                        className="w-full rounded-lg border border-[#920002]/30 bg-white px-3.5 py-2 focus:outline-none focus:ring-2 focus:ring-[#920002]"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                          Tham dự tiệc bên
                        </label>
                        <select
                          value={side}
                          onChange={(e) =>
                            setSide(e.target.value as "groom" | "bride")
                          }
                          className="w-full rounded-lg border border-[#920002]/30 bg-white px-3 py-2 focus:outline-none"
                        >
                          <option value="groom">
                            Nhà Trai (24/12 • Phương Đông)
                          </option>
                          <option value="bride">
                            Nhà Gái (Chiều 23/12 • Thu Hiền)
                          </option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                          Số người tham dự
                        </label>
                        <div className="flex items-center border border-[#920002]/30 rounded-lg bg-white overflow-hidden">
                          <Users className="w-4 h-4 ml-2.5 opacity-60" />
                          <input
                            type="number"
                            min={1}
                            max={10}
                            value={guestsCount}
                            onChange={(e) =>
                              setGuestsCount(Number(e.target.value) || 1)
                            }
                            className="w-full px-2.5 py-2 focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                        Trạng thái tham dự
                      </label>
                      <div className="grid grid-cols-3 gap-2">
                        {[
                          { id: "yes", label: "Sẽ tham dự" },
                          { id: "maybe", label: "Có thể" },
                          { id: "no", label: "Bận mất rồi" },
                        ].map((opt) => (
                          <button
                            key={opt.id}
                            type="button"
                            onClick={() =>
                              setAttending(opt.id as "yes" | "no" | "maybe")
                            }
                            style={{
                              backgroundColor:
                                attending === opt.id
                                  ? theme.paperTextPrimary
                                  : "white",
                              color:
                                attending === opt.id
                                  ? theme.paperBg
                                  : theme.paperTextSecondary,
                            }}
                            className="py-2 px-2 rounded-lg border border-[#920002]/30 text-xs font-medium transition-colors cursor-pointer"
                          >
                            {opt.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-semibold uppercase tracking-wider mb-1">
                        Số điện thoại / Ghi chú (ăn chay, dị ứng...)
                      </label>
                      <input
                        type="text"
                        value={dietaryNotes}
                        onChange={(e) => setDietaryNotes(e.target.value)}
                        placeholder="VD: 0912xxx - 1 suất chay..."
                        className="w-full rounded-lg border border-[#920002]/30 bg-white px-3.5 py-2 focus:outline-none"
                      />
                    </div>

                    <button
                      type="submit"
                      style={{
                        backgroundColor: theme.paperTextPrimary,
                        color: theme.paperBg,
                      }}
                      className="w-full py-2.5 rounded-lg font-serif font-bold uppercase tracking-wider shadow-md hover:opacity-95 transition-opacity cursor-pointer"
                    >
                      Gửi Xác Nhận
                    </button>
                  </form>
                )}
        </div>
      </PortalModal>
    </section>
  );
}
