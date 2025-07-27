 
/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Scans all files in src for Tailwind classes
    ],
    theme: {
      extend: {
        fontFamily: {
        sans: ['var(--font-geist-sans)', 'sans-serif'],
        mono: ['var(--font-geist-mono)', 'monospace'],
      },
      },
    },
    plugins: [
      require('@tailwindcss/typography'), // Enable typography plugin
    ],
  };