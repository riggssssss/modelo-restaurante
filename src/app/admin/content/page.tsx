'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';

// Define all content fields organized by page
const contentSchema = {
    home: {
        label: 'Home',
        sections: [
            {
                title: 'Hero Section',
                fields: [
                    { key: 'home_badge', label: 'Badge', type: 'text', placeholder: 'New Opening 2026' },
                    { key: 'home_title', label: 'Title', type: 'textarea', placeholder: 'Hora de comer' },
                    { key: 'home_subtitle', label: 'Subtitle', type: 'textarea', placeholder: 'Don\'t just take our word for it...' },
                ]
            },
            {
                title: 'Call to Action Buttons',
                fields: [
                    { key: 'home_cta_1', label: 'Button 1 Text', type: 'text', placeholder: 'Reserve Table' },
                    { key: 'home_cta_2', label: 'Button 2 Text', type: 'text', placeholder: 'View Menu' },
                ]
            },
            {
                title: 'Quote Card',
                fields: [
                    { key: 'home_quote', label: 'Quote', type: 'text', placeholder: '"The best dining experience..."' },
                    { key: 'home_quote_author', label: 'Author', type: 'text', placeholder: 'The Food Guide' },
                ]
            },
            {
                title: 'Images',
                fields: [
                    { key: 'home_hero_image', label: 'Hero Image URL', type: 'image', placeholder: 'https://images.unsplash.com/...' },
                ]
            },
            {
                title: 'Footer',
                fields: [
                    { key: 'home_footer', label: 'Footer Text', type: 'text', placeholder: 'Based in Madrid — Est. 2026' },
                ]
            }
        ]
    },
    about: {
        label: 'About',
        sections: [
            {
                title: 'Hero Section',
                fields: [
                    { key: 'about_badge', label: 'Badge', type: 'text', placeholder: 'Our Story' },
                    { key: 'about_title', label: 'Title', type: 'textarea', placeholder: 'Born from a love of tradition...' },
                ]
            },
            {
                title: 'Story Paragraphs',
                fields: [
                    { key: 'about_p1', label: 'Paragraph 1', type: 'textarea', placeholder: 'Keko started as a dream...' },
                    { key: 'about_p2', label: 'Paragraph 2', type: 'textarea', placeholder: 'Our philosophy is simple...' },
                    { key: 'about_p3', label: 'Paragraph 3', type: 'textarea', placeholder: 'Whether you are here for...' },
                ]
            },
            {
                title: 'Chef Section',
                fields: [
                    { key: 'about_chef_name', label: 'Chef Name', type: 'text', placeholder: 'Chef Adrian Garcia' },
                    { key: 'about_chef_signature', label: 'Signature Image URL', type: 'image', placeholder: 'https://...' },
                ]
            },
            {
                title: 'Images',
                fields: [
                    { key: 'about_image_main', label: 'Main Image URL', type: 'image', placeholder: 'https://images.unsplash.com/...' },
                    { key: 'about_image_secondary', label: 'Secondary Image URL', type: 'image', placeholder: 'https://images.unsplash.com/...' },
                    { key: 'about_image_quote', label: 'Quote on Image', type: 'text', placeholder: '"Every dish tells a story..."' },
                ]
            },
            {
                title: 'Footer',
                fields: [
                    { key: 'about_footer', label: 'Footer Text', type: 'text', placeholder: 'Based in Madrid — Est. 2026' },
                ]
            }
        ]
    },
    menu: {
        label: 'Menu',
        sections: [
            {
                title: 'Hero Section',
                fields: [
                    { key: 'menu_badge', label: 'Badge', type: 'text', placeholder: 'Seasonal Menu • Winter 2026' },
                    { key: 'menu_title', label: 'Title', type: 'text', placeholder: 'The Menu' },
                    { key: 'menu_hero_image', label: 'Hero Image URL', type: 'image', placeholder: 'https://images.unsplash.com/...' },
                ]
            },
            {
                title: 'Introduction',
                fields: [
                    { key: 'menu_intro', label: 'Intro Quote', type: 'textarea', placeholder: '"Our menu changes daily..."' },
                ]
            },
            {
                title: 'Section Images',
                fields: [
                    { key: 'menu_image_starters', label: 'Starters Section Image', type: 'image', placeholder: 'https://...' },
                    { key: 'menu_image_mains', label: 'Mains Section Image', type: 'image', placeholder: 'https://...' },
                    { key: 'menu_image_desserts', label: 'Desserts Section Image', type: 'image', placeholder: 'https://...' },
                ]
            },
            {
                title: 'Call to Action',
                fields: [
                    { key: 'menu_cta_title', label: 'CTA Title', type: 'text', placeholder: 'Ready to taste?' },
                    { key: 'menu_cta_button', label: 'Button Text', type: 'text', placeholder: 'Book a Table' },
                ]
            }
        ]
    },
    global: {
        label: 'Global',
        sections: [
            {
                title: 'Brand',
                fields: [
                    { key: 'global_brand_name', label: 'Brand Name', type: 'text', placeholder: 'KEKO.' },
                    { key: 'global_logo', label: 'Logo URL (optional)', type: 'image', placeholder: 'https://...' },
                ]
            },
            {
                title: 'Navbar - Page Names',
                fields: [
                    { key: 'nav_about_text', label: 'About Page Name', type: 'text', placeholder: 'About' },
                    { key: 'nav_menu_text', label: 'Menu Page Name', type: 'text', placeholder: 'Menu' },
                    { key: 'nav_bookings_text', label: 'Bookings Page Name', type: 'text', placeholder: 'Bookings' },
                ]
            },
            {
                title: 'Navbar - Links',
                fields: [
                    { key: 'nav_about_link', label: 'About Link', type: 'text', placeholder: '/about' },
                    { key: 'nav_menu_link', label: 'Menu Link', type: 'text', placeholder: '/menu' },
                    { key: 'nav_bookings_link', label: 'Bookings Link', type: 'text', placeholder: '/reservations' },
                ]
            },
            {
                title: 'Contact',
                fields: [
                    { key: 'global_phone', label: 'Phone', type: 'text', placeholder: '+34 600 000 000' },
                    { key: 'global_email', label: 'Email', type: 'text', placeholder: 'hello@keko.com' },
                    { key: 'global_address', label: 'Address', type: 'text', placeholder: 'Madrid, Spain' },
                ]
            }
        ]
    }
};

