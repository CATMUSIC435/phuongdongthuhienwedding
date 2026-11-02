"use client";

import React, { useEffect, useRef, useState } from "react";
import mapboxgl from "mapbox-gl";
import "mapbox-gl/dist/mapbox-gl.css";
import {
  Compass,
  ExternalLink,
  Layers,
  Loader2,
  MapPin,
  Navigation,
  Route,
} from "lucide-react";
import { INITIAL_WEDDING_DATA, THEME_PALETTES } from "@/data/mockWeddingData";
import { useWeddingStore } from "@/store/useWeddingStore";

const MAPBOX_TOKEN = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

type MapStyleId =
  | "mapbox://styles/mapbox/satellite-streets-v12"
  | "mapbox://styles/mapbox/streets-v12";

type VenueSide = "groom" | "bride";

interface RouteSummary {
  distanceKm: string;
  durationText: string;
  sideLabel: string;
}

export function MapboxWeddingVenue() {
  const { themeId, showToast } = useWeddingStore();
  const theme = THEME_PALETTES[themeId];

  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<mapboxgl.Map | null>(null);
  const groomMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const brideMarkerRef = useRef<mapboxgl.Marker | null>(null);
  const userMarkerRef = useRef<mapboxgl.Marker | null>(null);

  const [activeSide, setActiveSide] = useState<VenueSide>("groom");
  const [mapStyle, setMapStyle] = useState<MapStyleId>(
    "mapbox://styles/mapbox/satellite-streets-v12"
  );
  const [isRouting, setIsRouting] = useState(false);
  const [routeSummary, setRouteSummary] = useState<RouteSummary | null>(null);

  // Groom's Family (Nhà Trai): 14.878851, 108.9506447
  const groomLng = INITIAL_WEDDING_DATA.venueLng;
  const groomLat = INITIAL_WEDDING_DATA.venueLat;

  // Bride's Family (Nhà Gái): 14.875863461851074, 108.95685423178892
  const brideLng = INITIAL_WEDDING_DATA.brideVenueLng;
  const brideLat = INITIAL_WEDDING_DATA.brideVenueLat;

  const targetLng = activeSide === "groom" ? groomLng : brideLng;
  const targetLat = activeSide === "groom" ? groomLat : brideLat;
  const targetGoogleMapsUrl =
    activeSide === "groom"
      ? INITIAL_WEDDING_DATA.googleMapsDirUrl
      : INITIAL_WEDDING_DATA.brideGoogleMapsDirUrl;

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
          "line-width": 7,
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
          "line-width": 4,
          "line-opacity": 0.98,
        },
      });
    }
  };

  useEffect(() => {
    const container = mapContainerRef.current;
    if (!container || !MAPBOX_TOKEN) return;

    mapboxgl.accessToken = MAPBOX_TOKEN;

    // Center initially between Groom & Bride venues so both pins are visible
    const midLng = (groomLng + brideLng) / 2;
    const midLat = (groomLat + brideLat) / 2;

    const map = new mapboxgl.Map({
      container,
      style: mapStyle,
      center: [midLng, midLat],
      zoom: 15.1,
      pitch: 48,
      bearing: -10,
      antialias: true,
    });

    mapRef.current = map;

    map.addControl(
      new mapboxgl.NavigationControl({ visualizePitch: true }),
      "top-right"
    );

    const createCompactMarkerElement = (bgColor: string, titleText: string) => {
      const el = document.createElement("div");
      el.style.width = "28px";
      el.style.height = "28px";
      el.style.borderRadius = "9999px";
      el.style.backgroundColor = bgColor;
      el.style.border = "1.5px solid #FFE8A4";
      el.style.boxShadow =
        "0 0 0 3px rgba(255, 232, 164, 0.25), 0 4px 10px rgba(0,0,0,0.4)";
      el.style.display = "flex";
      el.style.alignItems = "center";
      el.style.justifyContent = "center";
      el.style.color = "#FFE8A4";
      el.style.fontWeight = "bold";
      el.style.fontSize = "13px";
      el.style.fontFamily = "serif";
      el.style.cursor = "pointer";
      el.title = titleText;
      el.innerText = "囍";
      return el;
    };

    // 1. Groom's Family Marker (Nhà Trai - 14.878851, 108.9506447)
    const groomEl = createCompactMarkerElement(
      "#8C0000",
      "Nhà Trai • Phạm Phương Đông (24/12/2026)"
    );
    const groomPopup = new mapboxgl.Popup({
      offset: 16,
      closeButton: false,
      closeOnClick: false,
      maxWidth: "165px",
    }).setHTML(
      `<div style="color:#5A0000;font-family:serif;text-align:center;line-height:1.25;white-space:nowrap;">
        <div style="font-weight:bold;font-size:10.5px;color:#8C0000;">囍 Nhà Trai • Phương Đông</div>
        <div style="font-size:9px;opacity:0.85;">08:30 &amp; 10:00 • 24/12/2026</div>
      </div>`
    );
    const groomMarker = new mapboxgl.Marker({ element: groomEl })
      .setLngLat([groomLng, groomLat])
      .setPopup(groomPopup)
      .addTo(map);
    groomMarkerRef.current = groomMarker;
    groomMarker.togglePopup();

    groomEl.addEventListener("click", () => {
      setActiveSide("groom");
      map.flyTo({
        center: [groomLng, groomLat],
        zoom: 17.1,
        pitch: 56,
        bearing: 12,
        duration: 1500,
        essential: true,
      });
    });

    // 2. Bride's Family Marker (Nhà Gái - 14.875863461851074, 108.95685423178892)
    const brideEl = createCompactMarkerElement(
      "#B31237",
      "Nhà Gái • Nguyễn Thị Thu Hiền (15:00 Chiều 23/12/2026)"
    );
    const bridePopup = new mapboxgl.Popup({
      offset: 16,
      closeButton: false,
      closeOnClick: false,
      maxWidth: "165px",
    }).setHTML(
      `<div style="color:#5A0000;font-family:serif;text-align:center;line-height:1.25;white-space:nowrap;">
        <div style="font-weight:bold;font-size:10.5px;color:#B31237;">囍 Nhà Gái • Thu Hiền</div>
        <div style="font-size:9px;opacity:0.85;">15:00 Chiều • 23/12/2026</div>
      </div>`
    );
    const brideMarker = new mapboxgl.Marker({ element: brideEl })
      .setLngLat([brideLng, brideLat])
      .setPopup(bridePopup)
      .addTo(map);
    brideMarkerRef.current = brideMarker;
    brideMarker.togglePopup();

    brideEl.addEventListener("click", () => {
      setActiveSide("bride");
      map.flyTo({
        center: [brideLng, brideLat],
        zoom: 17.1,
        pitch: 56,
        bearing: -14,
        duration: 1500,
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSelectSide = (side: VenueSide) => {
    setActiveSide(side);
    const map = mapRef.current;
    if (!map) return;

    const destLng = side === "groom" ? groomLng : brideLng;
    const destLat = side === "groom" ? groomLat : brideLat;

    map.flyTo({
      center: [destLng, destLat],
      zoom: 16.8,
      pitch: 54,
      bearing: side === "groom" ? 10 : -12,
      duration: 1400,
      essential: true,
    });
  };

  // Switch between Satellite 3D and Streets
  const handleToggleStyle = () => {
    const nextStyle: MapStyleId =
      mapStyle === "mapbox://styles/mapbox/satellite-streets-v12"
        ? "mapbox://styles/mapbox/streets-v12"
        : "mapbox://styles/mapbox/satellite-streets-v12";
    setMapStyle(nextStyle);
    if (mapRef.current) {
      mapRef.current.setStyle(nextStyle);
    }
  };

  const handleShowBothVenues = () => {
    const map = mapRef.current;
    if (!map) return;
    const bounds = new mapboxgl.LngLatBounds();
    bounds.extend([groomLng, groomLat]);
    bounds.extend([brideLng, brideLat]);
    map.fitBounds(bounds, {
      padding: 64,
      pitch: 46,
      duration: 1400,
    });
  };

  // Request user geolocation & draw live driving route to selected venue (Nhà Trai or Nhà Gái)
  const handleDrawLiveRoute = () => {
    if (!navigator.geolocation) {
      window.open(targetGoogleMapsUrl, "_blank");
      return;
    }

    const sideLabel = activeSide === "groom" ? "Nhà Trai" : "Nhà Gái";
    setIsRouting(true);
    showToast(`Đang xác định vị trí để vẽ đường tới ${sideLabel}...`);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLng = pos.coords.longitude;
        const userLat = pos.coords.latitude;

        try {
          const url = `https://api.mapbox.com/directions/v5/mapbox/driving/${userLng},${userLat};${targetLng},${targetLat}?steps=true&geometries=geojson&overview=full&access_token=${MAPBOX_TOKEN}`;
          const res = await fetch(url);
          const data = await res.json();
          const route = data?.routes?.[0];

          if (route && mapRef.current) {
            const map = mapRef.current;
            renderRouteLayer(map, route.geometry);

            if (userMarkerRef.current) {
              userMarkerRef.current.remove();
            }
            const originEl = document.createElement("div");
            originEl.style.width = "16px";
            originEl.style.height = "16px";
            originEl.style.borderRadius = "9999px";
            originEl.style.backgroundColor = "#3B82F6";
            originEl.style.border = "2.5px solid #FFFFFF";
            originEl.style.boxShadow = "0 0 0 4px rgba(59,130,246,0.4)";

            userMarkerRef.current = new mapboxgl.Marker({ element: originEl })
              .setLngLat([userLng, userLat])
              .addTo(map);

            const bounds = new mapboxgl.LngLatBounds();
            bounds.extend([userLng, userLat]);
            bounds.extend([targetLng, targetLat]);
            map.fitBounds(bounds, {
              padding: 54,
              pitch: 42,
              duration: 1800,
            });

            const km = (route.distance / 1000).toFixed(1);
            const mins = Math.max(1, Math.round(route.duration / 60));
            const hours = Math.floor(mins / 60);
            const remMins = mins % 60;
            const durationText =
              hours > 0 ? `${hours} giờ ${remMins} phút` : `${mins} phút`;

            setRouteSummary({
              distanceKm: `${km} km`,
              durationText,
              sideLabel,
            });
            showToast(
              `Lộ trình tới ${sideLabel}: ${km} km • ${durationText}`
            );
          } else {
            window.open(targetGoogleMapsUrl, "_blank");
          }
        } catch {
          window.open(targetGoogleMapsUrl, "_blank");
        } finally {
          setIsRouting(false);
        }
      },
      () => {
        setIsRouting(false);
        showToast(`Mở Google Maps Chỉ Đường tới ${sideLabel}...`);
        window.open(targetGoogleMapsUrl, "_blank");
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Venue Selector Tabs: Nhà Trai vs Nhà Gái */}
      <div className="grid grid-cols-2 gap-2 w-full max-w-[365px] md:max-w-[490px]">
        {[
          {
            id: "groom" as VenueSide,
            title: "Nhà Trai • Phương Đông",
            sub: "24/12 • TDP An Thổ, Trà Câu",
          },
          {
            id: "bride" as VenueSide,
            title: "Nhà Gái • Thu Hiền",
            sub: "15:00 23/12 • TDP An Thổ, Trà Câu",
          },
        ].map((item) => {
          const isSelected = activeSide === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => handleSelectSide(item.id)}
              style={{
                backgroundColor: isSelected
                  ? theme.accentText
                  : "rgba(255, 232, 164, 0.1)",
                color: isSelected ? theme.bgPrimary : theme.accentText,
                borderColor: isSelected
                  ? theme.accentText
                  : "rgba(255, 232, 164, 0.3)",
              }}
              className="flex flex-col items-center justify-center py-2 px-2.5 rounded-xl border transition-all cursor-pointer shadow-xs"
            >
              <span className="inline-flex items-center gap-1 text-xs sm:text-[13px] font-fraunces font-bold whitespace-nowrap">
                <MapPin className="w-3.5 h-3.5 shrink-0" />
                <span>{item.title}</span>
              </span>
              <span className="text-[10px] font-serif opacity-85 whitespace-nowrap mt-0.5">
                {item.sub}
              </span>
            </button>
          );
        })}
      </div>

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
                onClick={handleShowBothVenues}
                className="px-2.5 py-1 rounded-full bg-[#8C0000]/85 hover:bg-[#8C0000] backdrop-blur-xs border border-[#ffe8a4]/45 text-[11px] text-[#ffe8a4] font-serif font-medium flex items-center gap-1 cursor-pointer transition-colors shadow"
                title="Xem toàn cảnh cả Nhà Trai & Nhà Gái"
              >
                <Compass className="w-3 h-3" />
                <span>Cả 2 nhà</span>
              </button>
            </div>
          </>
        ) : (
          <iframe
            key={activeSide}
            title={`Bản đồ ${
              activeSide === "groom" ? "Nhà Trai" : "Nhà Gái"
            } Phương Đông & Thu Hiền`}
            src={`https://maps.google.com/maps?q=${targetLat},${targetLng}&hl=vi&z=16&output=embed`}
            loading="lazy"
            className="absolute inset-0 w-full h-full border-0"
            allowFullScreen
          />
        )}

        {/* Live Route Distance & Duration Pill */}
        {routeSummary && (
          <div className="absolute bottom-2.5 left-2.5 right-2.5 z-10 px-3 py-1.5 rounded-xl bg-black/75 backdrop-blur-md border border-[#ffe8a4]/45 text-xs text-[#ffe8a4] font-serif flex items-center justify-between shadow-lg">
            <span>
              Tới {routeSummary.sideLabel}:{" "}
              <strong>{routeSummary.distanceKm}</strong>
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
          <span>
            Vẽ đường tới {activeSide === "groom" ? "Nhà Trai" : "Nhà Gái"}
          </span>
        </button>

        <a
          href={targetGoogleMapsUrl}
          target="_blank"
          rel="noopener noreferrer"
          style={{
            backgroundColor: theme.accentText,
            color: theme.bgPrimary,
          }}
          className="inline-flex items-center gap-1.5 rounded-full px-5 py-2 text-xs md:text-sm font-serif font-bold transition-transform hover:scale-105 active:scale-95 shadow-lg"
        >
          <Navigation className="h-4 w-4 shrink-0" />
          <span>
            Google Maps ({activeSide === "groom" ? "Nhà Trai" : "Nhà Gái"})
          </span>
          <ExternalLink className="h-3.5 w-3.5 opacity-75" />
        </a>
      </div>
    </div>
  );
}
