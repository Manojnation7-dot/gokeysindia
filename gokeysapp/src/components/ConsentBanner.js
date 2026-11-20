"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { currentConsent, setConsent } from "@/lib/consent";
import { pixelId } from "@/lib/tracking";

// One-line notice for the Meta Pixel (Phase F): Accept / Decline. Decline (or no choice) = no Pixel. Shown only while
// NEXT_PUBLIC_META_PIXEL_ID is set and the visitor has not chosen; never on the guest's booking pages. Google and
// essential cookies are not affected.
const PIXEL_ON = Boolean(pixelId(process.env.NEXT_PUBLIC_META_PIXEL_ID));

export default function ConsentBanner() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (PIXEL_ON && !currentConsent() && !/^\/book\/(check|booking)(\/|$)/.test(window.location.pathname)) setOpen(true);
  }, []);

  if (!open) return null;
  const choose = (value) => { setConsent(value); setOpen(false); };
  return (
    <div role="dialog" aria-live="polite" aria-label="Cookie notice" className="fixed inset-x-0 bottom-0 z-[60] p-3 pointer-events-none">
      <div className="pointer-events-auto mx-auto max-w-3xl rounded-xl border border-line bg-white px-4 py-3 shadow-lg flex flex-wrap items-center gap-x-4 gap-y-2">
        <p className="text-sm text-ink flex-1 min-w-[14rem]">
          We use a Meta (Facebook/Instagram) Pixel cookie to measure our ads. <Link href="/privacy-policy#cookies" className="underline">Privacy Policy</Link>
        </p>
        <div className="flex gap-2 shrink-0">
          <button type="button" onClick={() => choose("denied")} className="gk-btn gk-btn-line py-2! min-h-[44px]">Decline</button>
          <button type="button" onClick={() => choose("granted")} className="gk-btn gk-btn-sun py-2! min-h-[44px]">Accept</button>
        </div>
      </div>
    </div>
  );
}
