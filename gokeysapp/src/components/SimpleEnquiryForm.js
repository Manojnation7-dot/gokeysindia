"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPhone, FaEnvelope, FaQuestionCircle } from "react-icons/fa";
import { getCSRFToken } from "@/lib/getCSRFToken";
export default function InquiryFormCard({ placeName = "this place" }) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: `I'd like to know more about ${placeName}...`,
    page_url:"", 
  });

  useEffect(() => {
  if (typeof window !== "undefined") {
    setFormData(prev => ({
      ...prev,
      page_url: window.location.href,
    }));
  }
}, []);

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
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
      const csrfToken = await getCSRFToken();

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/enquiries/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken,
        },
        credentials: "include",
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        throw new Error("Something went wrong!");
      }

      setSuccess(true);
      setFormData({ name: "", email: "", message: "" });
    } catch (err) {
      setError(err.message || "Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-white p-6 rounded-xl shadow-md border border-gray-100 top-6"
    >
      <div className="flex items-center mb-6">
        <div className="bg-green-100 p-2 rounded-lg mr-3">
          <FaQuestionCircle className="text-green-600 text-xl" />
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Have a Question?</h2>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Your Name
          </label>
          <input
            type="text"
            id="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="John Doe"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Your Email
          </label>
          <input
            type="email"
            id="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your@email.com"
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>
        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
            Your Message
          </label>
          <textarea
            id="message"
            value={formData.message}
            onChange={handleChange}
            rows="4"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition"
          />
        </div>

        {error && <p className="text-red-600 text-sm">{error}</p>}
        {success && <p className="text-green-600 text-sm">Query submitted successfully!</p>}

        <button
          type="submit"
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 px-4 rounded-lg font-medium hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center justify-center"
          disabled={loading}
        >
          {loading ? "Submitting..." : "Submit Query"}
        </button>
      </form>

      <div className="mt-8 pt-6 border-t border-gray-200">
        <h3 className="font-medium text-gray-800 mb-3 flex items-center">
          <FaPhone className="mr-2 text-green-600" /> Need immediate help?
        </h3>
        <p className="text-sm text-gray-600 mb-2">
          Call us at{" "}
          <a href="tel:+917830718687" className="text-green-700 hover:underline">
            +91 7830718687
          </a>
        </p>
        <p className="text-sm text-gray-600 flex items-center">
          <FaEnvelope className="mr-2" /> Email us at{" "}
          <a
            href="mailto:helpdesk@gokeys.in"
            className="text-green-700 hover:underline ml-1"
          >
            helpdesk@gokeys.in
          </a>
        </p>
      </div>
    </motion.div>
  );
}
