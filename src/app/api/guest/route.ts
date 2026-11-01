import { NextRequest, NextResponse } from "next/server";
import { fetchGuestById } from "@/lib/fetchGuestFromSheet";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const idParam = (searchParams.get("id") || "").trim();

  if (!idParam) {
    return NextResponse.json({ id: "", name: "" });
  }

  const matchedName = await fetchGuestById(idParam);
  return NextResponse.json({
    id: idParam,
    name: matchedName,
  });
}
