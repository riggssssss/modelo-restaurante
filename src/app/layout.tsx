import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import ArrowNavigation from "@/components/ArrowNavigation";
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
  title: "Keko - Critically Acclaimed Cuisine",
  description: "A meeting place for food lovers in Madrid.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ArrowNavigation />
        {children}
      </body>
    </html>
  );
}
