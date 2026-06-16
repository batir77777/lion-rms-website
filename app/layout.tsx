import type { Metadata } from "next";
import { Inter, Space_Grotesk } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";
import FloatingContact from "@/components/FloatingContact";
import ScrollProgress from "@/components/ScrollProgress";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
// Sharp grotesque display face for headlines — precise, engineered.
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
    default: "Fire Risk Assessment London | Digital Compliance & H&S — Lion RMS",
    template: "%s | Lion Risk Management Solutions",
  },
  description:
    "Expert fire risk assessments and health & safety consultancy in London, managed via a live digital compliance platform. CMIOSH-led chartered expertise. Book a free demo.",
  keywords: [
    "fire risk assessment London",
    "fire safety consultant",
    "health and safety consultant",
    "fire strategy",
    "fire door inspection",
    "RAMS",
    "digital compliance",
  ],
  authors: [{ name: "Lion Risk Management Solutions" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Lion Risk Management Solutions",
    title: "Fire Safety, Health & Safety & Digital Compliance Consultancy | Lion RMS",
    description:
      "Practical fire safety, health & safety, and bespoke digital compliance solutions across London.",
    images: [
      {
        url: "/images/hero-banner.jpg",
        width: 1536,
        height: 1024,
        alt: "Lion Risk Management Solutions — Fire Safety, Health & Safety & Digital Compliance. Fire Risk Assessment from £250 + VAT plus 3 months free platform access.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fire Risk Assessment London | Digital Compliance & H&S — Lion RMS",
    description: "Expert fire safety & H&S consultancy with a live compliance platform. From £250 + VAT.",
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
      <body className="flex min-h-screen flex-col">
        <StructuredData />
        <ScrollProgress />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingContact />
      </body>
    </html>
  );
}
