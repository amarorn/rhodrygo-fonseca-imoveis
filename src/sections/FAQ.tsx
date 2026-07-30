"use client";

import { useState, useCallback, KeyboardEvent } from "react";
import { FAQItem } from "@/components/FAQItem";
import { FAQ_ITEMS } from "@/lib/constants";

export function FAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggle = useCallback((id: string) => {
    setOpenId((prev) => (prev === id ? null : id));
  }, []);

  const handleKeyDown = (e: KeyboardEvent, index: number) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      const next = Math.min(index + 1, FAQ_ITEMS.length - 1);
      document.getElementById(`faq-btn-${FAQ_ITEMS[next].id}`)?.focus();
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      const prev = Math.max(index - 1, 0);
      document.getElementById(`faq-btn-${FAQ_ITEMS[prev].id}`)?.focus();
    }
  };

  return (
    <section className="py-20">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h2 className="mb-3 font-display text-3xl font-bold text-rf-navy sm:text-4xl">
            Perguntas Frequentes
          </h2>
          <p className="text-gray-600">
            Tire suas dúvidas sobre o processo de compra e venda de imóveis.
          </p>
        </div>

        <div className="space-y-3" role="list">
          {FAQ_ITEMS.map((item, index) => (
            <div
              key={item.id}
              role="listitem"
              onKeyDown={(e) => handleKeyDown(e, index)}
            >
              <FAQItem
                id={item.id}
                question={item.question}
                answer={item.answer}
                isOpen={openId === item.id}
                onToggle={() => toggle(item.id)}
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
