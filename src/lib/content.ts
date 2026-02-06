import { supabase } from './supabase';

export type SiteContentMap = Record<string, any>;

// Cache for content
let contentCache: SiteContentMap | null = null;
let cacheTime: number = 0;
const CACHE_DURATION = 60 * 1000; // 1 minute

export async function getSiteContent(): Promise<SiteContentMap> {
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
    data?.forEach((item) => {
        contentMap[item.key] = item.value || {};
    });

    contentCache = contentMap;
    cacheTime = Date.now();

    return contentMap;
}

// Helper to get localized content
// logic: try locale -> try 'es' (default) -> try 'text' (legacy) -> fallback
export function getContent(content: SiteContentMap, key: string, fallback: string, locale: string = 'es'): string {
    const item = content[key];
    if (!item) return fallback;

    // 1. Try specific locale
    if (item[locale]) return item[locale];

    // 2. Try 'es' as default language
    if (item['es']) return item['es'];

    // 3. Try legacy 'text' field (migration support)
    if (item['text']) return item['text'];

    // 4. Try any first key if it looks like a string (desperation)
    // const values = Object.values(item);
    // if (values.length > 0 && typeof values[0] === 'string') return values[0] as string;

    return fallback;
}

export function isContentHidden(content: SiteContentMap, key: string): boolean {
    const item = content[key];
    return item?.hidden === true;
}

export function clearContentCache() {
    contentCache = null;
    cacheTime = 0;
}
