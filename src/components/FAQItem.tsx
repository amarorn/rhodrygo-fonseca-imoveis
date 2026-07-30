"use client";

import { useRef, useEffect } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface FAQItemProps {
  question: string;
  answer: string;
  isOpen: boolean;
  onToggle: () => void;
  id: string;
  tabIndex?: number;
}

export function FAQItem({
  question,
  answer,
  isOpen,
  onToggle,
  id,
  tabIndex = 0,
}: FAQItemProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    if (isOpen) {
      el.style.maxHeight = `${el.scrollHeight}px`;
    } else {
      el.style.maxHeight = "0px";
    }
  }, [isOpen, answer]);

  return (
    <div
      className={cn(
        "rounded-xl border transition-colors duration-300",
        isOpen ? "border-rf-gold" : "border-gray-200"
      )}
    >
      <button
        id={`faq-btn-${id}`}
        onClick={onToggle}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            onToggle();
          }
        }}
        tabIndex={tabIndex}
        aria-expanded={isOpen}
        aria-controls={`faq-panel-${id}`}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <span className="font-semibold text-rf-navy">{question}</span>
        <ChevronDown
          className={cn(
            "h-5 w-5 shrink-0 text-rf-gold transition-transform duration-300",
            isOpen && "rotate-180"
          )}
        />
      </button>
      <div
        id={`faq-panel-${id}`}
        ref={contentRef}
        role="region"
        aria-labelledby={`faq-btn-${id}`}
        className="overflow-hidden transition-[max-height] duration-300 ease-in-out"
        style={{ maxHeight: 0 }}
      >
        <p className="px-5 pb-4 text-sm leading-relaxed text-gray-600">{answer}</p>
      </div>
    </div>
  );
}
