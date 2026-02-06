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

export type Category = {
    id: string;
    created_at: string;
    name: string;
    description: string | null;
    sort_order: number;
    image_url: string | null;
};

export type MenuItem = {
    id: string;
    created_at: string;
    category_id: string;
    name: string;
    description: string | null;
    price: string | null;
    sort_order: number;
    image_url: string | null;
    is_available: boolean;
};

// --- Categories ---

export async function getCategories() {
    const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data as Category[];
}

export async function createCategory(formData: FormData) {
    await requireAuth();
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image_url = formData.get('image_url') as string;

    // Get max sort order to append to end
    const { data: maxOrderData } = await supabase
        .from('menu_categories')
        .select('sort_order')
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

    const nextOrder = (maxOrderData?.sort_order ?? -1) + 1;

    const { error } = await supabase.from('menu_categories').insert({
        name,
        description,
        image_url,
        sort_order: nextOrder
    });

    if (error) throw new Error(error.message);
    revalidatePath('/menu');
    revalidatePath('/admin/menu');
}

export async function updateCategory(id: string, formData: FormData) {
    await requireAuth();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const image_url = formData.get('image_url') as string;

    const { error } = await supabase
        .from('menu_categories')
        .update({ name, description, image_url })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/menu');
    revalidatePath('/admin/menu');
}

export async function deleteCategory(id: string) {
    await requireAuth();

    const { error } = await supabase.from('menu_categories').delete().eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/menu');
    revalidatePath('/admin/menu');
}

// --- Menu Items ---

export async function getItemsByCategory(categoryId: string) {
    const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .eq('category_id', categoryId)
        .order('sort_order', { ascending: true });

    if (error) throw new Error(error.message);
    return data as MenuItem[];
}

export async function createItem(formData: FormData) {
    await requireAuth();

    const category_id = formData.get('category_id') as string;
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const image_url = formData.get('image_url') as string;
    const is_available = formData.get('is_available') === 'on';

    // Get max sort order for this category
    const { data: maxOrderData } = await supabase
        .from('menu_items')
        .select('sort_order')
        .eq('category_id', category_id)
        .order('sort_order', { ascending: false })
        .limit(1)
        .single();

    const nextOrder = (maxOrderData?.sort_order ?? -1) + 1;

    const { error } = await supabase.from('menu_items').insert({
        category_id,
        name,
        description,
        price,
        image_url,
        is_available,
        sort_order: nextOrder
    });

    if (error) throw new Error(error.message);
    revalidatePath('/menu');
    revalidatePath('/admin/menu');
}

export async function updateItem(id: string, formData: FormData) {
    await requireAuth();

    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const price = formData.get('price') as string;
    const image_url = formData.get('image_url') as string;
    const is_available = formData.get('is_available') === 'on';

    const { error } = await supabase
        .from('menu_items')
        .update({ name, description, price, image_url, is_available })
        .eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/menu');
    revalidatePath('/admin/menu');
}

export async function deleteItem(id: string) {
    await requireAuth();

    const { error } = await supabase.from('menu_items').delete().eq('id', id);

    if (error) throw new Error(error.message);
    revalidatePath('/menu');
    revalidatePath('/admin/menu');
}

// --- Reordering ---

export async function reorderCategories(items: { id: string; sort_order: number }[]) {
    await requireAuth();

    // Upsert allows us to update multiple rows if we pass primary keys
    const { error } = await supabase
        .from('menu_categories')
        .upsert(items, { onConflict: 'id' });

    if (error) throw new Error(error.message);
    revalidatePath('/menu');
    revalidatePath('/admin/menu');
}

export async function reorderItems(items: { id: string; sort_order: number; category_id: string }[]) {
    await requireAuth();

    // We need to include all required fields for upsert if it were an insert, but since it's an update on existing PKs, 
    // minimal fields (id + changes) usually work if the library supports partial upsert or we use update + Promise.all.
    // However, Supabase upsert expects a complete record or matching conflicts. 
    // To be safe and efficient with batch updates, we might need a stored procedure or just loop.
    // For small menus, looping is fine. For larger, we'd want a better approach.
    // Let's try Promise.all for now as it's simple and parallel.

    const updates = items.map(item =>
        supabase.from('menu_items').update({ sort_order: item.sort_order }).eq('id', item.id)
    );

    await Promise.all(updates);
    revalidatePath('/menu');
    revalidatePath('/admin/menu');
}
