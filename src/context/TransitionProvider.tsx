"use client";

import { createContext, useContext, useState, ReactNode } from "react";
import { useRouter } from "next/navigation";

interface TransitionContextType {
    startTransition: (href: string) => Promise<void>;
    isTransitioning: boolean;
}

const TransitionContext = createContext<TransitionContextType | null>(null);

export const useTransition = () => {
    const context = useContext(TransitionContext);
    if (!context) {
        throw new Error("useTransition must be used within a TransitionProvider");
    }
    return context;
};

export default function TransitionProvider({
    children,
}: {
    children: ReactNode;
}) {
    const router = useRouter();
    const [isTransitioning, setIsTransitioning] = useState(false);

    const startTransition = async (href: string) => {
        setIsTransitioning(true);
        // Wait for exit animation (matches CSS duration roughly)
        await new Promise((resolve) => setTimeout(resolve, 800));

        router.push(href);

        // Wait for enter animation reset
        await new Promise((resolve) => setTimeout(resolve, 800));
        setIsTransitioning(false);
    };

    return (
        <TransitionContext.Provider value={{ startTransition, isTransitioning }}>
            {/* Curtain Layer */}
            {isTransitioning && (
                <div className="fixed inset-0 z-[9999] pointer-events-none flex flex-col">
                    {/* You can add curtain elements here if needed, or rely on ParallaxContent */}
                    {/* For now, we rely on the children dealing with the state or a global overlay */}
                    <div className="absolute inset-0 bg-[#EEDD4A] animate-curtain-cover origin-left" />
                </div>
            )}
            {children}
        </TransitionContext.Provider>
    );
}
