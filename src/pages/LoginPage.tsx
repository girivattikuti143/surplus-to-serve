import React, { useState } from 'react';
import { 
  HeartHandshake, 
  LogIn, 
  Sparkles, 
  Lock, 
  Mail, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Utensils, 
  Building2, 
  Truck,
  ShieldAlert,
  UserCheck
} from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { UserRole } from '../types';

export const LoginPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { login, quickLogin } = useAuth();
  const { showToast } = useNotifications();

  // Active Role tab: 'admin' | 'volunteer' | 'ngo' | 'donor'
  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState<string>(DEMO_CREDENTIALS.admin.email);
  const [password, setPassword] = useState<string>(DEMO_CREDENTIALS.admin.password);
  const [loading, setLoading] = useState(false);

  const roleDetails: Record<UserRole, {
    title: string;
    subtitle: string;
    icon: any;
    color: string;
    border: string;
    badgeBg: string;
    btnColor: string;
    defaultEmail: string;
    name: string;
    details: string;
  }> = {
    admin: {
      title: 'Administrator Command Login',
      subtitle: 'System governance, user verification, NGO audits, and analytics',
      icon: ShieldCheck,
      color: 'text-purple-700',
      border: 'border-purple-300',
      badgeBg: 'bg-purple-100 text-purple-900',
      btnColor: 'bg-purple-800 hover:bg-purple-900',
      defaultEmail: 'admin@surplus.org',
      name: 'Dr. Sarah Mitchell',
      details: 'Super Administrator • Full Access'
    },
    volunteer: {
      title: 'Volunteer Delivery Pilot Login',
      subtitle: 'Accept food pickup tasks, turn-by-turn routing, and delivery confirmation',
      icon: Truck,
      color: 'text-amber-700',
      border: 'border-amber-300',
      badgeBg: 'bg-amber-100 text-amber-900',
      btnColor: 'bg-amber-700 hover:bg-amber-800',
      defaultEmail: 'volunteer@surplus.org',
      name: 'David Chen',
      details: 'Vehicle Pilot (Car/Bike) • 18 Deliveries'
    },
    ngo: {
      title: 'NGO & Shelter Hub Login',
      subtitle: 'Claim surplus food, request volunteer drivers, and inspect deliveries',
      icon: Building2,
      color: 'text-blue-700',
      border: 'border-blue-300',
      badgeBg: 'bg-blue-100 text-blue-900',
      btnColor: 'bg-blue-800 hover:bg-blue-900',
      defaultEmail: 'ngo@hopeharbor.org',
      name: 'Hope Harbor Community Kitchen',
      details: 'Certified NGO • 350 Daily Meal Capacity'
    },
    donor: {
      title: 'Food Donor Portal Login',
      subtitle: 'Post surplus edible meals, schedule volunteer pickups, and reduce food waste',
      icon: Utensils,
      color: 'text-emerald-700',
      border: 'border-emerald-300',
      badgeBg: 'bg-emerald-100 text-emerald-900',
      btnColor: 'bg-emerald-700 hover:bg-emerald-800',
      defaultEmail: 'donor@horizon.com',
      name: 'Grand Horizon Banquet & Hotel',
      details: 'Hotel / Restaurant Donor'
    }
  };

  const handleSelectRole = (role: UserRole) => {
    setSelectedRole(role);
    setEmail(DEMO_CREDENTIALS[role].email);
    setPassword(DEMO_CREDENTIALS[role].password);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await login(email, password);
      showToast(`Welcome back, ${user.name}!`, 'success');
      if (user.role === 'admin') onNavigate('admin-dashboard');
      else if (user.role === 'volunteer') onNavigate('volunteer-dashboard');
      else if (user.role === 'ngo') onNavigate('ngo-dashboard');
      else if (user.role === 'donor') onNavigate('donor-dashboard');
      else onNavigate('donations');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleInstantRoleLogin = async (role: UserRole) => {
    setLoading(true);
    try {
      await quickLogin(role);
      showToast(`Logged in as ${role.toUpperCase()}!`, 'success');
      if (role === 'admin') onNavigate('admin-dashboard');
      else if (role === 'volunteer') onNavigate('volunteer-dashboard');
      else if (role === 'ngo') onNavigate('ngo-dashboard');
      else if (role === 'donor') onNavigate('donor-dashboard');
    } catch (err: any) {
      showToast(err.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  const currentRole = roleDetails[selectedRole];
  const RoleIcon = currentRole.icon;

  return (
    <div className="min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
      <div className="max-w-xl w-full space-y-6 bg-white p-6 sm:p-10 rounded-3xl border border-stone-200 shadow-xl">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <HeartHandshake className="w-7 h-7 text-lime-300" />
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
            Surplus to Serve Portal
          </h2>
          <p className="text-xs text-stone-500">
            Select your dedicated role to sign in to your dashboard
          </p>
        </div>

        {/* 1. DEDICATED ROLE LOGIN TABS */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider text-center">
            Choose Your Login Gateway:
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {[
              { id: 'admin', label: 'Admin Login', icon: ShieldCheck, color: 'hover:border-purple-400' },
              { id: 'volunteer', label: 'Volunteer Login', icon: Truck, color: 'hover:border-amber-400' },
              { id: 'ngo', label: 'NGO Login', icon: Building2, color: 'hover:border-blue-400' },
              { id: 'donor', label: 'Donor Login', icon: Utensils, color: 'hover:border-emerald-400' },
            ].map(tab => {
              const TabIcon = tab.icon;
              const isSelected = selectedRole === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => handleSelectRole(tab.id as UserRole)}
                  className={`p-3 rounded-2xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${
                    isSelected
                      ? 'border-emerald-700 bg-emerald-50/80 text-emerald-950 font-bold shadow-xs ring-2 ring-emerald-600/30'
                      : 'border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  <TabIcon className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <span className="text-xs font-bold leading-tight">{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* 2. ROLE HIGHLIGHT BANNER */}
        <div className={`p-4 rounded-2xl border ${currentRole.border} bg-stone-50 flex items-center justify-between gap-3`}>
          <div className="flex items-center gap-3">
            <div className={`w-10 h-10 rounded-xl bg-white shadow-2xs flex items-center justify-center ${currentRole.color}`}>
              <RoleIcon className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs font-bold text-stone-900">{currentRole.title}</h3>
                <span className={`text-[10px] uppercase font-bold px-1.5 py-0.2 rounded-full ${currentRole.badgeBg}`}>
                  {selectedRole}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mt-0.5">
                {currentRole.details}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={() => handleInstantRoleLogin(selectedRole)}
            disabled={loading}
            className={`px-3.5 py-2 text-white text-xs font-bold rounded-xl shadow-xs transition cursor-pointer shrink-0 flex items-center gap-1.5 ${currentRole.btnColor}`}
          >
            <Sparkles className="w-3.5 h-3.5 text-lime-300" />
            <span>1-Click Test</span>
          </button>
        </div>

        {/* 3. LOGIN CREDENTIALS FORM */}
        <form onSubmit={handleSubmit} className="space-y-4 pt-1">
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3.5 text-white font-bold text-xs sm:text-sm rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 ${currentRole.btnColor}`}
          >
            <LogIn className="w-4 h-4" />
            <span>{loading ? 'Authenticating...' : `Sign In as ${selectedRole.toUpperCase()}`}</span>
          </button>
        </form>

        {/* Bottom Registration & Switcher info */}
        <div className="pt-2 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-500 gap-2">
          <span>New to Surplus to Serve?</span>
          <button
            onClick={() => onNavigate('register')}
            className="text-emerald-700 hover:underline font-bold cursor-pointer"
          >
            Register new NGO, Volunteer or Donor
          </button>
        </div>
      </div>
    </div>
  );
};
