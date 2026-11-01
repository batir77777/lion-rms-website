import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import FloatingContact from "@/components/FloatingContact";
import ScrollProgress from "@/components/ScrollProgress";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700"],
  display: "swap",
});

const SITE_URL = "https://www.lionrms.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Fire Engineering & Fire Risk Assessment London — Lion RMS",
    template: "%s | Lion Risk Management Solutions",
  },
  description:
    "Health & safety, construction safety and fire safety consultancy across London and the Home Counties. Site inspections, independent audits, CDM 2015 advisory support, fire risk assessments, fire strategies and training. Led by a CMIOSH Chartered health & safety professional and Fire Engineer (MIFireE).",
  keywords: [
    "fire risk assessment London",
    "fire engineer London",
    "fire engineering consultancy",
    "fire engineering services",
    "fire safety engineering",
    "building fire safety",
    "fire safety consultancy",
    "health and safety consultant",
    "fire strategy",
    "RAMS",
    "compliance management",
  ],
  authors: [{ name: "Lion Risk Management Solutions" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Lion Risk Management Solutions",
    title: "Fire Engineering, Health & Safety and Fire Risk Assessment | Lion RMS",
    description:
      "Fire engineering, health & safety and fire risk assessment consultancy across London and the Home Counties.",
    images: [
      {
        url: "/images/hero-banner.jpg",
        width: 1536,
        height: 1024,
        alt: "Lion Risk Management Solutions — Fire Engineering, Health & Safety and Fire Risk Assessment Consultancy in London.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fire Engineering & Fire Risk Assessment London — Lion RMS",
    description: "Fire engineering, health & safety and fire risk assessment consultancy in London. Book a consultation.",
    images: ["/images/hero-banner.jpg"],
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${spaceGrotesk.variable}`}>
      {/*
       * The bottom padding reserves the height of the mobile contact bar
       * (components/FloatingContact), so the document ENDS above it rather
       * than behind it: without this the last ~70px of every page — footer
       * lines, badges, the final CTA — sat permanently underneath, which is
       * what the old floating circles did to the bottom-right corner. It is
       * constant on phones, including while the bar hides itself for a
       * focused field or a scroll, because reflowing the page under the
       * visitor's thumb mid-form would be worse than a strip of empty space.
       * `md:pb-0` must stay in step with the bar's own `md:hidden`.
       */}
      <body className="flex min-h-screen flex-col pb-[calc(4.25rem+env(safe-area-inset-bottom,0px))] md:pb-0">
        {/*
         * Skip link. First focusable element in the DOM, visually hidden until
         * focused, so a keyboard user does not have to tab through the whole
         * header on every page. `#main-content` is the target below; the two
         * must stay in step.
         */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-navy-900 focus:px-5 focus:py-3 focus:text-sm focus:font-semibold focus:text-white focus:shadow-lg focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-offset-2"
        >
          Skip to main content
        </a>
        <StructuredData />
        <ScrollProgress />
        <Header />
        <main id="main-content" tabIndex={-1} className="flex-1">
          {children}
        </main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
