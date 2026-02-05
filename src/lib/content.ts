import { supabase } from './supabase';

export type SiteContentMap = Record<string, string>;

// Cache for content - avoids refetching on every page load
let contentCache: SiteContentMap | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

export async function getSiteContent(): Promise<SiteContentMap> {
    // Return cache if fresh
    if (contentCache && Date.now() - cacheTime < CACHE_DURATION) {
        return contentCache;
    }

    const { data, error } = await supabase
        .from('site_content')
        .select('key, value');

    if (error) {
        console.error('Error fetching site content:', error);
        return {};
    }

    const contentMap: SiteContentMap = {};
    data?.forEach((item: { key: string; value: { text?: string } }) => {
        contentMap[item.key] = item.value?.text || '';
    });

    // Update cache
    contentCache = contentMap;
    cacheTime = Date.now();

    return contentMap;
}

// Helper to get a single value with fallback
export function getContent(content: SiteContentMap, key: string, fallback: string): string {
    return content[key] || fallback;
}

// Clear cache (call after saving in admin)
export function clearContentCache() {
    contentCache = null;
    cacheTime = 0;
}
