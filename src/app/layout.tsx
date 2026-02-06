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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
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
