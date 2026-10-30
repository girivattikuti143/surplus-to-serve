import fs from 'fs';
import path from 'path';

export interface User {
  id: string;
  name: string;
  email: string;
  password?: string;
  role: 'donor' | 'ngo' | 'volunteer' | 'admin';
  organizationType?: 'Restaurant' | 'Hotel' | 'Supermarket' | 'Catering' | 'Household' | 'Shelter' | 'Community Kitchen' | 'Food Bank' | 'Other';
  regNumber?: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  isVerified: boolean;
  avatar?: string;
  createdAt: string;
  // Specific role attributes
  vehicleType?: 'Bike' | 'Car' | 'Van' | 'Electric Scooter' | 'Foot';
  dailyCapacity?: number; // for NGO (servings/day)
}

export interface Donation {
  id: string;
  donorId: string;
  donorName: string;
  donorPhone: string;
  donorAddress: string;
  donorCity: string;
  foodName: string;
  category: 'Cooked Meals' | 'Bakery & Bread' | 'Fruits & Veggies' | 'Packaged Food' | 'Dairy & Beverages' | 'Dry Grains';
  quantity: string;
  servings: number;
  prepDate: string;
  expiryTime: string; // ISO datetime
  pickupLocation: string;
  pickupInstructions: string;
  imageUrl: string;
  temperatureType: 'Room Temp' | 'Hot (Insulated)' | 'Refrigerated' | 'Frozen';
  safetyDeclaration: boolean;
  status: 'Available' | 'Requested' | 'Accepted' | 'Volunteer Assigned' | 'Picked Up' | 'Delivered' | 'Completed' | 'Cancelled' | 'Expired';
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
  rating: number; // 1 to 5
  comment: string;
  foodQualityRating?: number;
  punctualityRating?: number;
  createdAt: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface DBData {
  users: User[];
  donations: Donation[];
  deliveries: Delivery[];
  notifications: Notification[];
  feedback: Feedback[];
  contacts: ContactMessage[];
}

const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDataDir() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
}

