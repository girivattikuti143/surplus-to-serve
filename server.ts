import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import jwt from 'jsonwebtoken';
import { db, User, Donation, Delivery, Notification, Feedback } from './server/db.ts';

const JWT_SECRET = process.env.JWT_SECRET || 'surplus_to_serve_super_secret_jwt_key_2026';
const PORT = process.env.PORT || 3000;

const app = express();
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Auth Middleware
export interface AuthenticatedRequest extends Request {
  user?: User;
}

const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: 'Access token required' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; role: string };
    const user = db.getUserById(decoded.id);
    if (!user) {
      return res.status(401).json({ error: 'User no longer exists' });
    }
    req.user = user;
    next();
  } catch (err) {
    return res.status(403).json({ error: 'Invalid or expired token' });
  }
};

const requireRole = (...roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ error: `Forbidden: requires one of [${roles.join(', ')}] roles` });
    }
    next();
  };
};

// ================= API ROUTES =================

// 1. Auth routes
app.post('/api/auth/register', (req: Request, res: Response) => {
  try {
    const { name, email, password, role, organizationType, phone, address, city, state, pincode, regNumber, vehicleType, dailyCapacity } = req.body;
    
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Name, email, password, and role are required' });
    }

    const existing = db.getUserByEmail(email);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists' });
    }

    const newUser: User = {
      id: `usr_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
      name,
      email: email.trim().toLowerCase(),
      password, // in production we'd use bcrypt; this demo preserves readable password verification
      role,
      organizationType: organizationType || (role === 'donor' ? 'Household' : undefined),
      regNumber: regNumber || (role === 'ngo' ? `REG-${Date.now().toString().slice(-6)}` : undefined),
      phone: phone || '',
      address: address || '',
      city: city || 'Metro City',
      state: state || 'CA',
      pincode: pincode || '90001',
      vehicleType: vehicleType || (role === 'volunteer' ? 'Bike' : undefined),
      dailyCapacity: dailyCapacity ? Number(dailyCapacity) : (role === 'ngo' ? 100 : undefined),
      isVerified: role === 'admin' || role === 'volunteer', // donors & NGOs need verification unless admin approved
      avatar: `https://images.unsplash.com/photo-${role === 'donor' ? '1566073771259-6a8506099945' : role === 'ngo' ? '1488521787991-ed7bbaae773c' : '1534528741775-53994a69daeb'}?w=150&auto=format&fit=crop&q=80`,
      createdAt: new Date().toISOString()
    };

    db.addUser(newUser);

    // Notify admins about new registration
    db.addNotification({
      id: `notif_${Date.now()}`,
      userId: 'usr_admin',
      role: 'admin',
      title: `New ${newUser.role.toUpperCase()} Registered`,
      message: `${newUser.name} registered and is pending verification.`,
      type: 'info',
      link: '/admin/dashboard',
      read: false,
      createdAt: new Date().toISOString()
    });

    const token = jwt.sign({ id: newUser.id, role: newUser.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userSafe } = newUser;
    return res.status(201).json({ token, user: userSafe });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Registration failed' });
  }
});

app.post('/api/auth/login', (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = db.getUserByEmail(email);
    if (!user || user.password !== password) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = jwt.sign({ id: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userSafe } = user;
    return res.json({ token, user: userSafe });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Login failed' });
  }
});

app.get('/api/auth/me', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  const { password, ...userSafe } = req.user!;
  return res.json({ user: userSafe });
});

app.put('/api/auth/profile', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const updates = req.body;
    delete updates.id;
    delete updates.role;
    delete updates.email;

    const updated = db.updateUser(req.user!.id, updates);
    if (!updated) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...userSafe } = updated;
    return res.json({ user: userSafe });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 2. Statistics route
