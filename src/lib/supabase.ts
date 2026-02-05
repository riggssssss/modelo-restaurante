import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
