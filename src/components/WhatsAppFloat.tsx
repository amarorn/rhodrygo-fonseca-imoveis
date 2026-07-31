"use client";

import { useEffect, useState } from "react";
import { MessageCircle } from "lucide-react";
import { buildWhatsAppLink } from "@/lib/utils";
import { getStoredGeo, trackLead } from "@/lib/analytics";

export function WhatsAppFloat() {
  const [href, setHref] = useState<string>("");

  useEffect(() => {
    const geo = getStoredGeo() ?? undefined;
    setHref(
      buildWhatsAppLink(
        "Olá Rhodrygo! Vim pelo site e gostaria de conversar sobre imóveis.",
        { source: "site", medium: "float_button", campaign: "whatsapp_float" },
        geo
      )
    );
  }, []);

  if (!href) {
    return (
      <a
        href="https://wa.me/5584981257444"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Falar no WhatsApp"
        className="whatsapp-float group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-rf-whatsapp text-white shadow-lg transition-transform duration-200 hover:scale-110"
      >
        <MessageCircle className="h-7 w-7" fill="currentColor" strokeWidth={0} />
      </a>
    );
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Falar no WhatsApp"
      onClick={() => trackLead("Contact", { content_name: "whatsapp_float" })}
      className="whatsapp-float group fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-rf-whatsapp text-white shadow-lg transition-transform duration-200 hover:scale-110"
    >
      <MessageCircle className="h-7 w-7" fill="currentColor" strokeWidth={0} />
      <span className="pointer-events-none absolute right-full mr-3 whitespace-nowrap rounded-lg bg-rf-navy px-3 py-2 text-sm font-medium text-white opacity-0 transition-all duration-300 translate-x-2 group-hover:translate-x-0 group-hover:opacity-100">
        Fale comigo!
      </span>
    </a>
  );
}
