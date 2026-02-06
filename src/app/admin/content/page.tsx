'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import ImageLibrary from '@/components/admin/ImageLibraryMiddleware';
import { revalidateContent } from '@/app/actions/content';

// Define all content fields organized by page
const contentSchema = {
    home: {
        label: 'Inicio',
        sections: [
            {
                title: 'Sección Principal',
                fields: [
                    { key: 'home_badge', label: 'Etiqueta', type: 'text', placeholder: 'Apertura 2026' },
                    { key: 'home_title', label: 'Título', type: 'textarea', placeholder: 'Hora de comer' },
                    { key: 'home_subtitle', label: 'Subtítulo', type: 'textarea', placeholder: 'No te fíes solo de nuestra palabra...' },
                ]
            },
            {
                title: 'Botones',
                fields: [
                    { key: 'home_cta_1', label: 'Botón 1', type: 'text', placeholder: 'Reservar Mesa' },
                    { key: 'home_cta_2', label: 'Botón 2', type: 'text', placeholder: 'Ver Carta' },
                ]
            },
            {
                title: 'Tarjeta de Cita',
                fields: [
                    { key: 'home_quote', label: 'Cita', type: 'text', placeholder: '"La mejor experiencia..."' },
                    { key: 'home_quote_author', label: 'Autor', type: 'text', placeholder: 'Guía Gastronómica' },
                ]
            },
            {
                title: 'Imágenes',
                fields: [
                    { key: 'home_hero_image', label: 'Imagen Principal', type: 'image', placeholder: 'https://images.unsplash.com/...' },
                ]
            },
            {
                title: 'Pie de Página',
                fields: [
                    { key: 'home_footer', label: 'Texto Pie de Página', type: 'text', placeholder: 'Madrid — Est. 2026' },
                ]
            }
        ]
    },
    about: {
        label: 'Nosotros',
        sections: [
            {
                title: 'Sección Principal',
                fields: [
                    { key: 'about_badge', label: 'Etiqueta', type: 'text', placeholder: 'Nuestra Historia' },
                    { key: 'about_title', label: 'Título', type: 'textarea', placeholder: 'Nacido del amor...' },
                ]
            },
            {
                title: 'Historia',
                fields: [
                    { key: 'about_p1', label: 'Párrafo 1', type: 'textarea', placeholder: 'Keko empezó como...' },
                    { key: 'about_p2', label: 'Párrafo 2', type: 'textarea', placeholder: 'Nuestra filosofía...' },
                    { key: 'about_p3', label: 'Párrafo 3', type: 'textarea', placeholder: 'Ya vengas para...' },
                ]
            },
            {
                title: 'Sección Chef',
                fields: [
                    { key: 'about_chef_name', label: 'Nombre Chef', type: 'text', placeholder: 'Chef Adrian Garcia' },
                    { key: 'about_chef_signature', label: 'Firma (Imagen)', type: 'image', placeholder: 'https://...' },
                ]
            },
            {
                title: 'Imágenes',
                fields: [
                    { key: 'about_image_main', label: 'Imagen Principal', type: 'image', placeholder: 'https://images.unsplash.com/...' },
                    { key: 'about_image_secondary', label: 'Imagen Secundaria', type: 'image', placeholder: 'https://images.unsplash.com/...' },
                    { key: 'about_image_quote', label: 'Cita en Imagen', type: 'text', placeholder: '"Cada plato cuenta..."' },
                ]
            },
            {
                title: 'Pie de Página',
                fields: [
                    { key: 'about_footer', label: 'Texto Pie de Página', type: 'text', placeholder: 'Madrid — Est. 2026' },
                ]
            }
        ]
    },
    menu: {
        label: 'Menú',
        sections: [
            {
                title: 'Sección Principal',
                fields: [
                    { key: 'menu_badge', label: 'Etiqueta', type: 'text', placeholder: 'Menú de Temporada' },
                    { key: 'menu_title', label: 'Título', type: 'text', placeholder: 'La Carta' },
                    { key: 'menu_hero_image', label: 'Imagen Principal', type: 'image', placeholder: 'https://images.unsplash.com/...' },
                ]
            },
            {
                title: 'Introducción',
                fields: [
                    { key: 'menu_intro', label: 'Cita Intro', type: 'textarea', placeholder: '"Nuestro menú cambia..."' },
                ]
            },
            {
                title: 'Imágenes de Sección',
                fields: [
                    { key: 'menu_image_starters', label: 'Img. Entrantes', type: 'image', placeholder: 'https://...' },
                    { key: 'menu_image_mains', label: 'Img. Principales', type: 'image', placeholder: 'https://...' },
                    { key: 'menu_image_desserts', label: 'Img. Postres', type: 'image', placeholder: 'https://...' },
                ]
            },
            {
                title: 'Llamada a la Acción',
                fields: [
                    { key: 'menu_cta_title', label: 'Título CTA', type: 'text', placeholder: '¿Listo para probar?' },
                    { key: 'menu_cta_button', label: 'Botón CTA', type: 'text', placeholder: 'Reservar Mesa' },
                ]
            }
        ]
    },
    global: {
        label: 'Global',
        sections: [
            {
                title: 'Marca',
                fields: [
                    { key: 'global_brand_name', label: 'Nombre Marca', type: 'text', placeholder: 'KEKO.' },
                    { key: 'global_logo', label: 'Logo URL (opcional)', type: 'image', placeholder: 'https://...' },
                ]
            },
            {
                title: 'Navbar - Nombres',
                fields: [
                    { key: 'nav_about_text', label: 'Texto Nosotros', type: 'text', placeholder: 'Nosotros' },
                    { key: 'nav_menu_text', label: 'Texto Carta', type: 'text', placeholder: 'Carta' },
                    { key: 'nav_bookings_text', label: 'Texto Reservas', type: 'text', placeholder: 'Reservas' },
                ]
            },
            {
                title: 'Navbar - Enlaces',
                fields: [
                    { key: 'nav_about_link', label: 'Enlace Nosotros', type: 'text', placeholder: '/about' },
                    { key: 'nav_menu_link', label: 'Enlace Carta', type: 'text', placeholder: '/menu' },
                    { key: 'nav_bookings_link', label: 'Enlace Reservas', type: 'text', placeholder: '/reservations' },
                ]
            },
            {
                title: 'Contacto',
                fields: [
                    { key: 'global_phone', label: 'Teléfono', type: 'text', placeholder: '+34 600 000 000' },
                    { key: 'global_email', label: 'Email', type: 'text', placeholder: 'hola@keko.com' },
                    { key: 'global_address', label: 'Dirección', type: 'text', placeholder: 'Madrid, España' },
                ]
            }
        ]
    },

    reservations: {
        label: 'Reservas',
        sections: [
            {
                title: 'Configuración',
                fields: [
                    { key: 'res_min_diners', label: 'Mínimo Comensales', type: 'text', placeholder: '1' },
                    { key: 'res_max_diners', label: 'Máximo Comensales', type: 'text', placeholder: '8' },
                    { key: 'res_lunch_start', label: 'Mediodía Inicio (HH:MM)', type: 'text', placeholder: '13:00' },
                    { key: 'res_lunch_end', label: 'Mediodía Fin (HH:MM)', type: 'text', placeholder: '16:00' },
                    { key: 'res_dinner_start', label: 'Noche Inicio (HH:MM)', type: 'text', placeholder: '20:00' },
                    { key: 'res_dinner_end', label: 'Noche Fin (HH:MM)', type: 'text', placeholder: '23:00' },
                ]
            },
            {
                title: 'Imágenes',
                fields: [
                    { key: 'res_single_image_mode', label: 'Usar imagen única (escribe "true")', type: 'text', placeholder: 'false' },
                    { key: 'res_image_step_1', label: 'Imagen Paso 1 (Comensales)', type: 'image', placeholder: 'https://...' },
                    { key: 'res_image_step_2', label: 'Imagen Paso 2 (Fecha)', type: 'image', placeholder: 'https://...' },
                    { key: 'res_image_step_3', label: 'Imagen Paso 3 (Hora)', type: 'image', placeholder: 'https://...' },
                    { key: 'res_image_step_4', label: 'Imagen Paso 4 (Datos)', type: 'image', placeholder: 'https://...' },
                ]
            },
            {
                title: 'Lógica del Sistema',
                fields: [
                    { key: 'res_mode', label: 'Modo (tables / capacity)', type: 'text', placeholder: 'tables' },
                    { key: 'res_max_capacity', label: 'Aforo Máximo (si Modo=capacity)', type: 'text', placeholder: '50' },
                    { key: 'res_auto_confirm', label: 'Confirmación Automática (true/false)', type: 'text', placeholder: 'true' },
                ]
            }
        ]
    },
    design: {
        label: 'Diseño',
        sections: [
            {
                title: 'Colores Globales',
                fields: [
                    { key: 'design_bg', label: 'Color de Fondo', type: 'color', placeholder: '#F8F5EE' },
                    { key: 'design_text', label: 'Color de Texto (Principal)', type: 'color', placeholder: '#1c1917' },
                ]
            },
            {
                title: 'Colores de Acción',
                fields: [
                    { key: 'design_primary', label: 'Color Principal (Botones)', type: 'color', placeholder: '#000000' },
                    { key: 'design_primary_text', label: 'Texto en Botón Principal', type: 'color', placeholder: '#ffffff' },
                    { key: 'design_accent', label: 'Color de Acento (Etiquetas)', type: 'color', placeholder: '#EEDD4A' },
                ]
            }
        ]
    }
};

