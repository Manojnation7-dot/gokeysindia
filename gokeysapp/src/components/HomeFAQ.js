"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

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
  const [openIndex, setOpenIndex] = useState(null);

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight text-gray-900">
            Frequently Asked <span className="text-brand-600">Questions</span>
          </h2>
          <p className="mt-4 text-gray-500 max-w-2xl mx-auto">
            Common questions about Char Dham Yatra, taxi services, and tour packages in Haridwar.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-xl overflow-hidden"
            >
              <button
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left font-semibold text-gray-900 hover:bg-gray-50"
              >
                {faq.question}
                <ChevronDown
                  className={`h-5 w-5 shrink-0 transition-transform ${
                    openIndex === i ? "rotate-180" : ""
                  }`}
                />
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-gray-600 leading-relaxed">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export { faqs };