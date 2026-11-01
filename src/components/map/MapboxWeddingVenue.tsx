"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Compass,
  ExternalLink,
  Layers,
  Loader2,
  Navigation,
  Route,
} from "lucide-react";
import { INITIAL_WEDDING_DATA, THEME_PALETTES } from "@/data/mockWeddingData";
import { useWeddingStore } from "@/store/useWeddingStore";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type MapStyleId =
  | "mapbox://styles/mapbox/satellite-streets-v12"
  | "mapbox://styles/mapbox/streets-v12";

interface RouteSummary {
  distanceKm: string;
  durationText: string;
}

export function MapboxWeddingVenue() {
  const { themeId, showToast } = useWeddingStore();
  const theme = THEME_PALETTES[themeId];

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userCoordsRef = useRef<[number, number] | null>(null);

  const [mapStyle, setMapStyle] = useState<MapStyleId>(
    "mapbox://styles/mapbox/satellite-streets-v12"
  );
  const [isRouting, setIsRouting] = useState(false);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);

  const lng = INITIAL_WEDDING_DATA.venueLng; // 108.9506447
  const lat = INITIAL_WEDDING_DATA.venueLat; // 14.878851

  // Helper to draw GeoJSON route on Mapbox instance
  const renderRouteLayer = (
    map: mapboxgl.Map,
    geometry: GeoJSON.LineString
  ) => {
    const sourceId = "wedding-route-source";
    const casingLayerId = "wedding-route-casing";
    const lineLayerId = "wedding-route-line";

    const geojsonData: GeoJSON.Feature<GeoJSON.LineString> = {
      type: "Feature",
      properties: {},
      geometry,
    };

    const existingSource = map.getSource(sourceId) as
      | mapboxgl.GeoJSONSource
      | undefined;

    if (existingSource) {
      existingSource.setData(geojsonData);
    } else {
      map.addSource(sourceId, {
        type: "geojson",
        data: geojsonData,
      });

      map.addLayer({
        id: casingLayerId,
        type: "line",
        source: sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#8C0000",
          "line-width": 8,
          "line-opacity": 0.85,
        },
      });

      map.addLayer({
        id: lineLayerId,
        type: "line",
        source: sourceId,
        layout: {
          "line-join": "round",
          "line-cap": "round",
        },
        paint: {
          "line-color": "#FFE8A4",
          "line-width": 4.5,
          "line-opacity": 0.98,
        },
      });
    }
  };

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    const map = new mapboxgl.Map({
      container,
      style: mapStyle,
      center: [lng, lat],
      zoom: 16.3,
      pitch: 52,
      bearing: -12,
      antialias: true,
      attributionControl: false,
    });

    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    // Custom Oriental Double-Happiness 囍 Golden Marker
    const markerEl = document.createElement("div");
    markerEl.style.width = "46px";
    markerEl.style.height = "46px";
    markerEl.style.borderRadius = "9999px";
    markerEl.style.backgroundColor = "#8C0000";
    markerEl.style.border = "2.5px solid #FFE8A4";
    markerEl.style.boxShadow =
      "0 0 0 6px rgba(255, 232, 164, 0.3), 0 8px 20px rgba(0,0,0,0.45)";
    markerEl.style.display = "flex";
    markerEl.style.alignItems = "center";
    markerEl.style.justifyContent = "center";
    markerEl.style.color = "#FFE8A4";
    markerEl.style.fontWeight = "bold";
    markerEl.style.fontSize = "21px";
    markerEl.style.fontFamily = "serif";
    markerEl.style.cursor = "pointer";
    markerEl.title = "Vị trí Lễ Cưới Phương Đông & Thu Hiền";
    markerEl.innerText = "囍";

    const popup = new mapboxgl.Popup({
      offset: 28,
      closeButton: false,
      closeOnClick: false,
    }).setHTML(
      `<div style="padding:5px 8px;color:#5A0000;font-family:serif;text-align:center;">
        <div style="font-weight:bold;font-size:12.5px;color:#8C0000;">囍 LỄ CƯỚI PHƯƠNG ĐÔNG &amp; THU HIỀN</div>
        <div style="font-size:11px;margin-top:2px;">24/12/2026</div>
      </div>`
    );

    const marker = new mapboxgl.Marker({ element: markerEl })
      .setLngLat([lng, lat])
      .setPopup(popup)
      .addTo(map);

    marker.togglePopup();
    markerEl.addEventListener("click", () => {
      map.flyTo({
        center: [lng, lat],
        zoom: 17.4,
        pitch: 60,
        bearing: 15,
        duration: 1800,
        essential: true,
      });
    });

    let disposed = false;
    let lastW = 0;
    let lastH = 0;
    const safeResize = () => {
      if (disposed || !mapRef.current) return;
      try {
        map.resize();
      } catch {
        // ignore if map is disposing
      }
    };

    map.on("load", () => {
      safeResize();
    });

    map.on("style.load", () => {
      safeResize();
      try {
        map.setFog({
          color: "rgb(255, 232, 195)",
          "high-color": "rgb(140, 0, 0)",
          "horizon-blend": 0.08,
        });
      } catch {
        // ignore if style doesn't support fog
      }
    });

    // Ensure Mapbox canvas always stretches 100% edge-to-edge without feedback loops
    const resizeObserver = new ResizeObserver((entries) => {
      if (disposed) return;
      const rect = entries[0]?.contentRect;
      const w = Math.round(rect?.width || container.clientWidth || 0);
      const h = Math.round(rect?.height || container.clientHeight || 0);
      if (w > 0 && h > 0 && (w !== lastW || h !== lastH)) {
        lastW = w;
        lastH = h;
        safeResize();
      }
    });
    resizeObserver.observe(container);

    const t1 = setTimeout(safeResize, 300);
    const t2 = setTimeout(safeResize, 800);

    return () => {
      disposed = true;
      clearTimeout(t1);
      clearTimeout(t2);
      resizeObserver.disconnect();
      try {
        map.remove();
      } catch {
        // ignore
      }
      mapRef.current = null;
    };
  }, [lng, lat, mapStyle]);

  const handleToggleStyle = () => {
    setMapStyle((prev) =>
      prev === "mapbox://styles/mapbox/satellite-streets-v12"
        ? "mapbox://styles/mapbox/streets-v12"
        : "mapbox://styles/mapbox/satellite-streets-v12"
    );
  };

  const handleFlyToVenue = () => {
    const map = mapRef.current;
    if (!map) return;
    map.flyTo({
      center: [lng, lat],
      zoom: 17.5,
      pitch: 62,
      bearing: 20,
      duration: 2000,
      essential: true,
    });
  };

  // Interactive Live Route Calculation using Mapbox Directions API
  const handleDrawLiveRoute = () => {
    if (typeof window === "undefined" || !("geolocation" in navigator)) {
      window.open(INITIAL_WEDDING_DATA.googleMapsDirUrl, "_blank");
      return;
    }

    setIsRouting(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLng = pos.coords.longitude;
        const userLat = pos.coords.latitude;
        userCoordsRef.current = [userLng, userLat];

        try {
          const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLng},${userLat};${lng},${lat}?geometries=geojson&overview=full&language=vi&access_token=${MAPBOX_TOKEN}`;
          const res = await fetch(url);
          const data = await res.json();
          const route = data?.routes?.[0];

          if (route && mapRef.current) {
            const map = mapRef.current;
            renderRouteLayer(map, route.geometry);

            // Place or update Guest Origin Marker
            if (userMarkerRef.current) {
              userMarkerRef.current.remove();
            }
            const originEl = document.createElement("div");
            originEl.style.width = "18px";
            originEl.style.height = "18px";
            originEl.style.borderRadius = "9999px";
            originEl.style.backgroundColor = "#3B82F6";
            originEl.style.border = "3px solid #FFFFFF";
            originEl.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.4)";

            userMarkerRef.current = new mapboxgl.Marker({ element: originEl })
              .setLngLat([userLng, userLat])
              .addTo(map);

            // Fit bounds to show both Guest Location & Wedding Venue
            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend([userLng, userLat]);
            bounds.extend([lng, lat]);
            map.fitBounds(bounds, {
              padding: 54,
              pitch: 42,
              duration: 2000,
            });

            const km = (route.distance / 1000).toFixed(1);
            const mins = Math.max(1, Math.round(route.duration / 60));
            const hours = Math.floor(mins / 60);
            const remMins = mins % 60;
            const durationText =
              hours > 0 ? `${hours} giờ ${remMins} phút` : `${mins} phút`;

            setRouteSummary({ distanceKm: `${km} km`, durationText });
            showToast(`Đã tìm thấy lộ trình (${km} km • ${durationText})`);
          } else {
            window.open(INITIAL_WEDDING_DATA.googleMapsDirUrl, "_blank");
          }
        } catch {
          window.open(INITIAL_WEDDING_DATA.googleMapsDirUrl, "_blank");
        } finally {
          setIsRouting(false);
        }
      },
      () => {
        setIsRouting(false);
        showToast("Mở Google Maps Chỉ Đường tới lễ cưới...");
        window.open(INITIAL_WEDDING_DATA.googleMapsDirUrl, "_blank");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-3.5">
      {/* Full-Bleed Edge-to-Edge 3D Mapbox Container */}
      <div
        className="relative h-[290px] w-full max-w-[365px] overflow-hidden rounded-[16px] md:h-[380px] md:max-w-[490px] border-2 shadow-2xl bg-[#3A0000]"
        style={{ borderColor: `${theme.accentText}77` }}
      >
        {MAPBOX_TOKEN ? (
          <>
            <div
              ref={mapContainerRef}
              className="absolute inset-0 w-full h-full"
            />

            {/* Top-Left Map Controls Inside Frame */}
            <div className="absolute top-2.5 left-2.5 z-10 flex items-center gap-1.5">
              <button
                type="button"
                onClick={handleToggleStyle}
                className="px-2.5 py-1 rounded-full bg-black/65 hover:bg-black/85 backdrop-blur-xs border border-[#ffe8a4]/40 text-[11px] text-[#ffe8a4] font-serif font-medium flex items-center gap-1 cursor-pointer transition-colors shadow"
                title="Chuyển đổi chế độ Bản đồ / Vệ tinh"
              >
                <Layers className="w-3 h-3" />
                <span>
                  {mapStyle.includes("satellite") ? "Bản đồ phố" : "Vệ tinh 3D"}
                </span>
              </button>

              <button
                type="button"
                onClick={handleFlyToVenue}
                className="px-2.5 py-1 rounded-full bg-[#8C0000]/85 hover:bg-[#8C0000] backdrop-blur-xs border border-[#ffe8a4]/45 text-[11px] text-[#ffe8a4] font-serif font-medium flex items-center gap-1 cursor-pointer transition-colors shadow"
                title="Bay 3D về tâm điểm lễ cưới"
              >
                <Compass className="w-3 h-3" />
                <span>Tâm lễ cưới</span>
              </button>
            </div>
          </>
        ) : (
          <iframe
            title="Bản đồ lễ cưới Phương Đông & Thu Hiền"
            src={`https://maps.google.com/maps?q=${lat},${lng}&hl=vi&z=16&output=embed`}
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
          />
        )}

        {/* Live Route Distance & Duration Pill (only shown after guest clicks Lộ trình) */}
        {routeSummary && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-[#ffe8a4]/45 text-xs text-[#ffe8a4] font-serif flex items-center justify-between shadow-lg">
            <span>
              Lộ trình: <strong>{routeSummary.distanceKm}</strong>
            </span>
            <span>
              Dự kiến: <strong>{routeSummary.durationText}</strong>
            </span>
          </div>
        )}
      </div>

      {/* Directions Action Bar: Live Map Route + Google Maps Navigation */}
      <div className="flex flex-wrap items-center justify-center gap-2.5">
        <button
          type="button"
          onClick={handleDrawLiveRoute}
          disabled={isRouting}
          style={{
            backgroundColor: "rgba(255, 232, 164, 0.16)",
            color: theme.accentText,
            borderColor: `${theme.accentText}66`,
          }}
          className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs md:text-sm font-serif font-semibold border hover:bg-[#ffe8a4]/25 transition-all cursor-pointer shadow"
        >
          {isRouting ? (
            <Loader2 className="h-4 w-4 animate-spin shrink-0" />
          ) : (
            <Route className="h-4 w-4 shrink-0" />
          )}
          <span>Vẽ đường từ vị trí của bạn</span>
        </button>

        <a
          href={INITIAL_WEDDING_DATA.googleMapsDirUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: theme.accentText,
            color: theme.bgPrimary,
          }}
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs md:text-sm font-serif font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <Navigation className="h-4 w-4 shrink-0" />
          <span>Chỉ đường Google Maps</span>
          <ExternalLink className="h-3.5 w-3.5 opacity-75" />
        </a>
      </div>
    </div>
  );
}
