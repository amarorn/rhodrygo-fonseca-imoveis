"use client";

import {
  MessageCircle,
  Search,
  Key,
  CheckCircle,
  type LucideIcon,
} from "lucide-react";
import type { Step } from "@/types";

const ICON_MAP: Record<string, LucideIcon> = {
  MessageCircle,
  Search,
  Key,
  CheckCircle,
};

interface StepCardProps {
  step: Step;
  className?: string;
}

export function StepCard({ step, className }: StepCardProps) {
  const Icon = ICON_MAP[step.icon] ?? MessageCircle;

  return (
    <div className={className}>
      <div className="step-number mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-rf-gold font-display text-lg font-bold text-rf-navy">
        {step.number}
      </div>
      <div className="step-icon mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-rf-gold/10">
        <Icon className="h-6 w-6 text-rf-gold" />
      </div>
      <h3 className="mb-2 font-display text-xl font-semibold text-rf-navy">
        {step.title}
      </h3>
      <p className="text-sm leading-relaxed text-gray-600">{step.description}</p>
    </div>
  );
}
