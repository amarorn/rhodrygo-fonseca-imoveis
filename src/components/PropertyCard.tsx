"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize, Car, MessageCircle, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/SocialIcons";
import type { Property } from "@/types";
import { formatPrice, buildWhatsAppLink, cn } from "@/lib/utils";
import { assetPath } from "@/lib/site";
import { buildPropertyUtm, trackLead } from "@/lib/analytics";

interface PropertyCardProps {
  property: Property;
  className?: string;
}

export function PropertyCard({ property, className }: PropertyCardProps) {
  const priceLabel = formatPrice(property.price);
  const utm = buildPropertyUtm(property.slug);
  const whatsappMessage = property.price
    ? `Olá Rhodrygo! Tenho interesse no ${property.title} em ${property.location} (${priceLabel}). Vi no seu site.`
    : `Olá Rhodrygo! Tenho interesse no ${property.title} em ${property.location}. Vi no seu site e gostaria de saber o valor.`;
  const whatsappHref = buildWhatsAppLink(whatsappMessage, utm);

  const handleWhatsAppClick = () => {
    trackLead("Lead", {
      content_name: property.title,
      content_category: property.category,
    });
  };

  return (
    <article
      className={cn(
        "group overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl",
        className
      )}
    >
      <Link
        href={`/imoveis/${property.slug}`}
        className="relative block aspect-[3/2] overflow-hidden"
        data-cursor="image"
      >
        <Image
          src={assetPath(property.image)}
          alt={property.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-[1.08]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-rf-gold px-3 py-1 text-xs font-semibold text-rf-navy">
          {property.badge}
        </span>
        <span className="absolute bottom-3 right-3 rounded-lg bg-rf-navy/90 px-3 py-1.5 text-sm font-bold text-white backdrop-blur-sm transition-transform duration-200 group-hover:scale-105">
          {priceLabel}
        </span>
      </Link>

      <div className="p-5">
        <Link href={`/imoveis/${property.slug}`}>
          <h3 className="mb-1 font-display text-lg font-semibold text-rf-navy transition-colors hover:text-rf-gold">
            {property.title}
          </h3>
        </Link>
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
          {property.features?.slice(0, 2).map((f) => (
            <span key={f} className="rounded-full bg-rf-cream px-2 py-0.5">
              {f}
            </span>
          ))}
        </div>

        <div className="flex gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rf-whatsapp py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90"
          >
            <MessageCircle className="h-4 w-4" fill="currentColor" strokeWidth={0} />
            Quero Saber Mais
          </a>
          {property.instagramUrl && (
            <a
              href={property.instagramUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Ver ${property.title} no Instagram`}
              className="flex items-center justify-center rounded-xl border border-gray-200 px-3 text-rf-navy transition-colors hover:border-rf-gold hover:text-rf-gold"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
