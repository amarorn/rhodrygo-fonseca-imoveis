"use client";

import { useEffect } from "react";
import { captureUtmFromUrl, captureGeoFromIp } from "@/lib/analytics";

export function UtmCapture() {
  useEffect(() => {
    captureUtmFromUrl();
    captureGeoFromIp();
  }, []);

  return null;
}