// Initial realistic seed data
function getInitialSeedData(): DBData {
  const now = new Date();
  
  // Future expiry timestamps
  const in3Hours = new Date(now.getTime() + 3.5 * 60 * 60 * 1000).toISOString();
  const in8Hours = new Date(now.getTime() + 8 * 60 * 60 * 1000).toISOString();
  const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000).toISOString();
  const in48Hours = new Date(now.getTime() + 48 * 60 * 60 * 1000).toISOString();
  const past2Hours = new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString();
  const past1Day = new Date(now.getTime() - 24 * 60 * 60 * 1000).toISOString();
  const past2Days = new Date(now.getTime() - 48 * 60 * 60 * 1000).toISOString();

  const users: User[] = [
    {
      id: 'usr_admin',
      name: 'Dr. Sarah Mitchell',
      email: 'admin@surplus.org',
      password: 'password123',
      role: 'admin',
      phone: '+1 (555) 019-2831',
      address: 'Central Humanitarian Office, 100 Social Impact Plaza',
      city: 'Metro City',
      state: 'CA',
      pincode: '90001',
      isVerified: true,
      createdAt: past2Days,
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_donor_1',
      name: 'Grand Horizon Banquet & Hotel',
      email: 'donor@horizon.com',
      password: 'password123',
      role: 'donor',
      organizationType: 'Hotel',
      phone: '+1 (555) 234-5678',
      address: '450 Grand Avenue, Financial District',
      city: 'Metro City',
      state: 'CA',
      pincode: '90015',
      isVerified: true,
      createdAt: past2Days,
      avatar: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_donor_2',
      name: 'Artisan Sourdough Bakery',
      email: 'baker@artisanbread.com',
      password: 'password123',
      role: 'donor',
      organizationType: 'Bakery & Bread' as any,
      phone: '+1 (555) 345-6789',
      address: '88 Baker St, West End',
      city: 'Metro City',
      state: 'CA',
      pincode: '90028',
      isVerified: true,
      createdAt: past2Days,
      avatar: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_donor_3',
      name: 'Organic Harvest Supermarket',
      email: 'manager@organicharvest.com',
      password: 'password123',
      role: 'donor',
      organizationType: 'Supermarket',
      phone: '+1 (555) 456-7890',
      address: '710 Greenview Blvd, Northside',
      city: 'Metro City',
      state: 'CA',
      pincode: '90034',
      isVerified: true,
      createdAt: past1Day,
      avatar: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_ngo_1',
      name: 'Hope Harbor Community Kitchen',
      email: 'ngo@hopeharbor.org',
      password: 'password123',
      role: 'ngo',
      organizationType: 'Community Kitchen',
      regNumber: 'NGO-US-88912',
      phone: '+1 (555) 789-0123',
      address: '124 Hope Street, Downtown East',
      city: 'Metro City',
      state: 'CA',
      pincode: '90012',
      dailyCapacity: 350,
      isVerified: true,
      createdAt: past2Days,
      avatar: 'https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_ngo_2',
      name: 'Care & Nourish Youth Shelter',
      email: 'shelter@carenourish.org',
      password: 'password123',
      role: 'ngo',
      organizationType: 'Shelter',
      regNumber: 'NGO-US-94210',
      phone: '+1 (555) 890-1234',
      address: '550 Pine Valley Way, South Park',
      city: 'Metro City',
      state: 'CA',
      pincode: '90007',
      dailyCapacity: 180,
      isVerified: true,
      createdAt: past1Day,
      avatar: 'https://images.unsplash.com/photo-1593113598332-cd288d649433?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_vol_1',
      name: 'David Chen',
      email: 'volunteer@surplus.org',
      password: 'password123',
      role: 'volunteer',
      vehicleType: 'Car',
      phone: '+1 (555) 901-2345',
      address: '320 Sunset Boulevard, Apt 4B',
      city: 'Metro City',
      state: 'CA',
      pincode: '90026',
      isVerified: true,
      createdAt: past2Days,
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'
    },
    {
      id: 'usr_vol_2',
      name: 'Elena Rodriguez',
      email: 'elena.vol@surplus.org',
      password: 'password123',
      role: 'volunteer',
      vehicleType: 'Van',
      phone: '+1 (555) 912-3456',
      address: '78 Magnolia Terrace',
      city: 'Metro City',
      state: 'CA',
      pincode: '90045',
      isVerified: true,
      createdAt: past1Day,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'
    }
  ];

  const donations: Donation[] = [
    {
      id: 'don_101',
      donorId: 'usr_donor_1',
      donorName: 'Grand Horizon Banquet & Hotel',
      donorPhone: '+1 (555) 234-5678',
      donorAddress: '450 Grand Avenue, Financial District',
      donorCity: 'Metro City',
      foodName: 'Catering Buffet Surplus: Rice, Vegetable Curry & Roasted Chicken',
      category: 'Cooked Meals',
      quantity: '45 Containers (~60 Servings)',
      servings: 60,
      prepDate: new Date(now.getTime() - 2.5 * 60 * 60 * 1000).toISOString(),
      expiryTime: in3Hours, // Warning: < 4 hours!
      pickupLocation: 'Kitchen Service Bay 2, Rear Gate (ring buzzer)',
      pickupInstructions: 'Thermal food warmers packed. Bring insulated bags or thermal containers.',
      imageUrl: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      temperatureType: 'Hot (Insulated)',
      safetyDeclaration: true,
      status: 'Available',
      createdAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 2.5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'don_102',
      donorId: 'usr_donor_2',
      donorName: 'Artisan Sourdough Bakery',
      donorPhone: '+1 (555) 345-6789',
      donorAddress: '88 Baker St, West End',
      donorCity: 'Metro City',
      foodName: 'Fresh Baked Artisan Loaves, Baguettes & Whole Wheat Rolls',
      category: 'Bakery & Bread',
      quantity: '30 Loaves & 45 Rolls',
      servings: 80,
      prepDate: new Date(now.getTime() - 6 * 60 * 60 * 1000).toISOString(),
      expiryTime: in24Hours,
      pickupLocation: 'Main Counter entrance, ask for Head Baker Tom',
      pickupInstructions: 'Already bagged in clean eco-friendly kraft paper crates.',
      imageUrl: 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      temperatureType: 'Room Temp',
      safetyDeclaration: true,
      status: 'Accepted',
      acceptedByNgoId: 'usr_ngo_1',
      acceptedByNgoName: 'Hope Harbor Community Kitchen',
      acceptedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString(),
      createdAt: new Date(now.getTime() - 5 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1.5 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'don_103',
      donorId: 'usr_donor_3',
      donorName: 'Organic Harvest Supermarket',
      donorPhone: '+1 (555) 456-7890',
      donorAddress: '710 Greenview Blvd, Northside',
      donorCity: 'Metro City',
      foodName: 'Farm Fresh Organic Produce: Apples, Oranges, Spinach & Carrots',
      category: 'Fruits & Veggies',
      quantity: '6 Wooden Crates (~95 kg)',
      servings: 120,
      prepDate: new Date(now.getTime() - 10 * 60 * 60 * 1000).toISOString(),
      expiryTime: in48Hours,
      pickupLocation: 'Loading Dock C on 4th Ave',
      pickupInstructions: 'Assistance available with pallet jack during business hours.',
      imageUrl: 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
      temperatureType: 'Refrigerated',
      safetyDeclaration: true,
      status: 'Volunteer Assigned',
      acceptedByNgoId: 'usr_ngo_1',
      acceptedByNgoName: 'Hope Harbor Community Kitchen',
      acceptedAt: new Date(now.getTime() - 3 * 60 * 60 * 1000).toISOString(),
      assignedVolunteerId: 'usr_vol_1',
      assignedVolunteerName: 'David Chen',
      assignedVolunteerPhone: '+1 (555) 901-2345',
      createdAt: new Date(now.getTime() - 4 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'don_104',
      donorId: 'usr_donor_1',
      donorName: 'Grand Horizon Banquet & Hotel',
      donorPhone: '+1 (555) 234-5678',
      donorAddress: '450 Grand Avenue, Financial District',
      donorCity: 'Metro City',
      foodName: 'Deluxe Pasta Bolognese, Mixed Garden Salad & Garlic Bread',
      category: 'Cooked Meals',
      quantity: '35 Family Portions',
      servings: 70,
      prepDate: past1Day,
      expiryTime: new Date(now.getTime() + 12 * 60 * 60 * 1000).toISOString(),
      pickupLocation: 'Rear service entrance',
      pickupInstructions: 'Handover completed seamlessly.',
      imageUrl: 'https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=600&auto=format&fit=crop&q=80',
      temperatureType: 'Refrigerated',
      safetyDeclaration: true,
      status: 'Completed',
      acceptedByNgoId: 'usr_ngo_2',
      acceptedByNgoName: 'Care & Nourish Youth Shelter',
      acceptedAt: past1Day,
      assignedVolunteerId: 'usr_vol_2',
      assignedVolunteerName: 'Elena Rodriguez',
      assignedVolunteerPhone: '+1 (555) 912-3456',
      pickupTime: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
      deliveryTime: new Date(now.getTime() - 16 * 60 * 60 * 1000).toISOString(),
      completedAt: new Date(now.getTime() - 15 * 60 * 60 * 1000).toISOString(),
      createdAt: past1Day,
      updatedAt: new Date(now.getTime() - 15 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'don_105',
      donorId: 'usr_donor_3',
      donorName: 'Organic Harvest Supermarket',
      donorPhone: '+1 (555) 456-7890',
      donorAddress: '710 Greenview Blvd, Northside',
      donorCity: 'Metro City',
      foodName: 'Wholesome Dairy Pack: Greek Yogurt, Cheddar Cheese & Fresh Milk',
      category: 'Dairy & Beverages',
      quantity: '40 cartons / tubs',
      servings: 50,
      prepDate: past2Days,
      expiryTime: in8Hours,
      pickupLocation: 'Cold storage loading entrance',
      pickupInstructions: 'Requires cooler or rapid delivery.',
      imageUrl: 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
      temperatureType: 'Refrigerated',
      safetyDeclaration: true,
      status: 'Available',
      createdAt: past1Day,
      updatedAt: past1Day
    }
  ];

  const deliveries: Delivery[] = [
    {
      id: 'del_201',
      donationId: 'don_103',
      volunteerId: 'usr_vol_1',
      volunteerName: 'David Chen',
      volunteerPhone: '+1 (555) 901-2345',
      donorName: 'Organic Harvest Supermarket',
      donorAddress: '710 Greenview Blvd, Northside',
      donorPhone: '+1 (555) 456-7890',
      ngoName: 'Hope Harbor Community Kitchen',
      ngoAddress: '124 Hope Street, Downtown East',
      ngoPhone: '+1 (555) 789-0123',
      foodDetails: 'Farm Fresh Organic Produce: Apples, Oranges, Spinach & Carrots',
      servings: 120,
      status: 'Assigned',
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'del_202',
      donationId: 'don_104',
      volunteerId: 'usr_vol_2',
      volunteerName: 'Elena Rodriguez',
      volunteerPhone: '+1 (555) 912-3456',
      donorName: 'Grand Horizon Banquet & Hotel',
      donorAddress: '450 Grand Avenue, Financial District',
      donorPhone: '+1 (555) 234-5678',
      ngoName: 'Care & Nourish Youth Shelter',
      ngoAddress: '550 Pine Valley Way, South Park',
      ngoPhone: '+1 (555) 890-1234',
      foodDetails: 'Deluxe Pasta Bolognese, Mixed Garden Salad & Garlic Bread',
      servings: 70,
      status: 'Confirmed',
      pickupTime: new Date(now.getTime() - 18 * 60 * 60 * 1000).toISOString(),
      deliveryTime: new Date(now.getTime() - 16 * 60 * 60 * 1000).toISOString(),
      proofNotes: 'All 35 packages received intact, safely stored in shelter chillers.',
      createdAt: past1Day,
      updatedAt: new Date(now.getTime() - 15 * 60 * 60 * 1000).toISOString()
    }
  ];

  const notifications: Notification[] = [
    {
      id: 'notif_1',
      userId: 'usr_donor_1',
      role: 'donor',
      title: 'Donation Completed!',
      message: 'Care & Nourish Youth Shelter confirmed delivery of Deluxe Pasta Bolognese. Thank you for making a difference!',
      type: 'success',
      link: '/donor/dashboard',
      read: true,
      createdAt: new Date(now.getTime() - 15 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif_2',
      userId: 'usr_ngo_1',
      role: 'ngo',
      title: 'Urgent Food Available!',
      message: 'Grand Horizon Hotel posted 60 servings of hot cooked meals expiring in ~3.5 hours near your zone.',
      type: 'warning',
      link: '/donations',
      read: false,
      createdAt: new Date(now.getTime() - 2 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif_3',
      userId: 'usr_vol_1',
      role: 'volunteer',
      title: 'New Delivery Task Assigned',
      message: 'You have been assigned to transport 6 crates of organic produce from Organic Harvest Supermarket to Hope Harbor Kitchen.',
      type: 'info',
      link: '/volunteer/dashboard',
      read: false,
      createdAt: new Date(now.getTime() - 1 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'notif_4',
      userId: 'usr_admin',
      role: 'admin',
      title: 'New Donor Registered',
      message: 'Artisan Sourdough Bakery submitted verification credentials for review.',
      type: 'info',
      link: '/admin/dashboard',
      read: true,
      createdAt: past2Days
    }
  ];

  const feedback: Feedback[] = [
    {
      id: 'fb_1',
      donationId: 'don_104',
      fromUserId: 'usr_ngo_2',
      fromUserName: 'Care & Nourish Youth Shelter',
      fromRole: 'ngo',
      toUserId: 'usr_donor_1',
      rating: 5,
      foodQualityRating: 5,
      punctualityRating: 5,
      comment: 'Exceptional food quality! Packaged cleanly, served warm nutritious meals to 70 youth residents. Huge gratitude to Grand Horizon Banquet!',
      createdAt: new Date(now.getTime() - 14 * 60 * 60 * 1000).toISOString()
    },
    {
      id: 'fb_2',
      donationId: 'don_104',
      fromUserId: 'usr_donor_1',
      fromUserName: 'Grand Horizon Banquet & Hotel',
      fromRole: 'donor',
      toUserId: 'usr_vol_2',
      rating: 5,
      punctualityRating: 5,
      comment: 'Volunteer Elena arrived right on schedule with proper delivery crates. Very professional and courteous handling.',
      createdAt: new Date(now.getTime() - 13 * 60 * 60 * 1000).toISOString()
    }
  ];

  const contacts: ContactMessage[] = [
    {
      id: 'cnt_1',
      name: 'Chef Marcus Williams',
      email: 'marcus@culinaryarts.com',
      subject: 'Partnership for Hotel Chain Food Waste Reduction',
      message: 'We manage 4 hotel kitchens across the metro area and would love to configure bulk automated donation dispatching.',
      createdAt: past1Day
    }
  ];

  return {
    users,
    donations,
    deliveries,
    notifications,
    feedback,
    contacts
  };
}

class Database {
  private data: DBData;

  constructor() {
    ensureDataDir();
    this.data = this.load();
    this.checkExpirations();
  }

  private load(): DBData {
    try {
      if (fs.existsSync(DB_FILE)) {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw);
        if (parsed && Array.isArray(parsed.users) && Array.isArray(parsed.donations)) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading DB file, fallback to seed data', e);
    }
    const seed = getInitialSeedData();
    this.saveData(seed);
    return seed;
  }

  private saveData(data: DBData) {
    try {
      ensureDataDir();
      fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    } catch (e) {
      console.error('Failed to write db.json:', e);
    }
  }

  public save() {
    this.saveData(this.data);
  }

  public resetSeed() {
    this.data = getInitialSeedData();
    this.save();
    return this.data;
  }

  // Automatic food expiry checker
  public checkExpirations() {
    const now = new Date().getTime();
    let changed = false;
    this.data.donations.forEach(d => {
      if (d.status === 'Available' || d.status === 'Requested') {
        const exp = new Date(d.expiryTime).getTime();
        if (exp <= now) {
          d.status = 'Expired';
          d.updatedAt = new Date().toISOString();
          changed = true;
        }
      }
    });
    if (changed) {
      this.save();
    }
  }

  // User queries
  public getUsers() {
    return this.data.users;
  }

  public getUserById(id: string) {
    return this.data.users.find(u => u.id === id);
  }

  public getUserByEmail(email: string) {
    return this.data.users.find(u => u.email.toLowerCase() === email.toLowerCase());
  }

  public addUser(user: User) {
    this.data.users.push(user);
    this.save();
    return user;
  }

  public updateUser(id: string, updates: Partial<User>) {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return null;
    this.data.users[index] = { ...this.data.users[index], ...updates };
    this.save();
    return this.data.users[index];
  }

  public deleteUser(id: string) {
    const index = this.data.users.findIndex(u => u.id === id);
    if (index === -1) return false;
    this.data.users.splice(index, 1);
    this.save();
    return true;
  }

  // Donation queries
  public getDonations(filter?: {
    status?: string;
    category?: string;
    donorId?: string;
    acceptedByNgoId?: string;
    assignedVolunteerId?: string;
    city?: string;
    search?: string;
  }) {
    this.checkExpirations();
    let list = [...this.data.donations];
    
    if (filter) {
      if (filter.status && filter.status !== 'All') {
        list = list.filter(d => d.status.toLowerCase() === filter.status!.toLowerCase());
      }
      if (filter.category && filter.category !== 'All') {
        list = list.filter(d => d.category.toLowerCase() === filter.category!.toLowerCase());
      }
      if (filter.donorId) {
        list = list.filter(d => d.donorId === filter.donorId);
      }
      if (filter.acceptedByNgoId) {
        list = list.filter(d => d.acceptedByNgoId === filter.acceptedByNgoId);
      }
      if (filter.assignedVolunteerId) {
        list = list.filter(d => d.assignedVolunteerId === filter.assignedVolunteerId);
      }
      if (filter.city && filter.city !== 'All') {
        list = list.filter(d => d.donorCity.toLowerCase().includes(filter.city!.toLowerCase()));
      }
      if (filter.search) {
        const q = filter.search.toLowerCase();
        list = list.filter(d => 
          d.foodName.toLowerCase().includes(q) ||
          d.donorName.toLowerCase().includes(q) ||
          d.category.toLowerCase().includes(q) ||
          d.pickupLocation.toLowerCase().includes(q)
        );
      }
    }

    // Sort newest first
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public getDonationById(id: string) {
    this.checkExpirations();
    return this.data.donations.find(d => d.id === id);
  }

  public addDonation(donation: Donation) {
    this.data.donations.push(donation);
    this.save();
    return donation;
  }

  public updateDonation(id: string, updates: Partial<Donation>) {
    const index = this.data.donations.findIndex(d => d.id === id);
    if (index === -1) return null;
    this.data.donations[index] = { 
      ...this.data.donations[index], 
      ...updates, 
      updatedAt: new Date().toISOString() 
    };
    this.save();
    return this.data.donations[index];
  }

  public deleteDonation(id: string) {
    const index = this.data.donations.findIndex(d => d.id === id);
    if (index === -1) return false;
    this.data.donations.splice(index, 1);
    this.save();
    return true;
  }

  // Deliveries
  public getDeliveries(filter?: { volunteerId?: string; donationId?: string; status?: string }) {
    let list = [...this.data.deliveries];
    if (filter) {
      if (filter.volunteerId) list = list.filter(d => d.volunteerId === filter.volunteerId);
      if (filter.donationId) list = list.filter(d => d.donationId === filter.donationId);
      if (filter.status) list = list.filter(d => d.status === filter.status);
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addDelivery(delivery: Delivery) {
    this.data.deliveries.push(delivery);
    this.save();
    return delivery;
  }

  public updateDelivery(id: string, updates: Partial<Delivery>) {
    const index = this.data.deliveries.findIndex(d => d.id === id);
    if (index === -1) return null;
    this.data.deliveries[index] = { ...this.data.deliveries[index], ...updates, updatedAt: new Date().toISOString() };
    this.save();
    return this.data.deliveries[index];
  }

  // Notifications
  public getNotifications(userId?: string) {
    let list = [...this.data.notifications];
    if (userId) {
      list = list.filter(n => n.userId === userId || n.userId === 'all');
    }
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addNotification(notification: Notification) {
    this.data.notifications.push(notification);
    this.save();
    return notification;
  }

  public markNotificationRead(id: string) {
    const notif = this.data.notifications.find(n => n.id === id);
    if (notif) {
      notif.read = true;
      this.save();
      return true;
    }
    return false;
  }

  public markAllNotificationsRead(userId: string) {
    this.data.notifications.forEach(n => {
      if (n.userId === userId || n.userId === 'all') {
        n.read = true;
      }
    });
    this.save();
  }

  // Feedback
  public getFeedback(donationId?: string) {
    let list = [...this.data.feedback];
    if (donationId) list = list.filter(f => f.donationId === donationId);
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  public addFeedback(fb: Feedback) {
    this.data.feedback.push(fb);
    this.save();
    return fb;
  }

  // Contact messages
  public addContact(msg: ContactMessage) {
    this.data.contacts.push(msg);
    this.save();
    return msg;
  }

  public getContacts() {
    return this.data.contacts;
  }

  // Dashboard Aggregates & Statistics (Computed dynamically from real database records)
  public getStatistics() {
    this.checkExpirations();
    const donors = this.data.users.filter(u => u.role === 'donor');
    const ngos = this.data.users.filter(u => u.role === 'ngo');
    const volunteers = this.data.users.filter(u => u.role === 'volunteer');
    const donations = this.data.donations;
    
    const totalServings = donations.reduce((sum, d) => sum + (d.servings || 0), 0);
    const completedDonations = donations.filter(d => d.status === 'Completed');
    const activeDonations = donations.filter(d => ['Available', 'Requested', 'Accepted', 'Volunteer Assigned', 'Picked Up'].includes(d.status));
    const rescuedMeals = completedDonations.reduce((sum, d) => sum + (d.servings || 0), 0);
    
    // Category distribution
    const categoryCount: Record<string, number> = {};
    donations.forEach(d => {
      categoryCount[d.category] = (categoryCount[d.category] || 0) + 1;
    });

    // Status breakdown
    const statusCount: Record<string, number> = {};
    donations.forEach(d => {
      statusCount[d.status] = (statusCount[d.status] || 0) + 1;
    });

    // Estimated CO2 emissions saved (~2.5 kg CO2 per kg food saved, ~0.4kg per serving)
    const co2SavedKg = Math.round(rescuedMeals * 0.4 * 2.5);

    return {
      totalDonors: donors.length,
      totalNgos: ngos.length,
      totalVolunteers: volunteers.length,
      totalDonations: donations.length,
      activeDonations: activeDonations.length,
      completedDonations: completedDonations.length,
      totalServings,
      rescuedMeals,
      co2SavedKg,
      beneficiariesHelped: Math.round(rescuedMeals * 1.2),
      categoryDistribution: Object.entries(categoryCount).map(([name, count]) => ({ name, count })),
      statusBreakdown: Object.entries(statusCount).map(([name, count]) => ({ name, count }))
    };
  }
}

export const db = new Database();
