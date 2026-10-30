import React from 'react';
import { 
  HeartHandshake, 
  Leaf, 
  ShieldCheck, 
  Award, 
  Users, 
  Target, 
  Globe2, 
  CheckCircle2, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const AboutPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  return (
    <div className="space-y-16 py-10">
      {/* Hero Header */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full inline-block">
          Our Mission & Humanitarian Vision
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-serif max-w-3xl mx-auto leading-tight">
          Transforming Food Waste into Nourishment & Hope
        </h1>
        <p className="text-stone-600 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
          Surplus to Serve was built to solve a heartbreaking paradox: while billions of kilograms of wholesome food are discarded daily by hospitality and retail sectors, millions sleep on empty stomachs.
        </p>
      </section>

      {/* The Crisis in Numbers */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
              The Urgent Global Reality
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif">
              Why We Must Act Today
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-2">
              <span className="text-4xl font-black text-lime-400 font-serif">1.3B</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Tonnes of Food Wasted Annually</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Roughly one-third of all food produced globally for human consumption is lost or wasted each year.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-2">
              <span className="text-4xl font-black text-emerald-400 font-serif">828M</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">People Facing Chronic Hunger</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Even 25% of the food currently wasted globally could feed all hungry people in the world.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-stone-800/80 border border-stone-700 space-y-2">
              <span className="text-4xl font-black text-teal-400 font-serif">10%</span>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Of Global Greenhouse Gases</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Food decomposing in municipal landfills releases potent methane gas, driving accelerated climate change.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="text-center max-w-2xl mx-auto space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
            Our Guiding Philosophy
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 font-serif">
            Built on Integrity, Speed & Compassion
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Uncompromising Food Safety</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Every donation requires safety declarations and temperature tracking. Our algorithms auto-expire and retire listings before any risk of contamination occurs.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <Target className="w-5 h-5 text-blue-700" />
              </div>
            <h3 className="font-bold text-stone-900 text-base">Zero Barriers to Distribution</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              The platform is 100% free for charitable organizations, shelter kitchens, and donors. No hidden transaction fees, ever.
            </p>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Users className="w-5 h-5 text-amber-700" />
            </div>
            <h3 className="font-bold text-stone-900 text-base">Community Volunteer Fleets</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              We empower regular citizens to become logistics champions, delivering meals with their bikes, cars, and vans to bridge distance gaps.
            </p>
          </div>
        </div>
      </section>

      {/* Sustainable Development Goals Alignment */}
      <section className="bg-emerald-50/70 border-y border-emerald-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider">
                United Nations SDG Alignment
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-emerald-950 font-serif">
                Directly Advancing Global Goals 2 & 12
              </h3>
              <p className="text-xs text-emerald-800 max-w-xl">
                Surplus to Serve contributes directly to <strong>SDG 2 (Zero Hunger)</strong> by redistributing fresh food to vulnerable groups and <strong>SDG 12 (Responsible Consumption & Production)</strong> by slashing municipal organic waste.
              </p>
            </div>

            <div className="flex items-center gap-4 shrink-0">
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs text-center w-32">
                <span className="text-2xl font-black text-amber-600 font-serif block">SDG 2</span>
                <span className="text-[11px] font-bold text-stone-700">Zero Hunger</span>
              </div>
              <div className="p-4 rounded-2xl bg-white border border-emerald-200 shadow-xs text-center w-32">
                <span className="text-2xl font-black text-emerald-600 font-serif block">SDG 12</span>
                <span className="text-[11px] font-bold text-stone-700">Responsible Consumption</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-4">
        <h3 className="text-2xl font-bold text-stone-900 font-serif">
          Join Hands with Surplus to Serve
        </h3>
        <p className="text-xs text-stone-600 max-w-md mx-auto leading-relaxed">
          Whether you are a chef with excess banquet food, a shelter needing daily provisions, or a driver with an hour to spare, your help changes lives.
        </p>
        <button
          onClick={() => onNavigate('register')}
          className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer inline-flex items-center gap-2"
        >
          <span>Join the Movement</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </section>
    </div>
  );
};
