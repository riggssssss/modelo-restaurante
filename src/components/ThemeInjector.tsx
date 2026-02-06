'use client';

import { getContent, SiteContentMap } from "@/lib/content";

export default function ThemeInjector({ content }: { content: SiteContentMap }) {
    if (!content) return null;

    // Use helper or direct access. Since getContent handles fallbacks, direct access might be cleaner for optional themes
    // But let's stick to the structure we know: { es: 'value' }

    const bg = content['design_bg']?.es;
    const text = content['design_text']?.es;
    const primary = content['design_primary']?.es;
    const primaryText = content['design_primary_text']?.es;
    const accent = content['design_accent']?.es;

    return (
        <style jsx global>{`
            :root {
                ${bg ? `--background: ${bg};` : ''}
                ${text ? `--foreground: ${text};` : ''}
                ${primary ? `--primary: ${primary};` : ''}
                ${primaryText ? `--primary-foreground: ${primaryText};` : ''}
                ${accent ? `--accent: ${accent};` : ''}
            }
        `}</style>
    );
}
