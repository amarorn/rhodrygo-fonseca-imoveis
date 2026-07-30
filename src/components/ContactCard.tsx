"use client";

import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface ContactCardProps {
  icon: LucideIcon;
  title: string;
  content: string;
  href?: string;
  className?: string;
}

export function ContactCard({
  icon: Icon,
  title,
  content,
  href,
  className,
}: ContactCardProps) {
  const inner = (
    <>
      <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-rf-gold/10">
        <Icon className="h-5 w-5 text-rf-gold" />
      </div>
      <h4 className="mb-1 font-semibold text-rf-navy">{title}</h4>
      <p className="text-sm text-gray-600">{content}</p>
    </>
  );

  if (href) {
    return (
      <a
        href={href}
        target={href.startsWith("http") ? "_blank" : undefined}
        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
        className={cn(
          "block rounded-2xl border border-gray-100 bg-white p-5 shadow-sm transition-all hover:border-rf-gold/30 hover:shadow-md",
          className
        )}
      >
        {inner}
      </a>
    );
  }

  return (
    <div
      className={cn(
        "rounded-2xl border border-gray-100 bg-white p-5 shadow-sm",
        className
      )}
    >
      {inner}
    </div>
  );
}
