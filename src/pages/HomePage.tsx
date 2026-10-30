import React, { useState, useEffect } from 'react';
import { 
  HeartHandshake, 
  ArrowRight, 
  ShieldCheck, 
  Clock, 
  Truck, 
  Users, 
  Utensils, 
  Sparkles, 
  CheckCircle2, 
  Quote, 
  Building2, 
  Heart, 
  Leaf,
  ChevronRight,
  MapPin,
  AlertTriangle
} from 'lucide-react';
import { api } from '../lib/api';
import { SystemStats, Donation } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ExpiryCountdown } from '../components/ExpiryCountdown';
import { useAuth } from '../context/AuthContext';

interface HomePageProps {
  onNavigate: (page: string) => void;
  onOpenDbModal: () => void;
}

export const HomePage: React.FC<HomePageProps> = ({ onNavigate, onOpenDbModal }) => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SystemStats | null>(null);
  const [featuredDonations, setFeaturedDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsData, donationsData] = await Promise.all([
          api.getStats(),
          api.getDonations({ status: 'Available' }),
        ]);
        setStats(statsData);
        setFeaturedDonations(donationsData.slice(0, 3));
      } catch (err) {
        console.error('Failed to load home page data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleDonateClick = () => {
    if (!user) {
      onNavigate('login');
    } else if (user.role === 'donor') {
      onNavigate('donor-dashboard');
    } else {
      onNavigate('donations');
    }
  };

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-b from-emerald-950 via-emerald-900 to-emerald-950 text-white pt-16 pb-24 lg:pt-24 lg:pb-32">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(52,211,153,0.15),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(249,115,22,0.12),transparent_40%)]"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-800/80 border border-emerald-600/50 text-emerald-300 text-xs font-semibold backdrop-blur-xs">
                <Leaf className="w-3.5 h-3.5 text-lime-400" />
                <span>Zero Hunger Mission • Direct Community Redistribution</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight leading-tight sm:leading-tight">
                Don’t Waste Food, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-200">
                  Share Hope.
                </span>
              </h1>

              <p className="text-base sm:text-lg text-emerald-100/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Surplus to Serve bridges the gap between restaurants, hotels, bakeries, and community food banks. We ensure surplus edible food reaches vulnerable families within hours, safely and seamlessly.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4">
                <button
                  onClick={handleDonateClick}
                  className="w-full sm:w-auto px-7 py-3.5 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold rounded-xl shadow-lg hover:shadow-lime-400/20 transition-all flex items-center justify-center gap-2 cursor-pointer transform hover:-translate-y-0.5"
                >
                  <Utensils className="w-5 h-5" />
                  <span>Donate Food</span>
                </button>
                <button
                  onClick={() => onNavigate('donations')}
                  className="w-full sm:w-auto px-7 py-3.5 bg-emerald-800/80 hover:bg-emerald-700/80 text-white font-semibold rounded-xl border border-emerald-600 transition flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Find Available Food</span>
                  <ArrowRight className="w-4 h-4 text-emerald-300" />
                </button>
              </div>

              {/* Micro Trust Indicators */}
              <div className="pt-6 border-t border-emerald-800/60 grid grid-cols-3 gap-4 text-center lg:text-left">
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white font-serif">100%</p>
                  <p className="text-xs text-emerald-200">Free Redistribution</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white font-serif">&lt; 3 Hours</p>
                  <p className="text-xs text-emerald-200">Average Transit Time</p>
                </div>
                <div>
                  <p className="text-xl sm:text-2xl font-black text-white font-serif">FSSAI / FDA</p>
                  <p className="text-xs text-emerald-200">Food Safety Compliant</p>
                </div>
              </div>
            </div>

            {/* Right Card / Visual Showcase */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md bg-stone-900/90 border border-emerald-500/30 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
                <div className="flex items-center justify-between pb-4 border-b border-stone-800">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-emerald-500 animate-ping"></span>
                    <span className="text-xs font-semibold text-emerald-300 uppercase tracking-wider">
                      Live Surplus Radar
                    </span>
                  </div>
                  <span className="text-xs text-stone-400">Metro City Area</span>
                </div>

                <div className="mt-4 space-y-4">
                  {/* Mock real card showcase */}
                  <div className="bg-stone-800/80 rounded-2xl p-4 border border-stone-700 space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-bold text-lime-400 uppercase tracking-wider">
                          Hot Prepared Meal
                        </span>
                        <h4 className="text-sm font-bold text-white">Grand Horizon Banquet Buffet</h4>
                      </div>
                      <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        60 Servings
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-xs text-stone-300">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                        Financial District
                      </span>
                      <span className="flex items-center gap-1 text-orange-400 font-medium">
                        <Clock className="w-3.5 h-3.5" />
                        Exp in 3h 15m
                      </span>
                    </div>
                    <div className="w-full bg-stone-700 rounded-full h-1.5 overflow-hidden">
                      <div className="bg-gradient-to-r from-lime-400 to-emerald-500 h-1.5 rounded-full w-3/4"></div>
                    </div>
                  </div>

                  {/* Impact Quick Fact */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-emerald-900/60 to-emerald-950/80 border border-emerald-800/80 text-xs text-emerald-200 flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-lime-400 shrink-0" />
                    <p>
                      <strong>Volunteer Network Active:</strong> Over 12 registered drivers on standby to transport freshly packaged meals today.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Real-Time Dynamic Statistics Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-16 sm:-mt-20 relative z-20">
        <div className="bg-white rounded-3xl shadow-xl border border-stone-200 p-6 sm:p-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-100">
            {/* Stat 1 */}
            <div className="text-center pt-4 sm:pt-0">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto mb-3">
                <Utensils className="w-6 h-6 text-emerald-700" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
                {stats?.rescuedMeals || 250}+
              </p>
              <p className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
                Surplus Meals Rescued
              </p>
            </div>

            {/* Stat 2 */}
            <div className="text-center pt-4 sm:pt-0 sm:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center mx-auto mb-3">
                <Building2 className="w-6 h-6 text-blue-700" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
                {stats?.totalNgos || 2}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
                Verified NGO Shelters
              </p>
            </div>

            {/* Stat 3 */}
            <div className="text-center pt-4 sm:pt-0 sm:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center mx-auto mb-3">
                <Truck className="w-6 h-6 text-amber-800" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
                {stats?.totalVolunteers || 2}
              </p>
              <p className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
                Active Volunteer Drivers
              </p>
            </div>

            {/* Stat 4 */}
            <div className="text-center pt-4 sm:pt-0 sm:pl-6">
              <div className="w-12 h-12 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto mb-3">
                <Leaf className="w-6 h-6 text-teal-700" />
              </div>
              <p className="text-3xl sm:text-4xl font-extrabold text-stone-900 font-serif">
                {stats?.co2SavedKg || 250} kg
              </p>
              <p className="text-xs sm:text-sm font-semibold text-stone-600 mt-1">
                CO₂ Emissions Prevented
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Urgent Available Food Right Now */}
      {featuredDonations.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <span>Immediate Hunger Relief</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900">
                Fresh Surplus Food Ready for Pickup
              </h2>
            </div>
            <button
              onClick={() => onNavigate('donations')}
              className="text-emerald-700 hover:text-emerald-800 font-bold text-sm flex items-center gap-1 cursor-pointer group"
            >
              <span>View All Available Food</span>
              <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition" />
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {featuredDonations.map(donation => (
              <div
                key={donation.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-lg transition-all group flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full overflow-hidden bg-stone-100">
                    <img
                      src={donation.imageUrl}
                      alt={donation.foodName}
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={donation.status} size="sm" />
                    </div>
                    <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-semibold">
                      {donation.servings} Servings
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs text-stone-500">
                      <span className="font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
                        {donation.category}
                      </span>
                      <ExpiryCountdown expiryTime={donation.expiryTime} compact />
                    </div>

                    <h3 className="font-bold text-stone-900 text-base line-clamp-1 group-hover:text-emerald-700 transition">
                      {donation.foodName}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {donation.quantity} • {donation.pickupInstructions || 'Clean food packed in certified containers.'}
                    </p>

                    <div className="pt-2 border-t border-stone-100 text-xs text-stone-500 flex items-center justify-between">
                      <span className="truncate">{donation.donorName}</span>
                      <span className="font-medium text-stone-700">{donation.donorCity}</span>
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => onNavigate('donations')}
                    className="w-full py-2.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <span>View Details & Request</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. Complete Food Donation Workflow */}
      <section className="bg-stone-100/70 py-16 border-y border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
              Seamless 10-Step Lifecycle
            </span>
            <h2 className="text-3xl font-extrabold text-stone-900 font-serif">
              How Surplus Food Moves from Kitchen to Beneficiary
            </h2>
            <p className="text-sm text-stone-600">
              Designed with strict hygiene checks, automated volunteer dispatch, and live status confirmation.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {[
              { step: '01', title: 'Donor Posts Surplus', desc: 'Hotel or restaurant inputs food type, servings, temperature, and safe expiry deadline.', icon: Utensils },
              { step: '02', title: 'Food Safety Check', desc: 'System verifies hygiene declaration and automatically starts countdown timer.', icon: ShieldCheck },
              { step: '03', title: 'NGO Instant Claim', desc: 'Local shelter or community kitchen accepts donation based on daily meal needs.', icon: Building2 },
              { step: '04', title: 'Volunteer Dispatch', desc: 'Nearby verified volunteer drivers claim the pickup task with route details.', icon: Truck },
              { step: '05', title: 'Confirmed Delivery', desc: 'NGO inspects and accepts food. Both parties rate and verify the impact.', icon: CheckCircle2 },
            ].map(item => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="bg-white rounded-2xl p-6 border border-stone-200 shadow-2xs space-y-3 relative overflow-hidden group hover:border-emerald-300 transition">
                  <span className="text-3xl font-black text-stone-200 group-hover:text-emerald-100 transition font-serif absolute -bottom-2 right-2">
                    {item.step}
                  </span>
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-stone-900 text-sm">{item.title}</h4>
                  <p className="text-xs text-stone-600 leading-relaxed">{item.desc}</p>
                </div>
              );
            })}
          </div>

          <div className="text-center">
            <button
              onClick={() => onNavigate('how-it-works')}
              className="px-6 py-3 bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold rounded-xl transition cursor-pointer inline-flex items-center gap-2"
            >
              <span>Explore Detailed Food Safety Protocols</span>
              <ArrowRight className="w-4 h-4 text-emerald-400" />
            </button>
          </div>
        </div>
      </section>

      {/* 5. Why Choose Us Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto space-y-3 mb-12">
          <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-100 px-3 py-1 rounded-full">
            Key Pillars
          </span>
          <h2 className="text-3xl font-extrabold text-stone-900 font-serif">
            Why Donors & NGOs Rely on Surplus to Serve
          </h2>
          <p className="text-sm text-stone-600">
            A comprehensive, technology-driven platform built for speed, safety, and measurable social impact.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-2xs space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center">
              <Clock className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Automated Expiry Alerts</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Donations approaching their critical shelf-life are flagged with high-visibility urgency badges, ensuring they are prioritized by volunteers before spoilage.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-2xs space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-800 flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Rigorous Food Safety Standards</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              All donors confirm hygiene compliance, preparation time, and temperature maintenance. Expired items are automatically locked from distribution.
            </p>
          </div>

          <div className="bg-white rounded-2xl p-8 border border-stone-200 shadow-2xs space-y-4 hover:shadow-md transition">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center">
              <Truck className="w-6 h-6 text-amber-800" />
            </div>
            <h3 className="text-lg font-bold text-stone-900">Volunteer Fleet Logistics</h3>
            <p className="text-xs text-stone-600 leading-relaxed">
              Equipped with turn-by-turn pickup and drop-off records, vehicle type matching, and delivery proof verification for uninterrupted supply chains.
            </p>
          </div>
        </div>
      </section>

      {/* 6. Success Stories / Testimonials */}
      <section className="bg-emerald-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <Quote className="w-10 h-10 text-lime-400 mx-auto opacity-70" />
            <h2 className="text-3xl font-extrabold font-serif">Stories from the Frontlines</h2>
            <p className="text-sm text-emerald-200">
              Real partners sharing how zero-waste logistics feeds their local communities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-emerald-800/60 rounded-2xl p-6 border border-emerald-700/60 space-y-4">
              <p className="text-xs text-emerald-100 leading-relaxed italic">
                “Before Surplus to Serve, our banquet facility had to discard 40-50 kg of untouched gourmet food weekly. Now, Hope Harbor Kitchen receives it fresh within 90 minutes. It brings immense joy to our culinary team.”
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-emerald-700">
                <img
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?w=100&auto=format&fit=crop&q=80"
                  alt="Hotel Manager"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">Chef Raymond Silva</h4>
                  <p className="text-[11px] text-emerald-300">Executive Chef, Grand Horizon Hotel</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-800/60 rounded-2xl p-6 border border-emerald-700/60 space-y-4">
              <p className="text-xs text-emerald-100 leading-relaxed italic">
                “We serve 300+ hot meals daily to unhoused youth and elderly citizens. Having scheduled surplus donations drastically cut our ingredient expenses and allowed us to expand our shelter outreach.”
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-emerald-700">
                <img
                  src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=100&auto=format&fit=crop&q=80"
                  alt="NGO Leader"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">Rev. Martha Owens</h4>
                  <p className="text-[11px] text-emerald-300">Director, Hope Harbor Kitchen</p>
                </div>
              </div>
            </div>

            <div className="bg-emerald-800/60 rounded-2xl p-6 border border-emerald-700/60 space-y-4">
              <p className="text-xs text-emerald-100 leading-relaxed italic">
                “I volunteer on Saturday mornings with my car. Picking up 15 trays of bread and pasta and handing them to happy children at the shelter is the most rewarding 2 hours of my week.”
              </p>
              <div className="flex items-center gap-3 pt-2 border-t border-emerald-700">
                <img
                  src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80"
                  alt="Volunteer Driver"
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xs font-bold text-white">David Chen</h4>
                  <p className="text-[11px] text-emerald-300">Volunteer Driver (14 Deliveries)</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 7. Call To Action Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 text-white p-8 sm:p-12 shadow-xl flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-3 text-center md:text-left">
            <h3 className="text-2xl sm:text-3xl font-extrabold font-serif">
              Ready to Turn Surplus Food into Smiles?
            </h3>
            <p className="text-emerald-100 text-sm max-w-xl">
              Join thousands of responsible food donors, certified NGOs, and volunteer drivers in your city. It takes less than 2 minutes to get started.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-3 shrink-0">
            <button
              onClick={() => onNavigate('register')}
              className="px-6 py-3 bg-white hover:bg-stone-100 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md"
            >
              Register Your Organization
            </button>
            <button
              onClick={onOpenDbModal}
              className="px-5 py-3 bg-emerald-900/60 hover:bg-emerald-900 text-white font-medium text-xs sm:text-sm rounded-xl border border-emerald-500/40 transition cursor-pointer"
            >
              Inspect MongoDB Schema
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};
