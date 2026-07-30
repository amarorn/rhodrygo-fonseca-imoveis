"use client";

import { useEffect } from "react";
import { captureUtmFromUrl } from "@/lib/analytics";

export function UtmCapture() {
  useEffect(() => {
    captureUtmFromUrl();
  }, []);

  return null;
}
