'use client';

import { RestaurantTable, deleteTable } from '@/actions/tables';
import { useState } from 'react';
import TableModal from './TableModal';

export default function TableManager({ initialTables }: { initialTables: RestaurantTable[] }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingTable, setEditingTable] = useState<RestaurantTable | null>(null);

    const handleCreate = () => {
        setEditingTable(null);
        setIsModalOpen(true);
    };

    const handleEdit = (table: RestaurantTable) => {
        setEditingTable(table);
        setIsModalOpen(true);
    };

    const handleDelete = async (id: string) => {
        if (confirm('¿Estás seguro de que quieres eliminar esta mesa?')) {
            await deleteTable(id);
        }
    };

    return (
        <>
            <div className="bg-white border border-neutral-100 rounded-[2rem] p-8">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="font-bold text-lg">Inventario ({initialTables.length})</h2>
                    <button
                        onClick={handleCreate}
                        className="bg-black text-white px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 transition-colors"
                    >
                        + Nueva Mesa
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {initialTables.map((table) => (
                        <div key={table.id} className="p-6 bg-neutral-50 rounded-2xl border border-neutral-100 relative group min-h-[120px] flex flex-col justify-between">
                            <div>
                                <div className="flex justify-between items-start">
                                    <h3 className="font-bold text-lg">{table.name}</h3>
                                    <div className={`w-2 h-2 rounded-full ${table.is_active ? 'bg-green-500' : 'bg-red-500'}`} title={table.is_active ? 'Activa' : 'Inactiva'}></div>
                                </div>
                                <p className="text-neutral-500 text-sm mt-1">{table.capacity} Personas</p>
                            </div>

                            <div className="flex gap-2 mt-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button
                                    onClick={() => handleEdit(table)}
                                    className="flex-1 py-2 bg-white border border-neutral-200 rounded-lg text-xs font-bold uppercase hover:bg-neutral-50"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(table.id)}
                                    className="px-3 py-2 bg-red-50 text-red-600 border border-red-100 rounded-lg text-xs font-bold uppercase hover:bg-red-100"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18" /><path d="M19 6v14c0 1.1-.9 2-2 2H7c-1.1 0-2-.9-2-2V6" /><path d="M8 6V4c0-1.1.9-2 2-2h4c1.1 0 2 .9 2 2v2" /></svg>
                                </button>
                            </div>
                        </div>
                    ))}

                    {initialTables.length === 0 && (
                        <div className="col-span-full text-center py-12 text-neutral-400">
                            No hay mesas creadas. Añade la primera para empezar.
                        </div>
                    )}
                </div>
            </div>

            <TableModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                table={editingTable}
            />
        </>
    );
}
