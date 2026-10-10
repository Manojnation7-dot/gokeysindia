"use client";

import { useState } from "react"; // 1. Added useState
import { X, Phone, CalendarDays } from "lucide-react";

export default function HotelEnquiryModal({ isOpen, onClose, hotel }) {
  // 2. Define state for the form fields
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    checkIn: "",
    checkOut: "",
    requirements: "",
  });

  if (!isOpen) return null;

  // 3. The logic to build the link and redirect
  const handleSubmit = (e) => {
    e.preventDefault();

    const adminPhone = "919045916770"; // Your number
    
    // Plain-text message; encodeURIComponent keeps "&", "#" etc. in names from breaking the link
    const message =
      `*New Booking Enquiry*

` +
      `*Hotel:* ${hotel.name}
` +
      `*Name:* ${formData.name}
` +
      `*Phone:* ${formData.phone}
` +
      `*Check-In:* ${formData.checkIn}
` +
      `*Check-Out:* ${formData.checkOut}
` +
      `*Special Requirements:* ${formData.requirements || "None"}`;

    const whatsappUrl = `https://wa.me/${adminPhone}?text=${encodeURIComponent(message)}`;

    // Opens WhatsApp in a new tab
    window.open(whatsappUrl, "_blank", "noopener,noreferrer");
  };

  // Helper to update state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-60 bg-black/60 flex items-center justify-center px-4" role="dialog" aria-modal="true">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl relative">
        <button onClick={onClose} aria-label="Close" className="absolute top-4 right-4 text-slate-ink hover:text-ink">
          <X />
        </button>

        <div className="p-6 border-b border-line">
          <h3 className="gk-h3 pr-8">{hotel.name}</h3>
          <p className="text-[15px] text-gray-500">
            {hotel.destination} • Starting from ₹{Number(hotel.tariff_starting_from).toLocaleString()}
          </p>
        </div>

        {/* 4. Use onSubmit to trigger the WhatsApp redirect */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="text"
            name="name" // Added name attribute
            placeholder="Full Name"
            className="gk-field py-3!"
            required
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            className="gk-field py-3!"
            required
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <CalendarDays className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="date"
                name="checkIn"
                className="gk-field py-3! pl-10!"
                required
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <CalendarDays className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="date"
                name="checkOut"
                className="gk-field py-3! pl-10!"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <textarea
            rows="3"
            name="requirements"
            placeholder="Any special requirement?"
            className="gk-field py-3!"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="gk-btn gk-btn-wa w-full py-3!"
          >
            <Phone className="w-4 h-4" />
            Send Details to WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}