type ContentValues = Record<string, string>;

export default function AdminContentPage() {
    const [activeTab, setActiveTab] = useState<'home' | 'about' | 'menu' | 'global'>('home');
    const [content, setContent] = useState<ContentValues>({});
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
            const contentMap: ContentValues = {};
            data.forEach((item: { key: string; value: { text?: string } }) => {
                contentMap[item.key] = item.value?.text || '';
            });
            setContent(contentMap);
        }
        setLoading(false);
    };

    const handleChange = (key: string, value: string) => {
        setContent(prev => ({ ...prev, [key]: value }));
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
        alert('¡Contenido guardado!');
    };

    const tabs = Object.entries(contentSchema) as [keyof typeof contentSchema, typeof contentSchema.home][];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F5EE] flex items-center justify-center">
                <div className="text-neutral-400">Loading...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F8F5EE] font-sans">
            {/* Header */}
            <nav className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight">
                    KEKO. <span className="text-xs font-medium text-neutral-400 ml-1 uppercase tracking-wider">Admin</span>
                </Link>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-black text-white px-6 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                >
                    {saving ? 'Guardando...' : 'Guardar Todo'}
                </button>
            </nav>

            <main className="max-w-4xl mx-auto p-6">
                <h1 className="text-3xl font-serif mb-2">Editar Contenido</h1>
                <p className="text-neutral-500 mb-8">Modifica los textos e imágenes de cada página.</p>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-neutral-200 pb-4">
                    {tabs.map(([key, page]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === key
                                ? 'bg-black text-white'
                                : 'bg-white border border-neutral-200 hover:border-black/30'
                                }`}
                        >
                            {page.label}
                        </button>
                    ))}
                </div>

                {/* Content Sections */}
                <div className="space-y-6">
                    {contentSchema[activeTab].sections.map((section, sectionIndex) => (
                        <div key={sectionIndex} className="bg-white rounded-2xl border border-neutral-100 p-6">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${section.title.includes('Image') ? 'bg-blue-500' : 'bg-black'}`}></span>
                                {section.title}
                                {section.title.includes('Image') && (
                                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-0.5 rounded-full font-medium ml-2">📷</span>
                                )}
                            </h2>
                            <div className="space-y-4">
                                {section.fields.map((field) => (
                                    <div key={field.key}>
                                        <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                                            {field.label}
                                        </label>
                                        {field.type === 'textarea' ? (
                                            <textarea
                                                value={content[field.key] || ''}
                                                onChange={(e) => handleChange(field.key, e.target.value)}
                                                placeholder={field.placeholder}
                                                rows={3}
                                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                            />
                                        ) : field.type === 'image' ? (
                                            <div className="space-y-2">
                                                <input
                                                    type="url"
                                                    value={content[field.key] || ''}
                                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                                    placeholder={field.placeholder}
                                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                                />
                                                {content[field.key] && (
                                                    <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200">
                                                        <img
                                                            src={content[field.key]}
                                                            alt="Preview"
                                                            className="w-full h-full object-cover"
                                                            onError={(e) => {
                                                                (e.target as HTMLImageElement).style.display = 'none';
                                                            }}
                                                        />
                                                    </div>
                                                )}
                                            </div>
                                        ) : (
                                            <input
                                                type="text"
                                                value={content[field.key] || ''}
                                                onChange={(e) => handleChange(field.key, e.target.value)}
                                                placeholder={field.placeholder}
                                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                            />
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Save Button */}
                <div className="mt-8 text-center">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black text-white px-10 py-4 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Guardando...' : 'Guardar Todos los Cambios'}
                    </button>
                </div>
            </main>
        </div>
    );
}
