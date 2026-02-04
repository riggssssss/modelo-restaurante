import Link from "next/link";

export default function MenuPage() {
    return (
        <main className="min-h-screen bg-[#F8F5EE] p-6 md:p-12 font-sans">
            <Link href="/" className="fixed top-6 left-6 md:top-12 md:left-12 text-sm font-bold uppercase tracking-wider hover:opacity-70 z-50">
                &larr; Back to Home
            </Link>

            <div className="max-w-4xl mx-auto pt-20">
                <header className="text-center mb-24">
                    <span className="inline-block bg-[#EEDD4A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black mb-6">
                        Seasonal Menu &bull; Winter 2026
                    </span>
                    <h1 className="text-6xl md:text-8xl font-serif leading-none tracking-tight mb-8">
                        Taste the <br /><span className="italic text-neutral-400">extraordinary.</span>
                    </h1>
                    <p className="max-w-md mx-auto text-lg text-neutral-600">
                        Our menu changes daily based on market availability.
                        Below is a sample of our current offerings.
                    </p>
                </header>

                <section className="space-y-24">
                    {/* Starters */}
                    <div>
                        <h2 className="text-3xl font-serif border-b border-black/10 pb-6 mb-12">Starters</h2>
                        <div className="space-y-12">
                            {[
                                { name: "Burrata & Heritage Tomato", price: "18", desc: "Basil oil, pine nuts, balsamic glaze" },
                                { name: "Scallop Carpaccio", price: "24", desc: "Yuzu dressing, radish, coriander cress" },
                                { name: "Beef Tartare", price: "22", desc: "Smoked egg yolk, capers, sourdough crisp" }
                            ].map((item, i) => (
                                <div key={i} className="group flex justify-between items-baseline hover:opacity-70 transition-opacity cursor-default">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                                        <p className="text-neutral-500">{item.desc}</p>
                                    </div>
                                    <span className="text-xl font-mono">{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Mains */}
                    <div>
                        <h2 className="text-3xl font-serif border-b border-black/10 pb-6 mb-12">Mains</h2>
                        <div className="space-y-12">
                            {[
                                { name: "Wild Mushroom Risotto", price: "28", desc: "Truffle oil, parmesan crisp, thyme" },
                                { name: "Pan-Seared Seabass", price: "34", desc: "Cauliflower purée, samphire, lemon butter" },
                                { name: "Iberico Pork Presa", price: "38", desc: "Apple chutney, cider jus, charred leeks" },
                                { name: "Roast Duck Breast", price: "36", desc: "Blackberry jus, celeriac fondant, kale" }
                            ].map((item, i) => (
                                <div key={i} className="group flex justify-between items-baseline hover:opacity-70 transition-opacity cursor-default">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-2">{item.name}</h3>
                                        <p className="text-neutral-500">{item.desc}</p>
                                    </div>
                                    <span className="text-xl font-mono">{item.price}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <div className="mt-32 text-center pb-20">
                    <Link href="/reservations" className="px-10 py-5 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-all inline-block">
                        Book a Table
                    </Link>
                </div>
            </div>
        </main>
    );
}
