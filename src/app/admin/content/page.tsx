'use client';

import { useState, useEffect } from 'react';
import { supabase, SiteContent } from '@/lib/supabase';
import Link from 'next/link';

// Define the content structure
interface ContentFields {
    hero_title: string;
    hero_subtitle: string;
    hero_image: string;
    about_title: string;
    about_text: string;
    about_image: string;
    contact_phone: string;
    contact_email: string;
    contact_address: string;
    opening_hours: string;
}

const defaultContent: ContentFields = {
    hero_title: 'Welcome to Keko',
    hero_subtitle: 'Critically Acclaimed Cuisine',
    hero_image: '',
    about_title: 'Our Story',
    about_text: 'Tell your story here...',
    about_image: '',
    contact_phone: '+34 600 000 000',
    contact_email: 'hello@keko.com',
    contact_address: 'Madrid, Spain',
    opening_hours: 'Tue-Sun: 13:00-23:00',
};

export default function AdminContentPage() {
    const [content, setContent] = useState<ContentFields>(defaultContent);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchContent();
    }, []);

    const fetchContent = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('site_content')
            .select('*');

        if (error) {
            console.error('Error fetching content:', error);
        } else if (data) {
            const contentMap: Partial<ContentFields> = {};
            data.forEach((item: SiteContent) => {
                if (item.key in defaultContent) {
                    contentMap[item.key as keyof ContentFields] = (item.value as { text: string }).text || '';
                }
            });
            setContent({ ...defaultContent, ...contentMap });
        }
        setLoading(false);
    };

    const handleSave = async () => {
        setSaving(true);

        // Upsert each field
        for (const [key, value] of Object.entries(content)) {
            await supabase
                .from('site_content')
                .upsert({
                    key,
                    value: { text: value },
                    updated_at: new Date().toISOString()
                }, { onConflict: 'key' });
        }

        setSaving(false);
        alert('Content saved successfully!');
    };

    const handleChange = (key: keyof ContentFields, value: string) => {
        setContent(prev => ({ ...prev, [key]: value }));
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F5EE] flex items-center justify-center">
                <div className="text-neutral-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F5EE] font-sans">
            <nav className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight">
                    KEKO. <span className="text-xs font-medium text-neutral-400 ml-1 uppercase tracking-wider">Admin</span>
                </Link>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                    {saving ? 'Saving...' : 'Save All'}
                </button>
            </nav>

            <main className="p-6 max-w-4xl mx-auto">
                <h1 className="text-3xl font-serif mb-8">Edit Site Content</h1>

                {/* Hero Section */}
                <section className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-black rounded-full"></span>
                        Hero Section
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Main Title</label>
                            <input
                                value={content.hero_title}
                                onChange={(e) => handleChange('hero_title', e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Subtitle</label>
                            <input
                                value={content.hero_subtitle}
                                onChange={(e) => handleChange('hero_subtitle', e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Hero Image URL</label>
                            <input
                                value={content.hero_image}
                                onChange={(e) => handleChange('hero_image', e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* About Section */}
                <section className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-black rounded-full"></span>
                        About Section
                    </h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Title</label>
                            <input
                                value={content.about_title}
                                onChange={(e) => handleChange('about_title', e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Text</label>
                            <textarea
                                value={content.about_text}
                                onChange={(e) => handleChange('about_text', e.target.value)}
                                rows={5}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm resize-none"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Image URL</label>
                            <input
                                value={content.about_image}
                                onChange={(e) => handleChange('about_image', e.target.value)}
                                placeholder="https://..."
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                            />
                        </div>
                    </div>
                </section>

                {/* Contact Info */}
                <section className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 bg-black rounded-full"></span>
                        Contact Information
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Phone</label>
                            <input
                                value={content.contact_phone}
                                onChange={(e) => handleChange('contact_phone', e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Email</label>
                            <input
                                value={content.contact_email}
                                onChange={(e) => handleChange('contact_email', e.target.value)}
                                type="email"
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Address</label>
                            <input
                                value={content.contact_address}
                                onChange={(e) => handleChange('contact_address', e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Opening Hours</label>
                            <input
                                value={content.opening_hours}
                                onChange={(e) => handleChange('opening_hours', e.target.value)}
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                            />
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
