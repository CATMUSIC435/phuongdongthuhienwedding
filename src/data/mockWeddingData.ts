export interface TimelineEvent {
  time: string;
  dayTag?: string;
  title: string;
  subtitle?: string;
  badge?: "ring" | "toast" | "cake";
}

export interface WishItem {
  id: string;
  author: string;
  timestamp: string;
  message: string;
  badge?: string;
}

export interface DressCodeColor {
  name: string;
  hex: string;
  border?: string;
}

export interface BankAccountInfo {
  role: string;
  bankName: string;
  bankShort: string;
  accountNumber: string;
  accountHolder: string;
  qrUrl: string;
}

export interface WeddingPhotoItem {
  id: string | number;
  src: string;
  caption: string;
  source?: "local" | "unsplash" | "pixabay";
  objectPosition?: string;
}

export interface ThemePaletteConfig {
  id: "crimson-red" | "royal-burgundy" | "imperial-jade";
  name: string;
  subtitle: string;
  bgPrimary: string;
  bgDeep: string;
  bgDark: string;
  accentText: string;
  accentRose: string;
  paperBg: string;
  paperTextPrimary: string;
  paperTextSecondary: string;
  hueRotate?: string;
}

export const THEME_PALETTES: Record<ThemePaletteConfig["id"], ThemePaletteConfig> = {
  "crimson-red": {
    id: "crimson-red",
    name: "Đỏ Son Truyền Thống",
    subtitle: "Song Hỷ V2 Nguyên Bản",
    bgPrimary: "#8C0000",
    bgDeep: "#5A0000",
    bgDark: "#2F0000",
    accentText: "#FFE8A4",
    accentRose: "#FDCB9C",
    paperBg: "#FFF9E6",
    paperTextPrimary: "#990000",
    paperTextSecondary: "#2F0000",
    hueRotate: "0deg",
  },
  "royal-burgundy": {
    id: "royal-burgundy",
    name: "Đỏ Rượu Hoàng Gia",
    subtitle: "Trầm ấm & Cổ điển",
    bgPrimary: "#580816",
    bgDeep: "#39040E",
    bgDark: "#240208",
    accentText: "#F7DF94",
    accentRose: "#E8B88A",
    paperBg: "#FDF6E4",
    paperTextPrimary: "#6E0B1C",
    paperTextSecondary: "#2B040A",
    hueRotate: "-12deg",
  },
  "imperial-jade": {
    id: "imperial-jade",
    name: "Xanh Ngọc Bích",
    subtitle: "Song Hỷ Xanh Lá",
    bgPrimary: "#0F3D2E",
    bgDeep: "#08261C",
    bgDark: "#041710",
    accentText: "#FFE8A4",
    accentRose: "#E6C994",
    paperBg: "#FFFDF5",
    paperTextPrimary: "#124A37",
    paperTextSecondary: "#07261B",
    hueRotate: "135deg",
  },
};

