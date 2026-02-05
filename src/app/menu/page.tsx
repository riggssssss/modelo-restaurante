"use client";

import { useState } from "react";
import TransitionLink from "@/components/TransitionLink";
import MobileMenu from "@/components/MobileMenu";

export default function MenuPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    return (
        <main className="min-h-screen bg-[#F8F5EE] font-sans">
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            {/* Hero Header */}
            <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-neutral-900">
                    <div className="w-full h-full opacity-60 bg-[url('https://images.unsplash.com/photo-1544025162-d7669d26d391?q=80&w=2600&auto=format&fit=crop')] bg-cover bg-center"></div>
                </div>

                {/* Navbar - Absolute & White text */}
                <header className="absolute top-0 left-0 w-full p-4 md:p-8 flex justify-between items-center z-50 text-white">
                    <TransitionLink href="/" className="text-xl font-bold tracking-tight">KEKO.</TransitionLink>
                    <nav className="hidden md:flex gap-6 text-sm font-medium uppercase tracking-wider opacity-90">
                        <TransitionLink href="/about" className="hover:opacity-100">About</TransitionLink>
                        <TransitionLink href="/menu" className="hover:opacity-100 opacity-100 underline decoration-2 underline-offset-4">Menu</TransitionLink>
                        <TransitionLink href="/reservations" className="hover:opacity-100">Bookings</TransitionLink>
                    </nav>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="space-y-1.5 cursor-pointer p-2"
                        >
                            <div className="w-6 h-0.5 bg-white"></div>
                            <div className="w-6 h-0.5 bg-white"></div>
                        </button>
                    </div>
                </header>

                <div className="relative z-10 text-center text-white p-4">
                    <span className="inline-block border border-white/30 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        Seasonal Menu &bull; Winter 2026
                    </span>
                    <h1 className="text-6xl md:text-9xl font-serif leading-none tracking-tight">
                        The Menu
                    </h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 md:px-12 py-24">

                {/* Intro */}
                <p className="max-w-xl mx-auto text-xl text-center text-neutral-600 mb-24 font-serif italic">
                    &quot;Our menu changes daily based on what the earth provides. We work closely with local farmers to bring the best of Madrid to your plate.&quot;
                </p>

                <section className="space-y-32">
                    {/* Starters */}
                    <div className="grid md:grid-cols-[1fr_300px] gap-12 items-start">
                        <div>
                            <h2 className="text-4xl font-serif mb-12 flex items-center gap-4">
                                Starters
                                <span className="h-px bg-black/10 flex-grow"></span>
                            </h2>
                            <div className="space-y-12">
                                {[
                                    { name: "Burrata & Heritage Tomato", price: "18", desc: "Basil oil, pine nuts, balsamic glaze" },
                                    { name: "Scallop Carpaccio", price: "24", desc: "Yuzu dressing, radish, coriander cress" },
                                    { name: "Beef Tartare", price: "22", desc: "Smoked egg yolk, capers, sourdough crisp" }
                                ].map((item, i) => (
                                    <div key={i} className="group relative pl-4 border-l-2 border-transparent hover:border-[#EAB308] transition-all cursor-default">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-2xl font-bold">{item.name}</h3>
                                            <span className="text-xl font-mono text-neutral-400">{item.price}</span>
                                        </div>
                                        <p className="text-neutral-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hidden md:block sticky top-24">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-200">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1626804475297-411db7044238?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center"></div>
                            </div>
                            <p className="text-xs text-center mt-3 text-neutral-400 uppercase tracking-widest">Plated by Chef Garcia</p>
                        </div>
                    </div>

                    {/* Mains */}
                    <div className="grid md:grid-cols-[300px_1fr] gap-12 items-start">
                        <div className="hidden md:block sticky top-24 order-2 md:order-1">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-200">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1546241072-48010ad2862c?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center"></div>
                            </div>
                            <p className="text-xs text-center mt-3 text-neutral-400 uppercase tracking-widest">Locally Sourced</p>
                        </div>

                        <div className="order-1 md:order-2">
                            <h2 className="text-4xl font-serif mb-12 flex items-center gap-4">
                                <span className="h-px bg-black/10 flex-grow"></span>
                                Mains
                            </h2>
                            <div className="space-y-12">
                                {[
                                    { name: "Wild Mushroom Risotto", price: "28", desc: "Truffle oil, parmesan crisp, thyme" },
                                    { name: "Pan-Seared Seabass", price: "34", desc: "Cauliflower purée, samphire, lemon butter" },
                                    { name: "Iberico Pork Presa", price: "38", desc: "Apple chutney, cider jus, charred leeks" },
                                    { name: "Roast Duck Breast", price: "36", desc: "Blackberry jus, celeriac fondant, kale" }
                                ].map((item, i) => (
                                    <div key={i} className="group relative pl-4 border-l-2 border-transparent hover:border-[#EAB308] transition-all cursor-default">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-2xl font-bold">{item.name}</h3>
                                            <span className="text-xl font-mono text-neutral-400">{item.price}</span>
                                        </div>
                                        <p className="text-neutral-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Desserts */}
                    <div className="grid md:grid-cols-[1fr_300px] gap-12 items-start">
                        <div>
                            <h2 className="text-4xl font-serif mb-12 flex items-center gap-4">
                                Desserts
                                <span className="h-px bg-black/10 flex-grow"></span>
                            </h2>
                            <div className="space-y-12">
                                {[
                                    { name: "Dark Chocolate Tart", price: "12", desc: "Sea salt, crème fraîche, honeycomb" },
                                    { name: "Basque Burnt Cheesecake", price: "14", desc: "Fig jam, walnut crumble" },
                                    { name: "Poached Pear", price: "12", desc: "Saffron syrup, vanilla bean ice cream" }
                                ].map((item, i) => (
                                    <div key={i} className="group relative pl-4 border-l-2 border-transparent hover:border-[#EAB308] transition-all cursor-default">
                                        <div className="flex justify-between items-baseline mb-2">
                                            <h3 className="text-2xl font-bold">{item.name}</h3>
                                            <span className="text-xl font-mono text-neutral-400">{item.price}</span>
                                        </div>
                                        <p className="text-neutral-500">{item.desc}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="hidden md:block sticky top-24">
                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-200">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1511914678378-2906b1f69dcf?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center"></div>
                            </div>
                            <p className="text-xs text-center mt-3 text-neutral-400 uppercase tracking-widest">Sweet Ending</p>
                        </div>
                    </div>

                </section>

                <div className="mt-32 text-center pb-20 border-t border-black/5 pt-20">
                    <h3 className="text-3xl font-serif mb-8">Ready to taste?</h3>
                    <TransitionLink href="/reservations" className="px-10 py-5 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-all inline-block shadow-xl hover:shadow-2xl hover:-translate-y-1">
                        Book a Table
                    </TransitionLink>
                </div>
            </div>
        </main>
    );
}
