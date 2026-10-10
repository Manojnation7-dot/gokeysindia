import Link from "next/link";
import { CtaBand } from "@/components/ui/kit";

export default function CTASection() {
  return (
    <section className="gk-wrap pb-16">
      <CtaBand
        title="Ready to Plan Your Next Journey?"
        text="From spiritual yatras to family holidays and group tours, our travel experts are here to craft the perfect itinerary for you."
      >
        <Link href="/contact" className="gk-btn gk-btn-ink">Get in Touch</Link>
      </CtaBand>
    </section>
  );
}
