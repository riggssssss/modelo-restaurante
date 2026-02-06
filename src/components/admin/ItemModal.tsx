'use client';

import { createItem, updateItem, MenuItem } from '@/actions/menu';
import { useState } from 'react';

interface ItemModalProps {
    isOpen: boolean;
    onClose: () => void;
    item?: MenuItem | null;
    categoryId: string;
}

export default function ItemModal({ isOpen, onClose, item, categoryId }: ItemModalProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        formData.append('category_id', categoryId); // Ensure category ID is sent

        try {
            if (item) {
                await updateItem(item.id, formData);
            } else {
                await createItem(formData);
            }
            onClose();
        } catch (error) {
            alert('Error al guardar el plato');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <h2 className="text-2xl font-serif mb-6">{item ? 'Editar Plato' : 'Nuevo Plato'}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-neutral-700 mb-2">Nombre</label>
                            <input
                                name="name"
                                className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black/5"
                                defaultValue={item?.name}
                                placeholder="Ej. Solomillo"
                                required
                            />
                        </div>
                        <div className="col-span-2 md:col-span-1">
                            <label className="block text-sm font-bold text-neutral-700 mb-2">Precio</label>
                            <input
                                name="price"
                                className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black/5"
                                defaultValue={item?.price || ''}
                                placeholder="Ej. 24€"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Descripción</label>
                        <textarea
                            name="description"
                            className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black/5"
                            defaultValue={item?.description || ''}
                            placeholder="Ingredientes, alérgenos..."
                            rows={3}
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">URL Imagen (Opcional)</label>
                        <input
                            name="image_url"
                            className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black/5"
                            defaultValue={item?.image_url || ''}
                            placeholder="https://..."
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                        <input
                            type="checkbox"
                            name="is_available"
                            id="is_available"
                            defaultChecked={item ? item.is_available : true}
                            className="w-5 h-5 rounded border-neutral-300 text-black focus:ring-black/20"
                        />
                        <label htmlFor="is_available" className="text-sm font-bold text-neutral-700 flex-1 cursor-pointer">
                            Disponible para pedir
                            <span className="block text-xs font-normal text-neutral-400">Desactívalo si se ha agotado.</span>
                        </label>
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
