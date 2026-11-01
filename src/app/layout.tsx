import type { Metadata, Viewport } from "next";
import {
  Carattere,
  Ms_Madi,
  The_Nautigal,
  Fraunces,
  Lora,
  Be_Vietnam_Pro,
} from "next/font/google";
import "./globals.css";

const carattere = Carattere({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-carattere",
  display: "swap",
});

const msMadi = Ms_Madi({
  weight: "400",
  subsets: ["latin", "vietnamese"],
  variable: "--font-ms-madi",
  display: "swap",
});

const theNautigal = The_Nautigal({
  weight: ["400", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-nautigal",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin", "vietnamese"],
  variable: "--font-fraunces",
  display: "swap",
});

const lora = Lora({
  subsets: ["latin", "vietnamese"],
  variable: "--font-lora",
  display: "swap",
});

const beVietnam = Be_Vietnam_Pro({
  weight: ["300", "400", "500", "600", "700"],
  subsets: ["latin", "vietnamese"],
  variable: "--font-be-vietnam",
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: "#8C0000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: {
    default:
      "Thiệp Cưới Phạm Phương Đông & Nguyễn Thị Thu Hiền | 24.12.2026",
    template: "%s | Lễ Thành Hôn Phương Đông & Thu Hiền",
  },
  description:
    "Trân trọng kính mời Quý khách đến dự Lễ Thành Hôn của Phạm Phương Đông & Nguyễn Thị Thu Hiền vào Thứ Năm, ngày 24/12/2026 tại Xóm 3, An Thổ, Trà Câu, Quảng Ngãi (Tiệc Nhà Gái: 16:00 chiều Thứ Tư, 23/12/2026).",
  keywords: [
    "Thiệp cưới Phương Đông Thu Hiền",
    "Phạm Phương Đông",
    "Nguyễn Thị Thu Hiền",
    "Thiệp cưới online Song Hỷ",
    "Đám cưới 24/12/2026",
    "An Thổ Trà Câu Quảng Ngãi",
  ],
  authors: [{ name: "Phạm Phương Đông & Nguyễn Thị Thu Hiền" }],
  creator: "Phạm Phương Đông & Nguyễn Thị Thu Hiền",
  manifest: "/manifest.json",
  icons: {
    icon: [
      { url: "/icon.svg", type: "image/svg+xml" },
      {
        url: "/images/themes/song-hy-v2-red/double-happiness-light.webp",
        type: "image/webp",
      },
    ],
    shortcut: ["/icon.svg"],
    apple: [
      {
        url: "/images/themes/song-hy-v2-red/double-happiness-light.webp",
        sizes: "180x180",
        type: "image/webp",
      },
    ],
  },
  openGraph: {
    type: "website",
    locale: "vi_VN",
    siteName: "Lễ Thành Hôn Phương Đông & Thu Hiền • 24.12.2026",
    title:
      "Trân Trọng Kính Mời | Lễ Thành Hôn Phương Đông & Thu Hiền (24.12.2026)",
    description:
      "Trân trọng kính mời Quý khách đến chung vui cùng hai gia đình tại Xóm 3, An Thổ, Trà Câu, Quảng Ngãi (Tiệc Nhà Gái: 16:00 chiều 23/12/2026 • Lễ Thành Hôn & Tiệc Nhà Trai: 09:30 & 11:00 ngày 24/12/2026).",
    images: [
      {
        url: "/images/photos/photo-1.jpg",
        width: 1200,
        height: 630,
        alt: "Ảnh cưới Phạm Phương Đông & Nguyễn Thị Thu Hiền — 24/12/2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Thiệp Cưới Phạm Phương Đông & Nguyễn Thị Thu Hiền | 24.12.2026",
    description:
      "Trân trọng kính mời Quý khách đến dự Lễ Thành Hôn của Phương Đông & Thu Hiền (Tiệc Nhà Gái: Chiều 23/12/2026 • Lễ Thành Hôn & Tiệc Nhà Trai: 24/12/2026 tại Trà Câu, Quảng Ngãi).",
    images: ["/images/photos/photo-1.jpg"],
  },
  robots: {
    index: true,
    follow: true,
  },
};

const weddingEventJsonLd = {
  "@context": "https://schema.org",
  "@type": "SocialEvent",
  name: "Lễ Thành Hôn Phạm Phương Đông & Nguyễn Thị Thu Hiền",
  description:
    "Lễ Thành Hôn của chú rể Phạm Phương Đông và cô dâu Nguyễn Thị Thu Hiền tại Xóm 3, An Thổ, Trà Câu, Quảng Ngãi (Tiệc Nhà Gái tổ chức lúc 16:00 chiều 23/12/2026).",
  startDate: "2026-12-23T16:00:00+07:00",
  endDate: "2026-12-24T14:00:00+07:00",
  eventStatus: "https://schema.org/EventScheduled",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  location: {
    "@type": "Place",
    name: "Xóm 3, An Thổ, Trà Câu, Quảng Ngãi",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Xóm 3, An Thổ, Trà Câu",
      addressLocality: "Đức Phổ",
      addressRegion: "Quảng Ngãi",
      addressCountry: "VN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: 14.878851,
      longitude: 108.9506447,
    },
  },
  image: ["/images/photos/photo-1.jpg"],
  organizer: {
    "@type": "Person",
    name: "Phạm Phương Đông & Nguyễn Thị Thu Hiền",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="vi"
      className={`${carattere.variable} ${msMadi.variable} ${theNautigal.variable} ${fraunces.variable} ${lora.variable} ${beVietnam.variable}`}
    >
      <head>
        <link
          rel="preload"
          as="image"
          href="/images/themes/song-hy-v2-red/double-happiness-light.webp"
          type="image/webp"
        />
        <link
          rel="preload"
          as="image"
          href="/images/photos/photo-1.jpg"
          type="image/jpeg"
        />
        <link rel="dns-prefetch" href="https://img.vietqr.io" />
        <link rel="dns-prefetch" href="https://api.mapbox.com" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(weddingEventJsonLd),
          }}
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
