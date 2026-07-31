"use client";

import { useEffect, useState } from "react";
import {
  captureGeoFromIp,
  getStoredGeo,
  subscribeGeo,
  type GeoParams,
} from "@/lib/analytics";

export function useGeo(): GeoParams | null {
  const [geo, setGeo] = useState<GeoParams | null>(() => getStoredGeo());

  useEffect(() => {
    const stored = getStoredGeo();
    if (stored) {
      setGeo(stored);
    } else {
      // Garante captura mesmo se UtmCapture ainda não terminou
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
