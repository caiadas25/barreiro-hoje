"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { ServingSize, SERVING_SIZES } from "@/lib/types";
import type { SearchResult } from "@/app/api/search/route";
import PickMap from "@/components/PickMap";

const DEFAULT_CENTER: [number, number] = [38.6634, -9.0735];
const STEPS = ["Local", "Preço", "Dose", "Avaliação", "Notas"];

export default function NewSpotPage() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  // Step 1 — name & location
  const [name, setName] = useState("");
  const [address, setAddress] = useState<string | null>(null);
  const [osmId, setOsmId] = useState<string | null>(null);
  const [pos, setPos] = useState<[number, number] | null>(null);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searching, setSearching] = useState(false);
  const [manual, setManual] = useState(false);
  const [userPos, setUserPos] = useState<[number, number] | null>(null);

  // Remaining steps
  const [price, setPrice] = useState("");
  const [serving, setServing] = useState<ServingSize | null>(null);
  const [rating, setRating] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition(
      (p) => setUserPos([p.coords.latitude, p.coords.longitude]),
      () => {},
      { timeout: 8000 },
    );
  }, []);

  // Debounced Nominatim search
  useEffect(() => {
    if (debounce.current) clearTimeout(debounce.current);
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }
    debounce.current = setTimeout(async () => {
      setSearching(true);
      const params = new URLSearchParams({ q: query.trim() });
      if (userPos) {
        params.set("lat", String(userPos[0]));
        params.set("lng", String(userPos[1]));
      }
      try {
        const res = await fetch(`/api/search?${params.toString()}`);
        setResults(res.ok ? await res.json() : []);
      } catch {
        setResults([]);
      } finally {
        setSearching(false);
      }
    }, 400);
  }, [query, userPos]);

  function chooseResult(r: SearchResult) {
    setName(r.name);
    setAddress(r.address);
    setOsmId(r.osm_id || null);
    setPos([r.lat, r.lng]);
    setResults([]);
    setQuery("");
    setManual(false);
  }

  const canContinue = [
    name.trim().length > 0 && pos != null, // location
    true, // price optional
    serving != null,
    rating != null,
    true, // notes optional
  ];

  async function submit() {
    if (!pos || !serving || rating == null) return;
    setSubmitting(true);
    setError(null);
    const parsedPrice = price.trim()
      ? Number(price.replace(",", "."))
      : null;
    const { data, error } = await supabase
      .from("caracois_spots")
      .insert({
        name: name.trim(),
        lat: pos[0],
        lng: pos[1],
        address,
        price: parsedPrice != null && !Number.isNaN(parsedPrice) ? parsedPrice : null,
        serving_size: serving,
        rating,
        notes: notes.trim() || null,
        osm_id: osmId,
      })
      .select("id")
      .single();

    if (error || !data) {
      setError("Não foi possível guardar. Tenta novamente.");
      setSubmitting(false);
      return;
    }
    router.push(`/spot/${data.id}`);
  }

  return (
    <div className="mx-auto w-full max-w-xl px-4 py-8">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-brand hover:underline">
          ← Cancelar
        </Link>
        <span className="text-sm text-foreground/50">
          Passo {step + 1} de {STEPS.length} · {STEPS[step]}
        </span>
      </div>

      {/* progress */}
      <div className="mt-3 flex gap-1">
        {STEPS.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 flex-1 rounded-full ${
              i <= step ? "bg-brand" : "bg-border"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 min-h-[320px]">
        {step === 0 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Onde se comem os caracóis?</h1>
            <p className="text-sm text-foreground/60">
              Procura o estabelecimento pelo nome ou marca o ponto no mapa.
            </p>
            <input
              autoFocus
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Nome do estabelecimento…"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-brand"
            />
            {searching ? (
              <p className="text-sm text-foreground/50">A procurar…</p>
            ) : null}
            {results.length > 0 && (
              <ul className="divide-y divide-border overflow-hidden rounded-xl border border-border bg-card">
                {results.map((r, i) => (
                  <li key={i}>
                    <button
                      onClick={() => chooseResult(r)}
                      className="block w-full px-4 py-3 text-left transition-colors hover:bg-border/40"
                    >
                      <p className="font-medium">{r.name}</p>
                      <p className="line-clamp-1 text-sm text-foreground/60">
                        {r.address}
                      </p>
                    </button>
                  </li>
                ))}
              </ul>
            )}

            {pos && !manual ? (
              <div className="rounded-xl border border-border bg-card p-4">
                <p className="font-semibold">{name}</p>
                {address ? (
                  <p className="text-sm text-foreground/60">{address}</p>
                ) : null}
                <button
                  onClick={() => setManual(true)}
                  className="mt-2 text-sm text-brand hover:underline"
                >
                  Ajustar no mapa
                </button>
              </div>
            ) : null}

            <button
              onClick={() => {
                setManual((m) => !m);
                if (!pos) setPos(userPos ?? DEFAULT_CENTER);
              }}
              className="text-sm text-brand hover:underline"
            >
              {manual ? "Esconder mapa" : "Ou pôr um alfinete no mapa →"}
            </button>

            {manual && (
              <div className="space-y-2">
                {!name && (
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Nome do local"
                    className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-brand"
                  />
                )}
                <div className="h-64 overflow-hidden rounded-xl border border-border">
                  <PickMap
                    lat={(pos ?? userPos ?? DEFAULT_CENTER)[0]}
                    lng={(pos ?? userPos ?? DEFAULT_CENTER)[1]}
                    onPick={(lat, lng) => setPos([lat, lng])}
                  />
                </div>
                <p className="text-xs text-foreground/50">
                  Toca no mapa ou arrasta o 🐌 para marcar o local.
                </p>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Quanto custa a dose?</h1>
            <p className="text-sm text-foreground/60">Opcional, em euros.</p>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/50">
                €
              </span>
              <input
                autoFocus
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="0,00"
                className="w-full rounded-xl border border-border bg-card py-3 pl-8 pr-4 outline-none focus:border-brand"
              />
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Qual é a dose?</h1>
            <div className="grid gap-3">
              {SERVING_SIZES.map((s) => (
                <button
                  key={s.value}
                  onClick={() => setServing(s.value)}
                  className={`rounded-xl border px-4 py-3 text-left transition-colors ${
                    serving === s.value
                      ? "border-brand bg-brand/5"
                      : "border-border bg-card hover:border-brand/50"
                  }`}
                >
                  <p className="font-semibold">{s.label}</p>
                  <p className="text-sm text-foreground/60">{s.hint}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Que tal estavam?</h1>
            <p className="text-sm text-foreground/60">Avaliação de 0 a 5.</p>
            <div className="flex gap-1 text-4xl">
              {[1, 2, 3, 4, 5].map((n) => (
                <button
                  key={n}
                  onClick={() => setRating(n)}
                  className="transition-transform hover:scale-110"
                  aria-label={`${n} estrelas`}
                >
                  <span
                    className={
                      rating != null && n <= rating
                        ? "text-accent"
                        : "text-border"
                    }
                  >
                    ★
                  </span>
                </button>
              ))}
            </div>
            <button
              onClick={() => setRating(0)}
              className="text-sm text-foreground/50 hover:underline"
            >
              0 estrelas
            </button>
            {rating != null ? (
              <p className="text-sm text-foreground/60">{rating}/5</p>
            ) : null}
          </div>
        )}

        {step === 4 && (
          <div className="space-y-4">
            <h1 className="text-2xl font-bold">Notas</h1>
            <p className="text-sm text-foreground/60">
              Opcional — picante, à moda do Porto, horário, etc.
            </p>
            <textarea
              autoFocus
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={5}
              maxLength={2000}
              placeholder="As tuas notas…"
              className="w-full rounded-xl border border-border bg-card px-4 py-3 outline-none focus:border-brand"
            />
          </div>
        )}
      </div>

      {error ? <p className="mt-2 text-sm text-red-600">{error}</p> : null}

      <div className="mt-6 flex items-center justify-between">
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          className="rounded-full px-4 py-2 text-sm font-medium text-foreground/60 disabled:opacity-0"
        >
          ← Voltar
        </button>

        {step < STEPS.length - 1 ? (
          <button
            onClick={() => setStep((s) => s + 1)}
            disabled={!canContinue[step]}
            className="rounded-full bg-brand px-6 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-40"
          >
            Próximo →
          </button>
        ) : (
          <button
            onClick={submit}
            disabled={submitting || !canContinue.every(Boolean)}
            className="rounded-full bg-brand px-6 py-2.5 font-medium text-white transition-colors hover:bg-brand-dark disabled:opacity-40"
          >
            {submitting ? "A guardar…" : "Guardar local 🐌"}
          </button>
        )}
      </div>
    </div>
  );
}
