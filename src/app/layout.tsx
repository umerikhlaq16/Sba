import type { Metadata } from "next";
import { Geist_Mono, Barlow } from "next/font/google";
import "./globals.css";

// DIN Next/FF DIN are commercial fonts the client uses in their brand
// guidelines. Barlow is a free, widely-used stand-in with the same
// geometric-grotesque proportions, until real DIN files are provided.
const barlow = Barlow({
  variable: "--font-barlow",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  // Set NEXT_PUBLIC_SITE_URL to the live domain so social share previews use absolute image URLs.
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "SB Alliance | Toothbrush Manufacturer, Lahore, Pakistan",
    template: "%s | SB Alliance",
  },
  description:
    "SB Alliance is a leading manufacturer of toothbrush products in Pakistan, supplying locally and to export clients across the MENA region under the Dr. Choice brand.",
  keywords: [
    "SB Alliance",
    "Dr. Choice",
    "toothbrush manufacturer Pakistan",
    "toothbrush export Pakistan",
    "private label toothbrush manufacturer",
    "oral care manufacturer Lahore",
  ],
  openGraph: {
    title: "SB Alliance | Toothbrush Manufacturer, Lahore, Pakistan",
    description:
      "Leading manufacturer of toothbrush products in Pakistan, supplying locally and to export clients across the MENA region under the Dr. Choice brand.",
    siteName: "SB Alliance",
    images: ["/logo.png"],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SB Alliance | Toothbrush Manufacturer, Lahore, Pakistan",
    description:
      "Leading manufacturer of toothbrush products in Pakistan, supplying locally and to export clients across the MENA region under the Dr. Choice brand.",
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${barlow.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-white">{children}</body>
    </html>
  );
}
