'use client';

import { useState, useEffect } from 'react';
import { supabase, MenuItem } from '@/lib/supabase';
import Link from 'next/link';

export default function AdminMenuPage() {
    const [items, setItems] = useState<MenuItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [isCreating, setIsCreating] = useState(false);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        setLoading(true);
        const { data, error } = await supabase
            .from('menu_items')
            .select('*')
            .order('sort_order', { ascending: true });

        if (error) {
            console.error('Error fetching menu items:', error);
        } else {
            setItems(data || []);
        }
        setLoading(false);
    };

    const handleSave = async (formData: FormData) => {
        const item = {
            name: formData.get('name') as string,
            description: formData.get('description') as string,
            price: parseFloat(formData.get('price') as string) || null,
            image_url: formData.get('image_url') as string || null,
            category: formData.get('category') as string || null,
        };

        if (editingItem) {
            await supabase.from('menu_items').update(item).eq('id', editingItem.id);
        } else {
            await supabase.from('menu_items').insert(item);
        }

        setEditingItem(null);
        setIsCreating(false);
        fetchItems();
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Eliminar este plato?')) {
            await supabase.from('menu_items').delete().eq('id', id);
            fetchItems();
        }
    };

    return (
        <div className="min-h-screen bg-[#F8F5EE] font-sans">
            <nav className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <Link href="/admin/dashboard" className="text-xl font-bold tracking-tight">
                    KEKO. <span className="text-xs font-medium text-neutral-400 ml-1 uppercase tracking-wider">Admin</span>
                </Link>
                <span className="text-sm text-neutral-500">Menu Editor</span>
            </nav>

            <main className="p-6 max-w-4xl mx-auto">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-3xl font-serif">Manage Menu</h1>
                    <button
                        onClick={() => setIsCreating(true)}
                        className="bg-black text-white px-4 py-2 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                        + Add Item
                    </button>
                </div>

                {loading ? (
                    <div className="text-center py-12 text-neutral-400">Loading...</div>
                ) : items.length === 0 ? (
                    <div className="bg-white rounded-2xl border border-neutral-100 p-12 text-center text-neutral-400">
                        No menu items yet. Click &quot;Add Item&quot; to create one.
                    </div>
                ) : (
                    <div className="space-y-4">
                        {items.map((item) => (
                            <div key={item.id} className="bg-white rounded-2xl border border-neutral-100 p-6 flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-lg">{item.name}</h3>
                                    <p className="text-neutral-500 text-sm mt-1">{item.description}</p>
                                    <div className="flex gap-4 mt-2 text-xs text-neutral-400">
                                        {item.price && <span>€{item.price.toFixed(2)}</span>}
                                        {item.category && <span className="uppercase">{item.category}</span>}
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setEditingItem(item)}
                                        className="text-xs font-bold uppercase tracking-wider hover:text-blue-600 transition-colors"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(item.id)}
                                        className="text-xs font-bold uppercase tracking-wider hover:text-red-600 transition-colors"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modal for Create/Edit */}
                {(isCreating || editingItem) && (
                    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl p-6 w-full max-w-md">
                            <h2 className="text-xl font-serif mb-4">{editingItem ? 'Edit Item' : 'New Item'}</h2>
                            <form action={handleSave} className="space-y-4">
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Name *</label>
                                    <input
                                        name="name"
                                        defaultValue={editingItem?.name || ''}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Description</label>
                                    <textarea
                                        name="description"
                                        defaultValue={editingItem?.description || ''}
                                        rows={3}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm resize-none"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Price (€)</label>
                                        <input
                                            name="price"
                                            type="number"
                                            step="0.01"
                                            defaultValue={editingItem?.price || ''}
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Category</label>
                                        <input
                                            name="category"
                                            defaultValue={editingItem?.category || ''}
                                            placeholder="Starters, Mains..."
                                            className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1 font-medium">Image URL</label>
                                    <input
                                        name="image_url"
                                        type="url"
                                        defaultValue={editingItem?.image_url || ''}
                                        className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm"
                                    />
                                </div>
                                <div className="flex gap-3 mt-6">
                                    <button
                                        type="button"
                                        onClick={() => { setEditingItem(null); setIsCreating(false); }}
                                        className="flex-1 border border-neutral-200 py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-50 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        type="submit"
                                        className="flex-1 bg-black text-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                                    >
                                        Save
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
