import { ShieldCheck, Clock3, BadgeIndianRupee, Headphones } from "lucide-react";

const items = [
  {
    title: "Registered Travel Agent in Haridwar",
    desc: "Authorized & recognized by Uttarakhand Tourism",
    Icon: ShieldCheck,
  },
  {
    title: "10+ Years of Expertise",
    desc: "Successfully delivered 1000+ spiritual & leisure journeys",
    Icon: Clock3,
  },
  {
    title: "Transparent Pricing",
    desc: "No hidden charges on any Char Dham Yatra or tour package — ever",
    Icon: BadgeIndianRupee,
  },
  {
    title: "24x7 Support",
    desc: "For reservations, changes and on-ground assistance",
    Icon: Headphones,
  },
];

// Thin trust bar under the home hero
export function TrustStrip() {
  return (
    <section className="bg-white border-b border-line">
      <div className="gk-wrap py-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map(({ title, desc, Icon }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon size={22} className="text-teal shrink-0 mt-0.5" />
            <div>
              <p className="text-[15px] font-bold text-ink leading-snug">{title}</p>
              <p className="text-xs text-slate-ink">{desc}</p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default function WhyChooseUs() {
  return (
    <section className="gk-section bg-white">
      <div className="gk-wrap grid lg:grid-cols-[1fr_1.6fr] gap-8 lg:gap-14">
        <div>
          <p className="gk-eyebrow mb-2">About Gokeys</p>
          <h2 className="gk-h2">
            Why Gokeys is a Trusted Travel Agent in Haridwar
          </h2>
          <p className="mt-4 gk-lead">
            Trusted by thousands of travelers as a leading <a href="https://gokeys.in/services/travel-agency-haridwar" className="text-brand-600 font-semibold hover:underline">travel agency in Haridwar</a>
            for spiritual journeys, Himalayan adventures, and thoughtfully curated
            Uttarakhand tour packages.
          </p>
        </div>

        <div className="space-y-5 text-slate-ink leading-relaxed [&_a]:text-brand-600 [&_a]:font-semibold [&_a:hover]:underline">
          <p>
            Welcome to <strong>Gokeys India</strong>, a government-registered{" "}
            <strong>travel agent in Haridwar</strong> specializing in spiritual
            journeys like <a href="https://gokeys.in/blog/char-dham-yatra-2027">Char Dham Yatra</a>{" "}
            and curated tours across Uttarakhand — from Mussoorie and Chopta to
            Rishikesh, Nainital, and Harsil. With over a decade of expertise and
            official authorization from <strong>Uttarakhand Tourism</strong>, we
            design seamless <strong>Char Dham Yatra tour packages</strong>, group
            tours, and customized travel programs for families, groups, and solo
            travelers.
          </p>

          <p>
            From the snow-capped slopes of{" "}
            <a href="/destinations/auli" className="text-brand-600 font-semibold hover:underline">Auli</a>{" "}
            to the Himalayan meadows of{" "}
            <a href="/destinations/chopta" className="text-brand-600 font-semibold hover:underline">Chopta</a>,
            and onward to the breathtaking{" "}
            <strong>Valley of Flowers</strong> and <strong>Hemkund Sahib</strong> —
            every journey is crafted with local expertise. Explore our Uttarakhand
            tour packages to{" "}
            <a href="/destinations/kedarnath" className="text-brand-600 font-semibold hover:underline">Kedarnath</a>,{" "}
            <a href="/destinations/yamunotri" className="text-brand-600 font-semibold hover:underline">Yamunotri</a>,{" "}
            <a href="/destinations/dhanaulti" className="text-brand-600 font-semibold hover:underline">Dhanaulti</a>,{" "}
            <a href="/destinations/chakrata" className="text-brand-600 font-semibold hover:underline">Chakrata</a>, and{" "}
            <a href="/destinations/harsil" className="text-brand-600 font-semibold hover:underline">Harsil Valley</a>,
            or try adventure experiences like river rafting and camping in Rishikesh.
            Gokeys India is recognized among the{" "}
            <a href="https://gokeys.in/blog/travel-agents-in-haridwar-char-dham-taxi-uttarakhand-tour-services">top travel agents in Haridwar</a>{" "}
            for Char Dham Yatra and hill station tours.
          </p>

          <p>
            As a full-service <strong>tour operator in Haridwar</strong>, our
            dedicated team ensures smooth <strong>taxi and cab booking</strong>,
            hotel reservations, and guided tours with complete pricing
            transparency. Popular short trips like our{" "}
            <a href="/tours/haridwar-rishikesh-neelkanth-tour-for-2-days" className="text-brand-600 font-semibold hover:underline">
              Haridwar Rishikesh Neelkanth 2-Day Tour
            </a>{" "}
            and{" "}
            <a href="/tours/badrinath-mussoorie-6-days-trip" className="text-brand-600 font-semibold hover:underline">
              Badrinath Mussoorie 6-Day Trip
            </a>{" "}
            are ready to book, or explore our{" "}
            <a
              href="/tours"
              className="text-brand-600 font-semibold hover:underline"
            >
              best-selling tours
            </a>{" "}
            or{" "}
            <a
              href="/contact"
              className="text-brand-600 font-semibold hover:underline"
            >
              connect with our travel experts
            </a>{" "}
            to plan your next journey with confidence.
          </p>
        </div>
      </div>
    </section>
  );
}
