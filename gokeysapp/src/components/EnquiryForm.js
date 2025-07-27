"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { XIcon } from "@/components/Icons";
import { getCSRFToken } from "@/lib/getCSRFToken";

export default function EnquiryForm({
  isOpen,
  onClose,
  tourName,
  packageType,
  packagePrice,
  formatPrice,
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
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const formData = isInline ? externalFormData : internalFormData;
  const setFormData = isInline ? externalOnChange : setInternalFormData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "contactNo" && !/^\+?\d*$/.test(value)) {
      return;
    }
    if (name === "totalPersons" && value < 1) {
      return;
    }
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const siteKey = process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY;
      console.log("SITE KEY:", siteKey);

      if (!siteKey) {
        console.error("reCAPTCHA site key is missing.");
        setError("reCAPTCHA configuration error. Please try again later.");
        return;
      }

      const waitForGrecaptcha = () => {
        return new Promise((resolve, reject) => {
          const maxAttempts = 10;
          let attempts = 0;
          const checkGrecaptcha = () => {
            if (window.grecaptcha) {
              console.log("✅ grecaptcha loaded after", attempts, "attempts");
              resolve(window.grecaptcha);
            } else if (attempts < maxAttempts) {
              attempts++;
              setTimeout(checkGrecaptcha, 500);
            } else {
              reject(new Error("reCAPTCHA script failed to load after retries."));
            }
          };
          checkGrecaptcha();
        });
      };

      let grecaptcha;
      try {
        grecaptcha = await waitForGrecaptcha();
      } catch (err) {
        console.error("reCAPTCHA load error:", err.message);
        setError("Failed to load reCAPTCHA. Please check your internet connection and try again.");
        return;
      }

      let recaptchaToken;
      try {
        recaptchaToken = await new Promise((resolve, reject) => {
          grecaptcha.ready(() => {
            grecaptcha
              .execute(siteKey, { action: "submit_enquiry" })
              .then((token) => {
                console.log("✅ reCAPTCHA token generated:", token);
                resolve(token);
              })
              .catch((err) => {
                console.error("reCAPTCHA execution error:", err);
                reject(err);
              });
          });
        });
      } catch (err) {
        console.error("reCAPTCHA token generation failed:", err);
        setError("reCAPTCHA verification failed. Please try again.");
        return;
      }

     const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/tour-enquiries/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": getCSRFToken(),
        },
        body: JSON.stringify({
          tour_name: tourName?.trim(),
          package_type: packageType || "",
          package_price: packagePrice || "",
          name: formData.name?.trim(),
          email: formData.email?.trim(),
          contact_no: formData.contactNo?.trim(),
          total_persons: parseInt(formData.totalPersons || "0", 10),
          travel_date: formData.travelDate,
          message: formData.message || "",
          recaptcha_token: recaptchaToken,
        }),
      });

      if (res.ok) {
        console.log("Enquiry submitted successfully");
        setError(null);
        alert("Your enquiry has been submitted successfully!");
        if (!isInline) {
          setInternalFormData({
            name: "",
            email: "",
            contactNo: "",
            totalPersons: "",
            travelDate: "",
            message: "",
          });
          onClose();
        }
        if (externalOnSubmit) {
          externalOnSubmit();
        }
      } else {
        const errorData = await res.json().catch(() => ({ error: "Unknown error" }));
        console.error("Failed to submit enquiry:", res.status, JSON.stringify(errorData, null, 2));
        setError(`Failed to submit enquiry: ${errorData.error || "Please try again."}`);
      }
    } catch (err) {
      console.error("Submission error:", err);
      setError("An error occurred while submitting the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const FormFields = (
    <div className="space-y-4">
      {error && (
        <div className="text-red-600 text-sm mb-4">{error}</div>
      )}
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5" htmlFor="name">
          Name
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Enter your full name"
          required
          aria-label="Full name"
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          required
          aria-label="Email address"
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
        />
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5" htmlFor="contactNo">
          Contact No.
        </label>
        <input
          id="contactNo"
          type="tel"
          name="contactNo"
          value={formData.contactNo}
          onChange={handleChange}
          placeholder="Enter your contact number"
          required
          aria-label="Contact number"
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5" htmlFor="totalPersons">
            Total Persons
          </label>
          <input
            id="totalPersons"
            type="number"
            name="totalPersons"
            value={formData.totalPersons}
            onChange={handleChange}
            placeholder="No. of people"
            min="1"
            required
            aria-label="Total persons"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
          />
        </div>
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-1.5" htmlFor="travelDate">
            Travel Date
          </label>
          <input
            id="travelDate"
            type="date"
            name="travelDate"
            value={formData.travelDate}
            onChange={handleChange}
            required
            aria-label="Travel date"
            className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
          />
        </div>
      </div>
      <div>
        <label className="block text-sm font-semibold text-gray-800 mb-1.5" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          value={formData.message}
          onChange={handleChange}
          placeholder="Any specific requirements or questions?"
          rows="4"
          aria-label="Message"
          className="w-full px-4 py-2.5 text-sm border border-gray-200 rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 shadow-sm"
        />
      </div>
      {showSubmitButton && (
        <motion.button
          type="submit"
          disabled={isLoading}
          className={`w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-2.5 rounded-lg font-semibold transition-all duration-300 shadow-md ${isLoading ? "opacity-50 cursor-not-allowed" : "hover:from-blue-700 hover:to-indigo-700"}`}
          whileHover={{ scale: isLoading ? 1 : 1.02 }}
          whileTap={{ scale: isLoading ? 1 : 0.98 }}
        >
          {isLoading ? "Submitting..." : "Send Query"}
        </motion.button>
      )}
    </div>
  );

  const FormContent = (
    <div className={isInline ? "space-y-4" : "space-y-4 p-6 bg-white rounded-2xl shadow-xl border border-gray-100"}>
      {!isInline && (
        <div className="flex justify-between items-center mb-4">
          <div className="p-3 bg-blue-50 rounded-lg flex-1">
            <p className="text-base font-semibold text-blue-900">{tourName}</p>
            <p className="text-sm text-blue-700">
              Package: {packageType} • {formatPrice(packagePrice)}
            </p>
          </div>
          <motion.button
            onClick={onClose}
            className="text-gray-600 hover:text-gray-900 p-2 rounded-full hover:bg-gray-100 transition-all"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            aria-label="Close form"
          >
            <XIcon className="w-5 h-5" />
          </motion.button>
        </div>
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