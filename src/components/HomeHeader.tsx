"use client";

import { useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import MobileMenu from "@/components/MobileMenu";
import { getContent, isContentHidden, SiteContentMap } from "@/lib/content";

interface HomeHeaderProps {
  content: SiteContentMap;
}

export default function HomeHeader({ content }: HomeHeaderProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Helper with fallbacks
  const c = (key: string, fallback: string) => getContent(content, key, fallback);
  const hidden = (key: string) => isContentHidden(content, key);

  return (
    <>
      <MobileMenu
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      <header className="flex justify-between items-center w-full">
        <TransitionLink href="/" className="text-xl font-bold tracking-tight">
          {c("global_brand_name", "KEKO.")}
        </TransitionLink>
        <div className="hidden md:flex items-center gap-8">
          <nav className="flex gap-6 text-sm font-medium uppercase tracking-wider opacity-70">
            {!hidden('nav_about_text') && (
              <TransitionLink href="/about" className="hover:opacity-100">
                {c('nav_about_text', 'Nosotros')}
              </TransitionLink>
            )}
            {!hidden('nav_menu_text') && (
              <TransitionLink href="/menu" className="hover:opacity-100">
                {c('nav_menu_text', 'Carta')}
              </TransitionLink>
            )}
            {!hidden('nav_bookings_text') && (
              <TransitionLink href="/reservations" className="hover:opacity-100">
                {c('nav_bookings_text', 'Reservas')}
              </TransitionLink>
            )}
          </nav>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setIsMobileMenuOpen(true)}
            className="space-y-1.5 cursor-pointer p-2"
          >
            <div className="w-6 h-0.5 bg-foreground"></div>
            <div className="w-6 h-0.5 bg-foreground"></div>
          </button>
        </div>
      </header>
    </>
  );
}
