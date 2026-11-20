import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { Booking } from '../models/Booking.js';
import { User } from '../models/User.js';
import { Service } from '../models/Service.js';
import { memoryStore } from '../config/memoryStore.js';

// @desc   Get all bookings for admin
// @route  GET /api/admin/bookings
// @access Private (Admin)
export const getAllBookings = async (req, res, next) => {
  try {
    const { status } = req.query;

    if (mongoose.connection.readyState === 1) {
      const filter = {};
      if (status && status !== 'ALL') filter.status = status;

      const bookings = await Booking.find(filter)
        .populate('customer', 'name email phone')
        .populate('service', 'name category price duration icon')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } else {
      let bookings = [...memoryStore.bookings];
      if (status && status !== 'ALL') {
        bookings = bookings.filter((b) => b.status === status);
      }
      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Update booking status
// @route  PATCH /api/admin/bookings/:id/status
// @access Private (Admin)
export const updateBookingStatus = async (req, res, next) => {
  try {
    const { status } = req.body;
    const validStatuses = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`,
      });
    }

    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
      }

      booking.status = status;
      await booking.save();

      const updated = await Booking.findById(booking._id)
        .populate('customer', 'name email phone')
        .populate('service', 'name category price');

      return res.status(200).json({
        success: true,
        message: `Booking status updated to ${status}.`,
        data: updated,
      });
    } else {
      const idx = memoryStore.bookings.findIndex((b) => b._id.toString() === req.params.id.toString());
      if (idx === -1) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
      }

      memoryStore.bookings[idx].status = status;

      return res.status(200).json({
        success: true,
        message: `Booking status updated to ${status}.`,
        data: memoryStore.bookings[idx],
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Get admin dashboard statistics
// @route  GET /api/admin/stats
// @access Private (Admin)
export const getAdminStats = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const [
        totalBookings,
        pendingBookings,
        confirmedBookings,
        completedBookings,
        totalServices,
        totalCustomers,
        totalAdmins,
      ] = await Promise.all([
        Booking.countDocuments(),
        Booking.countDocuments({ status: 'PENDING' }),
        Booking.countDocuments({ status: 'CONFIRMED' }),
        Booking.countDocuments({ status: 'COMPLETED' }),
        Service.countDocuments(),
        User.countDocuments({ role: 'CUSTOMER' }),
        User.countDocuments({ role: 'ADMIN' }),
      ]);

      const completedList = await Booking.find({ status: 'COMPLETED' }).select('priceSnapshot');
      const totalRevenue = completedList.reduce((acc, curr) => acc + (curr.priceSnapshot || 0), 0);

      return res.status(200).json({
        success: true,
        data: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          totalServices,
          totalCustomers,
          totalAdmins,
          totalRevenue,
        },
      });
    } else {
      const totalBookings = memoryStore.bookings.length;
      const pendingBookings = memoryStore.bookings.filter((b) => b.status === 'PENDING').length;
      const confirmedBookings = memoryStore.bookings.filter((b) => b.status === 'CONFIRMED').length;
      const completedBookings = memoryStore.bookings.filter((b) => b.status === 'COMPLETED').length;
      const totalServices = memoryStore.services.length;
      const totalCustomers = memoryStore.users.filter((u) => u.role === 'CUSTOMER').length;
      const totalAdmins = memoryStore.users.filter((u) => u.role === 'ADMIN').length;
      const totalRevenue = memoryStore.bookings
        .filter((b) => b.status === 'COMPLETED')
        .reduce((acc, curr) => acc + (curr.priceSnapshot || 0), 0);

      return res.status(200).json({
        success: true,
        data: {
          totalBookings,
          pendingBookings,
          confirmedBookings,
          completedBookings,
          totalServices,
          totalCustomers,
          totalAdmins,
          totalRevenue,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Create new Admin account (Option 1: Admin-only creation)
// @route  POST /api/admin/users
// @access Private (Admin)
export const createAdminUser = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, email, and initial password for the new admin.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();

    if (mongoose.connection.readyState === 1) {
      const existing = await User.findOne({ email: cleanEmail });
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      const newAdmin = await User.create({
        name: name.trim(),
        email: cleanEmail,
        password,
        phone: phone || '',
        role: 'ADMIN',
      });

      return res.status(201).json({
        success: true,
        message: `Admin account for ${newAdmin.name} created successfully!`,
        data: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      });
    } else {
      const existing = memoryStore.users.find((u) => u.email === cleanEmail);
      if (existing) {
        return res.status(400).json({
          success: false,
          message: 'An account with this email already exists.',
        });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);
      const newAdmin = {
        _id: 'usr_admin_' + Date.now(),
        name: name.trim(),
        email: cleanEmail,
        password: hashedPassword,
        phone: phone || '',
        role: 'ADMIN',
        accountStatus: 'ACTIVE',
        createdAt: new Date(),
      };
      memoryStore.users.push(newAdmin);

      return res.status(201).json({
        success: true,
        message: `Admin account for ${newAdmin.name} created successfully!`,
        data: {
          id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
        },
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Get list of all users
// @route  GET /api/admin/users
// @access Private (Admin)
export const getAllUsers = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const users = await User.find().select('-password').sort({ createdAt: -1 });
      return res.status(200).json({ success: true, count: users.length, data: users });
    } else {
      const users = memoryStore.users.map(({ password, ...u }) => u);
      return res.status(200).json({ success: true, count: users.length, data: users });
    }
  } catch (error) {
    next(error);
  }
};
