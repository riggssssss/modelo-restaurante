import Link from "next/link";

export default function AboutPage() {
    return (
        <main className="min-h-screen bg-[#F8F5EE] p-4 md:p-8 font-sans">
            <Link href="/" className="fixed top-6 left-6 md:top-12 md:left-12 text-sm font-bold uppercase tracking-wider hover:opacity-70 z-50 mix-blend-difference text-black/50">
                &larr; Back
            </Link>

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

                {/* Right: Image */}
                <div className="relative h-[50vh] md:h-auto rounded-[2rem] overflow-hidden order-1 md:order-2">
                    <div className="absolute inset-0 bg-neutral-300">
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                    </div>
                </div>
            </div>
        </main>
    );
}
