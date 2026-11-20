import mongoose from 'mongoose';
import { Booking } from '../models/Booking.js';
import { Service } from '../models/Service.js';
import { memoryStore } from '../config/memoryStore.js';

// @desc   Create a new booking (Customer)
// @route  POST /api/bookings
// @access Private (Customer)
export const createBooking = async (req, res, next) => {
  try {
    const { serviceId, scheduledDate, timeSlot, street, city, pincode, landmark, notes } = req.body;

    if (!serviceId || !scheduledDate || !street || !city || !pincode) {
      return res.status(400).json({
        success: false,
        message: 'Please provide serviceId, scheduledDate, street, city, and pincode.',
      });
    }

    const bookingDate = new Date(scheduledDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (bookingDate < today) {
      return res.status(400).json({
        success: false,
        message: 'Booking date cannot be in the past.',
      });
    }

    if (mongoose.connection.readyState === 1) {
      const service = await Service.findById(serviceId);
      if (!service || !service.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Selected service is no longer available.',
        });
      }

      // Authoritative snapshot of price and service name from DB
      const booking = await Booking.create({
        customer: req.user._id,
        service: service._id,
        serviceName: service.name,
        priceSnapshot: service.price,
        scheduledDate: bookingDate,
        timeSlot: timeSlot || '10:00 AM - 12:00 PM',
        address: {
          street: street.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          landmark: landmark ? landmark.trim() : '',
        },
        notes: notes ? notes.trim() : '',
        status: 'PENDING',
      });

      const populatedBooking = await Booking.findById(booking._id)
        .populate('service', 'name category duration icon')
        .populate('customer', 'name email phone');

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully!',
        data: populatedBooking,
      });
    } else {
      // Memory store fallback
      const service = memoryStore.services.find((s) => s._id.toString() === serviceId.toString());
      if (!service || !service.isActive) {
        return res.status(404).json({
          success: false,
          message: 'Selected service is no longer available.',
        });
      }

      const newBooking = {
        _id: 'bkg_' + Date.now(),
        customer: {
          _id: req.user._id,
          name: req.user.name,
          email: req.user.email,
          phone: req.user.phone,
        },
        service: {
          _id: service._id,
          name: service.name,
          category: service.category,
          duration: service.duration,
          icon: service.icon,
        },
        serviceName: service.name,
        priceSnapshot: service.price,
        scheduledDate: bookingDate,
        timeSlot: timeSlot || '10:00 AM - 12:00 PM',
        address: {
          street: street.trim(),
          city: city.trim(),
          pincode: pincode.trim(),
          landmark: landmark ? landmark.trim() : '',
        },
        notes: notes ? notes.trim() : '',
        status: 'PENDING',
        createdAt: new Date(),
      };
      memoryStore.bookings.unshift(newBooking);

      return res.status(201).json({
        success: true,
        message: 'Booking created successfully!',
        data: newBooking,
      });
    }
  } catch (error) {
    next(error);
  }
};

// @desc   Get logged in customer's bookings
// @route  GET /api/bookings/my
// @access Private (Customer)
export const getMyBookings = async (req, res, next) => {
  try {
    if (mongoose.connection.readyState === 1) {
      const bookings = await Booking.find({ customer: req.user._id })
        .populate('service', 'name category duration icon')
        .sort({ createdAt: -1 });

      return res.status(200).json({
        success: true,
        count: bookings.length,
        data: bookings,
      });
    } else {
      const userId = req.user._id.toString();
      const bookings = memoryStore.bookings.filter(
        (b) => (b.customer._id ? b.customer._id.toString() : b.customer.toString()) === userId
      );
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

// @desc   Get single booking details
// @route  GET /api/bookings/:id
// @access Private (Customer owner or Admin)
export const getBookingById = async (req, res, next) => {
  try {
    let booking;
    if (mongoose.connection.readyState === 1) {
      booking = await Booking.findById(req.params.id)
        .populate('service')
        .populate('customer', 'name email phone');
    } else {
      booking = memoryStore.bookings.find((b) => b._id.toString() === req.params.id.toString());
    }

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found.',
      });
    }

    const customerId = booking.customer._id ? booking.customer._id.toString() : booking.customer.toString();
    if (customerId !== req.user._id.toString() && req.user.role !== 'ADMIN') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized. You cannot view this booking.',
      });
    }

    res.status(200).json({
      success: true,
      data: booking,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Cancel booking (Customer)
// @route  PATCH /api/bookings/:id/cancel
// @access Private (Customer owner)
export const cancelBooking = async (req, res, next) => {
  try {
    const { reason } = req.body;

    if (mongoose.connection.readyState === 1) {
      const booking = await Booking.findById(req.params.id);
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
      }

      if (booking.customer.toString() !== req.user._id.toString() && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
      }

      if (['COMPLETED', 'CANCELLED'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel a booking that is already ${booking.status.toLowerCase()}.`,
        });
      }

      booking.status = 'CANCELLED';
      booking.cancellationReason = reason || 'Cancelled by customer';
      await booking.save();

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully.',
        data: booking,
      });
    } else {
      const booking = memoryStore.bookings.find((b) => b._id.toString() === req.params.id.toString());
      if (!booking) {
        return res.status(404).json({ success: false, message: 'Booking not found.' });
      }

      const customerId = booking.customer._id ? booking.customer._id.toString() : booking.customer.toString();
      if (customerId !== req.user._id.toString() && req.user.role !== 'ADMIN') {
        return res.status(403).json({ success: false, message: 'Unauthorized to cancel this booking.' });
      }

      if (['COMPLETED', 'CANCELLED'].includes(booking.status)) {
        return res.status(400).json({
          success: false,
          message: `Cannot cancel a booking that is already ${booking.status.toLowerCase()}.`,
        });
      }

      booking.status = 'CANCELLED';
      booking.cancellationReason = reason || 'Cancelled by customer';

      return res.status(200).json({
        success: true,
        message: 'Booking cancelled successfully.',
        data: booking,
      });
    }
  } catch (error) {
    next(error);
  }
};
