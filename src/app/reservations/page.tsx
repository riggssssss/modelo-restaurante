"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "@/components/Calendar";
import TransitionLink from "@/components/TransitionLink";
import MobileMenu from "@/components/MobileMenu";

export default function ReservationsPage() {
    const [step, setStep] = useState(1);
    const [partySize, setPartySize] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const variants = {
        enter: { opacity: 0, x: 20, filter: "blur(10px)" },
        center: { opacity: 1, x: 0, filter: "blur(0px)" },
        exit: { opacity: 0, x: -20, filter: "blur(10px)" }
    };

    return (
        <main className="min-h-screen p-4 md:p-8 flex items-center justify-center font-sans">
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div className="w-full max-w-[1600px] bg-transparent grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 h-[calc(100vh-4rem)] min-h-[750px]">

                {/* LEFT COLUMN: Interactive Wizard */}
                <div className="relative flex flex-col justify-between p-6 md:p-12 rounded-[2rem] bg-[#F8F5EE] overflow-hidden shadow-sm">

                    {/* Header */}
                    <header className="flex justify-between items-center w-full mb-8 z-20">
                        <TransitionLink href="/" className="text-xl font-bold tracking-tight">KEKO.</TransitionLink>
                        <nav className="hidden md:flex gap-6 text-sm font-medium uppercase tracking-wider opacity-70">
                            <TransitionLink href="/about" className="hover:opacity-100">About</TransitionLink>
                            <TransitionLink href="/menu" className="hover:opacity-100">Menu</TransitionLink>
                            <TransitionLink href="/reservations" className="hover:opacity-100 opacity-100 underline decoration-2 underline-offset-4">Bookings</TransitionLink>
                        </nav>
                        <div className="md:hidden">
                            <button onClick={() => setIsMobileMenuOpen(true)} className="space-y-1.5 cursor-pointer p-2">
                                <div className="w-6 h-0.5 bg-black"></div>
                                <div className="w-6 h-0.5 bg-black"></div>
                            </button>
                        </div>
                    </header>

                    {/* Progress Indicator */}
                    <div className="flex gap-2 mb-8 z-20">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-black" : "bg-neutral-200"}`} />
                        ))}
                    </div>

                    {/* Wizard Content */}
                    <div className="flex-grow relative flex flex-col justify-center">
                        <AnimatePresence mode="wait">

                            {/* STEP 1: PARTY SIZE */}
                            {step === 1 && (
                                <motion.div
                                    key="step1"
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    <div className="inline-block w-fit bg-[#EEDD4A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black mb-6">Step 1/4</div>
                                    <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">How many guests?</h2>

                                    <div className="grid grid-cols-4 md:grid-cols-6 gap-3 mb-8">
                                        {[1, 2, 3, 4, 5, 6, 7, 8].map((num) => (
                                            <button
                                                key={num}
                                                onClick={() => setPartySize(num)}
                                                className={`aspect-square rounded-2xl flex items-center justify-center text-xl font-medium transition-all duration-300 ${partySize === num ? "bg-black text-white shadow-lg scale-105" : "bg-white border border-neutral-100 hover:border-black/20 hover:bg-neutral-50"}`}
                                            >
                                                {num}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            disabled={!partySize}
                                            onClick={nextStep}
                                            className="px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95"
                                        >
                                            Next &rarr;
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 2: DATE (Inline Calendar) */}
                            {step === 2 && (
                                <motion.div
                                    key="step2"
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    <div className="mb-8 flex justify-center">
                                        <Calendar
                                            onSelect={(date) => setSelectedDate(date)}
                                            selectedDate={selectedDate || new Date()}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button onClick={prevStep} className="text-sm font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors">Go Back</button>
                                        <button
                                            disabled={!selectedDate}
                                            onClick={nextStep}
                                            className="px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95"
                                        >
                                            Next &rarr;
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 3: TIME (Grid Selection) */}
                            {step === 3 && (
                                <motion.div
                                    key="step3"
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    <div className="inline-block w-fit bg-[#EEDD4A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black mb-6">Step 3/4</div>
                                    <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">Pick a time</h2>

                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-8">
                                        {["19:00", "19:30", "20:00", "20:30", "21:00", "21:30", "22:00", "22:30"].map((time) => (
                                            <button
                                                key={time}
                                                onClick={() => setSelectedTime(time)}
                                                className={`py-6 rounded-2xl flex items-center justify-center text-xl font-medium transition-all duration-300 ${selectedTime === time ? "bg-black text-white shadow-lg scale-105" : "bg-white border border-neutral-100 hover:border-black/20 hover:bg-neutral-50"}`}
                                            >
                                                {time}
                                            </button>
                                        ))}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button onClick={prevStep} className="text-sm font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors">Go Back</button>
                                        <button
                                            disabled={!selectedTime}
                                            onClick={nextStep}
                                            className="px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed hover:bg-neutral-800 transition-all hover:scale-105 active:scale-95"
                                        >
                                            Next &rarr;
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 4: DETAILS */}
                            {step === 4 && (
                                <motion.div
                                    key="step4"
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="w-full"
                                >
                                    <div className="inline-block w-fit bg-[#EEDD4A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black mb-6">Final Step</div>
                                    <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">Complete your booking</h2>

                                    <div className="space-y-6 mb-8">
                                        <input
                                            type="text"
                                            placeholder="Full Name"
                                            className="w-full bg-transparent border-b border-neutral-200 py-4 text-xl placeholder:text-neutral-300 focus:outline-none focus:border-black transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        <input
                                            type="email"
                                            placeholder="Email Address"
                                            className="w-full bg-transparent border-b border-neutral-200 py-4 text-xl placeholder:text-neutral-300 focus:outline-none focus:border-black transition-all"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Phone Number"
                                            className="w-full bg-transparent border-b border-neutral-200 py-4 text-xl placeholder:text-neutral-300 focus:outline-none focus:border-black transition-all"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="bg-[#F2EFE5] p-6 rounded-2xl mb-8 border border-black/5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Summary</p>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-lg font-medium">{selectedDate?.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })} at {selectedTime}</span>
                                            <span className="text-sm text-neutral-500">{partySize} Guests</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button onClick={prevStep} className="text-sm font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors">Go Back</button>
                                        <button
                                            className="px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 transition-all"
                                        >
                                            Confirm Booking
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-xs text-neutral-400 uppercase tracking-widest z-20">
                        Based in Madrid &mdash; Est. 2026
                    </div>
                </div>

                {/* RIGHT COLUMN: Visuals */}
                <div className="relative rounded-[2rem] overflow-hidden bg-neutral-200 hidden md:block">
                    <div className="absolute inset-0 bg-neutral-900">
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center grayscale-[20%] transition-all duration-1000 hover:scale-105" />
                    </div>

                    {/* Dynamic Quote based on step */}
                    <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-xs text-white">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={step}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.5 }}
                            >
                                <p className="text-sm font-medium">
                                    {step === 1 && "\"The perfect evening starts with the right company.\""}
                                    {step === 2 && "\"We are ready when you are.\""}
                                    {step === 3 && "\"Time is the only luxury.\""}
                                    {step === 4 && "\"Just one step away from an unforgettable night.\""}
                                </p>
                                <div className="mt-2 text-xs opacity-70">&mdash; Keko Experience</div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </main>
    );
}
