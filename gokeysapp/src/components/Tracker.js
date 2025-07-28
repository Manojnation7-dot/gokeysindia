'use client';

import { useEffect } from "react";
import { usePathname } from "next/navigation";

const shouldTrack = (url) => {
  const excludedPaths = ["/admin", "/api", "/_next", "/static", "/media"];
  return !excludedPaths.some((path) => url.startsWith(path));
};

export default function Tracker() {
  const pathname = usePathname();

  useEffect(() => {
    if (!shouldTrack(pathname)) return;

    const track = async () => {
      try {
        await fetch('/api/track/', { // ✅ trailing slash here
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            path: pathname,
            referrer: document.referrer,
            title: document.title,
            url: window.location.href,
          }),
        });
      } catch (err) {
        console.error('Tracking failed:', err);
      }
    };

    track();
  }, [pathname]);

  return null;
}
