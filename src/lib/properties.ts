import propertiesData from "@/data/properties.json";
import type { Property } from "@/types";

export const PROPERTIES: Property[] = propertiesData as Property[];

export function getPropertyBySlug(slug: string): Property | undefined {
  return PROPERTIES.find((p) => p.slug === slug);
}

export function getAllPropertySlugs(): string[] {
  return PROPERTIES.map((p) => p.slug);
}
