import { FaqList } from "@/components/ui/kit";

const faqs = [
  {
    question: "Which is the best travel agency in Haridwar for Char Dham Yatra?",
    answer:
      "Gokeys India is a government-registered travel agency in Haridwar, authorized by Uttarakhand Tourism, specializing in Char Dham Yatra tour packages. We handle taxi arrangements, hotel bookings, and complete itineraries for Yamunotri, Gangotri, Kedarnath, and Badrinath.",
  },
  {
    question: "Does Gokeys India provide taxi service in Haridwar for Char Dham Yatra?",
    answer:
      "Yes, we offer dedicated taxi and cab booking services in Haridwar for Char Dham Yatra, Do Dham Yatra, and hill station tours across Uttarakhand, with experienced local drivers familiar with mountain routes.",
  },
  {
    question: "Can I book a customized Uttarakhand tour package with Gokeys?",
    answer:
      "Absolutely. We design customized Uttarakhand tour packages for Mussoorie, Nainital, Auli, Chopta, Dhanaulti, Chakrata, and Harsil Valley based on your group size, budget, and duration.",
  },
  {
    question: "What is the best time to do the Char Dham Yatra from Haridwar?",
    answer:
      "The Char Dham Yatra season typically runs from late April/early May to early November, with June and September offering pleasant weather and lighter crowds. Gokeys India can advise on exact opening dates for the current year.",
  },
  {
    question: "Does Gokeys India offer group tour packages?",
    answer:
      "Yes, we organize group tours for families, corporate teams, and pilgrimage groups, including bus and taxi transport, group hotel bookings, and customized group itineraries across Uttarakhand.",
  },
  {
    question: "How do I book a hotel in Uttarakhand through Gokeys India?",
    answer:
      "You can book hotels in Haridwar, Rishikesh, Mussoorie, Badrinath, and other Uttarakhand destinations directly through Gokeys India — we offer 24x7 support for reservations, changes, and on-ground assistance.",
  },
];

export default function HomeFAQ() {
  return (
    <section className="gk-section pt-0!">
      <div className="gk-wrap grid lg:grid-cols-[1fr_1.5fr] gap-8 lg:gap-12">
        <div>
          <p className="gk-eyebrow mb-2">FAQ</p>
          <h2 className="gk-h2">Frequently Asked Questions</h2>
          <p className="mt-3 gk-lead">
            Common questions about Char Dham Yatra, taxi services, and tour packages in Haridwar.
          </p>
        </div>
        <FaqList items={faqs} />
      </div>
    </section>
  );
}

export { faqs };