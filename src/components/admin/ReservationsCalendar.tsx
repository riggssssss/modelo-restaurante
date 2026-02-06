"use client";

import { useState } from "react";

export default function ReservationsCalendar({ reservations }: { reservations: any[] }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState<Date | null>(new Date());

    // Helper to get days in month
    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => {
        const day = new Date(year, month, 1).getDay();
        return day === 0 ? 6 : day - 1; // 0 = Monday, 6 = Sunday
    };

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysCount = getDaysInMonth(year, month);
    const firstDay = getFirstDayOfMonth(year, month);

    const days = Array.from({ length: daysCount }, (_, i) => i + 1);
    const empties = Array.from({ length: firstDay }, (_, i) => i);

    const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
    const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));

    // Filter bookings for specific day
    const getBookingsForDay = (day: number) => {
        return reservations.filter(r => {
            const d = new Date(r.date);
            return d.getDate() === day && d.getMonth() === month && d.getFullYear() === year;
        }).sort((a, b) => a.time.localeCompare(b.time));
    };

    const selectedBookings = selectedDay
        ? getBookingsForDay(selectedDay.getDate())
        : [];

    return (
        <div className="flex flex-col md:flex-row gap-8 h-full">
            {/* Calendar Grid */}
            <div className="flex-1">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-serif capitalize">
                        {currentDate.toLocaleDateString('es-ES', { month: 'long', year: 'numeric' })}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100">&larr;</button>
                        <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full border border-neutral-200 hover:bg-neutral-100">&rarr;</button>
                    </div>
                </div>

                <div className="grid grid-cols-7 gap-2 text-center mb-2">
                    {['L', 'M', 'X', 'J', 'V', 'S', 'D'].map(d => (
                        <div key={d} className="text-xs font-bold text-neutral-400">{d}</div>
                    ))}
                </div>

                <div className="grid grid-cols-7 gap-2">
                    {empties.map(i => <div key={`e-${i}`} />)}
                    {days.map(day => {
                        const bookings = getBookingsForDay(day);
                        const isSelected = selectedDay && selectedDay.getDate() === day && selectedDay.getMonth() === month;

                        return (
                            <button
                                key={day}
                                onClick={() => setSelectedDay(new Date(year, month, day))}
                                className={`
                                    aspect-square rounded-xl flex flex-col items-center justify-center relative border transition-all
                                    ${isSelected ? 'border-black bg-black text-white' : 'border-neutral-100 bg-white hover:border-black/30'}
                                `}
                            >
                                <span className="font-bold">{day}</span>
                                {bookings.length > 0 && (
                                    <div className="flex gap-0.5 mt-1">
                                        {bookings.length > 5 ? (
                                            <span className="text-[10px] opacity-70">+{bookings.length}</span>
                                        ) : (
                                            bookings.map((_, i) => (
                                                <div key={i} className={`w-1 h-1 rounded-full ${isSelected ? 'bg-white' : 'bg-primary'}`} />
                                            ))
                                        )}
                                    </div>
                                )}
                            </button>
                        );
                    })}
                </div>
            </div>

            {/* Sidebar Details */}
            <div className="w-full md:w-80 border-l border-neutral-100 pl-0 md:pl-8">
                <h3 className="text-lg font-bold mb-4">
                    {selectedDay?.toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' })}
                </h3>

                <div className="space-y-3 overflow-y-auto max-h-[500px]">
                    {selectedBookings.length === 0 ? (
                        <p className="text-neutral-400 italic text-sm">No hay reservas para este día.</p>
                    ) : (
                        selectedBookings.map(booking => (
                            <div key={booking.id} className="bg-neutral-50 p-4 rounded-xl border border-neutral-100">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="font-bold text-lg">{booking.time}</span>
                                    <span className="text-xs font-bold uppercase bg-white px-2 py-1 rounded border border-neutral-200">
                                        {booking.party_size} pax
                                    </span>
                                </div>
                                <div className="font-medium">{booking.name}</div>
                                <a href={`tel:${booking.phone}`} className="text-xs text-neutral-500 hover:underline block">{booking.phone}</a>
                                <div className="text-xs text-neutral-400 truncate">{booking.email}</div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
