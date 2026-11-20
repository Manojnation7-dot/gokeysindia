"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { CONSENT_EVENT, currentConsent } from "@/lib/consent";
import { pixelId, shouldLoadPixel } from "@/lib/tracking";

// The Meta Pixel (Phase F). NEXT_PUBLIC_META_PIXEL_ID empty or not set: no Pixel code at all. Loaded only after the
// visitor presses Accept on the cookie notice (components/ConsentBanner.js), and never on /book/check or /book/booking
// (a guest's booking token is in their address). PageView on every page, including moves inside the site.
// Google Analytics / Google Ads are in app/layout.js and are not affected.
const PIXEL_ID = pixelId(process.env.NEXT_PUBLIC_META_PIXEL_ID);

function loadPixel(id) {
  if (window.fbq) return;
  /* eslint-disable */
  !function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?
  n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
  n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];
  s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');
  /* eslint-enable */
  window.fbq("init", id);
}

export default function Analytics() {
  const pathname = usePathname();
  const [consent, setConsent] = useState("");
  const lastPage = useRef("");

  useEffect(() => {
    if (!PIXEL_ID) return undefined;
    setConsent(currentConsent());
    const changed = (e) => setConsent(e.detail);
    window.addEventListener(CONSENT_EVENT, changed);
    return () => window.removeEventListener(CONSENT_EVENT, changed);
  }, []);

  useEffect(() => {
    if (!shouldLoadPixel({ id: PIXEL_ID, consent, pathname })) return;
    loadPixel(PIXEL_ID);
    if (lastPage.current !== pathname) {
      lastPage.current = pathname;
      window.fbq("track", "PageView");
    }
  }, [consent, pathname]);

  return null;
}
