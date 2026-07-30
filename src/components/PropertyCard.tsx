"use client";

import Image from "next/image";
import { Bed, Bath, Maximize, Car, MessageCircle, MapPin } from "lucide-react";
import type { Property } from "@/types";
import { formatPrice, buildWhatsAppLink, cn } from "@/lib/utils";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const whatsappMessage = `Olá Rhodrygo! Tenho interesse no ${property.title} em ${property.location} (${formatPrice(property.price)})`;
  const whatsappHref = buildWhatsAppLink(whatsappMessage);

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl",
        className
      )}
    >
      <div
        className="relative aspect-[3/2] overflow-hidden"
        data-cursor="image"
      >
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-rf-gold px-3 py-1 text-xs font-semibold text-rf-navy">
          {property.badge}
        </span>
        <span className="absolute bottom-3 right-3 rounded-lg bg-rf-navy/90 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
          {formatPrice(property.price)}
        </span>
      </div>

      <div className="p-5">
        <h3 className="mb-1 font-display text-lg font-semibold text-rf-navy">
          {property.title}
        </h3>
        <p className="mb-3 flex items-center gap-1 text-sm text-gray-500">
          <MapPin className="h-3.5 w-3.5 shrink-0 text-rf-gold" />
          {property.location}
        </p>

        <div className="mb-4 flex flex-wrap gap-3 text-xs text-gray-600">
          {property.bedrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bed className="h-3.5 w-3.5" /> {property.bedrooms} Qts
            </span>
          )}
          {property.bathrooms !== undefined && (
            <span className="flex items-center gap-1">
              <Bath className="h-3.5 w-3.5" /> {property.bathrooms} Banh
            </span>
          )}
          <span className="flex items-center gap-1">
            <Maximize className="h-3.5 w-3.5" /> {property.area}m²
          </span>
          {property.parking !== undefined && (
            <span className="flex items-center gap-1">
              <Car className="h-3.5 w-3.5" /> {property.parking} vagas
            </span>
          )}
          {property.features?.map((f) => (
            <span key={f} className="rounded-full bg-rf-cream px-2 py-0.5">
              {f}
            </span>
          ))}
        </div>

        <a
          href={whatsappHref}
          target="_blank"
          rel="noopener noreferrer"
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-rf-whatsapp py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
        >
          <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
          Quero Saber Mais
        </a>
      </div>
    </article>
  );
}
