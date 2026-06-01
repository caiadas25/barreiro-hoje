import Link from "next/link";

export default function Header() {
  return (
    <header className="h-16 shrink-0 border-b border-border bg-card/80 backdrop-blur sticky top-0 z-[1000]">
      <div className="mx-auto flex h-full max-w-5xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2 font-semibold text-lg">
          <span className="text-2xl">🐌</span>
          <span>
            Há <span className="text-brand">Caracóis</span>
          </span>
        </Link>
        <Link
          href="/new"
          className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          + Adicionar
        </Link>
      </div>
    </header>
  );
}
