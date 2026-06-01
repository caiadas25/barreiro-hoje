import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { Spot, SERVING_LABELS } from "@/lib/types";
import { formatPrice, stars } from "@/lib/format";
import ShareButtons from "@/components/ShareButtons";
import PickMap from "@/components/PickMap";
import { getSiteUrl } from "@/lib/site";

export const dynamic = "force-dynamic";

async function getSpot(id: string): Promise<Spot | null> {
  const { data, error } = await supabase
    .from("caracois_spots")
    .select("*")
    .eq("id", id)
    .maybeSingle();
  if (error || !data) return null;
  return data as Spot;
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const spot = await getSpot(id);
  if (!spot) return { title: "Local não encontrado" };

  const desc = `${stars(spot.rating)} · ${SERVING_LABELS[spot.serving_size]}${
    spot.price != null ? ` · ${formatPrice(spot.price)}` : ""
  }${spot.address ? ` · ${spot.address}` : ""}`;

  return {
    title: spot.name,
    description: desc,
    openGraph: { title: spot.name, description: desc, type: "website" },
    twitter: { card: "summary_large_image", title: spot.name, description: desc },
  };
}

export default async function SpotPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const spot = await getSpot(id);
  if (!spot) notFound();

  const shareUrl = `${getSiteUrl()}/spot/${spot.id}`;
  const price = formatPrice(spot.price);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-8">
      <Link href="/" className="text-sm text-brand hover:underline">
        ← Voltar ao mapa
      </Link>

      <h1 className="mt-3 text-3xl font-bold">{spot.name}</h1>
      {spot.address ? (
        <p className="mt-1 text-foreground/60">{spot.address}</p>
      ) : null}

      <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2">
        <span className="text-2xl text-accent" title={`${spot.rating}/5`}>
          {stars(spot.rating)}
        </span>
        <span className="rounded-full bg-border/60 px-3 py-1 text-sm font-medium">
          {SERVING_LABELS[spot.serving_size]}
        </span>
        {price ? (
          <span className="rounded-full bg-border/60 px-3 py-1 text-sm font-medium">
            {price}
          </span>
        ) : null}
      </div>

      {spot.notes ? (
        <p className="mt-5 whitespace-pre-wrap rounded-xl border border-border bg-card p-4 text-foreground/80">
          {spot.notes}
        </p>
      ) : null}

      <div className="mt-6 h-64 overflow-hidden rounded-xl border border-border">
        <PickMap lat={spot.lat} lng={spot.lng} zoom={16} />
      </div>

      <div className="mt-6">
        <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/50">
          Partilhar
        </h2>
        <ShareButtons url={shareUrl} title={spot.name} />
      </div>
    </div>
  );
}
