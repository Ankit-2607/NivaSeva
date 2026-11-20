import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { serviceApi, bookingApi } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar,
  Clock,
  MapPin,
  FileText,
  ShieldCheck,
  CheckCircle,
  ArrowLeft,
  Sparkles,
} from 'lucide-react';
import Input from '../components/Common/Input';
import Button from '../components/Common/Buttons';
import Loader from '../components/Common/Loader';

const timeSlots = [
  '09:00 AM - 11:00 AM',
  '11:00 AM - 01:00 PM',
  '02:00 PM - 04:00 PM',
  '04:00 PM - 06:00 PM',
  '06:00 PM - 08:00 PM',
];

export const BookService = () => {
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  // Form State
  const tomorrow = new Date();
  tomorrow.setDate(tomorrow.getDate() + 1);
  const tomorrowStr = tomorrow.toISOString().split('T')[0];

  const [scheduledDate, setScheduledDate] = useState(tomorrowStr);
  const [timeSlot, setTimeSlot] = useState(timeSlots[0]);
  const [address, setAddress] = useState({
    street: '',
    city: 'Mumbai',
    pincode: '',
    landmark: '',
  });
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const fetchService = async () => {
      try {
        const res = await serviceApi.getById(serviceId);
        if (res.success && res.data) {
          setService(res.data);
        } else {
          setError('Service not found.');
        }
      } catch (err) {
        setError(err.message || 'Failed to fetch service.');
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [serviceId]);

  const handleAddressChange = (e) => {
    setAddress({ ...address, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: `/book/${serviceId}` } } });
      return;
    }

    if (!scheduledDate || !address.street || !address.city || !address.pincode) {
      return setError('Please fill in scheduled date and all required address fields.');
    }

    setSubmitting(true);

    try {
      const res = await bookingApi.create({
        serviceId,
        scheduledDate,
        timeSlot,
        street: address.street,
        city: address.city,
        pincode: address.pincode,
        landmark: address.landmark,
        notes,
      });

      if (res.success) {
        navigate('/dashboard', { state: { bookingSuccess: true } });
      }
    } catch (err) {
      setError(err.message || 'Failed to submit booking.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <Loader text="Loading booking details..." />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center p-6">
        <h2 className="text-xl font-bold text-slate-800">Service Not Found</h2>
        <p className="text-xs text-slate-500 mt-2">
          The service you are looking for might have been retired or updated.
        </p>
        <Link to="/services" className="mt-4">
          <Button variant="outline" size="sm">
            Back to Catalog
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <div className="mb-6">
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-emerald-600 transition-colors"
          >
            <ArrowLeft size={16} /> Back to Services
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Booking Form */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xs">
              <h1 className="text-2xl font-black text-slate-900 tracking-tight">
                Schedule Your Appointment
              </h1>
              <p className="text-xs text-slate-500 mt-1">
                Enter your preferred date, time slot, and doorstep address.
              </p>

              {error && (
                <div className="mt-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium">
                  {error}
                </div>
              )}

              <form onSubmit={handleSubmit} className="mt-6 space-y-6">
                {/* 1. Date & Time Selection */}
                <div>
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <Calendar size={14} className="text-emerald-600" />
                    1. Select Date & Slot
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="Service Date"
                      id="scheduledDate"
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={scheduledDate}
                      onChange={(e) => setScheduledDate(e.target.value)}
                    />

                    <div>
                      <label className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1.5">
                        Time Slot <span className="text-rose-500">*</span>
                      </label>
                      <select
                        value={timeSlot}
                        onChange={(e) => setTimeSlot(e.target.value)}
                        className="block w-full rounded-lg border border-slate-300 py-2.5 px-3.5 bg-white text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                      >
                        {timeSlots.map((slot) => (
                          <option key={slot} value={slot}>
                            {slot}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* 2. Service Address */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <MapPin size={14} className="text-emerald-600" />
                    2. Service Location
                  </h3>
                  <div className="space-y-4">
                    <Input
                      label="Street Address / Flat No."
                      id="street"
                      type="text"
                      required
                      placeholder="e.g. Flat 302, Palm Heights, Main Road"
                      value={address.street}
                      onChange={handleAddressChange}
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <Input
                        label="City"
                        id="city"
                        type="text"
                        required
                        placeholder="e.g. Mumbai"
                        value={address.city}
                        onChange={handleAddressChange}
                      />

                      <Input
                        label="Pincode"
                        id="pincode"
                        type="text"
                        required
                        placeholder="e.g. 400001"
                        value={address.pincode}
                        onChange={handleAddressChange}
                      />

                      <Input
                        label="Landmark (Optional)"
                        id="landmark"
                        type="text"
                        placeholder="e.g. Near Metro Stn"
                        value={address.landmark}
                        onChange={handleAddressChange}
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Additional Instructions */}
                <div className="pt-4 border-t border-slate-100">
                  <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
                    <FileText size={14} className="text-emerald-600" />
                    3. Special Instructions (Optional)
                  </h3>
                  <textarea
                    rows={3}
                    placeholder="Any specific instructions for the technician (e.g., parking code, bring high ladder)..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="block w-full rounded-lg border border-slate-300 py-2.5 px-3.5 bg-white text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
                  />
                </div>

                {/* Submit CTA */}
                <div className="pt-4">
                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    loading={submitting}
                    className="w-full text-base"
                  >
                    Confirm & Book Appointment (₹{service.price})
                  </Button>
                  <p className="text-[11px] text-center text-slate-400 mt-2">
                    Pay after service completion via Cash or UPI. No advance payment required.
                  </p>
                </div>
              </form>
            </div>
          </div>

          {/* Booking Summary Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4 pb-2 border-b border-slate-100">
                Booking Summary
              </h2>

              <div className="space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-base font-bold text-slate-900">{service.name}</h3>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-50 text-emerald-800 border border-emerald-100">
                      {service.category}
                    </span>
                  </div>
                  <span className="text-lg font-black text-slate-900">₹{service.price}</span>
                </div>

                <div className="flex items-center gap-2 text-xs text-slate-500 pt-2">
                  <Clock size={14} className="text-slate-400" />
                  <span>Estimated Duration: {service.duration}</span>
                </div>

                {service.features && service.features.length > 0 && (
                  <div className="pt-3 border-t border-slate-100">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
                      Highlights:
                    </p>
                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {service.features.map((feat, idx) => (
                        <li key={idx} className="flex items-center gap-2">
                          <CheckCircle size={14} className="text-emerald-500 shrink-0" />
                          <span>{feat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="mt-6 pt-4 border-t border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="flex justify-between">
                  <span>Item Total</span>
                  <span>₹{service.price}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-medium">
                  <span>Convenience Fee</span>
                  <span>FREE</span>
                </div>
                <div className="flex justify-between text-base font-black text-slate-900 pt-2 border-t border-slate-100">
                  <span>Amount Payable</span>
                  <span>₹{service.price}</span>
                </div>
              </div>
            </div>

            {/* Safety Guarantee card */}
            <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-5 text-emerald-900 space-y-2">
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} className="text-emerald-700" />
                <h4 className="text-xs font-bold uppercase tracking-wider">
                  NivaSeva Assurance
                </h4>
              </div>
              <p className="text-xs leading-relaxed text-emerald-800">
                Every booking comes with 30-day post-service warranty, certified technicians, and
                contactless digital payments upon job satisfaction.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookService;
