// Server Component

import Link from 'next/link';
import { logout } from '@/app/actions/auth';
import { getRecentReservations, getTodaysReservations } from '@/actions/reservations';

export default async function AdminDashboardPage() {
    const recentReservations = await getRecentReservations(5);
    const todaysReservations = await getTodaysReservations();

    // Calculate stats
    const todayCount = todaysReservations?.length || 0;
    const todayPax = todaysReservations?.reduce((acc, curr) => acc + curr.party_size, 0) || 0;

    // Determine next service
    const currentHour = new Date().getHours();
    const serviceStatus = currentHour < 16 ? "Comida (Lunch)" : "Cena (Dinner)";

    return (
        <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-end mb-8 bg-white p-6 rounded-[2rem] border border-neutral-100">
                <div>
                    <h1 className="text-3xl font-serif mb-2">Overview</h1>
                    <p className="text-neutral-500 text-sm">Resumen de actividad del restaurante.</p>
                </div>
                <div className="flex items-center gap-3">
                    <span className="text-xs font-bold uppercase tracking-wider bg-green-50 text-green-700 px-3 py-1.5 rounded-full border border-green-100 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                        Servicio: {serviceStatus}
                    </span>
                    <form action={logout}>
                        <button className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-400 hover:text-red-600 transition-colors bg-neutral-50 px-4 py-2 rounded-lg hover:bg-red-50">
                            Cerrar Sesión
                        </button>
                    </form>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left Column: Today's Status */}
                <div className="lg:col-span-2 space-y-6">

                    {/* Today's Stats Cards */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-black text-white p-6 rounded-[2rem] flex flex-col justify-between min-h-[140px]">
                            <div className="text-neutral-400 text-xs font-bold uppercase tracking-wider">Reservas Hoy</div>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-serif">{todayCount}</span>
                                <span className="mb-2 text-sm text-neutral-400">mesas</span>
                            </div>
                        </div>
                        <div className="bg-[#EEDD4A] p-6 rounded-[2rem] flex flex-col justify-between min-h-[140px]">
                            <div className="text-black/60 text-xs font-bold uppercase tracking-wider">Comensales Hoy</div>
                            <div className="flex items-end gap-2">
                                <span className="text-5xl font-serif text-black">{todayPax}</span>
                                <span className="mb-2 text-sm text-black/60">personas</span>
                            </div>
                        </div>
                    </div>

                    {/* Today's List */}
                    <div className="bg-white border border-neutral-100 rounded-[2rem] p-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="font-bold text-xl">Próximas Reservas (Hoy)</h2>
                            <Link href="/admin/bookings" className="text-xs font-bold uppercase underline hover:text-neutral-600">Ver Calendario</Link>
                        </div>

                        {todaysReservations && todaysReservations.length > 0 ? (
                            <div className="space-y-4">
                                {todaysReservations.map((res) => (
                                    <div key={res.id} className="flex items-center justify-between p-4 bg-neutral-50 rounded-2xl border border-neutral-100">
                                        <div className="flex items-center gap-4">
                                            <div className="font-mono font-bold text-lg bg-white px-3 py-1 rounded-lg border border-neutral-200">
                                                {res.time}
                                            </div>
                                            <div>
                                                <div className="font-bold">{res.name}</div>
                                                <div className="text-xs text-neutral-500">{res.party_size} personas • {res.phone}</div>
                                            </div>
                                        </div>
                                        <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded border ${res.status === 'confirmed' ? 'bg-green-100 text-green-700 border-green-200' : 'bg-neutral-200 text-neutral-600'
                                            }`}>
                                            {res.status}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8 text-neutral-400 text-sm">
                                No hay más reservas para hoy.
                            </div>
                        )}
                    </div>
                </div>

                {/* Right Column: Recent Activity / Needs */}
                <div className="space-y-6">
                    <div className="bg-white border border-neutral-100 rounded-[2rem] p-8 h-full">
                        <h2 className="font-bold text-lg mb-6">Últimas Reservas Recibidas</h2>

                        <div className="space-y-6 relative before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-px before:bg-neutral-100">
                            {recentReservations && recentReservations.map((res) => (
                                <div key={res.id} className="relative pl-6">
                                    <div className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full bg-black border-2 border-white shadow-sm"></div>
                                    <div className="mb-1">
                                        <span className="font-bold text-sm block">{res.name}</span>
                                        <span className="text-xs text-neutral-500">
                                            Reserva para el {new Date(res.date).toLocaleDateString()} a las {res.time}
                                        </span>
                                    </div>
                                    <div className="text-[10px] text-neutral-400 font-mono">
                                        {new Date(res.created_at).toLocaleString()}
                                    </div>
                                </div>
                            ))}
                            {(!recentReservations || recentReservations.length === 0) && (
                                <p className="text-sm text-neutral-400 pl-6">No hay actividad reciente.</p>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-neutral-100">
                            <Link href="/admin/bookings" className="block w-full text-center bg-black text-white py-3 rounded-xl font-bold text-sm uppercase tracking-wider hover:bg-neutral-800 transition-colors">
                                Gestionar Todas
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
