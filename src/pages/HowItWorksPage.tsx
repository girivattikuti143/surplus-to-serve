import React from 'react';
import { 
  Utensils, 
  ShieldCheck, 
  Building2, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Thermometer, 
  AlertTriangle,
  ArrowRight,
  Sparkles,
  Layers,
  HeartHandshake
} from 'lucide-react';

export const HowItWorksPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const steps = [
    { num: '01', title: 'Donor Registers & Logs In', desc: 'Restaurants, hotels, supermarkets, or caterers create a verified donor profile.', icon: Utensils, role: 'Donor' },
    { num: '02', title: 'Donor Posts Surplus Details', desc: 'Inputs food title, quantity, category, servings, preparation time, temperature, and safe expiry deadline.', icon: Clock, role: 'Donor' },
    { num: '03', title: 'Listing Broadcast to NGOs', desc: 'Instant radar notification is pushed to verified shelters within the donor’s city zone.', icon: Sparkles, role: 'System' },
    { num: '04', title: 'NGO Reviews Food Board', desc: 'Shelters filter donations by category, distance, and expiry countdown to match their meal schedules.', icon: Building2, role: 'NGO' },
    { num: '05', title: 'NGO Claims the Donation', desc: 'Status updates to "Accepted". The food is reserved exclusively for the recipient organization.', icon: CheckCircle2, role: 'NGO' },
    { num: '06', title: 'Volunteer Dispatched', desc: 'Nearby verified volunteer drivers receive pickup task with turn-by-turn route and packaging guidelines.', icon: Truck, role: 'Volunteer' },
    { num: '07', title: 'Food Collected from Donor', desc: 'Volunteer marks "Picked Up" after confirming proper thermal containers and seal hygiene.', icon: ArrowRight, role: 'Volunteer' },
    { num: '08', title: 'Delivered to NGO Shelter', desc: 'Volunteer safely transports and marks "Delivered" at the community kitchen loading bay.', icon: Building2, role: 'Volunteer' },
    { num: '09', title: 'NGO Confirms Quality', desc: 'NGO staff inspects food temperature, accepts the delivery, and submits donor feedback.', icon: ShieldCheck, role: 'NGO' },
    { num: '10', title: 'Donation Completed', desc: 'System archives delivery record, computes CO₂ emission savings, and increments meal rescue stats.', icon: HeartHandshake, role: 'Completed' },
  ];

  return (
    <div className="space-y-16 py-10">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100 px-3.5 py-1.5 rounded-full inline-block">
          Complete Food Redistribution Cycle
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-stone-900 font-serif max-w-3xl mx-auto">
          The 10-Step Food Rescue Workflow
        </h1>
        <p className="text-stone-600 text-base max-w-2xl mx-auto leading-relaxed">
          From kitchen preparation to beneficiary plates — an automated, temperature-monitored, transparent supply chain engineered for safety.
        </p>
      </section>

      {/* 10 Step Interactive Cards */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          {steps.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="bg-white rounded-2xl p-5 border border-stone-200 shadow-2xs space-y-3 relative overflow-hidden group hover:border-emerald-500 hover:shadow-md transition"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl font-black text-stone-300 group-hover:text-emerald-600 transition font-serif">
                    {s.num}
                  </span>
                  <span className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full ${
                    s.role === 'Donor' ? 'bg-emerald-100 text-emerald-800' :
                    s.role === 'NGO' ? 'bg-blue-100 text-blue-800' :
                    s.role === 'Volunteer' ? 'bg-amber-100 text-amber-800' :
                    'bg-purple-100 text-purple-800'
                  }`}>
                    {s.role}
                  </span>
                </div>

                <div className="w-9 h-9 rounded-xl bg-stone-50 border border-stone-200 text-stone-700 flex items-center justify-center group-hover:bg-emerald-50 group-hover:text-emerald-700 transition">
                  <Icon className="w-4 h-4" />
                </div>

                <h3 className="font-bold text-stone-900 text-sm leading-snug">{s.title}</h3>
                <p className="text-xs text-stone-500 leading-relaxed">{s.desc}</p>
              </div>
            );
          })}
        </div>
      </section>

      {/* Food Safety & Hygiene Requirements */}
      <section className="bg-stone-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-lime-400">
              Food Safety Protocols
            </span>
            <h2 className="text-3xl font-extrabold font-serif">
              Stringent Standards for Human Consumption
            </h2>
            <p className="text-xs sm:text-sm text-stone-300">
              Surplus to Serve enforces strict quality checks aligned with municipal health codes and food safety regulations.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-red-500/20 text-red-400 flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-red-400" />
              </div>
              <h3 className="font-bold text-white text-base">Hot Foods (&gt; 60°C)</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Must be stored in thermal chafing dishes or insulated containers. Must be picked up and distributed within 4 hours of preparation.
              </p>
            </div>

            <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
                <Thermometer className="w-5 h-5 text-blue-400" />
              </div>
              <h3 className="font-bold text-white text-base">Chilled & Dairy (&lt; 4°C)</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Cold cuts, dairy items, salads, and prepared yogurts must be kept refrigerated and transported in cooler boxes.
              </p>
            </div>

            <div className="bg-stone-800/80 rounded-2xl p-6 border border-stone-700 space-y-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-emerald-400" />
              </div>
              <h3 className="font-bold text-white text-base">Automatic Expiry Discard</h3>
              <p className="text-xs text-stone-400 leading-relaxed">
                Any donation reaching its specified expiry time is automatically locked by the system to prevent accidental distribution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Role CTA */}
      <section className="max-w-4xl mx-auto px-4 text-center space-y-6">
        <h3 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
          Ready to Participate in the Food Rescue Cycle?
        </h3>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={() => onNavigate('register')}
            className="px-6 py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer"
          >
            Register as Donor or NGO
          </button>
          <button
            onClick={() => onNavigate('donations')}
            className="px-6 py-3 bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs sm:text-sm rounded-xl border border-stone-200 transition cursor-pointer"
          >
            Browse Active Donations
          </button>
        </div>
      </section>
    </div>
  );
};
