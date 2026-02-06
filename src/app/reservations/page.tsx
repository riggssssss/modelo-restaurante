"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Calendar from "@/components/Calendar";
import TransitionLink from "@/components/TransitionLink";
import MobileMenu from "@/components/MobileMenu";
import { getSiteContent, getContent } from "@/lib/content";

import { submitReservation } from "@/actions/reservations";

export default function ReservationsPage() {
    const [step, setStep] = useState(1);
    const [partySize, setPartySize] = useState<number | null>(null);
    const [selectedDate, setSelectedDate] = useState<Date | null>(null);
    const [selectedTime, setSelectedTime] = useState<string>("");
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form Data
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: ""
    });

    const handleSubmit = async () => {
        setIsSubmitting(true);

        try {
            const data = new FormData();
            // Fix timezone issue: Send date as YYYY-MM-DD string in LOCAL time, not UTC ISO
            // Create a date string that represents the selected day in the user's timezone
            const year = selectedDate?.getFullYear();
            const month = String((selectedDate?.getMonth() || 0) + 1).padStart(2, '0');
            const day = String(selectedDate?.getDate()).padStart(2, '0');
            const dateString = `${year}-${month}-${day}`;

            data.append('date', dateString || '');
            data.append('time', selectedTime);
            data.append('partySize', partySize?.toString() || '');
            data.append('name', formData.name);
            data.append('email', formData.email);
            data.append('phone', formData.phone);

            const result = await submitReservation(null, data);

            if (result.success) {
                setStep(5); // Success step
            } else {
                alert(result.message);
            }
        } catch (error) {
            console.error(error);
            alert('Ha ocurrido un error inesperado.');
        } finally {
            setIsSubmitting(false);
        }
    };

    // Dynamic Settings
    const [lunchStart, setLunchStart] = useState("13:00");
    const [lunchEnd, setLunchEnd] = useState("16:00");
    const [dinnerStart, setDinnerStart] = useState("20:00");
    const [dinnerEnd, setDinnerEnd] = useState("23:00");
    const [minDiners, setMinDiners] = useState(1);
    const [maxDiners, setMaxDiners] = useState(8);
    const [stepImages, setStepImages] = useState<Record<number, string>>({
        1: "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070",
        2: "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074",
        3: "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070",
        4: "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070"
    });
    const [singleImageMode, setSingleImageMode] = useState(false);

    // Fetch settings and constraints
    useEffect(() => {
        const fetchSettings = async () => {
            const content = await getSiteContent();

            // Get Constraints from Server Action
            const { getReservationConstraints } = await import("@/actions/reservations");
            const constraints = await getReservationConstraints();

            // Limits (prefer constraints from server action over content file if available)
            if (constraints) {
                setMinDiners(constraints.minDiners);
                setMaxDiners(constraints.maxDiners);
            } else {
                // Fallback
                const min = parseInt(getContent(content, 'res_min_diners', '1'));
                const max = parseInt(getContent(content, 'res_max_diners', '8'));
                if (!isNaN(min)) setMinDiners(min);
                if (!isNaN(max)) setMaxDiners(max);
            }

            // Hours
            setLunchStart(getContent(content, 'res_lunch_start', '13:00'));
            setLunchEnd(getContent(content, 'res_lunch_end', '16:00'));
            setDinnerStart(getContent(content, 'res_dinner_start', '20:00'));
            setDinnerEnd(getContent(content, 'res_dinner_end', '23:00'));

            // Images
            const useSingle = getContent(content, 'res_single_image_mode', 'false') === 'true';
            setSingleImageMode(useSingle);

            setStepImages({
                1: getContent(content, 'res_image_step_1', "https://images.unsplash.com/photo-1514362545857-3bc16c4c7d1b?q=80&w=2070"),
                2: getContent(content, 'res_image_step_2', "https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=2074"),
                3: getContent(content, 'res_image_step_3', "https://images.unsplash.com/photo-1550966871-3ed3c47e2ce2?q=80&w=2070"),
                4: getContent(content, 'res_image_step_4', "https://images.unsplash.com/photo-1555244162-803834f70033?q=80&w=2070")
            });
        };
        fetchSettings();
    }, []);

    // Helper to generate time slots
    const generateRangeSlots = (start: string, end: string) => {
        const slots = [];
        const [startH, startM] = start.split(':').map(Number);
        const [endH, endM] = end.split(':').map(Number);

        // Safety check
        if (isNaN(startH) || isNaN(endH)) return [];

        let currentTotal = startH * 60 + startM;
        const endTotal = endH * 60 + endM;

        // Cap at 20 slots per range to avoid infinite loops if bad input
        let count = 0;
        while (currentTotal <= endTotal && count < 20) {
            const h = Math.floor(currentTotal / 60);
            const m = currentTotal % 60;
            const timeString = `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
            slots.push(timeString);
            currentTotal += 30; // 30 min increments
            count++;
        }
        return slots;
    };

    const timeSlots = [
        ...generateRangeSlots(lunchStart, lunchEnd),
        ...generateRangeSlots(dinnerStart, dinnerEnd)
    ];



    const nextStep = () => setStep((prev) => prev + 1);
    const prevStep = () => setStep((prev) => prev - 1);

    const variants = {
        enter: { opacity: 0, x: 20, filter: "blur(10px)" },
        center: { opacity: 1, x: 0, filter: "blur(0px)" },
        exit: { opacity: 0, x: -20, filter: "blur(10px)" }
    };

    // Diners Logic
    const availableDiners = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]; // Base range to filter from

    return (
        <main className="min-h-screen p-4 md:p-8 flex flex-col font-sans">
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            <div className="w-full max-w-[1600px] bg-transparent grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 h-[calc(100vh-4rem)] min-h-[750px]">

                {/* LEFT COLUMN: Interactive Wizard */}
                <div className="relative flex flex-col justify-between p-6 md:p-12 rounded-[2rem] bg-background shadow-lg">

                    {/* Mobile Header (Hidden on Desktop) */}
                    <header className="flex justify-between items-center w-full mb-8 z-20 md:hidden">
                        <TransitionLink href="/" className="text-xl font-bold tracking-tight">KEKO.</TransitionLink>
                        <div>
                            <button onClick={() => setIsMobileMenuOpen(true)} className="space-y-1.5 cursor-pointer p-2">
                                <div className="w-6 h-0.5 bg-foreground"></div>
                                <div className="w-6 h-0.5 bg-foreground"></div>
                            </button>
                        </div>
                    </header>

                    {/* Progress Indicator */}
                    <div className="flex gap-2 mb-8 z-20">
                        {/* Only show progress if not completed */}
                        {step < 5 && [1, 2, 3, 4].map((i) => (
                            <div key={i} className={`h-1 flex-1 rounded-full transition-all duration-500 ${i <= step ? "bg-primary" : "bg-neutral-200"}`} />
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

                                    <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">¿Cuántos comensales?</h2>

                                    <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mb-8">
                                        {availableDiners.map((num) => {
                                            const isDisabled = num < minDiners || num > maxDiners;
                                            return (
                                                <button
                                                    key={num}
                                                    disabled={isDisabled}
                                                    onClick={() => !isDisabled && setPartySize(num)}
                                                    className={`
                                                        aspect-square rounded-2xl flex items-center justify-center text-xl font-medium transition-all duration-300
                                                        ${isDisabled
                                                            ? "bg-neutral-100 text-neutral-300 cursor-not-allowed opacity-50"
                                                            : partySize === num
                                                                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                                                                : "bg-white border border-neutral-100 hover:border-black/20 hover:bg-neutral-50"
                                                        }
                                                    `}
                                                >
                                                    {num}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-end">
                                        <button
                                            disabled={!partySize}
                                            onClick={nextStep}
                                            className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                                        >
                                            Siguiente &rarr;
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
                                    {/* Removed redundant title 'Elige un día' */}
                                    <div className="mb-8 flex justify-center">
                                        <Calendar
                                            onSelect={(date) => setSelectedDate(date)}
                                            selectedDate={selectedDate || new Date()}
                                        />
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button onClick={prevStep} className="text-sm font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors">Volver</button>
                                        <button
                                            disabled={!selectedDate}
                                            onClick={nextStep}
                                            className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                                        >
                                            Siguiente &rarr;
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

                                    <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">Elige una hora</h2>

                                    <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-8 max-h-[300px] overflow-y-auto">
                                        {timeSlots.map((time) => {
                                            // Check if slot is past
                                            let isPast = false;
                                            if (selectedDate) {
                                                const today = new Date();
                                                const selected = new Date(selectedDate);

                                                // Only check if selected date is same as today (ignoring time)
                                                if (selected.setHours(0, 0, 0, 0) === today.setHours(0, 0, 0, 0)) {
                                                    const [h, m] = time.split(':').map(Number);
                                                    const now = new Date();
                                                    // Create date object for slot time today
                                                    const slotTime = new Date();
                                                    slotTime.setHours(h, m, 0, 0);

                                                    // If slot time is earlier than now, disable it
                                                    if (slotTime < now) isPast = true;
                                                }
                                            }

                                            return (
                                                <button
                                                    key={time}
                                                    disabled={isPast}
                                                    onClick={() => !isPast && setSelectedTime(time)}
                                                    className={`
                                                        py-6 rounded-2xl flex items-center justify-center text-xl font-medium transition-all duration-300
                                                        ${isPast
                                                            ? "bg-neutral-100 text-neutral-300 cursor-not-allowed opacity-50"
                                                            : selectedTime === time
                                                                ? "bg-primary text-primary-foreground shadow-lg scale-105"
                                                                : "bg-white border border-neutral-100 hover:border-black/20 hover:bg-neutral-50"
                                                        }
                                                    `}
                                                >
                                                    {time}
                                                </button>
                                            );
                                        })}
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button onClick={prevStep} className="text-sm font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors">Volver</button>
                                        <button
                                            disabled={!selectedTime}
                                            onClick={nextStep}
                                            className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest disabled:opacity-20 disabled:cursor-not-allowed hover:opacity-90 transition-all hover:scale-105 active:scale-95"
                                        >
                                            Siguiente &rarr;
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

                                    <h2 className="text-4xl md:text-5xl font-serif leading-tight mb-8">Completa tu reserva</h2>

                                    <div className="space-y-6 mb-8">
                                        <input
                                            type="text"
                                            placeholder="Nombre Completo"
                                            className="w-full bg-transparent border-b border-neutral-200 py-4 text-xl placeholder:text-neutral-300 focus:outline-none focus:border-black transition-all"
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        />
                                        <input
                                            type="email"
                                            placeholder="Correo Electrónico"
                                            className="w-full bg-transparent border-b border-neutral-200 py-4 text-xl placeholder:text-neutral-300 focus:outline-none focus:border-black transition-all"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        />
                                        <input
                                            type="tel"
                                            placeholder="Teléfono"
                                            className="w-full bg-transparent border-b border-neutral-200 py-4 text-xl placeholder:text-neutral-300 focus:outline-none focus:border-black transition-all"
                                            value={formData.phone}
                                            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                        />
                                    </div>

                                    <div className="bg-[#F2EFE5] p-6 rounded-2xl mb-8 border border-black/5">
                                        <p className="text-xs font-bold uppercase tracking-wider text-neutral-400 mb-2">Resumen</p>
                                        <div className="flex justify-between items-baseline mb-1">
                                            <span className="text-lg font-medium">{selectedDate?.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })} a las {selectedTime}</span>
                                            <span className="text-sm text-neutral-500">{partySize} Personas</span>
                                        </div>
                                    </div>

                                    <div className="flex justify-between items-center">
                                        <button onClick={prevStep} className="text-sm font-bold uppercase tracking-wider text-neutral-400 hover:text-black transition-colors">Volver</button>
                                        <button
                                            onClick={handleSubmit}
                                            disabled={isSubmitting}
                                            className="px-8 py-4 bg-primary text-primary-foreground rounded-full font-bold uppercase tracking-widest shadow-xl hover:shadow-2xl hover:scale-105 transition-all disabled:opacity-50"
                                        >
                                            {isSubmitting ? 'Confirmando...' : 'Confirmar Reserva'}
                                        </button>
                                    </div>
                                </motion.div>
                            )}

                            {/* STEP 5: SUCCESS */}
                            {step === 5 && (
                                <motion.div
                                    key="step5"
                                    variants={variants}
                                    initial="enter"
                                    animate="center"
                                    exit="exit"
                                    transition={{ duration: 0.4, ease: "easeOut" }}
                                    className="w-full text-center py-12"
                                >
                                    <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-8 text-4xl">
                                        ✓
                                    </div>
                                    <h2 className="text-4xl font-serif mb-4">¡Reserva Confirmada!</h2>
                                    <p className="text-neutral-500 mb-12 max-w-md mx-auto">
                                        Hemos enviado un correo de confirmación a <strong>{formData.email}</strong>.
                                        Te esperamos el {selectedDate?.toLocaleDateString('es-ES', { day: 'numeric', month: 'long' })}.
                                    </p>
                                    <button
                                        onClick={() => window.location.reload()}
                                        className="px-8 py-4 bg-black text-white rounded-full font-bold uppercase tracking-widest hover:bg-neutral-800 transition-all"
                                    >
                                        Hacer otra reserva
                                    </button>
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>

                    {/* Footer */}
                    <div className="mt-8 text-xs text-neutral-400 uppercase tracking-widest z-20">
                        Madrid &mdash; Est. 2026
                    </div>
                </div>

                {/* RIGHT COLUMN: Visuals */}
                <div className="relative rounded-[2rem] overflow-hidden bg-neutral-200 hidden md:block">
                    <div className="absolute inset-0 bg-neutral-900">
                        <AnimatePresence mode="popLayout">
                            <motion.div
                                key={singleImageMode ? 'single' : step}
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.7 }}
                                className="absolute inset-0 bg-cover bg-center"
                                style={{ backgroundImage: `url(${singleImageMode ? stepImages[1] : stepImages[step as keyof typeof stepImages]})` }}
                            />
                        </AnimatePresence>
                        <div className="absolute inset-0 bg-black/20" />
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
                                    {step === 1 && "\"La velada perfecta empieza con la compañía adecuada.\""}
                                    {step === 2 && "\"Estamos listos cuando tú lo estés.\""}
                                    {step === 3 && "\"El tiempo es el único lujo verdadero.\""}
                                    {step === 4 && "\"A un paso de una noche inolvidable.\""}
                                </p>
                                <div className="mt-2 text-xs opacity-70">&mdash; Experiencia Keko</div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>

            </div>
        </main>
    );
}
