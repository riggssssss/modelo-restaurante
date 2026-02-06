"use client";

import { useState } from "react";
import ReservationsCalendar from "./ReservationsCalendar";
import ReservationsList from "./ReservationsList";

export default function ReservationsManager({ reservations }: { reservations: any[] }) {
    const [view, setView] = useState<'calendar' | 'list'>('calendar');

    return (
        <div>
            <div className="flex gap-4 mb-8">
                <button
                    onClick={() => setView('calendar')}
                    className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all ${view === 'calendar' ? 'bg-black text-white' : 'bg-white text-neutral-500 hover:bg-neutral-100'
                        }`}
                >
                    Calendario
                </button>
                <button
                    onClick={() => setView('list')}
                    className={`px-6 py-2 rounded-full font-bold uppercase tracking-wider text-sm transition-all ${view === 'list' ? 'bg-black text-white' : 'bg-white text-neutral-500 hover:bg-neutral-100'
                        }`}
                >
                    Lista
                </button>
            </div>

            <div className="bg-white rounded-[2rem] p-6 border border-neutral-100 min-h-[600px]">
                {view === 'calendar' ? (
                    <ReservationsCalendar reservations={reservations} />
                ) : (
                    <ReservationsList reservations={reservations} />
                )}
            </div>
        </div>
    );
}
