"use client";

import { useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  useMap,
  useMapEvents,
} from "react-leaflet";
import L from "leaflet";
import type { PickMapProps } from "./PickMap";

const snailIcon = L.divIcon({
  html: '<div class="spot-marker">🐌</div>',
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 30],
});

function Recenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng], map.getZoom());
  }, [lat, lng, map]);
  return null;
}

function ClickToPick({ onPick }: { onPick: (lat: number, lng: number) => void }) {
  useMapEvents({
    click(e) {
      onPick(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

export default function PickMapInner({
  lat,
  lng,
  zoom = 15,
  onPick,
  className,
}: PickMapProps) {
  const interactive = Boolean(onPick);

  return (
    <MapContainer
      center={[lat, lng]}
      zoom={zoom}
      scrollWheelZoom={interactive}
      dragging={interactive}
      doubleClickZoom={interactive}
      zoomControl={interactive}
      attributionControl={false}
      className={className ?? "h-full w-full"}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
      <Recenter lat={lat} lng={lng} />
      {onPick ? <ClickToPick onPick={onPick} /> : null}
      <Marker
        position={[lat, lng]}
        icon={snailIcon}
        draggable={interactive}
        eventHandlers={
          onPick
            ? {
                dragend(e) {
                  const m = e.target as L.Marker;
                  const p = m.getLatLng();
                  onPick(p.lat, p.lng);
                },
              }
            : undefined
        }
      />
    </MapContainer>
  );
}
