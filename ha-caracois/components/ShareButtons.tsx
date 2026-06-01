"use client";

import { useEffect, useState } from "react";

export default function ShareButtons({
  url,
  title,
}: {
  url: string;
  title: string;
}) {
  const [shareUrl, setShareUrl] = useState(url);
  const [canNativeShare, setCanNativeShare] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    // Prefer the live URL once mounted (handles preview/prod domains).
    if (typeof window !== "undefined") setShareUrl(window.location.href);
    setCanNativeShare(typeof navigator !== "undefined" && !!navigator.share);
  }, []);

  const text = `${title} — caracóis! 🐌`;
  const u = encodeURIComponent(shareUrl);
  const t = encodeURIComponent(text);

  const links = [
    {
      label: "WhatsApp",
      href: `https://wa.me/?text=${encodeURIComponent(`${text} ${shareUrl}`)}`,
    },
    { label: "Telegram", href: `https://t.me/share/url?url=${u}&text=${t}` },
    {
      label: "Email",
      href: `mailto:?subject=${encodeURIComponent(title)}&body=${encodeURIComponent(`${text}\n\n${shareUrl}`)}`,
    },
  ];

  async function nativeShare() {
    try {
      await navigator.share({ title, text, url: shareUrl });
    } catch {
      /* user cancelled */
    }
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* clipboard unavailable */
    }
  }

  return (
    <div className="flex flex-wrap gap-2">
      {canNativeShare ? (
        <button
          onClick={nativeShare}
          className="rounded-full bg-brand px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-brand-dark"
        >
          Partilhar…
        </button>
      ) : null}
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
        >
          {l.label}
        </a>
      ))}
      <button
        onClick={copy}
        className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium transition-colors hover:border-brand hover:text-brand"
      >
        {copied ? "Copiado ✓" : "Copiar link"}
      </button>
    </div>
  );
}
