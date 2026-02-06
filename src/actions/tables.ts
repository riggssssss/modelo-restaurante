'use server';

import { supabase } from '@/lib/supabase';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';

// Simple auth check helper
async function requireAuth() {
    const cookieStore = await cookies();
    if (!cookieStore.has('admin_session')) {
        throw new Error('Unauthorized');
    }
}

export type RestaurantTable = {
    id: string;
    created_at: string;
    name: string;
    capacity: number;
    is_active: boolean;
};

export async function getTables() {
    await requireAuth();

    const { data, error } = await supabase
        .from('restaurant_tables')
        .select('*')
        .order('name', { ascending: true });

    if (error) throw new Error(error.message);
    return data as RestaurantTable[];
}

export async function createTable(formData: FormData) {
    await requireAuth();

    const name = formData.get('name') as string;
    const capacity = parseInt(formData.get('capacity') as string);
    const is_active = formData.get('is_active') === 'on';

    const { error } = await supabase.from('restaurant_tables').insert({
        name,
        capacity,
        is_active
    });

    if (error) throw new Error(error.message);
    revalidatePath('/admin/tables');
}

export async function updateTable(id: string, formData: FormData) {
    await requireAuth();

    const name = formData.get('name') as string;
    const capacity = parseInt(formData.get('capacity') as string);
    const is_active = formData.get('is_active') === 'on';

    const { error } = await supabase
        .from('restaurant_tables')
        .update({ name, capacity, is_active })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/tables');
}

export async function deleteTable(id: string) {
    await requireAuth();

    const { error } = await supabase.from('restaurant_tables').delete().eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/admin/tables');
}
