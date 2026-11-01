"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import {
  INITIAL_WEDDING_DATA,
  INITIAL_WISHES,
  AI_WISH_TEMPLATES,
  WishItem,
  WeddingPhotoItem,
  ThemePaletteConfig,
} from "@/data/mockWeddingData";

export type AlbumMode = "3d" | "masonry" | "grid";
export type ChillAudioMode = "tbaye-chill" | "tbaye-pure" | "harp-lofi";

export interface RsvpRecord {
  id: string;
  name: string;
  phone: string;
  attending: "yes" | "no" | "maybe";
  guestsCount: number;
  side: "groom" | "bride";
  dietaryNotes: string;
  submittedAt: string;
}

export interface ToastPayload {
  id: number;
  message: string;
  type?: "success" | "info";
}

interface WeddingStoreState {
  // 1. Envelope Gate & Guest Personalization
  isEnvelopeOpen: boolean;
  isUnsealing: boolean;
  guestName: string;
  guestRelation: string;

  // 2. Audio (/TBAYE.aac + Chill Melody EQ) & Visual Effects
  isPlayingMusic: boolean;
  musicVolume: number;
  chillAudioMode: ChillAudioMode;
  particlesEnabled: boolean;
  themeId: ThemePaletteConfig["id"];
  sfxTrigger: { type: "gate" | "chime" | "photo" | "wish"; ts: number } | null;
  toast: ToastPayload | null;

  // 3. Album & Lightbox & Supplementary API Photos
  activePhotoIndex: number;
  albumMode: AlbumMode;
  isLightboxOpen: boolean;
  galleryPhotos: WeddingPhotoItem[];

  // 4. Interactive Modals
  isRsvpModalOpen: boolean;
  isGiftModalOpen: boolean;
  activeQrTab: "groom" | "bride";
  isStudioDrawerOpen: boolean;

  // 5. Dynamic User Data (Persisted)
  wishes: WishItem[];
  rsvpList: RsvpRecord[];
  aiWishCursor: number;

  // Editable Couple Customization
  customGroomName: string;
  customBrideName: string;
  customDateDisplay: string;
  customVenueName: string;

  // Actions
  startUnsealEnvelope: () => void;
  finishOpenEnvelope: () => void;
  closeToEnvelope: () => void;
  setGuestInfo: (name: string, relation?: string) => void;
  toggleMusic: () => void;
  setMusicPlaying: (playing: boolean) => void;
  setMusicVolume: (vol: number) => void;
  setChillAudioMode: (mode: ChillAudioMode) => void;
  triggerSfx: (type: "gate" | "chime" | "photo" | "wish") => void;
  showToast: (message: string, type?: "success" | "info") => void;
  toggleParticles: () => void;
  setThemeId: (id: ThemePaletteConfig["id"]) => void;

  setActivePhoto: (index: number) => void;
  nextPhoto: (total: number) => void;
  prevPhoto: (total: number) => void;
  setAlbumMode: (mode: AlbumMode) => void;
  openLightbox: (index?: number) => void;
  closeLightbox: () => void;
  appendSupplementaryPhotos: (newPhotos: WeddingPhotoItem[]) => void;
  resetToLocalPhotos: () => void;

  setRsvpModalOpen: (open: boolean) => void;
  submitRsvp: (record: Omit<RsvpRecord, "id" | "submittedAt">) => void;
  setGiftModalOpen: (open: boolean) => void;
  setActiveQrTab: (tab: "groom" | "bride") => void;
  setStudioDrawerOpen: (open: boolean) => void;

  addWish: (author: string, message: string, badge?: string) => void;
  getNextAiWish: () => string;
  updateCustomCouple: (partial: {
    groom?: string;
    bride?: string;
    date?: string;
    venue?: string;
  }) => void;
}