interface ContentValue {
    es?: string;
    hidden?: boolean;
    [key: string]: any;
}

export default function AdminContentPage() {
    const [activeTab, setActiveTab] = useState<'home' | 'about' | 'menu' | 'global' | 'reservations' | 'design'>('home');
    const [content, setContent] = useState<Record<string, ContentValue>>({});
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Removed language selector logic
    const selectedLang = 'es';

    const [showLibrary, setShowLibrary] = useState(false);
    const [libraryTarget, setLibraryTarget] = useState<{ key: string } | null>(null);

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
            const contentMap: Record<string, ContentValue> = {};
            data.forEach((item: { key: string; value: any }) => {
                if (item.value && typeof item.value === 'object' && item.value.text) {
                    contentMap[item.key] = { es: item.value.text };
                } else {
                    contentMap[item.key] = item.value || {};
                }
            });
            setContent(contentMap);
        }
        setLoading(false);
    };

    const handleChange = (key: string, value: string) => {
        setContent(prev => ({
            ...prev,
            [key]: {
                ...(prev[key] || {}),
                es: value // Always save to 'es'
            }
        }));
    };

    const handleToggleHidden = (key: string) => {
        setContent(prev => {
            const currentHidden = prev[key]?.hidden;
            return {
                ...prev,
                [key]: {
                    ...(prev[key] || {}),
                    hidden: !currentHidden
                }
            };
        });
    };

    const handleSave = async () => {
        setSaving(true);

        // Upsert each field
        for (const [key, valueMap] of Object.entries(content)) {
            await supabase
                .from('site_content')
                .upsert({
                    key,
                    value: valueMap,
                    updated_at: new Date().toISOString()
                }, { onConflict: 'key' });
        }

        // Trigger server-side revalidation
        await revalidateContent();

        setSaving(false);
        alert('¡Contenido guardado y actualizado!');
    };

    const handleRestoreDefaults = async () => {
        if (!confirm('¿Estás seguro de que quieres restablecer los colores por defecto? Esta acción no se puede deshacer.')) return;

        setSaving(true);
        const designKeys = ['design_bg', 'design_text', 'design_primary', 'design_primary_text', 'design_accent'];

        try {
            // Delete these keys from DB to let defaults take over
            await supabase.from('site_content').delete().in('key', designKeys);

            // Start fresh local state for these keys
            setContent(prev => {
                const newContent = { ...prev };
                designKeys.forEach(key => delete newContent[key]);
                return newContent;
            });

            await revalidateContent();
            alert('Colores restablecidos a los valores por defecto.');
        } catch (error) {
            console.error('Error resetting defaults:', error);
            alert('Error al restablecer.');
        } finally {
            setSaving(false);
        }
    };

    const handleOpenLibrary = (key: string) => {
        setLibraryTarget({ key });
        setShowLibrary(true);
    };

    const handleImageSelect = (url: string) => {
        if (libraryTarget) {
            setContent(prev => ({
                ...prev,
                [libraryTarget.key]: {
                    ...(prev[libraryTarget.key] || {}),
                    es: url
                }
            }));
        }
        setShowLibrary(false);
        setLibraryTarget(null);
    };

    const tabs = Object.entries(contentSchema) as [keyof typeof contentSchema, typeof contentSchema.home][];

    if (loading) {
        return (
            <div className="min-h-screen bg-[#F8F5EE] flex items-center justify-center">
                <div className="text-neutral-400">Cargando...</div>
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto">
            {/* Header Area */}
            <div className="flex justify-between items-end mb-8 bg-white p-6 rounded-[2rem] border border-neutral-100">
                <div>
                    <h1 className="text-3xl font-serif mb-2">Content Editor</h1>
                    <p className="text-neutral-500 text-sm">Manage website content and images</p>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black text-white px-6 py-2 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </div>

            <main>

                {/* Tabs */}
                <div className="flex gap-2 mb-8 border-b border-neutral-200 pb-4 overflow-x-auto">
                    {tabs.map(([key, page]) => (
                        <button
                            key={key}
                            onClick={() => setActiveTab(key)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors whitespace-nowrap ${activeTab === key
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
                                {section.fields.map((field) => {
                                    const isHidden = content[field.key]?.hidden || false;
                                    return (
                                        <div key={field.key} className={`transition-opacity ${isHidden ? 'opacity-50' : 'opacity-100'}`}>
                                            <div className="flex justify-between items-center mb-1.5">
                                                <label className="block text-xs uppercase tracking-wider text-neutral-500 font-medium">
                                                    {field.label} {isHidden && '(Oculto)'}
                                                </label>
                                                {!['reservations', 'design'].includes(activeTab) && (
                                                    <button
                                                        onClick={() => handleToggleHidden(field.key)}
                                                        className={`
                                                            text-[10px] font-bold uppercase tracking-wider px-2 py-1 rounded transition-colors
                                                            ${isHidden
                                                                ? 'bg-neutral-200 text-neutral-500 hover:bg-neutral-300'
                                                                : 'bg-green-100 text-green-700 hover:bg-green-200'
                                                            }
                                                        `}
                                                        title={isHidden ? "Mostrar contenido" : "Ocultar contenido"}
                                                    >
                                                        {isHidden ? 'Oculto' : 'Visible'}
                                                    </button>
                                                )}
                                            </div>

                                            {field.type === 'textarea' ? (
                                                <textarea
                                                    value={content[field.key]?.es || ''}
                                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                                    placeholder={field.placeholder}
                                                    rows={3}
                                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                                />
                                            ) : field.type === 'image' ? (
                                                <div className="space-y-2">
                                                    <div className="flex gap-2">
                                                        <input
                                                            type="text"
                                                            value={content[field.key]?.es || ''}
                                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                                            placeholder={field.placeholder}
                                                            className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                                        />
                                                        <button
                                                            onClick={() => handleOpenLibrary(field.key)}
                                                            className="bg-neutral-100 text-black px-4 rounded-lg text-xs font-bold uppercase tracking-wider hover:bg-neutral-200 border border-neutral-200"
                                                        >
                                                            Biblioteca
                                                        </button>
                                                    </div>
                                                    {content[field.key]?.es && (
                                                        <div className="relative w-32 h-20 rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200 group">
                                                            <img
                                                                src={content[field.key]?.es}
                                                                alt="Preview"
                                                                className="w-full h-full object-cover"
                                                                onError={(e) => {
                                                                    (e.target as HTMLImageElement).style.display = 'none';
                                                                }}
                                                            />
                                                        </div>
                                                    )}
                                                </div>
                                            ) : field.type === 'color' ? (
                                                <div className="flex items-center gap-3">
                                                    <div className="relative w-12 h-12 rounded-full overflow-hidden border border-neutral-200 shadow-sm shrink-0">
                                                        <input
                                                            type="color"
                                                            value={content[field.key]?.es || field.placeholder || '#000000'}
                                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                                            className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] p-0 cursor-pointer border-0"
                                                        />
                                                    </div>
                                                    <div className="flex-1">
                                                        <input
                                                            type="text"
                                                            value={content[field.key]?.es || ''}
                                                            onChange={(e) => handleChange(field.key, e.target.value)}
                                                            placeholder={field.placeholder}
                                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                                        />
                                                    </div>
                                                </div>
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={content[field.key]?.es || ''}
                                                    onChange={(e) => handleChange(field.key, e.target.value)}
                                                    placeholder={field.placeholder}
                                                    className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                                />
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Save Button */}
                <div className="mt-8 text-center pb-8 flex flex-col gap-4 items-center">
                    <button
                        onClick={handleSave}
                        disabled={saving}
                        className="bg-black text-white px-10 py-4 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 transition-colors"
                    >
                        {saving ? 'Guardando...' : 'Guardar Todos los Cambios'}
                    </button>

                    {activeTab === 'design' && (
                        <button
                            onClick={handleRestoreDefaults}
                            disabled={saving}
                            className="text-red-500 text-xs font-bold uppercase tracking-wider hover:text-red-700 disabled:opacity-50 transition-colors"
                        >
                            {saving ? 'Restableciendo...' : 'Restablecer Colores por Defecto'}
                        </button>
                    )}
                </div>

                <ImageLibrary
                    isOpen={showLibrary}
                    onClose={() => setShowLibrary(false)}
                    onSelect={handleImageSelect}
                />
            </main>
        </div >
    );
}
