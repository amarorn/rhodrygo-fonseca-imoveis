import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
}

export function buildWhatsAppLink(message: string): string {
  const encoded = encodeURIComponent(message);
  return `https://wa.me/5581999999999?text=${encoded}`;
}

export function scrollToSection(id: string, offset = 80) {
  const element = document.getElementById(id);
  if (!element) return;

  const lenisScroll = (
    window as Window & {
      __rfScrollTo?: (target: string | number, offset?: number) => void;
    }
  ).__rfScrollTo;

  if (lenisScroll) {
    lenisScroll(`#${id}`, -offset);
    return;
  }

  const top = element.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({ top, behavior: "smooth" });
}
