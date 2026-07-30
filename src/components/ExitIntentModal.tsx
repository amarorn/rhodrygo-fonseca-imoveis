"use client";

import { useEffect, useRef } from "react";
import { X, Gift } from "lucide-react";
import gsap from "gsap";
import { LeadForm } from "@/components/LeadForm";
import { registerGSAP, prefersReducedMotion } from "@/lib/animations";

interface ExitIntentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ExitIntentModal({ isOpen, onClose }: ExitIntentModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    registerGSAP();

    if (prefersReducedMotion()) {
      return;
    }

    const tl = gsap.timeline();
    tl.fromTo(
      overlayRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.3 }
    )
      .fromTo(
        modalRef.current,
        { y: -50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.4, ease: "power3.out" },
        0
      )
      .fromTo(
        iconRef.current,
        { scale: 0 },
        { scale: 1, duration: 0.3, ease: "back.out(1.7)" },
        0.2
      );

    return () => {
      tl.kill();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 p-4 backdrop-blur-sm"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="exit-modal-title"
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-md rounded-2xl bg-white p-8 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full p-1 text-gray-400 transition-colors hover:text-rf-navy"
          aria-label="Fechar"
        >
          <X className="h-5 w-5" />
        </button>

        <div
          ref={iconRef}
          className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-rf-gold/10"
        >
          <Gift className="h-8 w-8 text-rf-gold" />
        </div>

        <h2
          id="exit-modal-title"
          className="mb-2 text-center font-display text-2xl font-bold text-rf-navy"
        >
          Espere! Não vai embora ainda 🎁
        </h2>
        <p className="mb-6 text-center text-sm text-gray-600">
          Receba GRÁTIS o e-book &quot;Guia Completo: Como Comprar seu Imóvel com
          Segurança&quot;
        </p>

        <LeadForm
          variant="exit-intent"
          onSuccess={onClose}
        />
      </div>
    </div>
  );
}
