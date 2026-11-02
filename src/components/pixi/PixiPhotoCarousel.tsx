"use client";

import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";
import { WeddingPhotoItem } from "@/data/mockWeddingData";

interface PixiPhotoCarouselProps {
  photos: WeddingPhotoItem[];
  activeIndex: number;
  onSelectIndex: (index: number) => void;
}

interface ManagedCardTexture {
  texture: PIXI.Texture;
  cancel: () => void;
}

// Shared decoded HTMLImageElement cache by URL so identical photo sources decode only ONCE
const sharedImageCache = new Map<string, Promise<HTMLImageElement>>();

function loadSharedImage(src: string): Promise<HTMLImageElement> {
  const existing = sharedImageCache.get(src);
  if (existing) return existing;

  const promise = new Promise<HTMLImageElement>((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.decoding = "async";
    img.onload = () => resolve(img);
    img.onerror = (err) => {
      sharedImageCache.delete(src);
      reject(err);
    };
    img.src = src;
  });

  sharedImageCache.set(src, promise);
  return promise;
}

/**
 * Creates a rounded 2:3 framed card canvas (520x780) for a WeddingPhotoItem,
 * respecting `objectPosition` and drawing a refined Oriental gold frame.
 * Safely guards asynchronous `img.onload` so `texture.update()` is never
 * called after the texture or Pixi application has been destroyed.
 */
function createCardCanvasTexture(
  photo: WeddingPhotoItem,
  isDisposed: () => boolean
): ManagedCardTexture {
  const canvas = document.createElement("canvas");
  const W = 520;
  const H = 780;
  canvas.width = W;
  canvas.height = H;
  const ctx = canvas.getContext("2d");

  const drawRoundedRect = (
    c: CanvasRenderingContext2D,
    x: number,
    y: number,
    w: number,
    h: number,
    r: number
  ) => {
    c.beginPath();
    c.moveTo(x + r, y);
    c.lineTo(x + w - r, y);
    c.quadraticCurveTo(x + w, y, x + w, y + r);
    c.lineTo(x + w, y + h - r);
    c.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
    c.lineTo(x + r, y + h);
    c.quadraticCurveTo(x, y + h, x, y + h - r);
    c.lineTo(x, y + r);
    c.quadraticCurveTo(x, y, x + r, y);
    c.closePath();
  };

  if (ctx) {
    drawRoundedRect(ctx, 8, 8, W - 16, H - 16, 28);
    ctx.fillStyle = "#5A0000";
    ctx.fill();
    ctx.lineWidth = 5;
    ctx.strokeStyle = "#FFE8A4";
    ctx.stroke();
  }

  const texture = PIXI.Texture.from(canvas);
  let cancelled = false;

  loadSharedImage(photo.src)
    .then((img) => {
      if (
        cancelled ||
        isDisposed() ||
        !ctx ||
        texture.destroyed ||
        !texture.baseTexture ||
        !texture.baseTexture.resource
      ) {
        return;
      }

      ctx.clearRect(0, 0, W, H);

      // Outer subtle shadow & gold border
      ctx.save();
      drawRoundedRect(ctx, 8, 8, W - 16, H - 16, 28);
      ctx.clip();

      const targetW = W - 16;
      const targetH = H - 16;
      const targetRatio = targetW / targetH;
      const imgW = Math.max(1, img.width);
      const imgH = Math.max(1, img.height);
      const imgRatio = imgW / imgH;

      let posX = 0.5;
      let posY = 0.5;
      if (photo.objectPosition) {
        const parts = photo.objectPosition.trim().split(/\s+/);
        if (parts[0]?.endsWith("%")) posX = parseFloat(parts[0]) / 100;
        if (parts[1]?.endsWith("%")) posY = parseFloat(parts[1]) / 100;
      }

      let sW = imgW;
      let sH = imgH;
      if (imgRatio > targetRatio) {
        sW = imgH * targetRatio;
      } else {
        sH = imgW / targetRatio;
      }

      const sx = Math.max(0, Math.min(imgW - sW, (imgW - sW) * posX));
      const sy = Math.max(0, Math.min(imgH - sH, (imgH - sH) * posY));

      ctx.drawImage(img, sx, sy, sW, sH, 8, 8, targetW, targetH);

      // Bottom subtle vignette
      const grad = ctx.createLinearGradient(0, H * 0.72, 0, H - 8);
      grad.addColorStop(0, "rgba(0,0,0,0)");
      grad.addColorStop(1, "rgba(45,0,0,0.45)");
      ctx.fillStyle = grad;
      ctx.fillRect(8, H * 0.72, targetW, H * 0.28);
      ctx.restore();

      // Outer gold border
      drawRoundedRect(ctx, 8, 8, W - 16, H - 16, 28);
      ctx.lineWidth = 6;
      ctx.strokeStyle = "#FFE8A4";
      ctx.stroke();

      // Inner delicate gold trim
      drawRoundedRect(ctx, 20, 20, W - 40, H - 40, 20);
      ctx.lineWidth = 2;
      ctx.strokeStyle = "rgba(255, 232, 164, 0.55)";
      ctx.stroke();

      try {
        if (
          !cancelled &&
          !isDisposed() &&
          !texture.destroyed &&
          texture.baseTexture &&
          texture.baseTexture.resource
        ) {
          texture.update();
        }
      } catch {
        // Ignore if context was lost or disposed mid-frame
      }
    })
    .catch(() => {});

  return {
    texture,
    cancel: () => {
      cancelled = true;
    },
  };
}

