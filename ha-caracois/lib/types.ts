export type ServingSize = "pires" | "prato" | "travessa";

export interface Spot {
  id: string;
  name: string;
  lat: number;
  lng: number;
  address: string | null;
  price: number | null;
  serving_size: ServingSize;
  rating: number;
  notes: string | null;
  osm_id: string | null;
  created_at: string;
}

export const SERVING_SIZES: { value: ServingSize; label: string; hint: string }[] = [
  { value: "pires", label: "Pires", hint: "Dose pequena, para petiscar" },
  { value: "prato", label: "Prato", hint: "Dose individual" },
  { value: "travessa", label: "Travessa", hint: "Dose grande, para partilhar" },
];

export const SERVING_LABELS: Record<ServingSize, string> = {
  pires: "Pires",
  prato: "Prato",
  travessa: "Travessa",
};
