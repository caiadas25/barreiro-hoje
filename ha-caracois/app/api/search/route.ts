import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

export interface SearchResult {
  name: string;
  address: string;
  lat: number;
  lng: number;
  osm_id: string;
}

// Proxy to OpenStreetMap Nominatim. Done server-side so we can set a proper
// User-Agent and respect the OSM usage policy (https://operations.osmfoundation.org/policies/nominatim/).
export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get("q")?.trim();
  const lat = req.nextUrl.searchParams.get("lat");
  const lng = req.nextUrl.searchParams.get("lng");

  if (!q || q.length < 3) {
    return NextResponse.json<SearchResult[]>([]);
  }

  const params = new URLSearchParams({
    q,
    format: "jsonv2",
    addressdetails: "1",
    limit: "8",
  });

  // Bias results towards the visible map area when we know the user's location.
  if (lat && lng) {
    const la = Number(lat);
    const lo = Number(lng);
    if (Number.isFinite(la) && Number.isFinite(lo)) {
      const d = 0.35;
      params.set("viewbox", `${lo - d},${la + d},${lo + d},${la - d}`);
      params.set("bounded", "0");
    }
  }

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?${params.toString()}`,
      {
        headers: {
          "User-Agent": "HaCaracois/1.0 (https://github.com/caiadas25/ha-caracois)",
          "Accept-Language": "pt-PT,pt",
        },
        // Cache identical queries briefly to be polite to Nominatim.
        next: { revalidate: 60 },
      },
    );

    if (!res.ok) {
      return NextResponse.json<SearchResult[]>([]);
    }

    const raw = (await res.json()) as Array<{
      display_name?: string;
      name?: string;
      lat: string;
      lon: string;
      osm_type?: string;
      osm_id?: number;
    }>;

    const results: SearchResult[] = raw.map((p) => ({
      name: p.name || p.display_name?.split(",")[0] || "Estabelecimento",
      address: p.display_name ?? "",
      lat: Number(p.lat),
      lng: Number(p.lon),
      osm_id: `${p.osm_type?.[0] ?? ""}${p.osm_id ?? ""}`,
    }));

    return NextResponse.json(results);
  } catch {
    return NextResponse.json<SearchResult[]>([]);
  }
}
