"use client";

import { useState, useEffect } from "react";
import TransitionLink from "@/components/TransitionLink";
import MobileMenu from "@/components/MobileMenu";
import { getSiteContent, getContent, SiteContentMap } from "@/lib/content";
import { supabase, MenuItem, MenuCategory } from "@/lib/supabase";

export default function MenuPage() {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [content, setContent] = useState<SiteContentMap>({});
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        getSiteContent().then(setContent);
        fetchMenuData();
    }, []);

    const fetchMenuData = async () => {
        const { data: catData } = await supabase
            .from('menu_categories')
            .select('*')
            .order('sort_order', { ascending: true });

        const { data: itemData } = await supabase
            .from('menu_items')
            .select('*')
            .order('sort_order', { ascending: true });

        setCategories(catData || []);
        setItems(itemData || []);
        setLoading(false);
    };

    const c = (key: string, fallback: string) => getContent(content, key, fallback);

    // Group items by category
    const groupedItems = categories.map(cat => ({
        category: cat,
        items: items.filter(item => item.category === cat.name)
    })).filter(group => group.items.length > 0);

    // Check if we have any items from database
    const hasDbItems = items.length > 0;

    // Fallback static menu for when database is empty
    const staticMenu = [
        {
            title: "Starters",
            items: [
                { name: "Burrata & Heritage Tomato", price: "18", desc: "Basil oil, pine nuts, balsamic glaze" },
                { name: "Scallop Carpaccio", price: "24", desc: "Yuzu dressing, radish, coriander cress" },
                { name: "Beef Tartare", price: "22", desc: "Smoked egg yolk, capers, sourdough crisp" }
            ]
        },
        {
            title: "Mains",
            items: [
                { name: "Wild Mushroom Risotto", price: "28", desc: "Truffle oil, parmesan crisp, thyme" },
                { name: "Pan-Seared Seabass", price: "34", desc: "Cauliflower purée, samphire, lemon butter" },
                { name: "Iberico Pork Presa", price: "38", desc: "Apple chutney, cider jus, charred leeks" },
                { name: "Roast Duck Breast", price: "36", desc: "Blackberry jus, celeriac fondant, kale" }
            ]
        },
        {
            title: "Desserts",
            items: [
                { name: "Dark Chocolate Tart", price: "12", desc: "Sea salt, crème fraîche, honeycomb" },
                { name: "Basque Burnt Cheesecake", price: "14", desc: "Fig jam, walnut crumble" },
                { name: "Poached Pear", price: "12", desc: "Saffron syrup, vanilla bean ice cream" }
            ]
        }
    ];

    return (
        <main className="min-h-screen bg-[#F8F5EE] font-sans">
            <MobileMenu isOpen={isMobileMenuOpen} onClose={() => setIsMobileMenuOpen(false)} />

            {/* Hero Header */}
            <div className="relative h-[40vh] md:h-[50vh] flex items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-neutral-900">
                    <div
                        className="w-full h-full opacity-60 bg-cover bg-center"
                        style={{ backgroundImage: `url('${c('menu_hero_image', 'https://images.unsplash.com/photo-1544025162-d7669d26d391?q=80&w=2600&auto=format&fit=crop')}')` }}
                    ></div>
                </div>

                {/* Navbar */}
                <header className="absolute top-0 left-0 w-full p-4 md:p-8 flex justify-between items-center z-50 text-white">
                    <TransitionLink href="/" className="text-xl font-bold tracking-tight">
                        {c('global_brand_name', 'KEKO.')}
                    </TransitionLink>
                    <nav className="hidden md:flex gap-6 text-sm font-medium uppercase tracking-wider opacity-90">
                        <TransitionLink href={c('nav_about_link', '/about')} className="hover:opacity-100">{c('nav_about_text', 'About')}</TransitionLink>
                        <TransitionLink href={c('nav_menu_link', '/menu')} className="hover:opacity-100 opacity-100 underline decoration-2 underline-offset-4">{c('nav_menu_text', 'Menu')}</TransitionLink>
                        <TransitionLink href={c('nav_bookings_link', '/reservations')} className="hover:opacity-100">{c('nav_bookings_text', 'Bookings')}</TransitionLink>
                    </nav>
                    <div className="md:hidden">
                        <button
                            onClick={() => setIsMobileMenuOpen(true)}
                            className="space-y-1.5 cursor-pointer p-2"
                        >
                            <div className="w-6 h-0.5 bg-white"></div>
                            <div className="w-6 h-0.5 bg-white"></div>
                        </button>
                    </div>
                </header>

                <div className="relative z-10 text-center text-white p-4">
                    <span className="inline-block border border-white/30 bg-black/20 backdrop-blur-md px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6">
                        {c('menu_badge', 'Seasonal Menu • Winter 2026')}
                    </span>
                    <h1 className="text-6xl md:text-9xl font-serif leading-none tracking-tight">
                        {c('menu_title', 'The Menu')}
                    </h1>
                </div>
            </div>

            <div className="max-w-5xl mx-auto px-6 md:px-12 py-24">

                {/* Intro */}
                <p className="max-w-xl mx-auto text-xl text-center text-neutral-600 mb-24 font-serif italic">
                    {c('menu_intro', '"Our menu changes daily based on what the earth provides. We work closely with local farmers to bring the best of Madrid to your plate."')}
                </p>

                {loading ? (
                    <div className="text-center py-12 text-neutral-400">Cargando menú...</div>
                ) : (
                    <section className="space-y-32">
                        {/* Dynamic menu from database */}
                        {hasDbItems ? (
                            groupedItems.map(({ category, items: catItems }, groupIndex) => (
                                <div key={category.id} className={`grid md:grid-cols-[${groupIndex % 2 === 0 ? '1fr_300px' : '300px_1fr'}] gap-12 items-start`}>
                                    <div className={groupIndex % 2 === 1 ? 'order-1 md:order-2' : ''}>
                                        <h2 className="text-4xl font-serif mb-12 flex items-center gap-4">
                                            {groupIndex % 2 === 1 && <span className="h-px bg-black/10 flex-grow"></span>}
                                            {category.name}
                                            {groupIndex % 2 === 0 && <span className="h-px bg-black/10 flex-grow"></span>}
                                        </h2>
                                        <div className="space-y-12">
                                            {catItems.map((item) => (
                                                <div key={item.id} className="group relative pl-4 border-l-2 border-transparent hover:border-[#EAB308] transition-all cursor-default">
                                                    <div className="flex justify-between items-baseline mb-2">
                                                        <h3 className="text-2xl font-bold">{item.name}</h3>
                                                        {item.price && <span className="text-xl font-mono text-neutral-400">{item.price}</span>}
                                                    </div>
                                                    <p className="text-neutral-500">{item.description}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                            /* Static fallback menu */
                            staticMenu.map((section, sectionIndex) => (
                                <div key={section.title} className={`grid md:grid-cols-[${sectionIndex % 2 === 0 ? '1fr_300px' : '300px_1fr'}] gap-12 items-start`}>
                                    {sectionIndex % 2 === 1 && (
                                        <div className="hidden md:block sticky top-24 order-2 md:order-1">
                                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-200">
                                                <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1546241072-48010ad2862c?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center"></div>
                                            </div>
                                            <p className="text-xs text-center mt-3 text-neutral-400 uppercase tracking-widest">Locally Sourced</p>
                                        </div>
                                    )}

                                    <div className={sectionIndex % 2 === 1 ? 'order-1 md:order-2' : ''}>
                                        <h2 className="text-4xl font-serif mb-12 flex items-center gap-4">
                                            {sectionIndex % 2 === 1 && <span className="h-px bg-black/10 flex-grow"></span>}
                                            {section.title}
                                            {sectionIndex % 2 === 0 && <span className="h-px bg-black/10 flex-grow"></span>}
                                        </h2>
                                        <div className="space-y-12">
                                            {section.items.map((item, i) => (
                                                <div key={i} className="group relative pl-4 border-l-2 border-transparent hover:border-[#EAB308] transition-all cursor-default">
                                                    <div className="flex justify-between items-baseline mb-2">
                                                        <h3 className="text-2xl font-bold">{item.name}</h3>
                                                        <span className="text-xl font-mono text-neutral-400">{item.price}</span>
                                                    </div>
                                                    <p className="text-neutral-500">{item.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {sectionIndex % 2 === 0 && (
                                        <div className="hidden md:block sticky top-24">
                                            <div className="aspect-[3/4] rounded-2xl overflow-hidden bg-neutral-200">
                                                <div className={`w-full h-full bg-[url('https://images.unsplash.com/photo-${sectionIndex === 0 ? '1626804475297-411db7044238' : '1511914678378-2906b1f69dcf'}?q=80&w=2000&auto=format&fit=crop')] bg-cover bg-center`}></div>
                                            </div>
                                            <p className="text-xs text-center mt-3 text-neutral-400 uppercase tracking-widest">
                                                {sectionIndex === 0 ? 'Plated by Chef Garcia' : 'Sweet Ending'}
                                            </p>
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </section>
                )}

                <div className="mt-32 text-center pb-20 border-t border-black/5 pt-20">
                    <h3 className="text-3xl font-serif mb-8">{c('menu_cta_title', 'Ready to taste?')}</h3>
                    <TransitionLink href="/reservations" className="px-10 py-5 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-all inline-block shadow-xl hover:shadow-2xl hover:-translate-y-1">
                        {c('menu_cta_button', 'Book a Table')}
                    </TransitionLink>
                </div>
            </div>
        </main>
    );
}
