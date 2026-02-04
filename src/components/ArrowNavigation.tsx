"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function ArrowNavigation() {
    const pathname = usePathname();

    // Define the linear flow
    const flow = [
        { path: "/", name: "Home" },
        { path: "/about", name: "Story" },
        { path: "/menu", name: "Menu" },
        { path: "/reservations", name: "Book" },
    ];

    const currentIndex = flow.findIndex((item) => item.path === pathname);
    const prev = currentIndex > 0 ? flow[currentIndex - 1] : null;
    const next = currentIndex < flow.length - 1 ? flow[currentIndex + 1] : null;

    return (
        <>
            <div className="fixed bottom-8 left-0 right-0 z-50 flex justify-between px-8 md:px-12 pointer-events-none">

                {/* Previous Arrow */}
                <div className="pointer-events-auto">
                    {prev && (
                        <Link
                            href={prev.path}
                            className="group flex items-center gap-3 transition-all opacity-50 hover:opacity-100 hover:-translate-x-2"
                        >
                            <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center bg-[#F8F5EE] group-hover:bg-black group-hover:text-white transition-colors">
                                &larr;
                            </div>
                            <span className="hidden md:block font-serif text-sm uppercase tracking-widest font-bold">
                                {prev.name}
                            </span>
                        </Link>
                    )}
                </div>

                {/* Next Arrow */}
                <div className="pointer-events-auto">
                    {next && (
                        <Link
                            href={next.path}
                            className="group flex flex-row-reverse items-center gap-3 transition-all opacity-50 hover:opacity-100 hover:translate-x-2"
                        >
                            <div className="w-12 h-12 rounded-full border border-black flex items-center justify-center bg-[#F8F5EE] group-hover:bg-black group-hover:text-white transition-colors">
                                &rarr;
                            </div>
                            <span className="hidden md:block font-serif text-sm uppercase tracking-widest font-bold">
                                {next.name}
                            </span>
                        </Link>
                    )}
                </div>

            </div>
        </>
    );
}
