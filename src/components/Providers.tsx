"use client";

import { useEffect } from "react";
import { useExitIntent } from "@/hooks/useExitIntent";
import { ToastProvider } from "@/components/Toast";
import { LenisProvider, useLenisScroll } from "@/components/LenisProvider";
import { CustomCursor } from "@/components/CustomCursor";
import { WhatsAppFloat } from "@/components/WhatsAppFloat";
import { LocationAgent } from "@/components/LocationAgent";
import { ExitIntentModal } from "@/components/ExitIntentModal";
import { UtmCapture } from "@/components/UtmCapture";

function ScrollBridge() {
  const ctx = useLenisScroll();

  useEffect(() => {
    if (ctx?.scrollTo) {
      (
        window as Window & {
          __rfScrollTo?: (target: string | number, offset?: number) => void;
        }
      ).__rfScrollTo = ctx.scrollTo;
    }
    return () => {
      delete (
        window as Window & {
          __rfScrollTo?: (target: string | number, offset?: number) => void;
        }
      ).__rfScrollTo;
    };
  }, [ctx]);

  return null;
}

function GlobalUI() {
  const { isOpen, close } = useExitIntent();

  return (
    <>
      <ScrollBridge />
      <UtmCapture />
      <CustomCursor />
      <WhatsAppFloat />
      <LocationAgent />
      <ExitIntentModal isOpen={isOpen} onClose={close} />
    </>
  );
}

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ToastProvider>
      <LenisProvider>
        {children}
        <GlobalUI />
      </LenisProvider>
    </ToastProvider>
  );
}
