'use client';

import { useState, useEffect } from 'react';
import { supabase, MenuItem, MenuCategory } from '@/lib/supabase';
import Link from 'next/link';

// Default categories to create if none exist
const DEFAULT_CATEGORIES = [
    { name: 'Entrantes', sort_order: 0 },
    { name: 'Principales', sort_order: 1 },
    { name: 'Pescados', sort_order: 2 },
    { name: 'Carnes', sort_order: 3 },
    { name: 'Postres', sort_order: 4 },
    { name: 'Bebidas', sort_order: 5 },
];

export default function AdminMenuPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [categories, setCategories] = useState<MenuCategory[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [isCreating, setIsCreating] = useState(false);
    const [activeTab, setActiveTab] = useState<'items' | 'categories'>('items');
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategory, setEditingCategory] = useState<MenuCategory | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        setLoading(true);

        // Fetch categories
        const { data: catData } = await supabase
            .from('menu_categories')
            .select('*')
            .order('sort_order', { ascending: true });

        // If no categories, create defaults
        if (!catData || catData.length === 0) {
            await createDefaultCategories();
            const { data: newCatData } = await supabase
                .from('menu_categories')
                .select('*')
                .order('sort_order', { ascending: true });
            setCategories(newCatData || []);
        } else {
            setCategories(catData);
        }

        // Fetch items
        const { data: itemData } = await supabase
            .from('menu_items')
            .select('*')
            .order('sort_order', { ascending: true });
        setItems(itemData || []);

        setLoading(false);
    };

    const createDefaultCategories = async () => {
        for (const cat of DEFAULT_CATEGORIES) {
            await supabase.from('menu_categories').insert(cat);
        }
    };

    const handleSaveItem = async (formData: FormData) => {
        const item = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string) || null,
            category: formData.get('category') as string || null,
        };

        if (editingItem) {
            await supabase.from('menu_items').update(item).eq('id', editingItem.id);
        } else {
            await supabase.from('menu_items').insert(item);
        }

        setEditingItem(null);
        setIsCreating(false);
        fetchData();
    };

    const handleDeleteItem = async (id: string) => {
        if (confirm('¿Eliminar este plato?')) {
            await supabase.from('menu_items').delete().eq('id', id);
            fetchData();
        }
    };

    const handleAddCategory = async () => {
        if (!newCategoryName.trim()) return;

        await supabase.from('menu_categories').insert({
            name: newCategoryName.trim(),
            sort_order: categories.length
        });

        setNewCategoryName('');
        fetchData();
    };

    const handleUpdateCategory = async (id: string, updates: Partial<MenuCategory>) => {
        await supabase.from('menu_categories').update(updates).eq('id', id);
        setEditingCategory(null);
        fetchData();
    };

    const handleDeleteCategory = async (id: string) => {
        if (confirm('¿Eliminar esta categoría? Los platos asociados quedarán sin categoría.')) {
            await supabase.from('menu_categories').delete().eq('id', id);
            fetchData();
        }
    };

    const handleMoveCategory = async (index: number, direction: 'up' | 'down') => {
        const newIndex = direction === 'up' ? index - 1 : index + 1;
        if (newIndex < 0 || newIndex >= categories.length) return;

        const currentCat = categories[index];
        const swapCat = categories[newIndex];

        // Swap sort_order values
        await supabase.from('menu_categories').update({ sort_order: newIndex }).eq('id', currentCat.id);
        await supabase.from('menu_categories').update({ sort_order: index }).eq('id', swapCat.id);

        fetchData();
    };

    // Group items by category
    const groupedItems = categories.map(cat => ({
        category: cat,
        items: items.filter(item => item.category === cat.name)
    }));
    const uncategorizedItems = items.filter(item => !item.category || !categories.find(c => c.name === item.category));

    return (
        <div className="min-h-screen bg-[#F8F5EE] font-sans">
            <nav className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight">
                    KEKO. <span className="text-xs font-medium text-neutral-400 ml-1 uppercase tracking-wider">Admin</span>
                </Link>
                <span className="text-sm text-neutral-500">Menu Editor</span>
            </nav>

            <main className="p-6 max-w-4xl mx-auto">
                {/* Tabs */}
                <div className="flex gap-2 mb-6">
                    <button
                        onClick={() => setActiveTab('items')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'items' ? 'bg-black text-white' : 'bg-white border border-neutral-200'
                            }`}
                    >
                        Platos
                    </button>
                    <button
                        onClick={() => setActiveTab('categories')}
                        className={`px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider transition-colors ${activeTab === 'categories' ? 'bg-black text-white' : 'bg-white border border-neutral-200'
                            }`}
                    >
                        Categorías
                    </button>
                </div>

                {activeTab === 'categories' ? (
                    /* Categories Tab */
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h1 className="text-3xl font-serif">Categorías del Menú</h1>
                        </div>

                        {/* Add Category */}
                        <div className="bg-white rounded-2xl border border-neutral-100 p-6 mb-6">
                            <h2 className="font-bold mb-4">Añadir Categoría</h2>
                            <div className="flex gap-3">
                                <input
                                    value={newCategoryName}
                                    onChange={(e) => setNewCategoryName(e.target.value)}
                                    placeholder="Ej: Entrantes, Pescados, Bebidas..."
                                    className="flex-1 bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                                    onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                                />
                                <button
                                    onClick={handleAddCategory}
                                    className="bg-black text-white px-6 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                                >
                                    Añadir
                                </button>
                            </div>
                        </div>

                        {/* Categories List with Reorder */}
                        <div className="space-y-3">
                            {categories.map((cat, index) => (
                                <div key={cat.id} className="bg-white rounded-2xl border border-neutral-100 p-4">
                                    <div className="flex justify-between items-center">
                                        <div className="flex items-center gap-4">
                                            {/* Reorder Arrows */}
                                            <div className="flex flex-col gap-0.5">
                                                <button
                                                    onClick={() => handleMoveCategory(index, 'up')}
                                                    disabled={index === 0}
                                                    className={`p-1 rounded hover:bg-neutral-100 transition-colors ${index === 0 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                    title="Mover arriba"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                                    </svg>
                                                </button>
                                                <button
                                                    onClick={() => handleMoveCategory(index, 'down')}
                                                    disabled={index === categories.length - 1}
                                                    className={`p-1 rounded hover:bg-neutral-100 transition-colors ${index === categories.length - 1 ? 'opacity-30 cursor-not-allowed' : ''}`}
                                                    title="Mover abajo"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                    </svg>
                                                </button>
                                            </div>

                                            <span className="text-xs text-neutral-400 font-mono w-6">{index + 1}</span>

                                            {editingCategory?.id === cat.id ? (
                                                <input
                                                    value={editingCategory.name}
                                                    onChange={(e) => setEditingCategory({ ...editingCategory, name: e.target.value })}
                                                    onBlur={() => handleUpdateCategory(cat.id, { name: editingCategory.name })}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleUpdateCategory(cat.id, { name: editingCategory.name })}
                                                    className="font-bold bg-neutral-50 border border-neutral-200 rounded px-2 py-1"
                                                    autoFocus
                                                />
                                            ) : (
                                                <span
                                                    className="font-bold cursor-pointer hover:text-blue-600"
                                                    onClick={() => setEditingCategory(cat)}
                                                >
                                                    {cat.name}
                                                </span>
                                            )}

                                            <span className="text-xs text-neutral-400">
                                                ({items.filter(i => i.category === cat.name).length} platos)
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="text-xs font-bold uppercase tracking-wider text-red-500 hover:text-red-700 transition-colors"
                                        >
                                            Eliminar
                                        </button>
                                    </div>

                                    {/* Category Image URL */}
                                    <div className="mt-4 pt-4 border-t border-neutral-100">
                                        <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">
                                            Imagen de la categoría
                                        </label>
                                        <input
                                            type="url"
                                            placeholder="https://images.unsplash.com/..."
                                            defaultValue={(cat as MenuCategory & { image_url?: string }).image_url || ''}
                                            onBlur={(e) => handleUpdateCategory(cat.id, { image_url: e.target.value } as Partial<MenuCategory>)}
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-2 text-sm"
                                        />
                                    </div>
                                </div>
                            ))}
                            {categories.length === 0 && (
                                <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center text-neutral-400">
                                    No hay categorías. Se crearán algunas por defecto...
                                </div>
                            )}
                        </div>
                    </div>
                ) : (
                    /* Items Tab */
                    <div>
                        <div className="flex justify-between items-center mb-8">
                            <h1 className="text-3xl font-serif">Platos del Menú</h1>
                            <button
                                onClick={() => setIsCreating(true)}
                                className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                            >
                                + Añadir Plato
                            </button>
                        </div>

                        {loading ? (
                            <div className="text-center py-12 text-neutral-400">Loading...</div>
                        ) : (
                            <div className="space-y-8">
                                {/* Grouped by category */}
                                {groupedItems.map(({ category, items: catItems }) => catItems.length > 0 && (
                                    <div key={category.id}>
                                        <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-500 mb-4 flex items-center gap-3">
                                            {category.name}
                                            <span className="h-px bg-neutral-200 flex-1"></span>
                                        </h2>
                                        <div className="space-y-3">
                                            {catItems.map((item) => (
                                                <div key={item.id} className="bg-white rounded-2xl border border-neutral-100 p-5 flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                                        <p className="text-neutral-500 text-sm mt-1">{item.description}</p>
                                                        <div className="mt-2 text-sm font-mono text-neutral-400">
                                                            {item.price && <>€{item.price.toFixed(2)}</>}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setEditingItem(item)}
                                                            className="text-xs font-bold uppercase tracking-wider hover:text-blue-600 transition-colors"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="text-xs font-bold uppercase tracking-wider hover:text-red-600 transition-colors"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}

                                {/* Uncategorized items */}
                                {uncategorizedItems.length > 0 && (
                                    <div>
                                        <h2 className="text-lg font-bold uppercase tracking-wider text-neutral-400 mb-4 flex items-center gap-3">
                                            Sin Categoría
                                            <span className="h-px bg-neutral-200 flex-1"></span>
                                        </h2>
                                        <div className="space-y-3">
                                            {uncategorizedItems.map((item) => (
                                                <div key={item.id} className="bg-white rounded-2xl border border-neutral-100 p-5 flex justify-between items-start">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{item.name}</h3>
                                                        <p className="text-neutral-500 text-sm mt-1">{item.description}</p>
                                                        <div className="mt-2 text-sm font-mono text-neutral-400">
                                                            {item.price && <>€{item.price.toFixed(2)}</>}
                                                        </div>
                                                    </div>
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => setEditingItem(item)}
                                                            className="text-xs font-bold uppercase tracking-wider hover:text-blue-600 transition-colors"
                                                        >
                                                            Editar
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteItem(item.id)}
                                                            className="text-xs font-bold uppercase tracking-wider hover:text-red-600 transition-colors"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {items.length === 0 && (
                                    <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center text-neutral-400">
                                        No hay platos. Crea categorías primero y luego añade platos.
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                )}

                {/* Modal for Create/Edit Item */}
                {(isCreating || editingItem) && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-serif mb-4">{editingItem ? 'Editar Plato' : 'Nuevo Plato'}</h2>
                            <form action={handleSaveItem} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Nombre *</label>
                                    <input
                                        name="name"
                                        defaultValue={editingItem?.name || ''}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Descripción</label>
                                    <textarea
                                        name="description"
                                        defaultValue={editingItem?.description || ''}
                                        rows={3}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm resize-none focus:outline-none focus:border-black"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Precio (€)</label>
                                        <input
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            defaultValue={editingItem?.price || ''}
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Categoría</label>
                                        <select
                                            name="category"
                                            defaultValue={editingItem?.category || ''}
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black"
                                        >
                                            <option value="">Sin categoría</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.name}>{cat.name}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setEditingItem(null); setIsCreating(false); }}
                                        className="flex-1 border border-neutral-200 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors"
                                    >
                                        Cancelar
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                                    >
                                        Guardar
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
