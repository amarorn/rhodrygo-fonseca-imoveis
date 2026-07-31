"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  captureUtmFromUrl,
  captureGeoFromIp,
  trackSessionPageView,
} from "@/lib/analytics";

export function UtmCapture() {
  const pathname = usePathname();

  useEffect(() => {
    captureUtmFromUrl();
    captureGeoFromIp();
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    trackSessionPageView(`${window.location.pathname}${window.location.search}`);
  }, [pathname]);

  return null;
}