export const INITIAL_WEDDING_DATA = {
  groomShortName: "Phương Đông",
  groomFullName: "Phạm Phương Đông",
  groomParents: ["Phạm Hùng", "Nguyễn Thị Vân"],
  groomParentsAddress: "TDP An Thổ - phường Trà Câu - Quảng Ngãi",
  brideShortName: "Thu Hiền",
  brideFullName: "Nguyễn Thị Thu Hiền",
  brideParents: ["Nguyễn Lệ", "Nguyễn Thị Mai"],
  brideParentsAddress: "TDP An Thổ - phường Trà Câu - Quảng Ngãi",
  announcementText:
    "Hai gia đình trân trọng báo tin lễ thành hôn của hai con chúng tôi",
  weddingDateDisplay: "24 tháng 12, 2026",
  weddingDateISO: "2026-12-24T10:00:00+07:00",
  // Nhà Trai (Chính lễ - Thứ Năm 24/12/2026)
  dayOfWeek: "THỨ NĂM",
  dayNumber: "24",
  monthLabel: "THÁNG 12",
  yearLabel: "2026",
  lunarDate: "Tức ngày 16 tháng 11 năm Bính Ngọ",
  ceremonyTime: "08:30",
  receptionTime: "10:00",
  welcomeTime: "09:30",
  // Nhà Gái (Tổ chức buổi chiều trước bữa - Thứ Tư 23/12/2026)
  brideSideDayOfWeek: "THỨ TƯ",
  brideSideDayNumber: "23",
  brideSideTime: "15:00",
  brideSideLunarDate: "Tức ngày 15 tháng 11 năm Bính Ngọ",
  brideSideVenueLabel: "Tại Tư Gia Nhà Gái",
  // Lịch Tháng 12 / 2026
  calendarMonthHeader: "Tháng 12 / 2026",
  calendarBrideDay: 23,
  calendarHighlightDay: 24,
  // December 1, 2026 is Tuesday (T3), so 1 empty slot (T2)
  calendarEmptyLeadingSlots: 1,
  calendarDaysInMonth: 31,
  venueName: "TDP An Thổ - phường Trà Câu - Quảng Ngãi",
  venueCity: "Thị xã Đức Phổ, Quảng Ngãi, Việt Nam",
  venueFullAddress: "TDP An Thổ - phường Trà Câu - Quảng Ngãi",
  // Tọa độ Nhà Trai (14.8787162, 108.955846 - https://maps.app.goo.gl/5ov7naBZwMCZYEDz8)
  venueLat: 14.8787162,
  venueLng: 108.955846,
  googleMapsDirUrl:
    "https://www.google.com/maps/dir/?api=1&destination=14.8787162,108.955846",
  // Tọa độ Nhà Gái (14.875863461851074, 108.95685423178892)
  brideVenueLat: 14.875863461851074,
  brideVenueLng: 108.95685423178892,
  brideGoogleMapsDirUrl:
    "https://www.google.com/maps/dir/?api=1&destination=14.875863461851074,108.95685423178892",
  googleCalendarUrl:
    "https://www.google.com/calendar/render?action=TEMPLATE&text=%C4%90%C3%A1m%20c%C6%B0%E1%BB%9Bi%20Ph%E1%BA%A1m%20Ph%C6%B0%C6%A1ng%20%C4%90%C3%B4ng%20%26%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Thu%20Hi%E1%BB%81n&dates=20261224T013000Z/20261224T060000Z&ctz=Asia/Ho_Chi_Minh&details=L%E1%BB%85%20th%C3%A0nh%20h%C3%B4n%20c%E1%BB%A7a%20Ph%E1%BA%A1m%20Ph%C6%B0%C6%A1ng%20%C4%90%C3%B4ng%20%26%20Nguy%E1%BB%85n%20Th%E1%BB%8B%20Thu%20Hi%E1%BB%81n%20t%E1%BA%A1i%20X%C3%B3m%203%2C%20An%20Th%E1%BB%95%2C%20Tr%C3%A0%20C%C3%A2u%2C%20Qu%E1%BA%A3ng%20Ng%C3%A3i%20(Nh%C3%A0%20g%C3%A1i%20t%E1%BB%95%20ch%E1%BB%A9c%20chi%E1%BB%81u%2023%2F12%2F2026)&location=14.8787162,108.955846",
  heroPhoto: "/images/photos/photo-1.jpg",
  photos: [
    {
      id: 1,
      src: "/images/photos/photo-1.jpg",
      caption: "Khoảnh khắc trăm năm — Phạm Phương Đông & Nguyễn Thị Thu Hiền",
      source: "local",
      objectPosition: "50% 35%",
    },
    {
      id: 2,
      src: "/images/photos/photo-2.jpg",
      caption: "Hạnh phúc vẹn tròn ngày chung đôi • 24/12/2026",
      source: "local",
      objectPosition: "50% 35%",
    },
    {
      id: 3,
      src: "/images/photos/photo-3.jpg",
      caption: "Duyên khởi sắc son — Trọn đời bên nhau",
      source: "local",
      objectPosition: "50% 35%",
    },
    {
      id: 4,
      src: "/images/photos/photo-4.jpg",
      caption: "Cùng nắm tay đi qua muôn mùa hoa nở",
      source: "local",
      objectPosition: "50% 40%",
    },
  ] as WeddingPhotoItem[],
  dressCodeColors: [
    { name: "Đỏ Rượu Vang", hex: "#8C0000", border: "#ffe8a460" },
    { name: "Kem Sữa Trang Nhã", hex: "#f4efe7", border: "#ffe8a440" },
    { name: "Vàng Champagne", hex: "#e6c786", border: "#ffe8a450" },
    { name: "Đen Tuyền Lịch Lãm", hex: "#2f2a26" },
  ] as DressCodeColor[],
  timeline: [
    {
      time: "15:00",
      dayTag: "Chiều 23/12",
      title: "Tiệc cưới thân mật tại Nhà Gái",
      badge: "toast",
    },
    {
      time: "07:00",
      dayTag: "Sáng 24/12",
      title: "Lễ Vu Quy tại Nhà Gái",
    },
    {
      time: "08:00",
      dayTag: "24/12",
      title: "Đón dâu về Xóm 3, An Thổ, Trà Câu",
    },
    {
      time: "08:30",
      dayTag: "24/12",
      title: "Lễ Thành Hôn tại Nhà Trai",
      badge: "ring",
    },
    {
      time: "09:30",
      dayTag: "24/12",
      title: "Đón tiếp khách quý tại Nhà Trai",
    },
    {
      time: "10:00",
      dayTag: "Trưa 24/12",
      title: "Khai tiệc & Nghi thức cắt bánh cưới",
      badge: "cake",
    },
  ] as TimelineEvent[],
  bankAccounts: {
    groom: {
      role: "Mừng Cưới Nhà Trai (Chú Rể)",
      bankName: "Ngân hàng TMCP Ngoại thương Việt Nam (Vietcombank)",
      bankShort: "Vietcombank",
      accountNumber: "0123456789",
      accountHolder: "PHAM PHUONG DONG",
      qrUrl:
        "https://img.vietqr.io/image/VCB-0000000000-compact2.png?amount=500000&addInfo=Mung%20Cuoi%20Phuong%20Dong%20Thu%20Hien&accountName=PHAM%20PHUONG%20DONG",
    },
    bride: {
      role: "Mừng Cưới Nhà Gái (Cô Dâu)",
      bankName: "Ngân hàng TMCP Kỹ thương Việt Nam (Techcombank)",
      bankShort: "Techcombank",
      accountNumber: "9876543210",
      accountHolder: "NGUYEN THI THU HIEN",
      qrUrl:
        "https://img.vietqr.io/image/TCB-0000000000-compact2.png?amount=500000&addInfo=Mung%20Cuoi%20Thu%20Hien%20Phuong%20Dong&accountName=NGUYEN%20THI%20THU%20HIEN",
    },
  } as Record<"groom" | "bride", BankAccountInfo>,
};

