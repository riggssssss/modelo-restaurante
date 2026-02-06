'use client';

import { createCategory, updateCategory, Category } from '@/actions/menu';
import { useState } from 'react';

interface CategoryModalProps {
    isOpen: boolean;
    onClose: () => void;
    category?: Category | null;
}

export default function CategoryModal({ isOpen, onClose, category }: CategoryModalProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            if (category) {
                await updateCategory(category.id, formData);
            } else {
                await createCategory(formData);
            }
            onClose();
        } catch (error) {
            alert('Error al guardar la categoría');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <h2 className="text-2xl font-serif mb-6">{category ? 'Editar Categoría' : 'Nueva Categoría'}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Nombre</label>
                        <input
                            name="name"
                            className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black/5"
                            defaultValue={category?.name}
                            placeholder="Ej. Entrantes, Postres..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Descripción (Opcional)</label>
                        <textarea
                            name="description"
                            className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black/5"
                            defaultValue={category?.description || ''}
                            placeholder="Breve descripción de la sección..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">URL Imagen (Opcional)</label>
                        <input
                            name="image_url"
                            className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black/5"
                            defaultValue={category?.image_url || ''}
                            placeholder="https://..."
                        />
                        <p className="text-xs text-neutral-400 mt-2">Recomendado: Unsplash o URL directa.</p>
                    </div>

                    <div className="flex gap-3 pt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-4 font-bold uppercase rounded-xl hover:bg-neutral-100 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex-1 py-4 bg-black text-white font-bold uppercase rounded-xl hover:bg-neutral-800 transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Guardando...' : 'Guardar'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
