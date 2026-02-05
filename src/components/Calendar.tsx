"use client";

import { useState } from "react";

interface CalendarProps {
    selectedDate: Date | null;
    onSelect: (date: Date) => void;
    onClose: () => void;
}

export default function Calendar({ selectedDate, onSelect }: Omit<CalendarProps, 'onClose'>) {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

    const empties = Array.from({ length: firstDay }, (_, i) => i);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    const nextMonth = () => setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));

    const handleDayClick = (day: number) => {
        const newDate = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
        onSelect(newDate);
    };

    const isSelected = (day: number) => {
        return (
            selectedDate &&
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentMonth.getMonth() &&
            selectedDate.getFullYear() === currentMonth.getFullYear()
        );
    };

    return (
        <div className="w-full">
            <div className="flex flex-wrap justify-between items-center gap-y-0">
                <h2 className="text-4xl md:text-5xl font-serif leading-none">Select a date</h2>

                <div className="flex items-center gap-4">
                    <h3 className="text-4xl md:text-5xl font-serif italic leading-none text-right">
                        {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                    </h3>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-xl bg-black hover:bg-neutral-800 transition-all text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6" /></svg>
                        </button>
                        <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-xl bg-black hover:bg-neutral-800 transition-all text-white">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6" /></svg>
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 mb-2 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
                    <div key={i} className="text-sm font-bold text-neutral-400 uppercase tracking-widest pb-3">
                        {d}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-3">
                {empties.map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={() => handleDayClick(day)}
                        className={`
                aspect-square flex items-center justify-center text-xl font-medium rounded-2xl transition-all duration-300
                ${isSelected(day)
                                ? "bg-black text-white shadow-lg scale-105"
                                : "bg-white border border-neutral-100 text-neutral-600 hover:border-black/20 hover:bg-neutral-50"
                            }
            `}
                    >
                        {day}
                    </button>
                ))}
            </div>
        </div>
    );
}
