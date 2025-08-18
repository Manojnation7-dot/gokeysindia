"use client";

import React from "react";

export default function GoogleMap() {
  return (
    <div className="max-w-7xl h-[450px] rounded-lg overflow-hidden shadow-md mx-auto">
      <iframe
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.226223974165!2d78.1511266!3d29.944170900000003!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390947f7e97f2c95%3A0xf0785b5ce98c08e9!2sGokeys%20(Travel%20In%20Himalayas)%20%7C%20Travel%20Agency%20Haridwar!5e0!3m2!1sen!2sin!4v1755523564142!5m2!1sen!2sin"
        width="100%"
        height="100%"
        style={{ border: 0 }}
        allowFullScreen=""
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      ></iframe>
    </div>
  );
}
