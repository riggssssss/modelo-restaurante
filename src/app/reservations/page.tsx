import Link from "next/link";

export default function ReservationsPage() {
    return (
        <main className="min-h-screen bg-[#F8F5EE] flex flex-col justify-center items-center p-6 relative">
            <Link href="/" className="absolute top-6 left-6 md:top-12 md:left-12 text-sm font-bold uppercase tracking-wider hover:opacity-70">
                &larr; Back
            </Link>

            <div className="w-full max-w-2xl text-center space-y-12">
                <div>
                    <h1 className="text-5xl md:text-7xl font-serif mb-6">Book a Table</h1>
                    <p className="text-neutral-500 text-lg">We release tables 30 days in advance.</p>
                </div>

                <form className="bg-white p-8 md:p-12 rounded-[2rem] shadow-xl shadow-black/5 space-y-8 text-left">
                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Date</label>
                            <input type="date" className="w-full border-b border-black/10 py-3 text-xl font-medium focus:outline-none focus:border-black transition-colors bg-transparent" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Guests</label>
                            <select className="w-full border-b border-black/10 py-3 text-xl font-medium focus:outline-none focus:border-black transition-colors bg-transparent">
                                {[1, 2, 3, 4, 5, 6, 7, 8].map(n => <option key={n} value={n}>{n} People</option>)}
                            </select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Time</label>
                        <div className="flex flex-wrap gap-3 pt-2">
                            {['18:00', '18:30', '19:00', '19:30', '20:00', '20:30', '21:00'].map(time => (
                                <button key={time} type="button" className="px-6 py-2 border border-black/10 rounded-full hover:bg-black hover:text-white transition-all text-sm font-medium">
                                    {time}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6 pt-6">
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Name</label>
                            <input type="text" placeholder="John Doe" className="w-full border-b border-black/10 py-3 text-xl font-medium focus:outline-none focus:border-black transition-colors bg-transparent" />
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Email</label>
                            <input type="email" placeholder="john@example.com" className="w-full border-b border-black/10 py-3 text-xl font-medium focus:outline-none focus:border-black transition-colors bg-transparent" />
                        </div>
                    </div>

                    <button type="button" className="w-full py-5 bg-[#EAB308] text-black font-bold uppercase tracking-wider rounded-full hover:bg-[#CA8A04] transition-colors mt-8">
                        Confirm Booking
                    </button>
                </form>

                <p className="text-xs text-neutral-400">
                    For parties larger than 8, please contact us directly at <a href="mailto:hello@keko.com" className="underline hover:text-black">hello@keko.com</a>.
                </p>
            </div>
        </main>
    );
}
