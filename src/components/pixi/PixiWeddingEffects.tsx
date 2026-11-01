"use client";

import React, { useEffect, useRef } from "react";
import * as PIXI from "pixi.js";

interface PixiWeddingEffectsProps {
  enabled?: boolean;
  variant?: "envelope" | "invitation";
  burstActive?: boolean;
}

interface PetalParticle {
  sprite: PIXI.Sprite;
  vx: number;
  vy: number;
  swaySpeed: number;
  swayAmp: number;
  swayOffset: number;
  rotSpeed: number;
  baseScale: number;
  flipPhase: number;
  flipSpeed: number;
}

interface SparkleParticle {
  sprite: PIXI.Sprite;
  vx: number;
  vy: number;
  twinkleSpeed: number;
  twinkleOffset: number;
  baseAlpha: number;
}

/**
 * Generates a soft silk blossom petal texture on a 64x64 HTML5 Canvas
 * so bounding boxes are 100% exact across all WebGL drivers.
 */
function createCanvasPetalTexture(
  mainColor: string,
  highlightColor: string
): PIXI.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 64;
  canvas.height = 64;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    ctx.save();
    ctx.translate(32, 32);

    const grad = ctx.createLinearGradient(0, -22, 0, 22);
    grad.addColorStop(0, highlightColor);
    grad.addColorStop(0.45, mainColor);
    grad.addColorStop(1, mainColor);

    ctx.beginPath();
    ctx.moveTo(0, -20);
    ctx.bezierCurveTo(18, -14, 20, 10, 0, 22);
    ctx.bezierCurveTo(-20, 10, -18, -14, 0, -20);
    ctx.closePath();
    ctx.fillStyle = grad;
    ctx.fill();

    // Soft inner petal vein glow
    ctx.beginPath();
    ctx.ellipse(-3, -4, 5, 10, -0.2, 0, Math.PI * 2);
    ctx.fillStyle = "rgba(255, 255, 255, 0.25)";
    ctx.fill();

    ctx.restore();
  }

  return PIXI.Texture.from(canvas);
}

/**
 * Generates a soft glowing golden bokeh/sparkle texture on a 48x48 Canvas.
 */
function createCanvasSparkleTexture(): PIXI.Texture {
  const canvas = document.createElement("canvas");
  canvas.width = 48;
  canvas.height = 48;
  const ctx = canvas.getContext("2d");

  if (ctx) {
    const grad = ctx.createRadialGradient(24, 24, 1, 24, 24, 20);
    grad.addColorStop(0, "rgba(255, 252, 235, 0.95)");
    grad.addColorStop(0.35, "rgba(255, 232, 164, 0.55)");
    grad.addColorStop(1, "rgba(255, 232, 164, 0)");
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.arc(24, 24, 20, 0, Math.PI * 2);
    ctx.fill();
  }

  return PIXI.Texture.from(canvas);
}

