import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Tracker from "@/components/Tracker";
import SmartSEO from "@/components/SmartSEO";
import { buildOrganizationSchema, buildWebsiteSchema } from "@/lib/seoSchemas";
import Script from "next/script";


// Fonts
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

// Metadata
export const metadata = {
  title: {
    default: 'Gokeys India',
    template: '%s | Gokeys India',
  },
  description:
    'Explore the Amazing Tours with Group and Individual Travel in India. Gokeys India Haridwar offers various Tour Package, Char Dham Yatra, Taxi Services, North India Tour, Kedarnath Dham Helicopter and more.',

  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000'
  ),

  openGraph: {
    title: 'Gokeys India',
    description: 'Explore the Amazing Tours with Group and Individual Travel in India.',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000',
    siteName: 'Gokeys India',
    images: [
      {
        url: `${process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000'}/images/gokeyslogo.png`,
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
      `${process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000'}/images/gokeyslogo.png`,
    ],
  },

  alternates: {
    canonical: process.env.NEXT_PUBLIC_SITE_URL || 'localhost:3000',
  },
};

// ✅ Build your static site-wide schemas
const siteSchemas = [
  buildOrganizationSchema({
    name: "Gokeys India",
    logoUrl: "/images/gokeyslogo.png",
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
    searchUrlPattern: "/search?q={search_term_string}",
  }),
];

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`}>
      <head>
        <SmartSEO schema={siteSchemas} />
      </head>
      <body className="font-sans antialiased">
         <Script
          src={`https://www.google.com/recaptcha/api.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`}
          strategy="beforeInteractive"
        />
        <Tracker />
        {children}
      </body>
    </html>
  );
}