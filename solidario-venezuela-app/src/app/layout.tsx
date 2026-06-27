import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { ConsentBanner } from "@/components/ConsentBanner";
import { PwaRegistration } from "@/components/PwaRegistration";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://solidario-venezuela.vercel.app"),
  title: "Solidario Venezuela",
  description:
    "Plataforma social para organizar iniciativas, aliados y apoyo solidario en Venezuela.",
  manifest: "/manifest.webmanifest",
  openGraph: {
    title: "Solidario Venezuela",
    description:
      "Plataforma social para organizar iniciativas, aliados y apoyo solidario en Venezuela.",
    url: "https://solidario-venezuela.vercel.app",
    siteName: "Solidario Venezuela",
    locale: "es_VE",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${geistSans.variable} ${geistMono.variable}`}>
      <body className="antialiased">
        <PwaRegistration />
        <SiteHeader />
        {children}
        <SiteFooter />
        <ConsentBanner />
      </body>
    </html>
  );
}
