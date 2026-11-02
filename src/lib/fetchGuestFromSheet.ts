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

// Short-lived in-memory cache + in-flight request deduplication
let cachedRows: GvizRow[] | null = null;
let cacheTimestamp = 0;
let inFlightPromise: Promise<GvizRow[]> | null = null;
const FRESH_TTL_MS = 5_000;

function parseCsvRows(csvText: string): GvizRow[] {
  const lines = csvText.split(/\r?\n/);
  const rows: GvizRow[] = [];
  for (const line of lines) {
    if (!line.trim()) continue;
    const commaIdx = line.indexOf(",");
    if (commaIdx === -1) continue;
    const colA = line
      .slice(0, commaIdx)
      .trim()
      .replace(/^"|"$/g, "");
    const colB = line
      .slice(commaIdx + 1)
      .trim()
      .replace(/^"|"$/g, "")
      .replace(/""/g, '"');
    rows.push({
      c: [{ v: colA, f: colA }, { v: colB, f: colB }],
    });
  }
  return rows;
}

async function fetchSheetRowsFromNetwork(): Promise<GvizRow[]> {
  if (inFlightPromise) return inFlightPromise;

  inFlightPromise = (async () => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    try {
      const gvizUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/gviz/tq?tqx=out:json&headers=0`;
      const res = await fetch(gvizUrl, {
        cache: "no-store",
        signal: controller.signal,
        headers: {
          Accept: "application/json, text/plain, */*",
          "Cache-Control": "no-cache",
        },
      });

      if (res.ok) {
        const rawText = await res.text();
        const jsonStart = rawText.indexOf("{");
        const jsonEnd = rawText.lastIndexOf("}");
        if (jsonStart !== -1 && jsonEnd !== -1) {
          const payload = JSON.parse(rawText.slice(jsonStart, jsonEnd + 1));
          const rows: GvizRow[] = payload?.table?.rows || [];
          if (rows.length > 0) {
            cachedRows = rows;
            cacheTimestamp = Date.now();
            return rows;
          }
        }
      }

      // Fallback to CSV export if gviz endpoint fails or returns empty
      const csvUrl = `https://docs.google.com/spreadsheets/d/${GOOGLE_SHEET_ID}/export?format=csv`;
      const csvRes = await fetch(csvUrl, {
        cache: "no-store",
        signal: controller.signal,
      });
      if (csvRes.ok) {
        const csvText = await csvRes.text();
        const rows = parseCsvRows(csvText);
        if (rows.length > 0) {
          cachedRows = rows;
          cacheTimestamp = Date.now();
          return rows;
        }
      }

      return cachedRows || [];
    } catch {
      return cachedRows || [];
    } finally {
      clearTimeout(timeoutId);
      inFlightPromise = null;
    }
  })();

  return inFlightPromise;
}

function findNameInRows(rows: GvizRow[], normalizedTarget: string): string {
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

export async function fetchGuestById(idParam?: string | null): Promise<string> {
  const cleanId = (idParam || "").trim();
  if (!cleanId) return "";

  const normalizedTarget = cleanId.toLowerCase();
  const now = Date.now();

  // Check fresh cache first; if missing or stale, always fetch live from Google Sheet
  if (cachedRows && now - cacheTimestamp < FRESH_TTL_MS) {
    const cachedMatch = findNameInRows(cachedRows, normalizedTarget);
    if (cachedMatch) return cachedMatch;
  }

  const freshRows = await fetchSheetRowsFromNetwork();
  return findNameInRows(freshRows, normalizedTarget);
}
