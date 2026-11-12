"use client";

import { createContext, useContext } from "react";
import { SITE_DEFAULTS } from "@/lib/siteSettings";

// The site settings fetched once by the root layout (src/lib/siteSettings.js), for client components.
const SiteSettingsContext = createContext(SITE_DEFAULTS);

export function SiteSettingsProvider({ value, children }) {
  return <SiteSettingsContext.Provider value={value || SITE_DEFAULTS}>{children}</SiteSettingsContext.Provider>;
}

export const useSiteSettings = () => useContext(SiteSettingsContext);
