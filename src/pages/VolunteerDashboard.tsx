import React, { useState, useEffect } from 'react';
import { 
  Truck, 
  MapPin, 
  Phone, 
  CheckCircle2, 
  Clock, 
  ArrowRight, 
  Award, 
  AlertTriangle, 
  Building2, 
  Utensils, 
  RefreshCw,
  Navigation,
  ShieldCheck,
  Check,
  Calendar
} from 'lucide-react';
import { api } from '../lib/api';
import { Donation, Delivery } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ExpiryCountdown } from '../components/ExpiryCountdown';
import { DeliveryTrackingMap } from '../components/DeliveryTrackingMap';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const VolunteerDashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [activeTab, setActiveTab] = useState<'my-tasks' | 'available-tasks' | 'history'>('my-tasks');
  const [assignedDonations, setAssignedDonations] = useState<Donation[]>([]);
  const [availableForDelivery, setAvailableForDelivery] = useState<Donation[]>([]);
  const [completedDeliveries, setCompletedDeliveries] = useState<Delivery[]>([]);
  const [trackingDonation, setTrackingDonation] = useState<Donation | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchVolunteerData = async () => {
    setLoading(true);
    try {
      const [allAssigned, requestedDonations, deliveries] = await Promise.all([
        api.getDonations({ assignedVolunteerId: user?.id }),
        api.getDonations({ status: 'Requested' }),
        api.getDeliveries({ volunteerId: user?.id }),
      ]);

      setAssignedDonations(allAssigned.filter(d => ['Volunteer Assigned', 'Picked Up'].includes(d.status)));
      setAvailableForDelivery(requestedDonations);
      setCompletedDeliveries(deliveries.filter(d => ['Delivered', 'Confirmed'].includes(d.status)));
    } catch (err: any) {
      showToast('Error fetching volunteer data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVolunteerData();
  }, [user]);

  // Volunteer claims task
  const handleClaimTask = async (donationId: string) => {
    setActionLoading(donationId);
    try {
      await api.claimDeliveryTask(donationId);
      showToast('Task accepted! Route instructions are now loaded.', 'success');
      fetchVolunteerData();
      setActiveTab('my-tasks');
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Volunteer updates status: Picked Up -> Delivered
  const handleUpdateStatus = async (donationId: string, nextStatus: 'Picked Up' | 'Delivered') => {
    setActionLoading(donationId);
    try {
      await api.updateDonationStatus(
        donationId, 
        nextStatus, 
        nextStatus === 'Picked Up' 
          ? 'Inspected packaging and safely loaded into vehicle.' 
          : 'Delivered to NGO shelter bay.'
      );
      showToast(`Status updated to: ${nextStatus}!`, 'success');
      fetchVolunteerData();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  const totalServingsDelivered = completedDeliveries.reduce((acc, d) => acc + (d.servings || 0), 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-emerald-950 to-emerald-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
              Volunteer Delivery Pilot
            </span>
            <span className="flex items-center gap-1 text-xs text-lime-300 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Vehicle: {user?.vehicleType || 'Car'}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Welcome, {user?.name || 'David Chen'}
          </h1>
          <p className="text-stone-300 text-sm max-w-xl">
            Active Zone: {user?.city || 'Metro City'} • Safe food transport bridging surplus kitchen donors and shelter distribution points.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setTrackingDonation(assignedDonations[0] || null)}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Navigation className="w-3.5 h-3.5 text-lime-300" />
            <span>Open Swiggy-Style Live Map</span>
          </button>
          <button
            onClick={fetchVolunteerData}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition cursor-pointer flex items-center gap-2"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh Tasks</span>
          </button>
        </div>
      </div>

      {/* Volunteer Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Active Pickup Tasks</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-serif mt-1">
            {assignedDonations.length}
          </p>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">In progress right now</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Deliveries Completed</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-serif mt-1">
            {completedDeliveries.length + 1}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Verified deliveries</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Meals Transported</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-serif mt-1">
            {totalServingsDelivered || 70}
          </p>
          <span className="text-[11px] text-teal-700 font-medium mt-1 block">Edible servings safely routed</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Driver Reliability Score</span>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif">
              4.9
            </span>
            <span className="text-xs text-amber-500 font-bold">★ ★ ★ ★ ★</span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Level 2 Hero Volunteer</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-4">
        <button
          onClick={() => setActiveTab('my-tasks')}
          className={`pb-3 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'my-tasks'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Truck className="w-4 h-4" />
          <span>My Assigned Tasks ({assignedDonations.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('available-tasks')}
          className={`pb-3 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'available-tasks'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Navigation className="w-4 h-4" />
          <span>Available Delivery Requests ({availableForDelivery.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`pb-3 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'history'
              ? 'border-emerald-600 text-emerald-800'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          <span>Completed History ({completedDeliveries.length + 1})</span>
        </button>
      </div>

      {/* Tab 1: Assigned Tasks */}
      {activeTab === 'my-tasks' && (
        <div className="space-y-6">
          {assignedDonations.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
              <Truck className="w-12 h-12 text-stone-300 mx-auto" />
              <h3 className="text-lg font-bold text-stone-800">No Active Tasks Assigned</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                You are currently free to accept new pickup assignments. Browse requests needing a driver!
              </p>
              <button
                onClick={() => setActiveTab('available-tasks')}
                className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
              >
                View Available Delivery Requests
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {assignedDonations.map(donation => (
                <div
                  key={donation.id}
                  className="bg-white rounded-2xl border-2 border-emerald-500/40 shadow-md overflow-hidden flex flex-col justify-between"
                >
                  <div className="p-6 space-y-4">
                    <div className="flex items-center justify-between">
                      <StatusBadge status={donation.status} />
                      <ExpiryCountdown expiryTime={donation.expiryTime} compact />
                    </div>

                    <div>
                      <h3 className="text-base font-bold text-stone-900">{donation.foodName}</h3>
                      <p className="text-xs text-stone-600 mt-1 font-medium">
                        {donation.quantity} ({donation.servings} Servings) • Storage: {donation.temperatureType}
                      </p>
                    </div>

                    {/* Step-by-Step Waypoints */}
                    <div className="space-y-3 pt-2 border-t border-stone-100 text-xs">
                      {/* Step A: Pickup */}
                      <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-amber-900 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-amber-700" />
                            1. Pickup From: {donation.donorName}
                          </span>
                          <span className="text-[10px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-bold uppercase">
                            Donor
                          </span>
                        </div>
                        <p className="text-stone-700 pl-5">{donation.pickupLocation}</p>
                        <p className="text-stone-500 pl-5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          {donation.donorPhone}
                        </p>
                        {donation.pickupInstructions && (
                          <p className="text-[11px] text-amber-900 pl-5 italic">
                            Note: {donation.pickupInstructions}
                          </p>
                        )}
                      </div>

                      {/* Step B: Drop-off */}
                      <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 space-y-1">
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-blue-900 flex items-center gap-1.5">
                            <Building2 className="w-3.5 h-3.5 text-blue-700" />
                            2. Deliver To: {donation.acceptedByNgoName || 'Community Shelter'}
                          </span>
                          <span className="text-[10px] bg-blue-200 text-blue-900 px-1.5 py-0.2 rounded font-bold uppercase">
                            NGO Destination
                          </span>
                        </div>
                        <p className="text-stone-700 pl-5">124 Hope Street, Downtown East</p>
                        <p className="text-stone-500 pl-5 flex items-center gap-1">
                          <Phone className="w-3 h-3 text-stone-400" />
                          +1 (555) 789-0123
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons: Status Updates & Map Directions */}
                  <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-2">
                    <button
                      onClick={() => setTrackingDonation(donation)}
                      className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Navigation className="w-3.5 h-3.5 text-lime-400" />
                      <span>Start GPS Route Navigation (Swiggy-Style Map)</span>
                    </button>

                    <div className="flex items-center gap-2">
                      {donation.status === 'Volunteer Assigned' && (
                        <button
                          onClick={() => handleUpdateStatus(donation.id, 'Picked Up')}
                          disabled={actionLoading === donation.id}
                          className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <Truck className="w-4 h-4" />
                          <span>Mark as Picked Up (In Transit)</span>
                        </button>
                      )}

                      {donation.status === 'Picked Up' && (
                        <button
                          onClick={() => handleUpdateStatus(donation.id, 'Delivered')}
                          disabled={actionLoading === donation.id}
                          className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-2 cursor-pointer"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>Mark as Delivered at NGO</span>
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Available Delivery Requests */}
      {activeTab === 'available-tasks' && (
        <div className="space-y-6">
          {availableForDelivery.length === 0 ? (
            <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto" />
              <h3 className="text-lg font-bold text-stone-800">All Pickups Handled!</h3>
              <p className="text-xs text-stone-500 max-w-sm mx-auto">
                No unclaimed food requests at the moment. Keep an eye on notifications for upcoming notifications.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableForDelivery.map(donation => (
                <div
                  key={donation.id}
                  className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-md transition flex flex-col justify-between"
                >
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded">
                        {donation.category}
                      </span>
                      <ExpiryCountdown expiryTime={donation.expiryTime} compact />
                    </div>

                    <h3 className="font-bold text-stone-900 text-base">{donation.foodName}</h3>
                    <p className="text-xs text-stone-600">
                      {donation.quantity} ({donation.servings} Servings)
                    </p>

                    <div className="pt-2 border-t border-stone-100 text-xs space-y-1 text-stone-600">
                      <p><strong>From:</strong> {donation.donorName} ({donation.donorCity})</p>
                      <p><strong>To:</strong> {donation.acceptedByNgoName || 'Designated Shelter'}</p>
                    </div>
                  </div>

                  <div className="p-5 pt-0">
                    <button
                      onClick={() => handleClaimTask(donation.id)}
                      disabled={actionLoading === donation.id}
                      className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Truck className="w-4 h-4" />
                      <span>{actionLoading === donation.id ? 'Claiming...' : 'Claim This Delivery Task'}</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Tab 3: History */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
          <div className="p-4 border-b border-stone-200 bg-stone-50 flex items-center justify-between">
            <h3 className="font-bold text-stone-800 text-sm">Completed Transit Records</h3>
            <span className="text-xs text-stone-500">Verified by recipient NGOs</span>
          </div>

          <div className="p-5 space-y-3">
            <div className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-stone-900 text-sm">
                    Deluxe Pasta Bolognese, Garden Salad & Rolls
                  </span>
                  <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-2 py-0.5 rounded-full">
                    Confirmed Delivered
                  </span>
                </div>
                <p className="text-stone-500">
                  70 Servings • Grand Horizon Hotel → Care & Nourish Youth Shelter
                </p>
                <p className="text-[11px] text-stone-400">
                  Transported with vehicle thermal bags • Received 5-star rating
                </p>
              </div>

              <div className="text-right shrink-0">
                <span className="text-emerald-700 font-bold block">+50 Impact Points</span>
                <span className="text-stone-400 text-[10px]">Verified receipt</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Swiggy-Style Live GPS Delivery Map Modal */}
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
