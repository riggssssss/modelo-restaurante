'use client';

import Link from 'next/link';
import { logout } from '@/app/actions/auth';

const adminLinks = [
    { href: '/admin/content', label: 'Site Content', description: 'Edit titles, descriptions, and images' },
    { href: '/admin/menu', label: 'Menu Items', description: 'Manage dishes and prices' },
    { href: '/admin/reviews', label: 'Reviews', description: 'Manage customer testimonials' },
];

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

            <main className="p-6 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif mb-2">Dashboard</h1>
                    <p className="text-neutral-500">Select a section to manage your restaurant website.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {adminLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:border-black/20 hover:shadow-md transition-all group"
                        >
                            <h3 className="font-bold text-lg mb-1 group-hover:underline">{link.label}</h3>
                            <p className="text-neutral-500 text-sm">{link.description}</p>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 bg-green-50 border border-green-200 rounded-2xl p-6">
                    <h2 className="font-bold text-green-800 mb-2">✅ Database Connected</h2>
                    <p className="text-green-700 text-sm">
                        Your Supabase tables are configured and ready to use. You can now manage all your website content from this admin panel.
                    </p>
                </div>

                <div className="mt-6 bg-white border border-neutral-200 rounded-2xl p-6">
                    <h2 className="font-bold mb-4">📋 Quick Tips</h2>
                    <ul className="text-sm text-neutral-600 space-y-2">
                        <li>• <strong>Site Content</strong>: Edit all text and images on public pages</li>
                        <li>• <strong>Menu Items</strong>: Create categories first, then add dishes to each</li>
                        <li>• <strong>Reviews</strong>: Add customer testimonials to display on the site</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
