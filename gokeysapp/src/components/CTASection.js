import Link from "next/link";

export default function CTASection() {
  return (
    <section className="py-16 px-6 bg-gradient-to-r from-blue-600 to-indigo-600 text-center text-white">
      <h2 className="text-3xl font-bold mb-4">
        Ready to Start Your Journey?
      </h2>
      <p className="mb-6 text-lg">
        Contact us for custom tour packages and group bookings
      </p>
      <Link href="/contact">
        <button className="bg-yellow-400 text-black px-8 py-3 rounded-full hover:bg-yellow-500 font-semibold">
          Get in Touch
        </button>
      </Link>
    </section>
  );
}
