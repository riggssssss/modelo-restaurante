"use client";

import { useState, useEffect } from "react";

interface CalendarProps {
    onSelect: (date: Date) => void;
    selectedDate?: Date;
    onClose?: () => void;
}

export default function Calendar({ onSelect, selectedDate, onClose }: CalendarProps) {
    const [currentDate, setCurrentDate] = useState(selectedDate || new Date());

    // Logic to get days in month
    const getDaysInMonth = (year: number, month: number) => {
        return new Date(year, month + 1, 0).getDate();
    };

    const daysInMonth = getDaysInMonth(currentDate.getFullYear(), currentDate.getMonth());
    const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    // Adjust so Monday is 0? Default JS Sunday is 0. Let's keep Sunday 0 for now or shift based on locale. 
    // Let's standardise on formatted grid.

    // Padding for empty start cells
    const emptyDays = Array(firstDayOfMonth).fill(null);
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

    const months = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];

    const handleDayClick = (day: number) => {
        const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
        onSelect(newDate);
        if (onClose) onClose();
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    // Check if a day is selected
    const isSelected = (day: number) => {
        if (!selectedDate) return false;
        return (
            selectedDate.getDate() === day &&
            selectedDate.getMonth() === currentDate.getMonth() &&
            selectedDate.getFullYear() === currentDate.getFullYear()
        );
    };

    return (
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-2xl w-[320px] font-sans animate-fade-in z-50">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <button onClick={prevMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
                    &larr;
                </button>
                <span className="font-serif text-lg font-bold">
                    {months[currentDate.getMonth()]} {currentDate.getFullYear()}
                </span>
                <button onClick={nextMonth} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-neutral-100 transition-colors">
                    &rarr;
                </button>
            </div>

            {/* Days Header */}
            <div className="grid grid-cols-7 mb-2 text-center text-xs font-bold uppercase text-neutral-400 tracking-wider">
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
            </div>

            {/* Grid */}
            <div className="grid grid-cols-7 gap-1 text-center">
                {emptyDays.map((_, i) => (
                    <div key={`empty-${i}`} />
                ))}
                {days.map((day) => (
                    <button
                        key={day}
                        onClick={(e) => { e.preventDefault(); handleDayClick(day); }}
                        className={`
              w-9 h-9 flex items-center justify-center rounded-full text-sm font-medium transition-all
              ${isSelected(day)
                                ? "bg-black text-white hover:bg-neutral-800"
                                : "hover:bg-neutral-100 text-neutral-700"
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
