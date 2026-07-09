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
    default: "Fire Risk Assessment London | H&S Consultancy — Lion RMS",
    template: "%s | Lion Risk Management Solutions",
  },
  description:
    "Expert fire risk assessments, fire strategies, and health & safety consultancy across London. CMIOSH-led chartered expertise. Book a consultation.",
  keywords: [
    "fire risk assessment London",
    "fire safety consultant",
    "health and safety consultant",
    "fire strategy",
    "fire door inspection",
    "RAMS",
    "compliance management",
  ],
  authors: [{ name: "Lion Risk Management Solutions" }],
  alternates: { canonical: SITE_URL },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Lion Risk Management Solutions",
    title: "Fire Safety & Health and Safety Consultancy | Lion RMS",
    description:
      "Practical fire safety and health & safety consultancy across London. CMIOSH-led expertise.",
    images: [
      {
        url: "/images/hero-banner.jpg",
        width: 1536,
        height: 1024,
        alt: "Lion Risk Management Solutions — Fire Safety and Health & Safety Consultancy in London.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Fire Risk Assessment London | H&S Consultancy — Lion RMS",
    description: "Expert fire safety & health & safety consultancy in London. From £250 + VAT.",
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
