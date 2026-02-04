import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen p-4 md:p-8 flex items-center justify-center">
      {/* 
        Container: 
        - Max width restricted 
        - grid layout (1 col mobile, 2 cols desktop)
        - 'Card' look isn't explicitly in the image but usually these layouts are either full bleed or contained. 
          The 'Woltex' image shows a card-like floating structure with rounded corners. 
      */}
      <div className="w-full max-w-[1600px] bg-transparent grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 h-[calc(100vh-4rem)] min-h-[600px]">

        {/* LEFT COLUMN: Content & Typography */}
        <div className="relative flex flex-col justify-between p-6 md:p-12 rounded-[2rem] bg-[#F8F5EE]">
          {/* Header / Nav */}
          <header className="flex justify-between items-center w-full">
            <div className="text-xl font-bold tracking-tight">KEKO.</div>
            <nav className="hidden md:flex gap-6 text-sm font-medium uppercase tracking-wider opacity-70">
              <a href="/about" className="hover:opacity-100">About</a>
              <a href="/menu" className="hover:opacity-100">Menu</a>
              <a href="/reservations" className="hover:opacity-100">Bookings</a>
            </nav>
            <div className="md:hidden">
              {/* Mobile Menu Icon Placeholder */}
              <div className="space-y-1.5 cursor-pointer">
                <div className="w-6 h-0.5 bg-current"></div>
                <div className="w-6 h-0.5 bg-current"></div>
              </div>
            </div>
          </header>

          {/* Main Content */}
          <div className="mt-12 mb-auto space-y-8">
            {/* Badge */}
            <div className="inline-block bg-[#EEDD4A] px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider text-black mb-4">
              New Opening 2026
            </div>

            <h1 className="text-6xl md:text-7xl lg:text-8xl font-serif leading-[0.9] tracking-tight">
              Critically <br />
              <span className="italic">acclaimed</span> <br />
              cuisine.
            </h1>

            <p className="max-w-md text-lg text-neutral-600 leading-relaxed">
              Don&apos;t just take our word for it. Experience the flavors that have everyone talking.
              A meeting place for food lovers, friends, and everyone in between.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <a href="/reservations" className="px-8 py-4 bg-black text-white rounded-full font-medium hover:bg-neutral-800 transition-all text-center">
                Reserve Table
              </a>
              <a href="/menu" className="px-8 py-4 border border-black rounded-full font-medium hover:bg-black/5 transition-all text-center">
                View Menu
              </a>
            </div>
          </div>

          {/* Footer / Bottom Text */}
          <div className="mt-8 text-xs text-neutral-400 uppercase tracking-widest">
            Based in Madrid &mdash; Est. 2026
          </div>
        </div>

        {/* RIGHT COLUMN: Visuals */}
        <div className="relative rounded-[2rem] overflow-hidden bg-neutral-200">
          {/* Placeholder for Main Image */}
          <div className="absolute inset-0 bg-neutral-300">
            {/* Abstract / Gradient Placeholder or specific solid color 
                  In a real scenario, <Image src="..." fill className="object-cover" /> goes here.
              */}
            <div className="w-full h-full bg-[url('https://images.unsplash.com/photo-1559339352-11d035aa65de?q=80&w=1974&auto=format&fit=crop')] bg-cover bg-center grayscale-[20%] hover:grayscale-0 transition-all duration-700 hover:scale-105"></div>
          </div>

          {/* Overlay Content (if any) */}
          <div className="absolute bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 p-6 rounded-2xl max-w-xs text-white hidden md:block">
            <p className="text-sm font-medium">&quot;The best dining experience in the city.&quot;</p>
            <div className="mt-2 text-xs opacity-70">&mdash; The Food Guide</div>
          </div>
        </div>

      </div>
    </main>
  );
}
