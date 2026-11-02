import { NextRequest, NextResponse } from "next/server";
import { fetchGuestById } from "@/lib/fetchGuestFromSheet";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idParam = (searchParams.get("id") || "").trim();

  if (!idParam) {
    return NextResponse.json(
      { id: "", name: "" },
      { headers: { "Cache-Control": "no-store, max-age=0" } }
    );
  }

  const matchedName = await fetchGuestById(idParam);
  return NextResponse.json(
    {
      id: idParam,
      name: matchedName,
    },
    { headers: { "Cache-Control": "no-store, max-age=0" } }
  );
}
