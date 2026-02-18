import { Plus_Jakarta_Sans, Playfair_Display } from "next/font/google";
import "./globals.css";
import Tracker from "@/components/Tracker";
import SmartSEO from "@/components/SmartSEO";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seoSchemas";
import Script from "next/script";
import WhatsAppFloat from "@/components/WhatsAppFloat";


// Fonts
const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
  variable: "--font-sans",
  display: "swap",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-serif",
  display: "swap",
});

// Metadata
export const metadata = {
  title: {
    default: 'Gokeys Travel In Himalayas | Travel Agency Haridwar',
    template: '%s | Gokeys Travel In Himalayas',
  },
  description:
    'Gokeys Travel In Himalayas (Gokeys India), a trusted Travel Agent in Haridwar near Har Ki Pauri. Char Dham Yatra, hill station tours, car rentals – 24×7.',

  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'https://gokeys.in'
  ),

  openGraph: {
    title: 'Gokeys Travel In Himalayas | Travel Agency Haridwar',
    description: 'Explore the Amazing Tours with Group and Individual Travel in India.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://gokeys.in',
    siteName: 'Gokeys Travel In Himalayas',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'https://gokeys.in'}/images/gokeyslogo.png`,
        width: 1200,
        height: 630,
        alt: 'Gokeys India Logo',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },

  twitter: {
    card: 'summary_large_image',
    title: 'Gokeys India',
    description: 'Explore the Amazing Tours with Group and Individual Travel in India.',
    images: [
      `${process.env.NEXT_PUBLIC_SITE_URL || 'https://gokeys.in'}/images/gokeyslogo.png`,
    ],
  },

  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'https://gokeys.in',
  },
};
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gokeys.in";
// ✅ Build your static site-wide schemas
const siteSchemas = [
  buildOrganizationSchema({
    name: "Gokeys India",
    logoUrl: `${siteUrl}/images/gokeyslogo.png`,
    sameAs: [
      "https://facebook.com/gokeysindia",
      "https://instagram.com/gokeysharidwar",
      "https://twitter.com/gokeys4",
      "https://www.youtube.com/channel/UC8hjtrAeGkwRSz0YnJ9ZVvA",
      "https://www.linkedin.com/in/gokeys-india-216aa6179/",
    ],
  }),
  buildWebsiteSchema({
    name: "Gokeys India",
    searchUrlPattern: `${siteUrl}/search?q={search_term_string}`,
  }),
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${plusJakarta.variable} ${playfair.variable}`}>
      <head>
        
   
       <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-WPMX23NEML"
          strategy="afterInteractive"
        />

        <Script id="google-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());

            // GA4
            gtag('config', 'G-WPMX23NEML');

            // Google Ads 
            gtag('config', 'AW-956670461');
          `}
        </Script>

      </head>
      <body className="font-sans antialiased">
         <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="beforeInteractive"
        />
    
        <Tracker />
        {children}
        <WhatsAppFloat />
      </body>
    </html>
  );
}