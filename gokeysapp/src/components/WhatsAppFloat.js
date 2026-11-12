"use client";

import { FaWhatsapp } from "react-icons/fa";
import { useSiteSettings } from "@/components/SiteSettingsProvider";
import { whatsappDigits } from "@/lib/siteSettings";

export default function WhatsAppFloat() {
  const { business } = useSiteSettings(); // WhatsApp number and message from the admin (Voucher and email settings)
  const openWhatsApp = () => {

    // --- Google Ads Conversion (Direct gtag) ---
    if (typeof window !== "undefined" && window.gtag) {
        window.gtag("event", "conversion", {
          send_to: "AW-956670461/VvnUCP3vuPQbEP3DlsgD",
          value: 1.0,
          currency: "INR",
        });
      }

    // (Optional) Keep dataLayer event for future GTM use
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "gokeys_whatsapp_click",
      });
    }

    const phone = whatsappDigits(business);
    const message = business.whatsapp_message || "Hello Gokeys India, I want to enquire about a tour.";

    const isMobile = /Android|iPhone|iPad|iPod|Opera Mini|IEMobile/i.test(
      navigator.userAgent
    );

    const url = isMobile
      ? `https://wa.me/${phone}?text=${encodeURIComponent(message)}`
      : `https://web.whatsapp.com/send?phone=${phone}&text=${encodeURIComponent(message)}`;

    window.open(url, "_blank", "noopener,noreferrer");
  };

  return (
    <button
      type="button"
      onClick={openWhatsApp}
      aria-label="WhatsApp Us"
      className="whatsapp-float"
    >
      <FaWhatsapp size={26} />
      <span>WhatsApp Us</span>
    </button>
  );
}
