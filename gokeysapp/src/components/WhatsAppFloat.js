"use client";

import { FaWhatsapp } from "react-icons/fa";

export default function WhatsAppFloat() {
  const openWhatsApp = () => {

   // GOOGLE ADS / GTM – WhatsApp Click Conversion
    if (typeof window !== "undefined") {
      window.dataLayer = window.dataLayer || [];
      window.dataLayer.push({
        event: "gokeys_whatsapp_click",
      });
    }

    const phone = "917830718687";
    const message = "Hello Gokeys India, I want to enquire about a tour.";

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
