"use client";

import { useState, useEffect } from "react";
import TransitionLink from "@/components/TransitionLink";
import MobileMenu from "@/components/MobileMenu";
import { getSiteContent, getContent, SiteContentMap } from "@/lib/content";

export default function AboutPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [content, setContent] = useState<SiteContentMap>({});

    useEffect(() => {
        getSiteContent().then(setContent);
    }, []);

    const c = (key: string, fallback: string) => getContent(content, key, fallback);

    return (
        <main className="min-h-screen bg-[#F8F5EE] p-4 md:p-8 font-sans">
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[calc(100vh-4rem)]">
                {/* Left: Text */}
                <div className="flex flex-col justify-between p-8 md:p-12 order-2 md:order-1">

                    {/* Header / Nav */}
                    <header className="flex justify-between items-center w-full mb-8">
                        <TransitionLink href="/" className="text-xl font-bold tracking-tight">
                            {c('global_brand_name', 'KEKO.')}
                        </TransitionLink>
                        <nav className="hidden md:flex gap-6 text-sm font-medium uppercase tracking-wider opacity-70">
                            <TransitionLink href={c('nav_about_link', '/about')} className="hover:opacity-100 opacity-100 underline decoration-2 underline-offset-4">{c('nav_about_text', 'About')}</TransitionLink>
                            <TransitionLink href={c('nav_menu_link', '/menu')} className="hover:opacity-100">{c('nav_menu_text', 'Menu')}</TransitionLink>
                            <TransitionLink href={c('nav_bookings_link', '/reservations')} className="hover:opacity-100">{c('nav_bookings_text', 'Bookings')}</TransitionLink>
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
                    <div className="flex-grow flex flex-col justify-center">
                        <div className="inline-block w-fit bg-[#EEDD4A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black mb-4">
                            {c('about_badge', 'Our Story')}
                        </div>
                        <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-10">
                            {c('about_title', 'Born from a love of tradition & innovation.').split('tradition').map((part, i) => (
                                <span key={i}>
                                    {part}
                                    {i === 0 && <span className="italic">tradition</span>}
                                </span>
                            ))}
                        </h1>
                        <div className="space-y-6 text-lg text-neutral-600 leading-relaxed max-w-lg">
                            <p>
                                {c('about_p1', 'Keko started as a dream in a small kitchen in Madrid. We wanted to create a space that felt like home, yet surprised you with every bite.')}
                            </p>
                            <p>
                                {c('about_p2', 'Our philosophy is simple: source the best ingredients, treat them with respect, and serve them with warmth. We believe that dining is not just about sustenance, but about connection.')}
                            </p>
                            <p>
                                {c('about_p3', 'Whether you are here for a quick lunch or a celebratory dinner, we promise an experience that lingers in your memory long after the last bite.')}
                            </p>
                        </div>

                        <div className="mt-12">
                            <img
                                src={c('about_chef_signature', 'https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2800&auto=format&fit=crop')}
                                alt="Signature"
                                className="h-16 opacity-60"
                            />
                            <p className="text-sm font-bold uppercase tracking-widest mt-4">
                                {c('about_chef_name', 'Chef Adrian Garcia')}
                            </p>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-xs text-neutral-400 uppercase tracking-widest">
                        {c('about_footer', 'Based in Madrid — Est. 2026')}
                    </div>
                </div>

                {/* Right: Visuals */}
                <div className="flex flex-col gap-6 order-1 md:order-2 h-full">
                    <div className="relative flex-grow min-h-[40vh] rounded-[2rem] overflow-hidden">
                        <div className="absolute inset-0 bg-neutral-300">
                            <div
                                className="w-full h-full bg-cover bg-center"
                                style={{ backgroundImage: `url('${c('about_image_main', 'https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070&auto=format&fit=crop')}')` }}
                            ></div>
                        </div>
                    </div>

                    <div className="relative h-64 md:h-80 rounded-[2rem] overflow-hidden group">
                        <div className="absolute inset-0 bg-neutral-800">
                            <div
                                className="w-full h-full bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity duration-700"
                                style={{ backgroundImage: `url('${c('about_image_secondary', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')}')` }}
                            ></div>
                        </div>
                        <div className="absolute bottom-6 left-6 text-white max-w-[200px]">
                            <p className="font-serif italic text-lg leading-tight">&quot;{c('about_image_quote', 'Every dish tells a story of its origin.')}&quot;</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
