import { createClient } from '@supabase/supabase-js';

// Helper to get credentials from environment or localStorage
const getSupabaseCredentials = () => {
    // Default to env vars
    let url = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    let key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

    // If client-side, check for overrides
    if (typeof window !== 'undefined') {
        const storedUrl = localStorage.getItem('supabase_url');
        const storedKey = localStorage.getItem('supabase_key');
        if (storedUrl) url = storedUrl;
        if (storedKey) key = storedKey;
    }

    return { url, key };
};

const { url, key } = getSupabaseCredentials();

export const supabase = createClient(url, key);

// Type definitions for our tables
export interface SiteContent {
    id: string;
    key: string;
    value: Record<string, unknown>;
    updated_at: string;
}

export interface MenuItem {
    id: string;
    name: string;
    description: string | null;
    price: number | null;
    image_url: string | null;
    category: string | null;
    sort_order: number;
    created_at: string;
}

export interface Review {
    id: string;
    author: string;
    text: string;
    rating: number;
    created_at: string;
}

export interface MenuCategory {
    id: string;
    name: string;
    sort_order: number;
    image_url?: string;
}
