"use client";

import dynamic from "next/dynamic";

// Leaflet touches `window` at import time, so the real map is loaded
// client-side only.
const HomeMapInner = dynamic(() => import("./HomeMapInner"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-1 items-center justify-center text-foreground/50">
      A carregar o mapa…
    </div>
  ),
});

export default function HomeMap() {
  return <HomeMapInner />;
}
