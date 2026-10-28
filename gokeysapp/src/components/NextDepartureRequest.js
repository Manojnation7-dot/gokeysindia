"use client";

import { useState } from "react";
import { CalendarClock, CheckCircle2 } from "lucide-react";
import { getCSRFToken } from "@/lib/getCSRFToken";
import { todayIST } from "@/lib/departures";
import { currentPageUrl } from "@/lib/tourEnquiry";
import { RECAPTCHA_RETRY_MESSAGE, getRecaptchaToken, startRecaptcha } from "@/lib/recaptcha";

const LABELS = {
  preferred_month: "Preferred month",
  contact_no: "Mobile number",
  total_persons: "Travellers",
  group_tour_slug: "Tour",
  email: "Email",
  name: "Name",
  travel_date: "Travel date",
};

// A fresh token for each request; the backend requires it for this form (action "next_departure")
async function recaptchaToken() {
  try {
    return await getRecaptchaToken("next_departure");
  } catch (err) {
    console.error("reCAPTCHA error:", err);
    throw new Error(RECAPTCHA_RETRY_MESSAGE);
  }
}

// Shown on a group tour page when it has no upcoming confirmed departures.
export default function NextDepartureRequest({ tourSlug, tourName, compact = false }) {
  const thisMonth = todayIST().slice(0, 7);
  const [form, setForm] = useState({
    month: "", name: "", phone: "", email: "", travellers: "2", message: "", privateTour: false,
  });
  const [state, setState] = useState("idle"); // idle | sending | done
  const [error, setError] = useState("");

  const set = (key) => (e) => {
    const value = e.target.type === "checkbox" ? e.target.checked : e.target.value;
    if (key === "phone" && !/^[+\d\s-]*$/.test(value)) return;
    setForm((f) => ({ ...f, [key]: value }));
  };

  const submit = async (e) => {
    e.preventDefault();
    if (state === "sending") return;
    setState("sending");
    setError("");
    try {
      const token = await recaptchaToken();
      const monthLabel = new Date(`${form.month}-01T00:00:00`).toLocaleDateString("en-IN", { month: "long", year: "numeric" });
      // travel_date keeps older backends working: first day of the month, or today if that has passed
      const firstDay = `${form.month}-01`;
      const travelDate = firstDay < todayIST() ? todayIST() : firstDay;
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-enquiries/`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "X-CSRFToken": getCSRFToken() },
        body: JSON.stringify({
          source: "NEXT_DEPARTURE_REQUEST",
          group_tour_slug: tourSlug,
          tour_name: `${tourName} (Group Tour)`,
          preferred_month: monthLabel,
          travel_date: travelDate,
          name: form.name.trim(),
          contact_no: form.phone.trim(),
          email: form.email.trim(),
          total_persons: parseInt(form.travellers || "1", 10),
          private_tour: form.privateTour,
          message: `[Next departure request: ${monthLabel}${form.privateTour ? ", private tour OK" : ""}] ${form.message}`.trim(),
          recaptcha_token: token,
          page_url: currentPageUrl(),
        }),
      });
      if (res.ok) {
        setState("done");
        if (typeof window !== "undefined") {
          window.dataLayer = window.dataLayer || [];
          window.dataLayer.push({ event: "gokeys_enquiry_submit", tour_name: tourName, package_type: "next_departure" });
        }
        return;
      }
      const data = await res.json().catch(() => ({}));
      const field = Object.keys(data)[0];
      const detail = Array.isArray(data[field]) ? data[field][0] : data[field];
      throw new Error(
        res.status === 429 ? detail || "Too many requests. Please call or WhatsApp us."
          : detail ? `${LABELS[field] ? `${LABELS[field]}: ` : ""}${detail}` : "Could not send your request. Please try again."
      );
    } catch (err) {
      setError(err.message || "Network error. Please check your connection and try again.");
      setState("idle");
    }
  };

  return (
    <section id="next-departure" className="gk-card p-5 md:p-7 scroll-mt-24 border-t-4 border-sun">
      <div className="flex items-start gap-3">
        <CalendarClock className="text-sun shrink-0 mt-1" size={26} />
        <div>
          <h2 className="gk-h2 text-2xl!">New Departure Dates Coming Soon</h2>
          <p className="gk-lead mt-2">
            Our next group departure dates are being finalised. Share your preferred travel dates and our team will
            contact you when new departures are available.
          </p>
        </div>
      </div>

      {state === "done" ? (
        <div className="mt-6 rounded-xl bg-[#e7f6ec] p-5 flex gap-3" role="status">
          <CheckCircle2 className="text-wa shrink-0" />
          <div>
            <p className="font-bold text-ink">Thank you! Your request has been received.</p>
            <p className="text-slate-ink mt-1">
              We will contact you on {form.phone} as soon as new dates for {tourName} are confirmed.
            </p>
          </div>
        </div>
      ) : (
        <form onSubmit={submit} onFocus={startRecaptcha} className={`mt-6 grid gap-4 ${compact ? "" : "sm:grid-cols-2"}`} noValidate={false}>
          <label className="block">
            <span className="gk-label">Preferred travel month *</span>
            <input type="month" required min={thisMonth} value={form.month} onChange={set("month")} className="gk-field" />
          </label>
          <label className="block">
            <span className="gk-label">Number of travellers *</span>
            <input type="number" required min={1} max={100} value={form.travellers} onChange={set("travellers")} className="gk-field" />
          </label>
          <label className="block">
            <span className="gk-label">Name *</span>
            <input type="text" required maxLength={100} autoComplete="name" value={form.name} onChange={set("name")} className="gk-field" placeholder="Full name" />
          </label>
          <label className="block">
            <span className="gk-label">Mobile number *</span>
            <input type="tel" required minLength={10} maxLength={16} autoComplete="tel" value={form.phone} onChange={set("phone")} className="gk-field" placeholder="Mobile number" />
          </label>
          <label className={`block ${compact ? "" : "sm:col-span-2"}`}>
            <span className="gk-label">Email (optional)</span>
            <input type="email" maxLength={254} autoComplete="email" value={form.email} onChange={set("email")} className="gk-field" placeholder="you@example.com" />
          </label>
          <label className={`block ${compact ? "" : "sm:col-span-2"}`}>
            <span className="gk-label">Message (optional)</span>
            <textarea rows={3} maxLength={1000} value={form.message} onChange={set("message")} className="gk-field" placeholder="Pickup city, age group, any special needs" />
          </label>
          <label className={`flex items-start gap-2.5 text-[15px] text-ink ${compact ? "" : "sm:col-span-2"}`}>
            <input type="checkbox" checked={form.privateTour} onChange={set("privateTour")} className="mt-1 h-4 w-4 accent-[#1f6b74]" />
            I am also open to a private tour on my own dates
          </label>
          {error && <p className={`text-sm text-red-700 ${compact ? "" : "sm:col-span-2"}`} role="alert">{error}</p>}
          <div className={compact ? "" : "sm:col-span-2"}>
            <button type="submit" disabled={state === "sending"} className="gk-btn gk-btn-sun w-full sm:w-auto disabled:opacity-60">
              {state === "sending" ? "Sending…" : "Request Next Departure"}
            </button>
          </div>
        </form>
      )}
    </section>
  );
}
