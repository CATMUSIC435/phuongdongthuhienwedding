import React from "react";
import type { Metadata } from "next";
import { fetchGuestById } from "@/lib/fetchGuestFromSheet";
import { WeddingClientPage } from "@/components/WeddingClientPage";

type SearchParamsMap = Promise<{
  [key: string]: string | string[] | undefined;
}>;

function firstParam(val: string | string[] | undefined): string {
  if (typeof val === "string") return val.trim();
  if (Array.isArray(val) && typeof val[0] === "string") return val[0].trim();
  return "";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: SearchParamsMap;
}): Promise<Metadata> {
  const params = await searchParams;
  const idParam = firstParam(params.id);
  const directGuest =
    firstParam(params.guest) ||
    firstParam(params.khach) ||
    firstParam(params.to);

  let resolvedGuest = directGuest;
  if (idParam) {
    resolvedGuest = await fetchGuestById(idParam);
  }

  const pageTitle = resolvedGuest
    ? `Trân trọng kính mời ${resolvedGuest} | Lễ Thành Hôn Phương Đông & Thu Hiền (24.12.2026)`
    : "Thiệp Cưới Phạm Phương Đông & Nguyễn Thị Thu Hiền | 24.12.2026";

  return {
    title: pageTitle,
    openGraph: {
      title: pageTitle,
      description:
        "Trân trọng kính mời Quý khách đến chung vui cùng hai gia đình tại Xóm 3, An Thổ, Trà Câu, Quảng Ngãi (Tiệc Nhà Gái: 16:00 chiều 23/12/2026 • Lễ Thành Hôn & Tiệc Nhà Trai: 09:30 & 11:00 ngày 24/12/2026).",
      images: [
        {
          url: "/images/photos/og-zalo.jpg?v=2",
          width: 1200,
          height: 630,
          type: "image/jpeg",
          alt: "Ảnh cưới Phạm Phương Đông & Nguyễn Thị Thu Hiền — 24/12/2026",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      images: ["/images/photos/og-zalo.jpg?v=2"],
    },
  };
}

export default async function SongHyWeddingPage({
  searchParams,
}: {
  searchParams: SearchParamsMap;
}) {
  const params = await searchParams;
  const idParam = firstParam(params.id);
  const directGuest =
    firstParam(params.guest) ||
    firstParam(params.khach) ||
    firstParam(params.to);
  const relParam = firstParam(params.rel) || firstParam(params.loimoi);
  const openParam = firstParam(params.open) === "1";

  let initialGuestName = "";
  if (idParam) {
    initialGuestName = await fetchGuestById(idParam);
  } else if (directGuest) {
    initialGuestName = directGuest;
  }

  return (
    <WeddingClientPage
      initialGuestName={initialGuestName}
      initialGuestRelation={relParam || undefined}
      initialOpen={openParam}
    />
  );
}
