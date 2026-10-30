import React, { useState, useEffect } from 'react';
import { 
  ShieldCheck, 
  Users, 
  Building2, 
  Truck, 
  Utensils, 
  Trash2, 
  CheckCircle2, 
  XCircle, 
  Download, 
  RefreshCw, 
  Search, 
  Filter, 
  AlertTriangle,
  BarChart3,
  Database,
  ExternalLink,
  Award,
  Layers
} from 'lucide-react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  PieChart, 
  Pie, 
  Cell, 
  Legend 
} from 'recharts';
import { api } from '../lib/api';
import { User, Donation, SystemStats } from '../types';
import { StatusBadge } from '../components/StatusBadge';
import { useAuth } from '../context/AuthContext';
import { useNotifications } from '../context/NotificationContext';

export const AdminDashboard: React.FC<{ onNavigate: (page: string) => void; onOpenDbModal: () => void }> = ({ 
  onNavigate, 
  onOpenDbModal 
}) => {
  const { user } = useAuth();
  const { showToast } = useNotifications();

  const [stats, setStats] = useState<SystemStats | null>(null);
  const [usersList, setUsersList] = useState<User[]>([]);
  const [donationsList, setDonationsList] = useState<Donation[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'analytics' | 'users' | 'donations' | 'system'>('analytics');

  // User filters
  const [userRoleFilter, setUserRoleFilter] = useState<string>('All');
  const [userSearch, setUserSearch] = useState('');

  // Donation filters
  const [donationStatusFilter, setDonationStatusFilter] = useState('All');
  const [donationSearch, setDonationSearch] = useState('');

  const [actionLoading, setActionLoading] = useState<string | null>(null);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [statsData, usersData, donationsData] = await Promise.all([
        api.getStats(),
        api.getUsers(),
        api.getDonations(),
      ]);
      setStats(statsData);
      setUsersList(usersData);
      setDonationsList(donationsData);
    } catch (err: any) {
      showToast('Error loading admin data: ' + err.message, 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminData();
  }, []);

  // Verification toggle
  const handleToggleVerification = async (userId: string, currentStatus: boolean) => {
    setActionLoading(userId);
    try {
      const updated = await api.verifyUser(userId, !currentStatus);
      showToast(`User ${updated.name} verification set to ${updated.isVerified ? 'VERIFIED' : 'PENDING'}`, 'success');
      setUsersList(prev => prev.map(u => u.id === userId ? { ...u, isVerified: updated.isVerified } : u));
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete user
  const handleDeleteUser = async (userId: string, name: string) => {
    if (!confirm(`Are you sure you want to delete account: ${name}?`)) return;
    setActionLoading(userId);
    try {
      await api.deleteUser(userId);
      showToast(`Account "${name}" removed.`, 'info');
      setUsersList(prev => prev.filter(u => u.id !== userId));
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Delete invalid donation
  const handleDeleteDonation = async (donationId: string) => {
    if (!confirm('Are you sure you want to remove this donation listing?')) return;
    setActionLoading(donationId);
    try {
      await api.deleteDonation(donationId);
      showToast('Donation removed from system.', 'info');
      setDonationsList(prev => prev.filter(d => d.id !== donationId));
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setActionLoading(null);
    }
  };

  // Export CSV Report
  const handleExportCSV = () => {
    if (donationsList.length === 0) {
      showToast('No donations to export', 'info');
      return;
    }
    const headers = ['ID', 'Food Name', 'Category', 'Donor', 'City', 'Servings', 'Status', 'Expiry', 'Accepted NGO', 'Volunteer', 'Created At'];
    const rows = donationsList.map(d => [
      d.id,
      `"${d.foodName.replace(/"/g, '""')}"`,
      d.category,
      `"${d.donorName.replace(/"/g, '""')}"`,
      d.donorCity,
      d.servings,
      d.status,
      d.expiryTime,
      `"${(d.acceptedByNgoName || 'None').replace(/"/g, '""')}"`,
      `"${(d.assignedVolunteerName || 'None').replace(/"/g, '""')}"`,
      d.createdAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `surplus_to_serve_report_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    showToast('Comprehensive report exported as CSV!', 'success');
  };

  // Filtered users
  const filteredUsers = usersList.filter(u => {
    const matchesRole = userRoleFilter === 'All' || u.role === userRoleFilter.toLowerCase();
    const matchesSearch = !userSearch || u.name.toLowerCase().includes(userSearch.toLowerCase()) || u.email.toLowerCase().includes(userSearch.toLowerCase());
    return matchesRole && matchesSearch;
  });

  // Filtered donations
  const filteredDonations = donationsList.filter(d => {
    const matchesStatus = donationStatusFilter === 'All' || d.status === donationStatusFilter;
    const matchesSearch = !donationSearch || d.foodName.toLowerCase().includes(donationSearch.toLowerCase()) || d.donorName.toLowerCase().includes(donationSearch.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Chart data colors
  const COLORS = ['#059669', '#3b82f6', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-purple-950 to-emerald-950 rounded-3xl p-6 sm:p-10 text-white shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-900/80 text-purple-200 border border-purple-500/40">
              Admin Command Console
            </span>
            <span className="flex items-center gap-1 text-xs text-lime-300 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              Full Governance Access
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif">
            Platform Administration & Auditing
          </h1>
          <p className="text-stone-300 text-sm max-w-xl">
            Logged in as {user?.name || 'Administrator'} • Real-time user verification, donation tracking, food safety oversight, and analytical reports.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleExportCSV}
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs rounded-xl shadow-md transition cursor-pointer flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            <span>Export CSV Audit</span>
          </button>
          <button
            onClick={onOpenDbModal}
            className="px-4 py-2.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/20 transition cursor-pointer flex items-center gap-2"
          >
            <Database className="w-4 h-4 text-emerald-400" />
            <span>MongoDB Specs</span>
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Registered Donors</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-emerald-700 font-serif mt-1">
            {stats?.totalDonors || 0}
          </p>
          <span className="text-[11px] text-stone-400 font-medium mt-1 block">Hotels, caterers & marts</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Certified NGOs</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-blue-700 font-serif mt-1">
            {stats?.totalNgos || 0}
          </p>
          <span className="text-[11px] text-stone-400 font-medium mt-1 block">Community kitchens</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Volunteer Drivers</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-amber-700 font-serif mt-1">
            {stats?.totalVolunteers || 0}
          </p>
          <span className="text-[11px] text-stone-400 font-medium mt-1 block">Fleet operators</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-2xs">
          <span className="text-xs font-semibold text-stone-500 block">Total Meals Rescued</span>
          <p className="text-2xl sm:text-3xl font-extrabold text-purple-700 font-serif mt-1">
            {stats?.rescuedMeals || 0}
          </p>
          <span className="text-[11px] text-purple-700 font-medium mt-1 block">Edible servings saved</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 gap-4">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`pb-3 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'analytics'
              ? 'border-purple-600 text-purple-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <BarChart3 className="w-4 h-4" />
          <span>Real-time Analytics & Charts</span>
        </button>

        <button
          onClick={() => setActiveTab('users')}
          className={`pb-3 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'users'
              ? 'border-purple-600 text-purple-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>User Verification & Management ({usersList.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('donations')}
          className={`pb-3 text-sm font-semibold border-b-2 transition cursor-pointer flex items-center gap-2 ${
            activeTab === 'donations'
              ? 'border-purple-600 text-purple-900 font-bold'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Utensils className="w-4 h-4" />
          <span>Donations & Deliveries Monitor ({donationsList.length})</span>
        </button>
      </div>

      {/* TAB 1: Analytics & Charts */}
      {activeTab === 'analytics' && stats && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Distribution Chart */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Surplus Food Categories</h3>
                  <p className="text-xs text-stone-500">Distribution of rescued foods by type</p>
                </div>
                <span className="text-xs bg-emerald-50 text-emerald-800 px-2.5 py-1 rounded-md font-semibold">
                  Live MongoDB Data
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={stats.categoryDistribution}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                    >
                      {stats.categoryDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Status Breakdown Bar Chart */}
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-stone-900 text-base">Donation Status Pipeline</h3>
                  <p className="text-xs text-stone-500">Breakdown of orders in current lifecycle</p>
                </div>
                <span className="text-xs bg-blue-50 text-blue-800 px-2.5 py-1 rounded-md font-semibold">
                  Workflow States
                </span>
              </div>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={stats.statusBreakdown}>
                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#10b981" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Environmental & Humanitarian Impact Row */}
          <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200 grid grid-cols-1 md:grid-cols-3 gap-6 text-xs">
            <div className="space-y-1">
              <span className="font-bold text-emerald-950 text-sm">Carbon Offset Equivalency</span>
              <p className="text-stone-600">
                {stats.co2SavedKg} kg of CO₂ prevented from decomposing into greenhouse gas emissions in landfills.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-emerald-950 text-sm">Beneficiary Outreach</span>
              <p className="text-stone-600">
                Over {stats.beneficiariesHelped} children, senior citizens, and unhoused residents fed via community kitchens.
              </p>
            </div>
            <div className="space-y-1">
              <span className="font-bold text-emerald-950 text-sm">Food Safety Index</span>
              <p className="text-stone-600">
                100% of recorded batches had strict expiry timestamps and pre-inspection hygiene declarations.
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: User Verification & Management */}
      {activeTab === 'users' && (
        <div className="space-y-4">
          {/* Filters */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search user name or email..."
                value={userSearch}
                onChange={e => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Role:</span>
              <select
                value={userRoleFilter}
                onChange={e => setUserRoleFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 font-medium"
              >
                <option value="All">All Roles</option>
                <option value="Donor">Donors</option>
                <option value="Ngo">NGOs</option>
                <option value="Volunteer">Volunteers</option>
                <option value="Admin">Admins</option>
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">User / Organization</th>
                    <th className="p-3.5">Role</th>
                    <th className="p-3.5">Contact & Location</th>
                    <th className="p-3.5">Verification</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredUsers.map(u => (
                    <tr key={u.id} className="hover:bg-stone-50/80 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&auto=format&fit=crop&q=80'}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block">{u.name}</span>
                            <span className="text-[11px] text-stone-400">{u.email}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5">
                        <span className={`inline-block px-2 py-0.5 rounded text-[10px] uppercase font-bold ${
                          u.role === 'donor' ? 'bg-emerald-100 text-emerald-800' :
                          u.role === 'ngo' ? 'bg-blue-100 text-blue-800' :
                          u.role === 'volunteer' ? 'bg-amber-100 text-amber-800' :
                          'bg-purple-100 text-purple-800'
                        }`}>
                          {u.role}
                        </span>
                        {u.organizationType && (
                          <span className="text-[10px] text-stone-500 block mt-0.5">{u.organizationType}</span>
                        )}
                      </td>

                      <td className="p-3.5 text-stone-600">
                        <span className="block">{u.phone || 'No phone'}</span>
                        <span className="text-[11px] text-stone-400">{u.city}, {u.state}</span>
                      </td>

                      <td className="p-3.5">
                        <button
                          onClick={() => handleToggleVerification(u.id, u.isVerified)}
                          disabled={actionLoading === u.id}
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold transition cursor-pointer ${
                            u.isVerified
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-red-50 hover:text-red-700'
                              : 'bg-amber-100 text-amber-800 hover:bg-emerald-100 hover:text-emerald-800'
                          }`}
                          title="Click to toggle verification status"
                        >
                          {u.isVerified ? (
                            <>
                              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <>
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                              <span>Pending Verification</span>
                            </>
                          )}
                        </button>
                      </td>

                      <td className="p-3.5 text-right">
                        {u.id !== user?.id && (
                          <button
                            onClick={() => handleDeleteUser(u.id, u.name)}
                            disabled={actionLoading === u.id}
                            className="p-1.5 text-stone-400 hover:text-red-600 rounded transition cursor-pointer"
                            title="Delete User"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: Donations & Deliveries Monitor */}
      {activeTab === 'donations' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-white p-4 rounded-2xl border border-stone-200">
            <div className="relative flex-1 max-w-sm">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Search donation item or donor..."
                value={donationSearch}
                onChange={e => setDonationSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-lg border border-stone-200 text-xs focus:ring-1 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-stone-500">Status:</span>
              <select
                value={donationStatusFilter}
                onChange={e => setDonationStatusFilter(e.target.value)}
                className="text-xs bg-stone-50 border border-stone-200 rounded-lg px-2.5 py-1.5 font-medium"
              >
                <option value="All">All Statuses</option>
                <option value="Available">Available</option>
                <option value="Accepted">Accepted</option>
                <option value="Volunteer Assigned">Volunteer Assigned</option>
                <option value="Picked Up">Picked Up</option>
                <option value="Delivered">Delivered</option>
                <option value="Completed">Completed</option>
                <option value="Expired">Expired</option>
              </select>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="p-3.5">Food Listing</th>
                    <th className="p-3.5">Donor</th>
                    <th className="p-3.5">Servings</th>
                    <th className="p-3.5">Status</th>
                    <th className="p-3.5">NGO Claim / Driver</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredDonations.map(d => (
                    <tr key={d.id} className="hover:bg-stone-50/80 transition">
                      <td className="p-3.5">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={d.imageUrl}
                            alt={d.foodName}
                            className="w-9 h-9 rounded-lg object-cover border"
                          />
                          <div>
                            <span className="font-bold text-stone-900 block line-clamp-1">{d.foodName}</span>
                            <span className="text-[10px] text-stone-400">{d.category} • {d.quantity}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-3.5 text-stone-700">
                        <span className="font-semibold block">{d.donorName}</span>
                        <span className="text-[10px] text-stone-400">{d.donorCity}</span>
                      </td>

                      <td className="p-3.5 font-bold text-stone-900">
                        {d.servings}
                      </td>

                      <td className="p-3.5">
                        <StatusBadge status={d.status} size="sm" />
                      </td>

                      <td className="p-3.5 text-stone-600">
                        {d.acceptedByNgoName ? (
                          <>
                            <span className="font-semibold text-blue-900 block">NGO: {d.acceptedByNgoName}</span>
                            {d.assignedVolunteerName && (
                              <span className="text-[10px] text-stone-400">Driver: {d.assignedVolunteerName}</span>
                            )}
                          </>
                        ) : (
                          <span className="text-stone-400 italic">Unclaimed</span>
                        )}
                      </td>

                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleDeleteDonation(d.id)}
                          disabled={actionLoading === d.id}
                          className="p-1.5 text-stone-400 hover:text-red-600 rounded transition cursor-pointer"
                          title="Remove invalid donation"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
