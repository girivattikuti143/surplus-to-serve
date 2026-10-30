import React, { useState, useEffect } from 'react';
import { Clock, AlertTriangle, ShieldCheck } from 'lucide-react';

interface ExpiryCountdownProps {
  expiryTime: string;
  showIcon?: boolean;
  compact?: boolean;
}

export const ExpiryCountdown: React.FC<ExpiryCountdownProps> = ({
  expiryTime,
  showIcon = true,
  compact = false,
}) => {
  const [timeLeft, setTimeLeft] = useState<{
    hours: number;
    minutes: number;
    seconds: number;
    isExpired: boolean;
    totalMs: number;
  }>({ hours: 0, minutes: 0, seconds: 0, isExpired: false, totalMs: 0 });

  useEffect(() => {
    const calculate = () => {
      const now = Date.now();
      const target = new Date(expiryTime).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({ hours: 0, minutes: 0, seconds: 0, isExpired: true, totalMs: 0 });
        return;
      }

      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);

      setTimeLeft({ hours, minutes, seconds, isExpired: false, totalMs: diff });
    };

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [expiryTime]);

  if (timeLeft.isExpired) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-semibold bg-red-100 text-red-800 border border-red-200">
        <AlertTriangle className="w-3.5 h-3.5 text-red-600" />
        <span>Expired (Unsafe for consumption)</span>
      </span>
    );
  }

  const hoursRemaining = timeLeft.totalMs / (1000 * 60 * 60);

  // Critical: less than 3 hours
  if (hoursRemaining < 3) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold bg-amber-500/15 text-orange-700 border border-orange-300 animate-pulse">
        {showIcon && <AlertTriangle className="w-3.5 h-3.5 text-orange-600" />}
        <span>
          {compact ? 'Exp: ' : 'Urgent: Expires in '}
          {timeLeft.hours}h {timeLeft.minutes}m {timeLeft.seconds}s
        </span>
      </span>
    );
  }

  // Moderate urgency: 3 to 8 hours
  if (hoursRemaining < 8) {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-amber-50 text-amber-800 border border-amber-200">
        {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600" />}
        <span>
          {compact ? 'Exp: ' : 'Expires in '}
          {timeLeft.hours}h {timeLeft.minutes}m
        </span>
      </span>
    );
  }

  // Plenty of time: > 8 hours
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium bg-emerald-50 text-emerald-800 border border-emerald-200">
      {showIcon && <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />}
      <span>
        {compact ? 'Valid: ' : 'Fresh & Safe: '}
        {timeLeft.hours >= 24
          ? `${Math.floor(timeLeft.hours / 24)}d ${timeLeft.hours % 24}h remaining`
          : `${timeLeft.hours}h ${timeLeft.minutes}m remaining`}
      </span>
    </span>
  );
};
