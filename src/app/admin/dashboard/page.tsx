'use client';

import { logout } from '@/app/actions/auth';

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-[#F8F5EE] font-sans">
            <nav className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <span className="text-xl font-bold tracking-tight">KEKO. <span className="text-xs font-medium text-neutral-400 ml-1 uppercase tracking-wider">Admin</span></span>
                <button
                    onClick={() => logout()}
                    className="text-xs font-bold uppercase tracking-wider hover:text-red-600 transition-colors"
                >
                    Log Out
                </button>
            </nav>

            <main className="p-6 max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif mb-2">Dashboard</h1>
                    <p className="text-neutral-500">Welcome back. Manage your restaurant from here.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Placeholder Stat Cards */}
                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                        <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">Today's Reservations</h3>
                        <p className="text-4xl font-serif">12</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                        <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">Pending Requests</h3>
                        <p className="text-4xl font-serif">3</p>
                    </div>

                    <div className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm">
                        <h3 className="text-xs uppercase tracking-wider text-neutral-400 font-bold mb-2">Special Events</h3>
                        <p className="text-4xl font-serif">1</p>
                    </div>
                </div>

                {/* Placeholder Content Area */}
                <div className="mt-8 bg-white rounded-2xl border border-neutral-100 shadow-sm min-h-[400px] flex items-center justify-center text-neutral-300">
                    Content Area (Calendar / Tables)
                </div>
            </main>
        </div>
    );
}
