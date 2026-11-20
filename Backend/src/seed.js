import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User.js';
import { Service } from './models/Service.js';

dotenv.config();

const sampleServices = [
  {
    name: 'Deep Home Cleaning',
    description: 'Comprehensive top-to-bottom cleaning for apartments & villas. Includes dusting, floor scrubbing, kitchen degreasing, and balcony wash.',
    category: 'Cleaning',
    price: 1499,
    duration: '3 - 4 hours',
    icon: 'Sparkles',
    features: ['Professional eco-friendly chemicals', 'Single-disc floor scrubbing', 'All rooms, kitchen & balconies covered'],
    isActive: true,
  },
  {
    name: 'AC Servicing & Power Jet Wash',
    description: 'Deep foam jet cleaning of indoor and outdoor cooling coils, filter wash, drain pipe clearance, and gas pressure check.',
    category: 'Appliances',
    price: 699,
    duration: '45 mins',
    icon: 'Wind',
    features: ['2x faster cooling', 'Jet spray cleaning', '30-day post-service warranty'],
    isActive: true,
  },
  {
    name: 'Bathroom Deep Sanitization',
    description: 'Removal of tough water stains, tiles and grout cleaning, sanitization of WC, basin, and mirror polishing.',
    category: 'Cleaning',
    price: 599,
    duration: '60 mins',
    icon: 'Droplets',
    features: ['Hard water stain removal', 'Anti-bacterial treatment', 'Mirror and faucet shine'],
    isActive: true,
  },
  {
    name: 'Plumbing Repair & Leakage Fix',
    description: 'Expert repair for leaking taps, flush tanks, clogged drains, pipe joints, and mixer valve installations.',
    category: 'Plumbing',
    price: 399,
    duration: '45 mins',
    icon: 'Wrench',
    features: ['Verified licensed plumbers', 'Genuine spare parts assistance', 'No mess guarantee'],
    isActive: true,
  },
  {
    name: 'Electrical Installation & Repairs',
    description: 'Diagnosis and fixing of short circuits, switchboard replacement, ceiling fan fitting, and MCB installation.',
    category: 'Electrical',
    price: 349,
    duration: '30 - 45 mins',
    icon: 'Zap',
    features: ['Standard safety gear & insulation', 'Certified electricians', 'Fast 45-min arrival'],
    isActive: true,
  },
  {
    name: 'Full Home Pest & Termite Control',
    description: 'Odourless spray treatment for cockroaches, ants, bedbugs, and preventative anti-termite application.',
    category: 'Pest Control',
    price: 1299,
    duration: '90 mins',
    icon: 'ShieldCheck',
    features: ['100% pet & child safe', 'Govt approved chemicals', '90-day protection warranty'],
    isActive: true,
  },
];

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/nivaseva';
    console.log(`Connecting to MongoDB at: ${mongoUri}...`);
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 5000 });
    console.log('✅ Connected to MongoDB.');

    // 1. Seed or Verify First Admin (Option 1 Implementation)
    const adminEmail = (process.env.ADMIN_EMAIL || 'admin@nivaseva.com').toLowerCase().trim();
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';
    const adminName = process.env.ADMIN_NAME || 'Rahul Kumar (Admin)';
    const adminPhone = process.env.ADMIN_PHONE || '9876543210';

    const existingAdmin = await User.findOne({ email: adminEmail });
    if (!existingAdmin) {
      const admin = await User.create({
        name: adminName,
        email: adminEmail,
        password: adminPassword,
        phone: adminPhone,
        role: 'ADMIN',
        accountStatus: 'ACTIVE',
      });
      console.log(`🎉 [Option 1 Seed] Initial Admin created successfully:`);
      console.log(`   - Name: ${admin.name}`);
      console.log(`   - Email: ${admin.email}`);
      console.log(`   - Role: ${admin.role}`);
      console.log(`   - Password: (as set in .env: ${adminPassword})`);
    } else {
      console.log(`ℹ️ [Option 1 Seed] Admin already exists (${adminEmail}). Skipping duplicate creation.`);
    }

    // 2. Seed Services if empty
    const serviceCount = await Service.countDocuments();
    if (serviceCount === 0) {
      await Service.insertMany(sampleServices);
      console.log(`✨ Seeded ${sampleServices.length} default home services into database.`);
    } else {
      console.log(`ℹ️ Services already exist in database (${serviceCount} services found).`);
    }

    console.log('✅ Database seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error during seeding:', error.message);
    console.warn(`💡 Tip: If you don't have local MongoDB installed, create a free database at mongodb.com/atlas and update MONGODB_URI in Backend/.env!`);
    process.exit(1);
  }
};

seedData();
