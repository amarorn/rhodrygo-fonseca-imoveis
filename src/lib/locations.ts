/** Áreas de atuação do corretor — usadas na seleção precisa do agente. */
export type AreaOption = {
  city: string;
  neighborhood?: string;
  label: string;
};

export const SERVICE_AREAS: AreaOption[] = [
  { city: "Natal", neighborhood: "Ponta Negra", label: "Ponta Negra · Natal" },
  { city: "Natal", neighborhood: "Capim Macio", label: "Capim Macio · Natal" },
  { city: "Natal", neighborhood: "Lagoa Nova", label: "Lagoa Nova · Natal" },
  { city: "Natal", neighborhood: "Tirol", label: "Tirol · Natal" },
  { city: "Natal", neighborhood: "Petrópolis", label: "Petrópolis · Natal" },
  { city: "Natal", neighborhood: "Neópolis", label: "Neópolis · Natal" },
  { city: "Natal", neighborhood: "Cidade Alta", label: "Cidade Alta · Natal" },
  { city: "Natal", label: "Natal (cidade)" },
  { city: "Macaíba", label: "Macaíba" },
  { city: "Parnamirim", label: "Parnamirim" },
  { city: "Tibau do Sul", neighborhood: "Pipa", label: "Pipa · Tibau do Sul" },
  { city: "São Miguel do Gostoso", label: "São Miguel do Gostoso" },
];

export function formatGeoLabel(geo: {
  city?: string;
  neighborhood?: string;
  region?: string;
}): string {
  if (geo.neighborhood && geo.city) {
    return `${geo.neighborhood}, ${geo.city}`;
  }
  if (geo.neighborhood) return geo.neighborhood;
  if (geo.city && geo.region) return `${geo.city}, ${geo.region}`;
  return geo.city ?? geo.region ?? "";
}
