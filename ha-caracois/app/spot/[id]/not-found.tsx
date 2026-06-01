import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col items-center justify-center px-4 py-16 text-center">
      <p className="text-5xl">🐌</p>
      <h1 className="mt-4 text-2xl font-bold">Local não encontrado</h1>
      <p className="mt-2 text-foreground/60">
        Este local não existe ou foi removido.
      </p>
      <Link
        href="/"
        className="mt-6 rounded-full bg-brand px-5 py-2.5 font-medium text-white hover:bg-brand-dark"
      >
        Ver o mapa
      </Link>
    </div>
  );
}
