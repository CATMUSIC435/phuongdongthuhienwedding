"use client";

import React, { useEffect, useState } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface LiveCountdownProps {
  targetISO: string;
  primaryColor: string;
  secondaryColor: string;
}

/**
 * Isolated 1-second countdown component so the per-second state tick
 * only re-renders the 4 number boxes and never re-renders the parent section.
 */
export const LiveCountdown: React.FC<LiveCountdownProps> = React.memo(
  ({ targetISO, primaryColor, secondaryColor }) => {
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
      days: 53,
      hours: 22,
      minutes: 0,
      seconds: 0,
    });

    useEffect(() => {
      const target = new Date(targetISO).getTime();
      const update = () => {
        const diff = Math.max(0, target - Date.now());
        setTimeLeft({
          days: Math.floor(diff / (1000 * 60 * 60 * 24)),
          hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((diff / (1000 * 60)) % 60),
          seconds: Math.floor((diff / 1000) % 60),
        });
      };
      update();
      const id = setInterval(update, 1000);
      return () => clearInterval(id);
    }, [targetISO]);

    const items = [
      { label: "Ngày", value: timeLeft.days },
      { label: "Giờ", value: timeLeft.hours },
      { label: "Phút", value: timeLeft.minutes },
      { label: "Giây", value: timeLeft.seconds },
    ];

    return (
      <div className="flex items-center justify-center flex-col mt-4 w-full">
        <h3
          className="text-[17px] uppercase flex flex-col items-center md:text-[21px] font-fraunces font-bold tracking-wider"
          style={{ color: secondaryColor }}
        >
          <span>Cùng đếm&nbsp;ngược</span>
        </h3>
        <div className="mt-2.5 grid grid-cols-4 gap-2 sm:gap-3 w-full max-w-[300px] md:max-w-[340px]">
          {items.map((item) => (
            <div
              key={item.label}
              style={{
                borderColor: `${primaryColor}33`,
                backgroundColor: "rgba(255, 255, 255, 0.6)",
              }}
              className="flex flex-col items-center justify-center py-2.5 px-1 rounded-xl border shadow-sm"
            >
              <span
                style={{ color: primaryColor }}
                className="font-fraunces font-bold text-xl md:text-2xl tabular-nums leading-none"
              >
                {String(item.value).padStart(2, "0")}
              </span>
              <span
                style={{ color: secondaryColor }}
                className="text-[10px] md:text-[11px] uppercase mt-1 opacity-80 font-serif font-semibold"
              >
                {item.label}
              </span>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

LiveCountdown.displayName = "LiveCountdown";
