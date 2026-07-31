import propertiesData from "@/data/properties.json";
import type { Property } from "@/types";

export const PROPERTIES: Property[] = propertiesData as Property[];

export function getPropertyBySlug(slug: string): Property | undefined {
  return PROPERTIES.find((p) => p.slug === slug);
}

export function getAllPropertySlugs(): string[] {
  return PROPERTIES.map((p) => p.slug);
}

/** Galeria do imóvel; fallback para a capa se `images` estiver vazio. */
export function getPropertyImages(property: Property): string[] {
  const gallery = property.images?.filter(Boolean) ?? [];
  if (gallery.length > 0) return gallery;
  return property.image ? [property.image] : [];
}
