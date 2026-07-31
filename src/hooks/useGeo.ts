"use client";

import { useEffect, useState } from "react";
import {
  captureGeoFromIp,
  getStoredGeo,
  subscribeGeo,
  type GeoParams,
} from "@/lib/analytics";

/**
 * Sempre inicia em null (igual ao SSR) e só preenche no client
 * após o mount — evita hydration mismatch.
 */
export function useGeo(): GeoParams | null {
  const [geo, setGeo] = useState<GeoParams | null>(null);

  useEffect(() => {
    const stored = getStoredGeo();
    if (stored) {
      setGeo(stored);
    } else {
      void captureGeoFromIp().then((result) => {
        if (result) setGeo(result);
      });
    }

    const unsubscribe = subscribeGeo((newGeo) => {
      if (newGeo) setGeo(newGeo);
    });

    return unsubscribe;
  }, []);

  return geo;
}