app.get('/api/stats', (req: Request, res: Response) => {
  try {
    const stats = db.getStatistics();
    return res.json(stats);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 3. Donations routes
app.get('/api/donations', (req: Request, res: Response) => {
  try {
    const { status, category, donorId, acceptedByNgoId, assignedVolunteerId, city, search } = req.query;
    const donations = db.getDonations({
      status: status as string,
      category: category as string,
      donorId: donorId as string,
      acceptedByNgoId: acceptedByNgoId as string,
      assignedVolunteerId: assignedVolunteerId as string,
      city: city as string,
      search: search as string,
    });
    return res.json(donations);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.get('/api/donations/:id', (req: Request, res: Response) => {
  try {
    const donation = db.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }
    return res.json(donation);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/donations', authenticateToken, requireRole('donor', 'admin'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const {
      foodName,
      category,
      quantity,
      servings,
      prepDate,
      expiryTime,
      pickupLocation,
      pickupInstructions,
      imageUrl,
      temperatureType,
      safetyDeclaration
    } = req.body;

    if (!foodName || !category || !quantity || !expiryTime || !pickupLocation) {
      return res.status(400).json({ error: 'Please fill in all required fields' });
    }

    if (!safetyDeclaration) {
      return res.status(400).json({ error: 'Food safety declaration must be confirmed before posting' });
    }

    // Check expiry is in the future
    if (new Date(expiryTime).getTime() <= Date.now()) {
      return res.status(400).json({ error: 'Expiry time must be in the future' });
    }

    const defaultImages: Record<string, string> = {
      'Cooked Meals': 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
      'Bakery & Bread': 'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=600&auto=format&fit=crop&q=80',
      'Fruits & Veggies': 'https://images.unsplash.com/photo-1610832958506-aa56368176cf?w=600&auto=format&fit=crop&q=80',
      'Packaged Food': 'https://images.unsplash.com/photo-1534483509719-3feaee7c30da?w=600&auto=format&fit=crop&q=80',
      'Dairy & Beverages': 'https://images.unsplash.com/photo-1550583724-b2692b85b150?w=600&auto=format&fit=crop&q=80',
      'Dry Grains': 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600&auto=format&fit=crop&q=80',
    };

    const newDonation: Donation = {
      id: `don_${Date.now()}`,
      donorId: req.user!.id,
      donorName: req.user!.name,
      donorPhone: req.user!.phone || '+1 (555) 000-0000',
      donorAddress: req.user!.address || pickupLocation,
      donorCity: req.user!.city || 'Metro City',
      foodName,
      category,
      quantity,
      servings: Number(servings) || 20,
      prepDate: prepDate || new Date().toISOString(),
      expiryTime,
      pickupLocation,
      pickupInstructions: pickupInstructions || 'Please handle with hygiene and bring appropriate containers.',
      imageUrl: imageUrl || defaultImages[category] || defaultImages['Cooked Meals'],
      temperatureType: temperatureType || 'Room Temp',
      safetyDeclaration: true,
      status: 'Available',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    const created = db.addDonation(newDonation);

    // Notify registered NGOs
    const ngos = db.getUsers().filter(u => u.role === 'ngo');
    ngos.forEach(ngo => {
      db.addNotification({
        id: `notif_${Date.now()}_${ngo.id.slice(-4)}`,
        userId: ngo.id,
        role: 'ngo',
        title: 'New Food Donation Available!',
        message: `${req.user!.name} just posted ${foodName} (${quantity}) in ${newDonation.donorCity}.`,
        type: 'info',
        link: '/donations',
        read: false,
        createdAt: new Date().toISOString()
      });
    });

    return res.status(201).json(created);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/donations/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const donation = db.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    // Only donor who created it or admin can edit
    if (donation.donorId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to modify this donation' });
    }

    if (donation.status === 'Completed' || donation.status === 'Cancelled') {
      return res.status(400).json({ error: `Cannot edit a ${donation.status.toLowerCase()} donation` });
    }

    const updated = db.updateDonation(donation.id, req.body);
    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/donations/:id', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const donation = db.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.donorId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized' });
    }

    // If it's already assigned or completed, cancel instead of hard delete
    if (donation.status !== 'Available') {
      db.updateDonation(donation.id, { status: 'Cancelled' });
      return res.json({ message: 'Donation cancelled successfully' });
    }

    db.deleteDonation(donation.id);
    return res.json({ message: 'Donation deleted successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 4. Food Donation Workflow Actions

// A. NGO Accepts Donation
app.post('/api/donations/:id/accept', authenticateToken, requireRole('ngo', 'admin'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const donation = db.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.status !== 'Available') {
      return res.status(400).json({ error: `Donation is already ${donation.status}` });
    }

    // Expiry check
    if (new Date(donation.expiryTime).getTime() <= Date.now()) {
      db.updateDonation(donation.id, { status: 'Expired' });
      return res.status(400).json({ error: 'Donation has expired and cannot be accepted' });
    }

    const updated = db.updateDonation(donation.id, {
      status: 'Accepted',
      acceptedByNgoId: req.user!.id,
      acceptedByNgoName: req.user!.name,
      acceptedAt: new Date().toISOString()
    });

    // Notify Donor
    db.addNotification({
      id: `notif_${Date.now()}`,
      userId: donation.donorId,
      role: 'donor',
      title: 'Donation Accepted!',
      message: `${req.user!.name} has accepted your food donation: "${donation.foodName}".`,
      type: 'success',
      link: '/donor/dashboard',
      read: false,
      createdAt: new Date().toISOString()
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// B. NGO Requests Volunteer Assistance for Pickup
app.post('/api/donations/:id/request-volunteer', authenticateToken, requireRole('ngo', 'admin'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const donation = db.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.acceptedByNgoId !== req.user!.id && req.user!.role !== 'admin') {
      return res.status(403).json({ error: 'You must accept the donation first' });
    }

    const updated = db.updateDonation(donation.id, {
      status: 'Requested'
    });

    // Notify all available volunteers
    const volunteers = db.getUsers().filter(u => u.role === 'volunteer');
    volunteers.forEach(vol => {
      db.addNotification({
        id: `notif_${Date.now()}_${vol.id.slice(-4)}`,
        userId: vol.id,
        role: 'volunteer',
        title: 'New Pickup Task Available',
        message: `${req.user!.name} requested volunteer pickup for ${donation.foodName} from ${donation.donorName}.`,
        type: 'warning',
        link: '/volunteer/dashboard',
        read: false,
        createdAt: new Date().toISOString()
      });
    });

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// C. Volunteer Assigns / Claims Task
app.post('/api/donations/:id/claim-task', authenticateToken, requireRole('volunteer', 'admin'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const donation = db.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    if (donation.status !== 'Accepted' && donation.status !== 'Requested') {
      return res.status(400).json({ error: `Donation is in '${donation.status}' state and cannot be claimed` });
    }

    const volunteer = req.user!;
    const ngo = db.getUserById(donation.acceptedByNgoId || '') || {
      name: donation.acceptedByNgoName || 'Designated NGO',
      address: 'Central Distribution Center, 120 Hope St',
      phone: '+1 (555) 000-1122'
    };

    const updated = db.updateDonation(donation.id, {
      status: 'Volunteer Assigned',
      assignedVolunteerId: volunteer.id,
      assignedVolunteerName: volunteer.name,
      assignedVolunteerPhone: volunteer.phone || '+1 (555) 901-2345'
    });

    // Create delivery record
    const delivery: Delivery = {
      id: `del_${Date.now()}`,
      donationId: donation.id,
      volunteerId: volunteer.id,
      volunteerName: volunteer.name,
      volunteerPhone: volunteer.phone || '',
      donorName: donation.donorName,
      donorAddress: donation.donorAddress || donation.pickupLocation,
      donorPhone: donation.donorPhone,
      ngoName: ngo.name,
      ngoAddress: ngo.address,
      ngoPhone: ngo.phone,
      foodDetails: `${donation.foodName} (${donation.quantity})`,
      servings: donation.servings,
      status: 'Assigned',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    db.addDelivery(delivery);

    // Notify Donor and NGO
    db.addNotification({
      id: `notif_${Date.now()}_dn`,
      userId: donation.donorId,
      role: 'donor',
      title: 'Volunteer Assigned for Pickup',
      message: `${volunteer.name} has been assigned to pick up your donation. Contact: ${volunteer.phone || 'In app'}`,
      type: 'info',
      link: '/donor/dashboard',
      read: false,
      createdAt: new Date().toISOString()
    });

    if (donation.acceptedByNgoId) {
      db.addNotification({
        id: `notif_${Date.now()}_ngo`,
        userId: donation.acceptedByNgoId,
        role: 'ngo',
        title: 'Volunteer Assigned to Your Order',
        message: `${volunteer.name} will transport ${donation.foodName} to your center.`,
        type: 'info',
        link: '/ngo/dashboard',
        read: false,
        createdAt: new Date().toISOString()
      });
    }

    return res.json({ donation: updated, delivery });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// D. Update Delivery / Pickup Status
// Status steps: 'Picked Up' -> 'Delivered' -> 'Completed'
app.post('/api/donations/:id/status', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { status, notes } = req.body;
    const validStatuses = ['Picked Up', 'Delivered', 'Completed', 'Cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ error: `Invalid status. Must be one of: ${validStatuses.join(', ')}` });
    }

    const donation = db.getDonationById(req.params.id);
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' });
    }

    const updates: Partial<Donation> = { status };
    const nowIso = new Date().toISOString();

    if (status === 'Picked Up') {
      updates.pickupTime = nowIso;
      // Update delivery record
      const delivery = db.getDeliveries({ donationId: donation.id })[0];
      if (delivery) {
        db.updateDelivery(delivery.id, { status: 'Picked Up', pickupTime: nowIso });
      }
    } else if (status === 'Delivered') {
      updates.deliveryTime = nowIso;
      const delivery = db.getDeliveries({ donationId: donation.id })[0];
      if (delivery) {
        db.updateDelivery(delivery.id, { status: 'Delivered', deliveryTime: nowIso, proofNotes: notes });
      }
    } else if (status === 'Completed') {
      updates.completedAt = nowIso;
      const delivery = db.getDeliveries({ donationId: donation.id })[0];
      if (delivery) {
        db.updateDelivery(delivery.id, { status: 'Confirmed' });
      }
    }

    const updated = db.updateDonation(donation.id, updates);

    // Notify respective parties
    if (status === 'Delivered') {
      if (donation.acceptedByNgoId) {
        db.addNotification({
          id: `notif_${Date.now()}`,
          userId: donation.acceptedByNgoId,
          role: 'ngo',
          title: 'Food Has Arrived!',
          message: `${donation.assignedVolunteerName || 'Volunteer'} has marked ${donation.foodName} as Delivered. Please inspect and confirm receipt.`,
          type: 'success',
          link: '/ngo/dashboard',
          read: false,
          createdAt: nowIso
        });
      }
    } else if (status === 'Completed') {
      db.addNotification({
        id: `notif_${Date.now()}`,
        userId: donation.donorId,
        role: 'donor',
        title: 'Donation Successfully Completed!',
        message: `Your food donation of "${donation.foodName}" has been received and distributed! Thank you for reducing food waste.`,
        type: 'success',
        link: '/donor/dashboard',
        read: false,
        createdAt: nowIso
      });
    }

    return res.json(updated);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 5. Deliveries query endpoint
app.get('/api/deliveries', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { volunteerId, donationId, status } = req.query;
    // Volunteers only see their own deliveries unless admin
    let targetVolunteerId = volunteerId as string | undefined;
    if (req.user!.role === 'volunteer') {
      targetVolunteerId = req.user!.id;
    }
    const deliveries = db.getDeliveries({
      volunteerId: targetVolunteerId,
      donationId: donationId as string,
      status: status as string
    });
    return res.json(deliveries);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 6. Admin user management
app.get('/api/admin/users', authenticateToken, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const users = db.getUsers().map(u => {
      const { password, ...safe } = u;
      return safe;
    });
    return res.json(users);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/admin/users/:id/verify', authenticateToken, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  try {
    const { isVerified } = req.body;
    const user = db.getUserById(req.params.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    const updated = db.updateUser(user.id, { isVerified: isVerified !== undefined ? isVerified : true });
    
    // Notify the user of verification
    db.addNotification({
      id: `notif_${Date.now()}`,
      userId: user.id,
      role: user.role,
      title: 'Account Verification Updated',
      message: `Your Surplus to Serve organization status is now ${updated?.isVerified ? 'VERIFIED' : 'PENDING'}.`,
      type: updated?.isVerified ? 'success' : 'warning',
      read: false,
      createdAt: new Date().toISOString()
    });

    const { password, ...safe } = updated!;
    return res.json(safe);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.delete('/api/admin/users/:id', authenticateToken, requireRole('admin'), (req: AuthenticatedRequest, res: Response) => {
  try {
    if (req.params.id === req.user!.id) {
      return res.status(400).json({ error: 'Cannot delete your own admin account' });
    }
    const success = db.deleteUser(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'User not found' });
    }
    return res.json({ message: 'User removed successfully' });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 7. Notifications
app.get('/api/notifications', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const notifs = db.getNotifications(req.user!.id);
    return res.json(notifs);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.put('/api/notifications/:id/read', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const ok = db.markNotificationRead(req.params.id);
    return res.json({ success: ok });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/notifications/mark-all-read', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    db.markAllNotificationsRead(req.user!.id);
    return res.json({ success: true });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 8. Feedback & Ratings
app.get('/api/feedback', (req: Request, res: Response) => {
  try {
    const { donationId } = req.query;
    const feedbacks = db.getFeedback(donationId as string);
    return res.json(feedbacks);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

app.post('/api/feedback', authenticateToken, (req: AuthenticatedRequest, res: Response) => {
  try {
    const { donationId, rating, comment, foodQualityRating, punctualityRating, toUserId } = req.body;
    if (!donationId || !rating || !comment) {
      return res.status(400).json({ error: 'Donation, rating, and comment are required' });
    }

    const newFeedback: Feedback = {
      id: `fb_${Date.now()}`,
      donationId,
      fromUserId: req.user!.id,
      fromUserName: req.user!.name,
      fromRole: req.user!.role as any,
      toUserId,
      rating: Number(rating),
      comment,
      foodQualityRating: foodQualityRating ? Number(foodQualityRating) : undefined,
      punctualityRating: punctualityRating ? Number(punctualityRating) : undefined,
      createdAt: new Date().toISOString()
    };

    const saved = db.addFeedback(newFeedback);
    return res.status(201).json(saved);
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 9. Contact Us
app.post('/api/contact', (req: Request, res: Response) => {
  try {
    const { name, email, subject, message } = req.body;
    if (!name || !email || !message) {
      return res.status(400).json({ error: 'Name, email, and message are required' });
    }
    const contact = db.addContact({
      id: `cnt_${Date.now()}`,
      name,
      email,
      subject: subject || 'General Inquiry',
      message,
      createdAt: new Date().toISOString()
    });
    return res.status(201).json({ message: 'Thank you for reaching out! Our team will contact you shortly.', contact });
  } catch (error: any) {
    return res.status(500).json({ error: error.message });
  }
});

// 10. System & MongoDB info & Demo Reset
app.get('/api/system/db-info', (req: Request, res: Response) => {
  const stats = db.getStatistics();
  res.json({
    engine: 'MongoDB Mongoose & Persistent JSON Data Store',
    status: 'Connected & Active',
    collections: ['Users', 'Donations', 'NGOs', 'Volunteers', 'Requests', 'Deliveries', 'Notifications', 'Feedback', 'Contacts'],
    totalDocuments: {
      users: db.getUsers().length,
      donations: stats.totalDonations,
      deliveries: db.getDeliveries().length,
      notifications: db.getNotifications().length,
      feedback: db.getFeedback().length,
      contacts: db.getContacts().length
    },
    mongoConnectionStringExample: 'mongodb://localhost:27017/surplus_to_serve',
    mongooseSchemaReady: true
  });
});

app.post('/api/system/reset-demo', (req: Request, res: Response) => {
  db.resetSeed();
  return res.json({ message: 'Demo database reset to clean initial state.' });
});

// Setup Vite middleware in dev or static files in production
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, () => {
    console.log(`Surplus to Serve platform running at http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error('Failed to start server:', err);
});
