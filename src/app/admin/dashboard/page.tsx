'use client';

import Link from 'next/link';
import { logout } from '@/app/actions/auth';

const adminLinks = [
    { href: '/admin/content', label: 'Contenido del Sitio', description: 'Edita títulos, descripciones e imágenes' },
    { href: '/admin/menu', label: 'Menú y Platos', description: 'Gestiona platos y precios' },
    { href: '/admin/reviews', label: 'Reseñas', description: 'Gestiona testimonios de clientes' },
];

export default function AdminDashboardPage() {
    return (
        <div className="min-h-screen bg-[#F8F5EE] font-sans">
            <nav className="bg-white border-b border-neutral-200 px-6 py-4 flex justify-between items-center sticky top-0 z-50">
                <span className="text-xl font-bold tracking-tight">KEKO. <span className="text-xs font-medium text-neutral-400 ml-1 uppercase tracking-wider">Admin</span></span>
                <button
                    onClick={() => logout()}
                    className="text-xs font-bold uppercase tracking-wider hover:text-red-600 transition-colors"
                >
                    Cerrar Sesión
                </button>
            </nav>

            <main className="p-6 max-w-4xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-serif mb-2">Panel de Control</h1>
                    <p className="text-neutral-500">Selecciona una sección para gestionar tu restaurante.</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {adminLinks.map((link) => (
                        <Link
                            key={link.href}
                            href={link.href}
                            className="bg-white p-6 rounded-2xl border border-neutral-100 shadow-sm hover:border-black/20 hover:shadow-md transition-all group"
                        >
                            <h3 className="font-bold text-lg mb-1 group-hover:underline">{link.label}</h3>
                            <p className="text-neutral-500 text-sm">{link.description}</p>
                        </Link>
                    ))}
                </div>

                <div className="mt-12 bg-green-50 border border-green-200 rounded-2xl p-6">
                    <h2 className="font-bold text-green-800 mb-2">✅ Base de Datos Conectada</h2>
                    <p className="text-green-700 text-sm">
                        Tus tablas de Supabase están configuradas y listas para usar. Ahora puedes gestionar todo el contenido desde este panel.
                    </p>
                </div>

                <div className="mt-6 bg-white border border-neutral-200 rounded-2xl p-6">
                    <h2 className="font-bold mb-4">📋 Consejos Rápidos</h2>
                    <ul className="text-sm text-neutral-600 space-y-2">
                        <li>• <strong>Contenido</strong>: Edita textos e imágenes de las páginas públicas</li>
                        <li>• <strong>Menú</strong>: Crea categorías primero, luego añade platos a cada una</li>
                        <li>• <strong>Reseñas</strong>: Añade testimonios para mostrar en la web</li>
                    </ul>
                </div>
            </main>
        </div>
    );
}
