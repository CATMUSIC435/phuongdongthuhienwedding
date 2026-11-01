const GOOGLE_SHEET_ID =
  process.env.GOOGLE_SHEET_ID ||
  "1Qk52oZR78a5v9NracpI34g8HDqtSTzOdJc1lvx_gGvM";

interface GvizCell {
  v?: string | number | null;
  f?: string | null;
}

interface GvizRow {
  c?: (GvizCell | null)[];
}

// Stale-While-Revalidate in-memory cache + in-flight request deduplication
let cachedRows: GvizRow[] | null = null;
let cacheTimestamp = 0;
let inFlightPromise: Promise<GvizRow[]> | null = null;
const FRESH_TTL_MS = 30_000;

async function fetchSheetRowsFromNetwork(): Promise<GvizRow[]> {
  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2500);
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json`;
      const res = await fetch(gvizUrl, {
        next: { revalidate: 30 },
        signal: controller.signal,
        headers: {
          Accept: "application/json, text/plain, */*",
        },
      });

      if (!res.ok) {
        return cachedRows || [];
      }

      const rawText = await res.text();
      const jsonStart = rawText.indexOf("{");
      const jsonEnd = rawText.lastIndexOf("}");
      if (jsonStart === -1 || jsonEnd === -1) {
        return cachedRows || [];
      }

      const payload = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
      const rows: GvizRow[] = payload?.table?.rows || [];
      cachedRows = rows;
      cacheTimestamp = Date.now();
      return rows;
    } catch {
      return cachedRows || [];
    } finally {
      clearTimeout(timeoutId);
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

async function getSheetRows(): Promise<GvizRow[]> {
  const now = Date.now();
  if (cachedRows) {
    // Stale-While-Revalidate: return cached rows in 0ms and refresh in background if older than 30s
    if (now - cacheTimestamp >= FRESH_TTL_MS) {
      fetchSheetRowsFromNetwork().catch(() => {});
    }
    return cachedRows;
  }
  return fetchSheetRowsFromNetwork();
}

export async function fetchGuestById(idParam?: string | null): Promise<string> {
  const cleanId = (idParam || "").trim();
  if (!cleanId) return "";

  const rows = await getSheetRows();
  const normalizedTarget = cleanId.toLowerCase();

  for (const row of rows) {
    const cells = row?.c;
    if (!cells || cells.length < 2) continue;

    const cellA = cells[0];
    const cellB = cells[1];

    const rawId =
      cellA?.f !== undefined && cellA?.f !== null
        ? String(cellA.f).trim()
        : cellA?.v !== undefined && cellA?.v !== null
        ? String(cellA.v).replace(/\.0+$/, "").trim()
        : "";

    if (rawId.toLowerCase() === normalizedTarget) {
      const matchedName =
        cellB?.f !== undefined && cellB?.f !== null
          ? String(cellB.f).trim()
          : cellB?.v !== undefined && cellB?.v !== null
          ? String(cellB.v).trim()
          : "";
      return matchedName;
    }
  }

  return "";
}