export function PixiPhotoCarousel({
  photos,
  activeIndex,
  onSelectIndex,
}: PixiPhotoCarouselProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const activeIndexRef = useRef(activeIndex);
  const ringTargetRef = useRef(activeIndex);
  const onSelectRef = useRef(onSelectIndex);

  useEffect(() => {
    activeIndexRef.current = activeIndex;
    const total = photos.length;
    if (total <= 0) return;
    const repeatFactor = total < 6 ? Math.ceil(6 / total) : 1;
    const ringTotal = total * repeatFactor;
    const prevRing = ringTargetRef.current;
    const normalizedActive = ((activeIndex % total) + total) % total;

    let bestCandidate = normalizedActive;
    let bestAbsDiff = Infinity;
    for (let r = 0; r < repeatFactor; r++) {
      const candidate = r * total + normalizedActive;
      let diff = (((candidate - prevRing) % ringTotal) + ringTotal) % ringTotal;
      if (diff > ringTotal / 2) diff -= ringTotal;
      if (Math.abs(diff) < bestAbsDiff) {
        bestAbsDiff = Math.abs(diff);
        bestCandidate = candidate;
      }
    }
    ringTargetRef.current = bestCandidate;
  }, [activeIndex, photos.length]);

  useEffect(() => {
    onSelectRef.current = onSelectIndex;
  }, [onSelectIndex]);

  useEffect(() => {
    const container = hostRef.current;
    if (!container || photos.length === 0) return;

    let disposed = false;
    const isDisposed = () => disposed;

    const initW = Math.max(280, container.clientWidth || 380);
    const initH = Math.max(280, container.clientHeight || 380);

    let app: PIXI.Application | null = null;
    try {
      app = new PIXI.Application({
        width: initW,
        height: initH,
        backgroundAlpha: 0,
        antialias: true,
        autoDensity: true,
        resolution: Math.min(window.devicePixelRatio || 1, 2),
        powerPreference: "high-performance",
      });
    } catch {
      return;
    }

    container.innerHTML = "";
    const view = app.view as HTMLCanvasElement;
    view.style.width = "100%";
    view.style.height = "100%";
    view.style.display = "block";
    view.style.touchAction = "pan-y";
    view.style.cursor = "grab";
    container.appendChild(view);

    // Safe ResizeObserver instead of Pixi ResizePlugin so resize never runs after destroy
    const resizeObserver = new ResizeObserver((entries) => {
      if (disposed || !app || !app.renderer) return;
      const entry = entries[0];
      const nextW = Math.max(200, Math.round(entry?.contentRect.width || container.clientWidth || 380));
      const nextH = Math.max(200, Math.round(entry?.contentRect.height || container.clientHeight || 380));
      try {
        app.renderer.resize(nextW, nextH);
      } catch {
        // Ignore if renderer is disposing
      }
    });
    resizeObserver.observe(container);

    const cardsContainer = new PIXI.Container();
    cardsContainer.sortableChildren = true;
    app.stage.addChild(cardsContainer);

    const cardSprites: PIXI.Sprite[] = [];
    const managedCards: ManagedCardTexture[] = [];

    const totalPhotos = photos.length;
    const repeatFactor = totalPhotos < 6 ? Math.ceil(6 / totalPhotos) : 1;
    const ringPhotos = Array.from(
      { length: totalPhotos * repeatFactor },
      (_, idx) => photos[idx % totalPhotos]
    );

    ringPhotos.forEach((photo) => {
      const managed = createCardCanvasTexture(photo, isDisposed);
      managedCards.push(managed);
      const sprite = new PIXI.Sprite(managed.texture);
      sprite.anchor.set(0.5);
      cardsContainer.addChild(sprite);
      cardSprites.push(sprite);
    });

    // Subtle floating gold sparkles inside the carousel stage
    const sparkleGraphics = new PIXI.Graphics();
    sparkleGraphics.beginFill(0xffe8a4, 0.9);
    sparkleGraphics.drawCircle(0, 0, 2.5);
    sparkleGraphics.endFill();
    const sparkleTex = app.renderer.generateTexture(sparkleGraphics);
    sparkleGraphics.destroy();

    const sparkles: {
      s: PIXI.Sprite;
      angle: number;
      speed: number;
      radius: number;
    }[] = [];
    for (let i = 0; i < 16; i++) {
      const s = new PIXI.Sprite(sparkleTex);
      s.anchor.set(0.5);
      s.alpha = 0.4 + Math.random() * 0.5;
      app.stage.addChild(s);
      sparkles.push({
        s,
        angle: (i / 16) * Math.PI * 2,
        speed: 0.012 + Math.random() * 0.015,
        radius: 0.36 + Math.random() * 0.12,
      });
    }

    // Smooth Drag & Tap Interaction
    let continuousIndex = Number.isFinite(ringTargetRef.current)
      ? ringTargetRef.current
      : 0;
    let dragOffsetIndex = 0;
    let isDragging = false;
    let startX = 0;
    let maxMove = 0;

    const onPointerDown = (e: PointerEvent) => {
      if (disposed) return;
      isDragging = true;
      startX = e.clientX;
      maxMove = 0;
      dragOffsetIndex = 0;
      view.style.cursor = "grabbing";
    };

    const onPointerMove = (e: PointerEvent) => {
      if (!isDragging || disposed) return;
      const dx = e.clientX - startX;
      maxMove = Math.max(maxMove, Math.abs(dx));
      dragOffsetIndex = -dx / 150;
    };

    const onPointerUp = (e: PointerEvent) => {
      if (!isDragging || disposed) return;
      isDragging = false;
      view.style.cursor = "grab";
      const total = photos.length;
      if (total <= 0) return;

      if (maxMove > 22) {
        if (dragOffsetIndex > 0.2) {
          onSelectRef.current((activeIndexRef.current + 1) % total);
        } else if (dragOffsetIndex < -0.2) {
          onSelectRef.current((activeIndexRef.current - 1 + total) % total);
        }
        dragOffsetIndex = 0;
        return;
      }

      dragOffsetIndex = 0;
      const rect = view.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const centerX = rect.width / 2;
      const deltaFromCenter = clickX - centerX;
      const centerCardHalfWidth = Math.min(rect.width * 0.32, 130);

      if (deltaFromCenter > centerCardHalfWidth) {
        onSelectRef.current((activeIndexRef.current + 1) % total);
      } else if (deltaFromCenter < -centerCardHalfWidth) {
        onSelectRef.current((activeIndexRef.current - 1 + total) % total);
      }
    };

    view.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("pointermove", onPointerMove);
    window.addEventListener("pointerup", onPointerUp);

    let tick = 0;
    const tickerFn = (delta: number) => {
      if (disposed || !app || !app.renderer) return;
      const safeDelta = Number.isFinite(delta) ? Math.min(Math.max(delta, 0), 2.5) : 1;
      tick += safeDelta;

      const screenW = app.screen.width || 380;
      const screenH = app.screen.height || 380;
      const centerX = screenW / 2;
      const centerY = screenH / 2;
      const ringTotal = cardSprites.length;
      if (ringTotal <= 0) return;

      // Responsive base scale so center card fits 88% of stage height and <= 66% of stage width
      const maxCardH = screenH * 0.88;
      const maxCardW = screenW * 0.66;
      const baseScale = Math.min(maxCardH / 780, maxCardW / 520);
      const spreadX = Math.min(screenW * 0.27, 135);

      const target = (ringTargetRef.current || 0) + dragOffsetIndex;
      let diff = (((target - continuousIndex) % ringTotal) + ringTotal) % ringTotal;
      if (diff > ringTotal / 2) diff -= ringTotal;

      continuousIndex += diff * 0.14 * safeDelta;
      if (!Number.isFinite(continuousIndex)) {
        continuousIndex = ringTargetRef.current || 0;
      }

      for (let i = 0; i < cardSprites.length; i++) {
        const sprite = cardSprites[i];
        // Loop-free modular relative index in [-ringTotal/2, ringTotal/2]
        let rel = (((i - continuousIndex) % ringTotal) + ringTotal) % ringTotal;
        if (rel > ringTotal / 2) rel -= ringTotal;

        const absRel = Math.abs(rel);
        const visible = absRel < 2.8;
        sprite.visible = visible;
        if (!visible) continue;

        const cardScale = baseScale * Math.max(0.64, 1 - absRel * 0.16);
        const floatY = Math.sin(tick * 0.035 + i * 0.9) * 3.5;

        sprite.x = centerX + rel * spreadX;
        sprite.y = centerY + floatY + absRel * 8;
        sprite.scale.set(cardScale);
        sprite.rotation = rel * 0.075;
        sprite.alpha = Math.max(0.25, 1 - absRel * 0.32);
        sprite.zIndex = Math.round(100 - absRel * 20);
      }

      // Orbiting sparkles around the active center card
      for (let i = 0; i < sparkles.length; i++) {
        const sp = sparkles[i];
        sp.angle += sp.speed * safeDelta;
        sp.s.x = centerX + Math.cos(sp.angle) * (screenW * sp.radius);
        sp.s.y = centerY + Math.sin(sp.angle * 1.3) * (screenH * 0.38);
        sp.s.alpha = 0.25 + 0.55 * Math.abs(Math.sin(tick * 0.04 + i));
      }
    };

    app.ticker.add(tickerFn);

    // Pause WebGL carousel ticker automatically when scrolled out of viewport
    let visibilityObserver: IntersectionObserver | null = null;
    if (typeof IntersectionObserver !== "undefined") {
      visibilityObserver = new IntersectionObserver(
        (entries) => {
          if (disposed || !app || !app.ticker) return;
          if (entries[0]?.isIntersecting) {
            app.ticker.start();
          } else {
            app.ticker.stop();
          }
        },
        { rootMargin: "150px 0px" }
      );
      visibilityObserver.observe(container);
    }

    return () => {
      disposed = true;
      visibilityObserver?.disconnect();
      resizeObserver.disconnect();
      view.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("pointermove", onPointerMove);
      window.removeEventListener("pointerup", onPointerUp);
      managedCards.forEach((m) => m.cancel());

      if (app) {
        try {
          app.ticker.stop();
          app.ticker.remove(tickerFn);
          app.destroy(true, {
            children: true,
            texture: false,
            baseTexture: false,
          });
        } catch {
          // Ignore cleanup errors
        }
        app = null;
      }

      managedCards.forEach(({ texture }) => {
        try {
          if (!texture.destroyed && texture.baseTexture) {
            texture.destroy(true);
          }
        } catch {
          // Ignore
        }
      });

      try {
        if (!sparkleTex.destroyed && sparkleTex.baseTexture) {
          sparkleTex.destroy(true);
        }
      } catch {
        // Ignore
      }
    };
  }, [photos]);

  return (
    <div
      ref={hostRef}
      className="relative w-full h-[330px] sm:h-[380px] md:h-[460px] select-none overflow-hidden"
    />
  );
}
