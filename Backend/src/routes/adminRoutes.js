import express from 'express';
import {
  getAllBookings,
  updateBookingStatus,
  getAdminStats,
  createAdminUser,
  getAllUsers,
} from '../controllers/adminController.js';
import { verifyToken, requireAdmin } from '../middleware/auth.js';

const router = express.Router();

// Apply auth + requireAdmin middleware to all admin endpoints
router.use(verifyToken, requireAdmin);

router.get('/stats', getAdminStats);
router.get('/bookings', getAllBookings);
router.patch('/bookings/:id/status', updateBookingStatus);
router.post('/users', createAdminUser);
router.get('/users', getAllUsers);

export default router;
