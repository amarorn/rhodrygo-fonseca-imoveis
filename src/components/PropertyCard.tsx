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

  const locationLabel = property.location
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .join(", ");

  const specItems = [
    property.bedrooms != null && property.bedrooms > 0
      ? { icon: Bed, label: `${property.bedrooms} qts` }
      : null,
    property.bathrooms != null && property.bathrooms > 0
      ? { icon: Bath, label: `${property.bathrooms} banh` }
      : null,
    property.area != null && property.area > 0
      ? { icon: Maximize, label: `${property.area} m²` }
      : null,
    property.parking != null && property.parking > 0
      ? { icon: Car, label: `${property.parking} vagas` }
      : null,
  ].filter(Boolean) as { icon: typeof Bed; label: string }[];

  const featureItems = property.features?.slice(0, 2) ?? [];

  return (
    <article
      className={cn(
        "group flex flex-col self-start overflow-hidden rounded-2xl bg-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl",
        className
      )}
    >
      <Link
        href={`/imoveis/${property.slug}`}
        className="relative block aspect-[4/3] overflow-hidden"
        data-cursor="image"
      >
        <Image
          src={assetPath(property.image)}
          alt={property.title}
          fill
          unoptimized
          className="object-cover transition-transform duration-500 group-hover:scale-[1.05]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <span className="absolute left-3 top-3 rounded-full bg-rf-gold px-2.5 py-0.5 text-[11px] font-semibold text-rf-navy">
          {property.badge}
        </span>
        <span className="absolute bottom-3 right-3 rounded-lg bg-rf-navy/90 px-2.5 py-1 text-sm font-bold text-white backdrop-blur-sm">
          {priceLabel}
        </span>
      </Link>

      <div className="flex flex-col p-4">
        <Link href={`/imoveis/${property.slug}`} className="mb-2 block">
          <h3 className="line-clamp-2 font-display text-base font-semibold leading-snug text-rf-navy transition-colors hover:text-rf-gold">
            {property.title}
          </h3>
        </Link>

        <div className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-600">
          <span className="inline-flex items-center gap-1 capitalize text-gray-500">
            <MapPin className="h-3.5 w-3.5 shrink-0 text-rf-gold" />
            {locationLabel}
          </span>
          {specItems.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1">
              <Icon className="h-3.5 w-3.5 shrink-0 text-rf-gold/80" />
              {label}
            </span>
          ))}
          {featureItems.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-rf-cream px-2 py-0.5 text-[11px] font-medium text-rf-navy/80"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-3 flex gap-2">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-rf-whatsapp py-2 text-sm font-semibold text-white transition-opacity hover:opacity-90"
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
              className="flex shrink-0 items-center justify-center rounded-xl border border-gray-200 px-3 text-rf-navy transition-colors hover:border-rf-gold hover:text-rf-gold"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
