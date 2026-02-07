import Link from "next/link";

export default function CTASection() {
  return (
    <section className="relative py-24 px-6 overflow-hidden bg-gradient-to-br from-brand-600 via-brand-600 to-brand-700 text-white">
      
      {/* Decorative Blur Orbs */}
      <div className="absolute -top-24 -left-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>
      <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-white/10 rounded-full blur-3xl"></div>

      <div className="relative max-w-5xl mx-auto text-center">
        
        {/* Heading */}
        <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-6">
          Ready to Plan Your <span className="text-yellow-300">Next Journey?</span>
        </h2>

        {/* Subtext */}
        <p className="text-lg md:text-xl text-white/90 max-w-2xl mx-auto mb-10 leading-relaxed">
          From spiritual yatras to family holidays and group tours,
          our travel experts are here to craft the perfect itinerary for you.
        </p>

        {/* CTA Button */}
        <Link href="/contact">
          <button className="
            inline-flex items-center justify-center
            bg-white text-brand-700
            px-10 py-4 rounded-2xl
            font-semibold text-lg
            hover:bg-brand-50
            transition-all duration-300
            shadow-2xl hover:shadow-white/20
          ">
            Get in Touch
          </button>
        </Link>

      </div>
    </section>
  );
}
