'use server'

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

const ONE_DAY = 24 * 60 * 60 * 1000;

export async function login(formData: FormData) {
    const username = formData.get('username') as string;
    const password = formData.get('password') as string;

    // In a real app, use a database. Here we use env vars.
    // Default fallback for dev if env vars aren't set
    const ADMIN_USER = process.env.ADMIN_USER || 'admin';
    const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123';

    if (username === ADMIN_USER && password === ADMIN_PASSWORD) {
        const cookieStore = await cookies();
        cookieStore.set('admin_session', 'true', {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: ONE_DAY,
            path: '/',
        });

        redirect('/admin/dashboard');
    } else {
        return { error: "Invalid credentials" };
    }
}

export async function logout() {
    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    redirect('/admin/login');
}
