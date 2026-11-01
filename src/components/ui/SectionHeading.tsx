"use client";

import React from "react";
import { BloomingFloralSvg } from "@/components/effects/BloomingFloralSvg";

interface SectionHeadingProps {
  title: React.ReactNode;
  subtitle?: React.ReactNode;
  color: string;
  floralVariant?: "crest" | "garland";
  floralPalette?: "gold" | "crimson";
  as?: "h2" | "h3";
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Standardized luxury section heading with animated BloomingFloralSvg ornament.
 */
export const SectionHeading: React.FC<SectionHeadingProps> = ({
  title,
  subtitle,
  color,
  floralVariant = "crest",
  floralPalette = "gold",
  as: Tag = "h2",
  className = "",
  style,
}) => {
  return (
    <div
      style={style}
      className={`flex flex-col items-center text-center ${className}`}
    >
      <Tag
        style={{ color }}
        className="uppercase font-bold text-center text-[20px] md:text-[28px] font-fraunces tracking-[0.04em]"
      >
        {title}
      </Tag>
      <BloomingFloralSvg
        variant={floralVariant}
        palette={floralPalette}
        className={
          floralVariant === "garland"
            ? "w-[235px] md:w-[275px] mt-1 mb-1.5"
            : "w-[195px] md:w-[230px] mt-1 mb-1"
        }
      />
      {subtitle && (
        <p
          style={{ color }}
          className="text-xs md:text-sm opacity-80 font-serif text-center mt-0.5"
        >
          {subtitle}
        </p>
      )}
    </div>
  );
};
