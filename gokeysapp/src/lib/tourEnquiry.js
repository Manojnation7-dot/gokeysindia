import { getCSRFToken } from "@/lib/getCSRFToken";
import { trackLead } from "@/lib/tracking";

// The page the enquiry form was sent from (no query string or #fragment), for the team's CRM.
// Optional for the backend: older backends ignore it.
export const currentPageUrl = () =>
  typeof window === "undefined" ? "" : `${window.location.origin}${window.location.pathname}`;

// Sends the inline (sidebar) enquiry form of a tour or group tour page to /api/tour-enquiries/.
// Returns { ok: true } or { ok: false, message } with a message fit to show the visitor.
export async function submitTourEnquiry({ tourName, packageType, packagePrice, formData, groupTourSlug, departureId }) {
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
        ...(groupTourSlug && { group_tour_slug: groupTourSlug }),
        ...(departureId && { departure_id: departureId }),
        page_url: currentPageUrl(),
      }),
    });

    if (res.ok) {
      trackLead(); // Meta Pixel "Lead" (only with the Pixel on and the visitor's Accept)
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
    const labels = { departure_id: "Departure", group_tour_slug: "Tour", travel_date: "Travel date", contact_no: "Contact number", email: "Email", name: "Name", total_persons: "Total persons" };
    return {
      ok: false,
      message: detail ? `${labels[firstField] || firstField}: ${detail}` : "Could not send your enquiry. Please try again.",
    };
  } catch (err) {
    console.error("Enquiry error:", err);
    return { ok: false, message: "Network error. Please check your connection and try again." };
  }
}

/**
 * What is wrong with an enquiry before it is sent, as a message for the visitor, or "" when it can be sent.
 * today: YYYY-MM-DD in India (no travel date before it). requireMessage: the group tour form asks for every field.
 */
export function enquiryProblem(formData, { today, requireMessage = false } = {}) {
  const f = formData || {};
  if ((f.name || "").trim().length < 2) return "Please enter your full name.";
  if (!/^[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$/.test((f.email || "").trim())) return "Please enter a valid email address.";
  const digits = (f.contactNo || "").replace(/\D/g, "");
  if (!(digits.length === 10 || (digits.length === 12 && digits.startsWith("91")))) return "Please enter a 10-digit mobile number.";
  const persons = Number(f.totalPersons);
  if (!Number.isInteger(persons) || persons < 1 || persons > 100) return "Please enter the number of people (1 or more).";
  if (!/^\d{4}-\d{2}-\d{2}$/.test(f.travelDate || "")) return "Please choose your travel date.";
  if (today && f.travelDate < today) return "Please choose a travel date from today onwards.";
  if (requireMessage && !(f.message || "").trim()) return "Please write your question or requirements in the message.";
  return "";
}
