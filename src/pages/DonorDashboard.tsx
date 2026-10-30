import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Package, 
  Utensils, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Edit3, 
  Trash2, 
  MapPin, 
  Truck, 
  Building2, 
  ShieldCheck, 
  Calendar,
  X,
  Upload,
  Camera,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../lib/api';
import { Donation, FoodCategory } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { ExpiryCountdown } from '../components/ExpiryCountdown';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const DonorDashboard: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [donations, setDonations] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'available' | 'in-progress' | 'completed'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingDonation, setEditingDonation] = useState<Donation | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form states
  const [foodName, setFoodName] = useState('');
  const [category, setCategory] = useState<FoodCategory>('Cooked Meals');
  const [quantity, setQuantity] = useState('');
  const [servings, setServings] = useState(30);
  const [prepDate, setPrepDate] = useState(new Date().toISOString().slice(0, 16));
  // default expiry in 6 hours
  const [expiryTime, setExpiryTime] = useState(
    new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString().slice(0, 16)
  );
  const [pickupLocation, setPickupLocation] = useState(user?.address || '450 Grand Avenue, Financial District');
  const [pickupInstructions, setPickupInstructions] = useState('Ring kitchen service buzzer at rear gate. Containers ready.');
  const [temperatureType, setTemperatureType] = useState<'Room Temp' | 'Hot (Insulated)' | 'Refrigerated' | 'Frozen'>('Hot (Insulated)');
  const [safetyDeclaration, setSafetyDeclaration] = useState(true);
  const [imageUrl, setImageUrl] = useState('https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80');

  const foodImagePresets: Record<FoodCategory, string> = {
    'Cooked Meals': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
    'Bakery & Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
    'Fruits & Veggies': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
    'Packaged Food': 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&auto=format&fit=crop&q=80',
    'Dairy & Beverages': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
    'Dry Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
  };

  const fetchMyDonations = async () => {
    setLoading(true);
    try {
      const data = await api.getDonations({
        donorId: user?.id,
      });
      setDonations(data);
    } catch (err: any) {
      showToast('Error fetching donations: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyDonations();
  }, [user]);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('Image file size should be less than 5MB', 'error');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImageUrl(reader.result as string);
        showToast('Food photo uploaded successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenAdd = () => {
    setEditingDonation(null);
    setFoodName('');
    setCategory('Cooked Meals');
    setQuantity('25 Portions');
    setServings(35);
    setPrepDate(new Date().toISOString().slice(0, 16));
    setExpiryTime(new Date(Date.now() + 6 * 60 * 60 * 1000).toISOString().slice(0, 16));
    setPickupLocation(user?.address || 'Kitchen Service Gate');
    setPickupInstructions('Clean containers packed. Ring service bell.');
    setTemperatureType('Hot (Insulated)');
    setImageUrl(foodImagePresets['Cooked Meals']);
    setSafetyDeclaration(true);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (donation: Donation) => {
    setEditingDonation(donation);
    setFoodName(donation.foodName);
    setCategory(donation.category);
    setQuantity(donation.quantity);
    setServings(donation.servings);
    setPrepDate(new Date(donation.prepDate).toISOString().slice(0, 16));
    setExpiryTime(new Date(donation.expiryTime).toISOString().slice(0, 16));
    setPickupLocation(donation.pickupLocation);
    setPickupInstructions(donation.pickupInstructions);
    setTemperatureType(donation.temperatureType);
    setImageUrl(donation.imageUrl);
    setSafetyDeclaration(donation.safetyDeclaration);
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!safetyDeclaration) {
      showToast('Food safety declaration is mandatory.', 'error');
      return;
    }
    if (new Date(expiryTime).getTime() <= Date.now()) {
      showToast('Expiry time must be in the future.', 'error');
      return;
    }

    setSubmitting(true);
    try {
      if (editingDonation) {
        await api.updateDonation(editingDonation.id, {
          foodName,
          category,
          quantity,
          servings: Number(servings),
          prepDate: new Date(prepDate).toISOString(),
          expiryTime: new Date(expiryTime).toISOString(),
          pickupLocation,
          pickupInstructions,
          temperatureType,
          imageUrl,
          safetyDeclaration,
        });
        showToast('Donation updated successfully!', 'success');
      } else {
        await api.createDonation({
          foodName,
          category,
          quantity,
          servings: Number(servings),
          prepDate: new Date(prepDate).toISOString(),
          expiryTime: new Date(expiryTime).toISOString(),
          pickupLocation,
          pickupInstructions,
          temperatureType,
          imageUrl,
          safetyDeclaration,
        });
        showToast('Surplus food donation posted! Nearby NGOs have been alerted.', 'success');
      }
      setIsModalOpen(false);
      fetchMyDonations();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelDonation = async (id: string) => {
    if (!confirm('Are you sure you want to cancel this donation?')) return;
    try {
      await api.deleteDonation(id);
      showToast('Donation cancelled or removed.', 'info');
      fetchMyDonations();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  // Filtered lists
  const filteredDonations = donations.filter(d => {
    if (activeTab === 'available') return d.status === 'Available';
    if (activeTab === 'in-progress') return ['Requested', 'Accepted', 'Volunteer Assigned', 'Picked Up', 'Delivered'].includes(d.status);
    if (activeTab === 'completed') return d.status === 'Completed';
    return true;
  });

  const totalServingsDonated = donations.reduce((sum, d) => sum + (d.servings || 0), 0);
  const completedCount = donations.filter(d => d.status === 'Completed').length;
  const activeCount = donations.filter(d => ['Available', 'Accepted', 'Volunteer Assigned', 'Picked Up'].includes(d.status)).length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-700/80 text-lime-300 border border-emerald-500/40">
              Donor Command Center
            </span>
            {user?.isVerified && (
              <span className="flex items-center gap-1 text-xs text-lime-300 font-semibold">
                <ShieldCheck className="w-4 h-4" />
                Verified Donor
              </span>
            )}
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Welcome, {user?.name || 'Grand Horizon Hotel'}
          </h1>
          <p className="text-emerald-100 text-sm max-w-xl">
            {user?.organizationType || 'Hotel / Restaurant'} • Track your surplus food listings, manage ongoing volunteer pickups, and rescue edible meals.
          </p>
        </div>

        <button
          onClick={handleOpenAdd}
          className="px-6 py-3.5 bg-lime-400 hover:bg-lime-300 text-emerald-950 font-bold text-sm rounded-xl shadow-lg hover:shadow-lime-400/20 transition-all flex items-center gap-2 cursor-pointer shrink-0"
        >
          <Plus className="w-5 h-5" />
          <span>Donate Surplus Food</span>
        </button>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Total Postings</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-serif mt-1">
            {donations.length}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Surplus items registered</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Rescued Servings</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-serif mt-1">
            {totalServingsDonated}
          </p>
          <span className="text-[11px] text-emerald-700 font-medium mt-1 block">Meals served to people</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Active In-Progress</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-600 font-serif mt-1">
            {activeCount}
          </p>
          <span className="text-[11px] text-amber-700 font-medium mt-1 block">Claimed or in transit</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Completed Deliveries</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-teal-700 font-serif mt-1">
            {completedCount}
          </p>
          <span className="text-[11px] text-teal-700 font-medium mt-1 block">Confirmed by local NGOs</span>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex border-b border-stone-200 gap-4 overflow-x-auto pb-1">
        {[
          { id: 'all', label: `All Donations (${donations.length})` },
          { id: 'available', label: `Available for Claim (${donations.filter(d => d.status === 'Available').length})` },
          { id: 'in-progress', label: `In Transit / Assigned (${activeCount})` },
          { id: 'completed', label: `Completed (${completedCount})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`pb-3 text-sm font-semibold border-b-2 whitespace-nowrap transition cursor-pointer ${
              activeTab === tab.id
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Donation Cards List */}
      {loading ? (
        <div className="py-20 text-center">
          <div className="w-10 h-10 border-4 border-emerald-600 border-t-transparent rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-xs text-stone-500">Loading your donations...</p>
        </div>
      ) : filteredDonations.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-stone-200 p-8 space-y-4">
          <Utensils className="w-12 h-12 text-stone-300 mx-auto" />
          <h3 className="text-lg font-bold text-stone-800">No Donations in this Category</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            You don't have any items under the "{activeTab}" filter. Ready to post more surplus food?
          </p>
          <button
            onClick={handleOpenAdd}
            className="px-5 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-xs transition cursor-pointer"
          >
            + Create New Donation
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredDonations.map(donation => (
            <div
              key={donation.id}
              className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs hover:shadow-lg transition-all flex flex-col justify-between"
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

                  {/* Recipient & Volunteer Details */}
                  {donation.acceptedByNgoName && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-100 text-xs text-blue-950 space-y-1">
                      <p className="font-bold flex items-center gap-1.5">
                        <Building2 className="w-3.5 h-3.5 text-blue-700" />
                        Claimed by: {donation.acceptedByNgoName}
                      </p>
                      {donation.assignedVolunteerName && (
                        <p className="text-blue-700 flex items-center gap-1.5">
                          <Truck className="w-3.5 h-3.5 text-blue-600" />
                          Driver: {donation.assignedVolunteerName} ({donation.assignedVolunteerPhone || 'En route'})
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>

              {/* Actions Footer */}
              <div className="p-5 pt-0 border-t border-stone-100 mt-2 flex items-center justify-between gap-2">
                {donation.status === 'Available' ? (
                  <>
                    <button
                      onClick={() => handleOpenEdit(donation)}
                      className="flex-1 py-2 bg-stone-50 hover:bg-stone-100 text-stone-700 font-semibold text-xs rounded-lg border border-stone-200 transition flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleCancelDonation(donation.id)}
                      className="py-2 px-3 bg-red-50 hover:bg-red-100 text-red-700 font-semibold text-xs rounded-lg border border-red-200 transition cursor-pointer"
                      title="Cancel Donation"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <div className="w-full text-center py-2 text-xs font-semibold text-stone-500 bg-stone-50 rounded-lg">
                    {donation.status === 'Completed' ? 'Verified & Completed' : `Status: ${donation.status}`}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add / Edit Food Donation Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl shadow-2xl max-w-xl w-full max-h-[92vh] flex flex-col border border-stone-200 overflow-hidden animate-in fade-in zoom-in-95">
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-bold">
                  {editingDonation ? 'Edit Food Donation' : 'Donate Surplus Edible Food'}
                </h3>
                <p className="text-xs text-emerald-200 mt-0.5">
                  Direct connection with certified NGOs & volunteer drivers
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-white/80 hover:text-white p-1 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4">
              {/* Food Name */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Food Item Name / Description *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Vegetarian Buffet Surplus, Whole Wheat Bread, Fresh Produce"
                  value={foodName}
                  onChange={e => setFoodName(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Category & Quantity Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Food Category *
                  </label>
                  <select
                    value={category}
                    onChange={e => {
                      const newCat = e.target.value as FoodCategory;
                      setCategory(newCat);
                      setImageUrl(foodImagePresets[newCat]);
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    {Object.keys(foodImagePresets).map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Quantity / Packaging *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 40 Trays, 20 kg, 30 Packs"
                    value={quantity}
                    onChange={e => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Servings & Storage Temperature */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Estimated Beneficiary Servings *
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={servings}
                    onChange={e => setServings(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Storage Condition *
                  </label>
                  <select
                    value={temperatureType}
                    onChange={e => setTemperatureType(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600 bg-white"
                  >
                    <option value="Room Temp">Room Temp (Dry & Baked goods)</option>
                    <option value="Hot (Insulated)">Hot (Insulated warmers)</option>
                    <option value="Refrigerated">Refrigerated (Chilled dairy/cooked)</option>
                    <option value="Frozen">Frozen</option>
                  </select>
                </div>
              </div>

              {/* Prep Date & Expiry Datetime */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Preparation Date & Time
                  </label>
                  <input
                    type="datetime-local"
                    value={prepDate}
                    onChange={e => setPrepDate(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-800 mb-1">
                    Strict Expiry Deadline *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={expiryTime}
                    onChange={e => setExpiryTime(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                  />
                </div>
              </div>

              {/* Pickup Location & Instructions */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Pickup Location & Bay *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 450 Grand Ave, Kitchen Service Bay #2"
                  value={pickupLocation}
                  onChange={e => setPickupLocation(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Pickup Instructions for Volunteer
                </label>
                <textarea
                  rows={2}
                  placeholder="e.g. Bring thermal insulated bags, ring bell at rear security gate."
                  value={pickupInstructions}
                  onChange={e => setPickupInstructions(e.target.value)}
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs focus:outline-hidden focus:ring-2 focus:ring-emerald-600"
                />
              </div>

              {/* Food Photo Upload (No link text input) */}
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">
                  Food Photo *
                </label>
                
                <div className="space-y-3">
                  {/* Photo Preview Card */}
                  <div className="relative rounded-2xl overflow-hidden border-2 border-dashed border-stone-300 bg-stone-50 p-2 group hover:border-emerald-500 transition">
                    {imageUrl ? (
                      <div className="relative h-44 w-full rounded-xl overflow-hidden bg-stone-100 flex items-center justify-center">
                        <img
                          src={imageUrl}
                          alt="Food Preview"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-stone-900/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-2">
                          <label className="px-3.5 py-1.5 bg-white hover:bg-stone-100 text-stone-900 text-xs font-bold rounded-lg shadow-md transition cursor-pointer flex items-center gap-1.5">
                            <Camera className="w-3.5 h-3.5 text-emerald-700" />
                            <span>Change Photo</span>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={handleImageFileChange}
                            />
                          </label>
                        </div>
                      </div>
                    ) : (
                      <label className="h-36 w-full flex flex-col items-center justify-center gap-2 cursor-pointer text-stone-500 hover:text-emerald-700 transition">
                        <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="text-xs font-bold">Click to Upload Food Photo</span>
                        <span className="text-[10px] text-stone-400">PNG, JPG or WEBP up to 5MB</span>
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleImageFileChange}
                        />
                      </label>
                    )}
                  </div>

                  {/* Direct Upload button & Reset Option */}
                  <div className="flex items-center gap-3">
                    <label className="flex-1 py-2.5 px-4 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 border border-emerald-300 rounded-xl text-xs font-bold transition cursor-pointer flex items-center justify-center gap-2 shadow-2xs">
                      <Camera className="w-4 h-4 text-emerald-700" />
                      <span>{imageUrl ? 'Upload Different Photo' : 'Upload Food Photo from Device / Camera'}</span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageFileChange}
                      />
                    </label>

                    {imageUrl && (
                      <button
                        type="button"
                        onClick={() => setImageUrl(foodImagePresets[category])}
                        className="px-3 py-2 text-xs font-medium text-stone-600 hover:text-stone-900 hover:bg-stone-100 rounded-xl transition cursor-pointer"
                        title="Reset to category standard photo"
                      >
                        Reset Photo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Mandatory Food Safety Checkbox */}
              <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200">
                <label className="flex items-start gap-2.5 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={safetyDeclaration}
                    onChange={e => setSafetyDeclaration(e.target.checked)}
                    className="w-4 h-4 text-emerald-600 rounded border-stone-300 mt-0.5 focus:ring-emerald-500"
                  />
                  <span className="text-xs text-emerald-950 font-medium leading-relaxed">
                    <strong>Mandatory Food Safety Declaration:</strong> I confirm that this surplus food was prepared in a hygienic kitchen, has been stored at safe temperatures, and is wholesome for human consumption.
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="pt-2 flex items-center justify-end gap-3 border-t border-stone-200">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Saving...' : editingDonation ? 'Update Listing' : 'Publish Donation'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
