'use client';

import { useState } from 'react';
import { MinusIcon, PlusIcon } from 'lucide-react';

const FAQSection = ({ faqs = [] }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const toggleFAQ = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  if (!faqs.length) return null;

  return (
    <section className="py-12 max-w-6xl mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8">Frequently Asked Questions</h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <div key={index} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full flex justify-between items-center p-4 text-left font-medium hover:bg-gray-50 transition-all"
              onClick={() => toggleFAQ(index)}
            >
              <span>{faq.question}</span>
              {expandedIndex === index ? <MinusIcon /> : <PlusIcon />}
            </button>
            {expandedIndex === index && (
              <div
                className="p-4 pt-2 text-gray-700"
                dangerouslySetInnerHTML={{ __html: faq.answer }}
              />
            )}
          </div>
        ))}
      </div>
    </section>
  );
};

export default FAQSection;
