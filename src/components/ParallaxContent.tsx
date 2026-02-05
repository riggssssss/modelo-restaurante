"use client";

import { useTransition } from "@/context/TransitionProvider";
import { ReactNode } from "react";

export default function ParallaxContent({ children }: { children: ReactNode }) {
    const { isTransitioning } = useTransition();

    return (
        <div
            className={`transition-all duration-700 ease-[cubic-bezier(0.77,0,0.175,1)] ${isTransitioning ? "animate-content-exit" : "animate-content-enter"
                }`}
        >
            {children}
        </div>
    );
}
