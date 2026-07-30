"use client";

import {
  Shield,
  FileCheck,
  HeartHandshake,
  BadgeCheck,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { TRUST_BADGES } from "@/lib/constants";

const ICON_MAP: Record<string, LucideIcon> = {
  Shield,
  FileCheck,
  HeartHandshake,
  BadgeCheck,
  Zap,
};

export function TrustBadges() {
  return (
    <section className="border-b border-gray-100 bg-white py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 lg:justify-between">
          {TRUST_BADGES.map((badge) => {
            const Icon = ICON_MAP[badge.icon] ?? Shield;
            return (
              <div
                key={badge.id}
                className="flex items-center gap-2 text-gray-600"
              >
                <Icon className="h-5 w-5 shrink-0 text-rf-gold" />
                <span className="text-sm font-medium">{badge.label}</span>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
