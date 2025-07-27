'use client';

import React from 'react';

export const Button = ({ children, className = '', onClick, type = 'button', ...props }) => {
  return (
    <button
      type={type}
      onClick={onClick}
      className={`inline-flex items-center justify-center rounded-2xl px-6 py-2 text-sm font-semibold shadow-md transition-colors bg-blue-600 text-white hover:bg-blue-700 ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};
