import { FaqList } from '@/components/ui/kit';

// Answers are always in the HTML (crawlable); <details> only hides them visually.
const FAQSection = ({ faqs = [] }) => {
  if (!faqs.length) return null;

  return (
    <section className="py-8">
      <h2 className="gk-h2 mb-5">Frequently Asked Questions</h2>
      <FaqList items={faqs.map((faq) => ({ question: faq.question, html: faq.answer }))} />
    </section>
  );
};

export default FAQSection;
