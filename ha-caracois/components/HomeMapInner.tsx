"use client";

import { useEffect, useMemo, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Spot, SERVING_LABELS } from "@/lib/types";
import { formatPrice, stars } from "@/lib/format";

// Barreiro fallback centre, zoomed to roughly show a whole city.
const DEFAULT_CENTER: [number, number] = [38.6634, -9.0735];
const DEFAULT_ZOOM = 13;

const snailIcon = L.divIcon({
  html: '<div class="spot-marker">🐌</div>',
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 30],
  popupAnchor: [0, -28],
});

function FlyTo({ center }: { center: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    if (center) map.flyTo(center, DEFAULT_ZOOM, { duration: 1 });
  }, [center, map]);
  return null;
}

export default function HomeMapInner() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    supabase
      .from("caracois_spots")
      .select("*")
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (error) setError("Não foi possível carregar os locais.");
        else setSpots((data as Spot[]) ?? []);
      });
  }, []);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
      () => {
        /* permission denied / unavailable — keep default centre */
      },
      { enableHighAccuracy: true, timeout: 8000 },
    );
  }, []);

  const markers = useMemo(
    () =>
      spots.map((s) => (
        <Marker key={s.id} position={[s.lat, s.lng]} icon={snailIcon}>
          <Popup>
            <div className="space-y-1">
              <p className="text-base font-semibold leading-tight">{s.name}</p>
              <p className="text-accent">
                {stars(s.rating)}{" "}
                <span className="text-foreground/60">({s.rating}/5)</span>
              </p>
              <p className="text-sm text-foreground/70">
                {SERVING_LABELS[s.serving_size]}
                {s.price != null ? ` · ${formatPrice(s.price)}` : ""}
              </p>
              {s.notes ? (
                <p className="line-clamp-2 text-sm text-foreground/70">{s.notes}</p>
              ) : null}
              <Link
                href={`/spot/${s.id}`}
                className="mt-1 inline-block font-medium text-brand hover:underline"
              >
                Ver página →
              </Link>
            </div>
          </Popup>
        </Marker>
      )),
    [spots],
  );

  return (
    <div className="relative flex-1">
      <MapContainer
        center={DEFAULT_CENTER}
        zoom={DEFAULT_ZOOM}
        scrollWheelZoom
        className="absolute inset-0 h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <FlyTo center={userPos} />
        {markers}
      </MapContainer>

      {error ? (
        <div className="absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full bg-red-600 px-4 py-1 text-sm text-white shadow">
          {error}
        </div>
      ) : null}

      {spots.length === 0 && !error ? (
        <div className="pointer-events-none absolute left-1/2 top-4 z-[1000] -translate-x-1/2 rounded-full bg-card px-4 py-1.5 text-sm shadow border border-border">
          Ainda não há locais. Sê o primeiro a adicionar! 🐌
        </div>
      ) : null}

      <Link
        href="/new"
        className="absolute bottom-6 right-6 z-[1000] flex items-center gap-2 rounded-full bg-brand px-5 py-3 font-semibold text-white shadow-lg transition-colors hover:bg-brand-dark"
      >
        <span className="text-lg leading-none">+</span> Adicionar local
      </Link>
    </div>
  );
}
