"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import type { Testimonial } from "@/types";
import { cn } from "@/lib/utils";

interface TestimonialCardProps {
  testimonial: Testimonial;
  className?: string;
}

export function TestimonialCard({ testimonial, className }: TestimonialCardProps) {
  return (
    <article
      className={cn(
        "rounded-2xl border border-white/10 bg-white/[0.08] p-6 backdrop-blur-md",
        className
      )}
    >
      <div className="mb-4 flex gap-0.5">
        {Array.from({ length: testimonial.rating }).map((_, i) => (
          <Star
            key={i}
            className="testimonial-star h-4 w-4 fill-rf-gold text-rf-gold"
          />
        ))}
      </div>
      <blockquote className="mb-6 text-sm italic leading-relaxed text-white/90">
        &ldquo;{testimonial.content}&rdquo;
      </blockquote>
      <div className="flex items-center gap-3">
        <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-full border-2 border-rf-gold">
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <p className="font-semibold text-white">{testimonial.name}</p>
          <p className="text-xs text-white/60">{testimonial.role}</p>
        </div>
      </div>
    </article>
  );
}