export const INITIAL_WISHES: WishItem[] = [
  {
    id: "w-1",
    author: "Gia đình hai bên",
    timestamp: "08:00 • 24/12/2026",
    message:
      "Chúc hai con Phương Đông & Thu Hiền trăm năm tình viên mãn, bạc đầu nghĩa phu thê!",
    badge: "Gia đình",
  },
  {
    id: "w-2",
    author: "Hội bạn thân Quảng Ngãi",
    timestamp: "09:15 • 24/12/2026",
    message:
      "Mừng ngày vui của Phương Đông và Thu Hiền tại Trà Câu! Chúc hai bạn mãi hạnh phúc rạng ngời.",
    badge: "Bạn thân",
  },
  {
    id: "w-3",
    author: "Anh chị đồng nghiệp",
    timestamp: "10:00 • 24/12/2026",
    message:
      "Chúc mừng hạnh phúc hai em! Mong tổ ấm mới luôn ngập tràn tiếng cười và vạn sự như ý.",
    badge: "Đồng nghiệp",
  },
  {
    id: "w-4",
    author: "Bà con Xóm 3 An Thổ",
    timestamp: "10:30 • 24/12/2026",
    message:
      "Mừng đại hỷ gia đình! Chúc hai cháu sớm sinh quý tử, làm ăn phát đạt.",
    badge: "Láng giềng",
  },
];

export const AI_WISH_TEMPLATES = [
  "Trăm năm tình viên mãn, bạc đầu nghĩa phu thê. Chúc Phương Đông & Thu Hiền mãi hạnh phúc vẹn tròn!",
  "Chúc hai bạn Phương Đông - Thu Hiền từ hôm nay chung một mái nhà, sớm tối có nhau, tiếng cười ngập tràn tổ ấm nhỏ.",
  "Mừng ngày Song Hỷ lâm môn (24/12/2026)! Chúc chú rể Phạm Phương Đông và cô dâu Nguyễn Thị Thu Hiền sắc son một lòng.",
  "Hành trình mới bắt đầu tại quê hương Trà Câu, Quảng Ngãi — chúc hai bạn luôn thấu hiểu và yêu thương nhau nhiều hơn mỗi ngày.",
  "Rượu hồng kết nghĩa tơ duyên, chúc cho Đông - Hiền bình yên trọn đời, giàu sang phú quý rạng ngời!",
];