export function PixiWeddingEffects({
  enabled = true,
  variant = "invitation",
  burstActive = false,
}: PixiWeddingEffectsProps) {
  const hostRef = useRef<HTMLDivElement | null>(null);
  const burstRef = useRef(burstActive);

  useEffect(() => {
    burstRef.current = burstActive;
  }, [burstActive]);

  useEffect(() => {
    const container = hostRef.current;
    if (!container || !enabled) return;

    let disposed = false;
    const initW = Math.max(280, container.clientWidth || window.innerWidth || 380);
    const initH = Math.max(280, container.clientHeight || window.innerHeight || 680);

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
    view.style.pointerEvents = "none";
    container.appendChild(view);

    const resizeObserver = new ResizeObserver((entries) => {
      if (disposed || !app || !app.renderer) return;
      const entry = entries[0];
      const nextW = Math.max(200, Math.round(entry?.contentRect.width || container.clientWidth || window.innerWidth));
      const nextH = Math.max(200, Math.round(entry?.contentRect.height || container.clientHeight || window.innerHeight));
      try {
        app.renderer.resize(nextW, nextH);
      } catch {
        // Ignore if renderer is disposing
      }
    });
    resizeObserver.observe(container);

    const petalTextures = [
      createCanvasPetalTexture("#b80008", "#ff8a8a"),
      createCanvasPetalTexture("#e85d75", "#ffd6de"),
      createCanvasPetalTexture("#f3b67a", "#fff6d6"),
    ];
    const sparkleTex = createCanvasSparkleTexture();

    const isMobile = window.innerWidth < 640;
    const petalCount =
      variant === "envelope" ? (isMobile ? 16 : 26) : isMobile ? 12 : 20;
    const sparkleCount =
      variant === "envelope" ? (isMobile ? 20 : 32) : isMobile ? 14 : 24;

    const petals: PetalParticle[] = [];
    const sparkles: SparkleParticle[] = [];

    const w = app.screen.width || window.innerWidth;
    const h = app.screen.height || window.innerHeight;

    for (let i = 0; i < petalCount; i++) {
      const tex = petalTextures[i % petalTextures.length];
      const sprite = new PIXI.Sprite(tex);
      sprite.anchor.set(0.5);
      sprite.x = Math.random() * w;
      sprite.y = Math.random() * h;

      const baseScale = (isMobile ? 0.28 : 0.34) + Math.random() * 0.24;
      sprite.scale.set(baseScale);
      sprite.alpha = 0.55 + Math.random() * 0.35;
      sprite.rotation = Math.random() * Math.PI * 2;

      app.stage.addChild(sprite);
      petals.push({
        sprite,
        vx: (Math.random() - 0.5) * 0.32,
        vy: 0.5 + Math.random() * 0.75,
        swaySpeed: 0.014 + Math.random() * 0.018,
        swayAmp: 0.35 + Math.random() * 0.65,
        swayOffset: Math.random() * Math.PI * 2,
        rotSpeed: (Math.random() - 0.5) * 0.02,
        baseScale,
        flipPhase: Math.random() * Math.PI * 2,
        flipSpeed: 0.02 + Math.random() * 0.025,
      });
    }

    for (let i = 0; i < sparkleCount; i++) {
      const sprite = new PIXI.Sprite(sparkleTex);
      sprite.anchor.set(0.5);
      sprite.x = Math.random() * w;
      sprite.y = Math.random() * h;
      const s = 0.32 + Math.random() * 0.5;
      sprite.scale.set(s);
      const baseAlpha = 0.25 + Math.random() * 0.5;
      sprite.alpha = baseAlpha;

      app.stage.addChild(sprite);
      sparkles.push({
        sprite,
        vx: (Math.random() - 0.5) * 0.18,
        vy: -0.22 - Math.random() * 0.38,
        twinkleSpeed: 0.025 + Math.random() * 0.04,
        twinkleOffset: Math.random() * Math.PI * 2,
        baseAlpha,
      });
    }

    let tick = 0;
    const tickerFn = (delta: number) => {
      if (disposed || !app || !app.renderer) return;
      const safeDelta = Number.isFinite(delta) ? Math.min(Math.max(delta, 0), 2.5) : 1;
      tick += safeDelta;
      const screenW = app.screen.width || window.innerWidth;
      const screenH = app.screen.height || window.innerHeight;
      const speedMult = burstRef.current ? 2.5 : 1;

      for (let i = 0; i < petals.length; i++) {
        const p = petals[i];
        p.sprite.y += p.vy * safeDelta * speedMult;
        p.sprite.x +=
          (p.vx + Math.sin(tick * p.swaySpeed + p.swayOffset) * p.swayAmp) *
          safeDelta *
          speedMult;
        p.sprite.rotation += p.rotSpeed * safeDelta * speedMult;

        // Gentle 3D petal sway without collapsing width into a thin line
        const flip = Math.cos(tick * p.flipSpeed + p.flipPhase);
        p.sprite.scale.x = p.baseScale * (0.65 + 0.35 * Math.abs(flip));
        p.sprite.scale.y = p.baseScale;

        if (p.sprite.y > screenH + 28) {
          p.sprite.y = -28;
          p.sprite.x = Math.random() * screenW;
        }
        if (p.sprite.x > screenW + 28) p.sprite.x = -28;
        if (p.sprite.x < -28) p.sprite.x = screenW + 28;
      }

      for (let i = 0; i < sparkles.length; i++) {
        const s = sparkles[i];
        s.sprite.x += s.vx * safeDelta * speedMult;
        s.sprite.y += s.vy * safeDelta * speedMult;
        s.sprite.alpha =
          s.baseAlpha *
          (0.45 + 0.55 * Math.sin(tick * s.twinkleSpeed + s.twinkleOffset));

        if (s.sprite.y < -20) {
          s.sprite.y = screenH + 20;
          s.sprite.x = Math.random() * screenW;
        }
      }
    };

    app.ticker.add(tickerFn);

    const onVisibilityChange = () => {
      if (disposed || !app || !app.ticker) return;
      if (document.hidden) {
        app.ticker.stop();
      } else {
        app.ticker.start();
      }
    };
    document.addEventListener("visibilitychange", onVisibilityChange);

    return () => {
      disposed = true;
      document.removeEventListener("visibilitychange", onVisibilityChange);
      resizeObserver.disconnect();
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

      petalTextures.forEach((t) => {
        try {
          if (!t.destroyed && t.baseTexture) {
            t.destroy(true);
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
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div
      ref={hostRef}
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[5] overflow-hidden"
    />
  );
}
