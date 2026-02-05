"use client";

import { useState, useEffect } from "react";
import TransitionLink from "@/components/TransitionLink";
import MobileMenu from "@/components/MobileMenu";
import { getSiteContent, getContent, SiteContentMap } from "@/lib/content";

export default function Home() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [content, setContent] = useState<SiteContentMap>({});

  useEffect(() => {
    getSiteContent().then(setContent);
  }, []);

  // Helper with fallbacks
  const c = (key: string, fallback: string) => getContent(content, key, fallback);

  return (
    <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

      <div className="w-full max-w-[1600px] bg-transparent grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 h-[calc(100vh-4rem)] min-h-[600px]">

        {/* LEFT COLUMN: Content & Typography */}
        <div className="relative flex flex-col justify-between p-6 md:p-12 rounded-[2rem] bg-[#F8F5EE]">
          {/* Header / Nav */}
          <header className="flex justify-between items-center w-full">
            <TransitionLink href="/" className="text-xl font-bold tracking-tight">
              {c('global_brand_name', 'KEKO.')}
            </TransitionLink>
            <nav className="hidden md:flex gap-6 text-sm font-medium uppercase tracking-wider opacity-70">
              <TransitionLink href="/about" className="hover:opacity-100">About</TransitionLink>
              <TransitionLink href="/menu" className="hover:opacity-100">Menu</TransitionLink>
              <TransitionLink href="/reservations" className="hover:opacity-100">Bookings</TransitionLink>
            </nav>
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(true)}
                className="space-y-1.5 cursor-pointer p-2"
              >
                <div className="w-6 h-0.5 bg-black"></div>
                <div className="w-6 h-0.5 bg-black"></div>
              </button>
            </div>
          </header>

          {/* Main Content */}
          <div className="mt-12 mb-auto space-y-8">
            {/* Badge */}
            <div className="inline-block bg-[#EEDD4A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black mb-4">
              {c('home_badge', 'New Opening 2026')}
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.9] tracking-tight">
              {c('home_title', 'Critically acclaimed cuisine.').split(' ').map((word, i, arr) => (
                <span key={i}>
                  {i === 1 ? <span className="italic">{word}</span> : word}
                  {i < arr.length - 1 && (i === 0 || i === 1 ? <br /> : ' ')}
                </span>
              ))}
            </h1>

            <p className="max-w-md text-lg text-neutral-600 leading-relaxed">
              {c('home_subtitle', "Don't just take our word for it. Experience the flavors that have everyone talking. A meeting place for food lovers, friends, and everyone in between.")}
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <TransitionLink href="/reservations" className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-all text-center">
                {c('home_cta_1', 'Reserve Table')}
              </TransitionLink>
              <TransitionLink href="/menu" className="px-8 py-4 border border-black rounded-full font-medium hover:bg-black/5 transition-all text-center">
                {c('home_cta_2', 'View Menu')}
              </TransitionLink>
            </div>
          </div>

          {/* Footer / Bottom Text */}
          <div className="mt-8 text-xs text-neutral-400 uppercase tracking-widest">
            {c('home_footer', 'Based in Madrid — Est. 2026')}
          </div>
        </div>

        {/* RIGHT COLUMN: Visuals */}
        <div className="relative rounded-[2rem] overflow-hidden bg-neutral-200">
          <div className="absolute inset-0 bg-neutral-300">
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"></div>
          </div>

          {/* Overlay Content */}
          <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-xs text-white hidden md:block">
            <p className="text-sm font-medium">&quot;{c('home_quote', 'The best dining experience in the city.')}&quot;</p>
            <div className="mt-2 text-xs opacity-70">&mdash; {c('home_quote_author', 'The Food Guide')}</div>
          </div>
        </div>

      </div>
    </main>
  );
}
