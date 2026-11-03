import Header from "@/components/Header";
import Footer from "@/components/Footer";

// Checkout pages: never indexed or cached, not in the sitemap, Disallowed in robots.txt; Razorpay is allowed in the
// Content-Security-Policy only on /book (next.config.mjs).
export const metadata = {
  title: "Book your seats",
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
};

export default function BookLayout({ children }) {
  return (
    <>
      <Header />
      <main className="bg-mist">
        <div className="gk-wrap py-8">{children}</div>
      </main>
      <Footer />
    </>
  );
}
