"use client";

import { motion, AnimatePresence } from "framer-motion";
import TransitionLink from "./TransitionLink";

export default function MobileMenu({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    const menuVariants = {
        closed: {
            y: "-100%",
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1]
            }
        },
        open: {
            y: "0%",
            transition: {
                duration: 0.5,
                ease: [0.76, 0, 0.24, 1]
            }
        }
    };

    const containerVariants = {
        closed: {
            transition: {
                staggerChildren: 0.1,
                staggerDirection: -1
            }
        },
        open: {
            transition: {
                delayChildren: 0.2, // Delay for menu slide-in
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        closed: { opacity: 0, y: 20 },
        open: { opacity: 1, y: 0 }
    };

    return (
        <AnimatePresence>
            {isOpen && (
                <motion.div
                    variants={menuVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="fixed inset-0 z-[100] bg-[#1a1a1a] text-[#F8F5EE] flex flex-col"
                >
                    {/* Header */}
                    <div className="flex justify-between items-center p-6 border-b border-white/10">
                        <span className="text-xl font-bold tracking-tight">KEKO.</span>
                        <button onClick={onClose} className="p-2 -mr-2 bg-[#F8F5EE] text-black rounded-full hover:scale-105 transition-transform">
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                <line x1="18" y1="6" x2="6" y2="18"></line>
                                <line x1="6" y1="6" x2="18" y2="18"></line>
                            </svg>
                        </button>
                    </div>

                    {/* Menu Items Container */}
                    <motion.div
                        variants={containerVariants}
                        initial="closed"
                        animate="open"
                        exit="closed"
                        className="flex-grow flex flex-col px-6 py-8 gap-2 overflow-y-auto"
                    >
                        {/* Navigation Links */}
                        <div className="flex flex-col gap-6">
                            <motion.div variants={itemVariants} className="group">
                                <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block group-hover:text-[#EAB308] transition-colors">Discover</label>
                                <TransitionLink href="/about" className="text-4xl font-serif block border-b border-white/10 pb-4 group-hover:border-white/30 transition-all flex justify-between items-center">
                                    Our Story
                                    <span className="text-sm font-sans opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#EAB308]">→</span>
                                </TransitionLink>
                            </motion.div>

                            <motion.div variants={itemVariants} className="group">
                                <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block group-hover:text-[#EAB308] transition-colors">Taste</label>
                                <TransitionLink href="/menu" className="text-4xl font-serif block border-b border-white/10 pb-4 group-hover:border-white/30 transition-all flex justify-between items-center">
                                    The Menu
                                    <span className="text-sm font-sans opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#EAB308]">→</span>
                                </TransitionLink>
                            </motion.div>

                            <motion.div variants={itemVariants} className="group">
                                <label className="text-xs uppercase tracking-widest text-neutral-500 mb-2 block group-hover:text-[#EAB308] transition-colors">Experience</label>
                                <TransitionLink href="/reservations" className="text-4xl font-serif block border-b border-white/10 pb-4 group-hover:border-white/30 transition-all flex justify-between items-center">
                                    Reservations
                                    <span className="text-sm font-sans opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all text-[#EAB308]">→</span>
                                </TransitionLink>
                            </motion.div>
                        </div>
                    </motion.div>

                    {/* Footer */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1, transition: { delay: 0.5 } }}
                        className="p-6 border-t border-white/10 flex justify-between items-end"
                    >
                        <div className="flex flex-col gap-1 text-sm text-neutral-400">
                            <span className="uppercase tracking-widest text-white mb-2">Contact</span>
                            <a href="#" className="hover:text-[#EAB308] transition-colors">hello@keko.com</a>
                            <a href="#" className="hover:text-[#EAB308] transition-colors">+34 91 123 45 67</a>
                        </div>
                        <div className="text-right">
                            <a href="#" className="text-sm font-medium hover:text-[#EAB308] transition-colors flex items-center gap-2">
                                Instagram
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M7 17l9.2-9.2M17 8v9" /></svg>
                            </a>
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
