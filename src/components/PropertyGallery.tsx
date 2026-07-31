"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { assetPath } from "@/lib/site";

interface PropertyGalleryProps {
  images: string[];
  title: string;
  badge: string;
  priceLabel: string;
}

export function PropertyGallery({
  images,
  title,
  badge,
  priceLabel,
}: PropertyGalleryProps) {
  const [index, setIndex] = useState(0);
  const total = images.length;
  const current = images[index] ?? images[0];

  const go = useCallback(
    (delta: number) => {
      if (total <= 1) return;
      setIndex((i) => (i + delta + total) % total);
    },
    [total]
  );

  useEffect(() => {
    if (total <= 1) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") go(-1);
      if (e.key === "ArrowRight") go(1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [go, total]);

  if (!current) return null;

  return (
    <div>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-rf-navy/5">
        <Image
          key={current}
          src={assetPath(current)}
          alt={`${title} — foto ${index + 1} de ${total}`}
          fill
          priority={index === 0}
          unoptimized
          className="object-cover transition-opacity duration-300"
          sizes="(max-width: 1024px) 100vw, 960px"
        />

        <span className="absolute left-4 top-4 rounded-full bg-rf-gold px-4 py-1.5 text-sm font-semibold text-rf-navy">
          {badge}
        </span>
        <span className="absolute bottom-4 right-4 rounded-xl bg-rf-navy/90 px-4 py-2 text-lg font-bold text-white backdrop-blur-sm">
          {priceLabel}
        </span>

        {total > 1 && (
          <>
            <span className="absolute bottom-4 left-4 rounded-lg bg-black/55 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
              {index + 1} / {total}
            </span>
            <button
              type="button"
              onClick={() => go(-1)}
              aria-label="Foto anterior"
              className="absolute left-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-rf-navy shadow-md transition hover:bg-white"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              type="button"
              onClick={() => go(1)}
              aria-label="Próxima foto"
              className="absolute right-3 top-1/2 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-rf-navy shadow-md transition hover:bg-white"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {total > 1 && (
        <div className="flex gap-2 overflow-x-auto border-t border-gray-100 bg-rf-cream/40 p-3">
          {images.map((src, i) => (
            <button
              key={src}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Ver foto ${i + 1}`}
              aria-current={i === index}
              className={cn(
                "relative h-16 w-24 shrink-0 overflow-hidden rounded-lg ring-2 transition",
                i === index
                  ? "ring-rf-gold"
                  : "ring-transparent opacity-70 hover:opacity-100"
              )}
            >
              <Image
                src={assetPath(src)}
                alt=""
                fill
                unoptimized
                className="object-cover"
                sizes="96px"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
