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
    "Fire engineering, health & safety and fire risk assessment consultancy across London and the Home Counties. Fire strategies, fire door inspections, compartmentation, H&S consultancy and training. Led by a Fire Engineer and CMIOSH Chartered health & safety professional.",
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
    "fire door inspection",
    "compartmentation survey",
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
