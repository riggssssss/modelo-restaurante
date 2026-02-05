'use client';

import { useTransition, useState } from 'react';
import { login } from '@/app/actions/auth';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
    const [isPending, startTransition] = useTransition();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (formData: FormData) => {
        setError(null);
        startTransition(async () => {
            const result = await login(formData);
            if (result?.error) {
                setError(result.error);
            }
        });
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-[#F8F5EE] p-4 font-sans">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-neutral-100">
                    <h1 className="text-2xl font-serif font-medium text-center mb-8 text-neutral-900">Admin Access</h1>

                    <form action={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">Username</label>
                            <input
                                type="text"
                                name="username"
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-xs uppercase tracking-wider text-neutral-500 mb-1.5 font-medium">Password</label>
                            <input
                                type="password"
                                name="password"
                                className="w-full bg-neutral-50 border border-neutral-200 rounded-lg px-4 py-3 text-sm focus:outline-none focus:border-black focus:ring-1 focus:ring-black transition-colors"
                                required
                            />
                        </div>

                        {error && (
                            <div className="text-red-500 text-xs font-medium bg-red-50 p-3 rounded-lg">
                                {error}
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isPending}
                            className="w-full bg-black text-white py-3 rounded-lg text-sm font-bold uppercase tracking-wider hover:bg-neutral-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all mt-4"
                        >
                            {isPending ? 'Verifying...' : 'Login'}
                        </button>
                    </form>
                </div>

                <p className="text-center text-xs text-neutral-400 mt-8 uppercase tracking-widest">
                    Keko Private Area
                </p>
            </motion.div>
        </main>
    );
}
