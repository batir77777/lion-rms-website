import type { Metadata } from "next";
import { Inter, Sora } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import StructuredData from "@/components/StructuredData";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans", display: "swap" });
const sora = Sora({
  subsets: ["latin"],
  variable: "--font-display",
  weight: ["500", "600", "700", "800"],
  display: "swap",
});

const SITE_URL = "https://www.lionrms.uk";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default:
      "Lion Risk Management Solutions | Fire Safety, Health & Safety & Digital Compliance Consultancy London",
    template: "%s | Lion Risk Management Solutions",
  },
  description:
    "London-based consultancy for fire safety, health & safety, and digital compliance. Fire risk assessments, fire strategies, fire door inspections, H&S audits, RAMS, and bespoke compliance systems for businesses, landlords, managing agents, and construction clients across the UK.",
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
      "Practical fire safety, health & safety, and bespoke digital compliance solutions for London and the UK.",
  },
  robots: { index: true, follow: true },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-GB" className={`${inter.variable} ${sora.variable}`}>
      <body className="flex min-h-screen flex-col">
        <StructuredData />
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
