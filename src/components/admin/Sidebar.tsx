"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const menuItems = [
    {
        name: "Overview", href: "/admin/dashboard", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" /><polyline points="9 22 9 12 15 12 15 22" /></svg>
        )
    },
    {
        name: "Schedule", href: "/admin/bookings", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="18" height="18" x="3" y="4" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" /></svg>
        )
    },
    {
        name: "Menu Management", href: "/admin/menu", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 2v7c0 1.1.9 2 2 2h4a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2v0a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3a2 2 0 0 0 2-2z" /></svg>
        )
    },
    {
        name: "Content Editor", href: "/admin/content", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" /><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" /></svg>
        )
    },
    {
        name: "Tables (Mesas)", href: "/admin/tables", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M4 14h16c1.1 0 2-.9 2-2V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v6c0 1.1.9 2 2 2Z" /><path d="M4 14v6" /><path d="M20 14v6" /><path d="M4 18h16" /></svg>
        )
    },
    {
        name: "Settings", href: "/admin/settings", icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.38a2 2 0 0 0-.73-2.73l-.15-.1a2 2 0 0 1-1-1.72v-.51a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" /><circle cx="12" cy="12" r="3" /></svg>
        )
    },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="sticky top-0 h-screen w-64 bg-[#F2F4F7] p-6 flex flex-col justify-between z-40 border-r border-white/50 shrink-0 overflow-y-auto custom-scrollbar">
            <div>
                {/* Logo Area */}
                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-8 h-8 bg-black rounded-lg flex items-center justify-center text-white font-serif font-bold text-sm">
                        K.
                    </div>
                    <span className="font-bold text-lg tracking-tight">Keko Admin</span>
                </div>

                {/* Navigation */}
                <nav className="space-y-1">
                    <div className="px-3 mb-2 text-xs font-bold text-neutral-400 uppercase tracking-wider">Main menu</div>
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                                    flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all
                                    ${isActive
                                        ? "bg-white text-black"
                                        : "text-neutral-500 hover:text-black hover:bg-white/50"
                                    }
                                `}
                            >
                                {item.icon}
                                {item.name}
                            </Link>
                        );
                    })}
                </nav>
            </div>

            {/* User Account / Footer */}
            <div className="px-2 mt-auto">
                <div className="bg-white p-3 rounded-xl flex items-center gap-3 border border-neutral-100">
                    <div className="w-8 h-8 bg-neutral-100 rounded-full flex items-center justify-center text-neutral-500 text-xs font-bold">
                        AD
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="text-sm font-bold truncate">Admin User</div>
                        <div className="text-xs text-neutral-400 truncate">admin@keko.com</div>
                    </div>
                </div>
            </div>
        </aside>
    );
}
