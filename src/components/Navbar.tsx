import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Bell, 
  User as UserIcon, 
  LogOut, 
  Menu, 
  X, 
  Database, 
  Check, 
  LayoutDashboard, 
  Sparkles, 
  ArrowRight,
  ShieldCheck,
  Package,
  Layers,
  Navigation
} from 'lucide-react';
import { useAuth, DEMO_CREDENTIALS } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { UserRole } from '../types';

interface NavbarProps {
  currentPage: string;
  onNavigate: (page: string) => void;
  onOpenDbModal: () => void;
  onOpenMap?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onNavigate, onOpenDbModal, onOpenMap }) => {
  const { user, logout, quickLogin } = useAuth();
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [roleSwitcherOpen, setRoleSwitcherOpen] = useState(false);

  const getDashboardPage = (role?: UserRole): string => {
    switch (role) {
      case 'donor': return 'donor-dashboard';
      case 'ngo': return 'ngo-dashboard';
      case 'volunteer': return 'volunteer-dashboard';
      case 'admin': return 'admin-dashboard';
      default: return 'donations';
    }
  };

  const getRoleBadgeStyle = (role?: UserRole) => {
    switch (role) {
      case 'donor': return 'bg-emerald-100 text-emerald-800 border-emerald-300';
      case 'ngo': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'volunteer': return 'bg-amber-100 text-amber-800 border-amber-300';
      case 'admin': return 'bg-purple-100 text-purple-800 border-purple-300';
      default: return 'bg-stone-100 text-stone-700 border-stone-300';
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-all shadow-2xs">
      {/* Top micro alert: Quick Demo Role Switcher Bar */}
      <div className="bg-emerald-950 text-emerald-200 text-xs px-4 py-1.5 flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <span className="font-semibold text-white shrink-0 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-lime-400" />
              Role Demo Quick-Switch:
            </span>
            <div className="flex items-center gap-1.5 shrink-0">
              {(['donor', 'ngo', 'volunteer', 'admin'] as UserRole[]).map(role => (
                <button
                  key={role}
                  onClick={() => quickLogin(role)}
                  className={`px-2 py-0.5 rounded text-[11px] font-medium transition cursor-pointer flex items-center gap-1 ${
                    user?.role === role
                      ? 'bg-emerald-600 text-white shadow-xs font-bold'
                      : 'bg-emerald-900/80 hover:bg-emerald-800 text-emerald-200'
                  }`}
                  title={DEMO_CREDENTIALS[role].desc}
                >
                  <span className="capitalize">{role}</span>
                  {user?.role === role && <Check className="w-3 h-3 text-lime-300" />}
                </button>
              ))}
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-3 shrink-0">
            <button
              onClick={onOpenDbModal}
              className="text-emerald-300 hover:text-white flex items-center gap-1.5 text-[11px] font-medium transition cursor-pointer"
            >
              <Database className="w-3 h-3 text-emerald-400" />
              <span>MongoDB Specs</span>
            </button>
            <span className="text-emerald-700">|</span>
            <span className="text-emerald-400 text-[11px]">B.Tech Final Year Demonstration</span>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            onClick={() => onNavigate('home')} 
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-emerald-800 flex items-center justify-center text-white shadow-md group-hover:scale-105 transition">
              <HeartHandshake className="w-6 h-6 text-lime-300" />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-emerald-950 font-serif block leading-none">
                Surplus<span className="text-emerald-600">to</span>Serve
              </span>
              <span className="text-[10px] uppercase tracking-wider text-stone-500 font-medium block mt-0.5">
                Food Redistribution Network
              </span>
            </div>
          </div>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-2">
            {[
              { id: 'home', label: 'Home' },
              { id: 'donations', label: 'Available Food' },
              { id: 'how-it-works', label: 'How It Works' },
              { id: 'about', label: 'About Us' },
              { id: 'contact', label: 'Contact Us' },
            ].map(item => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                  currentPage === item.id
                    ? 'text-emerald-800 bg-emerald-50 font-semibold'
                    : 'text-stone-600 hover:text-emerald-700 hover:bg-stone-50'
                }`}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right Action Icons & Profile */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Live Swiggy-Style Map Button */}
            {onOpenMap && (
              <button
                onClick={onOpenMap}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-300 transition cursor-pointer shadow-2xs"
                title="Track Active Food Delivery on Swiggy-Style Map"
              >
                <Navigation className="w-3.5 h-3.5 text-amber-600 animate-pulse" />
                <span className="hidden sm:inline">Live Delivery Map</span>
              </button>
            )}

            {/* Quick Link to Current Role Dashboard */}
            {user && (
              <button
                onClick={() => onNavigate(getDashboardPage(user.role))}
                className={`hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-2xs border transition cursor-pointer ${
                  currentPage.includes('dashboard')
                    ? 'bg-emerald-700 text-white border-emerald-800'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300 hover:bg-emerald-100'
                }`}
              >
                <LayoutDashboard className="w-3.5 h-3.5" />
                <span className="capitalize">{user.role} Dashboard</span>
              </button>
            )}

            {/* Notifications Dropdown */}
            {user && (
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-lg text-stone-600 hover:text-emerald-800 hover:bg-stone-100 relative transition cursor-pointer"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 bg-orange-600 text-white rounded-full text-[10px] font-bold flex items-center justify-center animate-bounce">
                      {unreadCount}
                    </span>
                  )}
                </button>

                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 py-2 z-50 overflow-hidden">
                    <div className="px-4 py-2 border-b border-stone-100 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-800 text-sm">Notifications</span>
                        {unreadCount > 0 && (
                          <span className="text-xs bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full font-semibold">
                            {unreadCount} new
                          </span>
                        )}
                      </div>
                      {unreadCount > 0 && (
                        <button
                          onClick={markAllRead}
                          className="text-xs text-emerald-700 hover:underline font-medium cursor-pointer"
                        >
                          Mark all read
                        </button>
                      )}
                    </div>

                    <div className="max-h-72 overflow-y-auto divide-y divide-stone-100">
                      {notifications.length === 0 ? (
                        <div className="p-6 text-center text-xs text-stone-500">
                          No notifications yet.
                        </div>
                      ) : (
                        notifications.slice(0, 6).map(n => (
                          <div
                            key={n.id}
                            onClick={() => {
                              markRead(n.id);
                              if (n.link) {
                                if (n.link.includes('donor')) onNavigate('donor-dashboard');
                                else if (n.link.includes('ngo')) onNavigate('ngo-dashboard');
                                else if (n.link.includes('volunteer')) onNavigate('volunteer-dashboard');
                                else if (n.link.includes('admin')) onNavigate('admin-dashboard');
                                else onNavigate('donations');
                              }
                              setNotificationsOpen(false);
                            }}
                            className={`p-3 text-xs cursor-pointer transition hover:bg-stone-50 ${
                              !n.read ? 'bg-emerald-50/50' : ''
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-semibold text-stone-800">{n.title}</span>
                              <span className="text-[10px] text-stone-400">
                                {new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                              </span>
                            </div>
                            <p className="text-stone-600 line-clamp-2">{n.message}</p>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* User Profile / Login */}
            {user ? (
              <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
                <div
                  onClick={() => onNavigate(getDashboardPage(user.role))}
                  className="flex items-center gap-2 cursor-pointer group"
                  title={`${user.name} (${user.role})`}
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-400 group-hover:scale-105 transition"
                  />
                  <div className="hidden lg:block text-left">
                    <p className="text-xs font-bold text-stone-800 truncate max-w-[120px]">
                      {user.name}
                    </p>
                    <span className={`inline-block px-1.5 py-0.2 rounded text-[10px] uppercase font-bold border ${getRoleBadgeStyle(user.role)}`}>
                      {user.role}
                    </span>
                  </div>
                </div>

                <button
                  onClick={logout}
                  className="p-1.5 text-stone-500 hover:text-red-600 rounded-lg hover:bg-stone-100 transition cursor-pointer"
                  title="Log out"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-50 rounded-lg transition cursor-pointer"
                >
                  Log In
                </button>
                <button
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 text-xs font-semibold bg-emerald-700 hover:bg-emerald-800 text-white rounded-lg shadow-xs transition cursor-pointer"
                >
                  Register
                </button>
              </div>
            )}

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 md:hidden text-stone-600 hover:text-emerald-800 rounded-lg cursor-pointer"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-5 space-y-2">
          {[
            { id: 'home', label: 'Home' },
            { id: 'donations', label: 'Available Food Donations' },
            { id: 'how-it-works', label: 'How It Works' },
            { id: 'about', label: 'About Us' },
            { id: 'contact', label: 'Contact Us' },
          ].map(item => (
            <button
              key={item.id}
              onClick={() => {
                onNavigate(item.id);
                setMobileMenuOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium ${
                currentPage === item.id ? 'bg-emerald-50 text-emerald-800 font-bold' : 'text-stone-700'
              }`}
            >
              {item.label}
            </button>
          ))}

          {user && (
            <div className="pt-2 border-t border-stone-100">
              <button
                onClick={() => {
                  onNavigate(getDashboardPage(user.role));
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-sm font-bold text-emerald-800 bg-emerald-50 flex items-center justify-between"
              >
                <span>{user.role.toUpperCase()} Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {onOpenMap && (
            <div className="pt-2">
              <button
                onClick={() => {
                  onOpenMap();
                  setMobileMenuOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold text-amber-900 bg-amber-100/70 border border-amber-300 flex items-center gap-2"
              >
                <Navigation className="w-4 h-4 text-amber-600" />
                <span>Open Swiggy-Style Live Delivery Map</span>
              </button>
            </div>
          )}

          <div className="pt-2">
            <button
              onClick={() => {
                onOpenDbModal();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2 rounded-lg text-xs font-semibold text-stone-600 bg-stone-100 flex items-center gap-2"
            >
              <Database className="w-4 h-4 text-emerald-600" />
              <span>MongoDB & Project Details</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
