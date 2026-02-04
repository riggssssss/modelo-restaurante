"use client";

import Link from "next/link";
import { useState } from "react";
import Calendar from "@/components/Calendar";

export default function ReservationsPage() {
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [isCalendarOpen, setCalendarOpen] = useState(false);
    return (
        <main className="min-h-screen bg-[#F8F5EE] p-4 md:p-8 font-sans flex items-center justify-center pt-20">

            <div className="w-full max-w-[1600px] bg-white rounded-[2rem] shadow-2xl shadow-neutral-200 overflow-hidden grid grid-cols-1 md:grid-cols-2 min-h-[700px]">

                {/* LEFT: Form Section */}
                <div className="p-8 md:p-16 flex flex-col justify-center relative">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#EAB308] mb-4">Reservations</span>
                    <h1 className="text-4xl md:text-5xl font-serif mb-2">Secure your table.</h1>
                    <p className="text-neutral-400 mb-10">Experience the unforgettable.</p>

                    <form className="space-y-8">
                        {/* Party Size Selector - Visual */}
                        <div className="space-y-3">
                            <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Party Size</label>
                            <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                                {[1, 2, 3, 4, 5, 6].map(num => (
                                    <button key={num} type="button" className="w-12 h-12 rounded-full border border-neutral-200 flex items-center justify-center font-medium hover:bg-black hover:text-white hover:border-black transition-all focus:bg-black focus:text-white">
                                        {num}
                                    </button>
                                ))}
                                <button type="button" className="px-4 h-12 rounded-full border border-neutral-200 flex items-center justify-center font-medium hover:bg-black hover:text-white hover:border-black transition-all">
                                    8+
                                </button>
                            </div>
                        </div>

                        {/* Date & Time */}
                        <div className="grid grid-cols-2 gap-6 relative">
                            <div className="space-y-3 relative group">
                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Date</label>
                                <button
                                    type="button"
                                    onClick={() => setCalendarOpen(!isCalendarOpen)}
                                    className="w-full text-left border-b-2 border-neutral-100 py-2 font-serif text-xl focus:outline-none border-b-[#EAB308] bg-transparent transition-colors"
                                >
                                    {selectedDate ? selectedDate.toLocaleDateString('en-GB', { day: '2-digit', month: '2-digit', year: 'numeric' }) : "Select Date"}
                                </button>

                                {isCalendarOpen && (
                                    <div className="absolute top-full left-0 mt-4 z-50">
                                        <Calendar
                                            onSelect={(date) => {
                                                setSelectedDate(date);
                                                setCalendarOpen(false);
                                            }}
                                            selectedDate={selectedDate || new Date()}
                                            onClose={() => setCalendarOpen(false)}
                                        />
                                    </div>
                                )}
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-bold uppercase tracking-wider text-neutral-400">Time</label>
                                <select className="w-full border-b-2 border-neutral-100 py-2 font-serif text-xl focus:outline-none focus:border-[#EAB308] bg-transparent transition-colors appearance-none cursor-pointer">
                                    <option>19:00</option>
                                    <option>20:00</option>
                                    <option>21:00</option>
                                </select>
                            </div>
                        </div>

                        {/* Contact Details */}
                        <div className="space-y-6">
                            <input type="text" placeholder="Full Name" className="w-full border-b border-neutral-200 py-3 text-lg focus:outline-none focus:border-black transition-colors" />
                            <input type="email" placeholder="Email Address" className="w-full border-b border-neutral-200 py-3 text-lg focus:outline-none focus:border-black transition-colors" />
                            <input type="tel" placeholder="Phone Number" className="w-full border-b border-neutral-200 py-3 text-lg focus:outline-none focus:border-black transition-colors" />
                        </div>

                        <button className="w-full py-4 bg-black text-white font-bold uppercase tracking-widest rounded-xl hover:bg-neutral-800 transition-all mt-4 shadow-lg shadow-black/20">
                            Confirm Reservation
                        </button>
                    </form>
                </div>

                {/* RIGHT: Visual / Mood */}
                <div className="relative bg-neutral-900 hidden md:block">
                    <div className="absolute inset-0 opacity-60">
                        <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center"></div>
                    </div>
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>

                    <div className="absolute bottom-12 left-12 right-12 text-white">
                        <div className="text-[#EAB308] text-4xl mb-4">
                            &quot;
                        </div>
                        <p className="text-2xl font-serif leading-relaxed mb-6">
                            It is not just about the food. It is about the moment, the company, and the memory.
                        </p>
                        <div className="flex items-center gap-4">
                            <div className="w-10 h-10 rounded-full bg-neutral-700 overflow-hidden">
                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1583394600792-6d1872123d13?q=80&w=2000&auto=format&fit=crop')] bg-cover"></div>
                            </div>
                            <div>
                                <p className="text-sm font-bold uppercase tracking-wider">Keko Team</p>
                                <p className="text-xs text-neutral-400">Madrid, Spain</p>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </main>
    );
}
