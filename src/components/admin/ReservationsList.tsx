"use client";

export default function ReservationsList({ reservations }: { reservations: any[] }) {
    if (reservations.length === 0) {
        return <div className="text-center py-20 text-neutral-400">No hay reservas registradas.</div>;
    }

    // Sort by date desc (newest first) for list view
    const sorted = [...reservations].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return (
        <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
                <thead>
                    <tr className="border-b border-neutral-100">
                        <th className="pb-4 pl-4 font-bold uppercase tracking-wider text-[10px] text-neutral-400">Fecha</th>
                        <th className="pb-4 font-bold uppercase tracking-wider text-[10px] text-neutral-400">Hora</th>
                        <th className="pb-4 font-bold uppercase tracking-wider text-[10px] text-neutral-400">Nombre</th>
                        <th className="pb-4 font-bold uppercase tracking-wider text-[10px] text-neutral-400">Personas</th>
                        <th className="pb-4 font-bold uppercase tracking-wider text-[10px] text-neutral-400">Contacto</th>
                        <th className="pb-4 font-bold uppercase tracking-wider text-[10px] text-neutral-400">Estado</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-neutral-50">
                    {sorted.map((res) => (
                        <tr key={res.id} className="group hover:bg-neutral-50 transition-colors">
                            <td className="py-4 pl-4 font-medium text-sm text-neutral-900">
                                {new Date(res.date).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                            </td>
                            <td className="py-4 font-mono text-sm font-bold text-neutral-700">{res.time}</td>
                            <td className="py-4 font-medium text-sm">{res.name}</td>
                            <td className="py-4">
                                <span className="bg-neutral-100 text-neutral-600 px-2 py-1 rounded-md text-xs font-bold">
                                    {res.party_size}
                                </span>
                            </td>
                            <td className="py-4 text-xs text-neutral-500">
                                <div className="mb-0.5 font-medium text-neutral-700">{res.phone}</div>
                                <div className="text-neutral-400">{res.email}</div>
                            </td>
                            <td className="py-4">
                                <span className="bg-green-50 text-green-700 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100">
                                    {res.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
