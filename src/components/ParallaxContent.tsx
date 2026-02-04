"use client";

import { useTransition } from "@/context/TransitionProvider";

export default function ParallaxContent({ children }: { children: React.ReactNode }) {
    const { transitionStage } = useTransition();

    return (
        <div className={`
      relative w-full h-full
      ${transitionStage === 'exiting' ? 'animate-content-exit' : ''}
      ${transitionStage === 'entering' ? 'animate-content-enter' : ''}
    `}>
            {children}
        </div>
    );
}
