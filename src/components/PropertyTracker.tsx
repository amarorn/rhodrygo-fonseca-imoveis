"use client";

import { useEffect } from "react";
import type { Property } from "@/types";
import { trackLead } from "@/lib/analytics";

interface PropertyTrackerProps {
  property: Property;
}

export function PropertyTracker({ property }: PropertyTrackerProps) {
  useEffect(() => {
    trackLead("ViewContent", {
      content_name: property.title,
      content_category: property.category,
      content_ids: property.id,
    });
  }, [property]);

  return null;
}
