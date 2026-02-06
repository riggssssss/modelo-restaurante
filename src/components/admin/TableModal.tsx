'use client';

import { createTable, updateTable, RestaurantTable } from '@/actions/tables';
import { useState } from 'react';

interface TableModalProps {
    isOpen: boolean;
    onClose: () => void;
    table?: RestaurantTable | null;
}

export default function TableModal({ isOpen, onClose, table }: TableModalProps) {
    const [loading, setLoading] = useState(false);

    if (!isOpen) return null;

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            if (table) {
                await updateTable(table.id, formData);
            } else {
                await createTable(formData);
            }
            onClose();
        } catch (error) {
            alert('Error al guardar la mesa');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2rem] w-full max-w-lg p-8 shadow-2xl scale-100 animate-in zoom-in-95 duration-200">
                <h2 className="text-2xl font-serif mb-6">{table ? 'Editar Mesa' : 'Nueva Mesa'}</h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Nombre de la Mesa</label>
                        <input
                            name="name"
                            className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black/5"
                            defaultValue={table?.name}
                            placeholder="Ej. Mesa 1, Barra..."
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-neutral-700 mb-2">Capacidad (Personas)</label>
                        <input
                            name="capacity"
                            type="number"
                            min="1"
                            className="w-full p-4 bg-neutral-50 rounded-xl border-none focus:ring-2 focus:ring-black/5"
                            defaultValue={table?.capacity || 2}
                            required
                        />
                    </div>

                    <div className="flex items-center gap-3 p-4 bg-neutral-50 rounded-xl">
                        <input
                            type="checkbox"
                            name="is_active"
                            id="is_active"
                            defaultChecked={table ? table.is_active : true}
                            className="w-5 h-5 rounded border-neutral-300 text-black focus:ring-black/20"
                        />
                        <label htmlFor="is_active" className="text-sm font-bold text-neutral-700 flex-1 cursor-pointer">
                            Mesa Activa
                            <span className="block text-xs font-normal text-neutral-400">Si se desactiva, no se usará para reservas.</span>
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
