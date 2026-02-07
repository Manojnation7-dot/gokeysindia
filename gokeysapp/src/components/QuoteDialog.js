"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "@/components/Icons";
import { isPriceOnRequest, formatPrice, getSavings } from "@/lib/pricingUtils";
import { getCSRFToken } from "@/lib/getCSRFToken";

export default function QuoteDialog({
  isOpen,
  onClose,
  tourName,
  packageType,
  packagePrice,
  tourImage,
  isInline = false,
  showSubmitButton = true,
  formData: externalFormData,
  onChange: externalOnChange,
  onSubmit: externalOnSubmit,
}) {
  const [internalFormData, setInternalFormData] = useState({
    name: "",
    email: "",
    contactNo: "",
    totalPersons: "",
    travelDate: "",
    message: "",
  });
  const [dateInputType, setDateInputType] = useState("text");
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formData = isInline ? externalFormData : internalFormData;
  const setFormData = isInline ? externalOnChange : setInternalFormData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const finalPrice = isPriceOnRequest(packagePrice)
      ? "Price on Request"
      : packagePrice?.discount_price || packagePrice?.price || null;

    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      if (!siteKey) {
        console.error("reCAPTCHA site key missing.");
        setError("reCAPTCHA configuration error. Please try again later.");
        return;
      }

      // Wait for grecaptcha to load (retry mechanism)
      const waitForGrecaptcha = () =>
        new Promise((resolve, reject) => {
          let attempts = 0;
          const maxAttempts = 10;
          const check = () => {
            if (window.grecaptcha) {
              resolve(window.grecaptcha);
            } else if (attempts < maxAttempts) {
              attempts++;
              setTimeout(check, 500);
            } else {
              reject(new Error("reCAPTCHA failed to load"));
            }
          };
          check();
        });

      let grecaptcha;
      try {
        grecaptcha = await waitForGrecaptcha();
      } catch (err) {
        setError("Failed to load reCAPTCHA. Please check your connection.");
        return;
      }

      // Generate token
      let recaptchaToken;
      try {
        recaptchaToken = await new Promise((resolve, reject) => {
          grecaptcha.ready(() => {
            grecaptcha
              .execute(siteKey, { action: "submit_quote" })
              .then((token) => resolve(token))
              .catch((err) => reject(err));
          });
        });
      } catch (err) {
        console.error("Token generation failed:", err);
        setError("reCAPTCHA verification failed. Please try again.");
        return;
      }

      const csrfToken = getCSRFToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-enquiries/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify({
          tour_name: tourName,
          package_type: packageType,
          package_price: finalPrice,
          name: formData.name,
          email: formData.email,
          contact_no: formData.contactNo,
          total_persons: parseInt(formData.totalPersons || "0", 10),
          travel_date: formData.travelDate,
          message: formData.message,
          recaptcha_token: recaptchaToken, // ✅ attach reCAPTCHA token
        }),
      });

      if (res.ok) {
        console.log("Quote enquiry submitted successfully");
       // GOOGLE ADS / GTM CONVERSION EVENT
          // --- Google Ads Conversion (Direct gtag) ---
          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "conversion", {
              send_to: "AW-CONVERSION_ID/CONVERSION_LABEL",
              value: 1.0,
              currency: "INR"
            });
          }

          // (Optional) keep dataLayer for future GTM
          if (typeof window !== "undefined") {
            window.dataLayer = window.dataLayer || [];
            window.dataLayer.push({
              event: "gokeys_quote_submit",
              tour_name: tourName || "",
              package_type: packageType || ""
            });
          }
        if (!isInline) {
          setInternalFormData({
            name: "",
            email: "",
            contactNo: "",
            totalPersons: "",
            travelDate: "",
            message: "",
          });
          setDateInputType("text");
          onClose();
        }
        if (externalOnSubmit) externalOnSubmit(formData);
      } else {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        setError(`Failed to submit: ${errorData.error || "Please try again."}`);
      }
    } catch (err) {
      console.error("Error:", err);
      setError("Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const FormFields = (
    <div className="space-y-4">
      {error && <div className="text-red-600 text-sm">{error}</div>}
      <input
        type="text"
        name="name"
        value={formData.name}
        onChange={handleChange}
        placeholder="Enter your full name"
        required
        className="w-full px-4 py-2.5 text-sm border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        placeholder="Enter your email address"
        required
        className="w-full px-4 py-2.5 text-sm border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
      />
      <input
        type="tel"
        name="contactNo"
        value={formData.contactNo}
        onChange={handleChange}
        placeholder="Enter your phone number"
        required
        className="w-full px-4 py-2.5 text-sm border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          name="totalPersons"
          value={formData.totalPersons}
          onChange={handleChange}
          placeholder="No. of people"
          min="1"
          required
          className="w-full px-4 py-2.5 text-sm border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
        <input
          type={dateInputType}
          name="travelDate"
          value={formData.travelDate}
          onChange={handleChange}
          onFocus={() => setDateInputType("date")}
          onBlur={() => !formData.travelDate && setDateInputType("text")}
          placeholder="Travel Date"
          required
          className="w-full px-4 py-2.5 text-sm border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <textarea
        name="message"
        value={formData.message}
        onChange={handleChange}
        placeholder="Any specific requirements or questions?"
        rows="4"
        className="w-full px-4 py-2.5 text-sm border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
      />
      {showSubmitButton && (
        <motion.button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold ${
            isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-blue-700 hover:to-indigo-700"
          }`}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? "Submitting..." : "Get a Quote Now"}
        </motion.button>
      )}
    </div>
  );

  const FormContent = (
    <div
      className={`space-y-4 ${
        !isInline && "p-6 bg-white rounded-2xl shadow-xl border relative"
      }`}
    >
      {!isInline && (
        <>
          <motion.button
            onClick={onClose}
            className="absolute top-2 right-2 text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 z-10"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close quote dialog"
          >
            <XIcon className="w-5 h-5" />
          </motion.button>
          <div className="flex items-start gap-3 mb-4 p-3 bg-blue-50 rounded-lg">
            <div className="relative w-16 h-16 flex-shrink-0">
              <img
                src={
                  tourImage?.optimized_card ||
                  tourImage?.image ||
                  "https://via.placeholder.com/60"
                }
                alt={`${tourName} thumbnail`}
                className="w-full h-full object-cover rounded-lg shadow-sm"
                loading="lazy"
              />
            </div>
            <div className="flex-1">
              <p className="text-base font-semibold text-blue-900">{tourName}</p>
              <p className="text-sm text-blue-700">
                {isPriceOnRequest(packagePrice) ? (
                  <span className="text-gray-400 italic">Price on Request</span>
                ) : (
                  <>
                    <span className="text-blue-600 font-semibold">
                      {formatPrice(packagePrice?.discount_price || packagePrice?.price)}
                    </span>
                    {getSavings(packagePrice) && (
                      <>
                        <span className="line-through text-gray-400 ml-2">
                          {formatPrice(packagePrice.price)}
                        </span>
                        <span className="text-green-600 ml-2">
                          Save {getSavings(packagePrice)}
                        </span>
                      </>
                    )}
                  </>
                )}
              </p>
            </div>
          </div>
        </>
      )}
      {isInline ? FormFields : <form onSubmit={handleSubmit}>{FormFields}</form>}
    </div>
  );

  if (isInline) return FormContent;
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 flex items-center justify-center z-50"
        onClick={onClose}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="w-full max-w-md mx-4"
          onClick={(e) => e.stopPropagation()}
        >
          {FormContent}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
