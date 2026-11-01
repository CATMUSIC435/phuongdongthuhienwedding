"use client";

import React, { useState } from "react";
import { Check, Copy, Download, Gift, Heart, X } from "lucide-react";
import { useWeddingStore } from "@/store/useWeddingStore";
import { INITIAL_WEDDING_DATA, THEME_PALETTES } from "@/data/mockWeddingData";
import { useScrollReveal } from "@/hooks/useScrollReveal";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { PortalModal } from "@/components/ui/PortalModal";

export function LuckyGiftBoxSection() {
  const {
    isGiftModalOpen,
    activeQrTab,
    themeId,
    setGiftModalOpen,
    setActiveQrTab,
    showToast,
  } = useWeddingStore();
  const theme = THEME_PALETTES[themeId];
  const { ref, spring } = useScrollReveal({ threshold: 0.12 });

  const [isHovered, setIsHovered] = useState(false);
  const [copiedAccount, setCopiedAccount] = useState(false);

  const currentAccount = INITIAL_WEDDING_DATA.bankAccounts[activeQrTab];

  const handleCopyAccount = () => {
    navigator.clipboard?.writeText(currentAccount.accountNumber);
    setCopiedAccount(true);
    showToast(`Đã sao chép STK: ${currentAccount.accountNumber}`);
    setTimeout(() => setCopiedAccount(false), 2000);
  };

  const handleDownloadQr = async () => {
    try {
      const response = await fetch(currentAccount.qrUrl);
      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `QR-Mung-Cuoi-${currentAccount.accountHolder.replace(
        /\s+/g,
        "-"
      )}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      showToast("Đã tải mã QR mừng cưới về máy!");
    } catch {
      window.open(currentAccount.qrUrl, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <>
      <section
        ref={ref}
        className="relative isolate overflow-x-clip mt-[23px] md:mt-[31px]"
      >
        <div
          style={spring}
          className="relative mx-auto w-full max-w-[441px] md:max-w-[600px]"
        >
          {/* Oriental Cloud & Water Wave Pattern at Bottom */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10"
          >
            <img
              src="/images/themes/song-hy-v2-red/cloud-pattern.webp"
              alt=""
              loading="lazy"
              decoding="async"
              aria-hidden="true"
              className="pointer-events-none absolute max-w-none object-contain bottom-[-38%] -left-[191px] h-[239px] w-[824px] opacity-40 md:-left-[260px] md:h-[325px] md:w-[1121px]"
            />
          </div>

          <div className="flex flex-col items-center justify-center py-8 relative z-10 pb-[24px] md:pb-[32px] px-5 sm:px-[37px] md:px-[50px]">
            <SectionHeading
              title={<>Hộp Quà&nbsp;Mừng</>}
              subtitle="Gửi trao lời chúc phúc và tấm lòng mừng hạnh phúc trăm năm"
              color={theme.accentText}
              floralVariant="garland"
              floralPalette="gold"
              className="mb-3"
            />

            {/* Interactive Twin Red Envelopes Button */}
            <button
              type="button"
              onClick={() => setGiftModalOpen(true)}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ width: "250px", height: "355px" }}
              aria-label="Mở hộp mừng cưới"
              className="group relative cursor-pointer outline-none border-none bg-transparent"
            >
              <div className="relative w-full h-full flex items-end justify-center pb-[48px]">
                {/* 4 Twinkling Sparkles */}
                <span
                  style={{
                    top: "6%",
                    left: "12%",
                    color: "#fff9e6",
                    fontSize: "21px",
                  }}
                  className="absolute pointer-events-none z-20 animate-pulse"
                >
                  ✦
                </span>
                <span
                  style={{
                    top: "14%",
                    right: "8%",
                    color: "#fff9e6",
                    fontSize: "15px",
                  }}
                  className="absolute pointer-events-none z-20 animate-ping"
                >
                  ✦
                </span>
                <span
                  style={{
                    top: "34%",
                    left: "3%",
                    color: "#fff9e6",
                    fontSize: "14px",
                  }}
                  className="absolute pointer-events-none z-20 animate-pulse"
                >
                  ✦
                </span>
                <span
                  style={{
                    top: "24%",
                    right: "3%",
                    color: "#fff9e6",
                    fontSize: "14px",
                  }}
                  className="absolute pointer-events-none z-20 animate-pulse"
                >
                  ✦
                </span>

                <div
                  style={{ width: "190px", height: "275px" }}
                  className="relative"
                >
                  {/* Dynamic Ground Shadow */}
                  <div
                    style={{
                      left: "50%",
                      bottom: "-6px",
                      width: "125px",
                      height: "12px",
                      marginLeft: "-62.5px",
                      borderRadius: "50%",
                      backgroundColor: "rgba(0,0,0,0.45)",
                      filter: "blur(4px)",
                      transform: isHovered ? "scaleX(1.18)" : "scaleX(1)",
                      transition: "transform 320ms cubic-bezier(0.22,1,0.36,1)",
                    }}
                    className="absolute pointer-events-none z-0"
                  />

                  {/* Back Red Envelope */}
                  <img
                    src="/images/envelope/song_hy_v2_red.webp"
                    alt="Phong bao lì xì sau"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center bottom",
                      transformOrigin: "50% 100%",
                      transform: isHovered
                        ? "translateX(28%) translateY(-10%) scale(-0.82, 0.82) rotate(-22deg)"
                        : "translateX(20%) translateY(-10%) scale(-0.82, 0.82) rotate(-15deg)",
                      transition: "transform 340ms cubic-bezier(0.22,1,0.36,1)",
                      filter: "drop-shadow(0 8px 14px rgba(0,0,0,0.22))",
                    }}
                    className="absolute inset-0 pointer-events-none z-[1]"
                  />

                  {/* Front Red Envelope */}
                  <img
                    src="/images/envelope/song_hy_v2_red.webp"
                    alt="Phong bao lì xì trước"
                    loading="lazy"
                    decoding="async"
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "contain",
                      objectPosition: "center bottom",
                      transformOrigin: "50% 100%",
                      transform: isHovered
                        ? "rotate(-4deg) scale(1.08)"
                        : "rotate(-10deg) scale(1)",
                      transition: "transform 340ms cubic-bezier(0.22,1,0.36,1)",
                      filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.28))",
                    }}
                    className="absolute inset-0 pointer-events-none z-[2]"
                  />
                </div>
              </div>

              {/* High-Contrast Pill Label with explicit inline colors */}
              <span
                style={{
                  backgroundColor: "#FFE8A4",
                  color: "#8C0000",
                  borderColor: "#FFE8A4",
                }}
                className="absolute bottom-1 left-1/2 -translate-x-1/2 text-xs sm:text-sm font-serif font-bold whitespace-nowrap px-5 py-1.5 rounded-full border shadow-[0_4px_14px_rgba(0,0,0,0.35)] group-hover:scale-105 group-active:scale-95 transition-transform"
              >
                Nhấn để mở phong bao
              </span>
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="relative isolate overflow-x-clip mt-[18px] pb-16 md:mt-[24px]">
        <div className="relative mx-auto w-full max-w-[441px] md:max-w-[600px]">
          <div className="relative z-10 flex flex-col items-center text-center pb-[24px] pt-[20px] px-6 sm:px-[37px] md:px-[50px]">
            <span
              className="whitespace-pre-line flex flex-col items-center gap-1 px-2 text-center text-[14px] leading-relaxed md:text-[16px] mx-auto md:max-w-[520px] font-serif italic opacity-90"
              style={{ color: theme.accentText }}
            >
              <span>
                Sự hiện diện của quý khách là niềm vinh hạnh của gia đình chúng
                tôi!
              </span>
            </span>

            {/* Ceremonial Centered Couple Signature (Each full name on its own line) */}
            <div
              style={{ color: theme.accentText }}
              className="mt-5 flex flex-col items-center justify-center text-center gap-1 font-serif"
            >
              <span className="text-[15px] sm:text-[16px] md:text-[18px] font-fraunces font-bold tracking-wide whitespace-nowrap">
                {INITIAL_WEDDING_DATA.groomFullName}
              </span>
              <span className="inline-flex items-center justify-center gap-2.5 text-xs opacity-75 my-0.5">
                <span className="h-px w-7 bg-current opacity-40" />
                <Heart className="w-3.5 h-3.5 fill-current shrink-0" />
                <span className="h-px w-7 bg-current opacity-40" />
              </span>
              <span className="text-[15px] sm:text-[16px] md:text-[18px] font-fraunces font-bold tracking-wide whitespace-nowrap">
                {INITIAL_WEDDING_DATA.brideFullName}
              </span>
              <span className="mt-1 text-xs md:text-[13px] tracking-[0.22em] opacity-80 font-medium">
                24 • 12 • 2026
              </span>
            </div>
          </div>
        </div>
      </footer>

      {/* VIETQR GIFT BOX MODAL via Standardized PortalModal (Removed 'HỘP QUÀ MỪNG CƯỚI' title text) */}
      <PortalModal
        isOpen={isGiftModalOpen}
        onClose={() => setGiftModalOpen(false)}
      >
        <div
          onClick={(e) => e.stopPropagation()}
          style={{
            backgroundColor: theme.bgDeep,
            animation: "songhy-modal-pop 260ms cubic-bezier(0.22,1,0.36,1)",
          }}
          className="relative w-full max-w-md max-h-[90dvh] overflow-y-auto rounded-[22px] shadow-2xl border-2 border-[#ffe8a4]/50"
        >
          {/* Gold Header (Clean Gift Badge + Close Button, without 'HỘP QUÀ MỪNG CƯỚI' heading) */}
          <div
            style={{ backgroundColor: theme.accentText }}
            className="relative px-6 py-3.5 text-center flex items-center justify-center"
          >
            <button
              type="button"
              onClick={() => setGiftModalOpen(false)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-black/10 hover:bg-black/20 text-[#5A0000] transition-colors cursor-pointer"
              aria-label="Đóng"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="inline-flex items-center justify-center w-11 h-11 rounded-full bg-[#8C0000] text-[#FFE8A4] shadow-md ring-2 ring-[#8C0000]/20">
              <Gift className="w-5 h-5" />
            </div>
          </div>

                {/* Symmetrical 2-Line Tabs: Nhà Trai / Nhà Gái (Zero uneven wrapping!) */}
                <div className="grid grid-cols-2 p-2.5 gap-2.5 bg-black/35">
                  {[
                    {
                      id: "groom",
                      familyLabel: "Nhà Trai",
                      personName: "Phương Đông",
                    },
                    {
                      id: "bride",
                      familyLabel: "Nhà Gái",
                      personName: "Thu Hiền",
                    },
                  ].map((t) => {
                    const isActive = activeQrTab === t.id;
                    return (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() =>
                          setActiveQrTab(t.id as "groom" | "bride")
                        }
                        style={{
                          backgroundColor: isActive
                            ? theme.accentText
                            : "rgba(255, 232, 164, 0.06)",
                          color: isActive ? theme.bgPrimary : theme.accentText,
                          borderColor: isActive
                            ? theme.accentText
                            : "rgba(255, 232, 164, 0.22)",
                        }}
                        className="py-2.5 px-3 rounded-xl border flex flex-col items-center justify-center gap-0.5 transition-all cursor-pointer shadow-xs"
                      >
                        <span className="text-[10px] uppercase tracking-[0.18em] font-sans font-semibold opacity-80 whitespace-nowrap">
                          {t.familyLabel}
                        </span>
                        <span className="text-[14px] sm:text-[15px] font-fraunces font-bold uppercase tracking-wide whitespace-nowrap">
                          {t.personName}
                        </span>
                      </button>
                    );
                  })}
                </div>

                {/* QR Display & Account Details */}
                <div
                  className="p-5 sm:p-6 flex flex-col items-center text-center"
                  style={{ color: theme.accentText }}
                >
                  <h3 className="mb-3 text-base font-serif font-bold tracking-wide">
                    {currentAccount.role}
                  </h3>

                  <div className="w-48 h-48 sm:w-52 sm:h-52 bg-white rounded-2xl p-3 shadow-xl flex items-center justify-center border-2 border-[#ffe8a4]/40">
                    <img
                      src={currentAccount.qrUrl}
                      alt={currentAccount.role}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="mt-4 space-y-1">
                    <p className="text-xs opacity-85 font-serif">
                      {currentAccount.bankName}
                    </p>
                    <p className="text-base sm:text-lg font-mono font-bold tracking-wider">
                      {currentAccount.accountNumber}
                    </p>
                    <p className="text-xs font-semibold uppercase tracking-wider opacity-95">
                      {currentAccount.accountHolder}
                    </p>
                  </div>

                  <div className="mt-5 flex flex-wrap items-center justify-center gap-3 w-full">
                    <button
                      type="button"
                      onClick={handleCopyAccount}
                      style={{
                        backgroundColor: theme.accentText,
                        color: theme.bgPrimary,
                      }}
                      className="px-4 py-2 rounded-full text-xs font-bold inline-flex items-center gap-1.5 shadow hover:scale-105 transition-transform cursor-pointer"
                    >
                      {copiedAccount ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Đã sao chép STK</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Sao chép STK</span>
                        </>
                      )}
                    </button>

                    <button
                      type="button"
                      onClick={handleDownloadQr}
                      style={{
                        color: theme.accentText,
                        backgroundColor: "rgba(255, 232, 164, 0.14)",
                      }}
                      className="px-4 py-2 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 border border-[#ffe8a4]/35 hover:bg-[#ffe8a4]/25 transition-colors cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Lưu QR</span>
                    </button>
                  </div>
                </div>
        </div>
      </PortalModal>
    </>
  );
}
