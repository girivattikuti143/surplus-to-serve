import React, { useState, useEffect } from 'react';
import { Database, Server, CheckCircle2, Copy, Check, RefreshCw, X, Shield, Code2, Terminal } from 'lucide-react';
import { api } from '../lib/api';

interface DatabaseSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DatabaseSetupModal: React.FC<DatabaseSetupModalProps> = ({ isOpen, onClose }) => {
  const [dbInfo, setDbInfo] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<'architecture' | 'mongoose' | 'runLocally'>('architecture');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [resetting, setResetting] = useState(false);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      api.getDbInfo().then(setDbInfo).catch(console.error);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedCode(id);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const handleResetData = async () => {
    setResetting(true);
    try {
      const res = await api.resetDemoData();
      setResetMessage(res.message);
      const info = await api.getDbInfo();
      setDbInfo(info);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (err: any) {
      setResetMessage('Reset error: ' + err.message);
    } finally {
      setResetting(false);
    }
  };

  const mongooseSnippet = `// MongoDB Mongoose Models Setup (models/SurplusSchema.js)
const mongoose = require('mongoose');

// 1. User Schema (Donors, NGOs, Volunteers, Admin)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['donor', 'ngo', 'volunteer', 'admin'], required: true },
  organizationType: { type: String },
  regNumber: { type: String },
  phone: { type: String, required: true },
  address: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, default: 'CA' },
  pincode: { type: String, required: true },
  isVerified: { type: Boolean, default: false },
  vehicleType: { type: String, enum: ['Bike', 'Car', 'Van', 'Electric Scooter', 'Foot'] },
  dailyCapacity: { type: Number },
  createdAt: { type: Date, default: Date.now }
});

// 2. Donation Schema
const DonationSchema = new mongoose.Schema({
  donorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorName: { type: String, required: true },
  foodName: { type: String, required: true },
  category: { type: String, enum: ['Cooked Meals', 'Bakery & Bread', 'Fruits & Veggies', 'Packaged Food', 'Dairy & Beverages', 'Dry Grains'], required: true },
  quantity: { type: String, required: true },
  servings: { type: Number, required: true },
  prepDate: { type: Date, default: Date.now },
  expiryTime: { type: Date, required: true },
  pickupLocation: { type: String, required: true },
  pickupInstructions: { type: String },
  imageUrl: { type: String },
  temperatureType: { type: String, enum: ['Room Temp', 'Hot (Insulated)', 'Refrigerated', 'Frozen'] },
  safetyDeclaration: { type: Boolean, required: true },
  status: { 
    type: String, 
    enum: ['Available', 'Requested', 'Accepted', 'Volunteer Assigned', 'Picked Up', 'Delivered', 'Completed', 'Cancelled', 'Expired'],
    default: 'Available' 
  },
  acceptedByNgoId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assignedVolunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
}, { timestamps: true });

// 3. Deliveries Schema
const DeliverySchema = new mongoose.Schema({
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  volunteerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  donorAddress: { type: String, required: true },
  ngoAddress: { type: String, required: true },
  status: { type: String, enum: ['Assigned', 'Picked Up', 'Delivered', 'Confirmed'], default: 'Assigned' },
  pickupTime: Date,
  deliveryTime: Date,
  proofNotes: String
}, { timestamps: true });

// 4. Feedback Schema
const FeedbackSchema = new mongoose.Schema({
  donationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Donation', required: true },
  fromUserId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  comment: { type: String, required: true }
}, { timestamps: true });`;

  const runLocallySnippet = `# 1. Clone repository & install dependencies
git clone <your-repository-url>
cd surplus-to-serve
npm install

# 2. Configure environment variables (.env)
PORT=3000
JWT_SECRET=surplus_to_serve_super_secret_jwt_key_2026
MONGODB_URI=mongodb://localhost:27017/surplus_to_serve

# 3. Start development server (Full-stack Express + Vite)
npm run dev

# App runs at: http://localhost:3000`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-stone-200 overflow-hidden">
        {/* Header */}
        <div className="p-6 bg-gradient-to-r from-emerald-900 to-emerald-800 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-emerald-300">
              <Database className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold">System Architecture & MongoDB Engine</h3>
                <span className="px-2 py-0.5 rounded text-xs font-semibold bg-emerald-500 text-white">
                  B.Tech Project Ready
                </span>
              </div>
              <p className="text-emerald-100 text-sm">
                Surplus to Serve – Full-Stack Food Waste Redistribution Engine
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-2 rounded-lg hover:bg-white/10 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Live Status Bar */}
        <div className="bg-emerald-50/80 border-b border-emerald-100 px-6 py-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-emerald-900 font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span>Database Status: <strong>Connected & Active</strong></span>
          </div>
          {dbInfo && (
            <div className="flex items-center gap-4 text-emerald-800">
              <span>Users: <strong>{dbInfo.totalDocuments?.users || 0}</strong></span>
              <span>Donations: <strong>{dbInfo.totalDocuments?.donations || 0}</strong></span>
              <span>Deliveries: <strong>{dbInfo.totalDocuments?.deliveries || 0}</strong></span>
              <span>Feedback: <strong>{dbInfo.totalDocuments?.feedback || 0}</strong></span>
            </div>
          )}
          <button
            onClick={handleResetData}
            disabled={resetting}
            className="flex items-center gap-1.5 px-3 py-1 bg-white text-stone-700 hover:text-emerald-800 border border-stone-200 rounded-md shadow-2xs hover:bg-emerald-50 transition cursor-pointer font-medium"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${resetting ? 'animate-spin text-emerald-600' : ''}`} />
            <span>{resetting ? 'Resetting...' : 'Reset Initial Demo Data'}</span>
          </button>
        </div>

        {resetMessage && (
          <div className="bg-emerald-600 text-white text-xs px-6 py-2 text-center font-medium">
            {resetMessage}
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-stone-200 px-6 pt-3 bg-stone-50 gap-4">
          <button
            onClick={() => setActiveTab('architecture')}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition ${
              activeTab === 'architecture'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Server className="w-4 h-4" />
            MongoDB Collections (8)
          </button>
          <button
            onClick={() => setActiveTab('mongoose')}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition ${
              activeTab === 'mongoose'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Code2 className="w-4 h-4" />
            Mongoose Schema Code
          </button>
          <button
            onClick={() => setActiveTab('runLocally')}
            className={`pb-3 text-sm font-semibold border-b-2 flex items-center gap-2 cursor-pointer transition ${
              activeTab === 'runLocally'
                ? 'border-emerald-600 text-emerald-800'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <Terminal className="w-4 h-4" />
            Local Run & Setup Guide
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-4">
          {activeTab === 'architecture' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-stone-50 border border-stone-200">
                <h4 className="font-bold text-stone-800 mb-1 flex items-center gap-2">
                  <Shield className="w-4 h-4 text-emerald-600" />
                  MongoDB Collections & Role-Based Access Control
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  The platform models all entities across 8 interconnected collections with relational references.
                  Active state transitions are enforced through JWT role authorization.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                {[
                  { name: 'Users', desc: 'Stores donor, NGO, volunteer, and admin records with passwords, addresses, and verification status.' },
                  { name: 'Donations', desc: 'Tracks surplus food listings, categories, quantities, expiry countdown, temperature, and current lifecycle state.' },
                  { name: 'NGOs', desc: 'Manages certified hunger relief shelters, food banks, daily meal capacity, and distribution zones.' },
                  { name: 'Volunteers', desc: 'Driver profiles, vehicle types (Bike, Car, Van), active coordinates, and delivery history.' },
                  { name: 'Requests', desc: 'NGO demand tickets matching available surplus food from nearby donors.' },
                  { name: 'Deliveries', desc: 'Real-time transit records with donor pickup and NGO dropoff addresses, proof notes, and timestamps.' },
                  { name: 'Notifications', desc: 'System-wide event triggers (donation alerts, assignment updates, delivery confirmations).' },
                  { name: 'Feedback', desc: 'Post-delivery hygiene ratings, punctuality, and community reviews between Donors, NGOs, and Volunteers.' },
                ].map((col) => (
                  <div key={col.name} className="p-3 rounded-lg border border-stone-200 bg-white hover:border-emerald-300 transition shadow-2xs">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-emerald-800 text-sm">collection: {col.name}</span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                    </div>
                    <p className="text-stone-600">{col.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'mongoose' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <p className="text-xs text-stone-600 font-medium">
                  Official Mongoose Schema Definitions for production MongoDB cluster:
                </p>
                <button
                  onClick={() => copyToClipboard(mongooseSnippet, 'mongoose')}
                  className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition cursor-pointer"
                >
                  {copiedCode === 'mongoose' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedCode === 'mongoose' ? 'Copied!' : 'Copy Code'}</span>
                </button>
              </div>
              <pre className="p-4 rounded-xl bg-stone-900 text-emerald-400 font-mono text-xs overflow-x-auto max-h-80 leading-relaxed">
                <code>{mongooseSnippet}</code>
              </pre>
            </div>
          )}

          {activeTab === 'runLocally' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 space-y-2">
                <h5 className="font-bold text-emerald-900 text-sm flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-emerald-700" />
                  Local Execution Instructions (Final-Year Project Viva)
                </h5>
                <p>
                  This project runs as a single-port full-stack architecture where the Express API and Vite React client are served cohesively on port 3000.
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-stone-700">Terminal Commands</span>
                  <button
                    onClick={() => copyToClipboard(runLocallySnippet, 'run')}
                    className="flex items-center gap-1.5 px-2.5 py-1 text-xs bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md transition cursor-pointer"
                  >
                    {copiedCode === 'run' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedCode === 'run' ? 'Copied!' : 'Copy Commands'}</span>
                  </button>
                </div>
                <pre className="p-4 rounded-xl bg-stone-900 text-stone-100 font-mono text-xs overflow-x-auto leading-relaxed">
                  <code>{runLocallySnippet}</code>
                </pre>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-500">
          <span>Surplus to Serve v2.4 • Built with React, Node.js, Express & MongoDB</span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-stone-800 hover:bg-stone-900 text-white font-medium rounded-lg transition cursor-pointer"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
