"use client";

import { useEffect } from "react";
import type { Property } from "@/types";
import { rememberPropertyView, trackLead } from "@/lib/analytics";

interface PropertyTrackerProps {
  property: Property;
}

export function PropertyTracker({ property }: PropertyTrackerProps) {
  useEffect(() => {
    rememberPropertyView({
      id: property.id,
      slug: property.slug,
      title: property.title,
      location: property.location,
      price: property.price,
      category: property.category,
    });
    trackLead("ViewContent", {
      content_name: property.title,
      content_category: property.category,
      content_ids: property.id,
    });
  }, [property]);

  return null;
}
