
import TransitionLink from "@/components/TransitionLink";
import { getSiteContent, getContent, isContentHidden } from "@/lib/content";
import HomeHeader from "@/components/HomeHeader";

export const revalidate = 60; // Revalidate every 60 seconds

export default async function Home() {
  const content = await getSiteContent();

  // Helper with fallbacks
  const c = (key: string, fallback: string) => getContent(content, key, fallback);
  const hidden = (key: string) => isContentHidden(content, key);

  return (
    <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      <div className="w-full max-w-[1600px] bg-transparent grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 h-[calc(100vh-4rem)] min-h-[600px]">

        {/* LEFT COLUMN: Content & Typography */}
        <div className="relative flex flex-col justify-between p-6 md:p-12 rounded-[2rem] bg-[#F8F5EE]">
          {/* Interactive Header Component */}
          <HomeHeader content={content} />

          {/* Main Content */}
          <div className="mt-12 mb-auto space-y-8">
            {/* Badge */}
            {!hidden('home_badge') && (
              <div className="inline-block bg-[#EEDD4A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black mb-4">
                {c('home_badge', 'Apertura 2026')}
              </div>
            )}

            {!hidden('home_title') && (
              <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[1] tracking-tight flex flex-wrap gap-x-5">
                {c('home_title', 'Hora de comer').split(' ').map((word: string, i: number) => (
                  <span key={i} className={i === 1 ? 'italic' : ''}>
                    {word}
                  </span>
                ))}
              </h1>
            )}

            {!hidden('home_subtitle') && (
              <p className="max-w-md text-lg text-neutral-600 leading-relaxed">
                {c('home_subtitle', "No te fíes solo de nuestra palabra. Ven a probar los sabores de los que todo Madrid habla. Un lugar de encuentro para amantes de la comida y amigos.")}
              </p>
            )}

            <div className="flex flex-wrap gap-4 pt-4">
              {!hidden('home_cta_1') && (
                <TransitionLink href="/reservations" className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-all text-center">
                  {c('home_cta_1', 'Reservar Mesa')}
                </TransitionLink>
              )}
              {!hidden('home_cta_2') && (
                <TransitionLink href="/menu" className="px-8 py-4 border border-black rounded-full font-medium hover:bg-black/5 transition-all text-center">
                  {c('home_cta_2', 'Ver Carta')}
                </TransitionLink>
              )}
            </div>
          </div>

          {/* Footer / Bottom Text */}
          {!hidden('home_footer') && (
            <div className="mt-8 text-xs text-neutral-400 uppercase tracking-widest">
              {c('home_footer', 'Madrid — Est. 2026')}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Visuals */}
        {!hidden('home_hero_image') && (
          <div className="relative rounded-[2rem] overflow-hidden bg-neutral-200">
            <div className="absolute inset-0 bg-neutral-300">
              <div
                className="w-full h-full bg-cover bg-center grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"
                style={{ backgroundImage: `url('${c('home_hero_image', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')}')` }}
              ></div>
            </div>

            {/* Overlay Content */}
            {!hidden('home_quote') && (
              <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-xs text-white hidden md:block">
                <p className="text-sm font-medium">&quot;{c('home_quote', 'La mejor experiencia gastronómica de la ciudad.')}&quot;</p>
                <div className="mt-2 text-xs opacity-70">&mdash; {c('home_quote_author', 'Guía Gastronómica')}</div>
              </div>
            )}
          </div>
        )}

      </div>
    </main>
  );
}
