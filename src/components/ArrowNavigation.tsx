"use client";

import { usePathname } from "next/navigation";
import { useTransition } from "@/context/TransitionProvider";

export default function ArrowNavigation() {
    const pathname = usePathname();
    const { startTransition } = useTransition();

    // Define the linear flow
    const flow = [
        { path: "/", name: "Home" },
        { path: "/about", name: "Story" },
        { path: "/menu", name: "Menu" },
        { path: "/reservations", name: "Bookings" },
    ];

    const currentIndex = flow.findIndex((item) => item.path === pathname);
    const prev = currentIndex > 0 ? flow[currentIndex - 1] : null;
    const next = currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;

    return (
        <>
            <div className="fixed inset-0 z-50 pointer-events-none flex justify-between">

                {/* Left Zone (Previous) */}
                <div className="pointer-events-auto h-full">
                    {prev && (
                        <button
                            onClick={() => startTransition(prev.path)}
                            className="group relative h-full w-24 md:w-40 flex items-center justify-start overflow-hidden cursor-pointer bg-transparent border-none p-0 appearance-none"
                        >
                            {/* Gradient Background - Smoother Transition */}
                            <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />

                            {/* Vertical Text Label */}
                            <div className="relative z-10 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 delay-75 transform -translate-x-4 group-hover:translate-x-0">
                                <span
                                    className="text-white font-sans text-xs font-bold uppercase tracking-[0.3em] whitespace-nowrap opacity-90"
                                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                                >
                                    {prev.name}
                                </span>
                                <span className="text-white/50 text-[10px] absolute top-1/2 left-8 -translate-y-1/2 -rotate-90 tracking-widest translate-x-1">
                                    PREV
                                </span>
                            </div>
                        </button>
                    )}
                </div>

                {/* Right Zone (Next) */}
                <div className="pointer-events-auto h-full">
                    {next && (
                        <button
                            onClick={() => startTransition(next.path)}
                            className="group relative h-full w-24 md:w-40 flex items-center justify-end overflow-hidden cursor-pointer bg-transparent border-none p-0 appearance-none"
                        >
                            {/* Gradient Background - Smoother Transition */}
                            <div className="absolute inset-0 bg-gradient-to-l from-black/60 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 ease-[cubic-bezier(0.25,0.1,0.25,1)]" />

                            {/* Vertical Text Label */}
                            <div className="relative z-10 w-full flex justify-center opacity-0 group-hover:opacity-100 transition-all duration-700 delay-75 transform translate-x-4 group-hover:translate-x-0">
                                <span className="text-white/50 text-[10px] absolute top-1/2 right-8 -translate-y-1/2 -rotate-90 tracking-widest -translate-x-1">
                                    NEXT
                                </span>
                                <span
                                    className="text-white font-sans text-xs font-bold uppercase tracking-[0.3em] whitespace-nowrap opacity-90"
                                    style={{ writingMode: 'vertical-rl', textOrientation: 'mixed', transform: 'rotate(180deg)' }}
                                >
                                    {next.name}
                                </span>
                            </div>
                        </button>
                    )}
                </div>

            </div>
        </>
    );
}
