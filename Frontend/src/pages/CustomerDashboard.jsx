import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { bookingApi } from '../services/api';
import {
  Calendar,
  Clock,
  MapPin,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  XCircle,
  Plus,
} from 'lucide-react';
import StatusBadge from '../components/Common/StatusBadge';
import Button from '../components/Common/Buttons';
import Loader from '../components/Common/Loader';

export const CustomerDashboard = () => {
  const { user } = useAuth();
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [actionError, setActionError] = useState('');
  const [actionSuccess, setActionSuccess] = useState('');
  const [cancellingId, setCancellingId] = useState(null);

  const fetchBookings = async () => {
    try {
      const res = await bookingApi.getMyBookings();
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      console.error('Failed to load bookings:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    if (location.state?.bookingSuccess) {
      setActionSuccess('Your appointment was booked successfully! Our technician will arrive on time.');
    }
  }, [location.state]);

  const handleCancel = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking?')) return;
    setCancellingId(bookingId);
    setActionError('');
    setActionSuccess('');

    try {
      const res = await bookingApi.cancel(bookingId, 'Customer requested cancellation from dashboard');
      if (res.success) {
        setActionSuccess('Booking cancelled successfully.');
        fetchBookings();
      }
    } catch (err) {
      setActionError(err.message || 'Failed to cancel booking.');
    } finally {
      setCancellingId(null);
    }
  };

  const filteredBookings =
    filterStatus === 'ALL'
      ? bookings
      : bookings.filter((b) => b.status === filterStatus);

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile / Welcome Header */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 mb-8 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[11px] font-bold uppercase tracking-wider mb-2">
              Customer Portal
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900">
              Welcome, {user?.name}!
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 mt-1">
              Manage your active home service bookings and past appointment history.
            </p>
          </div>

          <Link to="/services">
            <Button variant="primary" size="md" className="gap-1.5 self-start">
              <Plus size={16} /> Book New Service
            </Button>
          </Link>
        </div>

        {/* Action notifications */}
        {actionSuccess && (
          <div className="mb-6 p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
              <span>{actionSuccess}</span>
            </div>
            <button
              onClick={() => setActionSuccess('')}
              className="text-emerald-600 hover:text-emerald-800 text-sm font-bold"
            >
              ×
            </button>
          </div>
        )}

        {actionError && (
          <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-rose-600 shrink-0" />
              <span>{actionError}</span>
            </div>
            <button
              onClick={() => setActionError('')}
              className="text-rose-600 hover:text-rose-800 text-sm font-bold"
            >
              ×
            </button>
          </div>
        )}

        {/* Status Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          {['ALL', 'PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED'].map((status) => (
            <button
              key={status}
              onClick={() => setFilterStatus(status)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                filterStatus === status
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
              }`}
            >
              {status === 'ALL' ? 'All Bookings' : status.replace('_', ' ')}
            </button>
          ))}
        </div>

        {/* Bookings List */}
        {loading ? (
          <Loader text="Fetching your bookings..." />
        ) : filteredBookings.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center max-w-lg mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-4">
              <Calendar size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-900">No bookings found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {filterStatus === 'ALL'
                ? "You haven't scheduled any home services yet. Book verified experts with fixed upfront rates!"
                : `You don't have any bookings with status "${filterStatus}".`}
            </p>
            <div className="mt-5">
              <Link to="/services">
                <Button variant="primary" size="sm">
                  Explore Top Services
                </Button>
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredBookings.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center font-bold">
                      <Sparkles size={18} />
                    </div>
                    <div>
                      <h3 className="text-base font-bold text-slate-900">
                        {b.serviceName || b.service?.name}
                      </h3>
                      <p className="text-[11px] text-slate-400">
                        Booking ID: #{b._id.slice(-8).toUpperCase()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <StatusBadge status={b.status} />
                    <span className="text-lg font-black text-slate-900">
                      ₹{b.priceSnapshot}
                    </span>
                  </div>
                </div>

                {/* Details Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 text-xs text-slate-600">
                  <div className="flex items-start gap-2">
                    <Calendar size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Date & Time</span>
                      <span>
                        {new Date(b.scheduledDate).toLocaleDateString('en-IN', {
                          weekday: 'short',
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <p className="text-slate-500 font-medium">{b.timeSlot}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-2">
                    <MapPin size={16} className="text-slate-400 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-semibold text-slate-800 block">Service Address</span>
                      <p className="truncate max-w-[200px]">
                        {b.address.street}, {b.address.city} - {b.address.pincode}
                      </p>
                      {b.address.landmark && (
                        <p className="text-[11px] text-slate-400">Landmark: {b.address.landmark}</p>
                      )}
                    </div>
                  </div>

                  <div className="flex sm:justify-end items-center">
                    {['PENDING', 'CONFIRMED'].includes(b.status) ? (
                      <Button
                        variant="danger"
                        size="sm"
                        loading={cancellingId === b._id}
                        onClick={() => handleCancel(b._id)}
                      >
                        Cancel Booking
                      </Button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">
                        {b.status === 'COMPLETED'
                          ? 'Service fulfilled successfully'
                          : 'Cancelled'}
                      </span>
                    )}
                  </div>
                </div>

                {b.notes && (
                  <div className="mt-3 pt-3 border-t border-slate-50 text-[11px] text-slate-500">
                    <strong>Special Instructions:</strong> {b.notes}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDashboard;
