

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#F8F5EE] p-4 md:p-8 font-sans pt-20">

            <div className="w-full max-w-[1600px] mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 min-h-[calc(100vh-4rem)]">
                {/* Left: Text */}
                <div className="flex flex-col justify-center p-8 md:p-20 order-2 md:order-1">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#EAB308] mb-6">Our Story</span>
                    <h1 className="text-5xl md:text-7xl font-serif leading-tight mb-10">
                        Born from a love of <span className="italic">tradition</span> & innovation.
                    </h1>
                    <div className="space-y-6 text-lg text-neutral-600 leading-relaxed max-w-lg">
                        <p>
                            Keko started as a dream in a small kitchen in Madrid. We wanted to create a space that felt like home, yet surprised you with every bite.
                        </p>
                        <p>
                            Our philosophy is simple: source the best ingredients, treat them with respect, and serve them with warmth. We believe that dining is not just about sustenance, but about connection.
                        </p>
                        <p>
                            Whether you are here for a quick lunch or a celebratory dinner, we promise an experience that lingers in your memory long after the last bite.
                        </p>
                    </div>

                    <div className="mt-12">
                        <img src="https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=2800&auto=format&fit=crop" alt="Signature" className="h-16 opacity-60" />
                        <p className="text-sm font-bold uppercase tracking-widest mt-4">Chef Adrian Garcia</p>
                    </div>
                </div>

                {/* Right: Visuals */}
                <div className="flex flex-col gap-6 order-1 md:order-2 h-full">
                    <div className="relative flex-grow min-h-[40vh] rounded-[2rem] overflow-hidden">
                        {/* Main Atmosphere Image */}
                        <div className="absolute inset-0 bg-neutral-300">
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                        </div>
                    </div>

                    <div className="relative h-64 md:h-80 rounded-[2rem] overflow-hidden group">
                        {/* Secondary Detail Image (Kitchen/Plating) */}
                        <div className="absolute inset-0 bg-neutral-800">
                            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center opacity-80 group-hover:opacity-100 transition-opacity duration-700"></div>
                        </div>
                        <div className="absolute bottom-6 left-6 text-white max-w-[200px]">
                            <p className="font-serif italic text-lg leading-tight">&quot;Every dish tells a story of its origin.&quot;</p>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
}
