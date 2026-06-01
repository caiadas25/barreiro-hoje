import { ImageResponse } from "next/og";
import { supabase } from "@/lib/supabase";
import { Spot, SERVING_LABELS } from "@/lib/types";

export const runtime = "nodejs";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";
export const alt = "Há Caracóis";

export default async function Image({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data } = await supabase
    .from("caracois_spots")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  const spot = data as Spot | null;

  const name = spot?.name ?? "Há Caracóis";
  const rating = spot ? "★".repeat(spot.rating) + "☆".repeat(5 - spot.rating) : "";
  const serving = spot ? SERVING_LABELS[spot.serving_size] : "";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background: "#fbf7f0",
          color: "#2a1f17",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ fontSize: 48, color: "#8a3b2e" }}>🐌 Há Caracóis</div>
        <div style={{ fontSize: 84, fontWeight: 700, marginTop: 24 }}>{name}</div>
        <div style={{ fontSize: 56, color: "#c9772f", marginTop: 16 }}>
          {rating}
        </div>
        {serving ? (
          <div style={{ fontSize: 40, color: "#6b5d4f", marginTop: 8 }}>
            {serving}
          </div>
        ) : null}
      </div>
    ),
    size,
  );
}
