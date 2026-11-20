import bcrypt from 'bcryptjs';

// In-Memory Dev Store used as seamless fallback if MongoDB service is not running locally
export const memoryStore = {
  users: [
    {
      _id: 'usr_admin_001',
      name: 'Rahul Kumar (Admin)',
      email: 'admin@nivaseva.com',
      password: '', // will be hashed on init
      role: 'ADMIN',
      phone: '9876543210',
      accountStatus: 'ACTIVE',
      createdAt: new Date(),
    },
    {
      _id: 'usr_cust_001',
      name: 'Ankit Sharma',
      email: 'customer@nivaseva.com',
      password: '', // will be hashed on init
      role: 'CUSTOMER',
      phone: '9123456780',
      accountStatus: 'ACTIVE',
      createdAt: new Date(),
    },
  ],
  services: [
    {
      _id: 'srv_001',
      name: 'Deep Home Cleaning',
      description: 'Comprehensive top-to-bottom cleaning for apartments & villas. Includes dusting, floor scrubbing, kitchen degreasing, and balcony wash.',
      category: 'Cleaning',
      price: 1499,
      duration: '3 - 4 hours',
      icon: 'Sparkles',
      features: ['Professional eco-friendly chemicals', 'Single-disc floor scrubbing', 'All rooms, kitchen & balconies covered'],
      isActive: true,
      createdAt: new Date(),
    },
    {
      _id: 'srv_002',
      name: 'AC Servicing & Power Jet Wash',
      description: 'Deep foam jet cleaning of indoor and outdoor cooling coils, filter wash, drain pipe clearance, and gas pressure check.',
      category: 'Appliances',
      price: 699,
      duration: '45 mins',
      icon: 'Wind',
      features: ['2x faster cooling', 'Jet spray cleaning', '30-day post-service warranty'],
      isActive: true,
      createdAt: new Date(),
    },
    {
      _id: 'srv_003',
      name: 'Bathroom Deep Sanitization',
      description: 'Removal of tough water stains, tiles and grout cleaning, sanitization of WC, basin, and mirror polishing.',
      category: 'Cleaning',
      price: 599,
      duration: '60 mins',
      icon: 'Droplets',
      features: ['Hard water stain removal', 'Anti-bacterial treatment', 'Mirror and faucet shine'],
      isActive: true,
      createdAt: new Date(),
    },
    {
      _id: 'srv_004',
      name: 'Plumbing Repair & Leakage Fix',
      description: 'Expert repair for leaking taps, flush tanks, clogged drains, pipe joints, and mixer valve installations.',
      category: 'Plumbing',
      price: 399,
      duration: '45 mins',
      icon: 'Wrench',
      features: ['Verified licensed plumbers', 'Genuine spare parts assistance', 'No mess guarantee'],
      isActive: true,
      createdAt: new Date(),
    },
    {
      _id: 'srv_005',
      name: 'Electrical Installation & Repairs',
      description: 'Diagnosis and fixing of short circuits, switchboard replacement, ceiling fan fitting, and MCB installation.',
      category: 'Electrical',
      price: 349,
      duration: '30 - 45 mins',
      icon: 'Zap',
      features: ['Standard safety gear & insulation', 'Certified electricians', 'Fast 45-min arrival'],
      isActive: true,
      createdAt: new Date(),
    },
    {
      _id: 'srv_006',
      name: 'Full Home Pest & Termite Control',
      description: 'Odourless spray treatment for cockroaches, ants, bedbugs, and preventative anti-termite application.',
      category: 'Pest Control',
      price: 1299,
      duration: '90 mins',
      icon: 'ShieldCheck',
      features: ['100% pet & child safe', 'Govt approved chemicals', '90-day protection warranty'],
      isActive: true,
      createdAt: new Date(),
    },
  ],
  bookings: [
    {
      _id: 'bkg_001',
      customer: {
        _id: 'usr_cust_001',
        name: 'Ankit Sharma',
        email: 'customer@nivaseva.com',
        phone: '9123456780',
      },
      service: {
        _id: 'srv_001',
        name: 'Deep Home Cleaning',
        category: 'Cleaning',
        duration: '3 - 4 hours',
        icon: 'Sparkles',
      },
      serviceName: 'Deep Home Cleaning',
      priceSnapshot: 1499,
      scheduledDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
      timeSlot: '10:00 AM - 12:00 PM',
      address: {
        street: 'Flat 402, Green Meadows',
        city: 'Mumbai',
        pincode: '400001',
        landmark: 'Near City Mall',
      },
      notes: 'Please bring ladder for ceiling fan dusting.',
      status: 'CONFIRMED',
      createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
    },
  ],
};

// Initialize hashed passwords for default users
(async () => {
  const salt = await bcrypt.genSalt(10);
  memoryStore.users[0].password = await bcrypt.hash(process.env.ADMIN_PASSWORD || 'admin123', salt);
  memoryStore.users[1].password = await bcrypt.hash('customer123', salt);
})();
