"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useRouter } from "next/navigation";

const placeholderOptions = [
  "Search destinations or tours...",
  "Try 'Manali Group Tour'",
  "Explore adventure trips",
  "Find religious packages",
  "Search trekking experiences",
];

export default function AnimatedSearchInput({ searchQuery, setSearchQuery }) {
  const [placeholderIndex, setPlaceholderIndex] = useState(0);
  const [isFocused, setIsFocused] = useState(false);
  const [localQuery, setLocalQuery] = useState(searchQuery || "");
  const router = useRouter();

  useEffect(() => {
    if (searchQuery !== undefined) setLocalQuery(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    if (localQuery || isFocused) return; // pause cycling
    const interval = setInterval(() => {
      setPlaceholderIndex((prev) => (prev + 1) % placeholderOptions.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [localQuery, isFocused]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const query = localQuery.trim();
    if (query) {
      router.push(`/search?q=${encodeURIComponent(query)}&page=1`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="relative w-full max-w-md bg-white rounded-full shadow-lg">
      <input
        type="text"
        aria-label="Search destinations or tours"
        value={localQuery}
        onChange={(e) => {
          setLocalQuery(e.target.value);
          if (setSearchQuery) setSearchQuery(e.target.value);
        }}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder="."
        className="w-full py-3 pl-10 pr-4 rounded-full text-black placeholder-transparent focus:outline-none"
      />

      <svg
        className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-600"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
        />
      </svg>

      {localQuery === "" && !isFocused && (
        <div className="pointer-events-none absolute inset-y-0 left-10 flex items-center overflow-hidden">
          <AnimatePresence mode="wait">
            <motion.span
              key={placeholderIndex}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.4 }}
              className="text-gray-500 font-medium whitespace-nowrap truncate"
            >
              {placeholderOptions[placeholderIndex]}
            </motion.span>
          </AnimatePresence>
        </div>
      )}
    </form>
  );
}
