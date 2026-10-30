import React, { useState } from 'react';
import { 
  HeartHandshake, 
  Utensils, 
  Building2, 
  Truck, 
  CheckCircle2, 
  UserPlus, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  Lock 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';
import { UserRole } from '../types';

export const RegisterPage: React.FC<{ onNavigate: (page: string) => void }> = ({ onNavigate }) => {
  const { register } = useAuth();
  const { showToast } = useNotifications();

  const [role, setRole] = useState<UserRole>('donor');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('Metro City');
  const [state, setState] = useState('CA');
  const [pincode, setPincode] = useState('90001');

  // Role specific
  const [organizationType, setOrganizationType] = useState('Restaurant');
  const [regNumber, setRegNumber] = useState('');
  const [dailyCapacity, setDailyCapacity] = useState('250');
  const [vehicleType, setVehicleType] = useState<'Bike' | 'Car' | 'Van' | 'Electric Scooter' | 'Foot'>('Car');

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user = await register({
        name,
        email,
        password,
        role,
        phone,
        address,
        city,
        state,
        pincode,
        organizationType: role === 'donor' || role === 'ngo' ? organizationType : undefined,
        regNumber: role === 'ngo' ? regNumber : undefined,
        dailyCapacity: role === 'ngo' ? Number(dailyCapacity) : undefined,
        vehicleType: role === 'volunteer' ? vehicleType : undefined,
      });

      showToast(`Welcome to Surplus to Serve, ${user.name}! Account registered.`, 'success');
      if (user.role === 'donor') onNavigate('donor-dashboard');
      else if (user.role === 'ngo') onNavigate('ngo-dashboard');
      else if (user.role === 'volunteer') onNavigate('volunteer-dashboard');
      else onNavigate('donations');
    } catch (err: any) {
      showToast(err.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white p-8 sm:p-10 rounded-3xl border border-stone-200 shadow-xl space-y-8">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white flex items-center justify-center mx-auto shadow-md">
            <HeartHandshake className="w-7 h-7 text-lime-300" />
          </div>
          <h2 className="text-2xl font-extrabold text-stone-900 font-serif">Create an Account</h2>
          <p className="text-xs text-stone-500">
            Join the community food rescue network to donate, deliver, or distribute surplus meals.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div>
          <label className="block text-xs font-bold text-stone-800 mb-2">Select Your Role</label>
          <div className="grid grid-cols-3 gap-2">
            {[
              { id: 'donor', label: 'Food Donor', icon: Utensils, desc: 'Hotels, caterers, stores' },
              { id: 'ngo', label: 'NGO / Shelter', icon: Building2, desc: 'Charities, food banks' },
              { id: 'volunteer', label: 'Volunteer Driver', icon: Truck, desc: 'Transport heroes' },
            ].map(item => {
              const Icon = item.icon;
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => setRole(item.id as UserRole)}
                  className={`p-3 rounded-2xl border text-left transition cursor-pointer flex flex-col justify-between ${
                    role === item.id
                      ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                      : 'border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-700'
                  }`}
                >
                  <Icon className={`w-5 h-5 mb-2 ${role === item.id ? 'text-emerald-700' : 'text-stone-400'}`} />
                  <div>
                    <span className="text-xs font-bold block">{item.label}</span>
                    <span className="text-[10px] text-stone-400 font-normal">{item.desc}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">
                {role === 'donor' ? 'Organization / Restaurant Name *' : role === 'ngo' ? 'NGO / Shelter Name *' : 'Your Full Name *'}
              </label>
              <input
                type="text"
                required
                placeholder={role === 'volunteer' ? 'e.g. John Doe' : 'e.g. City Grand Hotel'}
                value={name}
                onChange={e => setName(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Official Email Address *</label>
              <input
                type="email"
                required
                placeholder="contact@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Create Password *</label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Contact Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 000-0000"
                value={phone}
                onChange={e => setPhone(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
              />
            </div>
          </div>

          {/* Role specific inputs */}
          {role === 'donor' && (
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Donor Category</label>
              <select
                value={organizationType}
                onChange={e => setOrganizationType(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Hotel">Hotel & Hospitality</option>
                <option value="Restaurant">Restaurant / Cafe</option>
                <option value="Supermarket">Supermarket / Grocery Retail</option>
                <option value="Catering">Event Catering & Banquets</option>
                <option value="Bakery">Artisan Bakery & Confectionery</option>
                <option value="Household">Private Household / Individual</option>
              </select>
            </div>
          )}

          {role === 'ngo' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">NGO Registration Number</label>
                <input
                  type="text"
                  placeholder="e.g. NGO-US-88912"
                  value={regNumber}
                  onChange={e => setRegNumber(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-800 mb-1">Daily Meal Capacity (Servings)</label>
                <input
                  type="number"
                  min="10"
                  value={dailyCapacity}
                  onChange={e => setDailyCapacity(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {role === 'volunteer' && (
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Primary Transport Vehicle</label>
              <select
                value={vehicleType}
                onChange={e => setVehicleType(e.target.value as any)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 bg-white"
              >
                <option value="Car">Sedan / Hatchback (Ideal for 5-10 boxes)</option>
                <option value="Van">Van / SUV (Ideal for bulk crates)</option>
                <option value="Bike">Motorcycle / Scooter (Quick hot deliveries)</option>
                <option value="Electric Scooter">Electric Cargo Bike</option>
                <option value="Foot">Foot Walking Courier (&lt; 1 km)</option>
              </select>
            </div>
          )}

          {/* Address fields */}
          <div>
            <label className="block text-xs font-bold text-stone-800 mb-1">Street Address *</label>
            <input
              type="text"
              required
              placeholder="e.g. 100 Main Street, Suite 400"
              value={address}
              onChange={e => setAddress(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-emerald-600 focus:outline-hidden"
            />
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">City</label>
              <input
                type="text"
                required
                value={city}
                onChange={e => setCity(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">State</label>
              <input
                type="text"
                required
                value={state}
                onChange={e => setState(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
            <div>
              <label className="block text-xs font-bold text-stone-800 mb-1">Pincode</label>
              <input
                type="text"
                required
                value={pincode}
                onChange={e => setPincode(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center justify-center gap-2 mt-4"
          >
            <UserPlus className="w-4 h-4" />
            <span>{loading ? 'Creating Account...' : 'Complete Registration'}</span>
          </button>
        </form>

        <div className="text-center text-xs text-stone-500 pt-2 border-t border-stone-100">
          Already registered?{' '}
          <button
            onClick={() => onNavigate('login')}
            className="text-emerald-700 hover:underline font-bold cursor-pointer"
          >
            Sign in to your account
          </button>
        </div>
      </div>
    </div>
  );
};
