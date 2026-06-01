const euro = new Intl.NumberFormat("pt-PT", {
  style: "currency",
  currency: "EUR",
});

export function formatPrice(price: number | null): string | null {
  if (price == null) return null;
  return euro.format(price);
}

export function stars(rating: number): string {
  const r = Math.max(0, Math.min(5, Math.round(rating)));
  return "★".repeat(r) + "☆".repeat(5 - r);
}
