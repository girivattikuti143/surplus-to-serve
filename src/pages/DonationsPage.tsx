import React, { useState, useEffect } from 'react';
import { 
  Search, 
  Filter, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Utensils, 
  CheckCircle2, 
  Truck, 
  Building2, 
  Phone, 
  Info, 
  X, 
  ArrowRight,
  Flame,
  Thermometer,
  Layers,
  Sparkles
} from 'lucide-react';
import { api } from '../lib/api';
import { Donation, FoodCategory } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ExpiryCountdown } from '../components/ExpiryCountdown';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

interface DonationsPageProps {
  onNavigate: (page: string) => void;
}

export const DonationsPage: React.FC<DonationsPageProps> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedStatus, setSelectedStatus] = useState<string>('All');
  const [selectedCity, setSelectedCity] = useState<string>('All');
  const [activeDonation, setActiveDonation] = useState<Donation | null>(null);
  const [actionLoading, setActionLoading] = useState(false);

  const categories = [
    'All',
    'Cooked Meals',
    'Bakery & Bread',
    'Fruits & Veggies',
    'Packaged Food',
    'Dairy & Beverages',
    'Dry Grains',
  ];

  const statuses = [
    'All',
    'Available',
    'Requested',
    'Accepted',
    'Volunteer Assigned',
    'Picked Up',
    'Delivered',
    'Completed',
    'Expired',
  ];

  const fetchDonations = async () => {
    setLoading(true);
    try {
      const data = await api.getDonations({
        category: selectedCategory !== 'All' ? selectedCategory : undefined,
        status: selectedStatus !== 'All' ? selectedStatus : undefined,
        city: selectedCity !== 'All' ? selectedCity : undefined,
        search: search.trim() ? search.trim() : undefined,
      });
      setDonations(data);
    } catch (err: any) {
      showToast('Failed to load donations: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, [selectedCategory, selectedStatus, selectedCity]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchDonations();
  };

  // NGO claim action
  const handleNgoAccept = async (donationId: string) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    if (user.role !== 'ngo' && user.role !== 'admin') {
      showToast('Only registered NGOs can accept food donations. Please switch to an NGO account.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const updated = await api.acceptDonation(donationId);
      showToast(`Successfully claimed "${updated.foodName}"! You can now request volunteer pickup.`, 'success');
      setActiveDonation(updated);
      fetchDonations();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // NGO request volunteer action
  const handleRequestVolunteer = async (donationId: string) => {
    setActionLoading(true);
    try {
      const updated = await api.requestVolunteer(donationId);
      showToast('Volunteer pickup request broadcasted! Available drivers will be notified.', 'success');
      setActiveDonation(updated);
      fetchDonations();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  // Volunteer claim action
  const handleVolunteerClaim = async (donationId: string) => {
    if (!user) {
      onNavigate('login');
      return;
    }
    if (user.role !== 'volunteer' && user.role !== 'admin') {
      showToast('Only volunteer drivers can claim transport tasks.', 'error');
      return;
    }

    setActionLoading(true);
    try {
      const { donation } = await api.claimDeliveryTask(donationId);
      showToast(`Task assigned! Check your Volunteer Dashboard to navigate pickup.`, 'success');
      setActiveDonation(donation);
      fetchDonations();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 to-emerald-800 rounded-3xl p-8 sm:p-10 text-white shadow-lg space-y-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-bold text-lime-300 uppercase tracking-wider bg-emerald-950/60 px-3 py-1 rounded-full">
              Live Surplus Food Board
            </span>
            <h1 className="text-2xl sm:text-4xl font-extrabold font-serif mt-2">
              Available Food Donations
            </h1>
            <p className="text-emerald-100 text-sm max-w-xl mt-1">
              Real-time edible surplus meals from restaurants, bakeries, caterers, and supermarkets ready for distribution.
            </p>
          </div>

          <div className="flex items-center gap-2">
            {user?.role === 'donor' && (
              <button
                onClick={() => onNavigate('donor-dashboard')}
                className="px-5 py-2.5 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-xs sm:text-sm rounded-xl transition cursor-pointer shadow-md"
              >
                + Post New Surplus Food
              </button>
            )}
            <button
              onClick={fetchDonations}
              className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition cursor-pointer"
            >
              Refresh Listings
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <form onSubmit={handleSearchSubmit} className="pt-2">
          <div className="relative max-w-2xl">
            <Search className="w-5 h-5 text-stone-400 absolute left-4 top-3.5" />
            <input
              type="text"
              placeholder="Search by food name, donor name, location or ingredients..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full pl-12 pr-28 py-3.5 rounded-2xl bg-white text-stone-900 placeholder-stone-400 text-sm focus:outline-hidden focus:ring-2 focus:ring-lime-400 shadow-md"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 px-5 py-2 bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold rounded-xl transition cursor-pointer"
            >
              Search
            </button>
          </div>
        </form>
      </div>

      {/* Filter Row */}
      <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-stone-200 shadow-2xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 lg:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-emerald-700 text-white shadow-xs'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Status Dropdown */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 text-xs text-stone-500 shrink-0">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter Status:</span>
          </div>
          <select
            value={selectedStatus}
            onChange={e => setSelectedStatus(e.target.value)}
            className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-3 py-1.5 font-medium text-stone-700 focus:outline-hidden focus:ring-1 focus:ring-emerald-500"
          >
            {statuses.map(s => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Grid of Donations */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-xs text-stone-500 font-medium">Fetching real-time food donations...</p>
        </div>
      ) : donations.length === 0 ? (
        <div className="py-20 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
            <Utensils className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-stone-800">No Food Donations Found</h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            There are currently no donations matching your search criteria. Try removing filters or post a new donation.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedStatus('All');
              setSearch('');
            }}
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg transition cursor-pointer"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {donations.map(donation => (
            <div
              key={donation.id}
              onClick={() => setActiveDonation(donation)}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-xl transition-all group flex flex-col justify-between cursor-pointer"
            >
              <div>
                {/* Image */}
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

                {/* Content */}
                <div className="p-5 space-y-3">
                  <div className="flex items-center justify-between text-xs">
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

              {/* Bottom Quick Action */}
              <div className="p-5 pt-0">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveDonation(donation);
                  }}
                  className="w-full py-2.5 bg-emerald-50 group-hover:bg-emerald-600 text-emerald-800 group-hover:text-white font-bold text-xs rounded-xl transition flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <span>View Details & Claim</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detailed Modal */}
      {activeDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Modal Image Header */}
            <div className="relative h-56 w-full bg-stone-100 overflow-hidden">
              <img
                src={activeDonation.imageUrl}
                alt={activeDonation.foodName}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
              
              <button
                onClick={() => setActiveDonation(null)}
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-4 right-4 text-white">
                <div className="flex items-center gap-2 mb-1.5">
                  <StatusBadge status={activeDonation.status} size="sm" />
                  <span className="text-xs bg-white/20 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-semibold">
                    {activeDonation.category}
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-bold">{activeDonation.foodName}</h3>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-5">
              {/* Expiry Banner */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-emerald-600" />
                  <span>
                    Prep Date: <strong>{new Date(activeDonation.prepDate).toLocaleString()}</strong>
                  </span>
                </div>
                <div>
                  <ExpiryCountdown expiryTime={activeDonation.expiryTime} />
                </div>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block">Quantity</span>
                  <span className="font-bold text-stone-800 text-sm">{activeDonation.quantity}</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block">Est. Servings</span>
                  <span className="font-bold text-stone-800 text-sm">{activeDonation.servings} people</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-50 border border-stone-200">
                  <span className="text-stone-500 block">Storage Temp</span>
                  <span className="font-bold text-stone-800 text-sm flex items-center gap-1">
                    <Thermometer className="w-3.5 h-3.5 text-emerald-600" />
                    {activeDonation.temperatureType}
                  </span>
                </div>
              </div>

              {/* Pickup & Donor Info */}
              <div className="space-y-3">
                <h4 className="font-bold text-stone-900 text-sm">Pickup & Location Details</h4>
                <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs text-stone-700">
                  <div className="flex items-start gap-2">
                    <Building2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">{activeDonation.donorName}</span>
                      <p className="text-stone-500">{activeDonation.donorAddress}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Contact: {activeDonation.donorPhone}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <span><strong>Pickup Location:</strong> {activeDonation.pickupLocation}</span>
                  </div>
                  {activeDonation.pickupInstructions && (
                    <div className="flex items-start gap-2 pt-2 border-t border-stone-200">
                      <Info className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                      <span><strong>Instructions:</strong> {activeDonation.pickupInstructions}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Workflow Status Details if claimed */}
              {activeDonation.acceptedByNgoName && (
                <div className="p-4 rounded-2xl bg-blue-50 border border-blue-200 text-xs text-blue-900 space-y-1">
                  <p className="font-bold flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-700" />
                    Claimed by: {activeDonation.acceptedByNgoName}
                  </p>
                  {activeDonation.assignedVolunteerName && (
                    <p className="text-blue-700">
                      Volunteer assigned: {activeDonation.assignedVolunteerName} ({activeDonation.assignedVolunteerPhone || 'In transit'})
                    </p>
                  )}
                </div>
              )}

              {/* Food Safety Guarantee Note */}
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>
                  Donor has signed the Surplus to Serve Food Hygiene Declaration. Food is inspected prior to distribution.
                </span>
              </div>
            </div>

            {/* Modal Actions */}
            <div className="p-4 sm:p-6 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-3">
              <button
                onClick={() => setActiveDonation(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
              >
                Close
              </button>

              <div className="flex items-center gap-2">
                {/* Scenario 1: Food is Available and user is an NGO */}
                {activeDonation.status === 'Available' && (
                  <button
                    onClick={() => handleNgoAccept(activeDonation.id)}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{actionLoading ? 'Claiming...' : 'Claim as NGO'}</span>
                  </button>
                )}

                {/* Scenario 2: Food is Accepted by this NGO, and needs volunteer */}
                {activeDonation.status === 'Accepted' && user?.role === 'ngo' && (
                  <button
                    onClick={() => handleRequestVolunteer(activeDonation.id)}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>{actionLoading ? 'Broadcasting...' : 'Request Volunteer Driver'}</span>
                  </button>
                )}

                {/* Scenario 3: Volunteer wants to claim pickup */}
                {(activeDonation.status === 'Accepted' || activeDonation.status === 'Requested') && (
                  <button
                    onClick={() => handleVolunteerClaim(activeDonation.id)}
                    disabled={actionLoading}
                    className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
                  >
                    <Truck className="w-4 h-4" />
                    <span>{actionLoading ? 'Claiming...' : 'Claim Delivery Task'}</span>
                  </button>
                )}

                {!user && (
                  <button
                    onClick={() => {
                      setActiveDonation(null);
                      onNavigate('login');
                    }}
                    className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer"
                  >
                    Log In to Claim
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
