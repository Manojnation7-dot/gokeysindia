"use client";

import { useState, useEffect } from "react";
import { FaPhone, FaEnvelope, FaQuestionCircle } from "react-icons/fa";
import { getCSRFToken } from "@/lib/getCSRFToken";
import { RECAPTCHA_RETRY_MESSAGE, getRecaptchaToken, startRecaptcha } from "@/lib/recaptcha";
export default function InquiryFormCard({ placeName = "this place" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: `I'd like to know more about ${placeName}...`,
    page_url:"", 
  });

  useEffect(() => {
  if (typeof window !== "undefined") {
    setFormData(prev => ({
      ...prev,
      page_url: window.location.href || "direct",
    }));
  }
}, []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    if (e.target.id === "phone" && !/^[+\d\s-]*$/.test(e.target.value)) return;
    setFormData((prev) => ({
      ...prev,
      [e.target.id]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    try {
      let recaptchaToken;
      try {
        recaptchaToken = await getRecaptchaToken("general_enquiry"); // fresh token for every submission
      } catch (err) {
        console.error("reCAPTCHA error:", err);
        setError(RECAPTCHA_RETRY_MESSAGE); // nothing is sent without a token
        setLoading(false);
        return;
      }
      const csrfToken = await getCSRFToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          message: `Contact No: ${formData.phone.trim()}\n\n${formData.message}`,
          page_url: formData.page_url,
          recaptcha_token: recaptchaToken,
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        console.log("API Error:", data);
        throw new Error("Submission failed. Please try again or call us.");
      }

      setSuccess(true);
      setFormData({
      name: "",
      email: "",
      phone: "",
      message: `I'd like to know more about ${placeName}...`,
      page_url: window.location.href || "direct",
    });
    } catch (err) {
      setError(err.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="gk-card p-6 md:p-7">
      <div className="flex items-center mb-5">
        <FaQuestionCircle className="text-teal text-xl mr-2.5" />
        <h2 className="gk-h3 text-2xl">Have a Question?</h2>
      </div>

      <form onSubmit={handleSubmit} onFocus={startRecaptcha} className="space-y-4">
        <div>
          <label htmlFor="name" className="gk-label">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your Name"
            required
            className="gk-field"
          />
        </div>
        <div>
          <label htmlFor="email" className="gk-label">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className="gk-field"
          />
        </div>
        <div>
          <label htmlFor="phone" className="gk-label">
            Contact Number
          </label>
          <input
            type="tel"
            id="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Mobile number"
            autoComplete="tel"
            minLength={10}
            maxLength={16}
            required
            className="gk-field"
          />
        </div>
        <div>
          <label htmlFor="message" className="gk-label">
            Your Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="gk-field"
          />
        </div>

        {error && <p className="text-red-600 text-[15px]">{error}</p>}
        {success && <p className="text-green-600 text-[15px]">Query submitted successfully!</p>}

        <button
          type="submit"
          className="gk-btn gk-btn-sun w-full py-3! disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Query"}
        </button>
      </form>

      <div className="mt-6 pt-5 border-t border-line">
        <h3 className="font-bold text-ink mb-3 flex items-center">
          <FaPhone className="mr-2 text-teal" /> Need immediate help?
        </h3>
        <p className="text-[15px] text-slate-ink mb-2">
          Call us at{" "}
          <a href="tel:+917830718687" className="text-teal font-semibold hover:underline">
            +91 7830718687
          </a>
        </p>
        <p className="text-[15px] text-slate-ink flex items-center">
          <FaEnvelope className="mr-2" /> Email us at{" "}
          <a
            href="mailto:helpdesk@gokeys.in"
            className="text-teal font-semibold hover:underline ml-1"
          >
            helpdesk@gokeys.in
          </a>
        </p>
      </div>
    </div>
  );
}
