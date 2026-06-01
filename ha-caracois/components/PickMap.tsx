"use client";

import dynamic from "next/dynamic";

export interface PickMapProps {
  lat: number;
  lng: number;
  zoom?: number;
  /** When provided, the map is interactive and clicking/dragging sets the pin. */
  onPick?: (lat: number, lng: number) => void;
  className?: string;
}

const PickMapInner = dynamic(() => import("./PickMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center bg-border/40 text-sm text-foreground/50">
      A carregar o mapa…
    </div>
  ),
});

export default function PickMap(props: PickMapProps) {
  return <PickMapInner {...props} />;
}
