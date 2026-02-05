"use client";

import { useState } from "react";

interface CalendarProps {
    selectedDate: Date | null;
    onSelect: (date: Date) => void;
    onClose: () => void;
}

export default function Calendar({ selectedDate, onSelect, onClose }: CalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(selectedDate || new Date());

    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const getFirstDayOfMonth = (year: number, month: number) => {
        // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
        // Adjust so 0 = Monday if we want Monday start, but let's stick to Sun=0 for standard US or Mon=1 for EU.
        // Let's assume standard JS getDay() (0=Sun)
        return new Date(year, month, 1).getDay();
    };

    const daysInMonth = getDaysInMonth(currentMonth.getFullYear(), currentMonth.getMonth());
    const firstDay = getFirstDayOfMonth(currentMonth.getFullYear(), currentMonth.getMonth());

    // Array for empty slots before first day
    const empties = Array.from({ length: firstDay }, (_, i) => i);
    // Array for days
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const prevMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

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
        <div className="bg-white p-6 rounded-3xl shadow-2xl border border-neutral-100 w-full max-w-[420px]">
            <div className="flex justify-between items-center mb-8">
                <button onClick={prevMonth} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-100 transition-colors text-neutral-800 border border-neutral-200 hover:border-black">
                    &larr;
                </button>
                <h3 className="font-serif text-2xl font-medium">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={nextMonth} className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-neutral-100 transition-colors text-neutral-800 border border-neutral-200 hover:border-black">
                    &rarr;
                </button>
            </div>

            <div className="grid grid-cols-7 gap-3 mb-4 text-center">
                {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d) => (
                    <div key={d} className="text-xs font-bold text-neutral-400 uppercase tracking-widest">
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
                aspect-square flex items-center justify-center text-lg font-medium rounded-2xl transition-all duration-300
                ${isSelected(day)
                                ? "bg-black text-white shadow-xl scale-110"
                                : "bg-white border border-neutral-100 text-neutral-600 hover:border-black/30 hover:bg-neutral-50 hover:scale-105"
                            }
            `}
                    >
                        {day}
                    </button>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-neutral-100 flex justify-center">
                <button onClick={onClose} className="text-xs text-neutral-400 hover:text-black uppercase tracking-widest font-bold px-4 py-2 hover:bg-neutral-100 rounded-lg transition-all">
                    Close Calendar
                </button>
            </div>
        </div>
    );
}
