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
        <div className="bg-white p-6 md:p-8 rounded-[2rem] shadow-sm border border-neutral-100 w-full max-w-[500px] mx-auto">
            <div className="flex justify-between items-center mb-8">
                <button onClick={prevMonth} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-neutral-100 transition-colors text-neutral-800 border border-neutral-200 hover:border-black">
                    &larr;
                </button>
                <h3 className="font-serif text-3xl font-medium">
                    {currentMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </h3>
                <button onClick={nextMonth} className="w-12 h-12 flex items-center justify-center rounded-2xl hover:bg-neutral-100 transition-colors text-neutral-800 border border-neutral-200 hover:border-black">
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
                aspect-square flex items-center justify-center text-xl font-medium rounded-2xl transition-all duration-300
                ${isSelected(day)
                                ? "bg-black text-white shadow-xl scale-105"
                                : "bg-white border border-neutral-100 text-neutral-600 hover:border-black/30 hover:bg-neutral-50"
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
