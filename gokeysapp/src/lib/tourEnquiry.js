import { getCSRFToken } from "@/lib/getCSRFToken";

// Sends the inline (sidebar) enquiry form of a tour or group tour page to /api/tour-enquiries/.
// Returns { ok: true } or { ok: false, message } with a message fit to show the visitor.
export async function submitTourEnquiry({ tourName, packageType, packagePrice, formData }) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-enquiries/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": getCSRFToken(),
      },
      body: JSON.stringify({
        tour_name: (tourName || "").trim(),
        package_type: packageType || "",
        package_price: packagePrice === null || packagePrice === undefined ? "" : String(packagePrice),
        name: formData.name?.trim(),
        email: formData.email?.trim(),
        contact_no: formData.contactNo?.trim(),
        total_persons: parseInt(formData.totalPersons || "1", 10),
        travel_date: formData.travelDate,
        message: formData.message || "",
      }),
    });

    if (res.ok) {
      // Same GTM / Google Ads conversion event as the popup enquiry form
      if (typeof window !== "undefined") {
        window.dataLayer = window.dataLayer || [];
        window.dataLayer.push({ event: "gokeys_enquiry_submit", tour_name: tourName || "", package_type: packageType || "" });
      }
      return { ok: true };
    }

    const errors = await res.json().catch(() => ({}));
    const firstField = Object.keys(errors)[0];
    const detail = Array.isArray(errors[firstField]) ? errors[firstField][0] : errors[firstField];
    const labels = { travel_date: "Travel date", contact_no: "Contact number", email: "Email", name: "Name", total_persons: "Total persons" };
    return {
      ok: false,
      message: detail ? `${labels[firstField] || firstField}: ${detail}` : "Could not send your enquiry. Please try again.",
    };
  } catch (err) {
    console.error("Enquiry error:", err);
    return { ok: false, message: "Network error. Please check your connection and try again." };
  }
}
