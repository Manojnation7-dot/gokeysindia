import Link from "next/link";

const ArrowButton = ({ href }) => (
  <Link
    href={href}
    className="
      absolute right-5 bottom-5
      w-10 h-10 rounded-full
      bg-white/10
      border-2 border-white
      flex justify-center items-center
      transition-all duration-300 ease-in-out
      scale-[0.8] rotate-[-33.5deg]
      opacity-90 z-30
      group-hover:scale-100
      
    "
  >
    <svg
      className="h-5 w-5 text-white"
      fill="none"
      viewBox="0 0 24 24"
    >
      <path
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2"
        d="M9 5l7 7m0 0l-7 7m7-7H3"
      />
    </svg>
  </Link>
);

export default ArrowButton;
