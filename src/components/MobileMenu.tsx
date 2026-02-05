"use client";

import TransitionLink from "./TransitionLink";
import { useEffect, useState } from "react";
import { getSiteContent, getContent, SiteContentMap } from "@/lib/content";

interface MobileMenuProps {
    isOpen: boolean;
    onClose: () => void;
}

export default function MobileMenu({ isOpen, onClose }: MobileMenuProps) {
    const [content, setContent] = useState<SiteContentMap>({});

    useEffect(() => {
        getSiteContent().then(setContent);
    }, []);

    const c = (key: string, fallback: string) => getContent(content, key, fallback);

    // Lock body scroll when menu is open
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
        }
    }, [isOpen]);

    return (
        <div
            className={`fixed inset-0 z-50 bg-[#F8F5EE] transition-transform duration-500 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"
                }`}
        >
            <div className="p-6 h-full flex flex-col">
                <div className="flex justify-end">
                    <button onClick={onClose} className="p-2">
                        {/* Close Icon (X) */}
                        <div className="relative w-6 h-6">
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black rotate-45 transform"></div>
                            <div className="absolute top-1/2 left-0 w-full h-0.5 bg-black -rotate-45 transform"></div>
                        </div>
                    </button>
                </div>

                <nav className="flex flex-col items-center justify-center flex-1 gap-8 text-3xl font-serif">
                    <TransitionLink
                        href="/"
                        className="hover:italic transition-all"
                        onClick={onClose}
                    >
                        Home
                    </TransitionLink>
                    <TransitionLink
                        href={c('nav_about_link', '/about')}
                        className="hover:italic transition-all"
                        onClick={onClose}
                    >
                        {c('nav_about_text', 'About')}
                    </TransitionLink>
                    <TransitionLink
                        href={c('nav_menu_link', '/menu')}
                        className="hover:italic transition-all"
                        onClick={onClose}
                    >
                        {c('nav_menu_text', 'Menu')}
                    </TransitionLink>
                    <TransitionLink
                        href={c('nav_bookings_link', '/reservations')}
                        className="hover:italic transition-all"
                        onClick={onClose}
                    >
                        {c('nav_bookings_text', 'Bookings')}
                    </TransitionLink>
                </nav>

                <div className="text-center text-xs uppercase tracking-widest opacity-50 pb-8">
                    {c('about_footer', 'Based in Madrid')}
                </div>
            </div>
        </div>
    );
}
