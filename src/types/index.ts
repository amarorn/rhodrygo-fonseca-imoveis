export type PropertyCategory =
  | "todos"
  | "casas"
  | "apartamentos"
  | "terrenos"
  | "comercial";

export interface Property {
  id: string;
  slug: string;
  title: string;
  location: string;
  price?: number;
  category: Exclude<PropertyCategory, "todos">;
  badge: string;
  image: string;
  bedrooms?: number;
  bathrooms?: number;
  area: number;
  parking?: number;
  features?: string[];
  instagramUrl?: string;
  description?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  content: string;
  rating: number;
  avatar: string;
}

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
}

export interface Step {
  id: string;
  number: string;
  title: string;
  description: string;
  icon: string;
}

export interface TrustBadge {
  id: string;
  label: string;
  icon: string;
}

export interface ContactInfo {
  whatsapp: string;
  whatsappLink: string;
  email: string;
  address: string;
  schedule: string;
}

export type FormVariant = "hero" | "contact" | "ebook" | "exit-intent" | "newsletter";
