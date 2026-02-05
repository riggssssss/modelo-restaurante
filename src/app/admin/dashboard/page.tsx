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

                <div className="mt-12 bg-amber-50 border border-amber-200 rounded-2xl p-6">
                    <h2 className="font-bold text-amber-800 mb-2">⚠️ Setup Required</h2>
                    <p className="text-amber-700 text-sm mb-4">
                        To use this CMS, you need to create tables in your Supabase database. Run this SQL in your Supabase dashboard:
                    </p>
                    <pre className="bg-white p-4 rounded-lg text-xs overflow-x-auto border border-amber-200">
                        {`-- Site Content
CREATE TABLE site_content (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  key TEXT UNIQUE NOT NULL,
  value JSONB NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Menu Items
CREATE TABLE menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10,2),
  image_url TEXT,
  category TEXT,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Reviews
CREATE TABLE reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  author TEXT NOT NULL,
  text TEXT NOT NULL,
  rating INT CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT now()
);`}
                    </pre>
                </div>
            </main>
        </div>
    );
}
