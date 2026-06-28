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
    "Plataforma de apoyo a damnificados por el terremoto en Venezuela. Busca personas, centros de ayuda, donaciones y organizaciones.",
  manifest: "/manifest.webmanifest",
  icons: {
    icon: [
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192x192.png",  sizes: "192x192", type: "image/png" },
      { url: "/app-icon.svg",      type: "image/svg+xml" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    title: "Solidario Venezuela",
    description:
      "Plataforma de apoyo a damnificados por el terremoto en Venezuela. Busca personas, centros de ayuda, donaciones y organizaciones.",
    url: "https://solidario-venezuela.vercel.app",
    siteName: "Solidario Venezuela",
    images: [{ url: "/icon-512x512.png", width: 512, height: 512 }],
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