export const useWeddingStore = create<WeddingStoreState>()(
  persist(
    (set, get) => ({
      isEnvelopeOpen: false,
      isUnsealing: false,
      guestName: "",
      guestRelation: "Trân Trọng Kính Mời",

      isPlayingMusic: false,
      musicVolume: 0.32,
      chillAudioMode: "tbaye-chill",
      particlesEnabled: true,
      themeId: "crimson-red",
      sfxTrigger: null,
      toast: null,

      activePhotoIndex: 0,
      albumMode: "3d",
      isLightboxOpen: false,
      galleryPhotos: INITIAL_WEDDING_DATA.photos,

      isRsvpModalOpen: false,
      isGiftModalOpen: false,
      activeQrTab: "groom",
      isStudioDrawerOpen: false,

      wishes: INITIAL_WISHES,
      rsvpList: [],
      aiWishCursor: 0,

      customGroomName: "Phương Đông",
      customBrideName: "Thu Hiền",
      customDateDisplay: "24 tháng 12, 2026",
      customVenueName: "Xóm 3, An Thổ, Trà Câu, Quảng Ngãi",

      startUnsealEnvelope: () =>
        set({
          isUnsealing: true,
          isPlayingMusic: true,
        }),
      finishOpenEnvelope: () =>
        set((state) => {
          if (state.isEnvelopeOpen && !state.isUnsealing) return state;
          return { isEnvelopeOpen: true, isUnsealing: false };
        }),
      closeToEnvelope: () =>
        set({ isEnvelopeOpen: false, isUnsealing: false }),

      setGuestInfo: (name, relation) =>
        set((state) => {
          const nextName = name ? name.trim() : "";
          const nextRelation = relation || state.guestRelation;
          if (
            state.guestName === nextName &&
            state.guestRelation === nextRelation
          ) {
            return state;
          }
          return {
            guestName: nextName,
            guestRelation: nextRelation,
          };
        }),

      toggleMusic: () =>
        set((state) => ({ isPlayingMusic: !state.isPlayingMusic })),
      setMusicPlaying: (playing) =>
        set((state) =>
          state.isPlayingMusic === playing ? state : { isPlayingMusic: playing }
        ),
      setMusicVolume: (musicVolume) => set({ musicVolume }),
      setChillAudioMode: (chillAudioMode) => set({ chillAudioMode }),
      triggerSfx: () => {},
      showToast: (message, type = "success") => {
        const id = Date.now();
        set({ toast: { id, message, type } });
        setTimeout(() => {
          if (get().toast?.id === id) {
            set({ toast: null });
          }
        }, 3200);
      },
      toggleParticles: () =>
        set((state) => ({ particlesEnabled: !state.particlesEnabled })),
      setThemeId: (themeId) => set({ themeId }),

      setActivePhoto: (index) =>
        set((state) =>
          state.activePhotoIndex === index
            ? state
            : { activePhotoIndex: index }
        ),
      nextPhoto: (total) =>
        set((state) => ({
          activePhotoIndex:
            total > 0 ? (state.activePhotoIndex + 1) % total : 0,
        })),
      prevPhoto: (total) =>
        set((state) => ({
          activePhotoIndex:
            total > 0 ? (state.activePhotoIndex - 1 + total) % total : 0,
        })),
      setAlbumMode: (albumMode) => set({ albumMode }),
      openLightbox: (index) =>
        set((state) => ({
          isLightboxOpen: true,
          activePhotoIndex:
            typeof index === "number" ? index : state.activePhotoIndex,
        })),
      closeLightbox: () => set({ isLightboxOpen: false }),

      appendSupplementaryPhotos: (newPhotos) =>
        set((state) => {
          const existingIds = new Set(state.galleryPhotos.map((p) => p.id));
          const filtered = newPhotos.filter((p) => !existingIds.has(p.id));
          return {
            galleryPhotos: [INITIAL_WEDDING_DATA.photos[0], ...filtered],
            activePhotoIndex: 0,
          };
        }),

      resetToLocalPhotos: () =>
        set({
          galleryPhotos: INITIAL_WEDDING_DATA.photos,
          activePhotoIndex: 0,
        }),

      setRsvpModalOpen: (isRsvpModalOpen) => set({ isRsvpModalOpen }),
      submitRsvp: (record) =>
        set((state) => ({
          rsvpList: [
            {
              ...record,
              id: `rsvp-${Date.now()}`,
              submittedAt: new Date().toLocaleString("vi-VN"),
            },
            ...state.rsvpList,
          ],
        })),

      setGiftModalOpen: (isGiftModalOpen) => set({ isGiftModalOpen }),
      setActiveQrTab: (activeQrTab) => set({ activeQrTab }),
      setStudioDrawerOpen: (isStudioDrawerOpen) => set({ isStudioDrawerOpen }),

      addWish: (author, message, badge = "Khách quý") => {
        const now = new Date();
        const pad = (n: number) => String(n).padStart(2, "0");
        const timestamp = `${pad(now.getHours())}:${pad(
          now.getMinutes()
        )} • ${pad(now.getDate())}/${pad(
          now.getMonth() + 1
        )}/${now.getFullYear()}`;

        set((state) => ({
          wishes: [
            {
              id: `w-${Date.now()}`,
              author: author.trim(),
              message: message.trim(),
              timestamp,
              badge,
            },
            ...state.wishes,
          ],
        }));
      },

      getNextAiWish: () => {
        const idx = get().aiWishCursor;
        const template = AI_WISH_TEMPLATES[idx % AI_WISH_TEMPLATES.length];
        set({
          aiWishCursor: idx + 1,
        });
        return template;
      },

      updateCustomCouple: (partial) =>
        set((state) => ({
          customGroomName: partial.groom ?? state.customGroomName,
          customBrideName: partial.bride ?? state.customBrideName,
          customDateDisplay: partial.date ?? state.customDateDisplay,
          customVenueName: partial.venue ?? state.customVenueName,
        })),
    }),
    {
      name: "song-hy-v2-phuong-dong-thu-hien-v2",
      partialize: (state) => ({
        wishes: state.wishes,
        rsvpList: state.rsvpList,
        themeId: state.themeId,
        musicVolume: state.musicVolume,
        chillAudioMode: state.chillAudioMode,
        customGroomName: state.customGroomName,
        customBrideName: state.customBrideName,
        customDateDisplay: state.customDateDisplay,
        customVenueName: state.customVenueName,
      }),
    }
  )
);
