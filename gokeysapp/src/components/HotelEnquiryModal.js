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
    
    // Construct the message with line breaks (%0A) and bold text (*)
    const message = 
      `*New Booking Enquiry*%0A%0A` +
      `*Hotel:* ${hotel.name}%0A` +
      `*Name:* ${formData.name}%0A` +
      `*Phone:* ${formData.phone}%0A` +
      `*Check-In:* ${formData.checkIn}%0A` +
      `*Check-Out:* ${formData.checkOut}%0A` +
      `*Special Requirements:* ${formData.requirements || "None"}`;

    const whatsappUrl = `https://wa.me/${adminPhone}?text=${message}`;
    
    // Opens WhatsApp in a new tab
    window.open(whatsappUrl, "_blank");
  };

  // Helper to update state
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-xl relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-500 hover:text-black">
          <X />
        </button>

        <div className="p-6 border-b">
          <h3 className="text-xl font-bold text-gray-900">{hotel.name}</h3>
          <p className="text-sm text-gray-500">
            {hotel.destination} • Starting from ₹{Number(hotel.tariff_starting_from).toLocaleString()}
          </p>
        </div>

        {/* 4. Use onSubmit to trigger the WhatsApp redirect */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            type="text"
            name="name" // Added name attribute
            placeholder="Full Name"
            className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            onChange={handleChange}
          />

          <input
            type="tel"
            name="phone"
            placeholder="Mobile Number"
            className="w-full border rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
            required
            onChange={handleChange}
          />

          <div className="grid grid-cols-2 gap-3">
            <div className="relative">
              <CalendarDays className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="date"
                name="checkIn"
                className="w-full border rounded-xl pl-10 pr-3 py-3 text-sm"
                required
                onChange={handleChange}
              />
            </div>

            <div className="relative">
              <CalendarDays className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
              <input
                type="date"
                name="checkOut"
                className="w-full border rounded-xl pl-10 pr-3 py-3 text-sm"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <textarea
            rows="3"
            name="requirements"
            placeholder="Any special requirement?"
            className="w-full border rounded-xl px-4 py-3 text-sm"
            onChange={handleChange}
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-3 rounded-xl font-semibold hover:bg-green-700 transition flex items-center justify-center gap-2"
          >
            <Phone className="w-4 h-4" />
            Send Details to WhatsApp
          </button>
        </form>
      </div>
    </div>
  );
}