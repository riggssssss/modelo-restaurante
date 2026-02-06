'use server';

import { revalidatePath } from 'next/cache';
import { clearContentCache } from '@/lib/content';

export async function revalidateContent() {
    console.log('Revalidating content cache...');

    // Clear in-memory cache
    clearContentCache();

    // Revalidate paths that use content
    revalidatePath('/', 'page');
    revalidatePath('/about', 'page');
    revalidatePath('/menu', 'page');
    revalidatePath('/reservations', 'page');

    return { success: true };
}
