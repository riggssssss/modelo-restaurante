"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";

interface TransitionContextType {
    navigate: (href: string) => void;
    transitionStage: 'idle' | 'exiting' | 'entering';
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export const useTransition = () => {
    const context = useContext(TransitionContext);
    if (!context) throw new Error("useTransition must be used within a TransitionProvider");
    return context;
};

export default function TransitionProvider({ children }: { children: React.ReactNode }) {
    const router = useRouter();
    const pathname = usePathname();
    // State: 'idle', 'exiting', 'entering'
    const [transitionStage, setTransitionStage] = useState<'idle' | 'exiting' | 'entering'>('entering');

    // Trigger Exit Animation then Push
    const navigate = (href: string) => {
        if (href === pathname) return;
        setTransitionStage('exiting');

        // Wait for animation (800ms) matches CSS
        setTimeout(() => {
            router.push(href);
        }, 800);
    };

    // Reset to entering when pathname changes
    useEffect(() => {
        // When path changes, we are on the new page.
        setTransitionStage('entering');
        // After enter animation, go idle
        const timer = setTimeout(() => {
            setTransitionStage('idle');
        }, 800); // Wait for enter animation
        return () => clearTimeout(timer);
    }, [pathname]);

    return (
        <TransitionContext.Provider value={{ navigate, transitionStage }}>
            {/* The Curtain UI - Always present in DOM but hidden to prevent hydration mismatch */}
            {transitionStage !== 'idle' && (
                <div
                    className={`fixed inset-0 z-[100] bg-[#1c1917] pointer-events-none ${transitionStage === 'exiting' ? 'animate-curtain-cover' : 'animate-curtain-reveal'
                        }`}
                />
            )}

            {children}
        </TransitionContext.Provider>
    );
}
