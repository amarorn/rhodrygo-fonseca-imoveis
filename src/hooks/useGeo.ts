"use client";

import { useEffect, useState } from "react";
import { getStoredGeo, subscribeGeo, type GeoParams } from "@/lib/analytics";

export function useGeo(): GeoParams | null {
  const [geo, setGeo] = useState<GeoParams | null>(() => getStoredGeo());

  useEffect(() => {
    const stored = getStoredGeo();
    if (stored) setGeo(stored);

    const unsubscribe = subscribeGeo((newGeo) => {
      if (newGeo) setGeo(newGeo);
    });

    return unsubscribe;
  }, []);

  return geo;
}
