import React from 'react';
import { DonationStatus } from '../types';
import { CheckCircle2, Clock, AlertTriangle, Truck, Package, XCircle, ArrowRight } from 'lucide-react';

interface StatusBadgeProps {
  status: DonationStatus;
  size?: 'sm' | 'md' | 'lg';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, size = 'md' }) => {
  const getBadgeConfig = () => {
    switch (status) {
      case 'Available':
        return {
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-200',
          dot: 'bg-emerald-500',
          icon: Package,
          label: 'Available for Claim',
        };
      case 'Requested':
        return {
          bg: 'bg-amber-50 text-amber-800 border-amber-200',
          dot: 'bg-amber-500',
          icon: Clock,
          label: 'Volunteer Requested',
        };
      case 'Accepted':
        return {
          bg: 'bg-blue-50 text-blue-800 border-blue-200',
          dot: 'bg-blue-500',
          icon: CheckCircle2,
          label: 'Accepted by NGO',
        };
      case 'Volunteer Assigned':
        return {
          bg: 'bg-indigo-50 text-indigo-800 border-indigo-200',
          dot: 'bg-indigo-500',
          icon: Truck,
          label: 'Volunteer Assigned',
        };
      case 'Picked Up':
        return {
          bg: 'bg-purple-50 text-purple-800 border-purple-200',
          dot: 'bg-purple-500',
          icon: Truck,
          label: 'In Transit (Picked Up)',
        };
      case 'Delivered':
        return {
          bg: 'bg-teal-50 text-teal-800 border-teal-200',
          dot: 'bg-teal-500',
          icon: CheckCircle2,
          label: 'Delivered (Pending Confirmation)',
        };
      case 'Completed':
        return {
          bg: 'bg-green-100 text-green-900 border-green-300 font-semibold',
          dot: 'bg-green-600',
          icon: CheckCircle2,
          label: 'Completed & Verified',
        };
      case 'Cancelled':
        return {
          bg: 'bg-stone-100 text-stone-700 border-stone-200',
          dot: 'bg-stone-400',
          icon: XCircle,
          label: 'Cancelled',
        };
      case 'Expired':
        return {
          bg: 'bg-red-50 text-red-800 border-red-200 font-semibold',
          dot: 'bg-red-500',
          icon: AlertTriangle,
          label: 'Expired (Safety Discard)',
        };
      default:
        return {
          bg: 'bg-gray-100 text-gray-800 border-gray-200',
          dot: 'bg-gray-400',
          icon: Clock,
          label: status,
        };
    }
  };

  const config = getBadgeConfig();
  const Icon = config.icon;

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5',
    lg: 'text-sm px-3 py-1.5 gap-2',
  }[size];

  return (
    <span
      className={`inline-flex items-center rounded-full border font-medium ${config.bg} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot} animate-pulse`} />
      <Icon className="w-3.5 h-3.5 shrink-0" />
      <span>{config.label}</span>
    </span>
  );
};
