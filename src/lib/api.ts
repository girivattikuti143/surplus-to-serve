import { User, Donation, Delivery, Notification, Feedback, SystemStats } from '../types';

const TOKEN_KEY = 'surplus_to_serve_jwt';

export const getStoredToken = (): string | null => {
  return localStorage.getItem(TOKEN_KEY);
};

export const setStoredToken = (token: string | null) => {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
};

async function apiFetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = getStoredToken();
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const response = await fetch(endpoint, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.error || data.message || `Request failed with status ${response.status}`);
  }

  return data as T;
}

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const data = await apiFetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredToken(data.token);
    return data;
  },

  register: async (userData: any) => {
    const data = await apiFetch<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
    setStoredToken(data.token);
    return data;
  },

  getCurrentUser: async () => {
    return apiFetch<{ user: User }>('/api/auth/me');
  },

  updateProfile: async (updates: Partial<User>) => {
    return apiFetch<{ user: User }>('/api/auth/profile', {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  // Stats
  getStats: async () => {
    return apiFetch<SystemStats>('/api/stats');
  },

  // Donations
  getDonations: async (params?: {
    status?: string;
    category?: string;
    donorId?: string;
    acceptedByNgoId?: string;
    assignedVolunteerId?: string;
    city?: string;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val) query.append(key, val);
      });
    }
    const qStr = query.toString();
    return apiFetch<Donation[]>(`/api/donations${qStr ? `?${qStr}` : ''}`);
  },

  getDonationById: async (id: string) => {
    return apiFetch<Donation>(`/api/donations/${id}`);
  },

  createDonation: async (donation: Partial<Donation>) => {
    return apiFetch<Donation>('/api/donations', {
      method: 'POST',
      body: JSON.stringify(donation),
    });
  },

  updateDonation: async (id: string, updates: Partial<Donation>) => {
    return apiFetch<Donation>(`/api/donations/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });
  },

  deleteDonation: async (id: string) => {
    return apiFetch<{ message: string }>(`/api/donations/${id}`, {
      method: 'DELETE',
    });
  },

  // Workflow actions
  acceptDonation: async (id: string) => {
    return apiFetch<Donation>(`/api/donations/${id}/accept`, {
      method: 'POST',
    });
  },

  requestVolunteer: async (id: string) => {
    return apiFetch<Donation>(`/api/donations/${id}/request-volunteer`, {
      method: 'POST',
    });
  },

  claimDeliveryTask: async (id: string) => {
    return apiFetch<{ donation: Donation; delivery: Delivery }>(`/api/donations/${id}/claim-task`, {
      method: 'POST',
    });
  },

  updateDonationStatus: async (id: string, status: string, notes?: string) => {
    return apiFetch<Donation>(`/api/donations/${id}/status`, {
      method: 'POST',
      body: JSON.stringify({ status, notes }),
    });
  },

  // Deliveries
  getDeliveries: async (params?: { volunteerId?: string; donationId?: string; status?: string }) => {
    const query = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, val]) => {
        if (val) query.append(key, val);
      });
    }
    const qStr = query.toString();
    return apiFetch<Delivery[]>(`/api/deliveries${qStr ? `?${qStr}` : ''}`);
  },

  // Admin
  getUsers: async () => {
    return apiFetch<User[]>('/api/admin/users');
  },

  verifyUser: async (id: string, isVerified: boolean) => {
    return apiFetch<User>(`/api/admin/users/${id}/verify`, {
      method: 'PUT',
      body: JSON.stringify({ isVerified }),
    });
  },

  deleteUser: async (id: string) => {
    return apiFetch<{ message: string }>(`/api/admin/users/${id}`, {
      method: 'DELETE',
    });
  },

  // Notifications
  getNotifications: async () => {
    return apiFetch<Notification[]>('/api/notifications');
  },

  markNotificationRead: async (id: string) => {
    return apiFetch<{ success: boolean }>(`/api/notifications/${id}/read`, {
      method: 'PUT',
    });
  },

  markAllNotificationsRead: async () => {
    return apiFetch<{ success: boolean }>('/api/notifications/mark-all-read', {
      method: 'POST',
    });
  },

  // Feedback
  getFeedback: async (donationId?: string) => {
    const q = donationId ? `?donationId=${donationId}` : '';
    return apiFetch<Feedback[]>(`/api/feedback${q}`);
  },

  submitFeedback: async (feedback: {
    donationId: string;
    rating: number;
    comment: string;
    foodQualityRating?: number;
    punctualityRating?: number;
    toUserId?: string;
  }) => {
    return apiFetch<Feedback>('/api/feedback', {
      method: 'POST',
      body: JSON.stringify(feedback),
    });
  },

  // Contact
  sendContactMessage: async (msg: { name: string; email: string; subject: string; message: string }) => {
    return apiFetch<{ message: string }>('/api/contact', {
      method: 'POST',
      body: JSON.stringify(msg),
    });
  },

  // System
  getDbInfo: async () => {
    return apiFetch<any>('/api/system/db-info');
  },

  resetDemoData: async () => {
    return apiFetch<{ message: string }>('/api/system/reset-demo', {
      method: 'POST',
    });
  },
};
