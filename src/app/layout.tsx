import type { Metadata } from "next";
import { Inter, Geist_Mono } from "next/font/google";
import TransitionProvider from "@/context/TransitionProvider";
import ParallaxContent from "@/components/ParallaxContent";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-ghost-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Keko - Critically Acclaimed Cuisine",
  description: "A meeting place for food lovers in Madrid.",
};

import { getSiteContent } from "@/lib/content";
import ThemeInjector from "@/components/ThemeInjector";

// ... existing imports

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const content = await getSiteContent();

  return (
    <html lang="es">
      <ThemeInjector content={content} />
      <body
        className={`${inter.variable} ${geistMono.variable} antialiased font-sans`}
      >
        <TransitionProvider>
          <ParallaxContent>
            {children}
          </ParallaxContent>
        </TransitionProvider>
      </body>
    </html>
  );
}
