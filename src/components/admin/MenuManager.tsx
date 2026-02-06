'use client';

import { useState } from 'react';
import { Category, MenuItem, getItemsByCategory, deleteCategory, deleteItem } from '@/actions/menu';
import CategoryModal from './CategoryModal';
import ItemModal from './ItemModal';

interface MenuManagerProps {
    initialCategories: Category[];
}

export default function MenuManager({ initialCategories }: MenuManagerProps) {
    const [categories, setCategories] = useState<Category[]>(initialCategories);
    const [expandedCategory, setExpandedCategory] = useState<string | null>(null);
    const [items, setItems] = useState<Record<string, MenuItem[]>>({});
    const [loadingItems, setLoadingItems] = useState<Record<string, boolean>>({});

    // Modals state
    const [isCategoryModalOpen, setIsCategoryModalOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);

    const [isItemModalOpen, setIsItemModalOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
    const [targetCategoryId, setTargetCategoryId] = useState<string | null>(null);

    const handleExpand = async (categoryId: string) => {
        if (expandedCategory === categoryId) {
            setExpandedCategory(null);
            return;
        }

        setExpandedCategory(categoryId);

        if (!items[categoryId]) {
            setLoadingItems(prev => ({ ...prev, [categoryId]: true }));
            try {
                const categoryItems = await getItemsByCategory(categoryId);
                setItems(prev => ({ ...prev, [categoryId]: categoryItems }));
            } catch (error) {
                console.error("Error fetching items:", error);
            } finally {
                setLoadingItems(prev => ({ ...prev, [categoryId]: false }));
            }
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm('¿Estás seguro de eliminar esta categoría y todos sus platos?')) return;
        await deleteCategory(id);
        // Optimistic update or refresh? For simplicity, we can rely on revalidatePath from server action and router refresh, 
        // but since this is a client state derived from props, we might need to router.refresh().
        // For now, let's assume page refresh or add router.refresh() call in a useEffect or after action.
        window.location.reload();
    };

    const handleDeleteItem = async (id: string, categoryId: string) => {
        if (!confirm('¿Eliminar este plato?')) return;
        await deleteItem(id);
        const updatedItems = await getItemsByCategory(categoryId);
        setItems(prev => ({ ...prev, [categoryId]: updatedItems }));
    };

    return (
        <div className="space-y-6">
            {/* Add Category Button */}
            <button
                onClick={() => { setEditingCategory(null); setIsCategoryModalOpen(true); }}
                className="w-full py-4 border-2 border-dashed border-neutral-200 rounded-2xl text-neutral-400 font-bold uppercase tracking-wider hover:border-black hover:text-black transition-all"
            >
                + Nueva Categoría
            </button>

            {/* Categories List */}
            <div className="space-y-4">
                {categories.map((cat) => (
                    <div key={cat.id} className="bg-white border border-neutral-100 rounded-2xl overflow-hidden transition-all duration-300">
                        {/* Category Header */}
                        <div className="p-6 flex items-center justify-between bg-white hover:bg-neutral-50 transition-colors cursor-pointer" onClick={() => handleExpand(cat.id)}>
                            <div className="flex items-center gap-4">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-colors ${expandedCategory === cat.id ? 'bg-black border-black text-white' : 'border-neutral-200 text-neutral-400'}`}>
                                    {expandedCategory === cat.id ? '−' : '+'}
                                </div>
                                <h3 className="text-xl font-bold font-serif">{cat.name}</h3>
                                <span className="text-sm text-neutral-400 font-normal">({cat.description || 'Sin descripción'})</span>
                            </div>
                            <div className="flex items-center gap-2" onClick={e => e.stopPropagation()}>
                                <button
                                    onClick={() => { setEditingCategory(cat); setIsCategoryModalOpen(true); }}
                                    className="p-2 text-neutral-400 hover:text-black hover:bg-neutral-100 rounded-lg transition-colors"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDeleteCategory(cat.id)}
                                    className="p-2 text-neutral-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>

                        {/* Items List (Collapsible) */}
                        {expandedCategory === cat.id && (
                            <div className="border-t border-neutral-100 bg-neutral-50/50 p-6">
                                {loadingItems[cat.id] ? (
                                    <div className="text-center py-4 text-neutral-400 text-sm">Cargando platos...</div>
                                ) : (
                                    <div className="space-y-3">
                                        {(items[cat.id] || []).map((item) => (
                                            <div key={item.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition-shadow">
                                                <div className="flex items-center gap-4">
                                                    {item.image_url ? (
                                                        <img src={item.image_url} alt={item.name} className="w-12 h-12 rounded-lg object-cover bg-neutral-100" />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-lg bg-neutral-100 flex items-center justify-center text-xs text-neutral-400 font-bold">IMG</div>
                                                    )}
                                                    <div>
                                                        <div className="font-bold flex items-baseline gap-2">
                                                            {item.name}
                                                            <span className="text-xs font-normal px-2 py-0.5 bg-neutral-100 rounded text-neutral-500">
                                                                {item.price}
                                                            </span>
                                                            {!item.is_available && (
                                                                <span className="text-[10px] font-bold uppercase text-red-500 bg-red-50 px-2 py-0.5 rounded">Agotado</span>
                                                            )}
                                                        </div>
                                                        <div className="text-sm text-neutral-500 truncate max-w-xs">{item.description}</div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1">
                                                    <button
                                                        onClick={() => { setEditingItem(item); setTargetCategoryId(cat.id); setIsItemModalOpen(true); }}
                                                        className="text-xs font-bold uppercase text-neutral-400 hover:text-black px-3 py-2 rounded hover:bg-neutral-100 transition-colors"
                                                    >
                                                        Editar
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteItem(item.id, cat.id)}
                                                        className="text-xs font-bold uppercase text-neutral-400 hover:text-red-600 px-3 py-2 rounded hover:bg-red-50 transition-colors"
                                                    >
                                                        Eliminar
                                                    </button>
                                                </div>
                                            </div>
                                        ))}

                                        <button
                                            onClick={() => { setEditingItem(null); setTargetCategoryId(cat.id); setIsItemModalOpen(true); }}
                                            className="w-full py-3 border border-dashed border-neutral-300 rounded-xl text-neutral-400 text-sm font-bold uppercase hover:border-black hover:text-black hover:bg-white transition-all"
                                        >
                                            + Añadir Plato en {cat.name}
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                ))}

                {categories.length === 0 && (
                    <div className="text-center py-20 bg-neutral-50 rounded-[2rem] text-neutral-400">
                        <p>No hay categorías en el menú.</p>
                        <p className="text-sm">Empieza creando una arriba.</p>
                    </div>
                )}
            </div>

            {/* Modals */}
            {isCategoryModalOpen && (
                <CategoryModal
                    isOpen={isCategoryModalOpen}
                    onClose={() => { setIsCategoryModalOpen(false); window.location.reload(); }} // Simple refresh for now
                    category={editingCategory}
                />
            )}

            {isItemModalOpen && targetCategoryId && (
                <ItemModal
                    isOpen={isItemModalOpen}
                    onClose={async () => {
                        setIsItemModalOpen(false);
                        // Refresh specific category items
                        const updatedItems = await getItemsByCategory(targetCategoryId);
                        setItems(prev => ({ ...prev, [targetCategoryId]: updatedItems }));
                    }}
                    item={editingItem}
                    categoryId={targetCategoryId}
                />
            )}
        </div>
    );
}
