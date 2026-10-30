export type UserRole = 'donor' | 'ngo' | 'volunteer' | 'admin';

export type FoodCategory =
  | 'Cooked Meals'
  | 'Bakery & Bread'
  | 'Fruits & Veggies'
  | 'Packaged Food'
  | 'Dairy & Beverages'
  | 'Dry Grains';

export type DonationStatus =
  | 'Available'
  | 'Requested'
  | 'Accepted'
  | 'Volunteer Assigned'
  | 'Picked Up'
  | 'Delivered'
  | 'Completed'
  | 'Cancelled'
  | 'Expired';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  organizationType?: string;
  regNumber?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isVerified: boolean;
  avatar?: string;
  createdAt: string;
  vehicleType?: 'Bike' | 'Car' | 'Van' | 'Electric Scooter' | 'Foot';
  dailyCapacity?: number;
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  donorAddress: string;
  donorCity: string;
  foodName: string;
  category: FoodCategory;
  quantity: string;
  servings: number;
  prepDate: string;
  expiryTime: string;
  pickupLocation: string;
  pickupInstructions: string;
  imageUrl: string;
  temperatureType: 'Room Temp' | 'Hot (Insulated)' | 'Refrigerated' | 'Frozen';
  safetyDeclaration: boolean;
  status: DonationStatus;
  acceptedByNgoId?: string;
  acceptedByNgoName?: string;
  acceptedAt?: string;
  assignedVolunteerId?: string;
  assignedVolunteerName?: string;
  assignedVolunteerPhone?: string;
  pickupTime?: string;
  deliveryTime?: string;
  completedAt?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Delivery {
  id: string;
  donationId: string;
  volunteerId: string;
  volunteerName: string;
  volunteerPhone: string;
  donorName: string;
  donorAddress: string;
  donorPhone: string;
  ngoName: string;
  ngoAddress: string;
  ngoPhone: string;
  foodDetails: string;
  servings: number;
  status: 'Assigned' | 'Picked Up' | 'Delivered' | 'Confirmed';
  pickupTime?: string;
  deliveryTime?: string;
  proofNotes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  userId: string;
  role?: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Feedback {
  id: string;
  donationId: string;
  fromUserId: string;
  fromUserName: string;
  fromRole: 'donor' | 'ngo' | 'volunteer';
  toUserId?: string;
  rating: number;
  comment: string;
  foodQualityRating?: number;
  punctualityRating?: number;
  createdAt: string;
}

export interface SystemStats {
  totalDonors: number;
  totalNgos: number;
  totalVolunteers: number;
  totalDonations: number;
  activeDonations: number;
  completedDonations: number;
  totalServings: number;
  rescuedMeals: number;
  co2SavedKg: number;
  beneficiariesHelped: number;
  categoryDistribution: { name: string; count: number }[];
  statusBreakdown: { name: string; count: number }[];
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}
