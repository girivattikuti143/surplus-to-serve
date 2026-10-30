import React from 'react';
import { HeartHandshake, ShieldCheck, Mail, Phone, MapPin, ExternalLink, Heart, Globe, Award, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: string) => void;
  onOpenDbModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate, onOpenDbModal }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-stone-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-emerald-600 flex items-center justify-center text-white shadow-md">
                <HeartHandshake className="w-5 h-5 text-lime-300" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-serif">
                Surplus<span className="text-emerald-400">to</span>Serve
              </span>
            </div>
            <p className="text-stone-400 text-sm leading-relaxed max-w-sm">
              Connecting generous food donors, certified NGOs, and dedicated volunteer drivers to rescue surplus edible food and deliver warmth and nutrition to vulnerable families.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs font-semibold text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                <span>100% Food Safety Certified</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-stone-800 border border-stone-700 text-xs font-semibold text-lime-400">
                <Award className="w-4 h-4" />
                <span>SDG 2 Zero Hunger</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Navigation</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('home')} className="hover:text-emerald-400 transition cursor-pointer">Home</button>
              </li>
              <li>
                <button onClick={() => onNavigate('donations')} className="hover:text-emerald-400 transition cursor-pointer">Available Food</button>
              </li>
              <li>
                <button onClick={() => onNavigate('how-it-works')} className="hover:text-emerald-400 transition cursor-pointer">How It Works</button>
              </li>
              <li>
                <button onClick={() => onNavigate('about')} className="hover:text-emerald-400 transition cursor-pointer">About Us</button>
              </li>
              <li>
                <button onClick={() => onNavigate('contact')} className="hover:text-emerald-400 transition cursor-pointer">Contact Support</button>
              </li>
            </ul>
          </div>

          {/* Dashboards */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Role Portals</h4>
            <ul className="space-y-2 text-sm text-stone-400">
              <li>
                <button onClick={() => onNavigate('donor-dashboard')} className="hover:text-emerald-400 transition cursor-pointer">Donor Dashboard</button>
              </li>
              <li>
                <button onClick={() => onNavigate('ngo-dashboard')} className="hover:text-emerald-400 transition cursor-pointer">NGO Dashboard</button>
              </li>
              <li>
                <button onClick={() => onNavigate('volunteer-dashboard')} className="hover:text-emerald-400 transition cursor-pointer">Volunteer Portal</button>
              </li>
              <li>
                <button onClick={() => onNavigate('admin-dashboard')} className="hover:text-emerald-400 transition cursor-pointer">Admin Command Center</button>
              </li>
              <li>
                <button onClick={onOpenDbModal} className="text-emerald-400 hover:text-emerald-300 font-medium flex items-center gap-1 cursor-pointer">
                  <span>MongoDB Engine Specs</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase">Contact Center</h4>
            <div className="space-y-2.5 text-xs text-stone-400">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>100 Social Impact Plaza, Metro City, CA 90001</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Toll-Free Helpline: 1800-SURPLUS</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>support@surplustoserve.org</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© {new Date().getFullYear()} Surplus to Serve. All rights reserved. Fighting food hunger & reducing landfill emissions.</p>
          <div className="flex items-center gap-2">
            <span>Designed for B.Tech Final Year Academic Project</span>
            <span>•</span>
            <span className="text-emerald-400 font-medium">React + Express + MongoDB</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
