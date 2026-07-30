import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { CONTACT } from "@/lib/constants";
import type { UtmParams } from "@/lib/analytics";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price?: number | null): string {
  if (price == null || price <= 0) return "Consulte";
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
    maximumFractionDigits: 0,
  }).format(price);
}

export function buildWhatsAppLink(message: string, utm?: UtmParams): string {
  let finalMessage = message;
  if (utm?.source || utm?.campaign) {
    const parts = [utm.source, utm.medium, utm.campaign].filter(Boolean);
    finalMessage += `\n\n[Ref: ${parts.join(" / ")}]`;
  }
  const encoded = encodeURIComponent(finalMessage);
  return `${CONTACT.whatsappLink}?text=${encoded}`;
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
