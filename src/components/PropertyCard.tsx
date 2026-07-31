"use client";

import Image from "next/image";
import Link from "next/link";
import { Bed, Bath, Maximize, Car, MessageCircle, MapPin } from "lucide-react";
import { InstagramIcon } from "@/components/SocialIcons";
import type { Property } from "@/types";
import { formatPrice, buildWhatsAppLink, cn, stripEmojis, truncateText } from "@/lib/utils";
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

  const cleanTitle = stripEmojis(property.title);
  const teaser = property.description ? truncateText(property.description, 100) : "";

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
        "group relative flex flex-col self-start overflow-hidden rounded-2xl bg-white",
        "shadow-[0_4px_16px_rgba(15,23,42,0.06)]",
        "transition-[transform,box-shadow] duration-300 ease-out",
        "hover:-translate-y-1.5 hover:shadow-[0_20px_40px_rgba(15,23,42,0.14)]",
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
          className="object-cover transition-transform duration-500 ease-out group-hover:scale-[1.06]"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-rf-navy/50 via-transparent to-transparent opacity-60 transition-opacity duration-300 group-hover:opacity-80" />

        <span className="absolute left-3 top-3 rounded-full bg-rf-gold px-2.5 py-1 text-[11px] font-bold uppercase tracking-wide text-rf-navy shadow-sm">
          {property.badge}
        </span>
        <span className="absolute bottom-3 right-3 rounded-xl bg-white/95 px-3 py-1.5 text-sm font-bold text-rf-navy shadow-lg backdrop-blur-sm">
          {priceLabel}
        </span>
        <span className="absolute bottom-3 left-3 rounded-lg bg-rf-navy/80 px-2.5 py-1 text-[11px] font-medium capitalize text-white/90 backdrop-blur-sm">
          {locationLabel}
        </span>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <Link href={`/imoveis/${property.slug}`} className="mb-2 block">
          <h3 className="line-clamp-2 font-display text-lg font-semibold leading-snug text-rf-navy transition-colors duration-200 group-hover:text-rf-gold">
            {cleanTitle}
          </h3>
        </Link>

        {teaser && (
          <p className="mb-3 line-clamp-2 text-sm leading-relaxed text-gray-600">
            {teaser}
          </p>
        )}

        <div className="mb-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs font-medium text-gray-600">
          {specItems.map(({ icon: Icon, label }) => (
            <span key={label} className="inline-flex items-center gap-1.5">
              <Icon className="h-3.5 w-3.5 shrink-0 text-rf-gold" />
              {label}
            </span>
          ))}
          {featureItems.map((feature) => (
            <span
              key={feature}
              className="rounded-full bg-rf-cream px-2 py-0.5 text-[11px] font-semibold text-rf-navy/80"
            >
              {feature}
            </span>
          ))}
        </div>

        <div className="mt-auto flex gap-2 pt-1">
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleWhatsAppClick}
            className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-rf-whatsapp px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-rf-whatsapp/20 transition-all duration-200 hover:translate-y-[-1px] hover:bg-[#1ebd5b] hover:shadow-lg active:translate-y-0"
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
              className="flex shrink-0 items-center justify-center rounded-xl border border-gray-200 px-3.5 text-rf-navy transition-all duration-200 hover:border-rf-gold hover:bg-rf-gold/5 hover:text-rf-gold"
            >
              <InstagramIcon className="h-4 w-4" />
            </a>
          )}
        </div>
      </div>
    </article>
  );
}
