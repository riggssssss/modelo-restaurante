"use client";

import { useState } from "react";
import TransitionLink from "./TransitionLink";

export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[90] bg-[#F8F5EE] flex flex-col items-center justify-center animate-fade-in">
            {/* Close Button */}
            <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2"
            >
                <div className="w-8 h-8 flex flex-col justify-center items-center relative">
                    <span className="absolute w-full h-0.5 bg-black rotate-45"></span>
                    <span className="absolute w-full h-0.5 bg-black -rotate-45"></span>
                </div>
            </button>

            {/* Links */}
            <nav className="flex flex-col gap-8 text-center">
                <TransitionLink href="/about" className="text-4xl font-serif text-black hover:text-[#EAB308] transition-colors">
                    Our Story
                </TransitionLink>
                <TransitionLink href="/menu" className="text-4xl font-serif text-black hover:text-[#EAB308] transition-colors">
                    The Menu
                </TransitionLink>
                <TransitionLink href="/reservations" className="text-4xl font-serif text-black hover:text-[#EAB308] transition-colors">
                    Reservations
                </TransitionLink>
            </nav>

            <div className="absolute bottom-12 text-xs uppercase tracking-widest text-neutral-400">
                Based in Madrid
            </div>
        </div>
    );
}
