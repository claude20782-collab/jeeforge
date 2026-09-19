import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/app/providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "JEEForge — Free JEE Main Mock Test Series 2026",
    template: "%s | JEEForge",
  },
  description:
    "40 full-length JEE Main mock tests (Sep–Dec 2026) with a realistic CBT interface, complete verified solutions for every question, detailed performance analytics, leaderboards and a student community. Free forever.",
  keywords: ["JEE Main", "mock test", "free test series", "CBT", "JEE 2027", "online test series", "JEE Main previous year questions"],
  applicationName: "JEEForge",
  openGraph: {
    title: "JEEForge — Free JEE Main Mock Test Series 2026",
    description: "40 full-length JEE Main mocks · realistic CBT · complete solutions · analytics · leaderboards · community",
    siteName: "JEEForge",
    type: "website",
  },
  robots: { index: true, follow: true },
  manifest: "/manifest.json",
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/icon.svg" }],
  },
};

export const viewport: Viewport = {
  themeColor: "#171310",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased bg-background text-foreground`}>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
