'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

export default function AdminSettingsPage() {
    const [dbUrl, setDbUrl] = useState('');
    const [dbKey, setDbKey] = useState('');
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        // Load settings from localStorage
        const storedUrl = localStorage.getItem('supabase_url');
        const storedKey = localStorage.getItem('supabase_key');
        if (storedUrl) setDbUrl(storedUrl);
        if (storedKey) setDbKey(storedKey);
    }, []);

    const handleSaveConnection = () => {
        setSaving(true);
        try {
            if (dbUrl) localStorage.setItem('supabase_url', dbUrl);
            if (dbKey) localStorage.setItem('supabase_key', dbKey);

            alert('Conexión guardada. La página se recargará para aplicar los cambios.');
            window.location.reload();
        } catch (error) {
            console.error(error);
            alert('Error al guardar la configuración.');
        } finally {
            setSaving(false);
        }
    };

    const handleResetConnection = () => {
        if (!confirm('¿Restablecer a la configuración original (env vars)?')) return;

        localStorage.removeItem('supabase_url');
        localStorage.removeItem('supabase_key');
        setDbUrl('');
        setDbKey('');

        alert('Configuración restablecida. La página se recargará.');
        window.location.reload();
    };

    const handleExportTemplate = async () => {
        try {
            // Fetch all data to export
            const { data: categories } = await supabase.from('menu_categories').select('*').order('sort_order', { ascending: true });
            const { data: items } = await supabase.from('menu_items').select('*').order('sort_order', { ascending: true });
            const { data: content } = await supabase.from('site_content').select('*');

            const template = {
                metadata: {
                    exportedAt: new Date().toISOString(),
                    version: '1.0'
                },
                categories: categories || [],
                items: items || [],
                content: content || []
            };

            const blob = new Blob([JSON.stringify(template, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `keko-template-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Export failed', error);
            alert('Error exportando plantilla');
        }
    };

    const handleImportTemplate = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm('¡ADVERTENCIA! Importar una plantilla SOBRESCRIBIRÁ los datos actuales. ¿Continuar?')) {
            e.target.value = '';
            return;
        }

        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const template = JSON.parse(event.target?.result as string);

                // Validate structure roughly
                if (!template.categories || !template.items || !template.content) {
                    throw new Error('Formato de plantilla inválido');
                }

                setSaving(true);

                // 1. Clear existing data (optional, but cleaner for "Template" concept)
                await supabase.from('menu_items').delete().neq('id', '00000000-0000-0000-0000-000000000000'); // Hacky delete all
                await supabase.from('menu_categories').delete().neq('id', '00000000-0000-0000-0000-000000000000');

                // 2. Insert Categories
                if (template.categories.length > 0) {
                    // Remove IDs to generate new ones, or keep them if we want exact clone? 
                    // Better to keep exact clone for relations
                    await supabase.from('menu_categories').upsert(template.categories);
                }

                // 3. Insert Items
                if (template.items.length > 0) {
                    await supabase.from('menu_items').upsert(template.items);
                }

                // 4. Upsert Content
                if (template.content.length > 0) {
                    await supabase.from('site_content').upsert(template.content);
                }

                alert('Plantilla importada correctamente.');

            } catch (error) {
                console.error('Import failed', error);
                alert('Error al importar la plantilla. Verifica el formato del archivo.');
            } finally {
                setSaving(false);
                e.target.value = ''; // Reset input
            }
        };
        reader.readAsText(file);
    };

    return (
        <div className="min-h-screen bg-[#F8F5EE] font-sans">
            <nav className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight">
                    KEKO. <span className="text-xs font-medium text-neutral-400 ml-1 uppercase tracking-wider">Admin</span>
                </Link>
                <span className="text-sm text-neutral-500">Settings</span>
            </nav>

            <main className="p-6 max-w-2xl mx-auto space-y-8">
                <div>
                    <h1 className="text-3xl font-serif mb-2">Ajustes</h1>
                    <p className="text-neutral-500">
                        Configura la conexión a la base de datos y gestiona plantillas.
                    </p>
                </div>

                {/* Database Connection */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500"></span>
                        Conexión Base de Datos
                    </h2>
                    <p className="text-sm text-neutral-500 mb-6">
                        Introduce tus credenciales de Supabase para conectar a una base de datos diferente.
                        Deja los campos vacíos para usar la configuración por defecto (.env).
                    </p>

                    <div className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                                Supabase URL
                            </label>
                            <input
                                type="text"
                                value={dbUrl}
                                onChange={(e) => setDbUrl(e.target.value)}
                                placeholder="https://xyz.supabase.co"
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-black"
                            />
                        </div>
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                                Supabase Anon Key
                            </label>
                            <input
                                type="password"
                                value={dbKey}
                                onChange={(e) => setDbKey(e.target.value)}
                                placeholder="eyi..."
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm font-mono focus:outline-none focus:border-black"
                            />
                        </div>
                    </div>

                    <div className="flex gap-3 mt-6">
                        <button
                            onClick={handleSaveConnection}
                            disabled={saving}
                            className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50"
                        >
                            Guardar y Recargar
                        </button>
                        <button
                            onClick={handleResetConnection}
                            className="px-4 py-3 rounded-lg text-sm font-bold uppercase tracking-wider text-red-500 hover:bg-red-50"
                        >
                            Reset
                        </button>
                    </div>
                </div>

                {/* Templates */}
                <div className="bg-white rounded-2xl border border-neutral-100 p-6">
                    <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        Gestión de Plantillas
                    </h2>
                    <p className="text-sm text-neutral-500 mb-6">
                        Exporta el menú y contenido actual como una plantilla (JSON) o importa una nueva.
                    </p>

                    <div className="grid grid-cols-2 gap-4">
                        <button
                            onClick={handleExportTemplate}
                            className="border border-neutral-200 py-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-neutral-50 transition-colors"
                        >
                            <span className="text-2xl">📤</span>
                            <span className="text-sm font-bold uppercase tracking-wider">Exportar Datos</span>
                        </button>

                        <label className="border border-neutral-200 py-4 rounded-xl flex flex-col items-center justify-center gap-2 hover:bg-neutral-50 transition-colors cursor-pointer relative">
                            <span className="text-2xl">📥</span>
                            <span className="text-sm font-bold uppercase tracking-wider">Importar Plantilla</span>
                            <input
                                type="file"
                                className="hidden"
                                accept=".json"
                                onChange={handleImportTemplate}
                                disabled={saving}
                            />
                        </label>
                    </div>
                </div>
            </main>
        </div>
    );
}
