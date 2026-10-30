import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  Search, 
  Filter, 
  MapPin, 
  Truck, 
  CheckCircle2, 
  Clock, 
  Star, 
  ShieldCheck, 
  Phone, 
  Utensils, 
  AlertTriangle,
  ArrowRight,
  MessageSquare,
  Award,
  Layers,
  Sparkles,
  RefreshCw,
  X,
  Navigation
} from 'lucide-react';
import { api } from '../lib/api';
import { Donation, Feedback } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ExpiryCountdown } from '../components/ExpiryCountdown';
import { DeliveryTrackingMap } from '../components/DeliveryTrackingMap';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const NgoDashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<'available' | 'claimed' | 'history'>('claimed');
  const [availableDonations, setAvailableDonations] = useState<Donation[]>([]);
  const [claimedDonations, setClaimedDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  // Feedback modal state
  const [feedbackDonation, setFeedbackDonation] = useState<Donation | null>(null);
  const [trackingDonation, setTrackingDonation] = useState<Donation | null>(null);
  const [rating, setRating] = useState(5);
  const [foodQualityRating, setFoodQualityRating] = useState(5);
  const [punctualityRating, setPunctualityRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submittingFeedback, setSubmittingFeedback] = useState(false);

  // Search & filter
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  const fetchData = async () => {
    setLoading(true);
    try {
      const [avail, claimed] = await Promise.all([
        api.getDonations({ status: 'Available' }),
        api.getDonations({ acceptedByNgoId: user?.id }),
      ]);
      setAvailableDonations(avail);
      setClaimedDonations(claimed);
    } catch (err: any) {
      showToast('Error loading NGO dashboard: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [user]);

  // NGO accepts available donation
  const handleAcceptDonation = async (id: string) => {
    setActionLoading(id);
    try {
      await api.acceptDonation(id);
      showToast('Donation accepted successfully! You can now request volunteer pickup.', 'success');
      fetchData();
      setActiveTab('claimed');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // NGO requests volunteer
  const handleRequestVolunteer = async (id: string) => {
    setActionLoading(id);
    try {
      await api.requestVolunteer(id);
      showToast('Volunteer request broadcasted to all active drivers in Metro City!', 'success');
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // NGO confirms delivery and marks complete
  const handleConfirmReceived = async (donation: Donation) => {
    setActionLoading(donation.id);
    try {
      await api.updateDonationStatus(donation.id, 'Completed', 'Food received in safe hygienic state by NGO staff.');
      showToast(`Food delivery confirmed! Thank you for nourishing the community.`, 'success');
      // Prompt for feedback
      setFeedbackDonation(donation);
      setComment(`Received ${donation.servings} servings in excellent hygienic condition. Distributed promptly to shelter residents.`);
      fetchData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const handleSubmitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackDonation) return;
    setSubmittingFeedback(true);
    try {
      await api.submitFeedback({
        donationId: feedbackDonation.id,
        toUserId: feedbackDonation.donorId,
        rating,
        foodQualityRating,
        punctualityRating,
        comment,
      });
      showToast('Feedback and gratitude review submitted to donor!', 'success');
      setFeedbackDonation(null);
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSubmittingFeedback(false);
    }
  };

  const activeClaims = claimedDonations.filter(d => ['Accepted', 'Requested', 'Volunteer Assigned', 'Picked Up', 'Delivered'].includes(d.status));
  const completedClaims = claimedDonations.filter(d => d.status === 'Completed');
  const totalServingsSecured = claimedDonations.reduce((acc, d) => acc + (d.servings || 0), 0);

  const dailyCapacity = user?.dailyCapacity || 350;
  const todayServings = claimedDonations
    .filter(d => new Date(d.createdAt).toDateString() === new Date().toDateString())
    .reduce((acc, d) => acc + (d.servings || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-800/80 text-blue-200 border border-blue-500/40">
              NGO Shelter Hub
            </span>
            <span className="flex items-center gap-1 text-xs text-lime-300 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Reg #{user?.regNumber || 'NGO-US-88912'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            {user?.name || 'Hope Harbor Community Kitchen'}
          </h1>
          <p className="text-blue-100 text-sm max-w-xl">
            {user?.organizationType || 'Community Kitchen'} • {user?.address} • Connecting with donors to secure wholesome edible meals for community members.
          </p>
        </div>

        <button
          onClick={fetchData}
          className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition cursor-pointer flex items-center gap-2 shrink-0"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Refresh Live Feeds</span>
        </button>
      </div>

      {/* Capacity & Impact Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Today's Meal Capacity</span>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
              {todayServings}
            </span>
            <span className="text-xs text-stone-400">/ {dailyCapacity} max</span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-emerald-600 h-1.5 rounded-full"
              style={{ width: `${Math.min(100, Math.round((todayServings / dailyCapacity) * 100))}%` }}
            ></div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Active Deliveries</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-serif mt-1">
            {activeClaims.length}
          </p>
          <span className="text-[11px] text-blue-700 font-medium mt-1 block">In progress or en route</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Total Meals Received</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-serif mt-1">
            {totalServingsSecured}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Distributed to shelter guests</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Completed Pickups</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif mt-1">
            {completedClaims.length}
          </p>
          <span className="text-[11px] text-stone-500 font-medium mt-1 block">Verified & reviewed</span>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex border-b border-stone-200 gap-4">
        <button
          onClick={() => setActiveTab('claimed')}
          className={`pb-3 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'claimed'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>Active In-Progress Orders ({activeClaims.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('available')}
          className={`pb-3 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'available'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Available Food Radar ({availableDonations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-blue-600 text-blue-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed History ({completedClaims.length})</span>
        </button>
      </div>

      {/* Tab Content: Active Claims */}
      {activeTab === 'claimed' && (
        <div className="space-y-6">
          {activeClaims.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
              <Truck className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-lg font-bold text-stone-800">No In-Progress Donations</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                You have no active orders in transit. Check the Available Food Radar to accept surplus meals.
              </p>
              <button
                onClick={() => setActiveTab('available')}
                className="px-5 py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                Browse Available Surplus Food
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {activeClaims.map(donation => (
                <div
                  key={donation.id}
                  className="bg-white rounded-2xl border border-stone-200 shadow-2xs overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={donation.status} />
                      <ExpiryCountdown expiryTime={donation.expiryTime} compact />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-stone-900">{donation.foodName}</h3>
                      <p className="text-xs text-stone-600 mt-1">
                        {donation.quantity} ({donation.servings} Servings) • {donation.category}
                      </p>
                    </div>

                    {/* Step-by-Step Delivery Progress Tracker */}
                    <div className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-3">
                      <span className="text-[11px] font-bold text-stone-700 uppercase tracking-wider block">
                        Transit Milestone Tracker
                      </span>
                      <div className="flex items-center justify-between text-xs relative">
                        <div className="flex flex-col items-center gap-1 z-10">
                          <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-[11px] font-bold flex items-center justify-center">
                            ✓
                          </span>
                          <span className="text-[10px] font-medium text-stone-600">Claimed</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-stone-300 -mt-3"></div>

                        <div className="flex flex-col items-center gap-1 z-10">
                          <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                            ['Volunteer Assigned', 'Picked Up', 'Delivered', 'Completed'].includes(donation.status)
                              ? 'bg-blue-600 text-white'
                              : 'bg-stone-200 text-stone-500'
                          }`}>
                            {['Volunteer Assigned', 'Picked Up', 'Delivered', 'Completed'].includes(donation.status) ? '✓' : '2'}
                          </span>
                          <span className="text-[10px] font-medium text-stone-600">Driver</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-stone-300 -mt-3"></div>

                        <div className="flex flex-col items-center gap-1 z-10">
                          <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                            ['Picked Up', 'Delivered', 'Completed'].includes(donation.status)
                              ? 'bg-blue-600 text-white'
                              : 'bg-stone-200 text-stone-500'
                          }`}>
                            {['Picked Up', 'Delivered', 'Completed'].includes(donation.status) ? '✓' : '3'}
                          </span>
                          <span className="text-[10px] font-medium text-stone-600">Picked Up</span>
                        </div>
                        <div className="flex-1 h-0.5 bg-stone-300 -mt-3"></div>

                        <div className="flex flex-col items-center gap-1 z-10">
                          <span className={`w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center ${
                            ['Delivered', 'Completed'].includes(donation.status)
                              ? 'bg-emerald-600 text-white'
                              : 'bg-stone-200 text-stone-500'
                          }`}>
                            {['Delivered', 'Completed'].includes(donation.status) ? '✓' : '4'}
                          </span>
                          <span className="text-[10px] font-medium text-stone-600">At Shelter</span>
                        </div>
                      </div>
                    </div>

                    {/* Donor Pickup details */}
                    <div className="text-xs space-y-1.5 text-stone-600 pt-2 border-t border-stone-100">
                      <p className="flex items-center gap-1.5 font-semibold text-stone-800">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        Donor: {donation.donorName}
                      </p>
                      <p className="flex items-center gap-1.5 text-stone-500">
                        <MapPin className="w-3.5 h-3.5 text-stone-400" />
                        Pickup: {donation.pickupLocation}
                      </p>
                      {donation.assignedVolunteerName && (
                        <p className="flex items-center gap-1.5 text-blue-700 font-medium">
                          <Truck className="w-3.5 h-3.5 text-blue-600" />
                          Assigned Volunteer: {donation.assignedVolunteerName} ({donation.assignedVolunteerPhone || 'On Call'})
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="p-4 bg-stone-50 border-t border-stone-200 flex flex-wrap items-center justify-between gap-2">
                    {donation.status === 'Accepted' && (
                      <button
                        onClick={() => handleRequestVolunteer(donation.id)}
                        disabled={actionLoading === donation.id}
                        className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <Truck className="w-4 h-4" />
                        <span>Request Volunteer Driver</span>
                      </button>
                    )}

                    {donation.status === 'Requested' && (
                      <span className="text-xs text-amber-700 font-medium italic">
                        Broadcasted to nearby volunteer drivers. Waiting for pickup confirmation.
                      </span>
                    )}

                    {donation.status === 'Delivered' && (
                      <button
                        onClick={() => handleConfirmReceived(donation)}
                        disabled={actionLoading === donation.id}
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Confirm Food Receipt & Verify</span>
                      </button>
                    )}

                    {['Volunteer Assigned', 'Picked Up'].includes(donation.status) && (
                      <div className="w-full space-y-2">
                        <div className="flex items-center justify-between w-full text-xs text-stone-500">
                          <span className="flex items-center gap-1">
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                            Driver en route
                          </span>
                          <span className="font-semibold text-blue-700">Estimated arrival: ~12 mins</span>
                        </div>
                        <button
                          onClick={() => setTrackingDonation(donation)}
                          className="w-full py-2 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <Navigation className="w-3.5 h-3.5 text-lime-400" />
                          <span>Track Driver on Live Map (Swiggy-Style)</span>
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Available Food Radar */}
      {activeTab === 'available' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {availableDonations.map(donation => (
              <div
                key={donation.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 w-full bg-stone-100 overflow-hidden">
                    <img
                      src={donation.imageUrl}
                      alt={donation.foodName}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3">
                      <StatusBadge status={donation.status} size="sm" />
                    </div>
                    <div className="absolute top-3 right-3 bg-stone-900/80 backdrop-blur-xs text-white text-xs px-2.5 py-1 rounded-md font-semibold">
                      {donation.servings} Servings
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {donation.category}
                      </span>
                      <ExpiryCountdown expiryTime={donation.expiryTime} compact />
                    </div>

                    <h3 className="font-bold text-stone-900 text-base line-clamp-1">
                      {donation.foodName}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2">
                      {donation.quantity} • {donation.pickupLocation}
                    </p>

                    <div className="pt-2 border-t border-stone-100 text-xs text-stone-500">
                      Donor: <strong className="text-stone-700">{donation.donorName}</strong> ({donation.donorCity})
                    </div>
                  </div>
                </div>

                <div className="p-5 pt-0">
                  <button
                    onClick={() => handleAcceptDonation(donation.id)}
                    disabled={actionLoading === donation.id}
                    className="w-full py-2.5 bg-blue-700 hover:bg-blue-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{actionLoading === donation.id ? 'Claiming...' : 'Claim This Food for Shelter'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Completed History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <h3 className="font-bold text-stone-800 text-sm">Rescued Food Distribution History</h3>
            <span className="text-xs text-stone-500">{completedClaims.length} records</span>
          </div>

          <div className="divide-y divide-stone-200">
            {completedClaims.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-500">
                No completed donations recorded yet.
              </div>
            ) : (
              completedClaims.map(d => (
                <div key={d.id} className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-stone-50">
                  <div className="flex items-center gap-3">
                    <img
                      src={d.imageUrl}
                      alt={d.foodName}
                      className="w-14 h-14 rounded-xl object-cover shrink-0"
                    />
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">{d.foodName}</h4>
                      <p className="text-xs text-stone-500">
                        {d.quantity} • {d.servings} Servings • Donated by {d.donorName}
                      </p>
                      <span className="text-[10px] text-stone-400">
                        Completed on {d.completedAt ? new Date(d.completedAt).toLocaleDateString() : 'Recent'}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                      Successfully Distributed
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}

      {/* Food Rating & Feedback Modal */}
      {feedbackDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-lg w-full flex flex-col border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            <div className="p-6 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">Food Quality & Donor Feedback</h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Confirm quality and express gratitude to {feedbackDonation.donorName}
                </p>
              </div>
              <button
                onClick={() => setFeedbackDonation(null)}
                className="text-white/80 hover:text-white p-1"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitFeedback} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Overall Experience Rating (1-5 Stars)
                </label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map(star => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className={`p-1 transition cursor-pointer ${rating >= star ? 'text-amber-400' : 'text-stone-300'}`}
                    >
                      <Star className="w-6 h-6 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Food Freshness & Hygiene</label>
                  <select
                    value={foodQualityRating}
                    onChange={e => setFoodQualityRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                  >
                    <option value={5}>5 - Excellent / Fresh</option>
                    <option value={4}>4 - Good</option>
                    <option value={3}>3 - Acceptable</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-700 mb-1">Packaging & Temperature</label>
                  <select
                    value={punctualityRating}
                    onChange={e => setPunctualityRating(Number(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-stone-300 text-xs"
                  >
                    <option value={5}>5 - Well Insulated / Sealed</option>
                    <option value={4}>4 - Proper Containers</option>
                    <option value={3}>3 - Moderate</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Comments & Impact Note for Donor
                </label>
                <textarea
                  required
                  rows={3}
                  value={comment}
                  onChange={e => setComment(e.target.value)}
                  className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setFeedbackDonation(null)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Skip
                </button>
                <button
                  type="submit"
                  disabled={submittingFeedback}
                  className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <Award className="w-4 h-4" />
                  <span>{submittingFeedback ? 'Submitting...' : 'Submit Review'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Swiggy-Style Live Delivery Tracking Map Modal */}
      {trackingDonation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-stone-950/80 backdrop-blur-sm animate-in fade-in">
          <DeliveryTrackingMap
            donation={trackingDonation}
            onClose={() => setTrackingDonation(null)}
          />
        </div>
      )}
    </div>
  );
};
